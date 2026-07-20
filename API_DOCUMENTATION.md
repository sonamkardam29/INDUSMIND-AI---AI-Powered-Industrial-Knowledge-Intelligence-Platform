# API DOCUMENTATION - INDUSMIND AI REST APIs

All endpoints require JWT Bearer authentication in header: `Authorization: Bearer <token>`

---

## 1. Authentication APIs

### `POST /api/auth/signup`
- **Request Body**: `{ name, email, password, role, department }`
- **Response**: `{ message, token, user }`

### `POST /api/auth/login`
- **Request Body**: `{ email, password }`
- **Response**: `{ message, token, user }`

---

## 2. Document Management & OCR APIs

### `POST /api/documents/upload`
- **Content-Type**: `multipart/form-data`
- **Fields**: `file` (PDF/DOCX/XLSX/PNG), `title`, `department`, `equipmentId`, `category`
- **Action**: Extracts text via Tesseract OCR, splits into chunks, and indices vectors.

### `GET /api/documents`
- **Query Params**: `search`, `department`, `category`
- **Response**: `{ documents: IDocument[] }`

---

## 3. RAG AI Knowledge Copilot APIs

### `POST /api/chat/query`
- **Request Body**: `{ question: string, chatId?: string, department?: string }`
- **Response**:
```json
{
  "chatId": "65a123...",
  "message": {
    "sender": "assistant",
    "content": "Step 1: Depress Emergency Fuel Shut-off Switch...",
    "confidenceScore": 98,
    "citations": [
      {
        "documentTitle": "Gas Turbine GT-800 SOP-402",
        "pageNumber": 4,
        "snippet": "Depress Emergency Fuel Shut-off Switch (ES-101)...",
        "similarity": 0.94
      }
    ],
    "sourceDocs": ["Gas Turbine GT-800 SOP-402"],
    "pageNumbers": [4]
  }
}
```

---

## 4. Maintenance Copilot APIs

### `POST /api/maintenance/generate`
- **Request Body**: `{ equipmentId, equipmentName, issueType, description }`
- **Response**: RCA Diagnosis, Step-by-Step Repair Guide, Spare Parts, Downtime Estimate.

---

## 5. Compliance & Audit APIs

### `POST /api/compliance/audit`
- **Request Body**: `{ department, standard }`
- **Response**: Compliance Score (0-100), Missing SOPs list, ISO/OSHA findings.

---

## 6. Reports PDF Generation APIs

### `GET /api/reports/download`
- **Query Params**: `type`, `title`, `department`
- **Response**: Downloadable Binary PDF Stream (`application/pdf`)
