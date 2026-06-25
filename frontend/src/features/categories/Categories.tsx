import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import { Category } from '@/types'
import { useToast } from '@/components/ui/Toast'
import { PageHeader } from '@/components/common/PageHeader'
import { Dialog } from '@/components/common/Dialog'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { Plus, Edit2, Trash2, Loader2, FolderTree, Search, GripVertical } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// dnd-kit
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Max 100 characters'),
})

type CategoryFormValues = z.infer<typeof categorySchema>

// Sortable Row Component
const SortableCategoryRow = ({
  category,
  onEdit,
  onDelete,
  onToggleStatus,
}: {
  category: Category
  onEdit: (c: Category) => void
  onDelete: (c: Category) => void
  onToggleStatus: (c: Category) => void
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id.toString(),
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: isDragging ? 'relative' : 'static',
    zIndex: isDragging ? 50 : 'auto',
    backgroundColor: isDragging ? '#fafafa' : undefined,
  }

  return (
    <tr ref={setNodeRef} style={style as React.CSSProperties} className="hover:bg-zinc-50/30 transition-colors border-b border-zinc-100">
      <td className="py-4 px-6 w-10">
        <div {...attributes} {...listeners} className="cursor-grab hover:bg-zinc-100 p-1.5 rounded text-zinc-400 hover:text-zinc-600 transition-colors inline-flex">
          <GripVertical className="w-4 h-4" />
        </div>
      </td>
      <td className="py-4 px-6 font-semibold text-zinc-800">{category.name}</td>
      <td className="py-4 px-6">
        <span className="font-semibold text-zinc-700 bg-zinc-100 px-2.5 py-1 rounded-lg text-xs">
          Order: {category.display_order}
        </span>
      </td>
      <td className="py-4 px-6">
        <button
          onClick={() => onToggleStatus(category)}
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer transition-colors ${
            category.is_active
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/50'
              : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100'
          }`}
        >
          {category.is_active ? 'Active' : 'Inactive'}
        </button>
      </td>
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={() => onEdit(category)}
            className="p-2 border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900 rounded-xl transition-all cursor-pointer"
            title="Edit Category Name"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(category)}
            className="p-2 border border-rose-50 hover:border-rose-100 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-xl transition-all cursor-pointer"
            title="Delete Category"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export const Categories: React.FC = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [localCategories, setLocalCategories] = useState<Category[]>([])
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClient.get('/categories')
      // sort by display_order to ensure safe rendering
      const sorted = (res.data.data as Category[]).sort((a, b) => a.display_order - b.display_order)
      return sorted
    },
  })

  // Sync local state when remote changes
  useEffect(() => {
    setLocalCategories(categories)
  }, [categories])

  // Create Category form
  const createForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' },
  })

  // Edit Category form
  const editForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  })

  // Create Category Mutation
  const createMutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      const res = await apiClient.post('/categories', data)
      return res.data
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['categories'] })
        showToast('Category created successfully!', 'success')
        setIsCreateOpen(false)
        createForm.reset()
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || 'Failed to create category'
      showToast(msg, 'error')
    },
  })

  // Update Category Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Category> }) => {
      const res = await apiClient.put(`/categories/${id}`, data)
      return res.data
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['categories'] })
        showToast('Category updated successfully!', 'success')
        setEditingCategory(null)
        editForm.reset()
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || 'Failed to update category'
      showToast(msg, 'error')
    },
  })

  // Delete Category Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.delete(`/categories/${id}`)
      return res.data
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['categories'] })
        showToast('Category and its images deleted successfully!', 'success')
        setDeletingCategory(null)
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || 'Failed to delete category'
      showToast(msg, 'error')
    },
  })

  const handleEditClick = (category: Category) => {
    setEditingCategory(category)
    editForm.setValue('name', category.name)
  }

  const toggleCategoryStatus = (category: Category) => {
    updateMutation.mutate({
      id: category.id,
      data: { is_active: !category.is_active },
    })
  }

  // Filtered categories
  const filteredCategories = localCategories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = localCategories.findIndex((c) => c.id.toString() === active.id)
      const newIndex = localCategories.findIndex((c) => c.id.toString() === over!.id)

      const newOrdered = arrayMove(localCategories, oldIndex, newIndex)
      
      // Update local state immediately for fast UI
      const remapped = newOrdered.map((item, index) => ({
        ...item,
        display_order: index + 1,
      }))
      setLocalCategories(remapped)

      // Sync with server by running concurrent PUT requests for items that changed order
      try {
        const promises = remapped.map((cat) => {
          const original = categories.find(c => c.id === cat.id)
          if (original && original.display_order !== cat.display_order) {
            return apiClient.put(`/categories/${cat.id}`, { display_order: cat.display_order })
          }
          return Promise.resolve()
        })
        await Promise.all(promises)
        queryClient.invalidateQueries({ queryKey: ['categories'] })
        showToast('Category order updated!', 'success')
      } catch (err: any) {
        showToast('Failed to sync order with server', 'error')
        setLocalCategories(categories) // revert on error
      }
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organize photography portfolio projects into categories (e.g. Wedding, Pre Wedding, Events)."
        action={
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl text-sm transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            Add Category
          </button>
        }
      />

      {/* Search toolbar */}
      <div className="flex items-center gap-4 bg-white border border-zinc-200 rounded-2xl px-4 py-3 shadow-xs max-w-sm">
        <Search className="w-5 h-5 text-zinc-400 shrink-0" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm bg-transparent border-0 focus:outline-hidden p-0 focus:ring-0 placeholder-zinc-400"
        />
      </div>

      {/* Main Categories table */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
            <p className="text-sm text-zinc-500 font-medium animate-pulse">Loading categories...</p>
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 w-10"></th>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Display Order</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={filteredCategories.map(c => c.id.toString())} 
                  strategy={verticalListSortingStrategy}
                >
                  <tbody className="divide-y divide-zinc-100">
                    {filteredCategories.map((category) => (
                      <SortableCategoryRow
                        key={category.id}
                        category={category}
                        onEdit={handleEditClick}
                        onDelete={setDeletingCategory}
                        onToggleStatus={toggleCategoryStatus}
                      />
                    ))}
                  </tbody>
                </SortableContext>
              </DndContext>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No categories found"
            description={searchTerm ? "No categories match your search." : "Create your first photography category to start grouping portfolio items."}
            icon={<FolderTree className="w-10 h-10 text-zinc-400" />}
            action={
              !searchTerm ? (
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl text-sm transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-4.5 h-4.5" /> Create Category
                </button>
              ) : undefined
            }
          />
        )}
      </div>

      {/* CREATE CATEGORY MODAL */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false)
          createForm.reset()
        }}
        title="Add New Category"
      >
        <form
          onSubmit={createForm.handleSubmit((data) => createMutation.mutate(data))}
          className="space-y-5"
        >
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Category Name
            </label>
            <input
              type="text"
              placeholder="e.g. Pre Wedding"
              {...createForm.register('name')}
              disabled={createMutation.isPending}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 disabled:opacity-50"
            />
            {createForm.formState.errors.name && (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {createForm.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2.5 border border-zinc-200 text-zinc-700 font-medium rounded-xl hover:bg-zinc-50 text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl text-sm transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {createMutation.isPending && <Loader2 className="w-4.5 h-4.5 animate-spin" />}
              Create
            </button>
          </div>
        </form>
      </Dialog>

      {/* EDIT CATEGORY MODAL */}
      <Dialog
        isOpen={!!editingCategory}
        onClose={() => {
          setEditingCategory(null)
          editForm.reset()
        }}
        title="Edit Category"
      >
        <form
          onSubmit={editForm.handleSubmit((data) =>
            updateMutation.mutate({ id: editingCategory!.id, data })
          )}
          className="space-y-5"
        >
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Category Name
            </label>
            <input
              type="text"
              placeholder="e.g. Birthday Party"
              {...editForm.register('name')}
              disabled={updateMutation.isPending}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 disabled:opacity-50"
            />
            {editForm.formState.errors.name && (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {editForm.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
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

      {/* DELETE CONFIRMATION */}
      <ConfirmDialog
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={() => deleteMutation.mutate(deletingCategory!.id)}
        title="Delete Category?"
        description={`Are you sure you want to delete the category "${deletingCategory?.name}"? Doing so will also delete all associated portfolio images inside it from database and Cloudinary.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
