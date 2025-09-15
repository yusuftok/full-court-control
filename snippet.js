import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const Snippet = () => (_jsx(_Fragment, { children: (() => {
        const all = getWbsTasks(taskDepth);
        const today = new Date(nowMs);
        const filtered = all.filter(m => {
            if (!msState || msState === 'all')
                return true;
            const due = new Date(m.dueDate);
            const daysToDue = Math.ceil((due.getTime() - today.getTime()) / 86400000);
            const isOverdue = (m.actualDate
                ? new Date(m.actualDate) > due
                : today > due) && m.progress < 100;
            const isUpcoming = daysToDue >= 0 &&
                (msRange != null
                    ? daysToDue <= msRange
                    : daysToDue <= 14) &&
                m.progress < 100;
            if (msState === 'overdue')
                return isOverdue;
            if (msState === 'upcoming')
                return isUpcoming;
            if (msState === 'blocked' ||
                msState === 'blocking' ||
                msState === 'blockedRisk' ||
                msState === 'blockRisk') {
                // reconstruct helpers aligned with toolbar
                const byId = new Map(all.map(x => [x.id, x]));
                const startMsOf = (t) => new Date(t.startDate).getTime();
                const fcEndMsOf = (t) => t.actualDate
                    ? new Date(t.actualDate).getTime()
                    : t.forecastDate
                        ? new Date(t.forecastDate).getTime()
                        : new Date(t.dueDate).getTime();
                const isBlocked = (t) => {
                    if (t.progress >= 100)
                        return false;
                    if (startMsOf(t) >= nowMs)
                        return false;
                    for (const pid of t.dependsOn) {
                        const p = byId.get(pid);
                        if (!p)
                            continue;
                        if (!p.actualDate ||
                            new Date(p.actualDate).getTime() > nowMs)
                            return true;
                    }
                    return false;
                };
                const isBlocking = (t) => {
                    if (!((t.actualDate
                        ? new Date(t.actualDate) > due
                        : today > due) && t.progress < 100))
                        return false;
                    for (const sid of t.blocks) {
                        const s = byId.get(sid);
                        if (!s)
                            continue;
                        if (startMsOf(s) < nowMs)
                            return true;
                    }
                    return false;
                };
                const isBlockedRisk = (t) => {
                    if (startMsOf(t) <= nowMs)
                        return false;
                    for (const pid of t.dependsOn) {
                        const p = byId.get(pid);
                        if (!p)
                            continue;
                        if (fcEndMsOf(p) > startMsOf(t))
                            return true;
                    }
                    return false;
                };
                const isBlockRisk = (t) => {
                    if (fcEndMsOf(t) <= new Date(t.dueDate).getTime())
                        return false;
                    for (const sid of t.blocks) {
                        const s = byId.get(sid);
                        if (!s)
                            continue;
                        if (startMsOf(s) > nowMs &&
                            fcEndMsOf(t) > startMsOf(s))
                            return true;
                    }
                    return false;
                };
                if (msState === 'blocked')
                    return isBlocked(m);
                if (msState === 'blocking')
                    return isBlocking(m);
                if (msState === 'blockedRisk')
                    return isBlockedRisk(m);
                if (msState === 'blockRisk')
                    return isBlockRisk(m);
            }
            if (msState === 'critical' || msState === 'risky') {
                if (isOverdue)
                    return false; // overdue dominates
                if (m.progress >= 100)
                    return false;
                const start = simple?.startDate
                    ? new Date(simple.startDate).getTime()
                    : 0;
                const dueMs = due.getTime();
                const fcMs = (m.forecastDate ? new Date(m.forecastDate) : due).getTime();
                const plannedDur = Math.max(1, dueMs - start);
                const forecastDur = Math.max(1, fcMs - start);
                const spiMs = plannedDur / forecastDur;
                if (msState === 'critical')
                    return spiMs < T.SPI.risky;
                return spiMs >= T.SPI.risky && spiMs < T.SPI.good;
            }
            return true;
        });
        // Sort by earliest start first
        filtered.sort((a, b) => {
            const sa = new Date(a.startDate).getTime();
            const sb = new Date(b.startDate).getTime();
            if (sa !== sb)
                return sa - sb;
            // same start → tie-break by due date, then name for stability
            const da = new Date(a.dueDate).getTime();
            const db = new Date(b.dueDate).getTime();
            if (da !== db)
                return da - db;
            return a.name.localeCompare(b.name, 'tr');
        });
        return filtered.map(m => {
            // Build per-row dependency insights
            const byId = new Map(all.map(x => [x.id, x]));
            const startMsOf = (t) => new Date(t.startDate).getTime();
            const fcEndMsOf = (t) => t.actualDate
                ? new Date(t.actualDate).getTime()
                : t.forecastDate
                    ? new Date(t.forecastDate).getTime()
                    : new Date(t.dueDate).getTime();
            const unfinishedPredecessors = m.dependsOn
                .map(id => byId.get(id))
                .filter((p) => !!p &&
                (!p.actualDate ||
                    new Date(p.actualDate).getTime() > nowMs));
            const blockingSuccessors = m.progress >= 100
                ? []
                : m.blocks
                    .map(id => byId.get(id))
                    .filter((s) => !!s && startMsOf(s) < nowMs);
            const blockedRiskPreds = m.dependsOn
                .map(id => byId.get(id))
                .filter((p) => !!p &&
                startMsOf(m) > nowMs &&
                fcEndMsOf(p) > startMsOf(m));
            const blockRiskSuccs = m.blocks
                .map(id => byId.get(id))
                .filter((s) => !!s &&
                startMsOf(s) > nowMs &&
                fcEndMsOf(m) > startMsOf(s));
            const baseFocusId = m.id.split('-p')[0];
            const hasUnfinishedPredOther = unfinishedPredecessors.some(p => baseFocusId !== p.id.split('-p')[0]);
            const hasBlockingSuccOther = blockingSuccessors.some(s => baseFocusId !== s.id.split('-p')[0]);
            const hasBlockedRiskPredOther = blockedRiskPreds.some(p => baseFocusId !== p.id.split('-p')[0]);
            const hasBlockRiskSuccOther = blockRiskSuccs.some(s => baseFocusId !== s.id.split('-p')[0]);
            const due = new Date(m.dueDate);
            let fc = m.forecastDate
                ? new Date(m.forecastDate)
                : undefined;
            const delta = m.slipDays ??
                (fc
                    ? Math.round((fc.getTime() - due.getTime()) / 86400000)
                    : 0);
            const daysToDue = Math.ceil((due.getTime() - nowMs) / 86400000);
            const statusColor = m.progress >= 100
                ? 'green'
                : delta > 0
                    ? 'red'
                    : daysToDue <= 14
                        ? 'yellow'
                        : 'blue';
            const colorClasses = statusColor === 'green'
                ? 'bg-green-100 text-green-700'
                : statusColor === 'red'
                    ? 'bg-red-100 text-red-700'
                    : statusColor === 'yellow'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700';
            const start = simple?.startDate
                ? new Date(simple.startDate).getTime()
                : 0;
            const end = simple?.endDate
                ? new Date(simple.endDate).getTime()
                : 0;
            const duePct = start && end && end > start
                ? Math.min(100, Math.max(0, ((due.getTime() - start) / (end - start)) *
                    100))
                : 0;
            if (!fc && simple) {
                const spi = simple.earnedValue > 0
                    ? simple.earnedValue /
                        Math.max(simple.plannedValue, 1)
                    : 1;
                const plannedDur = Math.max(1, due.getTime() - start);
                const estDur = plannedDur / (spi || 1);
                fc = new Date(start + estDur);
            }
            // Eğer iş tamamlanmamışsa tahmini bitiş bugün(=nowMs) öncesinde olamaz
            if (!m.actualDate &&
                (m.progress ?? 0) < 100 &&
                fc &&
                fc.getTime() < nowMs) {
                // En azından bugün+1 gün olarak ayarla (daha okunaklı görünüm için)
                fc = new Date(nowMs + 24 * 3600 * 1000);
            }
            const isCompleted = (m.progress ?? 0) >= 100 ||
                m.status === 'completed' ||
                !!m.actualDate;
            const actual = m.actualDate
                ? new Date(m.actualDate)
                : undefined;
            const fcEff = isCompleted
                ? m.actualDate
                    ? actual
                    : fc
                : fc;
            const fcPct = fcEff && start && end && end > start
                ? Math.min(100, Math.max(0, ((fcEff.getTime() - start) /
                    (end - start)) *
                    100))
                : duePct;
            const baseDate = fcEff ?? due;
            const drift = Math.round((baseDate.getTime() - due.getTime()) / 86400000);
            // Task window relative to project timeline
            const taskStartPct = (() => {
                if (!(start && end && end > start))
                    return 0;
                const s = new Date(m.startDate).getTime();
                return Math.min(100, Math.max(0, ((s - start) / (end - start)) * 100));
            })();
            // label positions: push to exact edges when very close to 0%/100%
            const planPctLabel = duePct > 99.2
                ? 100
                : duePct < 0.8
                    ? 0
                    : Math.min(97, Math.max(3, duePct));
            const fcPctLabel = fcPct > 99.2
                ? 100
                : fcPct < 0.8
                    ? 0
                    : Math.min(97, Math.max(3, fcPct));
            const progressAbsPct = Math.max(0, Math.min(planPctLabel, fcPctLabel) - taskStartPct);
            // today overlay for overdue visualization
            const todayPct = (() => {
                if (!(start && end && end > start))
                    return duePct;
                const t = Math.min(100, Math.max(0, ((nowMs - start) / (end - start)) * 100));
                return t;
            })();
            // color for forecast marker handled via drift check inline
            // Consider markers visually "close" when within ~2.5% of width
            const markersClose = Math.abs(fcPctLabel - planPctLabel) < 2.5;
            const planAnchor = planPctLabel > 92
                ? 'right'
                : planPctLabel < 8
                    ? 'left'
                    : 'center';
            const fcAnchor = fcPctLabel > 92
                ? 'right'
                : fcPctLabel < 8
                    ? 'left'
                    : 'center';
            const startAnchor = taskStartPct > 92
                ? 'right'
                : taskStartPct < 8
                    ? 'left'
                    : 'center';
            // Milestone-specific SPI using start→due vs start→forecast durations
            // spiMs = plannedDuration / forecastDuration
            // If forecast earlier than due -> spiMs > 1 (treat as green)
            const plannedDurMs = start && due ? Math.max(1, due.getTime() - start) : 1;
            const forecastDurMs = start && fcEff
                ? Math.max(1, fcEff.getTime() - start)
                : plannedDurMs;
            const spiMs = plannedDurMs / Math.max(1, forecastDurMs);
            // Base color strictly by milestone SPI thresholds (tolerance respected)
            const spiBaseColor = spiMs >= T.SPI.good
                ? 'bg-green-600'
                : spiMs >= T.SPI.risky
                    ? 'bg-orange-500'
                    : 'bg-red-600';
            // Future/Delta rendering between Plan and Forecast (only future part)
            const isLate = fcPct > duePct;
            const dashedStart = Math.max(planPctLabel, todayPct);
            const dashedSegWidth = Math.max(0, fcPctLabel - dashedStart);
            // Solid continuation between plan→today for unfinished (avoid grey gap)
            const overdueSolidWidth = Math.max(0, todayPct - planPctLabel);
            // Tooltip positioning: if markers are far, show Plan above and Forecast below; if close, only Forecast shows combined tooltip below
            const planTipPos = !markersClose
                ? {
                    bottom: '100%',
                    marginBottom: 8,
                }
                : {
                    top: '100%',
                    marginTop: 8,
                };
            const fcTipPos = {
                top: '100%',
                marginTop: 8,
            };
            const startTipPos = {
                bottom: '100%',
                marginBottom: 8,
            };
            const isSameDay = (a, b) => a.toDateString() === b.toDateString();
            const hidePlanMarker = (() => {
                const fcDate = actual ?? fcEff;
                return !!fcDate && isSameDay(due, fcDate);
            })();
            return (_jsxs("div", { className: "p-3 rounded-lg bg-muted/40 border", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsxs("div", { className: "flex items-center gap-2 min-w-0 cursor-default", children: [_jsx("div", { className: cn('size-8 rounded-full flex items-center justify-center', colorClasses), children: _jsx(Calendar, { className: "size-4" }) }), _jsx("h4", { className: "font-medium truncate flex-1 min-w-0", children: _jsx("span", { className: "block max-w-full truncate", title: taskPathLabels(m.id).full, children: taskPathLabels(m.id).short }) }), m.owner && (_jsx("span", { className: "px-1.5 py-0.5 text-[11px] rounded bg-secondary text-foreground/80", children: ownerLabel(m.owner) }))] }) }), _jsx(TooltipContent, { className: "max-w-[520px] p-0 z-50", sideOffset: 8, children: _jsx("pre", { className: "font-mono text-xs whitespace-pre bg-transparent p-2", children: asciiPath(m.id) }) })] }), _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [msState === 'blocked' &&
                                                hasUnfinishedPredOther && (_jsx("div", { className: "text-xs shrink-0", children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx("button", { className: "underline text-blue-600 hover:text-blue-700", onClick: () => {
                                                                    // record cards and open insight dialog
                                                                    const focus = m.id.split('-p')[0];
                                                                    const seen = new Set();
                                                                    const cards = [];
                                                                    for (const p of unfinishedPredecessors) {
                                                                        const other = p.id.split('-p')[0];
                                                                        if (other === focus)
                                                                            continue;
                                                                        if (seen.has(other))
                                                                            continue;
                                                                        seen.add(other);
                                                                        const fOwner = analytics.ownership.get(focus);
                                                                        const oOwner = analytics.ownership.get(other);
                                                                        cards.push({
                                                                            title: 'Neden Bloklu?',
                                                                            details: `${wbsMaps.toName(other)} işi tamamlanmadı`,
                                                                            ascii: asciiBranchMarked(focus, other, 'blocked', {
                                                                                // blocked: cause is other (predecessor), effect is focus
                                                                                causeLabel: p.name,
                                                                                effectLabel: m.name,
                                                                                causeLeafId: wbsMaps.firstLeafUnder(other) || undefined,
                                                                                effectLeafId: wbsMaps.firstLeafUnder(focus) || undefined,
                                                                            }),
                                                                            focusName: wbsMaps.toName(focus),
                                                                            otherName: wbsMaps.toName(other),
                                                                            rel: 'blocked',
                                                                            focusOwner: fOwner
                                                                                ? subsNameMap.get(fOwner) || fOwner
                                                                                : null,
                                                                            otherOwner: oOwner
                                                                                ? subsNameMap.get(oOwner) || oOwner
                                                                                : null,
                                                                            causeLabel: p.name,
                                                                            effectLabel: m.name,
                                                                            focusLabel: m.name,
                                                                            otherLabel: p.name,
                                                                        });
                                                                    }
                                                                    if (cards.length > 0) {
                                                                        setInsightCards(cards);
                                                                        setInsightIndex(0);
                                                                        setInsightOpen(true);
                                                                    }
                                                                }, children: "Neden Bloklu?" }) }), _jsx(TooltipContent, { children: "Nedenleri g\u00F6r" })] }) })), msState === 'blocking' &&
                                                hasBlockingSuccOther && (_jsx("div", { className: "text-xs shrink-0", children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx("button", { className: "underline text-rose-600 hover:text-rose-700", onClick: () => {
                                                                    // record cards and open insight dialog
                                                                    const focus = m.id.split('-p')[0];
                                                                    const seen = new Set();
                                                                    const cards = [];
                                                                    for (const s of blockingSuccessors) {
                                                                        const other = s.id.split('-p')[0];
                                                                        if (other === focus)
                                                                            continue;
                                                                        if (seen.has(other))
                                                                            continue;
                                                                        seen.add(other);
                                                                        const fOwner = analytics.ownership.get(focus);
                                                                        const oOwner = analytics.ownership.get(other);
                                                                        cards.push({
                                                                            title: 'Neyi Blokluyor?',
                                                                            details: `${wbsMaps.toName(other)} başlatılamıyor`,
                                                                            ascii: asciiBranchMarked(focus, other, 'blocking', {
                                                                                causeLabel: m.name,
                                                                                effectLabel: s.name,
                                                                                causeLeafId: wbsMaps.firstLeafUnder(focus) || undefined,
                                                                                effectLeafId: wbsMaps.firstLeafUnder(other) || undefined,
                                                                            }),
                                                                            focusName: wbsMaps.toName(focus),
                                                                            otherName: wbsMaps.toName(other),
                                                                            rel: 'blocking',
                                                                            focusOwner: fOwner
                                                                                ? subsNameMap.get(fOwner) || fOwner
                                                                                : null,
                                                                            otherOwner: oOwner
                                                                                ? subsNameMap.get(oOwner) || oOwner
                                                                                : null,
                                                                            causeLabel: m.name,
                                                                            effectLabel: s.name,
                                                                            focusLabel: m.name,
                                                                            otherLabel: s.name,
                                                                        });
                                                                    }
                                                                    if (cards.length > 0) {
                                                                        setInsightCards(cards);
                                                                        setInsightIndex(0);
                                                                        setInsightOpen(true);
                                                                    }
                                                                }, children: "Neyi Blokluyor?" }) }), _jsx(TooltipContent, { children: "Etkiledi\u011Fi i\u015Fler" })] }) })), msState === 'blockedRisk' &&
                                                hasBlockedRiskPredOther && (_jsx("div", { className: "text-xs shrink-0", children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx("button", { className: "underline text-amber-700 hover:text-amber-800", onClick: () => {
                                                                    // record cards and open insight dialog
                                                                    const focus = m.id.split('-p')[0];
                                                                    const seen = new Set();
                                                                    const cards = [];
                                                                    for (const p of blockedRiskPreds) {
                                                                        const other = p.id.split('-p')[0];
                                                                        if (other === focus)
                                                                            continue;
                                                                        if (seen.has(other))
                                                                            continue;
                                                                        seen.add(other);
                                                                        const fOwner = analytics.ownership.get(focus);
                                                                        const oOwner = analytics.ownership.get(other);
                                                                        cards.push({
                                                                            title: 'Neden Bloklanabilir?',
                                                                            details: `${wbsMaps.toName(other)} forecast bitişi bu işin planlanan başlangıcını aşıyor`,
                                                                            ascii: asciiBranchMarked(focus, other, 'blockedRisk', {
                                                                                // blockedRisk: cause is other (pred), effect is focus
                                                                                causeLabel: p.name,
                                                                                effectLabel: m.name,
                                                                                causeLeafId: wbsMaps.firstLeafUnder(other) || undefined,
                                                                                effectLeafId: wbsMaps.firstLeafUnder(focus) || undefined,
                                                                            }),
                                                                            focusName: wbsMaps.toName(focus),
                                                                            otherName: wbsMaps.toName(other),
                                                                            rel: 'blockedRisk',
                                                                            focusOwner: fOwner
                                                                                ? subsNameMap.get(fOwner) || fOwner
                                                                                : null,
                                                                            otherOwner: oOwner
                                                                                ? subsNameMap.get(oOwner) || oOwner
                                                                                : null,
                                                                            causeLabel: p.name,
                                                                            effectLabel: m.name,
                                                                        });
                                                                    }
                                                                    if (cards.length > 0) {
                                                                        setInsightCards(cards);
                                                                        setInsightIndex(0);
                                                                        setInsightOpen(true);
                                                                    }
                                                                }, children: "Neden Bloklanabilir?" }) }), _jsx(TooltipContent, { children: "\u00D6ng\u00F6r\u00FClen nedenler" })] }) })), msState === 'blockRisk' &&
                                                hasBlockRiskSuccOther && (_jsx("div", { className: "text-xs shrink-0", children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx("button", { className: "underline text-rose-700 hover:text-rose-800", onClick: () => {
                                                                    // record cards and open insight dialog
                                                                    const focus = m.id.split('-p')[0];
                                                                    const seen = new Set();
                                                                    const cards = [];
                                                                    for (const s of blockRiskSuccs) {
                                                                        const other = s.id.split('-p')[0];
                                                                        if (other === focus)
                                                                            continue;
                                                                        if (seen.has(other))
                                                                            continue;
                                                                        seen.add(other);
                                                                        const fOwner = analytics.ownership.get(focus);
                                                                        const oOwner = analytics.ownership.get(other);
                                                                        cards.push({
                                                                            title: 'Neyi Bloklayabilir?',
                                                                            details: `${wbsMaps.toName(other)} planlanan başlangıcını aşma riski`,
                                                                            ascii: asciiBranchMarked(focus, other, 'blockRisk', {
                                                                                // blockRisk: cause is focus, effect is other
                                                                                causeLabel: m.name,
                                                                                effectLabel: s.name,
                                                                                causeLeafId: wbsMaps.firstLeafUnder(focus) || undefined,
                                                                                effectLeafId: wbsMaps.firstLeafUnder(other) || undefined,
                                                                            }),
                                                                            focusName: wbsMaps.toName(focus),
                                                                            otherName: wbsMaps.toName(other),
                                                                            rel: 'blockRisk',
                                                                            focusOwner: fOwner
                                                                                ? subsNameMap.get(fOwner) || fOwner
                                                                                : null,
                                                                            otherOwner: oOwner
                                                                                ? subsNameMap.get(oOwner) || oOwner
                                                                                : null,
                                                                            causeLabel: m.name,
                                                                            effectLabel: s.name,
                                                                        });
                                                                    }
                                                                    if (cards.length > 0) {
                                                                        setInsightCards(cards);
                                                                        setInsightIndex(0);
                                                                        setInsightOpen(true);
                                                                    }
                                                                }, children: "Neyi Bloklayabilir?" }) }), _jsx(TooltipContent, { children: "Riskli ard\u0131llar" })] }) }))] }), typeof m.blockers === 'number' &&
                                        m.blockers > 0 && (_jsxs("div", { className: "text-xs text-muted-foreground", children: ["Engelleyici: ", m.blockers] }))] })] }), _jsx("div", { className: "text-right pr-24", children: _jsxs("div", { className: cn('text-sm font-semibold', drift > 0
                                ? 'text-red-600'
                                : drift < 0
                                    ? 'text-green-700'
                                    : 'text-muted-foreground'), children: [drift >= 0 ? '+' : '', drift, "g"] }) })] }, m.id)
                ,
                    _jsx("div", { className: "mt-2", children: _jsx("div", { className: "relative group group/msrow", children: _jsxs("div", { className: "relative h-2 w-full", children: [_jsxs("div", { className: "absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden", children: [_jsx("div", { className: cn('absolute inset-y-0 rounded-full', spiBaseColor), style: {
                                                    left: `${taskStartPct}%`,
                                                    width: `${isCompleted ? Math.max(0, fcPctLabel - taskStartPct) : progressAbsPct}%`,
                                                } }), !isCompleted && overdueSolidWidth > 0 && (_jsx("div", { className: cn('absolute inset-y-0 rounded-none', spiBaseColor), style: {
                                                    left: `${planPctLabel}%`,
                                                    width: `${overdueSolidWidth}%`,
                                                } })), !isCompleted && dashedSegWidth > 0 && (_jsx("div", { className: "absolute inset-y-0 left-0 z-10", style: {
                                                    left: `${dashedStart}%`,
                                                    width: `${Math.max(0, fcPctLabel - dashedStart)}%`,
                                                    // Denser colored portion: thicker color band, thinner gap
                                                    backgroundImage: isLate
                                                        ? 'repeating-linear-gradient(135deg, rgba(239,68,68,0.9) 0, rgba(239,68,68,0.9) 12px, rgba(239,68,68,0.0) 12px, rgba(239,68,68,0.0) 16px)'
                                                        : 'repeating-linear-gradient(135deg, rgba(22,163,74,0.9) 0, rgba(22,163,74,0.9) 12px, rgba(22,163,74,0.0) 12px, rgba(22,163,74,0.0) 16px)',
                                                } }))] }), _jsx("div", { className: "absolute", style: {
                                            left: `calc(${taskStartPct}% - 6px)`,
                                            top: -6,
                                        }, children: _jsxs("div", { className: "relative group/marker z-50", onMouseEnter: () => setHoveredMs(`start:${m.id}`), onMouseLeave: () => setHoveredMs(null), "aria-label": "Ba\u015Flang\u0131\u00E7", children: [_jsx("div", { className: "size-3.5 rounded-full bg-gray-200 border border-gray-500 shadow-md ring-2 ring-white dark:ring-gray-900" }), _jsxs("div", { className: cn('absolute z-50 px-2 py-1 rounded-md border bg-popover text-popover-foreground text-xs shadow pointer-events-none whitespace-nowrap', hoveredMs === `start:${m.id}`
                                                        ? 'opacity-100'
                                                        : 'opacity-0', startAnchor === 'center' &&
                                                        'left-1/2 -translate-x-1/2', startAnchor === 'left' && 'left-0', startAnchor === 'right' && 'right-0'), style: startTipPos, children: ["Ba\u015Flang\u0131\u00E7:", ' ', new Date(m.startDate).toLocaleDateString('tr-TR')] })] }) }), !hidePlanMarker && (_jsx("div", { className: "absolute", style: {
                                            left: `calc(${planPctLabel}% - 6px)`,
                                            top: markersClose ? -10 : -6,
                                        }, children: _jsxs("div", { className: "relative group/marker z-50", onMouseEnter: () => setHoveredMs(`plan:${m.id}`), onMouseLeave: () => setHoveredMs(null), children: [_jsx("div", { className: "size-3.5 rounded-full bg-gray-300 border border-gray-500 shadow-md ring-2 ring-white dark:ring-gray-900" }), _jsxs("div", { className: cn('absolute z-50 px-2 py-1 rounded-md border bg-popover text-popover-foreground text-xs shadow pointer-events-none whitespace-nowrap', hoveredMs === `plan:${m.id}`
                                                        ? 'opacity-100'
                                                        : 'opacity-0', planAnchor === 'center' &&
                                                        'left-1/2 -translate-x-1/2', planAnchor === 'left' && 'left-0', planAnchor === 'right' && 'right-0'), style: planTipPos, children: ["Planlanan Biti\u015F:", ' ', due.toLocaleDateString('tr-TR')] })] }) })), fc && (_jsx("div", { className: "absolute", style: {
                                            left: `calc(${fcPctLabel}% - 6px)`,
                                            top: markersClose ? undefined : -6,
                                            bottom: markersClose ? -10 : undefined,
                                        }, children: _jsxs("div", { className: "relative group/marker z-50", onMouseEnter: () => setHoveredMs(`fc:${m.id}`), onMouseLeave: () => setHoveredMs(null), children: [_jsx("div", { className: cn('size-3.5 rounded-full border shadow-md ring-2 ring-white dark:ring-gray-900', drift > 0
                                                        ? 'bg-red-600 border-red-700'
                                                        : 'bg-emerald-600 border-emerald-700') }), _jsx("div", { className: cn('absolute z-50 px-2 py-1 rounded-md border bg-popover text-popover-foreground text-xs shadow pointer-events-none whitespace-nowrap', hoveredMs === `fc:${m.id}` ||
                                                        (markersClose &&
                                                            hoveredMs === `combo:${m.id}`)
                                                        ? 'opacity-100'
                                                        : 'opacity-0', fcAnchor === 'center' &&
                                                        'left-1/2 -translate-x-1/2', fcAnchor === 'left' && 'left-0', fcAnchor === 'right' && 'right-0'), style: fcTipPos, children: isCompleted ? (_jsxs("span", { children: ["Ger\u00E7ekle\u015Fen Biti\u015F:", ' ', fc.toLocaleDateString('tr-TR')] })) : (_jsxs("span", { children: ["\u00D6ng\u00F6r\u00FClen Biti\u015F:", ' ', fc.toLocaleDateString('tr-TR')] })) })] }) }))] }) }) }));
        });
    }) })), div;
 >
;
();
 > ;
