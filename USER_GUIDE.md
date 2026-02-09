# DocTrack User Guide

Welcome to DocTrack! This application helps you track employee documents and their expiry dates with a gorgeous, interactive interface.

## 1. How to Run the App Locally
If you want to try running it on your computer again (now that I've finished the setup):

1.  **Open a Terminal**: (In VS Code, press `Ctrl + ` ` (backtick) or go to Terminal > New Terminal).
2.  **Start the App**: Type the following command and press Enter:
    ```bash
    npx next dev
    ```
    *(I am using `npx next` instead of `npm run dev` to help bypass the local error you saw).*
3.  **View the App**: Open your web browser and go to: `http://localhost:3000`

---

## 2. Setting Up Your Online Database (Supabase)
To use the online database so your data is safe and shared, follow these steps:

1.  **Create a Supabase Account**: Go to [supabase.com](https://supabase.com) and sign up for a free account.
2.  **Create a New Project**:
    - Click "New Project".
    - Name it "DocTrack".
    - Choose a region close to you.
3.  **Setup the Database**:
    - Go to the **SQL Editor** in the left sidebar.
    - Click "New Query".
    - Paste the code from `src/lib/supabase.ts` (the part under "SCHEMA DEFINITION") and click **Run**.
4.  **Connect the App**:
    - Go to **Project Settings** > **API**.
    - Copy the `Project URL` and `anon public` key.
    - In your project folder, create a file named `.env.local` and paste them like this:
      ```
      NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
      NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
      ```

---

## 3. Online Deployment Guide (GitHub & Vercel)
This is the recommended way to use the app permanently!

### Step A: Push to GitHub
1.  **Open GitHub**: Go to [github.com](https://github.com) and log in.
2.  **New Repository**: Click "New" and name it `doctrack`.
3.  **Upload Code**:
    *   In the project folder on your computer, open a terminal.
    *   I've installed Git for you, but we need to use its full "address" to run it. 
    *   **Run these commands one by one** (Copy and paste each one):
        ```powershell
        & "C:\Users\mnaguib\AppData\Local\Programs\Git\cmd\git.exe" remote add origin https://github.com/YOUR_USERNAME/doctrack.git
        & "C:\Users\mnaguib\AppData\Local\Programs\Git\cmd\git.exe" branch -M main
        & "C:\Users\mnaguib\AppData\Local\Programs\Git\cmd\git.exe" push -u origin main
        ```
    *(Replace `YOUR_USERNAME` with your GitHub username).*

### Step B: Deploy to Vercel
1.  **Open Vercel**: Go to [vercel.com](https://vercel.com) and sign up with your GitHub account.
2.  **Add New Project**: Click "Add New" > "Project".
3.  **Import**: Find the `doctrack` repository and click "Import".
4.  **Environment Variables (CRITICAL)**:
    - **Note**: Your `.env.local` file is "hidden" and **will not** be on GitHub for security (to keep your database safe). You must add the keys here manually.
    - Click on "Environment Variables".
    - Under **Key**, type: `NEXT_PUBLIC_SUPABASE_URL`
    - Under **Value**, paste your Supabase URL.
    - Click **Add**.
    - Next, under **Key**, type: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - Under **Value**, paste your Supabase Key.
    - Click **Add**.
5.  **Deploy**: Click "Deploy". Now Vercel has the keys and the app will work!

---

## 5. How to Apply Fixes or Updates
If I give you a fix (like I just did for the error you saw), follow these simple steps to update your live app:

1.  **Open your terminal** in the project folder.
2.  **Paste these commands** one by one:
    ```powershell
    & "C:\Users\mnaguib\AppData\Local\Programs\Git\cmd\git.exe" add .
    & "C:\Users\mnaguib\AppData\Local\Programs\Git\cmd\git.exe" commit -m "Apply bug fix"
    & "C:\Users\mnaguib\AppData\Local\Programs\Git\cmd\git.exe" push
    ```
3.  **Vercel will automatically detect** the change and redeploy your app in about 1 minute. You don't need to do anything else!
