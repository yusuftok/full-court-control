# Proje Detay Sayfası Uygulama Planı

## Varsayımlar
- App Router + next-intl kullanılıyor, i18n anahtarları `src/i18n/locales/{tr,en}.json`.
- WBS düğümleri `DivisionNode/DivisionInstance` tipleriyle temsil ediliyor; düğümlerde `assignedSubcontractorId` bulunabilir.
- EVM metrikleri için `earnedValue (EV)`, `actualCost (AC)`, `plannedValue (PV)` alanları mevcut veya türetilebilir.

## Aşamalar

1) Veri Yardımcıları ve Modeller
- `closestOwner(node, ancestors)`: En yakın atalı taşeronu bul.
- `annotateWithOwner(root)`: Tüm ağaçta miraslı sahipliği hesapla ve `ownerIdResolved` olarak ekle.
- `rollupMetrics(root, mode)`: CPI/SPI ve sorun sayımlarını düğümler/taşeronlar için topla. Ağırlık: PV (varsayılan) veya AC.
- Issue modeli: `Issue { id, nodeId, subcontractorId, type: 'delay'|'overrun', severity, daysLate, costOver, cpi, spi }`.
- Gruplama yardımcıları: `groupIssuesBySubcontractor(issues)`, `groupIssuesByNode(issues)`.

2) UI Bileşen İskeletleri
- `SubcontractorOverview.tsx`: taşeron özet ızgarası, sağlık rozetleri, sorun sayıları.
- `WbsHealthTree.tsx`: sorumluluk miraslı ağaç + ısı haritası + sorun rozetleri. Sanallaştırma tercihi `react-virtuoso` (öncelik). Özel gereksinim durumunda `@tanstack/virtual` alternatif; paket kurulamazsa `VirtualList/VirtualTable` ile geçici çözüm.
- `IssueList.tsx`: filtrelenebilir tablo, “taşerona göre” / “WBS’ye göre” pivot.
- `BudgetSchedulePanel.tsx`: CPI/SPI kartları, PV/EV/AC grafikleri (mock veri).

3) Sayfa Entegrasyonu
- `src/app/[locale]/(dashboard)/projects/[id]/page.tsx` içine sekmeler: Genel, Taşeronlar, WBS, Sorunlar, Bütçe & Takvim.
- URL durum senkronu: `?subcontractorId=...&view=contract|leaf&issue=delay|overrun`.

4) Veri Bağlantısı (Mock → Gerçek)
- İlk aşamada mock veri/hesaplama; sonra gerçek API/route handler bağlama.

5) Test ve Öyküler
- `vitest`: yardımcı fonksiyonlar için birim testleri (closestOwner, rollupMetrics).
- `storybook`: her bileşen için durum varyasyonları.

6) i18n ve Stil
- Yeni sabit metinler için `tr.json` ve `en.json` güncelle.
- Tailwind ile ısı haritası renkleri: kritik/riskli/iyi.

## Komutlar (örnek)
- Geliştirme: `npm run dev`
- Test: `npm run test` / `npm run test:watch`
- Storybook: `npm run storybook`

## Bitirme Kriterleri
- Sekmeler çalışır, URL ile filtreler kalıcı.
- Taşeronlar sekmesinde kırmızı/sarı taşeronlar üstte görünür.
- WBS ağacı ısı haritası ile drill‑down yapılabilir.
- Sorunlar sekmesi taşerona/WBS’ye göre filtrelenebilir.
- CPI/SPI kartları ve temel trend grafikleri gösterilir.
