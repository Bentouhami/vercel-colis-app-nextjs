# API Strategy & Architectural Guide

This document outlines the architectural strategy for the ColisApp backend, defining the roles of external-facing API Routes and internal Server Actions. The goal is to create a robust, secure, and scalable system that leverages modern Next.js patterns while preparing for future growth (e.g., a mobile app or third-party integrations).

## Guiding Principles

The project will adopt a hybrid approach, using two distinct tools for server communication:

1. **API Routes (`/api/v1/...`)**: These are considered a **public contract**. They are stable, versioned, and secure endpoints intended for any client that is *not* the Next.js web frontend.
    * **Use Case**: Mobile applications, third-party services, external admin tools, webhooks.
    * **Security**: Must be secured via stateless API tokens (e.g., JWT).

2. **Server Actions (`/actions/...`)**: These are **internal Remote Procedure Calls (RPC)** tightly coupled with the Next.js web UI. They are used to simplify data mutations (`POST`, `PUT`, `DELETE`) originating from our own components.
    * **Use Case**: All internal web form submissions and UI-triggered data changes (e.g., button clicks).
    * **Benefit**: Reduces boilerplate, simplifies state management (`useTransition`), and improves performance by avoiding unnecessary HTTP round-trips.

---

## API Route Analysis & Recommendations

The following is a route-by-route recommendation for the existing API structure.

### 1. Authentication (`/api/v1/(auth)`)

These routes are essential for any client application.

| Route | Recommendation | Reasoning |
| :--- | :--- | :--- |
| `[...nextauth]/route.ts` | **Keep (Core)** | This is the heart of the NextAuth.js library and must not be changed. |
| `login`, `register`, `forgot-password`, `reset-password` | **Keep API, Add Action** | **Keep the API routes** for external clients (mobile app) to authenticate and receive a JWT. **Create corresponding Server Actions** (e.g., `loginAction`) for the web UI to use for a cleaner, more integrated experience. |
| `status`, `check-reset-token` | **Refactor to Action** | This is internal UI logic. Checking a session status is best handled by `auth()` in a Server Component. Token validation should be part of a `resetPasswordAction`. |

### 2. User Management (`/api/v1/users`)

| Route | Recommendation | Reasoning |
| :--- | :--- | :--- |
| `GET /users`, `GET /users/[id]` | **Keep API** | Provides a necessary, stable contract for an external admin application to view user data. |
| `PUT /users/[id]`, `PUT /users/[id]/profile` | **Keep API, Add Action** | **Keep the API routes** for external clients. **Create Server Actions** (`updateUserAction`, `updateProfileAction`) for all internal web forms to simplify frontend code. |
| `all`, `destinataires`, `list` | **Refactor to Service** | These are UI-specific helpers. This logic should be moved to the `Bk_UserService` and called directly from Server Components. An external API should use query parameters on the main `GET /users` endpoint (e.g., `?role=destinataire`). |

### 3. Core Logic (`/api/v1/envois`, `simulations`, `tracking`, `payment`)

| Route | Recommendation | Reasoning |
| :--- | :--- | :--- |
| `GET /envois/user/[userId]` | **Keep API** | The primary way for an external client (like a mobile app user) to fetch their shipment history. |
| `PUT /envois/[id]` | **Keep API, Add Action** | **Keep the API** for external clients. **Create an `updateEnvoiAction`** for internal admin forms. |
| `POST /envois/cancel` | **Refactor to Action** | A perfect use case for a Server Action. An external API should use the more conventional `DELETE /api/v1/envois/{id}`. |
| `POST /simulations` | **Keep API** | **Essential.** A mobile app or external client must be able to get a price quote before creating a shipment. |
| `GET /tracking/[trackingNumber]` | **Keep API** | This is the public, contractual endpoint for tracking. It should not be changed. |
| `POST /payment/complete-payment` | **Refactor to Action** | This logic is tightly coupled to the web UI's payment flow and should be a Server Action. |

### 4. Agency & Admin (`/api/v1/agencies`)

| Route | Recommendation | Reasoning |
| :--- | :--- | :--- |
| `GET /agencies`, `GET /agencies/[id]` | **Keep API** | Essential for any client to find and view agency locations. |
| `POST /agencies/create-agency`, `PUT /agencies/update-agency` | **Keep API, Add Action** | **Keep the API routes** for a future admin app. **Create `createAgencyAction` and `updateAgencyAction`** for the web UI forms. |
| `findAgency`, `get-agency-by-id`, `light`, `summary` | **Consolidate & Refactor** | These are UI-specific helpers. Their logic should be moved into the `Bk_AgencyService` and called directly by Server Components. A clean external API would use query parameters on the main `GET /agencies` endpoint (e.g., `?q=...`, `?view=summary`). |

### 5. Utilities (`/api/v1/contact`, `/api/send-email`)

| Route | Recommendation | Reasoning |
| :--- | :--- | :--- |
| `POST /contact` | **Refactor to Action** | A classic form submission. `submitContactFormAction(formData)` is a much cleaner implementation. |
| `/api/send-email` | **CRITICAL: Remove API** | A generic, exposed email-sending API is a **major security vulnerability**. This functionality must be moved to a server-side library function (`/src/lib/mailer.ts`) and called exclusively by other backend services or Server Actions (e.g., after user registration). **It must not be a publicly accessible API route.** |

---

## Summary of Actionable Steps

1. **Create Server Actions** for all data mutations currently handled by API routes for the web UI.
2. **Refactor UI-specific API routes** (`/users/list`, `/agencies/summary`) by moving their logic into the corresponding backend service file.
3. **Immediately remove the `/api/send-email` route** and replace its usage with calls to a secure, internal mailer library function.
4. **Preserve all `GET` routes** that provide essential resources (`users`, `envois`, `agencies`) as they form the foundation of your future external API.
5. Ensure all remaining API routes are secured for stateless (token-based) authentication.
