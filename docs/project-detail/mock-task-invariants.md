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
7) Öz‑nedensellik yok: Aynı WBS düğümü (baz id) hem sebep hem de sonuç olamaz.
   - Teknik olarak `base(id) = id.split('-p')[0]`. Herhangi bir `dependsOn`/`blocks` ilişkisi için `base(focus) !== base(other)` olmalıdır.
   - Bu kural hem veri üretiminde hem de görselleştirmede (rozet sırası, ASCII ağaç) uygulanır.
8) Dairesel bağımlılık yok: `dependsOn` ilişkileri bir DAG (Directed Acyclic Graph) oluşturur.
   - Yeni bir bağ eklenmeden önce `wouldCreateCycle(A depends B)` kontrolü yapılır; `B`'den `A`'ya mevcut bir yol varsa ekleme iptal edilir.
   - Bu kontrol seed sırasında tüm kategoriler için uygulanır.

Bu kurallar hem sayaçlarda hem de liste filtrelerinde birebir uygulanır.

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

- Bloklanan (WANT.blocked): Başlamış ve bitmemiş ilk `N` görev için, en yakın önceki bitmemiş ve farklı baz id’ye sahip görev öncül (`dependsOn`) olarak atanır.
- Bloklayan (WANT.blocking): Gecikmiş ve bitmemiş ilk `N` görev için, farklı baz id’ye sahip, başlatılmış bir bitmemiş görev ardıl seçilir ve o ardılın `dependsOn` listesine bu gecikmiş görev eklenir.
- Bloklanma Riski (WANT.blockedRisk): Gelecekte başlayacak ilk `N` görev için, farklı baz id’ye sahip bir bitmemiş öncül seçilir; gerekirse bu öncülün `forecastDate` değeri, ilgili görevin başlangıcını aşacak şekilde ileri alınır ve `dependsOn` atanır.
- Bloklama Riski (WANT.blockRisk): Bir bitmemiş görev ile farklı baz id’ye sahip, gelecekte başlayacak bir ardıl eşleştirilir; gerekirse ilk görevin `forecastDate` değeri ardılın başlangıcını aşacak şekilde ileri alınır ve ardılın `dependsOn` listesine bu görev eklenir.
  - Her ekleme öncesi dairesellik kontrolü yapılır; döngü ihtimali varsa o aday atlanır.

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
- Öz‑nedensellik (aynı baz id’nin sebep=sonuç olması) engellendi; seeding ve filtrelerde `base(focus) !== base(other)` kuralı zorunlu hale getirildi. ASCII ağaç ve rozetlerde sebep önce, ikonlar: sebep=▶, etki=●.
