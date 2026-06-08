import { cn } from '../utils/cn'

type Mob = 'villager' | 'zombie' | 'enderman' | 'creeper'
type Block = 'grass' | 'diamond' | 'redstone' | 'gold'

const HEADS: Record<Mob | Block, string> = {
  villager: 'https://mc-heads.net/avatar/MHF_Villager/96',
  zombie: 'https://mc-heads.net/avatar/MHF_Zombie/96',
  enderman: 'https://mc-heads.net/avatar/MHF_Enderman/96',
  creeper: 'https://mc-heads.net/avatar/MHF_Creeper/96',
  grass: 'https://mc-heads.net/avatar/MHF_Grass/96',
  diamond: 'https://mc-heads.net/avatar/MHF_Diamond/96',
  redstone: 'https://mc-heads.net/avatar/MHF_Redstone/96',
  gold: 'https://mc-heads.net/avatar/MHF_Gold/96',
}

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
    <MinecraftHead src={HEADS.grass} alt="Grass block" className={cn('h-14 w-14', className)} />
  )
}

export function OreBlock({ className, ore = 'diamond' }: { className?: string; ore?: 'diamond' | 'redstone' | 'gold' }) {
  return <MinecraftHead src={HEADS[ore]} alt={`${ore} ore`} className={cn('h-12 w-12', className)} />
}

export function PixelMob({ type, className, label }: { type: Mob; className?: string; label?: string }) {
  return (
    <div className={cn('inline-flex flex-col items-center gap-1', className)}>
      <MinecraftHead src={HEADS[type]} alt={type} className="h-16 w-16" />
      {label && <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>}
    </div>
  )
}

function MinecraftHead({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      className={cn('mc-head border-2 border-border bg-background object-cover', className)}
    />
  )
}
