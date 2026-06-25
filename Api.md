# ZINGRO HomeMakers — API Reference

> **Status: Proposed specification.** The current app runs on in-memory mock data and has no backend. This document is the contract to build the backend against, derived from the frontend data shapes and flows.

---

## Conventions

- **Base URL:** `https://api.zingro.in/v1`
- **Format:** JSON request and response bodies (`Content-Type: application/json`).
- **Auth:** JWT bearer tokens. Send `Authorization: Bearer <access_token>` on all protected routes.
- **Currency:** All monetary amounts are integers in paise (₹1 = 100 paise) to avoid float errors. Example: `20000` = ₹200.00.
- **Timestamps:** ISO 8601 UTC (e.g. `2026-06-25T08:00:00Z`).
- **IDs:** Opaque strings. Do not assume format.

### Auth model

- `POST /auth/*` issues a short-lived `access_token` (~15 min) and a longer-lived `refresh_token` (~30 days).
- On `401 token_expired`, call `POST /auth/refresh` to get a new access token.
- Logout revokes the refresh token server-side.

### Standard error shape

All errors return this body with the appropriate HTTP status:

```json
{
  "error": {
    "code": "validation_failed",
    "message": "Phone number must be 10 digits.",
    "details": [{ "field": "phone", "issue": "invalid_format" }]
  }
}
```

Common codes: `validation_failed` (400), `unauthorized` (401), `token_expired` (401), `forbidden` (403), `not_found` (404), `conflict` (409), `rate_limited` (429), `server_error` (500).

### Pagination

List endpoints accept `?page=1&limit=20` and return:

```json
{ "data": [ ... ], "page": 1, "limit": 20, "total": 84 }
```

---

## 1. Authentication

### POST /auth/signup
Create a cook account. Triggers OTP send.

Request:
```json
{ "fullName": "Sunita Sharma", "phone": "9876543210" }
```
Response `201`:
```json
{ "userId": "usr_abc123", "otpSent": true, "expiresInSec": 30 }
```

### POST /auth/otp/verify
Verify the OTP and authenticate.

Request:
```json
{ "userId": "usr_abc123", "otp": "1234" }
```
Response `200`:
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "rft_...",
  "user": { "id": "usr_abc123", "fullName": "Sunita Sharma", "onboardingComplete": false }
}
```

### POST /auth/otp/resend
Request:
```json
{ "userId": "usr_abc123" }
```
Response `200`: `{ "otpSent": true, "expiresInSec": 30 }`

### POST /auth/login
Password or OTP-based login for returning cooks.

Request:
```json
{ "phone": "9876543210", "password": "••••••" }
```
Response `200`: same shape as `/auth/otp/verify`.

### POST /auth/refresh
Request:
```json
{ "refreshToken": "rft_..." }
```
Response `200`: `{ "accessToken": "eyJ..." }`

### POST /auth/logout
Auth required. Revokes the refresh token.
Response `204` (no content).

---

## 2. Onboarding

The onboarding flow collects data across steps. Each step can be saved independently so progress persists. All routes require auth.

### GET /onboarding
Returns current onboarding state and completion status.
Response `200`:
```json
{
  "step": 3,
  "totalSteps": 5,
  "complete": false,
  "personal": { "fullName": "Sunita Sharma", "email": "sunita@example.com", "gender": "female" },
  "address": { "building": "B-204 Lotus PG", "locality": "Bandra West", "pincode": "400050" },
  "bank": null,
  "kitchen": null
}
```

### PUT /onboarding/personal
```json
{ "fullName": "Sunita Sharma", "email": "sunita@example.com", "gender": "female" }
```

### PUT /onboarding/address
```json
{ "building": "B-204 Lotus PG", "locality": "Bandra West", "pincode": "400050" }
```

### PUT /onboarding/bank
> Sensitive. Account number is never returned in full after submission — only last 4 digits.
```json
{ "accountHolder": "Sunita Sharma", "bankName": "HDFC Bank", "accountNumber": "123456789012" }
```
Response `200`:
```json
{ "accountHolder": "Sunita Sharma", "bankName": "HDFC Bank", "accountLast4": "9012", "verified": false }
```

### PUT /onboarding/kitchen
```json
{ "cuisine": "North Indian", "foodCategory": "Vegetarian", "capacityPerDay": 20 }
```

### POST /onboarding/submit
Finalizes onboarding and moves the cook into verification (`status: submitted`).
Response `200`: `{ "onboardingComplete": true, "verificationStatus": "submitted" }`

---

## 3. Documents & Verification

> **Compliance note:** Aadhaar and bank verification should be performed via a regulated third-party KYC provider (the Data Processor). The backend stores only verification status, masked references, and the provider's transaction token — never raw Aadhaar numbers or full document images in the primary store. Documents go to a private bucket via pre-signed URLs.

### POST /documents/upload-url
Request a pre-signed upload URL for a document.

Request:
```json
{ "docType": "aadhaar_front", "contentType": "image/jpeg" }
```
`docType` enum: `aadhaar_front`, `aadhaar_back`, `fssai_license`, `kitchen_photo`.

Response `200`:
```json
{ "uploadUrl": "https://s3.../signed", "documentId": "doc_xyz", "expiresInSec": 300 }
```
The client `PUT`s the file bytes directly to `uploadUrl`.

### POST /documents/{documentId}/confirm
Confirms upload completed; backend marks the document received.
Response `200`: `{ "documentId": "doc_xyz", "docType": "aadhaar_front", "status": "received" }`

### GET /verification
Returns the cook's verification state.
Response `200`:
```json
{
  "status": "rejected",
  "updatedAt": "2026-06-25T08:00:00Z",
  "documents": [
    { "docType": "aadhaar_front", "status": "rejected", "flagged": true },
    { "docType": "fssai_license", "status": "rejected", "flagged": true },
    { "docType": "aadhaar_back", "status": "verified", "flagged": false },
    { "docType": "kitchen_photo", "status": "verified", "flagged": false }
  ],
  "rejectionReasons": [
    "Aadhaar Card image is blurry and unreadable",
    "FSSAI License has expired"
  ]
}
```
`status` enum: `none`, `submitted`, `review`, `approved`, `rejected`.

### POST /verification/resubmit
After re-uploading flagged documents, resubmit for review.
Response `200`: `{ "status": "submitted" }`

### POST /verification/initiate-kyc *(provider-backed)*
Server-to-provider call to start Aadhaar/PAN/bank KYC. Returns a status the client polls or receives via webhook.
Response `202`: `{ "kycRef": "kyc_123", "status": "pending" }`

---

## 4. Orders

All routes require auth. Orders belong to the authenticated cook.

### Order object
```json
{
  "id": "ZG-9421",
  "customer": "Priya Sharma",
  "status": "pending",
  "items": [
    { "name": "Idli Sambar", "qty": 2, "price": 6000 },
    { "name": "Medu Vada (2pc)", "qty": 1, "price": 8000 }
  ],
  "total": 20000,
  "createdAt": "2026-06-25T07:50:00Z"
}
```
`status` lifecycle: `pending → preparing → ready → completed`, or terminal `rejected` / `cancelled`.

### GET /orders
Query: `?status=pending` or `?tab=new|active|history`.
Response `200`: paginated list of order objects.

### GET /orders/{id}
Response `200`: single order object.

### PATCH /orders/{id}/status
Advance or set order status.
Request:
```json
{ "status": "preparing" }
```
Allowed transitions are enforced server-side. Invalid transitions return `409 conflict`.
Response `200`: updated order object.

### POST /orders/{id}/reject
Request:
```json
{ "reason": "Out of stock" }
```
Response `200`: order with `status: rejected`.

---

## 5. Menu

### Dish object
```json
{
  "id": "dish_001",
  "name": "Butter Chicken Deluxe",
  "price": 25000,
  "description": "Authentic north-indian creamy butter chicken.",
  "category": "North Indian",
  "tag": "Best Seller",
  "available": true
}
```

### GET /menu/dishes
Query: `?q=paneer&category=North Indian`.
Response `200`: paginated list of dish objects.

### POST /menu/dishes
```json
{ "name": "Veg Thali", "price": 15000, "description": "...", "category": "North Indian" }
```
Response `201`: created dish object.

### PUT /menu/dishes/{id}
Full update of a dish. Response `200`: updated dish.

### PATCH /menu/dishes/{id}/availability
```json
{ "available": false }
```
Response `200`: updated dish.

### DELETE /menu/dishes/{id}
Response `204`.

### GET /menu/categories
Response `200`: `{ "data": ["North Indian", "South Indian", "Beverages", "Desserts", "Snacks"] }`

### POST /menu/categories
```json
{ "name": "Chinese" }
```
Response `201`: `{ "name": "Chinese" }`

### DELETE /menu/categories/{name}
Response `204`. Returns `409` if dishes still reference the category.

---

## 6. Plans (Subscriptions)

### Plan object
```json
{
  "id": "pro",
  "name": "Pro Plan",
  "price": 29900,
  "periodDays": 30,
  "status": "active",
  "daysUsed": 2,
  "daysTotal": 30,
  "expiresAt": "2026-07-25T00:00:00Z"
}
```
`status` enum: `active`, `inactive`, `expired`.

### GET /plans
Response `200`: list of the cook's plans.

### POST /plans
```json
{ "name": "Weekly Tiffin", "price": 9900, "periodDays": 7, "description": "..." }
```
Response `201`: created plan object.

### POST /plans/{id}/subscribe
Activates/purchases a plan. Returns a payment intent if payment is required.
Response `200`:
```json
{ "plan": { "...": "..." }, "paymentRequired": true, "paymentIntentId": "pi_abc" }
```

---

## 7. Billing & Invoices

> **Compliance note:** GST rates, HSN/SAC codes, and Section 9(5) liability must be confirmed with a chartered accountant. Amounts below are illustrative structure.

### Invoice object
```json
{
  "id": "inv_001",
  "type": "order",
  "number": "ZG/ORD/2026/0421",
  "date": "2026-06-25",
  "party": { "name": "Priya Sharma", "gstin": "29ABCDE1234F1Z5", "state": "Karnataka" },
  "lines": [
    { "label": "Idli Sambar × 2", "amount": 12000 },
    { "label": "Delivery fee", "amount": 3000 }
  ],
  "subtotal": 15000,
  "taxes": [
    { "label": "CGST (2.5%)", "amount": 300 },
    { "label": "SGST (2.5%)", "amount": 300 }
  ],
  "tax": 600,
  "total": 15600
}
```
`type` enum: `order`, `payout`, `subscription`.

### GET /billing/invoices
Query: `?type=order&from=2026-06-01&to=2026-06-30`.
Response `200`: paginated list of invoice objects.

### GET /billing/invoices/{id}
Response `200`: single invoice object.

### GET /billing/invoices/{id}/pdf
Returns the rendered invoice as a PDF.
Response `200`: `Content-Type: application/pdf` (binary body).

### GET /billing/payouts
Cook payout statements (commission deducted).
Response `200`: paginated list of invoice objects with `type: payout`.

---

## 8. Profile

### GET /profile
Response `200`:
```json
{
  "kitchenName": "Sunita's Kitchen",
  "email": "sunita@example.com",
  "phone": "+91 98765 43210",
  "cuisine": "North Indian",
  "experienceYears": 5
}
```

### PUT /profile
Partial or full update of editable profile fields. Response `200`: updated profile.

---

## 9. Support / Contact

### POST /support/messages
Auth optional (public contact form allowed).
```json
{ "name": "Sunita", "email": "sunita@example.com", "message": "How do I get paid?" }
```
Response `201`: `{ "id": "msg_001", "received": true }`

### GET /support/faqs
Response `200`: `{ "data": [ { "q": "...", "a": "..." } ] }`

---

## 10. Webhooks (provider → backend)

For asynchronous events from KYC and payment providers. Verify signatures on every webhook.

### POST /webhooks/kyc
Payload (provider-specific; example):
```json
{ "kycRef": "kyc_123", "result": "verified", "maskedAadhaar": "XXXX-XXXX-1234" }
```

### POST /webhooks/payments
```json
{ "paymentIntentId": "pi_abc", "status": "succeeded", "amount": 29900 }
```

---

## Compliance & security summary

- **Never store** raw Aadhaar numbers, OTPs, full bank account numbers, or document images in the primary database. Store masked references and provider tokens only.
- **Encrypt** sensitive fields at rest; serve documents from a private bucket via short-lived pre-signed URLs.
- **Consent:** capture and timestamp the cook's consent before processing personal data (DPDP Act).
- **Retention:** define and enforce a deletion policy; purge rejected-applicant data after a set window.
- **Breach response:** maintain audit logs (~1 year) and a 72-hour breach notification runbook.
- **Authorization:** every data route must verify the JWT subject owns the requested resource — never trust the client.

> These are engineering guidelines, not legal advice. Validate consent wording, retention periods, GST treatment, and KYC provider contracts (DPA) with a qualified lawyer and CA before production.