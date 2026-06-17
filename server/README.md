# CrimeGPT Server

Express + MongoDB backend for the CrimeGPT government investigation management system.

## Setup

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```
2. Create `.env` from `.env.example`.
3. Start MongoDB locally or configure `MONGO_URI`.
4. Run the server:
   ```bash
   npm run dev
   ```

## Features

- JWT auth with RBAC
- Unified case data model
- Evidence upload and SHA256 hashing
- Document generation endpoints
- AI complaint analysis placeholder
- Audit trail and activity logs
