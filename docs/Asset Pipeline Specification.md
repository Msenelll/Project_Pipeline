# AETHER FORGE

# Unreal Engine Integration Specification

Version: 1.0

Status: Draft

Dependencies:

* Node SDK Specification
* Workflow Runtime Architecture
* Multi-Agent Framework
* MCP Integration Specification

Supported Engine Versions:

* Unreal Engine 5.8+
* Future: Unreal Engine 6.x

---

# 1. Purpose

Bu doküman Aether Forge ile Unreal Engine arasındaki entegrasyon katmanını tanımlar.

Amaç yalnızca asset import etmek değildir.

Amaç:

AI Agent'ların ve Workflow'ların Unreal Engine editörünü kontrollü şekilde yönetebilmesini sağlamaktır.

---

# 2. Vision

Uzun vadeli hedef:

```text
Idea

↓

Agents

↓

Assets

↓

Unreal Engine

↓

Playable Prototype
```

oluşturabilmektir.

---

# 3. Integration Modes

## Mode 1

File Based Integration

---

## Mode 2

Python Automation

---

## Mode 3

Editor Utility Integration

---

## Mode 4

UE MCP Integration

---

## Mode 5

Remote Unreal Runtime

Future Scope

---

# 4. Architecture

```text
Aether Forge

↓

Workflow Runtime

↓

MCP Layer

↓

UE Integration Layer

↓

Unreal Editor

↓

Project Content
```

---

# 5. Unreal Connection Manager

Görevleri:

* Engine keşfi
* Proje keşfi
* Versiyon doğrulama
* Bağlantı yönetimi

---

# 6. Project Discovery

Tespit edilmesi gerekenler:

```text
Engine Version

Project Path

Plugins

Content Folder

Source Folder

Build Configuration
```

---

# 7. Unreal Workspace Model

```typescript
interface UnrealWorkspace
{
    engineVersion:string;

    projectPath:string;

    contentPath:string;

    sourcePath:string;

    plugins:string[];
}
```

---

# 8. Asset Categories

## Art Assets

```text
Static Mesh

Skeletal Mesh

Texture

Material

Animation

Control Rig
```

---

## Gameplay Assets

```text
Blueprint

Data Asset

Behavior Tree

Blackboard

Widget Blueprint
```

---

## VFX Assets

```text
Niagara System

Niagara Module

Niagara Emitter
```

---

## Audio Assets

```text
Sound Wave

Meta Sound

Sound Cue
```

---

# 9. Asset Import Pipeline

```text
Asset Generated

↓

Validation

↓

Import

↓

Verification

↓

Registry Update
```

---

# 10. Supported Imports

```text
FBX

OBJ

GLB

GLTF

PNG

TGA

WAV

MP3

CSV

JSON
```

---

# 11. Asset Metadata

Her asset:

```typescript
interface AssetMetadata
{
    source;

    creator;

    generatedBy;

    createdAt;

    tags;
}
```

saklamalıdır.

---

# 12. Folder Standards

Varsayılan yapı:

```text
Content/

Characters/

Enemies/

Bosses/

Weapons/

Environment/

UI/

Audio/

VFX/

Animations/

Materials/

Data/

Blueprints/
```

---

# 13. Asset Validation Rules

Kontroller:

```text
Naming

Folder Rules

LOD Rules

Material Rules

Collision Rules

Performance Rules
```

---

# 14. Naming Convention System

Örnek:

```text
SM_Character

SK_Player

MI_Stone

BP_Enemy

DA_Quest

NS_Fire
```

---

# 15. Blueprint Generation

Agent'lar Blueprint oluşturabilir.

Destek:

```text
Actor

Pawn

Character

GameMode

GameState

Widget

ActorComponent
```

---

# 16. Blueprint Generation Workflow

```text
Design Goal

↓

Blueprint Agent

↓

Blueprint Schema

↓

Blueprint Creation

↓

Validation
```

---

# 17. Data Asset Generation

Üretilebilir:

```text
Enemy Data

Quest Data

Weapon Data

Dialogue Data

Character Data
```

---

# 18. Gameplay Framework Support

Desteklenmelidir:

```text
GameMode

PlayerController

Pawn

Character

GameInstance

Subsystems
```

---

# 19. Niagara Integration

Üretilebilir:

```text
Fire

Smoke

Magic

Water

Dust

Impact Effects
```

---

# 20. Niagara Workflow

```text
Prompt

↓

VFX Agent

↓

Niagara Definition

↓

Niagara Asset

↓

Validation
```

---

# 21. Material Generation

Destek:

```text
Material

Material Instance

Material Function
```

---

# 22. Texture Pipeline

```text
Diffuse

Normal

Roughness

Metallic

AO

Opacity
```

---

# 23. Animation Integration

Destek:

```text
Animation Sequence

Blend Space

Montage

Control Rig
```

---

# 24. Character Pipeline

```text
Character Prompt

↓

Concept

↓

Mesh

↓

Texture

↓

Rig

↓

Animation

↓

Import

↓

Blueprint
```

---

# 25. Environment Pipeline

```text
Environment Prompt

↓

Asset Set

↓

Meshes

↓

Materials

↓

Import

↓

Level Placement
```

---

# 26. Audio Integration

Destek:

```text
Voice

Music

SFX

MetaSounds
```

---

# 27. Level Generation

Future Scope

Agent'lar:

```text
Landscape

Buildings

Props

Lighting

Volumes
```

yerleştirebilir.

---

# 28. World Partition Support

Desteklenmelidir.

Özellikle büyük açık dünya projeleri için.

---

# 29. Unreal Python Layer

Desteklenen işlemler:

```text
Import Assets

Create Assets

Modify Assets

Rename Assets

Delete Assets

Run Validation
```

---

# 30. Editor Utility Layer

Destek:

```text
Batch Import

Folder Creation

Asset Audit

Data Generation
```

---

# 31. UE MCP Integration

UE 5.8+

Örnek araçlar:

```text
Create Blueprint

Create Material

Import Asset

Execute Python

Build Project

Package Project
```

---

# 32. Build Automation

Destek:

```text
Development Build

Shipping Build

Dedicated Server Build
```

---

# 33. Packaging Automation

Destek:

```text
Windows

Linux

Android

iOS
```

---

# 34. Validation Pipeline

Her import sonrası:

```text
Asset Audit

↓

Performance Check

↓

Naming Check

↓

Reference Check

↓

Pass
```

---

# 35. Dependency Analysis

Takip edilir:

```text
Blueprint References

Material References

Asset References
```

---

# 36. Unreal Agent Team

Örnek:

```text
Technical Director Agent

↓

Blueprint Agent

Material Agent

Niagara Agent

Build Agent

QA Agent
```

---

# 37. Production Pipeline Example

```text
Character Agent

↓

Meshy Agent

↓

Texture Agent

↓

Rig Agent

↓

Animation Agent

↓

Unreal Agent

↓

Blueprint Agent

↓

QA Agent
```

---

# 38. Performance Metrics

Takip edilir:

```text
Import Time

Asset Count

Build Time

Package Time

Validation Errors
```

---

# 39. Future Scope

Planned:

* C++ Code Generation
* Gameplay Ability System Generation
* Mass Framework Integration
* PCG Generation
* Verse Integration
* UE6 Support

---

# 40. Unreal Project Template Support

Hazır şablonlar:

```text
Top Down

Third Person

RPG

Survival

Roguelike

Shooter
```

---

# 41. Golden Rule

Aether Forge hiçbir zaman Unreal Engine'in yerine geçmez.

Aether Forge'un görevi:

Unreal Engine üretim süreçlerini hızlandırmak, standartlaştırmak ve otomatize etmektir.

Tüm üretilen içerikler Unreal Engine'in doğal asset ve workflow yapısına uyumlu olmalıdır.
