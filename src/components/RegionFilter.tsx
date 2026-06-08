import { cn } from '../utils/cn'
import { Flag } from './Flag'
import React from "react";

interface Props {
  regions: { code: string; count: number }[]
  total: number
  active: string | null
  onChange: (code: string | null) => void
}

export function RegionFilter({ regions, total, active, onChange }: Props) {
  if (regions.length === 0) return null

  return (
    <div className="mc-panel p-3 sm:p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">传送门分区</div>
        <div className="text-xs text-muted-foreground">{regions.length} 个区域</div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Chip selected={active === null} onClick={() => onChange(null)}>
          <span>全部</span>
          <span className="text-[10px] opacity-70">{total}</span>
        </Chip>
        {regions.map(r => (
          <Chip key={r.code} selected={active === r.code} onClick={() => onChange(r.code)}>
            <Flag code={r.code} className="w-4 h-3" />
            <span>{r.code}</span>
            <span className="text-[10px] opacity-70">{r.count}</span>
          </Chip>
        ))}
      </div>
    </div>
  )
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] uppercase tracking-wide border-2 transition-colors mc-chip',
        selected
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-card text-foreground/80 border-border hover:bg-accent',
      )}
    >
      {children}
    </button>
  )
}
