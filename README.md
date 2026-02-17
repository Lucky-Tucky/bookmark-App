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
- Bookmark Create, Read, Delete  functionality
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
 ├─ bookmark/
 │   └─ page.tsx
 ├─ layout.tsx
 └─ page.tsx
lib/
 └─ supabaseClient.ts
.env.local


## Additional Problems Encountered

### Issue: Real-Time Updates Not Reflecting Immediately
**Issue:**  
- Changes made to data were not appearing instantly in the application. Users had to refresh the page to see the updated information, which broke the real-time experience.

**Cause:**  
- Real-time listeners were not properly initialized.
- State updates were not synchronized correctly after data changes.

**Solution:**  
-Implemented real-time database subscriptions using Supabase channels.
- Updated application state directly within subscription callbacks to trigger re-rendering.
---


### Supabase OAuth Redirect URL Mismatch
**Issue:**  
Google OAuth redirected to an incorrect URL.

**Cause:**  
- Production redirect URL was missing in Supabase dashboard

**Solution:**  
- Added both local and production URLs in Supabase Auth Redirect settings

