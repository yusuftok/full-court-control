# Proje Detay Sayfası Uygulama Planı

> Updated Plan: WBS etkileşimleri eklendi; büyük veri Storybook senaryosu ve sözleşme testleri yazıldı; metinler i18n'e taşındı. Planı kapatıyoruz.

## Varsayımlar
- App Router + next-intl kullanılıyor, i18n anahtarları `src/i18n/locales/{tr,en}.json`.
- WBS düğümleri `DivisionNode/DivisionInstance` tipleriyle temsil ediliyor; düğümlerde `assignedSubcontractorId` bulunabilir.
- EVM metrikleri için `earnedValue (EV)`, `actualCost (AC)`, `plannedValue (PV)` alanları mevcut veya türetilebilir.

## Aşamalar (Durum)

1) Veri Yardımcıları ve Modeller — [x]
- `closestOwner(node, ancestors)`: En yakın atalı taşeronu bul.
- `annotateWithOwner(root)`: Tüm ağaçta miraslı sahipliği hesapla ve `ownerIdResolved` olarak ekle.
- `rollupMetrics(root, mode)`: CPI/SPI ve sorun sayımlarını düğümler/taşeronlar için topla. Ağırlık: PV (varsayılan) veya AC.
- Issue modeli: `Issue { id, nodeId, subcontractorId, type: 'delay'|'overrun', severity, daysLate, costOver, cpi, spi }`.
- Gruplama yardımcıları: `groupIssuesBySubcontractor(issues)`, `groupIssuesByNode(issues)`.

2) UI Bileşen İskeletleri — [x]
- `SubcontractorOverview.tsx`: taşeron özet ızgarası, sağlık rozetleri, sorun sayıları.
- `WbsHealthTree.tsx`: sorumluluk miraslı ağaç + ısı haritası + sorun rozetleri. Sanallaştırma tercihi `react-virtuoso` (öncelik). Özel gereksinim durumunda `@tanstack/virtual` alternatif; paket kurulamazsa `VirtualList/VirtualTable` ile geçici çözüm.
- `IssueList.tsx`: filtrelenebilir tablo, “taşerona göre” / “WBS’ye göre” pivot.
- `BudgetSchedulePanel.tsx`: CPI/SPI kartları, PV/EV/AC grafikleri (mock veri).

3) Sayfa Entegrasyonu — [x]
- `src/app/[locale]/(dashboard)/projects/[id]/page.tsx` içine sekmeler: Genel, Taşeronlar, WBS, Sorunlar, Bütçe & Takvim.
- URL durum senkronu: `?subcontractorId=...&view=contract|leaf&issue=delay|overrun`.

4) Veri Bağlantısı (Mock → Gerçek) — [~]
- Mock veri ve hesaplama tamam. Gerçek API bağlama sonraya bırakıldı (contract-driven).

5) Test ve Öyküler — [x]
- `vitest`: yardımcı fonksiyon testleri eklendi (ownership/rollup/aggregate).
- `storybook`: WBS ve Taşeron özet için hikayeler eklendi.

6) i18n ve Stil — [~]
- Yeni sabit metinler için `tr.json` ve `en.json` güncelle. [x]
- Tailwind ile ısı haritası renkleri: kritik/riskli/iyi. [x]

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

## TODO (Sıradaki Adımlar)
– Contract tests: `NodeMetrics`, `Issue`, `Ownership` arayüzleri için Vitest sözleşme testleri ve mock adapter. [x]
– Storybook: WBS için 5k+ düğümlü büyük veri senaryosu, performans notları ve kontroller. [x]
– WBS etkileşimleri: klavye gezinme, hızlı arama (node adında filtre), seçimi URL’ye yaz. [x]
– Performans ayarı: Virtuoso `overscan`/yükseklik ayarı, render ölçümleri ve küçük optimizasyonlar. [x]
– UI detayları: rozet metinleri i18n, boş durumlardaki açıklamalar, hatalı veri fallback’leri. [x]

Notlar:
- Üstteki özetle bu plan tamamlanmış kabul edilmiştir. Yeni çalışmalar için ayrı bir belge açılmalıdır.
