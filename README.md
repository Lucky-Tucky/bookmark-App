# 🔖 Bookmark App

A full-stack bookmark management application built with **Next.js** and **Supabase**.  
It supports **Google OAuth authentication**, secure session handling, and cloud deployment on **Vercel**.

🔗 **Live App**: https://bookmark-app-sooty-sigma.vercel.app/

---

## 📌 Overview

Bookmark App allows users to:
- Sign in using Google
- Save and manage bookmarks
- Access bookmarks securely from any device
- Use a clean OAuth flow without exposing tokens

This project focuses on **real-world authentication problems** and their solutions.

---

## ✨ Features

- Google OAuth Authentication
- Secure Supabase session handling
- Client-side & SSR-safe auth flow
- Bookmark CRUD functionality
- Environment-based redirect handling
- Production deployment on Vercel

---

## 🧱 Tech Stack

| Layer | Technology |
|-----|-----------|
| Frontend | Next.js (App Router) |
| Auth | Supabase Auth (Google OAuth) |
| Database | Supabase PostgreSQL |
| Deployment | Vercel |
| Language | TypeScript |

---

## 📂 Project Structure

```text
app/
 ├─ auth/
 │   └─ callback/
 │       └─ page.tsx
 ├─ bookmark/
 │   └─ page.tsx
 ├─ layout.tsx
 └─ page.tsx
lib/
 └─ supabaseClient.ts
.env.local
