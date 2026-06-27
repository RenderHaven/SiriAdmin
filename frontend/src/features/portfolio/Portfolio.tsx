import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, getApiData } from '@/api/client'
import { PortfolioImage, Category } from '@/types'
import { useToast } from '@/components/ui/Toast'
import { PageHeader } from '@/components/common/PageHeader'
import { Dialog } from '@/components/common/Dialog'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { AdminQueryState } from '@/components/errors/AdminQueryState'
import { SectionSkeleton } from '@/components/errors/LoadingSkeleton'
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Filter, 
  UploadCloud, 
  Image as ImageIcon,
  Loader2,
  Eye,
  EyeOff,
  Grip
} from 'lucide-react'

// dnd-kit
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const SortablePortfolioItem = ({
  image,
  index,
  catName,
  isDraggable,
  onEdit,
  onDelete,
}: {
  image: PortfolioImage
  index: number
  catName: string
  isDraggable: boolean
  onEdit: (img: PortfolioImage) => void
  onDelete: (img: PortfolioImage) => void
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id.toString(),
    disabled: !isDraggable,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style as React.CSSProperties}
      className={`relative group bg-white border rounded-2xl overflow-hidden shadow-xs transition-all duration-200 flex flex-col ${
        isDragging ? 'border-indigo-300 ring-2 ring-indigo-100 scale-105' : 'border-zinc-200 hover:-translate-y-1 hover:shadow-md'
      }`}
    >
      {/* Image card wrapper */}
      <div className="relative aspect-4/3 bg-zinc-100 overflow-hidden shrink-0 group/img">
        <img
          src={image.image_url}
          alt={image.caption || 'Portfolio Showcase'}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Category label badge */}
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs border border-zinc-100/50 text-zinc-800 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg">
          {catName}
        </span>

        {/* display order indicator */}
        <span className="absolute top-3 right-3 bg-zinc-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
          Order: {image.display_order}
        </span>
      </div>

      {/* Info and Actions */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <p className="text-sm text-zinc-700 font-medium line-clamp-2 italic">
            {image.caption ? `"${image.caption}"` : 'Untitled project'}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-50 pt-3">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${
            image.is_active ? 'text-emerald-600' : 'text-zinc-400'
          }`}>
            {image.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {image.is_active ? 'Visible' : 'Hidden'}
          </span>

          {/* Standard actions */}
          <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            {isDraggable && (
              <div 
                {...attributes} 
                {...listeners}
                className="p-1.5 border border-zinc-200 bg-zinc-50 hover:border-zinc-300 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all cursor-grab active:cursor-grabbing"
                title="Drag to Reorder"
              >
                <Grip className="w-3.5 h-3.5" />
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(image)
              }}
              className="p-1.5 border border-zinc-100 hover:border-zinc-200 text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-zinc-50 transition-all cursor-pointer"
              title="Edit Caption / Category"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(image)
              }}
              className="p-1.5 border border-rose-50 hover:border-rose-100 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
              title="Delete Image"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Portfolio: React.FC = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  
  // Toolbar states
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('')
  const [localImagesList, setLocalImagesList] = useState<PortfolioImage[]>([])

  // Modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<PortfolioImage | null>(null)
  const [deletingImage, setDeletingImage] = useState<PortfolioImage | null>(null)

  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string>('')
  const [uploadCategoryId, setUploadCategoryId] = useState<number | ''>('')
  const [uploadCaption, setUploadCaption] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  // Edit form state
  const [editCategoryId, setEditCategoryId] = useState<number | ''>('')
  const [editCaption, setEditCaption] = useState('')

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClient.get('/categories')
      return res.data.data
    },
  })

  // Fetch portfolio images
  const {
    data: imagesData,
    isLoading: imagesLoading,
    isError: imagesError,
    error: imagesErr,
    refetch: refetchImages,
    isFetching: imagesFetching,
  } = useQuery({
    queryKey: ['portfolio-images', selectedCategoryId],
    queryFn: async () => {
      const categoryFilter = selectedCategoryId ? `&category_id=${selectedCategoryId}` : ''
      const fetchedImages = await getApiData<PortfolioImage[]>(() =>
        apiClient.get(`/portfolio/images?page=1&limit=100${categoryFilter}`),
      )
      return [...fetchedImages].sort((a, b) => a.display_order - b.display_order)
    },
  })

  useEffect(() => {
    if (imagesData) {
      setLocalImagesList(imagesData)
    }
  }, [imagesData])

  // Delete Portfolio Image Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.delete(`/portfolio/images/${id}`)
      return res.data
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['portfolio-images'] })
        showToast('Image deleted successfully!', 'success')
        setDeletingImage(null)
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || 'Failed to delete image'
      showToast(msg, 'error')
    },
  })

  // Update Image metadata Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiClient.put(`/portfolio/images/${id}`, data)
      return res.data
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['portfolio-images'] })
        showToast('Image details updated!', 'success')
        setEditingImage(null)
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || 'Failed to update image details'
      showToast(msg, 'error')
    },
  })

  // Reorder Images Mutation
  const reorderMutation = useMutation({
    mutationFn: async (payload: { category_id: number; images: { id: number; display_order: number }[] }) => {
      const res = await apiClient.patch('/portfolio/images/reorder', payload)
      return res.data
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['portfolio-images'] })
        showToast('Image order auto-saved!', 'success')
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || 'Failed to sync image order'
      showToast(msg, 'error')
      // Revert on error
      if (imagesData) setLocalImagesList(imagesData)
    },
  })

  // Handle Drag / Drop file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Submit Upload Form (multipart/form-data)
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile) {
      showToast('Please select an image file', 'error')
      return
    }
    if (!uploadCategoryId) {
      showToast('Please select a category', 'error')
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('image', uploadFile)
    formData.append('category_id', String(uploadCategoryId))
    if (uploadCaption) {
      formData.append('caption', uploadCaption)
    }

    try {
      const response = await apiClient.post('/portfolio/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (response.data.success) {
        queryClient.invalidateQueries({ queryKey: ['portfolio-images'] })
        showToast('Image uploaded successfully!', 'success')
        setIsUploadOpen(false)
        resetUploadForm()
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Image upload failed'
      showToast(msg, 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const resetUploadForm = () => {
    setUploadFile(null)
    setUploadPreview('')
    setUploadCategoryId('')
    setUploadCaption('')
  }

  const handleEditClick = (image: PortfolioImage) => {
    setEditingImage(image)
    setEditCategoryId(image.category_id)
    setEditCaption(image.caption || '')
  }

  // Drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id && over) {
      const oldIndex = localImagesList.findIndex((img) => img.id.toString() === active.id)
      const newIndex = localImagesList.findIndex((img) => img.id.toString() === over.id)

      const newOrdered = arrayMove(localImagesList, oldIndex, newIndex)
      
      // Update local state and remap display_order
      const remapped = newOrdered.map((item, index) => ({
        ...item,
        display_order: index + 1,
      }))
      setLocalImagesList(remapped)

      // Auto-save if a specific category is selected
      if (selectedCategoryId) {
        const payload = {
          category_id: Number(selectedCategoryId),
          images: remapped.map((item) => ({
            id: item.id,
            display_order: item.display_order,
          })),
        }
        reorderMutation.mutate(payload)
      }
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio Images"
        description="Upload showcase projects and adjust display order for client portfolio visibility."
        action={
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl text-sm transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            Upload Image
          </button>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <Filter className="w-4.5 h-4.5 text-zinc-400 shrink-0" />
          <select
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value ? Number(e.target.value) : '')
            }}
            className="text-sm bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Info label */}
        {selectedCategoryId && localImagesList.length > 1 && (
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-100">
            <Grip className="w-3.5 h-3.5" />
            Drag images to auto-save display order
          </div>
        )}
      </div>

      {/* Visual Portfolio Grid */}
      <AdminQueryState
        isLoading={imagesLoading}
        isError={imagesError}
        error={imagesErr}
        onRetry={() => refetchImages()}
        isFetching={imagesFetching}
        skeleton={<SectionSkeleton rows={4} />}
      >
      {localImagesList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={localImagesList.map(img => img.id.toString())}
              strategy={rectSortingStrategy}
            >
              {localImagesList.map((image, index) => {
                const catName = categories.find((c) => c.id === image.category_id)?.name || 'Category'
                // Dragging is only allowed when viewing a specific category
                const isDraggable = !!selectedCategoryId && localImagesList.length > 1

                return (
                  <SortablePortfolioItem
                    key={image.id}
                    image={image}
                    index={index}
                    catName={catName}
                    isDraggable={isDraggable}
                    onEdit={handleEditClick}
                    onDelete={setDeletingImage}
                  />
                )
              })}
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <EmptyState
          title="No images uploaded"
          description={selectedCategoryId ? "No images match the selected category filter." : "Your photography portfolio is currently empty. Upload your first showcase project."}
          icon={<ImageIcon className="w-10 h-10 text-zinc-400" />}
          action={
            !selectedCategoryId ? (
              <button
                onClick={() => setIsUploadOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl text-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4.5 h-4.5" /> Upload Image
              </button>
            ) : undefined
          }
        />
      )}
      </AdminQueryState>

      {/* UPLOAD PORTFOLIO IMAGE MODAL */}
      <Dialog
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false)
          resetUploadForm()
        }}
        title="Upload Portfolio Image"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-5">
          {/* File drag / drop zone */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Select Image File
            </label>
            {!uploadPreview ? (
              <div className="border-2 border-dashed border-zinc-200 hover:border-zinc-400 bg-zinc-50/50 rounded-2xl p-8 text-center transition-colors relative">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <UploadCloud className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-zinc-700">Drag & Drop or Click to browse</p>
                <p className="text-xs text-zinc-400 mt-1">Supports PNG, JPG, JPEG, WEBP (Max 10 MB)</p>
              </div>
            ) : (
              <div className="relative aspect-16/10 rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-100">
                <img src={uploadPreview} alt="Preview" className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={() => {
                    setUploadFile(null)
                    setUploadPreview('')
                  }}
                  className="absolute top-3 right-3 bg-zinc-900/80 hover:bg-zinc-900 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Change File
                </button>
              </div>
            )}
          </div>

          {/* Category selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Assign Category
            </label>
            <select
              value={uploadCategoryId}
              onChange={(e) => setUploadCategoryId(e.target.value ? Number(e.target.value) : '')}
              required
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
            >
              <option value="">Select Category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Caption (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Wedding Reception in Goa"
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2.5 border border-zinc-200 text-zinc-700 font-medium rounded-xl hover:bg-zinc-50 text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl text-sm transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {isUploading && <Loader2 className="w-4.5 h-4.5 animate-spin" />}
              Upload Image
            </button>
          </div>
        </form>
      </Dialog>

      {/* EDIT PORTFOLIO IMAGE DETAILS MODAL */}
      <Dialog
        isOpen={!!editingImage}
        onClose={() => setEditingImage(null)}
        title="Edit Image Details"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            updateMutation.mutate({
              id: editingImage!.id,
              data: {
                category_id: editCategoryId,
                caption: editCaption || null,
              },
            })
          }}
          className="space-y-5"
        >
          {/* Category selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              value={editCategoryId}
              onChange={(e) => setEditCategoryId(Number(e.target.value))}
              required
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Caption
            </label>
            <input
              type="text"
              placeholder="e.g. Wedding Reception"
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditingImage(null)}
              className="px-4 py-2.5 border border-zinc-200 text-zinc-700 font-medium rounded-xl hover:bg-zinc-50 text-sm transition-colors cursor-pointer"
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

      {/* DELETE IMAGE CONFIRMATION */}
      <ConfirmDialog
        isOpen={!!deletingImage}
        onClose={() => setDeletingImage(null)}
        onConfirm={() => deleteMutation.mutate(deletingImage!.id)}
        title="Delete Portfolio Image?"
        description="Are you sure you want to permanently delete this portfolio image? This will remove the image file from Cloudinary CDN and delete metadata from database."
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
