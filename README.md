<div align="center">

# 📱 App Store

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/ReXiOP/App-Store?style=flat-square&logo=github)](https://github.com/ReXiOP/App-Store/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/ReXiOP/App-Store?style=flat-square&logo=github)](https://github.com/ReXiOP/App-Store/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/ReXiOP/App-Store?style=flat-square&logo=github)](https://github.com/ReXiOP/App-Store/issues)

**A modern, full-featured app store platform built with Next.js 15**

[🚀 Demo](#demo) • [✨ Features](#-features) • [📦 Installation](#-installation) • [📖 API Docs](#-api-documentation) • [🤝 Contributing](#-contributing)

</div>

---

## 🎯 Overview

App Store is a sleek, production-ready application marketplace platform featuring a beautiful UI, comprehensive admin dashboard, and complete RESTful API. Perfect for distributing Android apps, internal tools, or any downloadable content.

<div align="center">
  <img src="https://img.shields.io/badge/Apps-Unlimited-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Users-Unlimited-green?style=flat-square" />
  <img src="https://img.shields.io/badge/Reviews-Enabled-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/API-RESTful-purple?style=flat-square" />
</div>

---

## ✨ Features

### 🎨 **Frontend**
| Feature | Description |
|---------|-------------|
| 🌙 **Dark/Light Mode** | Beautiful theme toggle with system preference detection |
| 📱 **Responsive Design** | Mobile-first approach, works on all devices |
| 🔍 **Smart Search** | Real-time search across apps, categories, and descriptions |
| ⭐ **Ratings & Reviews** | Full review system with star ratings |
| 🖼️ **Screenshot Gallery** | Lightbox preview with smooth animations |
| 📊 **Top Charts** | Popular apps ranked by downloads |

### 🔐 **Authentication**
| Provider | Status |
|----------|--------|
| 📧 Email/Password | ✅ Supported |
| 🔵 Google OAuth | ✅ Supported |
| 🟣 SM40 OAuth | ✅ Supported |

### 👨‍💼 **Admin Dashboard**
- 📊 **Analytics Dashboard** - Real-time stats and activity feed
- 📱 **App Management** - Create, edit, delete apps with file uploads
- 👥 **User Management** - Manage roles and permissions
- 🏷️ **Category Management** - Dynamic category system
- ⭐ **Review Moderation** - Monitor and manage user reviews

### 🔌 **RESTful API**
Complete API for mobile apps and third-party integrations:

```
POST   /api/auth/login          # Login with JWT token
POST   /api/auth/register       # Register new user
GET    /api/apps                # List all apps
POST   /api/apps                # Create app (Admin)
GET    /api/apps/:id            # Get app details
PUT    /api/apps/:id            # Update app (Admin)
DELETE /api/apps/:id            # Delete app (Admin)
GET    /api/reviews             # List reviews
POST   /api/reviews             # Create review
GET    /api/categories          # List categories
GET    /api/admin/stats         # Dashboard stats (Admin)
```

📄 **Full documentation**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)  
📮 **Postman Collection**: [App_Store_API.postman_collection.json](./App_Store_API.postman_collection.json)

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
<br>Next.js 15
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
<br>TypeScript
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
<br>Tailwind 4
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=prisma" width="48" height="48" alt="Prisma" />
<br>Prisma
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=sqlite" width="48" height="48" alt="SQLite" />
<br>SQLite
</td>
</tr>
</table>

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/ReXiOP/App-Store.git
cd App-Store

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🚀

### Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
SM40_APP_ID="your-sm40-app-id"
SM40_APP_SECRET="your-sm40-app-secret"
```

---

## 📁 Project Structure

```
App-Store/
├── 📂 prisma/              # Database schema
├── 📂 public/              # Static assets & uploads
├── 📂 src/
│   ├── 📂 app/
│   │   ├── 📂 admin/       # Admin dashboard pages
│   │   ├── 📂 api/         # REST API endpoints
│   │   ├── 📂 apps/        # App listing & details
│   │   ├── 📂 auth/        # Authentication pages
│   │   └── 📂 profile/     # User profile
│   ├── 📂 components/      # Reusable UI components
│   └── 📂 lib/             # Utilities & configurations
├── 📄 API_DOCUMENTATION.md # API reference
└── 📄 App_Store_API.postman_collection.json
```

---

## 🔑 Default Admin Setup

After installation, create an admin user:

1. Register a new account via `/auth/signin`
2. Open your database with `npx prisma studio`
3. Change the user's `role` from `USER` to `ADMIN`

---

## 📸 Screenshots

<div align="center">
<table>
<tr>
<td><strong>🏠 Home Page</strong></td>
<td><strong>📱 App Details</strong></td>
</tr>
<tr>
<td>Beautiful landing with featured apps</td>
<td>Full app info with screenshots & reviews</td>
</tr>
<tr>
<td><strong>👨‍💼 Admin Dashboard</strong></td>
<td><strong>🔐 Login Page</strong></td>
</tr>
<tr>
<td>Comprehensive admin controls</td>
<td>OAuth + Email authentication</td>
</tr>
</table>
</div>

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### ⭐ Star this repo if you find it useful!

[![GitHub Stars](https://img.shields.io/github/stars/ReXiOP/App-Store?style=social)](https://github.com/ReXiOP/App-Store/stargazers)

**Made with ❤️ by [ReXiOP](https://github.com/ReXiOP)**

</div>
