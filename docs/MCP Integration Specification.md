# AETHER FORGE

# MCP Integration Specification

Version: 1.0

Status: Draft

Dependencies:

* Node SDK Specification
* Workflow Runtime Architecture
* Plugin Development Kit (PDK)
* Multi-Agent Framework

---

# 1. Purpose

Bu doküman Aether Forge'un MCP (Model Context Protocol) entegrasyon mimarisini tanımlar.

Amaç:

AI Agent'ların yalnızca içerik üretmesi değil, gerçek uygulamaları ve araçları kontrol edebilmesidir.

MCP sayesinde agentlar:

* Unreal Engine
* Blender
* VS Code
* GitHub
* Jira
* Notion
* Google Drive
* Figma
* Local Filesystem

gibi sistemlerle etkileşim kurabilir.

---

# 2. Vision

Node'lar veri işler.

Agent'lar karar verir.

MCP araçları gerçek dünyada aksiyon alır.

Örnek:

```text
Create a new enemy character

↓

Generate Concept

↓

Generate 3D Model

↓

Import To Unreal

↓

Create Blueprint

↓

Commit To GitHub
```

Bu zincirin tamamı MCP üzerinden çalıştırılabilir.

---

# 3. Architecture Overview

```text
Aether Forge

↓

Agent Runtime

↓

MCP Layer

↓

MCP Server

↓

External Tool
```

---

# 4. MCP Principles

## Principle 01

Provider Independent

Herhangi bir LLM kullanılabilir.

---

## Principle 02

Tool Independent

Herhangi bir araç bağlanabilir.

---

## Principle 03

Permission First

Araç erişimleri izin kontrollü olmalıdır.

---

## Principle 04

Human Override

İnsan her zaman son kararı verebilmelidir.

---

# 5. MCP Components

## MCP Client

Aether Forge içerisinde çalışır.

Görevleri:

* Tool keşfi
* Tool çağrısı
* Sonuç işleme

---

## MCP Gateway

Tüm MCP bağlantılarını yönetir.

---

## MCP Server

Harici sistemleri temsil eder.

Örnek:

```text
Unreal MCP Server

Blender MCP Server

GitHub MCP Server
```

---

## Tool Registry

Tüm kullanılabilir araçların kataloğu.

---

# 6. MCP Tool Model

```typescript
interface MCPTool
{
    id:string;

    name:string;

    description:string;

    inputs:any[];

    outputs:any[];

    permissions:string[];
}
```

---

# 7. Tool Discovery

Agent bir MCP sunucusuna bağlandığında:

```text
Connect

↓

Discover Tools

↓

Register Tools

↓

Ready
```

---

# 8. Tool Invocation

```typescript
interface ToolRequest
{
    toolId:string;

    parameters:any;

    caller:string;
}
```

---

# 9. Tool Result

```typescript
interface ToolResult
{
    success:boolean;

    output:any;

    logs:any[];

    duration:number;
}
```

---

# 10. MCP Node Types

## MCP Connection Node

Sunucu bağlantısı kurar.

---

## MCP Tool Node

Belirli aracı çalıştırır.

---

## MCP Workflow Node

Harici workflow başlatır.

---

## MCP Agent Node

Agent'a araç seti sağlar.

---

# 11. Permission System

Desteklenen izinler:

```text
ReadFiles

WriteFiles

DeleteFiles

ExecuteCommands

ModifyAssets

CreateAssets

AccessGit

AccessUnreal

AccessBlender

AccessCloud
```

---

# 12. Security Levels

## Level 1

Read Only

---

## Level 2

Read + Write

---

## Level 3

Execution

---

## Level 4

Administrative

---

# 13. Human Approval Modes

## Automatic

Doğrudan çalıştırılır.

---

## Approval Required

Kullanıcı onayı gerekir.

---

## Restricted

Sadece admin çalıştırabilir.

---

# 14. Tool Categories

## Development

VS Code

GitHub

GitLab

Jira

---

## Game Development

Unreal Engine

Blender

Unity

Houdini

---

## Productivity

Notion

Confluence

Google Drive

---

## Media

Photoshop

Substance Painter

Davinci Resolve

---

## System

Filesystem

Shell

Docker

---

# 15. Unreal MCP Tools

Örnek araçlar:

```text
Import Asset

Create Blueprint

Create Material

Create Niagara System

Build Project

Cook Project

Package Project

Run Python Script

Execute Editor Utility
```

---

# 16. Blender MCP Tools

Örnek:

```text
Import Mesh

Apply Modifier

Generate UV

Bake Textures

Export FBX

Export GLB
```

---

# 17. GitHub MCP Tools

Örnek:

```text
Create Repository

Commit Changes

Create Branch

Open Pull Request

Create Issue
```

---

# 18. Notion MCP Tools

Örnek:

```text
Create Page

Update Page

Create Database Entry

Generate Documentation
```

---

# 19. Tool Selection Process

Agent:

```text
Goal

↓

Find Suitable Tool

↓

Evaluate Permissions

↓

Execute Tool

↓

Validate Result
```

---

# 20. Tool Chaining

Birden fazla araç zincirlenebilir.

```text
Meshy

↓

Blender

↓

Unreal

↓

GitHub
```

---

# 21. Tool Failure Handling

Araç başarısız olursa:

```text
Retry

↓

Alternative Tool

↓

Escalate
```

---

# 22. Tool Telemetry

Kaydedilir:

```text
Tool Name

Caller Agent

Duration

Success

Failure Reason

Cost
```

---

# 23. MCP Workflow Example

Enemy Production Pipeline

```text
Character Agent

↓

Meshy MCP

↓

Blender MCP

↓

Unreal MCP

↓

GitHub MCP
```

---

# 24. MCP Server Registry

```typescript
interface MCPServer
{
    id:string;

    name:string;

    endpoint:string;

    tools:MCPTool[];
}
```

---

# 25. Connection Management

Durumlar:

```text
Disconnected

Connecting

Connected

Error

Reconnecting
```

---

# 26. Local MCP Support

Desteklenmelidir.

Örnek:

```text
Local Unreal

Local Blender

Local Filesystem
```

---

# 27. Remote MCP Support

Desteklenmelidir.

Örnek:

```text
Cloud Unreal

Cloud Blender

Remote Build Farm
```

---

# 28. Agent + MCP Pattern

```text
Goal

↓

Planner Agent

↓

Tool Agent

↓

MCP Tool

↓

Result

↓

Reviewer Agent
```

---

# 29. Workspace Tool Profiles

Proje bazında araç profilleri oluşturulabilir.

Örnek:

```text
Indie Project

AAA Project

Mobile Project
```

---

# 30. MCP Sandbox

Araç çağrıları izole edilmelidir.

Kısıtlar:

* CPU
* RAM
* Disk
* Network

---

# 31. Audit Requirements

Tüm çağrılar loglanmalıdır.

```text
Who

When

Tool

Input

Output

Result
```

---

# 32. Future Scope

* Dynamic Tool Learning
* Tool Reputation System
* Tool Marketplace
* Multi-MCP Federation
* Autonomous Tool Discovery

---

# 33. Golden Rule

Agent'lar doğrudan dış sistemlerle konuşmaz.

Tüm dış dünya etkileşimleri MCP katmanı üzerinden gerçekleşir.

Bu sayede güvenlik, izlenebilirlik ve ölçeklenebilirlik korunur.
