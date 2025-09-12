# Proje Detay Sayfası Analizi

## Amaç ve Kapsam
- Bu sayfa, bir projenin üst düzey sağlığını, kritik gecikme/bütçe sorunlarını ve bunların hangi taşeron sorumluluğunda olduğunu hızla göstermek için tasarlanır.
- Dashboard kartlarından devralınan metrikler korunur: ilerleme, planlanan ilerleme, EV/AC/PV, CPI/SPI, risk/sağlık rozeti, kalan gün.

## Dashboard Kartlarından Gelen Bilgiler
- Kimlik/meta: `name`, `status`, `location`, `startDate`, `endDate`, `manager`.
- İlerleme: `progress`, `plannedProgress`, `totalTasks/completedTasks`.
- EVM: `budget`, `earnedValue (EV)`, `actualCost (AC)`, `plannedValue (PV)`; türev: `CPI=EV/AC`, `SPI=EV/PV`, birleşik sağlık (60%CPI+40%SPI).
- Diğer: `subcontractors` sayısı, `riskLevel`, `qualityScore`, `daysRemaining`.

## Kullanıcı İhtiyaçları
- Projede hangi taşeronlar var? Hangi iş kalemlerinden sorumlular?
- Hangi iş kalemleri sorunlu (gecikme/bütçe aşımı)? Bunlar hangi taşeronlara ait?
- Bütçe ve takvim performansı (CPI/SPI) hem genel hem taşeron/WBS kırılımında.

## Sorumluluk ve Takip Seviyesi
- Kural (öneri): “En yakın atanan ata”. Bir düğümde `assignedSubcontractorId` varsa sahibi odur; yoksa en yakın atalı atasından devralınır.
- Roll‑up: Gecikme/aşım yaprakta tespit edilir, raporlama “en yakın atalı ata” seviyesinde toplanır. Üst düğümlere sayılar ağırlıklı (PV/AC) olarak yuvarlanır.
- Varsayılan görünüm: “Kontrat düzeyi” (sözleşme/sahiplik katmanı). Alternatif olarak “Yaprak odaklı” görünüm (kök neden analizi) bir toggle ile açılır.

## Bilgi Mimarisi ve Sekmeler
- Genel Bakış: Kilometre taşları, son aktiviteler, küçük KPI’lar.
- Taşeronlar: Her taşeron için kapsam, sağlık (CPI/SPI), sorun sayıları, en riskli 3 iş kalemi. Tıklayınca ağaç ve sorunlar bu taşerona filtrelenir.
- İş Kırılımı (WBS): Sorumluluk miraslı ağaç, birleşik sağlık ısı haritası, sorun rozetleri. Drill‑down ile kök nedene inme. Sanallaştırma için öncelik: `react-virtuoso` veya `@tanstack/virtual` (dokümantasyon uyumu). Gerekirse mevcut custom VirtualList/VirtualTable yedek olarak kullanılır.
- Sorunlar: Gecikme/bütçe aşımı listesi; taşerona veya WBS’ye göre gruplama, hızlı filtreler.
- Bütçe & Takvim: CPI/SPI kartları, PV/EV/AC kıyaslaması ve zaman serisi.

## Görselleştirme ve Eşikler
- Eşikler: Kritik < 0.90, Riskli 0.90–0.95, İyi ≥ 0.95 (CPI/SPI için).
- Isı haritası: Birleşik sağlık (60%CPI+40%SPI) ile düğüm satırı rengi.
- Sayım: Yaprak sorunlarını “en yakın atalı ata” seviyesinde tek kez say (çifte sayımı önle).

## Kullanıcı Akışı (Top‑Down)
1) Taşeronlar sekmesinde kırmızı/sarı taşeronlar listelenir.
2) Bir taşerona tıklanır → WBS sekmesi bu taşerona filtreli açılır.
3) Kırmızı üst düğüm genişletilir → en sorunlu altlara drill‑down.
4) Sorunlar sekmesinde aynı filtreyle detay listesi incelenir.

Bu yaklaşım, “önce kim sorumlu?” sorusunu hızlı yanıtlar; ardından ayrıntıya inme imkanı sağlar.
