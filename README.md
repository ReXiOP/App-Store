# Professional App Store

This is a Next.js application for a professional App Store, featuring a premium design, admin dashboard, and APK download capabilities.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Setup Database**:
    This project uses Prisma with SQLite. You need to push the schema to the database file.
    ```bash
    npx prisma db push
    ```
    *Note: If this fails, ensure your `.env` file contains `DATABASE_URL="file:./dev.db"`.*

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

## Features

- **Premium UI**: Built with Tailwind CSS and shadcn/ui.
- **App Showcase**: Featured apps, categories, and search.
- **App Details**: Screenshots, ratings, description, and APK download.
- **Admin Dashboard**: Manage apps and view analytics at `/admin`.
- **SEO Optimized**: Built-in metadata and semantic HTML.

## Project Structure

- `src/app`: Page routes (Home, Admin, Apps).
- `src/components`: UI components (Cards, Navbar, etc.).
- `prisma`: Database schema.
- `public`: Static assets (Place your APKs and Images here).

## Mock Data vs Real Data

Currently, the pages use **Mock Data** for demonstration. To switch to the real database:
1.  Uncomment Prisma usage in `src/app/page.tsx` and `src/app/apps/[id]/page.tsx`.
2.  Use the Admin Dashboard (to be connected) to upload apps.
