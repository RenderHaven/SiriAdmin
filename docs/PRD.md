# Project Overview

# SiriAdmin - Photography Portfolio Website Admin Dashboard

## Overview

SiriAdmin is a web-based Content Management System (CMS) developed for **Siri Photography**, a professional photography studio. The application serves as the administrative backend for managing the studio's portfolio website, allowing administrators to update website content without requiring developer intervention.

The system provides a secure dashboard where the administrator can manage portfolio images, photography service packages, and customer booking inquiries. All updates performed through the dashboard are immediately reflected on the customer-facing website.

This project is designed as a modern full-stack web application using **React** for the frontend and **FastAPI** for the backend, with **PostgreSQL** as the primary database and **Cloudinary** for image storage and delivery.

---

# Problem Statement

Photography studios frequently update their portfolio with new projects, modify service offerings, and receive customer booking requests through their websites.

Without an administrative dashboard, every content update requires direct developer involvement, resulting in:

* Slow content updates
* Increased maintenance cost
* Dependency on technical staff
* Inefficient management of customer inquiries

The objective of SiriAdmin is to provide a centralized management system that enables studio staff to independently manage website content through an intuitive web interface.

---

# Project Objectives

The primary objectives of the project are:

* Provide secure administrator authentication.
* Manage photography portfolio images.
* Organize portfolio images into categories.
* Manage photography service packages.
* View and manage customer booking inquiries.
* Automatically synchronize content with the customer-facing website.
* Provide a responsive and easy-to-use administrative interface.

---

# Core Features

## Authentication

* Secure administrator login
* JWT-based authentication
* Protected API endpoints
* Session management

---

## Portfolio Management

Administrators can:

* Upload portfolio images
* Store images securely in Cloudinary
* Add image captions
* Assign images to categories
* Reorder images within categories
* Delete images
* Manage image visibility

---

## Category Management

Administrators can:

* Create categories
* Update category names
* Reorder categories
* Enable or disable categories

Examples:

* Wedding
* Birthday
* Corporate Events
* Pre Wedding
* Baby Shoot

---

## Service Management

Administrators can manage photography packages by:

* Creating new services
* Editing existing services
* Updating pricing
* Managing service descriptions
* Activating or deactivating services

---

## Booking Inquiry Management

The system stores customer booking requests submitted from the public website.

Administrators can:

* View all inquiries
* Search and filter bookings
* Update booking status
* Add internal administrative notes
* Mark inquiries as reviewed

---

# System Architecture

```text
                    Customer Website
                           │
                           │
                    REST API (FastAPI)
                           │
          ┌────────────────┴────────────────┐
          │                                 │
     PostgreSQL                       Cloudinary
   Application Data                  Image Storage
          │                                 │
          └──────────────┬──────────────────┘
                         │
                 React Admin Dashboard
```

---

# Technology Stack

## Frontend

* React
* TypeScript
* React Router
* Axios
* Tailwind CSS
* React Hook Form

---

## Backend

* FastAPI
* SQLAlchemy ORM
* Pydantic
* JWT Authentication
* Uvicorn

---

## Database

* PostgreSQL

Stores:

* Administrator credentials
* Categories
* Portfolio metadata
* Service packages
* Booking inquiries

---

## Image Storage

Cloudinary

Images are uploaded directly from the backend to Cloudinary. The application stores only image metadata such as:

* Image URL
* Cloudinary Public ID
* Caption
* Category
* Display Order

This approach minimizes database storage while leveraging Cloudinary's CDN for fast image delivery.

---

# Authentication Flow

```text
Admin Login
      │
      ▼
Verify Credentials
      │
      ▼
Generate JWT Token
      │
      ▼
Authenticated Requests
      │
      ▼
Protected API Endpoints
```

---

# Image Upload Workflow

```text
Admin
   │
Select Image
   │
   ▼
React Frontend
   │
multipart/form-data
   ▼
FastAPI Backend
   │
Upload Image
   ▼
Cloudinary
   │
Returns URL & Public ID
   ▼
Save Metadata
(PostgreSQL)
   │
   ▼
Display on Website
```

---

# Database Overview

The system consists of the following primary entities:

* Admin
* Categories
* Portfolio Images
* Services
* Booking Inquiries

Images are stored in Cloudinary, while PostgreSQL stores only their associated metadata.

---

# Project Structure

```text
Frontend (React)

├── Authentication
├── Dashboard
├── Portfolio Management
├── Categories
├── Services
├── Booking Management
└── Shared Components


Backend (FastAPI)

├── Authentication
├── Categories API
├── Portfolio API
├── Services API
├── Booking API
├── Database Models
├── Authentication Middleware
└── Cloudinary Integration
```

---

# Security

The application implements several security measures:

* JWT Authentication
* Password hashing
* Protected API routes
* Input validation using Pydantic
* CORS configuration
* Environment variable management
* Secure Cloudinary credentials

---

# Future Enhancements

Possible future improvements include:

* Multiple administrator accounts
* Role-based access control (RBAC)
* Dashboard analytics
* Activity logs
* Image optimization options
* Bulk image uploads
* Email notifications
* Customer management
* Website content management
* Reports and statistics

---

# Conclusion

SiriAdmin provides a centralized administrative platform for managing a photography portfolio website. By combining a React frontend, FastAPI backend, PostgreSQL database, and Cloudinary image storage, the system delivers a scalable, secure, and maintainable solution for content management.

The architecture follows modern full-stack development practices and is designed to be easily extensible for future business requirements while maintaining simplicity for the current project scope.
