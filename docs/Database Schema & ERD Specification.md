# AETHER FORGE

# Database Schema & ERD Specification

Version: 1.0

Status: Draft

Dependencies:

* Workspace & Project Architecture
* Workflow Runtime Architecture
* Multi-Agent Framework
* Asset Pipeline Specification

Database Engine:

* PostgreSQL 17+

Future Support:

* CockroachDB
* YugabyteDB

---

# 1. Purpose

Bu doküman Aether Forge'un kalıcı veri modelini tanımlar.

Amaç:

* Multi-tenant mimari
* Workflow yönetimi
* Asset yönetimi
* Agent yönetimi
* Execution geçmişi
* Knowledge Base
* Cost tracking
* Marketplace

için ölçeklenebilir veri modeli oluşturmaktır.

---

# 2. Architectural Principles

## AP-001

Runtime State ve Business Data ayrılmalıdır.

---

## AP-002

Asset Metadata ve Asset Files ayrılmalıdır.

---

## AP-003

Knowledge Base ayrı servis olarak tasarlanmalıdır.

---

## AP-004

Workflow Definition ve Workflow Execution ayrılmalıdır.

---

# 3. High Level ERD

```text
Organization

└── Workspace

     └── Project

          ├── Workflow

          ├── Asset

          ├── Agent

          ├── Document

          ├── Knowledge

          ├── Execution

          └── Build
```

---

# 4. Organizations

```sql
organizations
```

| Column     | Type      |
| ---------- | --------- |
| id         | uuid      |
| name       | varchar   |
| slug       | varchar   |
| created_at | timestamp |
| updated_at | timestamp |

---

# 5. Workspaces

```sql
workspaces
```

| Column          | Type      |
| --------------- | --------- |
| id              | uuid      |
| organization_id | uuid      |
| name            | varchar   |
| description     | text      |
| created_at      | timestamp |

---

# 6. Projects

```sql
projects
```

| Column       | Type      |
| ------------ | --------- |
| id           | uuid      |
| workspace_id | uuid      |
| name         | varchar   |
| description  | text      |
| project_type | varchar   |
| status       | varchar   |
| created_at   | timestamp |

---

# 7. Project Settings

```sql
project_settings
```

Örnek:

```text
Art Style

Target Platform

Language

Quality Profile
```

---

# 8. Users

```sql
users
```

| Column       | Type      |
| ------------ | --------- |
| id           | uuid      |
| email        | varchar   |
| display_name | varchar   |
| created_at   | timestamp |

---

# 9. Roles

```sql
roles
```

Örnek:

```text
Owner

Admin

Producer

Artist

Developer

Viewer
```

---

# 10. Project Members

```sql
project_members
```

Many-to-many ilişki.

---

# 11. Workflows

```sql
workflows
```

| Column         | Type    |
| -------------- | ------- |
| id             | uuid    |
| project_id     | uuid    |
| name           | varchar |
| schema_version | varchar |
| workflow_json  | jsonb   |
| version        | varchar |

---

# 12. Workflow Versions

```sql
workflow_versions
```

Amaç:

Version history.

---

# 13. Workflow Templates

```sql
workflow_templates
```

Örnek:

```text
Character Generator

Quest Generator

Dialogue Generator
```

---

# 14. Workflow Executions

```sql
workflow_executions
```

| Column      | Type      |
| ----------- | --------- |
| id          | uuid      |
| workflow_id | uuid      |
| status      | varchar   |
| started_at  | timestamp |
| finished_at | timestamp |
| cost        | decimal   |

---

# 15. Node Executions

```sql
node_executions
```

Her node çalışması saklanır.

---

# 16. Agent Teams

```sql
agent_teams
```

Örnek:

```text
Narrative Team

Art Team

Technical Team
```

---

# 17. Agents

```sql
agents
```

| Column        | Type    |
| ------------- | ------- |
| id            | uuid    |
| team_id       | uuid    |
| name          | varchar |
| type          | varchar |
| configuration | jsonb   |

---

# 18. Agent Memory

```sql
agent_memories
```

Agent bazlı hafıza.

---

# 19. Agent Tasks

```sql
agent_tasks
```

| Column   | Type    |
| -------- | ------- |
| id       | uuid    |
| agent_id | uuid    |
| goal     | text    |
| status   | varchar |

---

# 20. Agent Messages

```sql
agent_messages
```

Agent iletişim geçmişi.

---

# 21. Documents

```sql
documents
```

| Column       | Type    |
| ------------ | ------- |
| id           | uuid    |
| project_id   | uuid    |
| name         | varchar |
| type         | varchar |
| storage_path | text    |

---

# 22. Document Chunks

```sql
document_chunks
```

RAG için.

---

# 23. Embeddings

Logical Entity

Fiziksel olarak:

```text
Vector Database
```

üzerinde tutulabilir.

---

# 24. Knowledge Bases

```sql
knowledge_bases
```

---

# 25. Knowledge Sources

```sql
knowledge_sources
```

Örnek:

```text
PDF

Markdown

Wiki

Web
```

---

# 26. Assets

```sql
assets
```

| Column     | Type    |
| ---------- | ------- |
| id         | uuid    |
| project_id | uuid    |
| asset_type | varchar |
| name       | varchar |
| version    | varchar |

---

# 27. Asset Files

```sql
asset_files
```

| Column   | Type   |
| -------- | ------ |
| id       | uuid   |
| asset_id | uuid   |
| path     | text   |
| size     | bigint |

---

# 28. Asset Versions

```sql
asset_versions
```

Version geçmişi.

---

# 29. Asset Dependencies

```sql
asset_dependencies
```

Örnek:

```text
Character

↓

Material

↓

Texture
```

---

# 30. Asset Reviews

```sql
asset_reviews
```

Review geçmişi.

---

# 31. Asset Tags

```sql
asset_tags
```

---

# 32. Builds

```sql
builds
```

Örnek:

```text
Windows Build

Android Build
```

---

# 33. Build Artifacts

```sql
build_artifacts
```

Paket dosyaları.

---

# 34. MCP Connections

```sql
mcp_connections
```

Örnek:

```text
Unreal

GitHub

Blender
```

---

# 35. MCP Tool Calls

```sql
mcp_tool_calls
```

Audit amacıyla.

---

# 36. Providers

```sql
providers
```

Örnek:

```text
OpenAI

Anthropic

Google

Meshy

Suno
```

---

# 37. Provider Usage

```sql
provider_usage
```

Takip edilir:

```text
Tokens

Images

Audio

Video

3D
```

---

# 38. Costs

```sql
cost_records
```

---

## Categories

```text
LLM

Image

Audio

Video

3D

Storage
```

---

# 39. Runtime Events

```sql
runtime_events
```

Merkezi event log.

---

# 40. Execution Logs

```sql
execution_logs
```

---

# 41. Notifications

```sql
notifications
```

---

# 42. Secrets

API key tutulmaz.

Sadece referans.

```sql
secret_references
```

---

# 43. Marketplace Packages

```sql
marketplace_packages
```

---

# 44. Marketplace Reviews

```sql
marketplace_reviews
```

---

# 45. Plugin Registry

```sql
plugins
```

---

# 46. Plugin Versions

```sql
plugin_versions
```

---

# 47. Metrics

```sql
metrics
```

Örnek:

```text
Execution Time

GPU Usage

Success Rate
```

---

# 48. Audit Trail

```sql
audit_logs
```

Kayıt:

```text
Who

What

When

Result
```

---

# 49. Soft Delete Strategy

Kritik tablolar:

```text
deleted_at
```

alanı kullanmalıdır.

---

# 50. Indexing Strategy

Öncelikli indeksler:

```sql
project_id

workflow_id

execution_id

asset_id

agent_id
```

---

# 51. Partition Strategy

Büyük tablolar:

```text
execution_logs

runtime_events

provider_usage

mcp_tool_calls
```

zaman bazlı partition edilmelidir.

---

# 52. Multi-Tenant Strategy

Tenant Key:

```sql
organization_id
```

Tüm kritik tablolarda bulunmalıdır.

---

# 53. Backup Strategy

Destek:

```text
Daily

Weekly

Monthly
```

---

# 54. Data Retention

Önerilen:

```text
Logs

90 Days

Metrics

180 Days

Audit

3 Years
```

---

# 55. Future Tables

Planned:

```text
Agent Reputation

Agent Marketplace

Asset Marketplace

Federated Workflows

Distributed Agents
```

---

# 56. Canonical Project Example

```text
Workspace

↓

Project CULT

↓

Assets

Documents

Workflows

Agent Teams

Knowledge Base

Builds
```

Bu yapının tamamı veri tabanında temsil edilebilmelidir.

---

# 57. Golden Rule

Veri modeli;

Runtime'dan,

Provider'lardan,

Plugin implementasyonlarından

bağımsız olmalıdır.

Veri tabanı yalnızca sistemin durumunu temsil etmelidir.

İş mantığı servis katmanlarında yaşamalıdır.
