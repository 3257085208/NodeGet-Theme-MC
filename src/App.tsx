import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert'
import { useConfig } from './hooks/useConfig'
import { useNodes } from './hooks/useNodes'
import { Background } from './components/Background'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { NodeCard } from './components/NodeCard'
import { NodeTable } from './components/NodeTable'
import { NodeDetail } from './components/NodeDetail'
import { TagFilter } from './components/TagFilter'
import { RegionFilter } from './components/RegionFilter'
import { GrassBlock, InventoryBar, MenuButton, MinecraftHud, OreBlock } from './components/MinecraftDecor'

const WorldMap = lazy(() =>
  import('./components/WorldMap').then(m => ({ default: m.WorldMap })),
)
import { deriveUsage, displayName } from './utils/derive'
import type { Sort, View } from './types'

const DEFAULT_LOGO = `${import.meta.env.BASE_URL}logo.png`
const VIEW_KEY = 'nodeget.view'
const SORT_KEY = 'nodeget.sort'

function initialView(): View {
  const v = localStorage.getItem(VIEW_KEY)
  if (v === 'table' || v === 'map') return v
  return 'cards'
}

function initialSort(): Sort {
  return (localStorage.getItem(SORT_KEY) as Sort) || 'default'
}

function readHash() {
  return decodeURIComponent(window.location.hash.slice(1)) || null
}

const num = (v?: number) => (Number.isFinite(v) ? (v as number) : -Infinity)

export function App() {
  const { config, error: configError } = useConfig()
  const { nodes, errors, pool } = useNodes(config)

  const [view, setView] = useState<View>(initialView)
  const [sort, setSort] = useState<Sort>(initialSort)
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [activeRegion, setActiveRegion] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(readHash)

  useEffect(() => {
    localStorage.setItem(VIEW_KEY, view)
  }, [view])

  useEffect(() => {
    localStorage.setItem(SORT_KEY, sort)
  }, [sort])

  useEffect(() => {
    const onHash = () => setSelected(readHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    const target = selected ? `#${encodeURIComponent(selected)}` : ''
    if (window.location.hash === target) return
    if (selected) {
      window.location.hash = encodeURIComponent(selected)
    } else {
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }, [selected])

  const allTags = useMemo(() => {
    const set = new Set<string>()
    for (const n of nodes.values()) {
      if (n.meta?.hidden) continue
      for (const t of n.meta?.tags ?? []) set.add(t)
    }
    return [...set].sort()
  }, [nodes])

  const regions = useMemo(() => {
    const map = new Map<string, number>()
    let total = 0
    for (const n of nodes.values()) {
      if (n.meta?.hidden) continue
      total++
      const code = n.meta?.region?.trim().toUpperCase()
      if (!code || !/^[A-Z]{2}$/.test(code)) continue
      map.set(code, (map.get(code) ?? 0) + 1)
    }
    const list = [...map.entries()]
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count || a.code.localeCompare(b.code))
    return { list, total }
  }, [nodes])

  useEffect(() => {
    if (activeTag && !allTags.includes(activeTag)) setActiveTag(null)
  }, [allTags, activeTag])

  useEffect(() => {
    if (activeRegion && !regions.list.some(r => r.code === activeRegion)) setActiveRegion(null)
  }, [regions, activeRegion])

  const list = useMemo(() => {
    let arr = [...nodes.values()].filter(n => !n.meta?.hidden)
    if (activeTag) arr = arr.filter(n => n.meta?.tags?.includes(activeTag))
    if (activeRegion) {
      arr = arr.filter(n => n.meta?.region?.trim().toUpperCase() === activeRegion)
    }

    const q = query.trim().toLowerCase()
    if (q) {
      arr = arr.filter(n => {
        const hay = [
          n.uuid,
          n.source,
          n.meta?.name,
          n.meta?.region,
          n.meta?.virtualization,
          n.static?.system?.system_host_name,
          n.static?.system?.system_name,
          ...(n.meta?.tags ?? []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return hay.includes(q)
      })
    }

    const rank = new Map(regions.list.map((r, i) => [r.code, i]))

    return arr.sort((a, b) => {
      if (a.online !== b.online) return a.online ? -1 : 1

      const ua = deriveUsage(a)
      const ub = deriveUsage(b)
      let cmp = 0
      if (sort === 'cpu') cmp = num(ub.cpu) - num(ua.cpu)
      else if (sort === 'mem') cmp = num(ub.mem) - num(ua.mem)
      else if (sort === 'disk') cmp = num(ub.disk) - num(ua.disk)
      else if (sort === 'netIn') cmp = num(ub.netIn) - num(ua.netIn)
      else if (sort === 'netOut') cmp = num(ub.netOut) - num(ua.netOut)
      else if (sort === 'uptime') cmp = num(ub.uptime) - num(ua.uptime)
      else if (sort === 'region') {
        const ar = rank.get(a.meta?.region?.trim().toUpperCase() || '') ?? Infinity
        const br = rank.get(b.meta?.region?.trim().toUpperCase() || '') ?? Infinity
        cmp = ar - br
      }
      else if (sort === 'default') cmp = (a.meta?.order ?? 0) - (b.meta?.order ?? 0)

      return cmp || displayName(a).localeCompare(displayName(b))
    })
  }, [nodes, query, activeTag, activeRegion, sort, regions])

  const selectedNode = selected ? nodes.get(selected) || null : null

  if (configError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Alert variant="destructive" className="max-w-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>加载 config.json 失败</AlertTitle>
          <AlertDescription>{String(configError.message || configError)}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        加载中…
      </div>
    )
  }

  const logo = config.user_preferences.site_logo || DEFAULT_LOGO
  const empty = list.length === 0
  const hasErrors = errors.length > 0
  const onlineCount = list.filter(node => node.online).length
  const totalCount = list.length
  const offlineCount = totalCount - onlineCount

  return (
    <div className="min-h-screen flex flex-col">
      <Background />
      <Navbar
        siteName={config.user_preferences.site_name || '你没设置'}
        logo={logo}
        query={query}
        onQuery={setQuery}
        view={view}
        onView={setView}
        sort={sort}
        onSort={setSort}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <section className="mc-title-screen overflow-hidden border-4 border-black p-5 sm:p-7 lg:p-9">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 bg-[#f7e26b] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#3d2a00] rotate-[-2deg] mc-splash">
                Now with NodeGet servers!
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-[0.04em] mc-title text-white">
                {config.user_preferences.site_name || 'NodeGet Craft Status'}
              </h1>
              <div className="grid max-w-xl gap-2 sm:grid-cols-2">
                <MenuButton>Multiplayer</MenuButton>
                <MenuButton>Server List</MenuButton>
                <MenuButton>Resource Pack</MenuButton>
                <MenuButton>Options</MenuButton>
              </div>
              <InventoryBar active={view === 'cards' ? 0 : view === 'table' ? 1 : 2} />
            </div>

            <div className="min-w-full space-y-3 lg:min-w-[28rem]">
              <MinecraftHud health={Math.min(10, Math.max(1, onlineCount || 1))} hunger={Math.min(10, Math.max(1, totalCount || 1))} armor={Math.min(10, regions.list.length + 3)} />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <HeroStat label="在线区块" value={String(onlineCount)} tone="primary" />
                <HeroStat label="离线区块" value={String(Math.max(offlineCount, 0))} tone="destructive" />
                <HeroStat label="区域传送门" value={String(regions.list.length)} />
                <HeroStat label="标签生物群系" value={String(allTags.length)} />
              </div>
              <div className="flex justify-end gap-2">
                <GrassBlock />
                <OreBlock ore="diamond" />
                <OreBlock ore="redstone" />
                <OreBlock ore="gold" />
              </div>
            </div>
          </div>
        </section>

        {!empty && (
          <RegionFilter
            regions={regions.list}
            total={regions.total}
            active={activeRegion}
            onChange={setActiveRegion}
          />
        )}
        {!empty && <TagFilter tags={allTags} active={activeTag} onChange={setActiveTag} />}

        {empty && !hasErrors && (
          <div className="py-24 flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm">连接后端中…</span>
          </div>
        )}

        {empty && hasErrors && (
          <div className="py-20 text-center text-muted-foreground">暂无节点</div>
        )}

        {!empty && view === 'cards' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {list.map(n => (
              <NodeCard key={n.uuid} node={n} />
            ))}
          </div>
        )}
        {!empty && view === 'table' && <NodeTable nodes={list} onOpen={setSelected} />}
        {!empty && view === 'map' && (
          <Suspense
            fallback={
              <div className="py-24 flex items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> 加载地图中…
              </div>
            }
          >
            <WorldMap nodes={list} onOpen={setSelected} />
          </Suspense>
        )}

        {hasErrors && (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{errors.length} 个后端错误</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                {errors.map((e, i) => (
                  <li key={i}>
                    <b>{e.source}</b>：
                    {e.error instanceof Error ? e.error.message : String(e.error)}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </main>

      <Footer text={config.user_preferences.footer} repo={config.repository} dist_page={config.dist_page}/>

      <NodeDetail
        node={selectedNode}
        onClose={() => setSelected(null)}
        showSource={(config.site_tokens?.length ?? 0) > 1}
        pool={pool}
      />
    </div>
  )
}

function HeroStat({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: 'primary' | 'destructive'
}) {
  return (
    <div
      className={`mc-stat p-3 sm:p-4 ${
        tone === 'primary'
          ? 'bg-primary/15'
          : tone === 'destructive'
            ? 'bg-destructive/15'
            : ''
      }`}
    >
      <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl sm:text-3xl font-black mc-title">{value}</div>
    </div>
  )
}
