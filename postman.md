## 🔐 AUTH

### POST `/api/auth/register`
```json
{
  "fullName": "Nguyen Van A",
  "email": "user@example.com",
  "password": "123456"
}
```

### POST `/api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```
> Response trả về `token` dùng cho các request cần auth

---

## 👤 USERS

### GET `/api/users/me`
> Header: `Authorization: Bearer <token>`

### PATCH `/api/users/me`
> Header: `Authorization: Bearer <token>` | Content-Type: `multipart/form-data`
```
fullName: Nguyen Van A
phone: 0901234567
avatar: [file]
```

### GET `/api/users/` *(Admin)*
> Header: `Authorization: Bearer <adminToken>`

### GET `/api/users/admin/:id` *(Admin)*

### PUT `/api/users/admin/:id` *(Admin)*
```json
{
  "fullName": "Nguyen Van A",
  "email": "user@example.com",
  "phone": "0901234567"
}
```

### PATCH `/api/users/admin/:id/role` *(Admin)*
```json
{ "role": "ADMIN" }
```

### PATCH `/api/users/admin/:id/status` *(Admin)*
```json
{ "status": "BANNED" }
```

### DELETE `/api/users/admin/:id` *(Admin)*

---

## 🎬 MOVIES

### GET `/api/movies/`
### GET `/api/movies/:id`

### POST `/api/movies/`
```json
{
  "title": "Avengers: Endgame",
  "genres": ["ACTION", "ADVENTURE"],
  "duration": 182,
  "description": "Mô tả phim",
  "director": "Russo Brothers",
  "actors": ["Robert Downey Jr", "Chris Evans"],
  "language": "Tiếng Anh",
  "rating": "T18",
  "status": "NOW_SHOWING",
  "releaseDate": "2019-04-26",
  "trailerUrl": "https://youtube.com/...",
  "subtitle": "Phụ đề Việt"
}
```

### PUT `/api/movies/:id`
> Content-Type: `multipart/form-data`
```
title: Avengers: Endgame
genres: ["ACTION","ADVENTURE"]
actors: ["Robert Downey Jr"]
duration: 182
poster: [file]
```

### DELETE `/api/movies/:id`

---

## 🎭 CINEMAS

### GET `/api/cinemas/`
### GET `/api/cinemas/:id`

### POST `/api/cinemas/`
```json
{
  "name": "CGV Aeon Mall",
  "address": "30 Bờ Bao Tân Thắng, Q.Tân Phú",
  "city": "Hồ Chí Minh",
  "totalRooms": 5,
  "phone": "02838123456",
  "status": "ACTIVE"
}
```

### PUT `/api/cinemas/:id`
```json
{
  "name": "CGV Aeon Mall",
  "address": "30 Bờ Bao Tân Thắng",
  "city": "Hồ Chí Minh",
  "phone": "02838999999"
}
```

### DELETE `/api/cinemas/:id`

---

## 🏛️ AUDITORIUMS

### GET `/api/auditoriums/`
### GET `/api/auditoriums/:id`

### POST `/api/auditoriums/` *(Admin)*
```json
{
  "cinemaId": "<cinemaObjectId>",
  "name": "Phòng 1",
  "totalRows": 10,
  "totalColumns": 12,
  "seatCapacity": 120,
  "status": "ACTIVE"
}
```

### PUT `/api/auditoriums/:id` *(Admin)*
```json
{
  "name": "Phòng VIP 1",
  "totalRows": 8,
  "totalColumns": 10,
  "seatCapacity": 80
}
```

### DELETE `/api/auditoriums/:id` *(Admin)*

---

## 🕐 SHOWTIMES

### GET `/api/showtimes/`
### GET `/api/showtimes/:id`
### GET `/api/showtimes/:id/seats`

### POST `/api/showtimes/` *(Admin)*
```json
{
  "movieId": "<movieObjectId>",
  "auditoriumId": "<auditoriumObjectId>",
  "startTime": "2026-04-10T14:00:00.000Z",
  "endTime": "2026-04-10T16:00:00.000Z",
  "basePrice": 90000,
  "status": "OPEN"
}
```

### PUT `/api/showtimes/:id` *(Admin)*
```json
{
  "startTime": "2026-04-10T16:00:00.000Z",
  "endTime": "2026-04-10T18:00:00.000Z",
  "basePrice": 100000,
  "status": "CLOSED"
}
```

### DELETE `/api/showtimes/:id` *(Admin)*

---

## 💺 SEATS

### GET `/api/seats/`
### GET `/api/seats/auditorium/:auditoriumId`
### GET `/api/seats/:id`

### POST `/api/seats/`
```json
{
  "auditoriumId": "<auditoriumObjectId>",
  "seatRow": "A",
  "seatNumber": 1,
  "seatType": "VIP",
  "extraPrice": 0,
  "status": "ACTIVE"
}
```
> `seatType`: `"VIP"` | `"COUPLE"`

### PUT `/api/seats/:id`
```json
{
  "seatType": "COUPLE",
  "extraPrice": 50000,
  "status": "INACTIVE"
}
```

### DELETE `/api/seats/:id`

---

## 🔒 SEAT HOLDS

> Tất cả yêu cầu `Authorization: Bearer <token>`

### POST `/api/seat-holds/`
```json
{
  "showtimeId": "<showtimeObjectId>",
  "seats": ["A1", "A2", "B3"]
}
```

### GET `/api/seat-holds/me?showtimeId=<showtimeObjectId>`

### DELETE `/api/seat-holds/:id`

---

## 🎟️ BOOKINGS

### POST `/api/bookings/` *(Bearer)*
```json
{
  "showtimeId": "<showtimeObjectId>",
  "seats": ["A1", "A2"],
  "snacks": [
    { "snackId": "<snackObjectId>", "qty": 2 },
    { "snackId": "<snackObjectId>", "qty": 1 }
  ],
  "promotionCode": "SUMMER20",
  "ticketTotal": 180000,
  "snackTotal": 60000,
  "finalTotal": 192000,
  "seatHoldId": "<seatHoldObjectId>"
}
```

### GET `/api/bookings/me` *(Bearer)*
### GET `/api/bookings/:id` *(Bearer)*

### GET `/api/bookings/admin/all` *(Admin)*
### GET `/api/bookings/admin/:id` *(Admin)*

### PATCH `/api/bookings/admin/:id/status` *(Admin)*
```json
{ "status": "confirmed" }
```
> `status`: `"pending"` | `"confirmed"` | `"cancelled"` | `"failed"`

### PUT `/api/bookings/admin/:id` *(Admin)*
```json
{ "status": "cancelled" }
```

### DELETE `/api/bookings/admin/:id` *(Admin)*

### GET `/api/bookings/debug/sample` *(Diagnostic - no auth)*

---

## 💰 PAYMENTS

### GET `/api/payments/config`
> Trả về thông tin QR, tên ngân hàng, số tài khoản

### GET `/api/payments/transactions/me` *(Bearer)*

### POST `/api/payments/sepay/init` *(Bearer)*
```json
{
  "order_invoice_number": "PC20260406-ABCD",
  "order_amount": 192000,
  "order_description": "Thanh toan ve xem phim",
  "success_url": "http://localhost:5173/payment/success",
  "error_url": "http://localhost:5173/payment/error",
  "cancel_url": "http://localhost:5173/payment/cancel"
}
```

### POST `/api/payments/sepay/verify` *(Bearer)*
```json
{ "bookingId": "<bookingObjectId>" }
```

### POST `/api/payments/webhook`
> Header: `x-webhook-secret: <PAYMENT_WEBHOOK_SECRET>`
```json
{
  "orderCode": "PC20260406-ABCD",
  "status": "PAID"
}
```

### GET `/api/payments/admin/all` *(Admin)*
### GET `/api/payments/admin/stats` *(Admin)*
### GET `/api/payments/admin/user/:userId` *(Admin)*
### GET `/api/payments/admin/:id` *(Admin)*

### POST `/api/payments/admin` *(Admin)*
```json
{
  "bookingId": "<bookingObjectId>",
  "orderCode": "PC20260406-ABCD",
  "amount": 192000,
  "status": "PENDING"
}
```

### PUT `/api/payments/admin/:id` *(Admin)*
```json
{ "status": "PAID" }
```

### POST `/api/payments/admin/:id/refund` *(Admin)*
```json
{ "reason": "Yêu cầu hoàn tiền từ khách hàng" }
```

---

## 🎫 PROMOTIONS

### GET `/api/promotions/`
### GET `/api/promotions/active`
### GET `/api/promotions/code/:code` — VD: `/api/promotions/code/SUMMER20`
### GET `/api/promotions/:id`

### POST `/api/promotions/validate/:code` *(Bearer)*
```json
{ "orderValue": 180000 }
```

### POST `/api/promotions/:id/calculate-discount` *(Bearer)*
```json
{ "orderValue": 180000 }
```

### POST `/api/promotions/` *(Admin)*
```json
{
  "code": "SUMMER20",
  "title": "Khuyến mãi hè 2026",
  "description": "Giảm 20% tối đa 50k",
  "discountType": "PERCENTAGE",
  "discountValue": 20,
  "maxDiscount": 50000,
  "minOrderValue": 100000,
  "usageLimit": 100,
  "applicableTo": "ALL",
  "startDate": "2026-06-01T00:00:00.000Z",
  "endDate": "2026-08-31T23:59:59.000Z",
  "status": "ACTIVE"
}
```
> `discountType`: `"PERCENTAGE"` | `"FIXED_AMOUNT"`
> `applicableTo`: `"ALL"` | `"TICKETS"` | `"SNACKS"` | `"BOTH"`

### PUT `/api/promotions/:id` *(Admin)*
> Content-Type: `multipart/form-data`
```
title: Khuyến mãi hè 2026
discountValue: 25
endDate: 2026-09-30T23:59:59.000Z
image: [file]
```

### PATCH `/api/promotions/:id/increment-usage` *(Admin)*

### DELETE `/api/promotions/:id` *(Admin)*

---

## ❤️ SAVED PROMOTIONS

### GET `/api/saved-promotions/me` *(Bearer)*
### GET `/api/saved-promotions/me/count` *(Bearer)*
### GET `/api/saved-promotions/:promotionId/check` *(Bearer)*

### POST `/api/saved-promotions/` *(Bearer)*
```json
{ "promotionId": "<promotionObjectId>" }
```

### DELETE `/api/saved-promotions/:promotionId` *(Bearer)*

### GET `/api/saved-promotions/admin/user/:userId` *(Admin)*
### GET `/api/saved-promotions/admin/user/:userId/count` *(Admin)*
### DELETE `/api/saved-promotions/admin/:id` *(Admin)*

---

## 🍿 SNACKS

### GET `/api/snacks/`
### GET `/api/snacks/active`
### GET `/api/snacks/category/:category`
> `category`: `POPCORN` | `DRINK` | `CANDY` | `HOT_FOOD` | `OTHER`

### GET `/api/snacks/:id`

### POST `/api/snacks/` *(Admin)*
```json
{
  "name": "Bắp rang bơ lớn",
  "description": "Bắp rang bơ size L",
  "price": 55000,
  "imageUrl": "https://...",
  "category": "POPCORN",
  "quantity": 100,
  "status": "ACTIVE"
}
```

### PUT `/api/snacks/:id` *(Admin)*
```json
{
  "name": "Bắp rang bơ lớn",
  "price": 60000,
  "status": "ACTIVE"
}
```

### PATCH `/api/snacks/:id/quantity` *(Admin)*
```json
{ "quantity": 50 }
```

### PATCH `/api/snacks/:id/status` *(Admin)*
```json
{ "status": "OUT_OF_STOCK" }
```
> `status`: `"ACTIVE"` | `"INACTIVE"` | `"OUT_OF_STOCK"`

### DELETE `/api/snacks/:id` *(Admin)*

---

## 📊 ADMIN DASHBOARD

### GET `/api/admin/stats` *(Admin)*
### GET `/api/admin/top-movies?limit=4` *(Admin)*
### GET `/api/admin/revenue-stats` *(Admin)*
### GET `/api/admin/users/report?role=USER&status=ACTIVE&limit=10&skip=0` *(Admin)*
### GET `/api/admin/movies/report` *(Admin)*
### GET `/api/admin/snacks/report` *(Admin)*
### GET `/api/admin/payments/report` *(Admin)*

---

## Misc

| Endpoint | Mô tả |
|----------|-------|
| `GET /api/health` | Health check |
| `GET /uploads/<filename>` | Static file (avatar, poster, ảnh promotion) |