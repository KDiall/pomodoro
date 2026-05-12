# Pomodoro Timer with Session Log

A Pomodoro timer application that tracks focus sessions and saves them to a PostgreSQL database. Built with Next.js, Prisma, and Tailwind CSS.

## What It Does

- **25-minute Pomodoro timer** with start, pause, and reset functionality
- **Session logging** - automatically saves completed sessions to PostgreSQL
- **Session history** - displays the last 10 completed sessions with timestamps and optional notes
- **Optional notes** - add notes about what you worked on during each session
- **Clean UI** - modern, responsive design using Tailwind CSS

## The Stack

- **Next.js 16** - React framework with App Router
- **PostgreSQL** - Database (Neon cloud hosting)
- **Prisma** - Database ORM and migration tool
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety

## How to Run It Locally

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pomodoro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Add your PostgreSQL database URL to the `.env` file:
   ```
   DATABASE_URL="postgresql://username:password@host:port/database"
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## One Thing the AI Got Wrong That I Had to Fix

The Prisma client setup in Next.js 16 with the new Prisma 7 configuration was challenging. The AI initially tried to use the standard `@prisma/client` import, but the new version requires a different configuration approach. I had to:

1. Create a `prisma.config.ts` file for the database URL configuration
2. Remove the URL from the schema file and move it to the config
3. Use a require-based import with `@ts-ignore` to bypass TypeScript issues
4. Fix the import paths in the API routes to use relative paths instead of absolute aliases

The core functionality works perfectly, but the Prisma setup required manual adjustment to work with the latest versions.
