# Deployment Guide 🚀

Your **Vendora** application uses a **Serverless Architecture**:
- **Frontend**: React (Vite) → **Deploy to Vercel**
- **Backend**: Supabase (Database & Auth) → **Already Hosted** on Supabase Cloud

> **Reference**: You asked about "Render", but since your app connects directly to Supabase, you do **not** need a separate backend server on Render. This saves you money and complexity!

---

## 1. Prerequisites (GitHub)
Vercel deploys directly from your code repository.

1.  **Create a GitHub Repository**:
    - Go to [github.com/new](https://github.com/new).
    - Name it `vendora`.
    - Make it **Private** (recommended since it has business logic).
2.  **Push your code** (Run these commands in your VS Code terminal):
    ```bash
    git init
    git add .
    git commit -m "Ready for deployment"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/vendora.git
    git push -u origin main
    ```

---

## 2. Deploy Frontend to Vercel

1.  **Sign Up/Log In**: Go to [vercel.com](https://vercel.com) and log in with **GitHub**.
2.  **Add New Project**:
    - Click **"Add New..."** button -> **"Project"**.
    - Select your `vendora` repository from the list.
3.  **Configure Project**:
    - **Framework Preset**: Vercel should auto-detect **Vite**. If not, select it.
    - **Root Directory**: Ensure this is set to `vendora` (since your `package.json` is inside that folder).
4.  **Environment Variables (Crucial!)**:
    Copy these from your local `.env` file and add them to the Vercel deployment settings:

    | Name | Value |
    |------|-------|
    | `VITE_SUPABASE_URL` | `https://gcyzdavptrphobkkkuko.supabase.co` |
    | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI...` (Copy the full key from your .env) |

5.  **Deploy**: Click **"Deploy"**.

---

## 3. Post-Deployment Checks

- **Authentication**: Try logging in/registering on the production URL (e.g., `https://vendora.vercel.app`).
- **Supabase URL**: Go to your **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
    - Add your new Vercel URL (e.g., `https://vendora.vercel.app`) to the **Site URL** and **Redirect URLs** list. **This is required for Login/Reset Password to work properly in production.**

---

## Troubleshooting

- **404 on Refresh**: If refreshing a page gives a 404 error, ensure your `vercel.json` file is in the root (I have just fixed a typo in it for you).
