# Aether Forge - Uçtan Uca Geliştirme Yol Haritası ve Sprint Planı (E2E Roadmap)

Bu doküman, Aether Forge platformunun PRD ve teknik şartnamelere uygun olarak uçtan uca hayata geçirilmesi için hazırlanan 6 sprintlik entegre planı içerir. 

Her sprint **2 hafta (10 iş günü)** olarak planlanmıştır. Toplam süre **12 hafta (3 ay)**'dır.

---

## Mimarinin Genel Yol Haritası (Milestones)

```mermaid
gantt
    title Aether Forge - Uçtan Uca Proje Zaman Çizelgesi
    dateFormat  W
    axisFormat W%W
    
    Sprint 1: Altyapı & SDK (INode)         :active, s1, 0, 2
    Sprint 2: React Node Editör & Canvas    : s2, after s1, 2
    Sprint 3: Multimodal AI Üretim Node'ları: s3, after s2, 2
    Sprint 4: Unreal Engine & MCP Entegre   : s4, after s3, 2
    Sprint 5: Dağıtık Workers & Bulut      : s5, after s4, 2
    Sprint 6: Güvenlik, QA & Yayına Alım    : s6, after s5, 2
```

---

## 🏃 Sprint 1: Core Architecture & MVP SDK
*   **Hedef:** Temel runtime motorunu kurmak, veri paketleme standartlarını (`DataPacket`) belirlemek ve ilk node sözleşmesini (`INode`) kodlamak.
*   **Aktif Ekip:** Chief Architect, Product Owner, Runtime Engineer, Plugin SDK Agent.
*   **Görevler:**
    1.  **Gereksinim Şeması:** Proje, organizasyon ve kullanıcı veri tabanı şemasının (PostgreSQL) ayağa kaldırılması.
    2.  **Runtime Çekirdeği:** DAG çözümleme algoritmasının (Topological Sort) yazılması.
    3.  **SDK Geliştirme:** Eklenti (plugin) geliştiricilerinin kullanacağı base class yapısının oluşturulması.
*   **Definition of Done (DoD):**
    *   `INode` interfacesi üzerinden türeyen iki mock node'un (örn: Input -> Processing) yerel runtime üzerinde CLI ile çalıştırılabilmesi.

---

## 🏃 Sprint 2: Visual Canvas & React Node Editor
*   **Hedef:** Zustand tabanlı state yönetimi ile React Flow editör arayüzünü oluşturmak.
*   **Aktif Ekip:** React Architect, UX Designer, Product Owner.
*   **Görevler:**
    1.  **Görsel Arayüz:** Sürükle-bırak (drag-and-drop) destekli sonsuz tuvalin tasarlanması.
    2.  **Node Tasarımları:** Input, Output, LLM, 3D ve Audio node tipleri için dinamik görsel kartlar.
    3.  **Graph Compiler:** Arayüzde çizilen grafiğin anlık olarak tip uyumluluğunu kontrol eden ve JSON üreten derleyicinin kodlanması.
*   **Definition of Done (DoD):**
    *   Tarayıcıda çizilen bir grafiğin validasyondan geçerek geçerli bir `workflow.json` dosyası olarak kaydedilebilmesi.

---

## 🏃 Sprint 3: Multimodal AI Node Generators
*   **Hedef:** Görsel, video, ses ve 3D AI API'lerinin (Flux, Suno, ElevenLabs, Meshy) platforma node eklentisi olarak entegre edilmesi.
*   **Aktif Ekip:** LLM Integration, Image Pipeline, 3D Pipeline, Audio/Video Pipeline Agents.
*   **Görevler:**
    1.  **LLM Node Entegrasyonu:** Prompt optimizasyonu ve yapılandırılmış JSON çıktısı alabilen LLM node'u.
    2.  **Image & Video:** Flux ve Runway API wrapper'larının yazılması.
    3.  **3D Asset Generation:** Meshy ve Tripo API'lerinin entegrasyonu; üretilen modelleri yerel diske indirme mekanizması.
    4.  **Audio & Music:** Suno ve ElevenLabs seslendirme node'larının entegrasyonu.
*   **Definition of Done (DoD):**
    *   Gelen prompt girdisinden sırasıyla 2D konsept, 3D model ve müzik üreten 3 paralel kolun yerel diskte çıktı dosyası oluşturabilmesi.

---

## 🏃 Sprint 4: Unreal Engine & MCP Automation Layer
*   **Hedef:** Unreal Engine editörü ile platform arasındaki köprüyü (MCP ve Python) kurmak.
*   **Aktif Ekip:** Unreal Architect, Unreal MCP, Technical Artist Agents.
*   **Görevler:**
    1.  **UE MCP Server:** Unreal Engine 5.8+ editörünü kontrol eden yerel MCP sunucusunun yazılması.
    2.  **Asset Import Pipeline:** Üretilen modellerin otomatik olarak klasör yapısına uygun (Content/Characters, Content/Weapons vb.) import edilmesi.
    3.  **Blueprint & Material:** Otomatik olarak Material Instance ve temel Character Blueprint sınıfı üreten Python otomasyon scriptleri.
*   **Definition of Done (DoD):**
    *   Runtime üzerinden tetiklenen `unreal_import` komutunun yerelde açık olan Unreal projesine modeli import edip otomatik olarak bir Material Instance ataması.

---

## 🏃 Sprint 5: Distributed Workers & Cloud Scale
*   **Hedef:** İş yüklerini dağıtık sistemlere taşımak, GPU worker kuyruklarını yönetmek ve multitenancy'yi aktif etmek.
*   **Aktif Ekip:** DevOps, Database Architect, Chief Architect Agents.
*   **Görevler:**
    1.  **Kubernetes & Celery/Redis:** Node'ların bulutta paralel işlenmesini sağlayan kuyruk mimarisi.
    2.  **GPU Scheduler:** Yoğun iş yükü gerektiren (render, upscale vb.) işleri GPU worker havuzuna yönlendiren zamanlayıcı.
    3.  **Vector DB & RAG:** Bilgi tabanı (Knowledge Base) aramaları için Qdrant/Weaviate entegrasyonu.
*   **Definition of Done (DoD):**
    *   Farklı sunucularda çalışan 5 paralel workflow isteğinin bulut üzerindeki worker kuyruğunda başarıyla işlenip S3 depolama birimine yazılması.

---

## 🏃 Sprint 6: E2E Integration, Security & Launch
*   **Hedef:** Uçtan uca güvenlik denetimleri, performans yük testleri, hata toleransı doğrulamaları ve yayın.
*   **Aktif Ekip:** Security, QA Architect, Performance, Product Owner Agents.
*   **Görevler:**
    1.  **Security Audit:** API Key referanslama ve RBAC (rol bazlı yetkilendirme) güvenlik testleri.
    2.  **Performance & Load Test:** Eş zamanlı GPU tüketimi limitleri ve bellek (VRAM) sızıntısı taraması.
    3.  **Marketplace Readiness:** PDK ile yazılan örnek bir eklentinin paketlenmesi ve marketplace dağıtım simülasyonu.
*   **Definition of Done (DoD):**
    *   Sistemde 0 kritik güvenlik açığı bulunması, uçtan uca oyun varlığı üretim senaryosunun (Prompt -> 3D -> Unreal) 50 eş zamanlı istek altında test edilip başarıyla tamamlanması.

---

## Sprint Kaynak Matrisi ve Sorumluluk Dağılımı

| Sprint | Ağırlıklı Çalışan Ajan Ekipleri | Kritik Teslimatlar (Deliverables) |
| :--- | :--- | :--- |
| **Sprint 1** | Architecture & Runtime Team | `INode`, `DAG Executor`, PostgreSQL ERD |
| **Sprint 2** | Frontend Team | React Flow Canvas, JSON Schema Builder |
| **Sprint 3** | AI & Asset Generation Team | Flux, Meshy, Suno API Eklentileri |
| **Sprint 4** | Game Dev & Tech Art Team | UE MCP Server, Auto-Import Python Script |
| **Sprint 5** | Infrastructure & DB Team | K8s Deployment Specs, Celery Worker, Vector DB |
| **Sprint 6** | QA & Security Team | Yük Testi Raporu, Sızma Testi Raporu, Production Release |
