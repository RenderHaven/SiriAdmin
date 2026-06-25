import React from 'react'
import { Dialog } from './Dialog'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isLoading = false,
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title} className="max-w-md">
      <div className="flex gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 border border-rose-100 shrink-0">
          <AlertTriangle className="w-6 h-6 text-rose-600" />
        </div>
        <div>
          <p className="text-zinc-600 text-sm leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 border border-zinc-200 text-zinc-700 font-medium rounded-xl hover:bg-zinc-50 disabled:opacity-50 text-sm transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl disabled:opacity-50 text-sm transition-colors shadow-xs"
        >
          {isLoading ? 'Processing...' : confirmText}
        </button>
      </div>
    </Dialog>
  )
}
