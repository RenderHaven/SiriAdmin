import React from 'react'
import { FolderOpen } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = <FolderOpen className="w-12 h-12 text-zinc-300" />,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-zinc-200 bg-white rounded-2xl text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-zinc-900 text-base">{title}</h3>
      <p className="mt-1.5 text-sm text-zinc-500 max-w-xs">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
