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
    *   Run these commands one by one:
        ```bash
        git init
        git add .
        git commit -m "Initial commit"
        git branch -M main
        git remote add origin https://github.com/YOUR_USERNAME/doctrack.git
        git push -u origin main
        ```
    *(Replace `YOUR_USERNAME` with your GitHub username).*

### Step B: Deploy to Vercel
1.  **Open Vercel**: Go to [vercel.com](https://vercel.com) and sign up with your GitHub account.
2.  **Add New Project**: Click "Add New" > "Project".
3.  **Import**: Find the `doctrack` repository and click "Import".
4.  **Environment Variables**:
    *   Under "Environment Variables", add the two keys from your Supabase settings (URL and Key).
5.  **Deploy**: Click "Deploy". Your app will be live!

---

## 4. Using the Dashboard
- **Add Employee**: Click the red "+ Add New Employee" button.
- **Add Document**: Click "Add Document" on any employee's card.
- **Alert Colors**:
    - 🚨 **Red**: Expires in less than 1 month.
    - ⚠️ **Yellow**: Expires in less than 3 months.
    - ✅ **Green**: Expires after 3 months.
