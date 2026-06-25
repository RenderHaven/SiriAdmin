# Frontend Development Prompt - SiriAdmin

You are an expert React and UI engineer.

Build a **production-quality React Admin Dashboard** for a photography portfolio management system called **SiriAdmin**.

The backend is already implemented using **FastAPI**, and I will provide the generated **OpenAPI YAML**. **Do not invent API endpoints or request/response models.** Generate API clients and frontend logic strictly from the provided API specification.

---

# Technology Stack

Use the following stack:

* React 19
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* React Router
* TanStack Query (React Query)
* React Hook Form
* Zod
* Axios
* Lucide React Icons

---

# Design Requirements

The application should look like a modern SaaS dashboard.

Design principles:

* Minimal
* Clean
* Professional
* Spacious layout
* Excellent typography
* Consistent spacing
* Rounded cards
* Soft shadows
* Responsive
* Tablet friendly

Use neutral colors with a photography-focused aesthetic.

Do NOT use overly colorful dashboards.

---

# Authentication

Implement JWT authentication.

Features:

* Login page
* Store JWT securely
* Automatically attach Authorization header
* Redirect unauthenticated users to Login
* Logout
* Handle token expiration gracefully

---

# Layout

Create a reusable dashboard layout.

Layout:

```text
+---------------------------------------------------------+
| Sidebar                     | Top Navigation             |
|                             |----------------------------|
| Dashboard                   | Search (optional)          |
| Categories                  | Admin Menu                |
| Portfolio                   |                           |
| Services                    |                           |
| Bookings                    |                           |
|                             |                           |
|                             |                           |
+-----------------------------+---------------------------+
```

The sidebar should collapse on smaller screens.

---

# Pages

Implement the following pages.

---

## Login

Features:

* Email
* Password
* Validation
* Loading state
* Error handling

---

## Dashboard

Show summary cards.

Cards:

* Total Images
* Total Categories
* Total Services
* New Bookings

Display recent booking inquiries.

---

## Categories

Features:

* Category table
* Search
* Create category
* Edit category
* Delete category
* Toggle Active
* Change display order

Use modal dialogs for create/edit.

---

## Portfolio

Features:

Display images in a responsive grid.

Each card should show:

* Image
* Caption
* Category
* Display Order
* Status

Actions:

* Edit
* Delete

Top toolbar:

* Upload Image
* Filter by Category

---

## Upload Image

Create a dedicated upload dialog.

Fields:

* Image
* Category
* Caption

Requirements:

* Image preview
* Drag & Drop upload
* File validation
* Upload progress
* Success notification

The upload should use multipart/form-data according to the API contract.

---

## Reorder Images

Allow drag-and-drop sorting of images within a category.

After reordering:

Call the reorder endpoint from the API.

Do not perform client-only sorting.

---

## Services

Display services in cards or a table.

Each service displays:

* Title
* Price
* Description
* Included Services
* Status

Actions:

* Add
* Edit
* Delete

Use dialogs for create/edit.

---

## Booking Inquiries

Display bookings in a professional table.

Columns:

* Customer Name
* Email
* Phone
* Event Date
* Service
* Status

Actions:

* View Details
* Mark Reviewed
* Update Status

Opening a booking should display:

* Complete customer information
* Selected service
* Customer message
* Admin note
* Status

Allow updating:

* Status
* Admin Note

---

# Components

Create reusable components.

Examples:

* Button
* Input
* Select
* Dialog
* Card
* Table
* Badge
* Empty State
* Loading Spinner
* Confirm Dialog
* Page Header
* Breadcrumb
* Search Input

Avoid duplicated UI code.

---

# Forms

Use:

React Hook Form

with

Zod validation.

Show validation messages below inputs.

Disable submit while loading.

---

# Data Fetching

Use TanStack Query.

Requirements:

* Query caching
* Loading states
* Error states
* Refetch after mutations
* Optimistic updates where appropriate

Do NOT manually manage API loading using useState.

---

# API Integration

I will provide a FastAPI OpenAPI YAML.

Requirements:

* Generate API types from the specification.
* Do not manually write interfaces already defined in the OpenAPI schema.
* Use the generated models throughout the application.
* Use the generated API client whenever possible.
* Never hardcode endpoint URLs.
* Follow the request and response schemas exactly.

---

# Error Handling

Implement global API error handling.

Display user-friendly toast notifications.

Examples:

Image uploaded successfully.

Service deleted successfully.

Login failed.

Validation error.

Server unavailable.

---

# Loading States

Every API request should include:

* Skeleton loaders
* Disabled buttons during submission
* Loading indicators

Never leave the user wondering if something is happening.

---

# Empty States

Design proper empty states.

Examples:

No Images Found

No Categories Available

No Services Yet

No Booking Inquiries

Include helpful illustrations or icons.

---

# Tables

Tables should support:

* Pagination
* Search
* Sorting (where applicable)
* Responsive behavior

---

# File Upload

Implement image upload using:

multipart/form-data

Display:

* Upload progress
* Preview
* Success state
* Failure state

---

# Image Display

Use responsive image cards.

Images should:

* Maintain aspect ratio
* Lazy load
* Show placeholder while loading
* Handle missing images gracefully

---

# Routing

Implement protected routes.

Routes:

```
/login

/dashboard

/categories

/portfolio

/services

/bookings
```

Unauthenticated users should always be redirected to `/login`.

---

# Folder Structure

Organize the project using feature-based architecture.

```
src/

    api/
    assets/
    components/
        common/
        layout/
        ui/

    features/
        auth/
        dashboard/
        categories/
        portfolio/
        services/
        bookings/

    hooks/

    layouts/

    lib/

    pages/

    routes/

    services/

    types/

    utils/
```

Avoid placing all components in a single folder.

---

# Code Quality

Requirements:

* TypeScript strict mode
* Reusable components
* No duplicated code
* Clean architecture
* Functional components only
* Hooks-based implementation
* Meaningful naming
* Well-organized imports

---

# Accessibility

Ensure:

* Keyboard navigation
* Proper labels
* Focus states
* ARIA attributes where necessary

---

# Responsive Design

Support:

* Desktop
* Tablet
* Mobile

The dashboard should remain usable on tablet devices.

---

# Animations

Use subtle animations only.

Examples:

* Dialog transitions
* Card hover effects
* Fade-in content
* Button interactions

Avoid excessive animations.

---

# Final Goal

Produce a polished, production-ready admin dashboard that:

* Uses the provided FastAPI OpenAPI specification as the single source of truth.
* Has clean, maintainable, scalable React code.
* Follows modern frontend best practices.
* Looks like a professional SaaS product.
* Is immediately ready to connect to the FastAPI backend with minimal manual changes.
