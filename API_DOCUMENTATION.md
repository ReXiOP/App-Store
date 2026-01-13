# App Store REST API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication via NextAuth session cookies. Admin-only endpoints require `role: "ADMIN"`.

---

## Auth Endpoints

### POST /auth/register
Register a new user with email and password.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "clxxx...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /auth/sm40-callback
Handles SM40 OAuth callback. Used internally by the PHP relay script.

**Query Parameters:**
- `token`: Base64-encoded user data from SM40

---

## Users Endpoints

### GET /users
Get all users. **Admin only.**

**Response:**
```json
{
  "users": [
    {
      "id": "clxxx...",
      "name": "John Doe",
      "email": "john@example.com",
      "image": "https://...",
      "role": "USER",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "_count": { "reviews": 5 }
    }
  ]
}
```

### POST /users
Create a new user. **Admin only.**

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "USER",
  "image": "https://..."
}
```

### GET /users/:id
Get user by ID with their reviews.

**Response:**
```json
{
  "user": {
    "id": "clxxx...",
    "name": "John Doe",
    "email": "john@example.com",
    "reviews": [
      {
        "id": "clyyy...",
        "rating": 5,
        "comment": "Great app!",
        "app": { "id": "...", "name": "MyApp", "iconUrl": "..." }
      }
    ]
  }
}
```

### PUT /users/:id
Update user. Users can update themselves; admins can update anyone.

**Request Body:**
```json
{
  "name": "New Name",
  "image": "https://new-avatar.jpg",
  "role": "ADMIN"  // Admin only
}
```

### DELETE /users/:id
Delete a user. **Admin only.**

---

## Apps Endpoints

### GET /apps
Get all apps with filtering, sorting, and pagination.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search by name, tagline, description |
| `category` | string | Filter by category ID |
| `sort` | string | `newest`, `oldest`, `popular` |
| `limit` | number | Results per page (default: 50) |
| `page` | number | Page number (default: 1) |

**Response:**
```json
{
  "apps": [
    {
      "id": "clxxx...",
      "name": "MyApp",
      "tagline": "Best app ever",
      "version": "1.0.0",
      "downloads": 1000,
      "rating": 4.5,
      "category": { "id": "...", "name": "Games" }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "totalPages": 2
  }
}
```

### POST /apps
Create a new app. **Admin only.**

**Request Body:**
```json
{
  "name": "MyApp",
  "tagline": "Best app ever",
  "description": "Full description with **markdown** support",
  "version": "1.0.0",
  "downloadUrl": "https://.../app.apk",
  "iconUrl": "https://.../icon.png",
  "screenshots": ["https://.../ss1.png", "https://.../ss2.png"],
  "categoryId": "clxxx...",
  "size": "45 MB"
}
```

### GET /apps/:id
Get app details with reviews.

**Response:**
```json
{
  "app": {
    "id": "clxxx...",
    "name": "MyApp",
    "tagline": "Best app ever",
    "description": "...",
    "version": "1.0.0",
    "downloadUrl": "...",
    "iconUrl": "...",
    "screenshots": "[...]",
    "downloads": 1000,
    "rating": 4.5,
    "category": { "id": "...", "name": "Games" },
    "reviews": [
      {
        "id": "...",
        "rating": 5,
        "comment": "Awesome!",
        "user": { "id": "...", "name": "John", "image": "..." }
      }
    ]
  }
}
```

### PUT /apps/:id
Update an app. **Admin only.**

### DELETE /apps/:id
Delete an app. **Admin only.**

### POST /apps/:id
Increment download count.

**Response:**
```json
{ "downloads": 1001 }
```

---

## Reviews Endpoints

### GET /reviews
Get reviews with optional filtering.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `appId` | string | Filter by app |
| `userId` | string | Filter by user |
| `limit` | number | Max results (default: 50) |

**Response:**
```json
{
  "reviews": [
    {
      "id": "clxxx...",
      "rating": 5,
      "comment": "Great!",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "user": { "id": "...", "name": "John", "image": "..." },
      "app": { "id": "...", "name": "MyApp", "iconUrl": "..." }
    }
  ]
}
```

### POST /reviews
Create a new review. **Authenticated users only.**

**Request Body:**
```json
{
  "appId": "clxxx...",
  "rating": 5,
  "comment": "This app is amazing!"
}
```

### GET /reviews/:id
Get a single review.

### PUT /reviews/:id
Update a review. **Owner or Admin only.**

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Updated comment"
}
```

### DELETE /reviews/:id
Delete a review. **Owner or Admin only.**

---

## Categories Endpoints

### GET /categories
Get all categories with app counts.

**Response:**
```json
{
  "categories": [
    {
      "id": "clxxx...",
      "name": "Games",
      "_count": { "apps": 15 }
    }
  ]
}
```

### POST /categories
Create a new category. **Admin only.**

**Request Body:**
```json
{ "name": "Productivity" }
```

### GET /categories/:id
Get category with its apps.

### PUT /categories/:id
Update a category. **Admin only.**

### DELETE /categories/:id
Delete a category. **Admin only.**

---

## Admin Endpoints

### GET /admin/stats
Get dashboard statistics. **Admin only.**

**Response:**
```json
{
  "stats": {
    "users": 150,
    "apps": 45,
    "reviews": 320,
    "categories": 8,
    "totalDownloads": 50000
  },
  "recentUsers": [...],
  "recentReviews": [...],
  "topApps": [...]
}
```

---

## Error Responses

All endpoints return standardized error responses:

```json
{
  "error": "Error message here"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Bad Request - Missing or invalid parameters |
| 401 | Unauthorized - Not authenticated |
| 403 | Forbidden - Not authorized for this action |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error |
