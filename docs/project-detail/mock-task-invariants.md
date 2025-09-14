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

## Mantıksal Invariantlar

1) Bitmiş bir iş, Bloklanan olamaz.
2) Bitmiş bir iş, Bloklayan olamaz.
3) Bloklanan: Başlamış (start < now) ve bitmemiş bir iş, en az bir bitmemiş (veya now’dan sonra biten) öncülü olduğu için ilerleyemiyorsa.
4) Bloklayan: Gecikmiş (due < now) ve bitmemiş bir iş, başlatılmış bir ardılını (start < now) beklettiği durumda.
5) Bloklanma Riski: Gelecekte başlayacak bir işin, bir öncülünün forecast bitişi bu işin başlangıcını aşıyorsa.
6) Bloklama Riski: Bitmemiş bir işin forecast bitişi, gelecekte başlayacak bir ardılın başlangıcını aşıyorsa.

Bu kurallar hem sayaçlarda hem de liste filtrelerinde birebir uygulanır.

## Deterministik Mock Üretimi

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

- Bloklanan (WANT.blocked): Başlamış ve bitmemiş ilk `N` görev için, en yakın önceki bitmemiş görev öncül (`dependsOn`) olarak atanır.
- Bloklayan (WANT.blocking): Gecikmiş ve bitmemiş ilk `N` görev için, başlatılmış başka bir bitmemiş görev ardıl seçilir ve o ardılın `dependsOn` listesine bu gecikmiş görev eklenir.
- Bloklanma Riski (WANT.blockedRisk): Gelecekte başlayacak ilk `N` görev için, bir bitmemiş öncül seçilir; gerekirse bu öncülün `forecastDate` değeri, ilgili görevin başlangıcını aşacak şekilde ileri alınır ve `dependsOn` atanır.
- Bloklama Riski (WANT.blockRisk): Bir bitmemiş görev ile gelecekte başlayacak bir ardıl eşleştirilir; gerekirse ilk görevin `forecastDate` değeri ardılın başlangıcını aşacak şekilde ileri alınır ve ardılın `dependsOn` listesine bu görev eklenir.

Notlar:
- `blocks` ilişkileri, `dependsOn` kurulumundan sonra otomatik türetilir.
- Gerekli olduğunda `forecastDate` ayarlanır ve `slipDays` yeniden hesaplanır. Hiçbir durumda bitmiş işlerden "bloklanan" veya "bloklayan" örneği üretilmez.

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

