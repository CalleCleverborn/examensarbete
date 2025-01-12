# VocalFlow – README

VocalFlow är en AI-driven rösttransformationstjänst som låter användare ladda upp en ljudfil och omvandla rösten till olika ”voice models” via en extern tjänst.

## **1. Översikt**

- **Frontend:** React/TypeScript
- **Backend:** Node.js (Express) och Mongoose (MongoDB)

## **2. Beroenden**

- **Backend:**
  - Node.js 16+
  - Express
  - Mongoose
  - Passport (Google OAuth)
  - Stripe
  - axios, form-data, multer
- **Frontend:**
  - React 18+
  - React Router DOM
  - TypeScript
  - SASS (SCSS)

## **3. Krav och miljövariabler**

## I backend

- **.env**:
  MONGODB_URI="" KITS_API_KEY="" GOOGLE_CLIENT_ID="" GOOGLE_CLIENT_SECRET="" STRIPE_SECRET_KEY=""

## **4. Installation**

1. **Klona** detta repo.
2. **Installera beroenden** i både `backend` och `frontend` med `npm install`.
3. **Skapa** en `.env`-fil i backend med dina API-nycklar och databaskoppling.
4. **Starta**:

# I backend-mappen

npm run dev

# I frontend-mappen

npm run dev

```

```
