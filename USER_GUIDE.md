# DocTrack User Guide

Welcome to DocTrack! This application helps you track employee documents and their expiry dates with a gorgeous, interactive interface.

## 1. How to Run the App Locally
Since I have already set up the code for you, follow these steps to see it in action:

1.  **Open a Terminal**: (In VS Code, press `Ctrl + ` ` (backtick) or go to Terminal > New Terminal).
2.  **Start the App**: Type the following command and press Enter:
    ```bash
    npm run dev
    ```
3.  **View the App**: Open your web browser and go to: `http://localhost:3000`

---

## 2. Setting Up Your Online Database (Supabase)
The app currently stores data on your computer (Local Storage). To use the online database so your data is safe and shared, follow these steps:

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
5.  **Restart the app** (Stop the terminal with `Ctrl + C` and run `npm run dev` again).

---

## 3. Using the Dashboard
- **Add Employee**: Click the red "+ Add New Employee" button at the top right.
- **Add Document**: Click the "Add Document" button on any employee's card.
- **Alert Colors**:
    - **Red**: Document expires in less than 1 month.
    - **Yellow/Amber**: Document expires in less than 3 months.
    - **Green**: Document is safe (expires after 3 months).
