# AETHER FORGE

# Node SDK Specification

Version: 1.0

Status: Draft

Owner: Platform Architecture Team

---

# 1. Purpose

Node SDK, üçüncü parti geliştiricilerin Aether Forge platformuna yeni node tipleri ekleyebilmesini sağlayan standart geliştirme sözleşmesidir.

Amaç:

* Plugin geliştirilebilirlik
* Düşük entegrasyon maliyeti
* Runtime güvenliği
* UI standardizasyonu
* Workflow uyumluluğu

sağlamaktır.

---

# 2. Design Principles

## P1 - Node First

Platformun temel birimi Node'dur.

Tüm işlemler node üzerinden gerçekleştirilir.

---

## P2 - Plugin First

Core sistem herhangi bir AI sağlayıcısına bağımlı değildir.

OpenAI Node da,
Meshy Node da,
Unreal Node da

aynı SDK ile geliştirilir.

---

## P3 - Provider Agnostic

Node'lar belirli sağlayıcılara bağımlı olmamalıdır.

Örnek:

LLM Node

↓

OpenAI

Claude

Gemini

DeepSeek

Ollama

seçebilmelidir.

---

## P4 - Typed Data Flow

Tüm bağlantılar tip güvenli olmalıdır.

---

## P5 - Deterministic Runtime

Node execution her zaman aynı contract ile çalışmalıdır.

---

# 3. Node Lifecycle

```text
Register

↓

Initialize

↓

Validate

↓

Execute

↓

Emit Outputs

↓

Complete

↓

Dispose
```

---

# 4. Base Node Contract

```typescript
interface INode
{
    metadata: NodeMetadata;

    initialize(): Promise<void>;

    validate(
        context: ValidationContext
    ): ValidationResult;

    execute(
        context: ExecutionContext
    ): Promise<NodeExecutionResult>;

    dispose(): Promise<void>;
}
```

---

# 5. Node Metadata

Her node aşağıdaki bilgileri tanımlamalıdır.

```typescript
interface NodeMetadata
{
    id: string;

    name: string;

    displayName: string;

    description: string;

    category: string;

    version: string;

    author: string;

    icon: string;

    tags: string[];

    inputs: PortDefinition[];

    outputs: PortDefinition[];

    settings: SettingDefinition[];
}
```

---

# 6. Categories

Node kategorileri:

```text
Input
Output
LLM
Image
Video
Audio
3D
Document
Data
Logic
Memory
Agent
Utility
Filesystem
Cloud
GameDev
Unreal
Custom
```

---

# 7. Port Definition

```typescript
interface PortDefinition
{
    id: string;

    name: string;

    type: DataType;

    required: boolean;

    multipleConnections: boolean;
}
```

---

# 8. Supported Data Types

## Primitive

```text
String
Number
Boolean
DateTime
Json
```

---

## Document

```text
TextDocument
MarkdownDocument
PdfDocument
WordDocument
SpreadsheetDocument
CsvDocument
```

---

## Media

```text
Image
Audio
Video
```

---

## 3D

```text
Mesh
FBX
OBJ
GLB
GLTF
USD
USDZ
Material
Texture
Rig
Animation
```

---

## AI

```text
Prompt
Embedding
KnowledgeChunk
Vector
AgentTask
AgentResult
```

---

## Unreal

```text
Blueprint
MaterialAsset
NiagaraAsset
WidgetBlueprint
LevelAsset
DataAsset
```

---

# 9. Data Transfer Object (DTO)

Tüm veri paketleri standart formatta taşınır.

```typescript
interface DataPacket<T>
{
    id: string;

    type: string;

    payload: T;

    metadata: Record<string, any>;

    timestamp: string;
}
```

---

# 10. Execution Context

```typescript
interface ExecutionContext
{
    workflowId: string;

    executionId: string;

    nodeId: string;

    variables: Map<string, any>;

    memory: MemoryProvider;

    storage: StorageProvider;

    logger: Logger;

    cancellationToken: CancellationToken;
}
```

---

# 11. Execution Result

```typescript
interface NodeExecutionResult
{
    success: boolean;

    outputs: Record<string, DataPacket>;

    logs: ExecutionLog[];

    metrics: ExecutionMetrics;

    errors?: ExecutionError[];
}
```

---

# 12. Node Settings System

Node'lar ayar tanımlayabilir.

```typescript
interface SettingDefinition
{
    key: string;

    label: string;

    type: string;

    defaultValue: any;

    required: boolean;
}
```

Örnek:

```typescript
model
temperature
maxTokens
seed
resolution
```

---

# 13. Secrets Management

API key gibi bilgiler node içerisinde tutulmaz.

```typescript
interface SecretReference
{
    provider: string;

    secretId: string;
}
```

Örnek:

```text
OpenAI_API
Claude_API
Gemini_API
Meshy_API
Suno_API
```

---

# 14. Event System

Node aşağıdaki eventleri yayınlayabilir.

```text
ExecutionStarted

ExecutionProgress

ExecutionCompleted

ExecutionFailed

OutputGenerated

AssetGenerated

WarningRaised
```

---

# 15. Progress Reporting

Uzun süren işlemler desteklenmelidir.

```typescript
context.reportProgress(
    percent,
    message
);
```

Örnek:

```text
Generating Mesh

15%

Creating UVs

40%

Baking Textures

70%

Exporting FBX

95%
```

---

# 16. Error Contract

```typescript
interface NodeError
{
    code: string;

    message: string;

    severity: string;

    recoverable: boolean;
}
```

---

# 17. Retry Support

Node aşağıdaki davranışları tanımlayabilir.

```typescript
retryCount

retryDelay

timeout
```

Örnek:

```typescript
retryCount:3
retryDelay:5000
timeout:300000
```

---

# 18. Caching

Node cache destekleyebilir.

```typescript
cacheKey()

cacheTTL()
```

Örnek:

```text
LLM Response Cache

Image Cache

Mesh Cache
```

---

# 19. Streaming Support

LLM node'ları stream edebilmelidir.

```typescript
interface StreamEmitter
{
    emitChunk(chunk:string);
}
```

Örnek:

```text
ChatGPT

Claude

Gemini

DeepSeek
```

---

# 20. Batch Processing

Node birden fazla girdiyi işleyebilmelidir.

```typescript
batchSize

parallelism
```

Örnek:

```text
100 images

↓

Texture Analyzer

↓

Parallel Execution
```

---

# 21. Agent Node Contract

```typescript
interface AgentNode
extends INode
{
    plan();

    executeTask();

    evaluate();

    selfReflect();
}
```

---

# 22. 3D Asset Node Contract

```typescript
interface Asset3DNode
extends INode
{
    generateMesh();

    generateTextures();

    generateMaterials();

    export();
}
```

Desteklenen çıktılar:

```text
FBX
OBJ
GLB
GLTF
USD
USDZ
```

---

# 23. Unreal Node Contract

```typescript
interface UnrealNode
extends INode
{
    connectEditor();

    importAsset();

    createBlueprint();

    executePython();

    executeMCP();
}
```

---

# 24. Document Processing Node Contract

```typescript
interface DocumentNode
extends INode
{
    parse();

    chunk();

    embed();

    analyze();
}
```

Desteklenen formatlar:

```text
PDF
DOCX
XLSX
CSV
TXT
MD
JSON
XML
HTML
```

---

# 25. Plugin Packaging

Plugin klasör yapısı:

```text
plugin/

manifest.json

node.ts

icon.svg

README.md

assets/

tests/
```

---

# 26. Plugin Manifest

```json
{
  "id":"meshy-generator",
  "name":"Meshy Generator",
  "version":"1.0.0",
  "author":"Aether Forge",
  "entry":"node.js"
}
```

---

# 27. Marketplace Readiness

Marketplace'e yüklenen node'lar:

* Güvenlik taramasından geçmelidir
* Version semantic olmalıdır
* SDK uyumluluğu doğrulanmalıdır
* Test raporu içermelidir

---

# 28. Future Extensions

Planned SDK Extensions:

* Multi-Agent SDK
* MCP SDK
* Unreal Native SDK
* Blender SDK
* Unity SDK
* Cloud Worker SDK
* Distributed Execution SDK
* GPU Compute SDK

---

# 29. Golden Rule

Bir node;

* Girdi alır
* İşler
* Çıktı üretir

ve bunu platformun geri kalanından bağımsız olarak yapabilmelidir.

Node'lar birbirlerinin implementasyon detaylarını bilmez.

Tüm iletişim yalnızca tanımlanmış portlar ve veri paketleri üzerinden gerçekleşir.
