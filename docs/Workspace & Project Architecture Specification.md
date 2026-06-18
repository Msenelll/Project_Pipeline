# AETHER FORGE

# Workspace & Project Architecture Specification

Version: 1.0

Status: Draft

Dependencies:

* Workflow Runtime Architecture
* Multi-Agent Framework
* Asset Pipeline Specification
* Unreal Integration Specification

---

# 1. Purpose

Bu doküman Aether Forge'un üst seviye organizasyon modelini tanımlar.

Amaç:

Workflow'ları yönetmek değil,

tam bir dijital üretim stüdyosunu yönetebilmektir.

---

# 2. Vision

Aether Forge;

bir workflow editörü değildir.

Bir kullanıcının veya ekibin:

* Fikirlerini
* Dokümanlarını
* Agent ekiplerini
* Assetlerini
* Workflow'larını
* Üretim süreçlerini

tek bir platform içerisinde yönetebildiği üretim işletim sistemidir.

---

# 3. Hierarchy

```text
Organization

 └── Workspace

      └── Project

           ├── Knowledge Base

           ├── Agent Teams

           ├── Workflows

           ├── Assets

           ├── Documents

           ├── Templates

           ├── MCP Connections

           └── Build Outputs
```

---

# 4. Organization

En üst seviye konteynerdir.

Örnek:

```text
Aether Games Studio

Indie Team

Freelancer Workspace
```

---

# 5. Workspace

Workspace üretim ortamıdır.

Birden fazla proje içerebilir.

Örnek:

```text
Turkish Mythology Studio

Sci-Fi Studio

Client Projects
```

---

# 6. Workspace Model

```typescript
interface Workspace
{
    id:string;

    name:string;

    description:string;

    owner:string;

    projects:string[];

    settings:any;
}
```

---

# 7. Project

Temel üretim birimidir.

Örnek:

```text
PROJECT_CULT

PROJECT_AETHER

PROJECT_NOMAD
```

---

# 8. Project Model

```typescript
interface Project
{
    id:string;

    name:string;

    description:string;

    workflows:string[];

    assets:string[];

    documents:string[];

    knowledgeBase:string;
}
```

---

# 9. Project Types

```text
Game

Film

Animation

Marketing

Education

Research

Custom
```

---

# 10. Project Lifecycle

```text
Concept

↓

Pre-Production

↓

Production

↓

Polish

↓

Release

↓

Maintenance
```

---

# 11. Knowledge Base

Her projenin kendi bilgi tabanı vardır.

---

## İçerikler

```text
Lore

Rules

Design Decisions

Technical Documentation

Production Notes
```

---

# 12. Knowledge Architecture

```text
Project

↓

Knowledge Base

↓

Vector Store

↓

Embeddings

↓

Agent Access
```

---

# 13. Document Library

Destek:

```text
GDD

TDD

NDD

ADD

PAS

Sprint Plans

Meeting Notes
```

---

# 14. Asset Library

Projenin tüm assetleri burada tutulur.

---

## Categories

```text
Characters

Enemies

Weapons

Buildings

Environment

Animations

Audio

Music

Video

UI
```

---

# 15. Asset Registry

Her asset kayıt altına alınır.

```typescript
interface AssetRecord
{
    assetId:string;

    version:string;

    dependencies:string[];
}
```

---

# 16. Workflow Library

Tüm workflow'lar merkezi olarak tutulur.

Örnek:

```text
Character Pipeline

Weapon Pipeline

Dialogue Pipeline

Build Pipeline
```

---

# 17. Workflow Collections

Workflow'lar gruplanabilir.

```text
Art Pipelines

Audio Pipelines

Gameplay Pipelines

Documentation Pipelines
```

---

# 18. Template Library

Hazır şablonlar.

---

## Project Templates

```text
RPG

Roguelike

Metroidvania

Shooter

Visual Novel
```

---

## Workflow Templates

```text
Character Generator

Quest Generator

Voice Generator

Build Automation
```

---

# 19. Agent Teams

Proje bazında ekipler tanımlanır.

---

## Example

```text
Narrative Team

Art Team

Audio Team

Technical Team
```

---

# 20. Team Structure

```text
Director Agent

↓

Lead Agents

↓

Worker Agents
```

---

# 21. Agent Workspace

Her agent için:

```text
Memory

Tasks

Files

Logs

Tools
```

izole edilir.

---

# 22. MCP Connection Registry

Proje araç bağlantıları.

Örnek:

```text
Unreal

Blender

GitHub

Jira

Notion
```

---

# 23. Build Outputs

Üretilen sonuçlar.

---

## Examples

```text
Game Builds

Documentation Exports

Asset Packs

Video Packages
```

---

# 24. Project Variables

Global değişkenler.

Örnek:

```text
Art Style

Target Platform

Target Audience

Project Language
```

---

# 25. Project Profiles

Hazır yapılandırmalar.

---

## Indie Profile

```text
1-5 People

Limited Budget

Fast Iteration
```

---

## AA Profile

```text
10-50 People

Medium Scope
```

---

## AAA Profile

```text
50+ People

Large Scope
```

---

# 26. Asset Dependency Graph

Takip edilir.

```text
Character

↓

Animations

↓

Blueprint

↓

Quest Data
```

---

# 27. Project Dashboard

Gösterilecek bilgiler:

```text
Asset Count

Workflow Count

Build Status

Agent Activity

Costs
```

---

# 28. Production Metrics

Takip edilir.

```text
Assets Generated

Documents Generated

Agent Productivity

Execution Time

Cost
```

---

# 29. Cost Center Tracking

Kategori bazlı maliyet.

```text
LLM

Images

3D

Audio

Video
```

---

# 30. Workspace Storage

Mantıksal bölümler:

```text
Documents

Assets

Workflows

Templates

Logs

Builds
```

---

# 31. Project Permissions

Roller:

```text
Owner

Admin

Producer

Artist

Developer

Viewer
```

---

# 32. Review System

Asset review.

Workflow review.

Document review.

---

# 33. Approval Pipeline

```text
Generate

↓

Review

↓

Approve

↓

Publish
```

---

# 34. Publishing System

Destek:

```text
Internal

Marketplace

External Export
```

---

# 35. Snapshot System

Proje anlık görüntüsü.

İçerir:

```text
Assets

Workflows

Knowledge

Documents
```

---

# 36. Recovery System

Snapshot üzerinden geri dönüş.

---

# 37. Studio Mode

Future Scope

Birden fazla workspace'i yönetir.

---

# 38. Enterprise Mode

Future Scope

Çok ekipli organizasyonlar.

---

# 39. Digital Studio Example

```text
Project CULT

Knowledge Base

↓

Narrative Team

↓

Art Team

↓

3D Team

↓

Audio Team

↓

Technical Team

↓

Unreal Build Team
```

---

# 40. Golden Rule

Workflow'lar tek başına ürün değildir.

Asıl ürün:

Bilgi,

Agent,

Asset,

Doküman,

Workflow

arasındaki ilişkileri yöneten üretim ortamıdır.
