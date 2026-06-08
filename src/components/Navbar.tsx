import { useEffect, useRef, useState } from 'react'
import { Search as SearchIcon, X } from 'lucide-react'
import { Search } from './Search'
import { ViewToggle } from './ViewToggle'
import { ThemeToggle } from './ThemeToggle'
import { SortMenu } from './SortMenu'
import { Button } from './ui/button'
import type { Sort, View } from '../types'

interface Props {
  siteName: string
  logo?: string
  query: string
  onQuery: (v: string) => void
  view: View
  onView: (v: View) => void
  sort: Sort
  onSort: (v: Sort) => void
}

export function Navbar({ siteName, logo, query, onQuery, view, onView, sort, onSort }: Props) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [stuck, setStuck] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    const onScroll = () => {
      const h = headerRef.current?.offsetHeight ?? 60
      setStuck(window.scrollY > h)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      ref={headerRef}
        className={`sticky top-0 z-10 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-200 ${
          stuck
            ? 'border-b-2 border-border bg-background/90 backdrop-blur mc-panel'
            : 'border-b-2 border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 px-4 sm:px-6 py-3">
        <a
          href="./"
          className="flex items-center gap-3 min-w-0 shrink-0 hover:opacity-90 transition-opacity"
        >
          {logo && <img src={logo} alt="" className="w-8 h-8 shrink-0 border-2 border-border object-cover" />}
          <div className="min-w-0">
            <div className="font-bold tracking-wide truncate mc-title">{siteName}</div>
            <div className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Overworld Status Board
            </div>
          </div>
        </a>
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <div className="hidden sm:block">
            <Search value={query} onChange={onQuery} />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="sm:hidden"
            onClick={() => setSearchOpen(o => !o)}
            aria-label={searchOpen ? '关闭搜索' : '搜索'}
          >
            {searchOpen ? <X className="h-4 w-4" /> : <SearchIcon className="h-4 w-4" />}
          </Button>
          <SortMenu value={sort} onChange={onSort} />
          <ViewToggle value={view} onChange={onView} />
          <ThemeToggle />
        </div>
      </div>

      <div
        aria-hidden={!searchOpen}
        className={`sm:hidden overflow-hidden transition-all duration-150 ease-out ${
          searchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-1 pb-3">
          <Search ref={inputRef} value={query} onChange={onQuery} className="w-full" />
        </div>
      </div>
    </header>
  )
}
