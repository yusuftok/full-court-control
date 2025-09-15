## WBS-Backed Schedule (FS-only) & Budget (EV/AC/PV)

## 1) Kapsam & Varsayımlar

-   WBS kapsam hiyerarşisidir; burada WBS düğümleri üzerinde **plan (baseline)**, **gerçek (actual)** ve **tahmin (forecast)** tarihlerini gösteren bir **schedule görünümü** tanımlıyoruz.
    
-   **Bağımlılık türü**: Yalnız **FS** (Finish-to-Start). (İsteğe bağlı `lag_days` desteklenir; yoksa 0 kabul edilir.)
    
-   **Bağımlılıklar yalnızca leaf** (yaprak) düzeyinde tanımlanır; non-leaf için **türetilir**.
    
-   **Data Date (raporlama tarihi)** zorunludur ve tüm forecast/sapma hesapları bu tarihe göre yapılır.
    
-   Takvim belirtmezseniz tarih aritmetiği **takvime bağlı olmadan (calendar days)** yapılır.
    

## 2) Global Parametreler

-   `data_date` (Date, **must**): Raporlama/kesit tarihi.
    
-   `baseline_id` (String, **must**): Cari baseline sürümü.
    
-   `allow_early_start` (Bool, default **false**): True ise forecast, baseline’dan daha erken başlayabilir; false ise forecast başlangıcı baseline’dan önce olamaz.
    

## 3) Veri Modeli (WBSNode)

|      Alan       |      Tip       | Gereklilik  |        Leaf/Non-leaf         |                                                        Tanım / Kural                                                         |
|-----------------|----------------|-------------|------------------------------|------------------------------------------------------------------------------------------------------------------------------|
|       `id`        |  String/UUID   |    must     |          her ikisi           |                                                       Benzersiz kimlik                                                       |
|    `parent_id`    |  String/UUID?  |  optional   |          her ikisi           |                                                         Ağaç yapısı                                                          |
|      `name`       |     String     |    must     |          her ikisi           |                                                        İş kalemi adı                                                         |
|     `is_leaf`     | Bool (derive)  |    must     |          her ikisi           |                                                       Çocuk yoksa true                                                       |
| `baseline_start`  |      Date      |    must     |          her ikisi           |                        Baseline (cari) başlama tarihi; **non-leaf için**: min(descendant.baseline\_start)                        |
| `baseline_finish` |      Date      |    must     |          her ikisi           |                            Baseline bitiş tarihi; **non-leaf için**: max(descendant.baseline\_finish)                            |
|  `actual_start`   |     Date?      | conditional |          her ikisi           |                                Başlamışsa **must**; **non-leaf için**: min(descendant.actual\_start)                                 |
|  `actual_finish`  |     Date?      | conditional |          her ikisi           |           Bitmişse **must**; **non-leaf için**: tüm descendant’lar bitince max(descendant.actual\_finish), aksi halde **null**            |
| `forecast_start`  |     Date?      | conditional | leaf & “başlamamış” non-leaf | **Leaf:** başlamamışsa must; başlamışsa **null**. **Non-leaf:** hiç descendant başlamamışsa = min(child.forecast\_start); başladıysa **null** |
| `forecast_finish` |     Date?      | conditional |          her ikisi           |                **Bitmemiş** tüm düğümler için **must**. **Leaf:** formül aşağıda. **Non-leaf:** = max(child.forecast\_finish)                |
|  `predecessors`   | Array<PredRef> |  optional   |         **yalnız leaf**          |                                          Yalnız FS; `PredRef = { task_id, lag_days? }`                                           |
|   `successors`    |       —        |      —      |              —               |                                                    **Saklanmaz** (türetilir)                                                     |

**İnvariantlar**

-   `baseline_start ≤ baseline_finish`
    
-   `actual_start` varsa `actual_start ≤ data_date`
    
-   `actual_finish` varsa `actual_start ≤ actual_finish ≤ data_date`
    
-   Döngü (cycle) yok; bağımlılık grafiği DAG’dır (leaf’ler arası).
    

## 4) Forecast Kuralları (FS-only)

### 4.1 Yardımcı Tanımlar

-   `BL_DUR = duration_days(baseline_start → baseline_finish)`  
    (Takvim yoksa gün farkı, aksi halde iş günü farkı.)
    
-   `ES_f` = forecast earliest start, `EF_f` = forecast earliest finish.
    

### 4.2 Leaf — Başlamamış

```
ES_f = max(
  data_date,
  max_over_preds( pred.EF_f + pred.lag_days ),
  allow_early_start ? -∞ : baseline_start
)

EF_f = ES_f + BL_DUR
```

Açıklama:

-   **Pred’ler bitmeden** başlayamaz (FS kuralı).
    
-   `allow_early_start=false` ise forecast başlangıcı baseline’dan erken olamaz.
    
-   Pred yoksa ikinci terim −∞ sayılır; ES\_f = max(data\_date, baseline\_start | policy).
    

### 4.3 Leaf — Başlamış & Bitmemiş

Ek ilerleme verisi olmadan deterministik bir **start-shift** kuralı kullanıyoruz:

```
START_SHIFT = days(actual_start - baseline_start)

EF_f = max(
  data_date,
  baseline_finish + START_SHIFT
)

```
### 4.4 Leaf — Bitmiş

-   `forecast_start`, `forecast_finish` = **null** (gösterilmez), plan/raporlamada isterseniz `forecast_finish = actual_finish` olarak da normalize edebilirsiniz.
    

### 4.5 Non-leaf (Özet)

-   **Başlamamış (descendant’ların hiçbiri başlamamış):**  
    `forecast_start = min(child.forecast_start)`
    
-   **Her durumda (bitmemiş):**  
    `forecast_finish = max(child.forecast_finish)`
    
-   **Gerçekler (actual):**  
    `actual_start = min(descendant.actual_start)` (varsa)  
    `actual_finish = max(descendant.actual_finish)` (tüm descendant’lar bitince)
    

## 5) Bağımlılıkların Türetilmesi (Non-leaf için)

-   Non-leaf düzeyinde bağımlılık **saklamayın**. Raporlama/analizde:
    
    -   **Gelen** bağımlılıklar: Alt ağaçtaki tüm leaf’lerin pred setinin birleşimi (dış düğümlere bakanlar).
        
    -   **Giden** bağımlılıklar: Diğer alt ağaç leaf’lerinin pred’lerinde bu alt ağaç leaf’lerine referans verenler.
        

## 6) Hesaplama Sırası (Deterministik)

1.  Leaf düğümler için **topolojik sıralama** (FS bağımlılık DAG’ı).
    
2.  Leaf forecast hesapları (4.2 ve 4.3).
    
3.  Ağaçta **post-order** ile non-leaf türetmeleri (baseline/actual/forecast agregasyonları).
    
4.  İnvariant kontrolleri (başlangıç≤bitiş, null kuralları, cycle testi vs.).
    

## 7) Validasyon Kuralları (özet)

-   **Must alanlar**: tabloya göre. Eksikse veri reddedilir.
    
-   **Non-leaf actual\_finish** yalnızca **tüm** descendant’lar bitince dolabilir.
    
-   **Başlamamış** leaf için `forecast_start` **must**; **bitmemiş** (leaf veya non-leaf) için `forecast_finish` **must**.
    
-   `predecessors` yalnız leaf’te; `task_id`’ler var olmalı; self-loop yasak; cycle yasak.
    
-   `lag_days` negatif değil (isteğe göre <0 yasaklanır).
    

## 8) Basit Örnek (start-shift kuralı)

-   A (leaf, pred yok): BL = \[1 Mar, 5 Mar\] → BL\_DUR=4g  
    `data_date=10 Mar`, **başlamamış**  
    `ES_f = max(10 Mar, (preds yok), baseline_start=1 Mar) = 10 Mar`  
    `EF_f = 10 Mar + 4g = 14 Mar`
    
-   B (leaf, pred=A, lag=0):  
    `ES_f = max(10 Mar, EF_f(A)=14 Mar, baseline_start(B)) = 14 Mar`  
    `EF_f = 14 Mar + BL_DUR(B)`
    
-   C (leaf, **başlamış**, `actual_start=12 Mar`, BL=\[10 Mar, 20 Mar\])  
    `START_SHIFT = 12−10 = +2g`  
    `EF_f = max(10 Mar, 20 Mar + 2g) = 22 Mar`
    

Non-leaf X = {A,B,C}:  
`forecast_finish = max(A,B,C forecast_finish)`  
`forecast_start` yalnız X’in descendant’larından hiçbiri başlamamışsa gösterilir; aksi halde null.

## 9) Şema (DDL tadında)

```
<div><p>sql</p><p><code id="code-lang-sql">-- WBS Nodes
create table wbs_node (
  id uuid primary key,
  parent_id uuid null references wbs_node(id),
  name text not null,
  is_leaf boolean not null,
  baseline_start date not null,
  baseline_finish date not null,
  actual_start date null,
  actual_finish date null,
  forecast_start date null,
  forecast_finish date null,
  baseline_id text not null
);

-- FS predecessors (yalnız leaf)
create table wbs_pred (
  task_id uuid not null references wbs_node(id),
  pred_task_id uuid not null references wbs_node(id),
  lag_days integer not null default 0,
  primary key (task_id, pred_task_id)
);
-- Constraint örnekleri (uygulama/trigger tarafında):
-- - task_id ve pred_task_id leaf olmalı
-- - cycle detection (UDF/trigger ile)
-- - lag_days &gt;= 0</code></p></div>
```

## 10) Bütçe (EV/AC/PV) Üretimi — WBS ile Uyum

Bu projede bütçe metrikleri (EV/AC/PV) schedule ile tutarlı ve deterministik olacak şekilde üretilir. Amaç; üst seviye (owner/taşeron) özetlerinin kartlarda gösterilen CPI/SPI ile tutarlı çıkmasıdır.

Temel yaklaşım:

- Her leaf için bir taban bütçe B seçilir (deterministik hash’e dayalı, ör. 15–120 M aralığı). Non-leaf için agregasyon yapılır (toplam EV/AC/PV = alt ağaç toplamı).
- `PV` (Planned Value) = B × plan ilerleme oranı. Plan ilerleme oranı, `data_date`’e göre normalize edilmiş `baseline_start→baseline_finish` aralığındaki konumdur.
- `EV` (Earned Value) = B × gerçekleşen ilerleme oranı. Gerçekleşen ilerleme oranı:
  - İş tamamlandıysa 1,
  - Başlamışsa `actual_start`’tan bugüne kadarki ilerleme ~ `(data_date - actual_start) / BL_DUR` (0..1),
  - Başlamamışsa 0.
- `AC` (Actual Cost) = `EV / CPI`. CPI için küçük deterministik bir jitter kullanılır (örn. 0.85–1.15). Böylece EV≈AC civarında olur; CPI = EV/AC doğal olarak türetilir.
- SPI = EV/PV (üst seviyeler için owner bazında ekrana yansıyan değer budur).

Notlar:
- Takvim kullanılmayan örneklerde “gün” bazında çalışılır; iş günü takvimi eklenirse aynı formüller iş günü farklarıyla hesaplanabilir.
- Aşırı uçlar (negatif/sonsuz) clamp’lenir; completed non‑leaf için `actual_finish` yalnızca tüm alt ağaç bitince dolar.

Bu mantık sayesinde kartlarda görülen CPI/SPI değerleri, aynı WBS üzerinden türetilen schedule ile anlamlı/uyumlu kalır.

## 11) Görünüm/İş Kuralları

-   UI’de bitmiş işlerde forecast alanları gösterilmez; bitmemişlerde gösterilir.
    
-   Non-leaf’te bağımlılık sadece bilgi amaçlı (türetilmiş) gösterilir.
    
-   `allow_early_start`\=false ise UI, forecast başlangıcını baseline’dan geri çekmeye izin vermez.

## 11) Kurallar (kısa tekrar)

- **Baseline (non-leaf)**:
    - baseline_start = min(desc.baseline_start)
    - baseline_finish = max(desc.baseline_finish)

- **Actual (non-leaf)**:
    - actual_start = min(desc.actual_start) (en az bir desc başladıysa, yoksa null)
    - actual_finish = max(desc.actual_finish) yalnızca tüm desc bitmişse, yoksa null

- **Forecast (non-leaf)**:

    - forecast_start: Non-leaf başlamamışsa (alt ağaçta hiç actual_start yoksa) ⇒ min(child.forecast_start); aksi halde null

    - forecast_finish: Non-leaf bitmemişse (alt ağaçta en az bir unfinished varsa) ⇒ max(child.forecast_finish); tüm desc bitmişse null
    
