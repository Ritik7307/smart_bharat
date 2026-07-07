# 🇮🇳 Smart Bharat - Civic Companion

**Smart Bharat** is an intelligent, AI-powered civic companion designed to simplify government services, streamline issue reporting, and provide personalized civic support for the citizens of India. 

Designed with the rigorous standards of an official Indian Government portal, this application prioritizes **accessibility, multi-lingual support, and user-centric design**.

## 🌟 Features

- **Multi-lingual Support**: Native support for English, Hindi, Bengali, Telugu, Marathi, and Tamil to ensure inclusivity across India's diverse linguistic landscape.
- **Official Government Aesthetic**: Built with a formal design system (Navy Blue `#003366`, Tricolor accents, and `Roboto` typography) mirroring authentic government portals.
- **Robust Accessibility**: 
  - **Dual-Header Navigation** with integrated Language selection.
  - **Text Sizing Controls** (`A-`, `A`, `A+`) to dynamically scale text.
  - **High Contrast Mode** for visually impaired users.
  - **Keyboard Navigation** including "Skip to Main Content".
- **AI Integration**: A floating AI assistant ready to answer civic queries, draft complaints, and guide users through complex government service applications.
- **Services Directory**: Easily find, understand, and apply for essential government services (PAN, Aadhar, Voter ID, etc.).
- **Civic Issue Reporting**: A dedicated portal to log, track, and manage local civic complaints (e.g., broken street lights, water leakage) with AI-assisted drafting.

## 🚀 Getting Started

This is a [Next.js](https://nextjs.org) application bootstrapped with `create-next-app`.

### Prerequisites

- Node.js 18.x or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Custom CSS Modules (`globals.css` and `.module.css` files)
- **Icons**: Lucide React
- **Typography**: Google Fonts (Roboto)

## 📁 Project Structure

- `/src/app` - Core Next.js App Router pages (`page.tsx`, `layout.tsx`, `globals.css`)
- `/src/components` - Reusable UI components (`Navbar`, `ChatWidget`, etc.)
- `/src/contexts` - React Context providers (`LanguageContext` for i18n & state)
- `/public` - Static assets and icons

## 🤝 Contributing

Contributions to improve Smart Bharat are always welcome! Please follow standard pull request procedures and ensure all accessibility standards (WCAG) are maintained in your UI changes.
