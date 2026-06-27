import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Login } from '@/features/auth/Login'
import { Dashboard } from '@/features/dashboard/Dashboard'
import { Categories } from '@/features/categories/Categories'
import { Portfolio } from '@/features/portfolio/Portfolio'
import { Services as AdminServices } from '@/features/services/Services'
import { Bookings } from '@/features/bookings/Bookings'
import { SiteLayout } from '@/site/layouts/SiteLayout'
import { HomePage } from '@/site/pages/HomePage'
import { PortfolioPage } from '@/site/pages/PortfolioPage'
import { ServicesPage } from '@/site/pages/ServicesPage'
import { ServiceDetailPage } from '@/site/pages/ServiceDetailPage'
import { ContactPage } from '@/site/pages/ContactPage'
import { CartPage } from '@/site/pages/CartPage'
import { NotFoundPage } from '@/components/errors/NotFoundPage'
import { ErrorBoundary } from '@/components/errors/ErrorBoundary'

interface RouteProps {
  children: React.ReactElement
}

const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />
}

const PublicRoute: React.FC<RouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return !isAuthenticated ? children : <Navigate to="/admin/dashboard" replace />
}

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        element={
          <ErrorBoundary variant="site">
            <SiteLayout />
          </ErrorBoundary>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Route>

      <Route
        path="/admin/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <ErrorBoundary variant="admin" homeHref="/admin/dashboard">
              <DashboardLayout />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="categories" element={<Categories />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="bookings" element={<Bookings />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
