import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient, getApiData } from '@/api/client'
import { DashboardData, Booking } from '@/types'
import { 
  Image as ImageIcon, 
  FolderTree, 
  Camera, 
  CalendarDays, 
  Clock, 
  CheckCircle,
  ArrowRight,
  TrendingUp,
  User
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { InlineErrorCard } from '@/components/errors/InlineErrorCard'
import { AdminCardSkeleton, AdminTableSkeleton } from '@/components/errors/LoadingSkeleton'

export const Dashboard: React.FC = () => {
  // Fetch dashboard summary statistics
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    error: statsErr,
    refetch: refetchStats,
    isFetching: statsFetching,
  } = useQuery<DashboardData>({
    queryKey: ['dashboard-stats'],
    queryFn: () => getApiData(() => apiClient.get('/dashboard')),
  })

  const {
    data: recentBookings,
    isLoading: bookingsLoading,
    isError: bookingsError,
    error: bookingsErr,
    refetch: refetchBookings,
    isFetching: bookingsFetching,
  } = useQuery<Booking[]>({
    queryKey: ['recent-bookings'],
    queryFn: () => getApiData(() => apiClient.get('/bookings?page=1&limit=5')),
  })

  const cards = [
    {
      title: 'Total Portfolio Images',
      value: stats?.total_images ?? 0,
      icon: <ImageIcon className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50/50 border-indigo-100',
    },
    {
      title: 'Active Categories',
      value: stats?.total_categories ?? 0,
      icon: <FolderTree className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50/50 border-emerald-100',
    },
    {
      title: 'Photography Services',
      value: stats?.total_services ?? 0,
      icon: <Camera className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50/50 border-amber-100',
    },
    {
      title: 'Pending Inquiries',
      value: stats?.new_bookings ?? 0,
      icon: <CalendarDays className="w-5 h-5 text-rose-600" />,
      bg: 'bg-rose-50/50 border-rose-100',
    },
  ]

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
            <Clock className="w-3.5 h-3.5" /> New
          </span>
        )
      case 'REVIEWED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
            <CheckCircle className="w-3.5 h-3.5" /> Reviewed
          </span>
        )
      case 'RESPONDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle className="w-3.5 h-3.5" /> Responded
          </span>
        )
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Overview of your photography studio's portfolio, categories, and client bookings."
      />

      {/* Stats Grid */}
      {statsError ? (
        <InlineErrorCard
          error={statsErr}
          variant="admin"
          onRetry={() => refetchStats()}
          isRetrying={statsFetching}
        />
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading
          ? <AdminCardSkeleton count={4} />
          : cards.map((card, index) => (
              <div
                key={index}
                className={`p-6 border rounded-2xl bg-white shadow-xs flex items-center justify-between transition-transform duration-200 hover:-translate-y-0.5`}
              >
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{card.title}</p>
                  <p className="text-3xl font-bold text-zinc-900">{card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${card.bg}`}>
                  {card.icon}
                </div>
              </div>
            ))}
      </div>
      )}

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Inquiries Panel */}
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-zinc-900 text-lg">Recent Booking Inquiries</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Manage details and update statuses</p>
            </div>
            <Link
              to="/admin/bookings"
              className="flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            {bookingsError ? (
              <InlineErrorCard
                error={bookingsErr}
                variant="admin"
                onRetry={() => refetchBookings()}
                isRetrying={bookingsFetching}
              />
            ) : bookingsLoading ? (
              <AdminTableSkeleton rows={3} />
            ) : recentBookings && recentBookings.length > 0 ? (
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 text-zinc-400 font-semibold text-xs uppercase tracking-wider pb-3">
                    <th className="py-3 pr-4">Client</th>
                    <th className="py-3 px-4">Event Date</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-zinc-50/50 group transition-colors">
                      <td className="py-4 pr-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-200 transition-colors">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-800">{booking.name}</p>
                          <p className="text-xs text-zinc-400">{booking.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-zinc-600">
                        {booking.event_date
                          ? new Date(booking.event_date).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Not specified'}
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(booking.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-zinc-400 text-sm">
                No recent booking inquiries found.
              </div>
            )}
          </div>
        </div>

        {/* Quick action helper sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs">
            <h3 className="font-bold text-zinc-900 text-lg mb-4">Quick Shortcuts</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/admin/portfolio"
                className="flex flex-col items-center justify-center p-4 border border-zinc-100 hover:border-zinc-300 rounded-2xl bg-zinc-50/50 hover:bg-zinc-50 transition-all text-center group"
              >
                <ImageIcon className="w-6 h-6 text-zinc-500 group-hover:text-zinc-900 transition-colors mb-2" />
                <span className="text-xs font-semibold text-zinc-600 group-hover:text-zinc-950">Add Image</span>
              </Link>
              <Link
                to="/admin/categories"
                className="flex flex-col items-center justify-center p-4 border border-zinc-100 hover:border-zinc-300 rounded-2xl bg-zinc-50/50 hover:bg-zinc-50 transition-all text-center group"
              >
                <FolderTree className="w-6 h-6 text-zinc-500 group-hover:text-zinc-900 transition-colors mb-2" />
                <span className="text-xs font-semibold text-zinc-600 group-hover:text-zinc-950">New Category</span>
              </Link>
            </div>
          </div>

          {/* Quick tips panel */}
          <div className="bg-zinc-900 text-white rounded-2xl p-6 shadow-sm border border-zinc-950 flex flex-col justify-between h-48 relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-15 translate-x-4 -translate-y-4">
              <TrendingUp className="w-48 h-48" />
            </div>
            <div className="relative z-10">
              <h4 className="font-bold text-base tracking-wide">Sync is automatic</h4>
              <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                All changes you perform in the dashboard are instantly synchronized and deployed to the customer website.
              </p>
            </div>
            <div className="relative z-10 text-[10px] uppercase font-bold tracking-wider text-zinc-500">
              Live Status: Active
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
