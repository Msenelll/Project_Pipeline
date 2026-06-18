# AETHER FORGE

# Multi-Agent Framework Specification

Version: 1.0

Status: Draft

Dependencies:

* Node SDK Specification
* Workflow Runtime Architecture
* Graph Schema Specification
* Plugin Development Kit Specification

---

# 1. Purpose

Bu doküman Aether Forge Multi-Agent Framework'ünü tanımlar.

Amaç:

Tek bir AI modelini çağırmak yerine uzmanlaşmış AI ekipleri oluşturabilmek ve bu ekiplerin birlikte çalışmasını sağlamaktır.

Örnek:

Bir oyun karakteri üretmek için:

* Character Designer Agent
* Concept Artist Agent
* 3D Artist Agent
* Technical Artist Agent
* Unreal Integration Agent

aynı workflow içerisinde birlikte çalışabilir.

---

# 2. Vision

Agent = Uzman Dijital Çalışan

Bir workflow;

Node'lar ile çalışabileceği gibi,

Agent'lar ile de çalışabilmelidir.

Uzun vadeli hedef:

```text
Digital Studio
```

oluşturmaktır.

---

# 3. Agent Hierarchy

```text
Supervisor Agent

├─ Narrative Agent
├─ Character Agent
├─ Environment Agent
├─ Audio Agent
├─ Technical Agent
└─ QA Agent
```

---

# 4. Agent Types

## Worker Agent

Belirli görevleri yapar.

Örnek:

* Character Generator
* Quest Writer
* Texture Generator

---

## Supervisor Agent

Alt agentları yönetir.

Görevleri:

* Planlama
* İş dağıtımı
* Sonuç toplama

---

## Reviewer Agent

Çıktıları değerlendirir.

Örnek:

* Lore Review
* Asset Review
* QA Review

---

## Planner Agent

Görev planı oluşturur.

---

## Executor Agent

Planı uygular.

---

## Tool Agent

Araç kullanır.

Örnek:

* Unreal Agent
* Blender Agent
* MCP Agent

---

# 5. Agent Lifecycle

```text
Initialize

↓

Understand Goal

↓

Plan

↓

Execute

↓

Review

↓

Reflect

↓

Continue
```

---

# 6. Agent Contract

```typescript
interface IAgent
{
    plan();

    execute();

    review();

    reflect();

    communicate();

    terminate();
}
```

---

# 7. Agent Context

Her agent kendi çalışma alanına sahiptir.

```typescript
interface AgentContext
{
    memory;

    knowledge;

    tools;

    goals;

    history;
}
```

---

# 8. Memory Architecture

## Short-Term Memory

Mevcut görev.

---

## Working Memory

Aktif workflow.

---

## Long-Term Memory

Projeye özel bilgi tabanı.

---

## Shared Team Memory

Tüm agentların erişebildiği alan.

---

# 9. Communication Model

Agentlar doğrudan konuşmaz.

Mesajlaşma sistemi kullanılır.

```text
Agent A

↓

Message Bus

↓

Agent B
```

---

# 10. Message Contract

```typescript
interface AgentMessage
{
    sender;

    receiver;

    type;

    content;

    timestamp;
}
```

---

# 11. Task Model

```typescript
interface AgentTask
{
    id;

    goal;

    inputs;

    outputs;

    priority;
}
```

---

# 12. Goal System

Her agent hedef odaklı çalışır.

Örnek:

```text
Create a stylized shaman character
```

---

# 13. Planning Model

Planner agent görevi parçalar.

Örnek:

```text
Character Creation

↓

Lore

↓

Concept

↓

3D Model

↓

Textures

↓

Unreal Import
```

---

# 14. Agent Team

Örnek:

```text
Game Director

↓

Narrative Agent

↓

Character Agent

↓

Environment Agent

↓

Audio Agent

↓

QA Agent
```

---

# 15. Consensus Mechanism

Birden fazla agent aynı problemi çözebilir.

```text
Agent A

Agent B

Agent C

↓

Consensus
```

---

# 16. Voting System

Desteklenen yöntemler:

```text
Majority Vote

Weighted Vote

Supervisor Decision
```

---

# 17. Reflection Loop

Agent kendi çıktısını analiz eder.

```text
Generate

↓

Review

↓

Improve

↓

Generate Again
```

---

# 18. Reviewer Pattern

```text
Worker

↓

Reviewer

↓

Approved
```

veya

```text
Worker

↓

Reviewer

↓

Rework
```

---

# 19. Self-Correction

Agent hata bulursa görevi tekrar çalıştırabilir.

---

# 20. Knowledge Access

Agentlar:

* RAG
* Vector DB
* Project Knowledge Base
* Documentation

erişebilir.

---

# 21. Tool Usage

Agentlar araç çağırabilir.

Örnek:

```text
Character Agent

↓

Meshy

↓

3D Model
```

---

# 22. MCP Tool Usage

```text
Technical Agent

↓

MCP

↓

Unreal Engine
```

---

# 23. Human Approval Gates

Belirli adımlarda kullanıcı onayı gerekir.

```text
Generate Character

↓

Human Approval

↓

Generate 3D Model
```

---

# 24. Failure Recovery

Agent başarısız olursa:

```text
Retry

↓

Alternative Agent

↓

Escalate
```

---

# 25. Agent Metrics

Takip edilir:

```text
Success Rate

Cost

Latency

Quality Score

Retry Count
```

---

# 26. Agent Specializations

## Game Design

GDD Agent

---

## Narrative

Lore Agent

Dialogue Agent

Quest Agent

---

## Art

Concept Agent

UI Agent

VFX Agent

---

## 3D

Model Agent

Texture Agent

Rig Agent

Animation Agent

---

## Audio

Music Agent

Voice Agent

SFX Agent

---

## Engineering

Code Agent

Blueprint Agent

Unreal Agent

---

# 27. Game Studio Team Example

```text
Creative Director

↓

Narrative Lead

Art Director

Technical Director

↓

20+ Specialized Agents
```

---

# 28. Autonomous Asset Pipeline

Örnek:

```text
Goal

↓

Character Agent

↓

Concept Agent

↓

Mesh Agent

↓

Texture Agent

↓

Rig Agent

↓

Animation Agent

↓

QA Agent

↓

Unreal Agent
```

---

# 29. Agent Workspace

Her agent için:

```text
Files

Memory

Logs

Tasks

Tools
```

ayrı tutulur.

---

# 30. Agent Runtime States

```text
Idle

Planning

Executing

Waiting

Reviewing

Completed

Failed
```

---

# 31. Multi-Agent Workflow Modes

## Sequential

```text
A

↓

B

↓

C
```

---

## Parallel

```text
A

↓

B + C + D
```

---

## Hierarchical

```text
Supervisor

↓

Workers
```

---

## Swarm

```text
Many Agents

↓

Shared Goal
```

---

# 32. Agent Marketplace

Future Scope

Kullanıcılar kendi agentlarını paylaşabilir.

Örnek:

* Unreal Architect Agent
* RPG Quest Designer Agent
* Texture Review Agent

---

# 33. Agent Templates

Hazır ekipler:

```text
Indie Game Team

AAA Art Team

Documentation Team

Marketing Team
```

---

# 34. Production Example

Türk Mitolojisi Oyunu

```text
Game Director

↓

Lore Agent

↓

Character Agent

↓

Meshy Agent

↓

Texture Agent

↓

Rigging Agent

↓

Animation Agent

↓

QA Agent

↓

Unreal Agent
```

---

# 35. Future Scope

* Agent Learning
* Agent Reputation
* Agent Marketplace
* Agent Swarms
* Cross-Project Memory
* Autonomous Project Management

---

# 36. Golden Rule

Node'lar işlem yapar.

Agent'lar karar verir.

Runtime sistemi ise tüm organizasyonu yönetir.

Aether Forge'un uzun vadeli ölçeklenebilirliği, node sayısından çok agent organizasyonunun başarısına bağlı olacaktır.
