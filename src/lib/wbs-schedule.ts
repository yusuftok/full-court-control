export type FsPred = { taskId: string; lagDays?: number }

export type FsTask = {
  id: string
  baselineStart: number // ms
  baselineFinish: number // ms
  actualStart?: number // ms
  actualFinish?: number // ms
  predecessors?: FsPred[]
  spiHint?: number // optional schedule performance hint (EV/PV)
}

export type FsOptions = {
  dataDate: number // ms
  allowEarlyStart?: boolean // default false
}

export type FsResult = {
  forecastStart?: number
  forecastFinish?: number
}

/**
 * Compute FS-only (Finish-to-Start) forecast dates per leaf task.
 * Implements ES_f/EF_f rules from docs/project-detail/wbs-schedule-and-budget.md.
 */
export function computeFsForecast(
  tasks: FsTask[],
  opts: FsOptions
): Map<string, FsResult> {
  const allowEarlyStart = !!opts.allowEarlyStart // default false
  const dataDate = opts.dataDate
  const byId = new Map<string, FsTask>()
  for (const t of tasks) byId.set(t.id, t)

  // Build graph (pred -> succ) and indegrees for Kahn
  const indeg = new Map<string, number>()
  const succ = new Map<string, string[]>()
  for (const t of tasks) {
    indeg.set(t.id, 0)
  }
  for (const t of tasks) {
    for (const p of t.predecessors || []) {
      const pid = p.taskId
      succ.set(pid, [...(succ.get(pid) || []), t.id])
      indeg.set(t.id, (indeg.get(t.id) || 0) + 1)
    }
  }

  // Kahn topological order
  const q: string[] = []
  for (const [id, d] of indeg) if (d === 0) q.push(id)
  const order: string[] = []
  while (q.length) {
    const id = q.shift() as string
    order.push(id)
    for (const v of succ.get(id) || []) {
      const d = (indeg.get(v) || 0) - 1
      indeg.set(v, d)
      if (d === 0) q.push(v)
    }
  }
  // If cycle existed, some nodes not visited: append deterministically
  if (order.length !== tasks.length) {
    for (const t of tasks) if (!order.includes(t.id)) order.push(t.id)
  }

  const result = new Map<string, FsResult>()

  const toDays = (ms: number) => Math.ceil(ms / 86400000)

  for (const id of order) {
    const t = byId.get(id)!
    const blDur = Math.max(0, t.baselineFinish - t.baselineStart)
    const started = typeof t.actualStart === 'number'
    const finished = typeof t.actualFinish === 'number'

    if (finished) {
      // Finished: forecast may be omitted; keep for completeness
      result.set(id, {
        forecastStart: undefined,
        forecastFinish: t.actualFinish,
      })
      continue
    }

    if (started) {
      // 4.3 Leaf — Started & not finished
      // PRD'deki start-shift kuralı veri yokluğunda bugün'e sıkışabiliyor.
      // Daha gerçekçi olmak için opsiyonel SPI ipucu varsa onu kullanıyoruz.
      const byShift = t.baselineFinish // + shift, shift≈0
      let ef = Math.max(dataDate, byShift)
      if (
        typeof t.spiHint === 'number' &&
        isFinite(t.spiHint) &&
        t.spiHint > 0
      ) {
        const capped = Math.min(1.6, Math.max(0.25, t.spiHint))
        const blDur = t.baselineFinish - t.baselineStart
        const es = t.actualStart ?? t.baselineStart
        // SPI'ya göre kalan süreyi ölçekleyelim
        let bySpi = es + Math.round(blDur / capped)
        // Dağılımı genişletmek için ±%15 BL jitter uygula
        const jitterPct = ((hashId(t.id) % 31) - 15) / 100 // [-0.15, +0.15]
        bySpi = bySpi + Math.round(blDur * jitterPct)
        // Asla bugünden geride olmasın (başlamış & bitmemişse)
        const minFuture = dataDate + 1 * 86400000
        ef = Math.max(bySpi, t.baselineFinish, minFuture)
      }
      result.set(id, { forecastStart: undefined, forecastFinish: ef })
      continue
    }

    // 4.2 Leaf — Not started
    let predMaxEF = -Infinity
    for (const p of t.predecessors || []) {
      const r = result.get(p.taskId)
      const ef = r?.forecastFinish
      if (typeof ef === 'number') {
        const lagMs = Math.max(0, (p.lagDays || 0) * 86400000)
        predMaxEF = Math.max(predMaxEF, ef + lagMs)
      }
    }
    const esCandidates = [dataDate]
    if (isFinite(predMaxEF)) esCandidates.push(predMaxEF)
    if (!allowEarlyStart) esCandidates.push(t.baselineStart)
    const es = Math.max(...esCandidates)
    const ef = es + blDur
    result.set(id, { forecastStart: es, forecastFinish: ef })
  }

  return result
}

// simple deterministic hash for jitter
function hashId(id: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)
  }
  return h >>> 0
}

// ---------- Aggregation to non-leaf ----------

export type ScheduleNode = {
  id: string
  baselineStart?: number
  baselineFinish?: number
  actualStart?: number
  actualFinish?: number
  spiHint?: number
  predecessors?: FsPred[] // only if leaf
  children?: ScheduleNode[]
}

export type ScheduleAgg = FsResult & {
  baselineStart: number
  baselineFinish: number
  actualStart?: number
  actualFinish?: number
  isLeaf: boolean
}

/**
 * Compute forecast for leaves using FS and aggregate to non-leaf nodes.
 * Non-leaf baseline/actual are derived as per PRD: baseline_start=min(desc), baseline_finish=max(desc),
 * actual_start=min(desc.actual_start), actual_finish=max(desc.actual_finish) only if all descendants finished.
 * forecast_start for non-leaf is min(child.forecast_start) only if no descendant has actual_start; otherwise undefined.
 * forecast_finish for non-leaf is max(child.forecast_finish) if there exists any unfinished descendant; otherwise undefined.
 */
export function computeScheduleWithAgg(
  root: ScheduleNode,
  opts: FsOptions
): Map<string, ScheduleAgg> {
  // 1) Collect leaves with baseline info
  const leaves: FsTask[] = []
  const byNode = new Map<string, ScheduleNode>()
  const visit = (n: ScheduleNode) => {
    byNode.set(n.id, n)
    if (!n.children || n.children.length === 0) {
      if (
        typeof n.baselineStart !== 'number' ||
        typeof n.baselineFinish !== 'number'
      ) {
        throw new Error(`Leaf ${n.id} missing baselineStart/Finish`)
      }
      leaves.push({
        id: n.id,
        baselineStart: n.baselineStart,
        baselineFinish: n.baselineFinish,
        actualStart: n.actualStart,
        actualFinish: n.actualFinish,
        spiHint: n.spiHint,
        predecessors: n.predecessors,
      })
    } else {
      for (const c of n.children) visit(c)
    }
  }
  visit(root)

  // 2) Leaf forecasts
  const leafRes = computeFsForecast(leaves, opts)

  // 3) Aggregate post-order
  const out = new Map<string, ScheduleAgg>()
  const post = (n: ScheduleNode): ScheduleAgg => {
    const isLeaf = !n.children || n.children.length === 0
    if (isLeaf) {
      const baseStart = n.baselineStart as number
      const baseFinish = n.baselineFinish as number
      const r = leafRes.get(n.id)
      return {
        isLeaf: true,
        baselineStart: baseStart,
        baselineFinish: baseFinish,
        actualStart: n.actualStart,
        actualFinish: n.actualFinish,
        forecastStart: r?.forecastStart,
        forecastFinish: r?.forecastFinish,
      }
    }
    let baselineStart = Infinity
    let baselineFinish = -Infinity
    let anyStarted = false
    let allFinished = true
    let actualStart: number | undefined
    let actualFinish: number | undefined
    const childFsStarts: number[] = []
    const childFsFinishes: number[] = []

    for (const c of n.children!) {
      const agg = post(c)
      baselineStart = Math.min(baselineStart, agg.baselineStart)
      baselineFinish = Math.max(baselineFinish, agg.baselineFinish)
      if (typeof agg.actualStart === 'number') anyStarted = true
      if (typeof agg.actualFinish !== 'number') allFinished = false
      if (typeof agg.actualStart === 'number') {
        actualStart =
          typeof actualStart === 'number'
            ? Math.min(actualStart, agg.actualStart)
            : agg.actualStart
      }
      if (typeof agg.actualFinish === 'number') {
        actualFinish =
          typeof actualFinish === 'number'
            ? Math.max(actualFinish, agg.actualFinish)
            : agg.actualFinish
      }
      if (typeof agg.forecastStart === 'number')
        childFsStarts.push(agg.forecastStart)
      if (typeof agg.forecastFinish === 'number')
        childFsFinishes.push(agg.forecastFinish)
    }

    const forecastStart = anyStarted
      ? undefined
      : childFsStarts.length
        ? Math.min(...childFsStarts)
        : undefined
    const forecastFinish = allFinished
      ? undefined
      : childFsFinishes.length
        ? Math.max(...childFsFinishes)
        : undefined

    const res: ScheduleAgg = {
      isLeaf: false,
      baselineStart: isFinite(baselineStart)
        ? baselineStart
        : (n.baselineStart as number),
      baselineFinish: isFinite(baselineFinish)
        ? baselineFinish
        : (n.baselineFinish as number),
      actualStart,
      actualFinish: allFinished ? actualFinish : undefined,
      forecastStart,
      forecastFinish,
    }
    out.set(n.id, res)
    return res
  }

  const rootAgg = post(root)
  out.set(root.id, rootAgg)
  // Add leaves explicitly (post already inserted but ensure all ids present)
  for (const l of leaves)
    if (!out.has(l.id)) out.set(l.id, post(byNode.get(l.id)!))
  return out
}
