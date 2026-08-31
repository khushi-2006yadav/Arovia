# 🩺 AROVIA — Smart Health Report Companion

> **Understand. Track. Care.**

AROVIA is a smart digital health platform designed to help users **understand medical reports, organize medication history, track health trends, and discover affordable medicine-access options** through a single, user-friendly interface.

Instead of treating a medical report as a one-time document, AROVIA aims to build a **continuous health record** where users can understand their information, revisit previous records, observe changes over time, and take informed next steps.

🌐 **Live Prototype:** https://aro-via.netlify.app/

---

## 📌 Table of Contents

* [Problem](#-problem)
* [Our Solution](#-our-solution)
* [Key Features](#-key-features)
* [How AROVIA Works](#-how-arovia-works)
* [System Architecture](#-system-architecture)
* [Technology Stack](#-technology-stack)
* [Project Structure](#-project-structure)
* [Medical Report Processing Pipeline](#-medical-report-processing-pipeline)
* [Medication Intelligence](#-medication-intelligence)
* [Health Tracking](#-health-tracking)
* [Affordable Medicine Access](#-affordable-medicine-access)
* [Security & Responsible Use](#-security--responsible-use)
* [Getting Started](#-getting-started)
* [Environment Configuration](#-environment-configuration)
* [Future Scope](#-future-scope)
* [Contributing](#-contributing)
* [Disclaimer](#-disclaimer)

---

# 🚨 Problem

Medical information is often difficult for patients to understand and is frequently scattered across different reports, prescriptions and previous records.

Users may face difficulties such as:

* Understanding complex medical terminology and report values.
* Remembering which medicines they are currently taking.
* Revisiting their previous medication history.
* Identifying changes in health indicators across multiple reports.
* Understanding medicine information such as generic names, uses and side effects.
* Finding affordable medicine-access options.
* Maintaining a continuous view of their health journey.

AROVIA addresses these challenges by bringing important health information into a **single, structured and understandable digital experience**.

---

# 💡 Our Solution

AROVIA follows a simple health journey:

```text
        UNDERSTAND
             ↓
      Medical Reports
             ↓
        ORGANIZE
             ↓
    Medication History
             ↓
          TRACK
             ↓
      Health Trends
             ↓
           ACT
             ↓
 Affordable & Practical
      Next Steps
```

The platform combines a modern web interface, backend services, data storage and AI-assisted processing to transform medical information into a more understandable and organized experience.

---

# ✨ Key Features

## 📄 1. Medical Report Understanding

Users can upload supported medical-report images and process them through the document-reading pipeline.

AROVIA can:

* Accept medical-report images.
* Validate supported image formats.
* Preprocess uploaded images.
* Correct image orientation.
* Extract relevant medical information.
* Convert extracted information into structured data.
* Send the processed record to the backend.

The repository contains a dedicated `document_reader` module for this workflow, including image reading, preprocessing, orientation correction, extraction and backend mapping.

---

## 💊 2. Medicine Information

AROVIA is designed to provide useful information about medicines in an understandable format.

For supported medicines, the platform can present:

* **Generic name**
* **Uses**
* **Side-effect information**
* Relevant medicine details

### Example

```text
Medicine
   ↓
Generic Name
   ↓
Uses
   ↓
Side Effects
   ↓
Affordable Access Options
```

This helps users better understand the medicine information associated with their records.

> **Important:** Medicine information should be used for awareness and understanding. It should not be treated as a replacement for a doctor's or qualified pharmacist's advice.

---

# 💊 3. Personalized Medication Record

AROVIA maintains a personalized medication record so that users can keep track of their medication journey.

### Current Medication

Users can view the medicines they are currently taking.

### Past Medication

Users can also revisit medicines that were part of their previous medication history.

This creates a longitudinal medication timeline:

```text
Past Medications
      ↓
Current Medications
      ↓
Medication History
      ↓
Easier Health Tracking
```

Instead of remembering previous medicines manually, users can maintain their medication information in one organized place.

---

# 📈 4. Multiple Health Trends

A single medical report only represents a snapshot in time.

AROVIA aims to make the user's complete record more meaningful by showing **health indicators across the record timeline**.

Users can observe:

* Changes in health indicators.
* Fluctuations across different reports.
* Historical values.
* Long-term patterns.

### Conceptual flow

```text
Report 1 ────●
             │
Report 2 ────●────●
                  │
Report 3 ─────────●
                  │
Report 4 ─────────●

        ↓

   HEALTH TREND
   OVER TIME
```

This makes it easier to look at health information as a **timeline rather than isolated reports**.

---

# 🩺 5. Summarized Health Overview

AROVIA provides a summarized view of the user's health information.

Instead of requiring users to go through every report individually, the platform aims to present important information in a simpler overview.

The health summary can include:

* Important health indicators.
* Relevant trends.
* Medication context.
* General wellness suggestions.
* Suggestions related to exercise.
* Suggestions for improving daily routine.

The goal is to provide a **quick snapshot of the user's health journey** while keeping the underlying records available for detailed review.

---

# 💰 6. Generic Medicine & Affordable Access

AROVIA connects medicine understanding with affordable-access discovery.

When users learn about a medicine's generic name, they can also explore nearby **Jan Aushadhi Kendras** as a potential source for affordable generic medicines.

### User Journey

```text
Medicine Information
        ↓
Generic Name
        ↓
Explore Generic Options
        ↓
Find Nearby
Jan Aushadhi Kendra
        ↓
Discuss / Purchase
with Pharmacist or Doctor
```

The purpose is not to automatically replace a prescribed medicine, but to **help users understand generic alternatives and discover affordable access points**.

---

# 📍 7. Nearby Jan Aushadhi Kendra

AROVIA includes a nearby-Jan-Aushadhi discovery feature.

The idea is to connect:

**Medicine Information → Generic Awareness → Nearby Access**

This can help users discover nearby Jan Aushadhi Kendras when exploring affordable medicine options.

The platform acts as an information and discovery layer; actual medicine selection or substitution should be confirmed with a qualified doctor or pharmacist.

---

# 🔄 How AROVIA Works

The overall workflow can be represented as:

```text
┌─────────────────────┐
│      USER           │
│ Uploads / Views     │
│ Health Information  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   REACT FRONTEND    │
│                     │
│ Reports             │
│ Medication          │
│ Health Trends       │
│ Health Summary      │
│ Jan Aushadhi        │
└──────────┬──────────┘
           │ REST APIs
           ▼
┌─────────────────────┐
│   SPRING BOOT       │
│      BACKEND        │
│                     │
│ Business Logic      │
│ Authentication      │
│ API Services        │
│ Data Management     │
└───────┬───────┬─────┘
        │       │
        ▼       ▼
┌────────────┐ ┌────────────────┐
│  MongoDB   │ │     Redis      │
│            │ │                │
│ Persistent │ │ Fast / temporary│
│ health data│ │ data access     │
└────────────┘ └────────────────┘
        │
        ▼
┌─────────────────────┐
│     AI SERVICES     │
│                     │
│ LangChain           │
│ Pydantic Parser     │
│ LLM                 │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Structured &        │
│ Understandable      │
│ Health Information  │
└─────────────────────┘
```

---

# 🏗️ System Architecture

AROVIA is organized into multiple major components:

### 1. Frontend — React

The frontend provides the user-facing interface for:

* Medical reports.
* Medication records.
* Health trends.
* Health summaries.
* Affordable medicine discovery.
* User interactions and navigation.

The repository's frontend uses React with Vite, React Router and supporting UI/animation libraries.

### 2. Backend — Spring Boot

The backend provides:

* REST API services.
* Business logic.
* Data management.
* Authentication and security.
* Communication with MongoDB and Redis.
* AI-service integration.

The backend project is a Maven-based Spring Boot application using Java 21.

### 3. Database / Cloud Layer

#### MongoDB

Used for persistent application data and health-related records.

The backend includes Spring Data MongoDB support.

#### Redis

Used as a fast data-access layer for appropriate temporary/cached data.

The backend includes Spring Data Redis support.

### 4. AI Services

AROVIA's AI layer is designed around:

* **LangChain** — orchestrates AI workflows and context.
* **Pydantic Output Parser** — structures and validates model outputs.
* **LLM** — generates natural-language explanations and AI-assisted insights.

The backend also includes Spring AI and an Ollama model starter, showing that AI/model integration is part of the backend stack.

---

# 🤖 Medical Report Processing Pipeline

The repository contains a dedicated `document_reader` module.

The processing flow is:

```text
Medical Report Image
        ↓
File Validation
        ↓
Image Reading
        ↓
Image Preprocessing
        ↓
Orientation Correction
        ↓
Medical Information Extraction
        ↓
Structured Report Data
        ↓
Backend Payload Mapping
        ↓
Spring Boot Backend
        ↓
Medical Record Storage
```

The implemented document-reader API exposes:

```text
GET  /health

POST /extract-medical-report
```

The extraction endpoint accepts an image upload along with a user ID and token, supports JPEG/PNG/WEBP input, processes the image, extracts medical information, maps it into a backend payload and sends the record to the backend.

---

# 🔐 Security & Responsible Use

Because AROVIA deals with sensitive health information, security is an important part of the architecture.

The backend includes support for:

* Spring Security.
* OAuth2 client/authorization-server components.
* JWT libraries.
* Validation.
* Authentication-related services.

These dependencies are present in the backend's Maven configuration.

### Responsible AI

AROVIA is intended to **assist with understanding and organizing health information**, not replace professional medical care.

AI-generated information should be treated as supportive information and should be verified with qualified healthcare professionals when making medical decisions.

---

# 🛠️ Technology Stack

| Layer             | Technology              | Purpose                            |
| ----------------- | ----------------------- | ---------------------------------- |
| Frontend          | React                   | Interactive user interface         |
| Build Tool        | Vite                    | Frontend development and build     |
| Routing           | React Router            | Client-side navigation             |
| UI / Animation    | GSAP, Lucide React      | Interface interactions and visuals |
| Backend           | Spring Boot             | APIs and business logic            |
| Language          | Java 21                 | Backend development                |
| Database          | MongoDB                 | Persistent application/health data |
| Fast Data Layer   | Redis                   | Fast/cached data access            |
| Security          | Spring Security         | Authentication and security        |
| Authentication    | JWT / OAuth2            | Secure user access                 |
| AI Framework      | Spring AI / AI Services | AI integration                     |
| Model Runtime     | Ollama                  | Local/model integration            |
| AI Orchestration  | LangChain               | AI workflow orchestration          |
| Output Validation | Pydantic Output Parser  | Structured model output            |
| AI Model          | LLM                     | Natural-language generation        |
| Document Reader   | Python / FastAPI        | Medical image processing pipeline  |

The React dependencies and scripts are defined in the frontend's `package.json`, while the backend stack is defined in `pom.xml`.

---

# 📁 Project Structure

The main repository currently contains three important application areas:

```text
Arovia/
│
├── arovia-frontend/
│   ├── public/
│   ├── src/
│   ├── dist/
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── index.html
│
├── arovia-backend/
│   ├── src/
│   ├── .mvn/
│   ├── Dockerfile
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── document_reader/
│   ├── api_call.py
│   ├── backend_api.py
│   ├── backend_mapper.py
│   ├── image_preprocessor.py
│   ├── image_reader.py
│   ├── main.py
│   └── orientation.py
│
└── .github/
    └── workflows/
```

This structure is visible in the repository and its three major directories.

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are available:

* Git
* Node.js and npm
* Java 21
* Maven
* MongoDB
* Redis
* Python
* Required AI/model runtime configuration

---

## 1. Clone the Repository

```bash
git clone https://github.com/khushi-2006yadav/Arovia.git
cd Arovia
```

---

# 🎨 Running the Frontend

Move into the frontend directory:

```bash
cd arovia-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend uses Vite and provides `dev`, `build`, `lint` and `preview` scripts.

For production build:

```bash
npm run build
```

---

# ⚙️ Running the Spring Boot Backend

Move into:

```bash
cd arovia-backend
```

Using Maven wrapper:

### Windows

```bash
mvnw.cmd spring-boot:run
```

### Linux / macOS

```bash
./mvnw spring-boot:run
```

The backend is a Maven-based Spring Boot application using Java 21.

---

# 🤖 Running the Document Reader

The document reader is located inside:

```text
document_reader/
```

It is implemented using FastAPI and exposes the medical-report extraction endpoint.

The service performs:

```text
Upload
  ↓
Image Validation
  ↓
Image Preprocessing
  ↓
Orientation Correction
  ↓
Medical Information Extraction
  ↓
Backend Mapping
  ↓
Medical Record Save
```

The repository's implementation currently supports JPEG, PNG and WEBP image uploads for the extraction endpoint.

---

# 🔧 Environment Configuration

The frontend repository contains:

```text
.env.example
```

Use environment variables for configuration rather than committing secrets directly into the repository.

Typical configuration may include:

```env
# Backend
BACKEND_URL=

# Database
MONGODB_URI=

# Redis
REDIS_URL=

# AI / Model configuration
LLM_BASE_URL=
LLM_MODEL=

# Authentication / security
JWT_SECRET=
```

> **Do not commit real API keys, database passwords, JWT secrets or other credentials to GitHub.**

Use your actual project configuration variable names when setting up the environment.

---

# 🌐 Live Prototype

### AROVIA Web Application

**https://aro-via.netlify.app/**

The live prototype demonstrates the user-facing AROVIA experience.

---

# 📊 Product Flow

The complete product journey can be summarized as:

```text
                    ┌───────────────┐
                    │     USER      │
                    └───────┬───────┘
                            │
                            ▼
                 ┌────────────────────┐
                 │ Upload / View Data │
                 └─────────┬──────────┘
                           │
                           ▼
                 ┌────────────────────┐
                 │ Medical Report     │
                 │ Processing         │
                 └─────────┬──────────┘
                           │
                           ▼
                 ┌────────────────────┐
                 │ AI-assisted        │
                 │ Understanding      │
                 └─────────┬──────────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
       Medication      Health        Medicine
         Record         Trends       Information
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                  ┌─────────────────┐
                  │ Health Summary  │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Affordable      │
                  │ Access Options  │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Nearby Jan      │
                  │ Aushadhi Kendra │
                  └─────────────────┘
```

---

# 🔮 Future Scope

Potential future improvements include:

* More advanced medical-report formats.
* Support for additional document types.
* Improved extraction accuracy.
* More comprehensive medicine information.
* Better longitudinal health analytics.
* More personalized wellness recommendations.
* Expanded Jan Aushadhi / healthcare-location discovery.
* Improved AI response validation.
* More integrations with digital health ecosystems.
* Mobile application support.
* Enhanced accessibility and multilingual support.
* More automated testing and monitoring.

---

# 🤝 Contributing

Contributions are welcome.

A typical contribution workflow:

```bash
# Fork the repository

# Clone your fork
git clone <your-fork-url>

# Create a feature branch
git checkout -b feature/your-feature

# Make your changes

# Commit
git add .
git commit -m "Add: your feature"

# Push
git push origin feature/your-feature
```

Then open a Pull Request with:

* What was changed.
* Why the change was needed.
* How it was tested.
* Any relevant screenshots or implementation notes.

---

# 📜 License

No explicit open-source license is currently declared in the repository. If this project is intended to be open source, add an appropriate `LICENSE` file before publishing or distributing it.

---

# 👩‍💻 Project

**AROVIA — Smart Health Report Companion**

> **Understand. Track. Care.**

**Repository:**
https://github.com/khushi-2006yadav/Arovia

**Live Prototype:**
https://aro-via.netlify.app/

---

## ⚠️ Disclaimer

AROVIA is designed as a **health-information and organization platform**.

It is not intended to diagnose diseases, prescribe medicines, replace a doctor, or make autonomous medical decisions.

Medicine information, generic-medicine information, side-effect information and AI-generated explanations should be verified with a qualified healthcare professional before making medical decisions.
TEAM MEMBERS-:
1)Nandani Chaudhary-:UI/UX design
2)Khushi Yadav-:
3)Saksham Aggarwal-:AI
4)Nikhil Pathak-:Backend(spring boot)
5)Navraj Tanwar-:Javascript
6)Samarth Jaitly-:frontend(javascript)
