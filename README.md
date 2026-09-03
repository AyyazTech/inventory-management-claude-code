# Inventory Management System — Built with Claude Code

A complete inventory management system built end to end with **Claude Code** on the [AyyazTech](https://www.youtube.com/@AyyazTech) YouTube channel. Products, a Stock page for stock in/out, a Movements audit log, live low-stock alerts, a dashboard, and login.

🎥 **Watch the full build:** https://youtu.be/eOFUR48DCQg
🔔 **Subscribe for more:** https://www.youtube.com/@AyyazTech
🌐 **More tutorials:** https://ayyaztech.com

## Features

- 🔐 **Login** — simple username + password auth (hashed passwords, server sessions)
- 📦 **Products** — name, SKU, category, quantity, unit price, reorder level
- 🔁 **Stock in / out** — adjust quantities from the Stock page
- 🧾 **Movements** — an immutable audit log of every stock change
- 🚨 **Low-stock alerts** — automatic badges when quantity drops to or below the reorder level
- 📊 **Dashboard** — total products, total stock value, low-stock count, and a stock-by-category chart

## Screenshots

**Dashboard**
![Dashboard](screenshots/dashboard.png)

**Products**
![Products](screenshots/products.png)

**Stock**
![Stock](screenshots/stock.png)

**Movements**
![Movements](screenshots/movements.png)

**Login**
![Login](screenshots/login.png)

## Tech stack

Next.js 16 (App Router) · Prisma 6 + SQLite · Tailwind CSS 4 · Zod · TypeScript

## Getting started

Requires Node 20+ and [bun](https://bun.sh).

```bash
# 1. Install dependencies
bun install

# 2. Create your environment file and set an auth secret
cp .env.example .env
# generate a secret and paste it into .env as AUTH_SECRET:
openssl rand -base64 32

# 3. Set up the database (applies migrations, generates the client, creates dev.db)
bunx prisma migrate dev

# 4. Seed the demo data (sample products, stock movements, and the demo login)
bun run db:seed

# 5. Run it
bun dev
```

Open http://localhost:3000

### Demo login

```
Username: admin
Password: admin123
```

## How it was built

Built in stages by prompting Claude Code — the products foundation first, then the Stock + Movements pages, the dashboard, and finally login. The UI direction was guided by Claude Code's official frontend-design skill. Watch the full build on the channel above.

## The prompts

Run these one at a time, in order — don't paste them all at once. Each stage builds on what the previous one created.

**Stage 1 — Foundation**
```
Build the foundation of an inventory management system in this Next.js project. For NOW, only build:
- A clean, modern SaaS dashboard layout with a sidebar (think Linear or Stripe).
- A Products page: list, create, edit, delete (name, SKU, category, quantity in stock, unit price, reorder level).
- Show a clear "LOW STOCK" badge on any product whose quantity is at or below its reorder level.
- Use Prisma with SQLite. Seed 12 realistic sample products across a few categories, some of them low on stock.
Do NOT build stock movements, a dashboard, or login yet — we'll add those next, one at a time.
Use the frontend-design skill and commit to one cohesive, trustworthy aesthetic.
```

**Stage 2 — Stock + Movements**
```
Now add stock management as two new pages in the sidebar:
- A "Stock" page that lists all products with quick "Stock In" and "Stock Out" controls that increase or decrease a product's quantity by an amount I enter. The LOW STOCK badge updates automatically when a product crosses its reorder level.
- A "Movements" page showing a log of every stock change (product, type, amount, resulting quantity, timestamp).
```

**Stage 3 — Dashboard**
```
Now add a Dashboard as the home page: total number of products, total stock value (sum of quantity x unit price), a low-stock count, and a bar chart of total stock quantity by category.
```

**Stage 4 — Login**
```
Finally, add a simple username and password login that protects the whole app. Seed ONE demo user (username "admin", password "admin123"). No signup, no roles, no password reset — keep auth minimal.
```

## License

MIT — use it, learn from it, build on it.
