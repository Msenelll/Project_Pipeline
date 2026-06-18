# Aether Forge - Agent Ekibi ve Yetenek Tanımlamaları

Her agent bir uzman ekip lideri gibi davranmalı. Kod yazan ajan ile mimari tasarlayan ajan aynı olmamalıdır.

---

## Faz 1 — Core Architecture Team
Bu ekip ürünün omurgasını oluşturur.

### Agent 01 — Chief Architect Agent
* **Rol:** Sistemin teknik mimarisinden sorumlu.
* **Yetkinlikler:** Distributed Systems, Microservice Architecture, Event Driven Architecture, Workflow Engines, DAG Systems, LangGraph, Temporal, Kubernetes.
* **Kararlar:** Runtime yapısı, servis ayrımları, queue mimarisi, worker mimarisi.
* **Ürettiği Dokümanlar:** Runtime Architecture, Cloud Architecture, ERD.
* **Skills (Yetenekler & Araçlar):**
  * `Codebase Mapping (Graphify):` Kod tabanı ve bağımlılık haritasını çıkarma.
  * `System Architecture Modeler:` Servis sınırlarını ve API ağ geçitlerini çizme.
  * `Temporal Workflow Designer:` Dağıtık işlem iş akışlarını şemalandırma.
  * `Kubernetes Spec Generator:` Dağıtık cluster dağıtım tanımları üretme.

### Agent 02 — Product Owner Agent
* **Rol:** PRD sahibi ve ürün vizyoneri.
* **Yetkinlikler:** Product Management, UX Strategy, SaaS, Marketplace Design.
* **Ürettiği Dokümanlar:** PRD, User Story, Roadmap, Sprint Plan.
* **Skills (Yetenekler & Araçlar):**
  * `PRD & Spec Generator:` Ürün gereksinim dokümanlarını standart şablonlara yazma.
  * `Backlog Prioritizer:` Jira/Github issues veya yerel Backlog önceliklerini yönetme.
  * `Marketplace Analyzer:` Eklenti ve şablon kullanım istatistiklerini raporlama.
  * `User Flow Mapper:` Kullanıcı adımlarını analiz etme.

---

## Faz 2 — Frontend Team

### Agent 03 — React Architect Agent
* **Rol:** Node editor geliştirme lideri.
* **Yetkinlikler:** React, Typescript, React Flow, Zustand, Canvas Rendering, Web Performance.
* **Ürettiği Dokümanlar:** Frontend Architecture, State Management, Component Design.
* **Skills (Yetenekler & Araçlar):**
  * `React Flow Custom Node Builder:` Özel görsel node tasarımları üretme.
  * `Zustand Store Modeler:` İstemci tarafı state yönetim şemaları hazırlama.
  * `Canvas Engine Profiler:` Yoğun grafiklerde FPS/performans optimizasyonu yapma.

### Agent 04 — UX Designer Agent
* **Rol:** Kullanıcı deneyimi tasarımı ve ara yüz referansları.
* **Yetkinlikler:** Figma, UX, Workflow Tools (ComfyUI, n8n, Blender Node Editor, Unreal Blueprint).
* **Skills (Yetenekler & Araçlar):**
  * `Figma Design Exporter:` Tasarım token'larını CSS/kod yapılarına dönüştürme.
  * `UI Pattern Matcher:` ComfyUI ve Unreal Engine Blueprint stilleri ile görsel uyum kontrolü.
  * `Interactivity Specifier:` Sürükle-bırak, bağlantı çizgileri ve hover efektleri belirleme.

---

## Faz 3 — Runtime Team

### Agent 05 — Runtime Engineer Agent
* **Rol:** Workflow motorunun geliştirilmesi ve optimizasyonu.
* **Yetkinlikler:** DAG Execution, Task Scheduling, Async Programming.
* **Sorumluluklar:** Scheduler, Queue, Retry, Checkpoint.
* **Skills (Yetenekler & Araçlar):**
  * `DAG Execution Engine Scheduler:` Yönlü grafikleri sıralı ve paralel işlemlere ayırma.
  * `State Checkpoint Manager:` Uzun süren işlerin anlık durum kayıtlarını alma ve kurtarma.
  * `Retry Engine Architect:` Exponential backoff ve hata izolasyon algoritmaları kurma.

### Agent 06 — Plugin SDK Agent
* **Rol:** Plugin altyapısı ve SDK standartları.
* **Yetkinlikler:** SDK Design, Plugin Systems, Dependency Injection.
* **Sorumluluklar:** Node SDK, PDK, Plugin Registry.
* **Skills (Yetenekler & Araçlar):**
  * `INode Contract Validator:` Geliştirilen node'ların veri tiplerini ve şemalarını doğrulama.
  * `Plugin Boilerplate Generator:` Üçüncü partiler için manifest ve kod şablonları üretme.
  * `Dependency Resolver:` Eklentiler arası bağımlılık çakışmalarını tespit etme.

---

## Faz 4 — AI Team

### Agent 07 — LLM Integration Agent
* **Rol:** Dil modellerinin entegrasyonu ve MCP araç çağrıları.
* **Yetkinlikler:** OpenAI, Anthropic, Gemini, Ollama, MCP.
* **Sorumluluklar:** LLM Node'ları, Prompt Framework, Tool Calling.
* **Skills (Yetenekler & Araçlar):**
  * `MCP Gateway Client:` Model Context Protocol sunucularını keşfetme ve bağlama.
  * `Dynamic Tool Caller:` Ajanların dış sistemleri (git, dosya vb.) kontrol etmesini sağlama.
  * `Prompt Template Optimizer:` Model token tüketimini azaltan sistem promptları üretme.

### Agent 08 — Multi-Agent Architect
* **Rol:** Çoklu ajan koordinasyonu ve hafıza mimarisi.
* **Yetkinlikler:** LangGraph, CrewAI, AutoGen, Agent Memory.
* **Ürettiği Dokümanlar:** Agent Runtime, Agent Teams, Reflection Loops.
* **Skills (Yetenekler & Araçlar):**
  * `LangGraph Multi-Agent Router:` Ajanlar arası görev dağılımı ve yönlendirme.
  * `Shared Memory Manager:` Kısa ve uzun vadeli ajan belleklerini (Vector Store/Redis) bağlama.
  * `Consensus Mechanism Engine:` Ajanlar arası oylama ve supervisor onay mekanizması kurma.

---

## Faz 5 — Asset Generation Team
Bu ekip vizyonunuz için kritik öneme sahiptir.

### Agent 09 — Image Pipeline Agent
* **Yetkinlikler:** Flux, SDXL, ComfyUI.
* **Sorumluluklar:** Görsel üretim node'ları.
* **Skills (Yetenekler & Araçlar):**
  * `ComfyUI API Client:` ComfyUI JSON şemalarını API üzerinden tetikleme.
  * `Flux/SDXL Prompt Parser:` Sanatsal promptları ve parametreleri ayrıştırma.
  * `Image Upscaler & ControlNet Configurator:` Çözünürlük artırma ve poz/iskelet referansı yerleştirme.

### Agent 10 — 3D Pipeline Agent
* **Yetkinlikler:** Meshy, Tripo, Rodin, Hunyuan3D, Blender.
* **Sorumluluklar:** Mesh Pipeline, Retopo, UV, Rigging.
* **Skills (Yetenekler & Araçlar):**
  * `Meshy & Tripo API Connectors:` 3D modelleri bulutta veya yerelde üretme API'si.
  * `Blender Python Automator:` Auto-retopology ve UV unwrap işlemlerini Python ile Blender'da çalıştırma.
  * `Mesh Optimization Pipeline:` Poligon sayısı (poly count) düşürme ve LOD üretme.

### Agent 11 — Audio Pipeline Agent
* **Yetkinlikler:** Suno, ElevenLabs, XTTS.
* **Sorumluluklar:** Müzik, Seslendirme, SFX.
* **Skills (Yetenekler & Araçlar):**
  * `Suno/Udio API Wrapper:` Müzik promptlarından döngüsel (loop) sesler üretme.
  * `ElevenLabs Voice Cloner:` Karakter ses profilleri çıkarma ve seslendirme üretimi.
  * `MetaSound Schema Generator:` Unreal Engine için MetaSound yapısı tasarlama.

### Agent 12 — Video Pipeline Agent
* **Yetkinlikler:** Veo, Runway, Kling, Luma.
* **Sorumluluklar:** Video node'ları.
* **Skills (Yetenekler & Araçlar):**
  * `Runway/Veo API Integrator:` Sinematik ara sahneler ve fragmanlar üretme.
  * `Frame Interpolator:` Videolar arası geçişleri yumuşatma ve FPS artırma.

---

## Faz 6 — Game Development Team
Oyun geliştirme hedefleriniz için özel ekiptir.

### Agent 13 — Unreal Architect Agent
* **Yetkinlikler:** Unreal Engine 5.8, Blueprint, GAS, Niagara, PCG, Asset Management.
* **Sorumluluklar:** Unreal Integration Layer.
* **Skills (Yetenekler & Araçlar):**
  * `GAS Blueprint Compiler:` Oynanabilir karakterler için Gameplay Ability System tanımlama.
  * `Niagara System Template Builder:` AI parametreli görsel efekt şablonları üretme.
  * `Unreal Folder Structure Validator:` Content klasörü isimlendirme standartlarını denetleme.

### Agent 14 — Unreal MCP Agent
* **Yetkinlikler:** UE MCP, Python API, Editor Automation.
* **Sorumluluklar:** MCP Tool Mapping.
* **Skills (Yetenekler & Araçlar):**
  * `Unreal MCP Server Connector:` Unreal Engine editörünü dış dünyaya API ile açma.
  * `Editor Utility Python Invoker:` Editör içi otomatik asset import ve Blueprint bağlama.

### Agent 15 — Technical Artist Agent
* **Yetkinlikler:** Blender, Houdini, Substance, Unreal.
* **Sorumluluklar:** Asset Validation, Asset Optimization.
* **Skills (Yetenekler & Araçlar):**
  * `Substance Material Generator:` AI dokularını PBR materyal kanallarına (normal, roughness vb.) eşleme.
  * `LOD & Collision Validator:` Modellerde çarpışma (collision) ve performans kontrolü.

---

## Faz 7 — Infrastructure Team

### Agent 16 — DevOps Agent
* **Yetkinlikler:** Kubernetes, Docker, AWS, Azure, GCP.
* **Sorumluluklar:** Worker Cluster, Deployment.
* **Skills (Yetenekler & Araçlar):**
  * `Kubernetes Pod AutoScaler:` GPU iş yüküne göre dinamik worker ölçekleme.
  * `Docker Container Builder:` Yeni AI modellerini içeren çalışma konteynerleri oluşturma.

### Agent 17 — Database Architect Agent
* **Yetkinlikler:** PostgreSQL, Vector DB, Redis.
* **Sorumluluklar:** ERD, Query Optimization.
* **Skills (Yetenekler & Araçlar):**
  * `Vector DB Indexer (Qdrant/Weaviate):` RAG aramaları için verimli indeksler kurma.
  * `Postgres Partition Manager:` Execution loglarını zaman bazlı bölümlere ayırma.

### Agent 18 — Security Agent
* **Yetkinlikler:** OAuth, RBAC, Secrets, Audit.
* **Sorumluluklar:** Security Review.
* **Skills (Yetenekler & Araçlar):**
  * `Vault Secret Manager:` API anahtarlarını güvenli referanslama.
  * `RBAC Configurator:` Organizasyon, proje ve workspace yetkilerini doğrulama.

---

## Faz 8 — QA Team

### Agent 19 — QA Architect Agent
* **Yetkinlikler:** Test Automation, Integration Testing, Contract Testing.
* **Sorumluluklar:** Test Strategy.
* **Skills (Yetenekler & Araçlar):**
  * `Integration Test Automator:` Node bağlantılarının veri akışını simüle ederek test etme.
  * `Mock API Generator:` AI servisleri kapalıyken bile çalışabilecek test mock'ları yazma.

### Agent 20 — Performance Agent
* **Yetkinlikler:** Profiling, Load Testing, GPU Monitoring.
* **Sorumluluklar:** Ölçeklenebilirlik.
* **Skills (Yetenekler & Araçlar):**
  * `GPU VRAM Monitor:` Çalışma sırasında GPU hafıza taşmalarını engelleme.
  * `Load Test Script Runner:` Eş zamanlı 1000 workflow çalıştırma yük testleri yapma.

---

## Gerçekçi MVP Kadrosu (8 Ajan)
1. **Chief Architect Agent:** Mimari omurga ve entegrasyon şemaları.
2. **Product Owner Agent:** PRD ve Sprint Planlama.
3. **React Architect Agent:** Frontend Node Editor.
4. **Runtime Engineer Agent:** DAG motoru ve Scheduler.
5. **LLM Integration Agent:** OpenAI/Gemini/Claude & MCP.
6. **Multi-Agent Architect Agent:** Ajan ekipleri koordinasyonu.
7. **3D Pipeline Agent:** AI 3D Model üretimi ve Blender optimizasyonu.
8. **Unreal Architect Agent:** Unreal Engine entegrasyonu ve editör otomasyonu.