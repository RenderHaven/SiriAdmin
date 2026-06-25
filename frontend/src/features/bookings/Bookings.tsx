import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import { Booking, Service } from '@/types'
import { useToast } from '@/components/ui/Toast'
import { PageHeader } from '@/components/common/PageHeader'
import { Dialog } from '@/components/common/Dialog'
import { EmptyState } from '@/components/common/EmptyState'
import { 
  Clock, 
  CheckCircle, 
  Search, 
  Filter, 
  Calendar, 
  Phone, 
  Mail, 
  User, 
  FileText,
  Loader2,
  CalendarDays,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

export const Bookings: React.FC = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  // Pagination & Filtering state
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  // View Details Modal state
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null)
  
  // Edit State inside Modal
  const [adminNote, setAdminNote] = useState('')
  const [bookingStatus, setBookingStatus] = useState<Booking['status']>('NEW')

  // Fetch Services (to map service_id to Service title)
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await apiClient.get('/services')
      return res.data.data
    },
  })

  // Fetch Bookings list (paginated & filtered)
  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['bookings', page, statusFilter],
    queryFn: async () => {
      const statusQuery = statusFilter ? `&status=${statusFilter}` : ''
      const res = await apiClient.get(`/bookings?page=${page}&limit=${limit}${statusQuery}`)
      return res.data
    },
  })

  // Update Booking Status/Notes Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiClient.patch(`/bookings/${id}/status`, data)
      return res.data
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['bookings'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
        showToast('Booking inquiry updated successfully!', 'success')
        setViewingBooking(null)
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || 'Failed to update booking inquiry'
      showToast(msg, 'error')
    },
  })

  const bookingsList = (bookingsData?.data || []) as Booking[]
  const totalBookings = bookingsData?.total || 0
  const totalPages = Math.ceil(totalBookings / limit)

  // Filter local listings by search query (name or email)
  const filteredBookings = bookingsList.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.event_name && b.event_name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleViewDetails = (booking: Booking) => {
    setViewingBooking(booking)
    setAdminNote(booking.admin_note || '')
    setBookingStatus(booking.status)
  }

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!viewingBooking) return
    updateMutation.mutate({
      id: viewingBooking.id,
      data: {
        status: bookingStatus,
        admin_note: adminNote || null,
      },
    })
  }

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
            <Clock className="w-3.5 h-3.5" /> Reviewed
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
    <div className="space-y-6">
      <PageHeader
        title="Booking Inquiries"
        description="Review incoming customer event requests, assign packaging rates, and update review logs."
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs">
        {/* Search */}
        <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-1.5 max-w-sm w-full">
          <Search className="w-4.5 h-4.5 text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by client or event..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-transparent border-0 focus:outline-hidden p-0 focus:ring-0 placeholder-zinc-400"
          />
        </div>

        {/* Filter status */}
        <div className="flex items-center gap-3">
          <Filter className="w-4.5 h-4.5 text-zinc-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1) // Reset page on filter change
            }}
            className="text-xs bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 font-medium text-zinc-700"
          >
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="RESPONDED">Responded</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
            <p className="text-sm text-zinc-500 font-medium">Loading inquiries...</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/50 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                    <th className="py-4 px-6">Client</th>
                    <th className="py-4 px-6">Event & Date</th>
                    <th className="py-4 px-6">Service Requested</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredBookings.map((booking) => {
                    const matchedService = services.find((s) => s.id === booking.service_id)
                    return (
                      <tr key={booking.id} className="hover:bg-zinc-50/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-zinc-800">{booking.name}</div>
                          <div className="text-xs text-zinc-400 font-medium">{booking.email}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-zinc-800">
                            {booking.event_name || 'Personal Project'}
                          </div>
                          <div className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
                            <CalendarDays className="w-3.5 h-3.5 text-zinc-400" />
                            {booking.event_date
                              ? new Date(booking.event_date).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : 'TBD'}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {matchedService ? (
                            <div>
                              <div className="font-semibold text-zinc-800">{matchedService.title}</div>
                              <div className="text-xs text-zinc-400 font-semibold">₹{matchedService.price.toLocaleString()}</div>
                            </div>
                          ) : (
                            <span className="text-zinc-400 text-xs italic">Custom Packages</span>
                          )}
                        </td>
                        <td className="py-4 px-6">{getStatusBadge(booking.status)}</td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="px-3 py-1.5 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 font-semibold text-xs rounded-xl transition-colors cursor-pointer text-zinc-700"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-zinc-100 px-6 py-4 bg-zinc-50/30">
                <span className="text-xs font-semibold text-zinc-500">
                  Page {page} of {totalPages} ({totalBookings} total bookings)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 border border-zinc-200 rounded-xl hover:bg-zinc-50 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 border border-zinc-200 rounded-xl hover:bg-zinc-50 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            title="No inquiries found"
            description={statusFilter || searchTerm ? "No bookings match your current filter settings." : "New client inquiries submitted on the public website will show up here."}
            icon={<FileText className="w-10 h-10 text-zinc-400" />}
          />
        )}
      </div>

      {/* VIEW DETAILS MODAL */}
      <Dialog
        isOpen={!!viewingBooking}
        onClose={() => setViewingBooking(null)}
        title="Booking Inquiry Details"
        className="max-w-2xl"
      >
        {viewingBooking && (
          <form onSubmit={handleUpdateSubmit} className="space-y-6">
            {/* Split client and event info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50 border border-zinc-100 rounded-2xl p-5">
              {/* Client card */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Client Info</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-zinc-700 font-semibold">
                    <User className="w-4 h-4 text-zinc-400 shrink-0" />
                    {viewingBooking.name}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium">
                    <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                    <a href={`mailto:${viewingBooking.email}`} className="hover:underline text-zinc-800">
                      {viewingBooking.email}
                    </a>
                  </div>
                  {viewingBooking.phone && (
                    <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium">
                      <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                      {viewingBooking.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Event card */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Event Details</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-zinc-800 font-bold">
                    {viewingBooking.event_name || 'Personal Portfolio Shoot'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-600 font-semibold">
                    <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
                    Date:{' '}
                    {viewingBooking.event_date
                      ? new Date(viewingBooking.event_date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Not scheduled'}
                  </div>
                  <div className="text-xs text-zinc-400 font-semibold">
                    Submitted on: {new Date(viewingBooking.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Service & Message */}
            <div className="space-y-3.5">
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Package Requested</p>
                <p className="text-sm font-semibold text-zinc-800">
                  {services.find((s) => s.id === viewingBooking.service_id)?.title || 'Custom package'}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Client Message</p>
                <div className="bg-white border border-zinc-100 rounded-xl p-4 text-sm text-zinc-600 leading-relaxed font-medium italic">
                  {viewingBooking.message ? `"${viewingBooking.message}"` : 'No message provided.'}
                </div>
              </div>
            </div>

            {/* Update Controls (Status + Notes) */}
            <div className="border-t border-zinc-100 pt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                    Inquiry Status
                  </label>
                  <select
                    value={bookingStatus}
                    onChange={(e) => setBookingStatus(e.target.value as Booking['status'])}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                  >
                    <option value="NEW">New (Unreviewed)</option>
                    <option value="REVIEWED">Reviewed</option>
                    <option value="RESPONDED">Responded / Contacted</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                  Admin Internal Note
                </label>
                <textarea
                  placeholder="Record phone discussions, scheduled follow-ups, or notes..."
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setViewingBooking(null)}
                className="px-4 py-2.5 border border-zinc-200 text-zinc-700 font-medium rounded-xl hover:bg-zinc-50 text-sm transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl text-sm transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                {updateMutation.isPending && <Loader2 className="w-4.5 h-4.5 animate-spin" />}
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  )
}
