# INDUSMIND AI - AI Powered Industrial Knowledge Intelligence Platform

> **ET AI Hackathon 2026 Submission**  
> Enterprise-grade AI RAG platform engineered for industrial operations (Oil & Gas, Manufacturing, Energy, Aerospace, Automotive, Chemical Plants).

![INDUSMIND AI Banner](https://img.shields.io/badge/INDUSMIND_AI-Enterprise_RAG-00F2FE?style=for-the-badge&logo=google-gemini)

---

## 🌟 Executive Overview

Industries store thousands of SOPs, engineering manuals, maintenance reports, inspection logs, and scanned PDFs. Employees waste critical hours manually locating operational procedures during emergencies or routine maintenance.

**INDUSMIND AI** empowers plant engineers, operators, auditors, and safety officers to upload any industrial document (PDF, DOCX, Excel, Images, Scanned PDFs) and instantly ask natural language questions with **100% Anti-Hallucination RAG Grounding**.

### Every AI Answer Includes:
- **Confidence Score (%)** (e.g. 98% Match)
- **Source Document Name**
- **Exact Page Number**
- **Citation Excerpts & Direct Quotes**
- **Related Industrial Documents**

---

## 🚀 Key Modules & Features

1. **AI Knowledge Copilot**: ChatGPT-style workspace with streaming responses, suggested prompts, markdown support, voice search (Speech-to-Text), text-to-speech (TTS), and chat exports.
2. **Document Management & Tesseract OCR**: Upload multi-format files with automatic OCR text extraction for scanned PDFs and engineering drawings.
3. **Interactive Knowledge Graph**: Graph node visualizer connecting Gas Turbines, Compressors, SOPs, Departments, Failure modes, and Incident logs.
4. **Maintenance Copilot & RCA**: Instant AI generation of Root Cause Analysis (RCA), step-by-step repair checklists, downtime estimators, and spare parts recommendations.
5. **Quality & Regulatory Compliance Engine**: Automated auditor cross-referencing uploaded SOPs against ISO 9001, OSHA 1910, ISO 45001, API 570, and missing SOP detectors.
6. **Enterprise PDF Report Generator**: 1-click download of dynamically formatted PDF reports for Maintenance, Inspection, Audit findings, and Executive AI Summaries.
7. **6-Level Enterprise RBAC Security**: Admin, Maintenance Engineer, Plant Operator, Quality Engineer, Safety Officer, and Auditor roles with instant 1-click evaluation role switcher.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion, Chart.js, Lucide Icons, React Router DOM, React Query.
- **Backend**: Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT Authentication, PDFKit.
- **AI & RAG**: Google Gemini API, Cosine Similarity Vector Embedding Index, Anti-Hallucination Grounding Prompting.
- **OCR & Parser**: Tesseract.js OCR, PDF Parser, Multer.
- **Deployment**: Vercel (Frontend), Render / Node (Backend), MongoDB Atlas (Database).
- Demo video : https://drive.google.com/file/d/10IqGB4xm1b9ZXDWP0MGV9GrZ0Q3bGCIl/view?usp=sharing
- Live link : https://indusmind-ai-ai-powered-industrial-omega.vercel.app/login

---

## 💻 Quick Start & Running Locally

### 1. Clone & Setup Backend
```bash
cd server
npm install
npm run seed     # Populate database with sample industrial SOPs and 6 enterprise role users
npm run dev      # Starts server on http://localhost:5000
```

### 2. Setup Frontend
```bash
cd client
npm install
npm run dev      # Starts React Vite client on http://localhost:3000
```

---

## 🏆 Hackathon Quick Evaluation Guide

For instant evaluation during judge review:
1. Open the web app and click **Sign In**.
2. Click any of the **1-Click Evaluation Login Buttons** (e.g., *Maintenance Engineer*, *Admin*, *Safety Officer*) to instantly experience role-based access.
3. Navigate to **AI Knowledge Copilot** and ask:
   - *"What is the emergency shutdown procedure for Gas Turbine GT-800?"*
   - Observe >=95% Confidence score, Source Document title, Page 4 reference, and citation quote.
4. Test **Anti-Hallucination**: Ask an unrelated sports/general question (e.g., *"Who won the 1970 World Cup?"*) and verify the response: `"I could not find this information in uploaded documents."`
5. Test **PDF Report Generator** under `/reports` to download synthesized PDF reports.
