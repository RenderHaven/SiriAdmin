import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, getApiData } from '@/api/client'
import { Service } from '@/types'
import { useToast } from '@/components/ui/Toast'
import { PageHeader } from '@/components/common/PageHeader'
import { Dialog } from '@/components/common/Dialog'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  Loader2, 
  DollarSign, 
  Sparkles,
  Layers,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AdminQueryState } from '@/components/errors/AdminQueryState'
import { SectionSkeleton } from '@/components/errors/LoadingSkeleton'

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Max 200 characters'),
  price: z.coerce.number().positive('Price must be greater than zero'),
  description: z.string().min(1, 'Description is required'),
  includes: z.string().min(1, 'Includes list is required (comma-separated items)'),
  image_url: z.string().url('Please enter a valid URL').or(z.literal('')).nullable().optional(),
})

type ServiceFormValues = z.infer<typeof serviceSchema>

export const Services: React.FC = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deletingService, setDeletingService] = useState<Service | null>(null)

  // Fetch Services
  const {
    data: services = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: () => getApiData(() => apiClient.get('/services')),
  })

  // Create Service Form
  const createForm = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema) as any,
    defaultValues: { title: '', price: 0, description: '', includes: '', image_url: '' },
  })

  // Edit Service Form
  const editForm = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema) as any,
  })

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async (data: ServiceFormValues) => {
      // Ensure image_url is null if empty
      const payload = {
        ...data,
        image_url: data.image_url || null,
      }
      const res = await apiClient.post('/services', payload)
      return res.data
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['services'] })
        showToast('Service package created successfully!', 'success')
        setIsCreateOpen(false)
        createForm.reset()
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || 'Failed to create service'
      showToast(msg, 'error')
    },
  })

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const payload = {
        ...data,
        image_url: data.image_url || null,
      }
      const res = await apiClient.put(`/services/${id}`, payload)
      return res.data
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['services'] })
        showToast('Service package updated successfully!', 'success')
        setEditingService(null)
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || 'Failed to update service'
      showToast(msg, 'error')
    },
  })

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.delete(`/services/${id}`)
      return res.data
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['services'] })
        showToast('Service package deleted!', 'success')
        setDeletingService(null)
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || 'Failed to delete service'
      showToast(msg, 'error')
    },
  })

  const handleEditClick = (service: Service) => {
    setEditingService(service)
    editForm.setValue('title', service.title)
    editForm.setValue('price', service.price)
    editForm.setValue('description', service.description)
    editForm.setValue('includes', service.includes)
    editForm.setValue('image_url', service.image_url || '')
  }

  const toggleServiceStatus = (service: Service) => {
    updateMutation.mutate({
      id: service.id,
      data: { is_active: !service.is_active },
    })
  }

  const renderIncludesList = (includesStr: string) => {
    return includesStr
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services & Packages"
        description="Add, modify, or retire photography offerings and pricing. Instantly updates client inquiry selectors."
        action={
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl text-sm transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            Add Package
          </button>
        }
      />

      {/* Services Showcase Cards */}
      <AdminQueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        isFetching={isFetching}
        skeleton={<SectionSkeleton rows={3} />}
      >
      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className={`bg-white border rounded-3xl p-6 shadow-xs flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
                service.is_active ? 'border-zinc-200' : 'border-zinc-200 bg-zinc-50/50'
              }`}
            >
              {/* Card Top / Title */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-zinc-900 text-xl tracking-tight leading-snug">{service.title}</h3>
                    <p className="text-sm text-zinc-400 font-semibold mt-1">Package Code: #{service.id}</p>
                  </div>
                  <button
                    onClick={() => toggleServiceStatus(service)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border cursor-pointer transition-colors ${
                      service.is_active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                    }`}
                  >
                    {service.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {service.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>

                {/* Price tag */}
                <div className="flex items-baseline gap-1.5 border-y border-zinc-100 py-3">
                  <span className="text-3xl font-extrabold text-zinc-900">₹{service.price.toLocaleString()}</span>
                  <span className="text-xs text-zinc-400 font-medium">Fixed Price</span>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-zinc-500 leading-relaxed font-medium">{service.description}</p>
                </div>

                {/* Includes Items list */}
                <div className="space-y-2.5 pt-2">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">What's Included:</p>
                  <ul className="space-y-2">
                    {renderIncludesList(service.includes).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-600">
                        <Check className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-zinc-50">
                <button
                  onClick={() => handleEditClick(service)}
                  className="flex-1 py-2 px-3 border border-zinc-200 hover:border-zinc-300 text-zinc-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Details
                </button>
                <button
                  onClick={() => setDeletingService(service)}
                  className="p-2 border border-rose-50 hover:border-rose-100 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                  title="Delete Package"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No service packages"
          description="Create photo event packages (e.g. Bronze, Silver, Premium Wedding) to list them on the booking portal."
          icon={<Layers className="w-10 h-10 text-zinc-400" />}
          action={
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl text-sm transition-colors"
            >
              <Plus className="w-4.5 h-4.5" /> Add Package
            </button>
          }
        />
      )}
      </AdminQueryState>

      {/* CREATE PACKAGE MODAL */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false)
          createForm.reset()
        }}
        title="Add Photography Package"
      >
        <form
          onSubmit={createForm.handleSubmit((data) => createMutation.mutate(data))}
          className="space-y-4"
        >
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Package Title
            </label>
            <input
              type="text"
              placeholder="e.g. Platinum Wedding Package"
              {...createForm.register('title')}
              disabled={createMutation.isPending}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 disabled:opacity-50"
            />
            {createForm.formState.errors.title && (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {createForm.formState.errors.title.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Price (INR)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400 text-sm font-semibold">
                ₹
              </span>
              <input
                type="number"
                placeholder="50000"
                {...createForm.register('price')}
                disabled={createMutation.isPending}
                className="w-full pl-8 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 disabled:opacity-50"
              />
            </div>
            {createForm.formState.errors.price && (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {createForm.formState.errors.price.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              placeholder="Provide a descriptive overview of what this service covers..."
              rows={3}
              {...createForm.register('description')}
              disabled={createMutation.isPending}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 disabled:opacity-50"
            />
            {createForm.formState.errors.description && (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {createForm.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Includes */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Includes (Comma-separated items)
            </label>
            <input
              type="text"
              placeholder="e.g. 2 Photographers, Drone Footage, Premium Album, 4K Video Editing"
              {...createForm.register('includes')}
              disabled={createMutation.isPending}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 disabled:opacity-50"
            />
            {createForm.formState.errors.includes && (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {createForm.formState.errors.includes.message}
              </p>
            )}
          </div>

          {/* Image Url */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Cover Image URL (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. https://res.cloudinary.com/..."
              {...createForm.register('image_url')}
              disabled={createMutation.isPending}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 disabled:opacity-50"
            />
            {createForm.formState.errors.image_url && (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {createForm.formState.errors.image_url.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2.5 border border-zinc-200 text-zinc-700 font-medium rounded-xl hover:bg-zinc-50 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl text-sm transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {createMutation.isPending && <Loader2 className="w-4.5 h-4.5 animate-spin" />}
              Create Package
            </button>
          </div>
        </form>
      </Dialog>

      {/* EDIT PACKAGE MODAL */}
      <Dialog
        isOpen={!!editingService}
        onClose={() => setEditingService(null)}
        title="Edit Package Details"
      >
        <form
          onSubmit={editForm.handleSubmit((data) =>
            updateMutation.mutate({ id: editingService!.id, data })
          )}
          className="space-y-4"
        >
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Package Title
            </label>
            <input
              type="text"
              placeholder="e.g. Premium Shoot"
              {...editForm.register('title')}
              disabled={updateMutation.isPending}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 disabled:opacity-50"
            />
            {editForm.formState.errors.title && (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {editForm.formState.errors.title.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Price (INR)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400 text-sm font-semibold">
                ₹
              </span>
              <input
                type="number"
                placeholder="20000"
                {...editForm.register('price')}
                disabled={updateMutation.isPending}
                className="w-full pl-8 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 disabled:opacity-50"
              />
            </div>
            {editForm.formState.errors.price && (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {editForm.formState.errors.price.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              placeholder="Cover package details..."
              rows={3}
              {...editForm.register('description')}
              disabled={updateMutation.isPending}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 disabled:opacity-50"
            />
            {editForm.formState.errors.description && (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {editForm.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Includes */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Includes (Comma-separated items)
            </label>
            <input
              type="text"
              placeholder="e.g. 1 Photographer, Album"
              {...editForm.register('includes')}
              disabled={updateMutation.isPending}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 disabled:opacity-50"
            />
            {editForm.formState.errors.includes && (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {editForm.formState.errors.includes.message}
              </p>
            )}
          </div>

          {/* Image Url */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Cover Image URL (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. https://res.cloudinary.com/..."
              {...editForm.register('image_url')}
              disabled={updateMutation.isPending}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 disabled:opacity-50"
            />
            {editForm.formState.errors.image_url && (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {editForm.formState.errors.image_url.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setEditingService(null)}
              className="px-4 py-2.5 border border-zinc-200 text-zinc-700 font-medium rounded-xl hover:bg-zinc-50 text-sm transition-colors"
            >
              Cancel
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
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <ConfirmDialog
        isOpen={!!deletingService}
        onClose={() => setDeletingService(null)}
        onConfirm={() => deleteMutation.mutate(deletingService!.id)}
        title="Delete Photography Package?"
        description={`Are you sure you want to permanently delete the photography package "${deletingService?.title}"? Clients will no longer be able to select this package on the booking inquiry form.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
