# Fixora Client

This repository contains the frontend client for **Fixora**, providing a comprehensive and dynamic web interface for Customers, Vendors, and Administrators to interact with the Fixora platform.

## Overview

The Fixora Client is a modern web application built with **Next.js 16** (using React 19). It relies on a robust architecture that separates concerns between UI components, state management, and API integrations. The application utilizes a highly responsive styling system and provides real-time features including chat and AI integration.

## Technology Stack

### Core
* **Framework:** Next.js 16 (React 19)
* **Language:** TypeScript
* **State Management:** Redux Toolkit (with Redux Persist for local storage sync).
* **Data Fetching & Caching:** React Query (`@tanstack/react-query`) and Axios.

### Styling & UI
* **CSS Framework:** Tailwind CSS v4.
* **Component Primitives:** Radix UI (`@radix-ui/react-*`).
* **Utility Libraries:** `class-variance-authority`, `tailwind-merge`, and `clsx` for composable utility classes.
* **Icons & Animation:** Lucide React, React Icons, and Framer Motion.

### Features & Integrations
* **Forms & Validation:** React Hook Form integrated with Zod and Yup schemas.
* **Maps:** Leaflet and React-Leaflet.
* **Real-time Communication:** Socket.io client and WebRTC for live chat and notifications.
* **Payments:** Stripe React (`@stripe/react-stripe-js`).
* **Data Visualization:** Recharts (for administrative and vendor dashboards).
* **File Handling:** Custom upload hooks with `react-easy-crop` for image processing.

## Frontend Architecture

The codebase is organized in `src/` as follows:

* **`src/app` / `src/pages`:** Contains the routing layer of the application.
* **`src/components`:** Houses reusable UI elements, divided into layout components (navbar, footer, sidebar), shared UI elements, and specific feature components (dashboards, reviews, uploads).
* **`src/dtos` & `src/types`:** Contains TypeScript Data Transfer Objects and type definitions ensuring type safety across API boundaries.
* **`src/lib`:** Custom React hooks (`useAuth`, `useBooking`, `useSocket`, etc.), query client setup, and WebRTC integration.
* **`src/services`:** The API interaction layer. Organizes backend calls by domain (e.g., `admin.service.ts`, `vendor.service.ts`, `auth.service.ts`).
* **`src/store`:** Redux configuration, providers, and domain-specific state slices (`admin.slice.ts`, `customer.slice.ts`, `vendor.slice.ts`).
* **`src/utils` & `src/schemas`:** Global constants, helper functions (formatting, JWT decoding, role guards), and validation schemas.

## User Roles & Key Features

* **Customers:** 
  * Seamless authentication and profile management.
  * Interactive map-based service discovery.
  * Booking system and Stripe payment flows.
  * Real-time notifications and WebRTC communications.
  * Dedicated AI Chatbot interface for platform assistance.
* **Vendors:**
  * Application and verification workflows.
  * Comprehensive dashboard featuring Recharts analytics (bar, line, pie charts).
  * Management of services, sub-services, and subscriptions.
* **Administrators:**
  * System-wide dashboard metrics.
  * Vendor verification and user oversight.

## Environment Variables

Create a `.env.local` file in the root directory based on `.env.local.example`.

> [!CAUTION]
> Ensure you do not expose any private backend keys in the frontend environment file. Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

```env
NEXT_PUBLIC_BACKEND_URL=<your-backend-url>
NEXT_PUBLIC_API_URL=<your-api-url>
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-client-id>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
```

## Local Development

This project utilizes Turbopack for rapid local development.

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Build the application for production:
   ```bash
   npm run build
   ```

4. Start the production build:
   ```bash
   npm start
   ```

## Build & Deployment

The application does not contain native Docker or GitHub Action configurations. It is designed to be easily deployed on Vercel, Netlify, or any standard Node.js hosting environment capable of running Next.js builds.


