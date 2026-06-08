import { cn } from '../utils/cn'

type Mob = 'villager' | 'zombie' | 'enderman' | 'creeper'

const HEARTS = ['♥', '♥', '♥', '♥', '♥', '♥', '♥', '♥', '♥', '♥']
const FOOD = ['▰', '▰', '▰', '▰', '▰', '▰', '▰', '▰', '▰', '▰']
const ARMOR = ['◆', '◆', '◆', '◆', '◆', '◆', '◆', '◆', '◆', '◆']

export function MinecraftHud({ health = 10, hunger = 10, armor = 6 }: { health?: number; hunger?: number; armor?: number }) {
  return (
    <div className="mc-hud grid gap-1.5 border-2 border-border bg-background/80 p-2 text-sm leading-none mc-chip">
      <HudRow label="HP" items={HEARTS} active={health} activeClass="text-red-500" mutedClass="text-red-950/35 dark:text-red-900/45" />
      <HudRow label="FOOD" items={FOOD} active={hunger} activeClass="text-amber-600" mutedClass="text-amber-950/35 dark:text-amber-900/45" />
      <HudRow label="ARMOR" items={ARMOR} active={armor} activeClass="text-slate-500 dark:text-slate-300" mutedClass="text-slate-900/25 dark:text-slate-700/55" />
    </div>
  )
}

function HudRow({
  label,
  items,
  active,
  activeClass,
  mutedClass,
}: {
  label: string
  items: string[]
  active: number
  activeClass: string
  mutedClass: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-12 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      <span className="flex gap-0.5 font-black tracking-tight">
        {items.map((item, index) => (
          <span key={index} className={index < active ? activeClass : mutedClass}>
            {item}
          </span>
        ))}
      </span>
    </div>
  )
}

export function GrassBlock({ className }: { className?: string }) {
  return (
    <div className={cn('mc-block relative h-14 w-14 border-2 border-border bg-[#8b5a2b]', className)}>
      <div className="absolute inset-x-0 top-0 h-5 bg-[#4f9f35]" />
      <div className="absolute left-1 top-1 h-2 w-2 bg-[#7bc95a]" />
      <div className="absolute right-2 top-2 h-2 w-3 bg-[#2f6f26]" />
      <div className="absolute left-2 top-7 h-2 w-2 bg-[#6f4122]" />
      <div className="absolute right-3 bottom-2 h-2 w-2 bg-[#a06b38]" />
    </div>
  )
}

export function OreBlock({ className, ore = 'diamond' }: { className?: string; ore?: 'diamond' | 'redstone' | 'gold' }) {
  const color = ore === 'redstone' ? 'bg-red-500' : ore === 'gold' ? 'bg-yellow-400' : 'bg-cyan-300'
  return (
    <div className={cn('mc-block relative h-12 w-12 border-2 border-border bg-stone-500', className)}>
      <span className={cn('absolute left-2 top-2 h-2 w-2', color)} />
      <span className={cn('absolute right-2 top-4 h-2 w-3', color)} />
      <span className={cn('absolute bottom-2 left-4 h-2 w-2', color)} />
    </div>
  )
}

export function PixelMob({ type, className, label }: { type: Mob; className?: string; label?: string }) {
  return (
    <div className={cn('inline-flex flex-col items-center gap-1', className)}>
      <div className={cn('mc-mob', `mc-mob-${type}`)} aria-hidden>
        <span className="mc-mob-head">
          <span className="mc-eye mc-eye-left" />
          <span className="mc-eye mc-eye-right" />
          <span className="mc-mouth" />
        </span>
        <span className="mc-mob-body" />
        <span className="mc-arm mc-arm-left" />
        <span className="mc-arm mc-arm-right" />
        <span className="mc-leg mc-leg-left" />
        <span className="mc-leg mc-leg-right" />
      </div>
      {label && <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>}
    </div>
  )
}
