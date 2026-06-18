# AETHER FORGE

# Plugin Development Kit (PDK) Specification

Version: 1.0

Status: Draft

Dependencies:

* Node SDK Specification
* Workflow Runtime Architecture
* Graph Schema Specification

---

# 1. Purpose

Plugin Development Kit (PDK), üçüncü taraf geliştiricilerin Aether Forge platformuna yeni yetenekler ekleyebilmesini sağlayan resmi geliştirme standardıdır.

PDK sayesinde geliştiriciler:

* Yeni Node'lar
* Yeni Provider'lar
* Yeni Agent'lar
* Yeni Asset Pipeline'ları
* Yeni Runtime Extension'ları

oluşturabilir.

---

# 2. Design Goals

## DG-001

Plugin geliştirme süresi 30 dakikanın altında olmalıdır.

## DG-002

Core sistem değişmeden genişleyebilmelidir.

## DG-003

Node marketplace desteklenmelidir.

## DG-004

Plugin izolasyonu sağlanmalıdır.

## DG-005

Version uyumluluğu korunmalıdır.

---

# 3. Plugin Types

## Node Plugin

Yeni node sağlar.

Örnek:

* GPT Node
* Meshy Node
* Suno Node

---

## Provider Plugin

Yeni servis entegrasyonu sağlar.

Örnek:

* OpenAI
* Claude
* Gemini
* Meshy

---

## Agent Plugin

Yeni agent davranışları sağlar.

Örnek:

* Narrative Agent
* Quest Agent
* Character Agent

---

## Integration Plugin

Harici sistem bağlantıları.

Örnek:

* Unreal Engine
* Blender
* Jira
* GitHub

---

## Runtime Extension

Runtime davranışını genişletir.

Örnek:

* Custom Scheduler
* Custom Cache
* Custom Storage

---

# 4. Plugin Package Structure

```text
plugin/

manifest.json

README.md

CHANGELOG.md

icon.svg

src/

assets/

tests/

examples/
```

---

# 5. Manifest Specification

```json
{
  "id":"meshy-plugin",
  "name":"Meshy Plugin",
  "version":"1.0.0",
  "author":"Aether Forge",
  "license":"MIT",
  "sdkVersion":"1.0.0",
  "entry":"dist/index.js"
}
```

---

# 6. Plugin Lifecycle

Install

↓

Validate

↓

Load

↓

Register

↓

Initialize

↓

Execute

↓

Unload

---

# 7. Plugin Registry

Runtime başlangıcında tüm pluginler kaydedilir.

```typescript
PluginRegistry.register(plugin);
```

---

# 8. Capability System

Plugin yeteneklerini açıkça beyan eder.

```typescript
{
  capabilities:[
    "node",
    "provider",
    "agent"
  ]
}
```

---

# 9. Permission System

Pluginler varsayılan olarak hiçbir yetkiye sahip değildir.

Talep edilen izinler:

```text
FilesystemRead
FilesystemWrite

NetworkAccess

GPUAccess

MCPAccess

UnrealAccess

SecretAccess
```

---

# 10. Security Sandbox

Pluginler sandbox ortamında çalışır.

Kısıtlamalar:

* Memory Limit
* CPU Limit
* Network Policy
* File Policy

---

# 11. Provider Abstraction

Her provider ortak sözleşmeye uymalıdır.

```typescript
interface IProvider
{
  connect();

  authenticate();

  execute();

  disconnect();
}
```

---

# 12. Agent Plugin Contract

```typescript
interface IAgentPlugin
{
  plan();

  execute();

  review();

  reflect();
}
```

---

# 13. Asset Generator Contract

```typescript
interface IAssetGenerator
{
  generate();

  validate();

  export();
}
```

---

# 14. Version Compatibility

Semantic Versioning zorunludur.

```text
Major.Minor.Patch
```

Örnek:

```text
1.2.5
```

---

# 15. Dependency Management

Plugin bağımlılıklarını tanımlar.

```json
{
  "dependencies":[
    "openai-plugin",
    "filesystem-plugin"
  ]
}
```

---

# 16. Plugin Marketplace Requirements

Marketplace'e yüklenen pluginler:

* Test raporu içermeli
* Güvenlik taramasından geçmeli
* Manifest doğrulaması almalı
* Lisans bilgisi içermeli

---

# 17. Test Requirements

Minimum:

Unit Tests

Integration Tests

Runtime Validation

---

# 18. Example Plugin

Meshy Character Generator

Input:

Character Prompt

↓

Meshy API

↓

GLB Output

↓

Texture Output

↓

Metadata Output

---

# 19. Plugin Signing

Future Scope

Pluginler dijital olarak imzalanmalıdır.

---

# 20. Golden Rule

Core sistem hiçbir sağlayıcıya bağımlı değildir.

Yeni özellikler mümkün olduğunca plugin olarak geliştirilmelidir.
