# SiriAdmin API Contract

**Project:** Siri Photography – Admin Dashboard
**Version:** 1.0
**Base URL:** `/api/v1`

---

# Authentication

Authentication uses **JWT Bearer Token**.

```
Authorization: Bearer <JWT_TOKEN>
```

All endpoints except `/auth/login` require authentication.

---

# Response Format

## Success

```json
{
    "success": true,
    "message": "Operation completed successfully.",
    "data": {}
}
```

## Error

```json
{
    "success": false,
    "message": "Validation failed.",
    "errors": {}
}
```

---

# Authentication

## Login

### POST

```
/auth/login
```

### Request

```json
{
    "email": "admin@siri.com",
    "password": "password123"
}
```

### Response

```json
{
    "success": true,
    "message": "Login successful.",
    "data": {
        "token": "<jwt-token>",
        "expires_in": 86400
    }
}
```

---

## Logout

### POST

```
/auth/logout
```

Response

```json
{
    "success": true,
    "message": "Logged out successfully."
}
```

---

# Categories

## Get Categories

### GET

```
/categories
```

Response

```json
[
    {
        "id": 1,
        "name": "Wedding",
        "display_order": 1,
        "is_active": true
    }
]
```

---

## Create Category

### POST

```
/categories
```

Request

```json
{
    "name": "Birthday"
}
```

---

## Update Category

### PUT

```
/categories/{categoryId}
```

Request

```json
{
    "name": "Corporate Events",
    "display_order": 2,
    "is_active": true
}
```

---

## Delete Category

### DELETE

```
/categories/{categoryId}
```

---

# Portfolio Images

## Upload Image

### POST

```
/portfolio/images
```

Content-Type

```
multipart/form-data
```

Body

```
image
category_id
caption
```

Response

```json
{
    "id": 15,
    "image_url": "...",
    "public_id": "...",
    "caption": "Wedding Ceremony"
}
```

---

## Get Images

### GET

```
/portfolio/images
```

Optional Query Parameters

```
category_id
page
limit
```

Example

```
/portfolio/images?category_id=2&page=1&limit=20
```

---

## Get Single Image

### GET

```
/portfolio/images/{imageId}
```

---

## Update Image

### PUT

```
/portfolio/images/{imageId}
```

Request

```json
{
    "category_id": 2,
    "caption": "Updated Caption",
    "display_order": 4
}
```

---

## Delete Image

### DELETE

```
/portfolio/images/{imageId}
```

Deletes image from Cloudinary and database.

---

## Reorder Images

### PATCH

```
/portfolio/images/reorder
```

Request

```json
{
    "category_id": 2,
    "images": [
        {
            "id": 5,
            "display_order": 1
        },
        {
            "id": 8,
            "display_order": 2
        },
        {
            "id": 9,
            "display_order": 3
        }
    ]
}
```

Response

```json
{
    "success": true,
    "message": "Image order updated."
}
```

---

# Services

## Get Services

### GET

```
/services
```

---

## Create Service

### POST

```
/services
```

Request

```json
{
    "title": "Wedding Package",
    "description": "Complete wedding coverage",
    "includes": "Photography, Drone, Album",
    "price": 50000,
    "image_url": "..."
}
```

---

## Get Service

### GET

```
/services/{serviceId}
```

---

## Update Service

### PUT

```
/services/{serviceId}
```

---

## Delete Service

### DELETE

```
/services/{serviceId}
```

---

# Booking Inquiries

## Get Bookings

### GET

```
/bookings
```

Query Parameters

```
status
page
limit
from
to
```

Example

```
/bookings?status=NEW&page=1
```

---

## Get Booking

### GET

```
/bookings/{bookingId}
```

---

## Update Booking Status

### PATCH

```
/bookings/{bookingId}/status
```

Request

```json
{
    "status": "REVIEWED",
    "admin_note": "Customer contacted.",
    "reviewed_at": "2026-06-30T10:45:00Z"
}
```

---

## Dashboard

## Dashboard Summary

### GET

```
/dashboard
```

Response

```json
{
    "total_images": 140,
    "total_categories": 6,
    "total_services": 8,
    "new_bookings": 12,
    "reviewed_bookings": 54
}
```

---

# Status Values

Booking Status

```
NEW
REVIEWED
RESPONDED
```

---

# HTTP Status Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 422  | Validation Error      |
| 500  | Internal Server Error |

---

# Validation Rules

## Login

* Email required
* Password required

---

## Category

* Name required
* Name unique

---

## Portfolio Image

* Image required
* Valid image format (jpg, jpeg, png, webp)
* Maximum size: 10 MB
* Category required

---

## Service

* Title required
* Description required
* Includes required
* Price must be greater than zero

---

## Booking

* Status must be one of:

```
NEW
REVIEWED
RESPONDED
```

---

# Authentication Flow

```
Login
    │
    ▼
Receive JWT
    │
    ▼
Store Token
    │
    ▼
Send Authorization Header
    │
    ▼
Access Protected APIs
```
