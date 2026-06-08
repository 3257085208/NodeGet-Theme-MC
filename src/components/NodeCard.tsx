import { ArrowDown, ArrowUp, Clock, type LucideIcon } from 'lucide-react'
import { Badge } from './ui/badge'
import { Card } from './ui/card'
import { Progress } from './ui/progress'
import { InventoryBar, MinecraftHud, PixelMob } from './MinecraftDecor'
import { Flag } from './Flag'
import { StatusDot } from './StatusDot'
import { bytes, pct, relativeAge, uptime } from '../utils/format'
import { cpuLabel, deriveUsage, displayName, distroLogo, osLabel, virtLabel } from '../utils/derive'
import { cn, loadColor } from '../utils/cn'
import type { Node } from '../types'
import type { ReactNode } from 'react'

export function NodeCard({ node }: { node: Node }) {
  const u = deriveUsage(node)
  const tags = Array.isArray(node.meta?.tags) ? node.meta.tags : []
  const os = osLabel(node)
  const logo = distroLogo(node)
  const virt = virtLabel(node)
  const cpu = cpuLabel(node)

  return (
      <a href={`#${encodeURIComponent(node.uuid)}`} className="block">
        <Card
            className={cn(
                'p-0 transition hover:-translate-y-0.5 flex flex-col gap-0 mc-server-card',
                !node.online && 'opacity-60',
            )}
        >
          <div className="mc-grass-strip h-3" />
          <div className="flex items-center gap-3 p-4 pb-3">
            <PixelMob type={node.online ? 'villager' : 'zombie'} className="shrink-0" />
            <StatusDot online={node.online} />
            {logo && (
                <img src={logo} alt="" className="w-5 h-5 shrink-0 object-contain" loading="lazy" />
            )}
            <span className="font-semibold flex-1 min-w-0 truncate" title={displayName(node)}>
            {displayName(node)}
          </span>
            <Flag code={node.meta?.region} className="shrink-0" />
          </div>

          <div className="flex items-center justify-between gap-2 px-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <span>{node.online ? '在线区块' : '离线区块'}</span>
            <span>{node.meta?.region || 'Void'}</span>
          </div>

          <div className="px-4 pt-3">
            <MinecraftHud
              health={node.online ? 10 : 2}
              hunger={Math.max(1, Math.round((100 - (u.mem ?? 0)) / 10))}
              armor={Math.max(1, Math.round((100 - (u.cpu ?? 0)) / 12))}
            />
          </div>

          {(os || virt) && (
              <div className="mx-4 mt-3 font-mono text-xs text-muted-foreground truncate border-l-4 border-primary pl-2">
                {[os, virt].filter(Boolean).join(' · ')}
              </div>
          )}

          <div className="flex flex-col gap-2.5 p-4">
            <Metric label="CPU" value={u.cpu} sub={cpu || null} subTitle={cpu || undefined} />
            <Metric
                label="内存"
                value={u.mem}
                sub={u.memTotal ? `${bytes(u.memUsed)} / ${bytes(u.memTotal)}` : null}
            />
            <Metric
                label="磁盘"
                value={u.disk}
                sub={u.diskTotal ? `${bytes(u.diskUsed)} / ${bytes(u.diskTotal)}` : null}
            />
          </div>

          <div className="px-4 pb-3 pt-2.5 border-t-2 border-dashed font-mono text-xs text-muted-foreground space-y-1.5">
            <div className="flex items-center gap-3">
              <Stat icon={ArrowDown}>{bytes(u.netIn || 0)}/s</Stat>
              <Stat icon={ArrowUp}>{bytes(u.netOut || 0)}/s</Stat>
            </div>
            <div className="flex items-center gap-3">
              <Stat icon={Clock}>{uptime(u.uptime)}</Stat>
              <span className="ml-auto">{relativeAge(u.ts)}</span>
            </div>
          </div>

          {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-3">
                {tags.map(t => (
                    <Badge key={t} variant="outline" className="text-[10px]">
                      {t}
                    </Badge>
                ))}
              </div>
          )}
        </Card>
        <div className="mt-2">
          <InventoryBar slots={5} active={node.online ? 0 : 2} />
        </div>
      </a>
  )
}

function Stat({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
      <span className="inline-flex items-center gap-1 uppercase tracking-wide">
      <Icon className="h-3 w-3" />
        {children}
    </span>
  )
}

function Metric({
                  label,
                  value,
                  sub,
                  subTitle,
                }: {
  label: string
  value: number | undefined
  sub?: string | null
  subTitle?: string
}) {
  return (
      <div className="min-w-0">
        <div className="flex justify-between text-[11px] uppercase tracking-[0.18em]">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-mono">{pct(value)}</span>
        </div>
        <Progress value={value} indicatorClassName={loadColor(value)} className="mt-1" />
        {sub && (
            <div
                className="font-mono text-[11px] text-muted-foreground mt-1 truncate"
                title={subTitle}
            >
              {sub}
            </div>
        )}
      </div>
  )
}
