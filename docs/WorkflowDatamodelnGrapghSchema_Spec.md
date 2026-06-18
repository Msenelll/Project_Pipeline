# AETHER FORGE

# Workflow Data Model & Graph Schema Specification

Version: 1.0

Status: Draft

Owner: Platform Architecture Team

Dependencies:

* Node SDK Specification v1.0
* Workflow Runtime Architecture v1.0

---

# 1. Purpose

Bu doküman Aether Forge workflow dosya formatını ve graph veri modelini tanımlar.

Amaç:

* Workflow serialization
* Workflow import/export
* Marketplace paylaşımı
* Git versioning
* Backward compatibility
* Runtime execution

için ortak standart oluşturmaktır.

---

# 2. Design Goals

## DG-001

Human Readable

Workflow JSON okunabilir olmalıdır.

---

## DG-002

Git Friendly

Değişiklikler Git diff içerisinde anlaşılabilir olmalıdır.

---

## DG-003

Version Safe

Eski workflow'lar yeni sürümlerde çalışabilmelidir.

---

## DG-004

Provider Independent

Workflow belirli AI sağlayıcılarına bağımlı olmamalıdır.

---

## DG-005

Marketplace Ready

Workflow'lar paylaşılabilir olmalıdır.

---

# 3. Core Domain Model

```text
Workspace
 ├── Workflows
 │
 ├── Assets
 │
 ├── Variables
 │
 ├── Secrets
 │
 ├── Templates
 │
 └── Plugins
```

---

# 4. Workflow Structure

```text
Workflow
 ├── Metadata
 ├── Nodes
 ├── Connections
 ├── Variables
 ├── Groups
 ├── Notes
 ├── Assets
 └── Settings
```

---

# 5. Workflow Root Object

```typescript
interface WorkflowDefinition
{
    schemaVersion:string;

    workflowId:string;

    name:string;

    description:string;

    author:string;

    createdAt:string;

    updatedAt:string;

    tags:string[];

    nodes:NodeInstance[];

    connections:Connection[];

    groups:Group[];

    variables:Variable[];

    settings:WorkflowSettings;
}
```

---

# 6. Schema Versioning

Her workflow schema versiyonu taşımalıdır.

Örnek:

```json
{
  "schemaVersion":"1.0.0"
}
```

---

# 7. Workflow Metadata

```json
{
  "name":"Game Asset Pipeline",
  "author":"Mehmet",
  "description":"Generate character assets",
  "tags":["game","meshy","unreal"]
}
```

---

# 8. Node Instance Model

Bir plugin içerisindeki node'un workflow üzerindeki örneği.

```typescript
interface NodeInstance
{
    id:string;

    pluginId:string;

    nodeType:string;

    version:string;

    position:Position;

    configuration:any;

    ui:UIState;
}
```

---

# 9. Position Model

```typescript
interface Position
{
    x:number;

    y:number;
}
```

---

# 10. Node Configuration

Node ayarları burada tutulur.

Örnek:

```json
{
  "model":"gpt-5",
  "temperature":0.7,
  "maxTokens":4000
}
```

---

# 11. Node UI State

UI bilgileri runtime'dan ayrılmalıdır.

```typescript
interface UIState
{
    collapsed:boolean;

    color:string;

    width:number;

    height:number;
}
```

---

# 12. Connection Model

```typescript
interface Connection
{
    id:string;

    sourceNode:string;

    sourcePort:string;

    targetNode:string;

    targetPort:string;
}
```

---

# 13. Connection Rules

Bağlantılar:

✔ Compatible Types

✔ Explicit Mapping

✔ Directed

olmalıdır.

---

# 14. Port Mapping Example

```text
Prompt Output

↓

GPT Prompt Input
```

---

# 15. Data Type Compatibility Matrix

Örnek:

```text
String -> String

String -> Prompt

Prompt -> LLM

Image -> Image

Mesh -> Mesh

Audio -> Audio
```

---

Geçersiz:

```text
Mesh -> Audio

Image -> Blueprint

CSV -> Material
```

---

# 16. Variable System

Workflow seviyesinde değişken tanımlanabilir.

```typescript
interface Variable
{
    id:string;

    name:string;

    type:string;

    value:any;
}
```

---

# 17. Variable Scope

Desteklenen scope'lar:

```text
Global

Workflow

Group

Node
```

---

# 18. Secret References

Workflow dosyasında API key tutulmaz.

Örnek:

```json
{
  "provider":"OpenAI",
  "secretId":"secret_001"
}
```

---

# 19. Group Model

Node'lar mantıksal olarak gruplanabilir.

```typescript
interface Group
{
    id:string;

    name:string;

    color:string;

    nodes:string[];
}
```

---

# 20. Comment Nodes

Workflow içerisine açıklama eklenebilir.

```typescript
interface CommentNode
{
    id:string;

    text:string;
}
```

---

# 21. Asset References

Workflow asset'leri referanslayabilir.

```typescript
interface AssetReference
{
    id:string;

    type:string;

    path:string;
}
```

---

# 22. Supported Asset Types

```text
Image

Audio

Video

Mesh

Texture

Material

Animation

Document

Blueprint
```

---

# 23. Runtime State Separation

Workflow JSON:

Statik veri

Runtime State:

Dinamik veri

Ayrı tutulmalıdır.

---

# 24. Execution Snapshot

```typescript
interface WorkflowSnapshot
{
    executionId:string;

    nodeStates:any;

    variables:any;

    outputs:any;
}
```

---

# 25. Workflow Template Model

Template'ler workflow'dan türetilir.

```typescript
interface WorkflowTemplate
{
    id:string;

    name:string;

    category:string;

    workflowDefinition:any;
}
```

---

# 26. Marketplace Package Model

```typescript
interface WorkflowPackage
{
    metadata:any;

    workflow:any;

    requiredPlugins:string[];

    previewImages:string[];
}
```

---

# 27. Dependency System

Workflow gerekli pluginleri tanımlar.

```json
{
  "requiredPlugins":[
    "openai",
    "meshy",
    "unreal"
  ]
}
```

---

# 28. Import Validation

Import sırasında kontrol edilir:

```text
Schema Version

Plugin Availability

Missing Nodes

Connection Integrity
```

---

# 29. Export Modes

## Full Export

Her şeyi içerir.

---

## Template Export

Node yapısı içerir.

Asset içermez.

---

## Marketplace Export

Metadata içerir.

Preview içerir.

---

# 30. Workflow Categories

```text
AI Agent

Document Processing

RAG

Game Development

Image Generation

Audio Generation

Video Generation

3D Asset Generation

Unreal Automation

Custom
```

---

# 31. Graph Constraints

Workflow graph:

✔ Directed

✔ Typed

✔ Acyclic

olmalıdır.

---

İstisna:

Loop Node

State Machine Node

Agent Node

---

# 32. Loop Representation

```text
ForEach

While

Map

Reduce
```

özel runtime node'ları ile temsil edilir.

---

# 33. Agent Graph Representation

Agent workflow'ları DAG dışına çıkabilir.

Örnek:

```text
Planner

↓

Worker

↓

Reviewer

↓

Planner
```

Bu durumda runtime agent mode kullanır.

---

# 34. Workflow Diff Support

Git için her nesne:

```text
Stable ID

Version

Timestamp
```

taşımalıdır.

---

# 35. Migration System

Schema değiştiğinde migration uygulanır.

Örnek:

```text
1.0.0

↓

1.1.0

↓

2.0.0
```

---

# 36. Migration Contract

```typescript
interface Migration
{
    from:string;

    to:string;

    execute();
}
```

---

# 37. Validation Pipeline

Workflow açılırken:

```text
Load

↓

Validate

↓

Migrate

↓

Compile

↓

Execute
```

---

# 38. Compile Stage

Runtime graph'i optimize eder.

Örnek:

```text
Node Fusion

Dead Node Removal

Parallel Detection

Cache Planning
```

---

# 39. Future Extensions

Planned:

* GraphQL Schema
* Binary Workflow Format
* Cloud Workflow Storage
* Workflow Signing
* Workflow Encryption
* Team Collaboration Metadata

---

# 40. Canonical Workflow Example

```text
Prompt

↓

GPT

↓

Character Generator

↓

Meshy

↓

Retopology

↓

Texture Generator

↓

FBX Export

↓

Unreal Import

↓

Create Blueprint
```

Bu workflow tek bir JSON dosyası olarak temsil edilebilmelidir.

---

# 41. Golden Rule

Workflow dosyası;

UI'dan,

Runtime'dan,

Provider'lardan,

Node implementasyonlarından

bağımsız olmalıdır.

Workflow yalnızca graph'ın ne olduğunu tanımlar.

Graph'ın nasıl çalıştırılacağı Runtime Engine'in sorumluluğundadır.
