# Popcorn Cinema

A full-stack movie ticket booking application. Customers browse movies, pick a showtime, choose seats, add snacks, apply promotion codes, and pay via QR code bank transfer. A separate admin panel covers movies, cinemas, auditoriums, showtimes, orders, promotions, and users.

The [server/](server/) folder is an Express 5 REST API connected to MongoDB. The [client/](client/) folder is a Vite-powered React 19 SPA. The project runs as a monorepo using npm workspaces.

---

## Getting Started

```bash
# Install all workspace dependencies
npm install

# Start both client and server in development
npm run dev

# Or start individually
npm run dev:client
npm run dev:server

ngrok http 5000

# Seed the database
npm run seed
```

---

## Techniques

**[MongoDB TTL index](https://www.mongodb.com/docs/manual/core/index-ttl/) for automatic seat expiry** — [server/schemas/seat-hold.schema.ts](server/schemas/seat-hold.schema.ts) sets `{ expireAfterSeconds: 0 }` on the `expiresAt` field. MongoDB removes the document when the timestamp arrives, freeing held seats without a cron job or periodic cleanup query.

**MongoDB transaction with replica-set detection** — [server/services/booking.service.ts](server/services/booking.service.ts) wraps booking creation in `session.withTransaction()`. If MongoDB returns `"Transaction numbers are only allowed on a replica set member"`, the same logic retries without a session. The service works on a standalone dev instance and a production replica set with no config changes.

**Cross-tab auth sync via the [`storage` event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)** — [client/src/components/Header.tsx](client/src/components/Header.tsx) listens for `window.addEventListener("storage", ...)`. Because browsers fire this event in other tabs when `localStorage` changes, a login or logout in one tab immediately updates every other open tab.

**Custom DOM events as a lightweight in-page event bus** — [client/src/utils/auth.ts](client/src/utils/auth.ts) dispatches an `"auth-changed"` [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) using [`window.dispatchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent). Components subscribe with `addEventListener` to react to login/logout without a global state library.

**Timed seat hold with `useEffect` cleanup** — [client/src/pages/user/BookingPage.tsx](client/src/pages/user/BookingPage.tsx) calls the API to create a seat hold when seats are selected and starts a countdown timer. The `useEffect` cleanup function releases the hold if the user navigates away before completing checkout.

**Webhook secret-header authentication** — [server/routes/payment.route.ts](server/routes/payment.route.ts) validates `x-webhook-secret` against an environment variable rather than using JWT. This is the standard pattern for server-to-server payment provider callbacks.

**CSS [`min()`](https://developer.mozilla.org/en-US/docs/Web/CSS/min) for responsive containers** — [client/src/styles/layout.css](client/src/styles/layout.css) and [client/src/styles/HomePage.css](client/src/styles/HomePage.css) use `width: min(1200px, calc(100% - 32px))` to cap container width while shrinking naturally on smaller viewports — no media queries needed.

**`React.memo` + `useMemo`/`useCallback` in the booking UI** — The `ShowtimePicker` subcomponent in [BookingPage.tsx](client/src/pages/user/BookingPage.tsx) is wrapped in `React.memo`. Seat totals, filtered cinema lists, and grouped showtime dates are all derived with `useMemo` to avoid re-computation on every keystroke in the cinema search field.

**[`useRef` for click-outside detection](https://developer.mozilla.org/en-US/docs/Web/API/Element/contains)** — Drop-down menus in [Header.tsx](client/src/components/Header.tsx) and [AdminLayout.tsx](client/src/layouts/AdminLayout.tsx) attach a `ref` to the wrapper element and call `ref.current.contains(event.target)` inside a `mousedown` listener to close on outside clicks — no third-party library needed.

**Server-side background interval for expired bookings** — [server/app.ts](server/app.ts) calls `setInterval(() => markExpiredBookings(), 60_000)` at startup. Bookings where `paymentExpiresAt` has passed are updated to `"failed"` every minute, keeping seat availability accurate.

---

## Libraries

**[Express 5](https://expressjs.com/)** — First major version since 2014. Async errors thrown in route handlers are now forwarded to the error middleware automatically, so the routes in [server/routes/](server/routes/) don't need try/catch wrappers for every async path.

**[Mongoose 9](https://mongoosejs.com/)** — Schemas in [server/schemas/](server/schemas/) use TypeScript generics (`Schema<IBookingDocument>`) for accurate type inference. Compound indexes like `{ showtime: 1, seats: 1 }` on the booking schema are defined alongside the schema rather than in a migration.

**[sepay-pg-node](https://www.npmjs.com/package/sepay-pg-node)** — Node.js client for [SePay](https://sepay.vn/), a Vietnamese bank payment gateway. The integration exposes a static QR code image for bank transfer and a webhook endpoint that marks a booking `confirmed` on `PAID` status.

**[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** — Pure JavaScript bcrypt. Unlike the native `bcrypt` package, it has no native addon and builds cleanly on any platform. Used in [server/utils/hash.ts](server/utils/hash.ts).

**[multer](https://github.com/expressjs/multer)** — Multipart form-data middleware. [server/middlewares/upload.middleware.ts](server/middlewares/upload.middleware.ts) uses `diskStorage` to write uploaded files to `server/uploads/` with timestamp-based filenames. Files are served statically at `/uploads/`.

**[nodemailer](https://nodemailer.com/)** — SMTP email client included in the server for transactional emails.

**[React Router DOM v7](https://reactrouter.com/)** — The booking flow uses `useLocation` state to pass context (movie, showtime, selected seats, prices) between pages. This keeps URLs clean while avoiding a global state store.

**[Vite 5](https://vite.dev/)** — Build tool and dev server. [client/vite.config.ts](client/vite.config.ts) sets up a `@` import alias pointing at `client/src/`, so deep imports stay readable.

**[moment.js](https://momentjs.com/)** — Date formatting on the server. moment is in maintenance mode; its own docs recommend using [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) for new projects.

The app uses the system font stack (`Arial, sans-serif`). No external fonts are loaded.

---

## Project Structure

```
DAMH_PopcornCinema/
├── package.json
├── client/
│   ├── public/
│   │   └── images/
│   │       └── payment/
│   └── src/
│       ├── assets/
│       │   └── images/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       │   ├── admin/
│       │   │   ├── Auditoriums/
│       │   │   ├── Cinema/
│       │   │   ├── Movies/
│       │   │   ├── Orders/
│       │   │   ├── Promotions/
│       │   │   ├── Showtimes/
│       │   │   ├── Snacks/
│       │   │   └── Users/
│       │   ├── auth/
│       │   └── user/
│       ├── routes/
│       ├── services/
│       ├── styles/
│       │   └── Admin/
│       └── utils/
└── server/
    ├── config/
    ├── middlewares/
    ├── routes/
    ├── schemas/
    ├── services/
    ├── types/
    ├── uploads/
    └── utils/
```

`client/public/images/payment/` — Static QR code images served at build time for the payment screen.

`client/src/services/` — One API client module per resource (`movie.api.ts`, `booking.api.ts`, etc.), all wrapping a shared `apiRequest` helper in [client/src/services/api.ts](client/src/services/api.ts) that attaches the Bearer token from `localStorage`.

`client/src/routes/` — React Router route definitions, including [ProtectedRoute.tsx](client/src/routes/ProtectedRoute.tsx) which redirects non-admin users before rendering any admin page.

`server/schemas/` — Mongoose schema definitions paired with their TypeScript interfaces. Each file exports both the interface and the compiled model.

`server/services/` — Business logic between routes and schemas. Route handlers are kept thin; all database interaction lives here.

`server/uploads/` — Runtime disk storage for images uploaded through the admin panel, served statically at `/uploads/`.