# PerFit Browser Extension

AI-powered virtual fitting room that generates true-to-life digital avatars for confident online clothing purchases.

---

## Table of Contents

1. [Overview](#overview)
2. [Problem Statement](#problem-statement)
3. [Solution](#solution)
4. [Architecture](#architecture)
5. [Technical Design](#technical-design)
6. [Data Flow](#data-flow)
7. [API Specification](#api-specification)
8. [Security Considerations](#security-considerations)
9. [Development Setup](#development-setup)
10. [Project Structure](#project-structure)
11. [Roadmap](#roadmap)

---

## Overview

PerFit is a browser extension that integrates seamlessly with e-commerce fashion websites, enabling users to visualize how clothing items will look and fit on their unique body before purchasing. The extension addresses the core problem in online fashion retail: customers cannot accurately determine fit from product photos alone, leading to return rates up to 60% during major sales events.

### Key Capabilities

- **Personalized Avatar Generation**: Transform user photos and measurements into accurate 3D avatars
- **AI-Powered Fit Simulation**: Analyze garment measurements, cut, and fabric to simulate realistic draping
- **Smart Size Recommendations**: ML-driven optimal size suggestions with alternative size previews
- **Style & Color Visualization**: Preview how colors and patterns suit user's complexion and features
- **Cross-Platform Sync**: Avatar and preferences sync across devices via cloud storage

---

## Problem Statement

| Issue | Impact |
|-------|--------|
| Model photos don't reflect real shoppers | Purchase uncertainty, low confidence |
| Size charts are inconsistent across brands | Wrong size purchases |
| Cannot visualize style/color on own body | Style mismatch, disappointment |
| High return rates (up to 60%) | Retailer losses, environmental waste |
| Tedious return processes | Customer frustration, churn |

---

## Solution

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                                 │
├─────────────────────────────────────────────────────────────────────┤
│  1. Install Extension                                                │
│  2. Create Avatar (upload photo + basic measurements)                │
│  3. Browse any supported e-commerce site                             │
│  4. Click "Try On" button injected on product pages                  │
│  5. View realistic fit simulation on personal avatar                 │
│  6. Get AI size recommendation                                       │
│  7. Purchase with confidence                                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Architecture

### High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              BROWSER                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                     PERFIT EXTENSION (MV3)                            │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │   Popup     │  │  Content    │  │  Service    │  │  Options    │  │  │
│  │  │   UI        │  │  Scripts    │  │  Worker     │  │  Page       │  │  │
│  │  │             │  │             │  │             │  │             │  │  │
│  │  │ - Avatar    │  │ - DOM       │  │ - State     │  │ - Settings  │  │  │
│  │  │   preview   │  │   injection │  │   mgmt      │  │ - Profile   │  │  │
│  │  │ - Quick     │  │ - Product   │  │ - API       │  │ - Privacy   │  │  │
│  │  │   actions   │  │   detection │  │   calls     │  │   controls  │  │  │
│  │  │ - Status    │  │ - Try-on    │  │ - Caching   │  │             │  │  │
│  │  │             │  │   overlay   │  │ - Auth      │  │             │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  │         │                │                │                │         │  │
│  │         └────────────────┴────────────────┴────────────────┘         │  │
│  │                              │                                        │  │
│  │                    Chrome Messaging API                               │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTPS
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                           PERFIT CLOUD                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         API GATEWAY                                  │   │
│  │                    (Rate Limiting, Auth, Routing)                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│         │              │              │              │                      │
│         ▼              ▼              ▼              ▼                      │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐                │
│  │  Avatar   │  │  Try-On   │  │   Size    │  │  Product  │                │
│  │  Service  │  │  Engine   │  │  Recomm.  │  │  Catalog  │                │
│  │           │  │           │  │  Service  │  │  Service  │                │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘                │
│         │              │              │              │                      │
│         ▼              ▼              ▼              ▼                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      ML INFERENCE CLUSTER                            │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │   │
│  │  │ Body Mesh   │  │ Garment     │  │ Diffusion   │                  │   │
│  │  │ Reconstruct │  │ Simulation  │  │ Try-On      │                  │   │
│  │  │ (SMPL-X)    │  │ (Physics)   │  │ Model       │                  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         DATA LAYER                                   │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐         │   │
│  │  │ User DB   │  │ Avatar    │  │ Product   │  │ Analytics │         │   │
│  │  │ (Postgres)│  │ Storage   │  │ Cache     │  │ (Events)  │         │   │
│  │  │           │  │ (S3)      │  │ (Redis)   │  │           │         │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────┘
```

### Extension Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        MANIFEST V3 EXTENSION                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    SERVICE WORKER (Background)                   │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │    │
│  │  │ Auth        │  │ State       │  │ Message Router          │  │    │
│  │  │ Manager     │  │ Manager     │  │                         │  │    │
│  │  │             │  │             │  │ - popup <-> background  │  │    │
│  │  │ - OAuth2    │  │ - Avatar    │  │ - content <-> background│  │    │
│  │  │ - JWT       │  │ - Settings  │  │ - options <-> background│  │    │
│  │  │ - Refresh   │  │ - Cache     │  │                         │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘  │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │    │
│  │  │ API Client  │  │ Storage     │  │ Site Detector           │  │    │
│  │  │             │  │ Manager     │  │                         │  │    │
│  │  │ - REST      │  │             │  │ - Pattern matching      │  │    │
│  │  │ - Retry     │  │ - Sync      │  │ - Selector configs      │  │    │
│  │  │ - Queue     │  │ - Local     │  │ - Product extraction    │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    CONTENT SCRIPTS                               │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │    │
│  │  │ Product     │  │ UI          │  │ Try-On Overlay          │  │    │
│  │  │ Detector    │  │ Injector    │  │                         │  │    │
│  │  │             │  │             │  │ - Canvas renderer       │  │    │
│  │  │ - Selectors │  │ - Try-on    │  │ - WebGL context         │  │    │
│  │  │ - Schema.org│  │   button    │  │ - 3D avatar display     │  │    │
│  │  │ - ML parse  │  │ - Badge     │  │ - Garment overlay       │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────┐  ┌────────────────────────────────┐     │
│  │        POPUP UI            │  │         OPTIONS PAGE           │     │
│  │  ┌──────────────────────┐  │  │  ┌──────────────────────────┐  │     │
│  │  │ React/Preact App     │  │  │  │ React/Preact App         │  │     │
│  │  │                      │  │  │  │                          │  │     │
│  │  │ - Avatar thumbnail   │  │  │  │ - Profile management     │  │     │
│  │  │ - Quick settings     │  │  │  │ - Avatar editor          │  │     │
│  │  │ - Recent try-ons     │  │  │  │ - Measurement input      │  │     │
│  │  │ - Size history       │  │  │  │ - Privacy controls       │  │     │
│  │  │ - Login/signup       │  │  │  │ - Sync settings          │  │     │
│  │  └──────────────────────┘  │  │  └──────────────────────────┘  │     │
│  └────────────────────────────┘  └────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Technical Design

### 1. Avatar Generation Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     AVATAR GENERATION PIPELINE                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  INPUT                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
│  │ User Photo      │  │ Body            │  │ Optional        │          │
│  │ (Full body)     │  │ Measurements    │  │ Preferences     │          │
│  │                 │  │                 │  │                 │          │
│  │ - Front view    │  │ - Height        │  │ - Skin tone     │          │
│  │ - min 512x512   │  │ - Weight        │  │ - Hair style    │          │
│  │ - good lighting │  │ - Chest         │  │ - Pose          │          │
│  │                 │  │ - Waist         │  │                 │          │
│  │                 │  │ - Hips          │  │                 │          │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘          │
│           │                    │                    │                    │
│           └────────────────────┼────────────────────┘                    │
│                                ▼                                         │
│  PROCESSING                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  Stage 1: Pose Estimation & Segmentation                        │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │    │
│  │  │ OpenPose/   │  │ Instance    │  │ Keypoint    │              │    │
│  │  │ MediaPipe   │─▶│ Segment.    │─▶│ Extraction  │              │    │
│  │  │             │  │             │  │             │              │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘              │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  Stage 2: 3D Body Reconstruction                                │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │    │
│  │  │ SMPL-X      │  │ Shape       │  │ Texture     │              │    │
│  │  │ Regression  │─▶│ Refinement  │─▶│ Mapping     │              │    │
│  │  │             │  │             │  │             │              │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘              │    │
│  │                                                                  │    │
│  │  - Beta params (body shape)                                      │    │
│  │  - Theta params (pose)                                           │    │
│  │  - Measurement fitting                                           │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  Stage 3: Avatar Finalization                                   │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │    │
│  │  │ Face        │  │ Hair        │  │ LOD         │              │    │
│  │  │ Capture     │─▶│ Generation  │─▶│ Generation  │              │    │
│  │  │             │  │             │  │             │              │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘              │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                ▼                                         │
│  OUTPUT                                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  Avatar Assets                                                   │    │
│  │  - 3D mesh (.glb)           - Multiple LODs                     │    │
│  │  - Texture maps             - Rig for posing                    │    │
│  │  - Body parameters          - Measurement metadata              │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2. Virtual Try-On Engine

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     VIRTUAL TRY-ON ENGINE                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  INPUTS                                                                  │
│  ┌─────────────────────┐         ┌─────────────────────┐                │
│  │ User Avatar         │         │ Garment Data        │                │
│  │ - 3D mesh           │         │ - Product images    │                │
│  │ - Body params       │         │ - Size chart        │                │
│  │ - Measurements      │         │ - Fabric type       │                │
│  │                     │         │ - Cut/style         │                │
│  └──────────┬──────────┘         └──────────┬──────────┘                │
│             │                               │                            │
│             └───────────────┬───────────────┘                            │
│                             ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    PROCESSING PIPELINE                           │    │
│  │                                                                  │    │
│  │  ┌───────────────────────────────────────────────────────────┐  │    │
│  │  │  Garment Parsing                                          │  │    │
│  │  │  - Segment garment from product image                     │  │    │
│  │  │  - Extract garment mask and features                      │  │    │
│  │  │  - Identify garment category (top, bottom, dress, etc.)   │  │    │
│  │  └───────────────────────────────────────────────────────────┘  │    │
│  │                             ▼                                    │    │
│  │  ┌───────────────────────────────────────────────────────────┐  │    │
│  │  │  Warping & Fitting                                        │  │    │
│  │  │  - Thin-plate spline transformation                       │  │    │
│  │  │  - Body-aware deformation                                 │  │    │
│  │  │  - Size-based scaling                                     │  │    │
│  │  └───────────────────────────────────────────────────────────┘  │    │
│  │                             ▼                                    │    │
│  │  ┌───────────────────────────────────────────────────────────┐  │    │
│  │  │  Diffusion-Based Try-On (Primary Method)                  │  │    │
│  │  │  - Stable Diffusion backbone                              │  │    │
│  │  │  - Garment-conditioned generation                         │  │    │
│  │  │  - Body-shape preservation                                │  │    │
│  │  │  - Texture and pattern fidelity                           │  │    │
│  │  └───────────────────────────────────────────────────────────┘  │    │
│  │                             ▼                                    │    │
│  │  ┌───────────────────────────────────────────────────────────┐  │    │
│  │  │  Physics Simulation (Enhanced Realism)                    │  │    │
│  │  │  - Cloth dynamics based on fabric type                    │  │    │
│  │  │  - Draping simulation                                     │  │    │
│  │  │  - Wrinkle and fold generation                            │  │    │
│  │  └───────────────────────────────────────────────────────────┘  │    │
│  │                             ▼                                    │    │
│  │  ┌───────────────────────────────────────────────────────────┐  │    │
│  │  │  Post-Processing                                          │  │    │
│  │  │  - Color correction                                       │  │    │
│  │  │  - Lighting harmonization                                 │  │    │
│  │  │  - Background compositing                                 │  │    │
│  │  └───────────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                             ▼                                            │
│  OUTPUT                                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  - Try-on image (high-res)                                      │    │
│  │  - Multi-angle views (optional)                                 │    │
│  │  - Fit analysis metadata                                        │    │
│  │  - Size recommendation score                                    │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3. Product Detection System

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     PRODUCT DETECTION SYSTEM                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  SITE CONFIGURATION REGISTRY                                    │    │
│  │                                                                  │    │
│  │  sites/                                                          │    │
│  │  ├── amazon.json                                                 │    │
│  │  ├── zara.json                                                   │    │
│  │  ├── hm.json                                                     │    │
│  │  ├── asos.json                                                   │    │
│  │  └── ...                                                         │    │
│  │                                                                  │    │
│  │  Config Structure:                                               │    │
│  │  {                                                               │    │
│  │    "domain": "zara.com",                                         │    │
│  │    "selectors": {                                                │    │
│  │      "productContainer": ".product-detail",                      │    │
│  │      "productName": ".product-detail-info__header-name",         │    │
│  │      "productPrice": ".price__amount",                           │    │
│  │      "productImages": ".media-image img",                        │    │
│  │      "sizeSelector": ".size-selector__size-list",                │    │
│  │      "sizeChart": ".size-guide-content"                          │    │
│  │    },                                                            │    │
│  │    "urlPattern": "/product/",                                    │    │
│  │    "tryOnButtonTarget": ".product-detail-info__actions"          │    │
│  │  }                                                               │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                             ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  DETECTION PIPELINE                                              │    │
│  │                                                                  │    │
│  │  1. URL Pattern Match                                            │    │
│  │     ↓                                                            │    │
│  │  2. DOM Ready Check                                              │    │
│  │     ↓                                                            │    │
│  │  3. Selector-Based Extraction                                    │    │
│  │     ↓                                                            │    │
│  │  4. Schema.org JSON-LD Fallback                                  │    │
│  │     ↓                                                            │    │
│  │  5. OpenGraph Meta Fallback                                      │    │
│  │     ↓                                                            │    │
│  │  6. ML-Based Visual Detection (last resort)                      │    │
│  │                                                                  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                             ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  EXTRACTED PRODUCT DATA                                          │    │
│  │                                                                  │    │
│  │  {                                                               │    │
│  │    "id": "zara-12345",                                           │    │
│  │    "name": "Oversized Wool Blend Coat",                          │    │
│  │    "brand": "ZARA",                                              │    │
│  │    "category": "outerwear",                                      │    │
│  │    "price": { "amount": 149.00, "currency": "USD" },             │    │
│  │    "images": ["url1", "url2", ...],                              │    │
│  │    "sizes": ["XS", "S", "M", "L", "XL"],                         │    │
│  │    "sizeChart": { ... },                                         │    │
│  │    "color": "Camel",                                             │    │
│  │    "material": "60% Wool, 40% Polyester",                        │    │
│  │    "url": "https://..."                                          │    │
│  │  }                                                               │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4. Size Recommendation Engine

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   SIZE RECOMMENDATION ENGINE                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  INPUTS                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ User Body   │  │ Garment     │  │ Brand       │  │ User        │     │
│  │ Measurements│  │ Size Chart  │  │ Fit Profile │  │ Preferences │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │                │             │
│         └────────────────┴────────────────┴────────────────┘             │
│                                   │                                      │
│                                   ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                     ML RECOMMENDATION MODEL                      │    │
│  │                                                                  │    │
│  │  Features:                                                       │    │
│  │  - Body measurement vector                                       │    │
│  │  - Garment measurement vector                                    │    │
│  │  - Brand sizing tendency (runs small/large)                      │    │
│  │  - Garment category embedding                                    │    │
│  │  - Material stretch factor                                       │    │
│  │  - User fit preference (loose/fitted)                            │    │
│  │  - Historical purchase/return data                               │    │
│  │                                                                  │    │
│  │  Model Architecture:                                             │    │
│  │  - Gradient Boosted Trees (primary)                              │    │
│  │  - Neural network ensemble (complex cases)                       │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                   │                                      │
│                                   ▼                                      │
│  OUTPUT                                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  {                                                               │    │
│  │    "recommendedSize": "M",                                       │    │
│  │    "confidence": 0.89,                                           │    │
│  │    "alternatives": [                                             │    │
│  │      { "size": "S", "fitDescription": "Fitted, may be snug" },   │    │
│  │      { "size": "L", "fitDescription": "Relaxed, oversized look" }│    │
│  │    ],                                                            │    │
│  │    "fitAnalysis": {                                              │    │
│  │      "chest": "Good fit",                                        │    │
│  │      "waist": "Slightly loose",                                  │    │
│  │      "length": "Perfect"                                         │    │
│  │    }                                                             │    │
│  │  }                                                               │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### User Onboarding Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Install │────▶│ Sign Up │────▶│ Photo   │────▶│ Avatar  │────▶│ Ready   │
│ Ext.    │     │ / Login │     │ Upload  │     │ Gen.    │     │ to Use  │
└─────────┘     └─────────┘     └─────────┘     └─────────┘     └─────────┘
                    │                                │
                    ▼                                ▼
              ┌─────────┐                      ┌─────────┐
              │ Auth    │                      │ Avatar  │
              │ Service │                      │ Service │
              └─────────┘                      └─────────┘
```

### Try-On Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│  E-Commerce Site (Content Script Context)                              │
│                                                                        │
│  1. Page Load                                                          │
│     └──▶ Content Script Injected                                       │
│          └──▶ Product Detected                                         │
│               └──▶ "Try On" Button Injected                            │
│                                                                        │
│  2. User Clicks "Try On"                                               │
│     └──▶ Product Data Extracted                                        │
│          └──▶ Message to Service Worker                                │
│               └──▶ API Call to Try-On Engine                           │
│                    └──▶ Overlay Opens with Result                      │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘

Sequence:

User          Content Script    Service Worker    PerFit API
 │                 │                  │                │
 │  Click Try On   │                  │                │
 │────────────────▶│                  │                │
 │                 │  Extract Product │                │
 │                 │─────────────────▶│                │
 │                 │                  │  POST /try-on  │
 │                 │                  │───────────────▶│
 │                 │                  │                │ Generate
 │                 │                  │                │ Try-On Image
 │                 │                  │  Result        │
 │                 │                  │◀───────────────│
 │                 │  Render Overlay  │                │
 │                 │◀─────────────────│                │
 │  View Result    │                  │                │
 │◀────────────────│                  │                │
```

---

## API Specification

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | User registration |
| POST | `/api/v1/auth/login` | User authentication |
| POST | `/api/v1/auth/refresh` | Token refresh |
| POST | `/api/v1/avatar/create` | Create avatar from photo |
| GET | `/api/v1/avatar/{id}` | Retrieve avatar data |
| PUT | `/api/v1/avatar/{id}` | Update avatar |
| DELETE | `/api/v1/avatar/{id}` | Delete avatar |
| POST | `/api/v1/try-on` | Generate try-on image |
| GET | `/api/v1/try-on/{id}` | Retrieve try-on result |
| POST | `/api/v1/recommend/size` | Get size recommendation |
| GET | `/api/v1/products/{hash}` | Get cached product data |
| POST | `/api/v1/analytics/event` | Track anonymized event |

### Request/Response Examples

**Create Avatar**

```
POST /api/v1/avatar/create
Content-Type: multipart/form-data

{
  "photo": <binary>,
  "measurements": {
    "height_cm": 170,
    "weight_kg": 65,
    "chest_cm": 92,
    "waist_cm": 76,
    "hips_cm": 98
  }
}

Response 201:
{
  "id": "av_abc123",
  "status": "processing",
  "estimated_seconds": 30,
  "poll_url": "/api/v1/avatar/av_abc123/status"
}
```

**Virtual Try-On**

```
POST /api/v1/try-on
Content-Type: application/json

{
  "avatar_id": "av_abc123",
  "product": {
    "images": ["https://..."],
    "category": "top",
    "size": "M",
    "brand": "ZARA"
  },
  "options": {
    "angles": ["front", "side"],
    "background": "neutral"
  }
}

Response 202:
{
  "job_id": "try_xyz789",
  "status": "queued",
  "poll_url": "/api/v1/try-on/try_xyz789/status"
}
```

---

## Security Considerations

### Data Privacy

| Data Type | Storage | Encryption | Retention |
|-----------|---------|------------|-----------|
| User photos | Cloud (S3) | AES-256 at rest | Until avatar deletion |
| Avatar assets | Cloud (S3) | AES-256 at rest | Until account deletion |
| Measurements | Database | Encrypted columns | Until account deletion |
| Try-on results | Cache | Encrypted | 24 hours |
| Auth tokens | Memory only | N/A | Session-based |

### Extension Permissions

```json
{
  "permissions": [
    "storage",
    "activeTab"
  ],
  "host_permissions": [
    "https://api.perfit.ai/*"
  ],
  "optional_host_permissions": [
    "https://*.amazon.com/*",
    "https://*.zara.com/*",
    "https://*.hm.com/*"
  ]
}
```

### Security Measures

1. **Authentication**: OAuth 2.0 + JWT with short-lived access tokens
2. **Transport**: TLS 1.3 for all API communication
3. **Input Validation**: Server-side validation for all inputs
4. **Rate Limiting**: Per-user and per-IP rate limits
5. **Content Security Policy**: Strict CSP in extension pages
6. **Isolated Worlds**: Content scripts run in isolated context
7. **No Inline Scripts**: All scripts bundled, no eval()

---

## Development Setup

### Prerequisites

- Node.js 20+
- pnpm 8+
- Chrome 120+ or Firefox 120+

### Installation

```bash
git clone https://github.com/perfit-ai/perfit-extension.git
cd perfit-extension
pnpm install
```

### Development Commands

```bash
pnpm dev           # Start development build with watch
pnpm build         # Production build
pnpm test          # Run test suite
pnpm lint          # Run ESLint
pnpm typecheck     # TypeScript check
```

### Loading in Browser

**Chrome:**
1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist/` directory

**Firefox:**
1. Navigate to `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select any file in the `dist/` directory

---

## Project Structure

```
perfit-extension/
├── src/
│   ├── background/
│   │   ├── index.ts              # Service worker entry
│   │   ├── auth.ts               # Authentication manager
│   │   ├── api.ts                # API client
│   │   ├── state.ts              # State management
│   │   └── sites/                # Site configurations
│   │       ├── index.ts
│   │       ├── amazon.json
│   │       ├── zara.json
│   │       └── ...
│   ├── content/
│   │   ├── index.ts              # Content script entry
│   │   ├── detector.ts           # Product detection
│   │   ├── injector.ts           # UI injection
│   │   └── overlay/
│   │       ├── index.ts
│   │       ├── TryOnOverlay.tsx
│   │       └── styles.css
│   ├── popup/
│   │   ├── index.html
│   │   ├── index.tsx
│   │   └── components/
│   │       ├── AvatarPreview.tsx
│   │       ├── QuickActions.tsx
│   │       └── ...
│   ├── options/
│   │   ├── index.html
│   │   ├── index.tsx
│   │   └── pages/
│   │       ├── Profile.tsx
│   │       ├── Avatar.tsx
│   │       ├── Privacy.tsx
│   │       └── ...
│   ├── shared/
│   │   ├── types.ts
│   │   ├── constants.ts
│   │   ├── storage.ts
│   │   └── messaging.ts
│   └── assets/
│       ├── icons/
│       └── images/
├── public/
│   └── manifest.json
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── scripts/
│   └── build.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Roadmap

### Phase 1: MVP (Days 1-4)
- [x] Extension skeleton with Manifest V3
- [x] User authentication flow
- [x] Basic avatar creation (photo upload + measurements)
- [x] Product detection for 5 major retailers (Amazon, ZARA, H&M, ASOS, Uniqlo)
- [ ] Simple try-on visualization
- [ ] Size recommendation v1

### Phase 2: Core Features (Days 5-8)
- [ ] Enhanced avatar quality (face capture, hair)
- [ ] Diffusion-based try-on engine
- [ ] Multi-angle view generation
- [ ] Size chart extraction and parsing
- [ ] 20+ retailer support
- [ ] Try-on history and favorites

### Phase 3: Advanced Features (Days 9-11)
- [ ] Real-time physics simulation
- [ ] Color/style recommendations
- [ ] Social sharing features
- [ ] Cross-device sync
- [ ] Firefox support
- [ ] Safari support (iOS extension)

### Phase 4: Platform Expansion (Days 12-14)
- [ ] B2B retailer dashboard
- [ ] Analytics and insights API
- [ ] White-label SDK
- [ ] Mobile app (React Native)
- [ ] 100+ retailer support

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Extension Framework | Chrome Extensions Manifest V3 |
| UI Framework | React 18 + TypeScript |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Build Tool | Vite + CRXJS |
| Testing | Vitest + Playwright |
| Backend | Node.js + Fastify |
| ML Inference | Python + PyTorch + ONNX |
| Database | PostgreSQL + Redis |
| Storage | AWS S3 |
| Infrastructure | AWS ECS / Kubernetes |

---

## References

- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [SMPL Body Model](https://smpl.is.tue.mpg.de/)
- [Virtual Try-On Survey (arXiv)](https://arxiv.org/abs/2111.00892)
- [Chromium Design Documents](https://www.chromium.org/developers/design-documents/)

---

## License

Proprietary - All Rights Reserved

Copyright (c) 2024 PerFit AI

