# Proje Detay – İş Maddeleri İnvariantları ve Deterministik Mock Üretimi

Bu doküman, proje detay sayfasındaki İş Maddeleri (WBS tabanlı görevler) için kullanılan mantıksal invariantları ve mock veri üretim mantığını açıklar. Amaç; filtreleri (Bloklanan, Bloklayan, Bloklanma Riski, Bloklama Riski) her zaman test edilebilir kılacak, deterministik ve kurallara uygun örnekler üretmektir.

## Terimler

- "Bitmiş" (completed): `progress === 100` veya `actualDate` atanmış iş.
- "Bitmemiş" (unfinished): `actualDate` yok ve `progress < 100`.
- "Başlamış": `startDate < now`.
- "Gelecekte başlar": `startDate > now`.
- "Gecikmiş": bitmemiş ve `today > dueDate`.
- `dependsOn`: bir işin öncüllerinin kimlikleri.
- `blocks`: bir işin ardıllarının kimlikleri (otomatik türetilir).

## Mantıksal Invariantlar (WBS‑Backed Schedule ile uyumlu)

1) Bitmiş bir iş, Bloklanan olamaz.
2) Bitmiş bir iş, Bloklayan olamaz.
3) Bloklanan: Başlamış (start < now) ve bitmemiş bir iş, en az bir bitmemiş (veya now’dan sonra biten) öncülü olduğu için ilerleyemiyorsa.
4) Bloklayan: Gecikmiş (due < now) ve bitmemiş bir iş, başlatılmış bir ardılını (start < now) beklettiği durumda.
5) Bloklanma Riski: Gelecekte başlayacak bir işin, bir öncülünün forecast bitişi bu işin başlangıcını aşıyorsa.
6) Bloklama Riski: Planlanan başlangıcı veri tarihinden (data_date) sonra olan bir işin forecast bitişi, gelecekte başlayacak bir ardılın başlangıcını aşıyorsa.
7) Öz‑nedensellik yok: Aynı WBS düğümü (baz id) hem sebep hem de sonuç olamaz.
   - Teknik olarak `base(id) = id.split('-p')[0]`. Herhangi bir `dependsOn`/`blocks` ilişkisi için `base(focus) !== base(other)` olmalıdır.
   - Bu kural hem veri üretiminde hem de görselleştirmede (rozet sırası, ASCII ağaç) uygulanır.
8) Dairesel bağımlılık yok: `dependsOn` ilişkileri bir DAG (Directed Acyclic Graph) oluşturur.
   - Yeni bir bağ eklenmeden önce `wouldCreateCycle(A depends B)` kontrolü yapılır; `B`'den `A`'ya mevcut bir yol varsa ekleme iptal edilir.
   - İstisna – Görünürde Döngü: İnceleme her zaman belirli bir kırılım derinliğinde yapıldığından, aynı iş kaleminin daha derin kırılımındaki alt kalemleri arasında (veya iki kardeş iş kaleminin daha derindeki alt kalemleri arasında) mantıklı bir öncül‑artçıl ilişkisi bulunabilir. Bu, bulunduğumuz seviyede bakıldığında “A ↔ B” gibi döngü havası verebilir. Seed, gerçek graf üzerinde döngü kurmaz; ancak Insight penceresinde kök→yaprak yolu ve bir alt seviye örnek düğüm gösterilerek kullanıcıya gerçek bağımlılığın daha aşağı seviyede olduğu açıklanır.

Bu kurallar hem sayaçlarda hem de liste filtrelerinde birebir uygulanır.

9) Proje başlangıcında en az bir görev başlar: Mock üretiminde, oluşturulan görevler arasında en erken başlama tarihi proje başlangıcı (`project.startDate`) olacak şekilde en az bir görev zorunlu kılınır. Bu, zaman çizelgesinde görsel bir referans/anchor sağlar ve “başlangıçla beraber başlayan” iş örneği her projede garanti edilir.

İlgili uygulama: `getWbsTasks` içinde görevler üretildikten sonra en erken başlayan görev belirlenir ve `startDate` değeri proje başlangıcına ayarlanır:

```ts
// Ensure at least one task starts exactly at project start (visual anchor)
if (tasks.length > 0) {
  let minIdx = 0
  for (let i = 1; i < startTimes.length; i++) {
    if (startTimes[i] < startTimes[minIdx]) minIdx = i
  }
  if (startTimes[minIdx] !== start) {
    tasks[minIdx].startDate = new Date(start).toISOString()
    startTimes[minIdx] = start
  }
}
```

9) WBS‑Backed Schedule uyumu:

- Bağımlılık türü FS (Finish‑to‑Start) ve yalnız **leaf** düğümler arasında tanımlanır; non‑leaf düzeyinde bağımlılıklar türetilir.
- Forecast, raporlama tarihine (data_date) göre hesaplanır; başlamamış leaf için `allow_early_start=false` politikası gereği forecast başlangıcı baseline’dan erken, dolayısıyla forecast bitişi baseline bitişinden erken olamaz.
- Başlamış ama bitmemiş leaf için “start‑shift” yaklaşımı kullanılır: `EF_f = max(data_date, baseline_finish + (actual_start - baseline_start))`. Mock üretiminde `actual_start ≈ baseline_start` varsayılarak en azından `EF_f ≥ max(data_date, baseline_finish)` sağlanır.
- Non‑leaf forecast değerleri çocuklardan türetilir: `forecast_finish = max(child.forecast_finish)`. Başlamamış non‑leaf için `forecast_start = min(child.forecast_start)`; bir çocuk başladıysa non‑leaf forecast_start gösterilmez.

Bu kurallar docs/project-detail/wbs-schedule-and-budget.md ile birebir uyumludur.

## Kilometre Taşı Özeti (Milestone Summary) İnvariantı

İlgili kod: `src/lib/mock-data.ts` içindeki `getSimpleProjects()` fonksiyonu.

Amaç: Proje genelindeki kilometre taşlarının özet sayıları (toplam, tamamlanan, yaklaşan, geciken, kalan) gerçeğe yakın ve deterministik olsun.

- Toplam: Proje süresine göre yılda ~8–10 adet üretilecek şekilde eşit aralıklarla dağıtılır.
- Tamamlanan: `completed = round(progress% * total)`.
- Yaklaşan: Varsayılan "bugün"e göre, `due - now <= 0.10 * (projectEnd - projectStart)` koşulunu sağlayan ve henüz tamamlanmamış kilometre taşlarının sayısıdır.
  - Due tarihleri, proje başlangıcı ile bitişi arasında düzgün (eşit aralıklı) dağıtılır.
- Geciken: Öncelikle takvime göre `due < now` olan ve tamamlanmamış taşlar; eğer 0 çıkarsa sağlık durumuna göre küçük bir taban gürültü eklenir (kritik > riskli > iyi).
- Kalan: `total - completed - upcoming - overdue`.

Bu yaklaşım sayesinde "Yaklaşan" eşiği, projenin toplam süresinin %10’u olarak normalize edilir; kısa projelerde 14 gün çok geniş/uzun projelerde çok dar kalma sorunları önlenir.

## Deterministik Mock Üretimi (leaf‑tabanlı FS bağımlılıklarla)

İlgili kod: `src/app/[locale]/(dashboard)/projects/[id]/page.tsx` içinde `getWbsTasks` fonksiyonu. Görevler üretildikten sonra aşağıdaki deterministik seeding bloğu çalışır:

```ts
// Ensure invariant-compliant, deterministic examples per category for filters
;(() => {
  const WANT = { blocked: 2, blocking: 2, blockedRisk: 2, blockRisk: 2 }
  // ... aday kümeleri hesaplanır: unfinished, started, overdue, future
  // 1) Bloklanan örnekleri oluşturulur
  // 2) Bloklayan örnekleri oluşturulur
  // 3) Bloklanma Riski örnekleri oluşturulur
  // 4) Bloklama Riski örnekleri oluşturulur
})()
```

### Seeding Adımları

- Bloklanan (WANT.blocked): Başlamış ve bitmemiş ilk `N` görev için, en yakın önceki bitmemiş ve farklı baz id’ye sahip görev öncül (`dependsOn`) olarak atanır.
- Bloklayan (WANT.blocking): Gecikmiş ve bitmemiş ilk `N` görev için, farklı baz id’ye sahip, başlatılmış bir bitmemiş görev ardıl seçilir ve o ardılın `dependsOn` listesine bu gecikmiş görev eklenir.
- Bloklanma Riski (WANT.blockedRisk): Gelecekte başlayacak ilk `N` görev için, farklı baz id’ye sahip bir bitmemiş öncül seçilir; gerekirse bu öncülün forecast bitişi ardılın planlanan/forecast başlangıcını aşacak şekilde ileri alınır ve `dependsOn` atanır (FS kuralı).
- Bloklama Riski (WANT.blockRisk): Bir bitmemiş görev ile farklı baz id’ye sahip, gelecekte başlayacak bir ardıl eşleştirilir; gerekirse ilk görevin `forecastDate` değeri ardılın başlangıcını aşacak şekilde ileri alınır ve ardılın `dependsOn` listesine bu görev eklenir.
  - Her ekleme öncesi dairesellik kontrolü yapılır; döngü ihtimali varsa o aday atlanır.

### Görünürde Döngülerin Ele Alınışı ve Derinlikli Render

- Seed, aynı baz düğüm çiftleri arasında tekrarlı ilişkileri üretmez (ör. `Kolonlar→Temel` bir kez). Bu, faz/alt parça çokluluğundan doğan çift kopyalarını da engeller.
- Bununla birlikte kullanıcı seviyesinde aynı iki iş kalemi için hem “neden bloklu?” hem “neyi blokluyor?” kartları görülebilir. Bu durum, graf üzerinde gerçek bir döngü olmadığı halde, alt seviyelerdeki farklı alt kalemler arasında iki yönlü mantıklı akışlar bulunduğunu anlatır.
- Insight penceresinde, ilgili iki dalın kökten yaprağa yolu çizilir ve gerçek bağımlılığın oluştuğu düğümlere kadar render edilir:
  - Dal sonlarında sebep için `▶`, etki için `●` işaretleri bulunur.
  - Gerçek bağa karşılık gelen düğümler (faz/alt kalem adı gibi) dalın altında ek satır olarak gösterilir.
  - ASCII çıktısının altında ayrıca özet bir satır yer alır: `Bağımlılık: <sebep> → <etki>`.

Uygulama notu: `asciiBranchMarked(focus, other, rel, { causeLabel, effectLabel })` imzası kullanılır; bu etiketler, gerçek bağın kurulduğu görev/faz adlarıdır.

Uygulama notu: `asciiBranchMarked` çıktısı, mevcut seviyedeki düğümlerin çocuklarından bir yaprak düğümü de (varsa) ek satır olarak render eder. Bu sayede kullanıcıya “gerçek bağ daha aşağıda” bilgisi verilir.

Notlar:
- `blocks` ilişkileri, `dependsOn` kurulumundan sonra otomatik türetilir.
- Gerekli olduğunda forecast ayarlanır ve `slipDays` yeniden hesaplanır. Hiçbir durumda bitmiş işlerden "bloklanan" veya "bloklayan" örneği üretilmez.
- Başlamamış leaf için forecast, baseline’dan erken olmayacak şekilde clamp edilir (allow_early_start=false varsayımı).

## Filtrelerin Uygulanması

Liste ve sayaçlar, aynı mantıkla hesaplanır:
- Bloklanan: Başlamış + bitmemiş + en az bir bitmemiş öncül.
- Bloklayan: Gecikmiş + bitmemiş + en az bir başlatılmış ardıl (start < now).
- Bloklanma Riski: Gelecekte başlayacak + en az bir öncülün forecast bitişi başlangıcı aşıyor.
- Bloklama Riski: Bitmemiş + forecast bitişi bir ardılın gelecekteki başlangıcını aşıyor.

## Test İpuçları

- Üstteki toolbar’daki sekmeler (Bloklanan, Bloklayan, Bloklanma Riski, Bloklama Riski) tıklandığında, seeding sayesinde her zaman en az 2 örnek bulunacaktır.
- Invariantlar gereği bitmiş işler bu kategorilere asla dahil edilmez.

## Değişiklik Günlüğü

- Deterministik seeding eklendi; her kategori için en az 2 örnek garanti edilir. Bitmiş işlerin bloklu/bloklayan görünmesi engellendi.
- Öz‑nedensellik (aynı baz id’nin sebep=sonuç olması) engellendi; seeding ve filtrelerde `base(focus) !== base(other)` kuralı zorunlu hale getirildi. ASCII ağaç ve rozetlerde sebep önce, ikonlar: sebep=▶, etki=●.

## Bütçe Metrikleri (EV/AC/PV) — İnvariantlar

- PV (Planlanan Değer) her düğüm için `data_date`’e göre normalize edilmiş plan ilerlemesi ile orantılıdır (`baseline_start→baseline_finish`).
- EV (Kazanılan Değer) tamamlanan işte 1×B, başlamamış işte 0, başlamış işte yaklaşık `(data_date - actual_start)/BL_DUR × B` olarak üretilir (0..1 aralığına clamp’li). Burada B düğüm bütçesidir; non‑leaf’ta alt ağaç toplamı kullanılır.
- AC (Gerçekleşen Maliyet) `EV/CPI` ile türetilir; CPI deterministik küçük bir jitter ile 0.85–1.15 aralığında seçilir (owner seviyesinde doğal sapmalar oluşur).
- Agregasyon: EV/AC/PV non‑leaf düğümlerde alt ağaç toplamıdır.
- CPI = EV/AC, SPI = EV/PV; completed non‑leaf’ta `actual_finish` yalnız tüm alt ağaç bitince dolar.
