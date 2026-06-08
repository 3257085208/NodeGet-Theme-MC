import { useEffect, useState } from 'react'
import { parseGitRepo } from "../utils/git"
import { HardDriveDownload, FolderSync } from 'lucide-react'


export function Footer({ text, repo, dist_page }: { text?: string, repo?: string, dist_page?: string }) {
  const [latest, setLatest] = useState<string | null>(null)

  const git = parseGitRepo(repo)
  const PKG_URL = `https://raw.githubusercontent.com/${git.user}/${git.repo}/main/package.json`

  useEffect(() => {
    fetch(PKG_URL)
      .then(r => (r.ok ? r.json() : null))
      .then(j => j?.version && setLatest(String(j.version)))
      .catch(() => { })
  }, [])

  const outdated = latest != null && latest !== __APP_VERSION__
  const laststDist = dist_page ? `${dist_page}/download.html?version=v${latest}` : repo + '/releases'

  return (
    <footer className="border-t-2 border-border bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-end gap-3 text-xs text-muted-foreground">
        <a href={repo} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors mr-auto">
          {text || 'Powered by NodeGet in the Overworld'}
        </a>
        <a href="download.html" target="_blank" rel="noreferrer" className="ml-2 flex items-center hover:text-primary transition-colors">
          <HardDriveDownload className='inline-block w-3 mr-1' />
          提取当前主题
        </a>
        {outdated && (
          <>
            <a href={laststDist} target="_blank" rel="noreferrer" className="flex items-center hover:text-primary transition-colors ml-2 text-destructive">
              <FolderSync className='inline-block w-3 mr-1' />
              升级到 v{latest}
            </a>
          </>
        )}
      </div>
    </footer>
  )
}
