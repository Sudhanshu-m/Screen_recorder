# 🎥 Screen Recorder with Server-Side Trimming & Analytics

A full-stack **Next.js** application that allows users to record their screen with microphone audio, trim videos on the server using **ffmpeg**, generate public shareable links, and track basic viewing analytics.

This project is intentionally designed with a focus on **clean architecture, real-world constraints, and production-ready engineering decisions**, rather than just feature count.

---

## 🚀 Features

- 🎬 Screen + microphone recording using the **MediaRecorder API**
- ✂️ Server-side video trimming using **ffmpeg**
- 🔗 Public, shareable links for recorded videos
- 📊 Basic analytics:
  - Total view count
  - Watch completion tracking
  - Visual completion progress bar
- 🧱 Clear **Server / Client separation** using Next.js App Router
- 💾 Persistent storage with **Prisma + SQLite**

---

## 🛠️ Tech Stack

**Frontend**
- Next.js (App Router)
- TypeScript
- Tailwind CSS

**Backend**
- Next.js API Routes
- Prisma ORM

**Video Processing**
- ffmpeg (via fluent-ffmpeg)

**Database**
- SQLite (local persistence)

**Deployment**
- Render (Node Web Service)

---

## ⚙️ Local Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Sudhanshu-m/Screen_recorder.git
cd screen-recorder-nextjs
```
### 2️⃣ Install dependencies
npm install
---

### 3️⃣ Install ffmpeg (Required)

ffmpeg must be available in your system PATH.

Check:

ffmpeg -version


Install if missing:

Windows: https://www.gyan.dev/ffmpeg/builds/

Mac (Homebrew):

brew install ffmpeg

### 4️⃣ Environment variables

Create a .env file in the project root:

DATABASE_URL=file:./dev.db
NEXT_PUBLIC_BASE_URL=http://localhost:3000

### 5️⃣ Initialize the database
npx prisma migrate dev

### 6️⃣ Run the application
npm run dev


Open:

http://localhost:3000

###  Architecture Decisions
🔹 Server-Side Video Trimming

Video trimming is performed on the server using ffmpeg

The client only records video and sends trim timestamps

Avoids heavy browser computation and instability

Reasoning:
Server-side media processing is more reliable and closer to real production systems.

🔹 Server vs Client Components (Next.js App Router)

Server Components

Fetch data from Prisma

Validate video existence

Client Components

Video playback

User interactions

Analytics events (views, completion)

Reasoning:
Strict separation avoids hydration issues and follows Next.js best practices.

🔹 Analytics Design

Stored metrics:

views → total video opens

completed → number of full video watches

Derived metric:

Completion percentage calculated at render time

Reasoning:
Keeps database normalized and avoids storing redundant data.

🔹 Storage Strategy

Videos are stored locally in public/videos/

Suitable for demos and interviews

Reasoning:
Keeps setup simple while demonstrating full functionality.

🚀 Deployment

The application is deployed on Render because:

Render supports system-level ffmpeg binaries

Serverless platforms like Vercel do not support ffmpeg

Deployment approach:

Node Web Service

next build + next start

🔮 What I Would Improve for Production

If this were a production system, I would add:

☁️ Cloud Storage

Store videos in AWS S3 / Cloudflare R2

Use signed URLs for secure access

🗄️ Database Upgrade

Replace SQLite with PostgreSQL

Support higher concurrency and scaling

📈 Advanced Analytics

Track partial watch-time percentage

Generate heatmaps of most-watched segments

🔐 Security & Privacy

Authentication for private videos

Expiring share links

Rate-limiting uploads

⚙️ Background Processing

Offload ffmpeg jobs to a queue (BullMQ / workers)

Prevent blocking API requests

🧠 Key Learnings

Handling media processing in web applications

Server vs Client responsibilities in Next.js

Deployment tradeoffs between serverless and VM-based platforms

Designing scalable analytics models
