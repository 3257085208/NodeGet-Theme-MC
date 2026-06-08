export function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-soft" aria-hidden>
      <div className="absolute inset-x-0 top-0 h-[38vh] bg-gradient-to-b from-sky-200/35 to-transparent dark:from-sky-950/30" />
      <div className="absolute inset-x-0 bottom-0 h-[32vh] bg-[linear-gradient(0deg,rgba(70,48,30,0.52),rgba(70,48,30,0.18)_38%,transparent)]" />
      <div className="absolute left-[6%] top-[14%] h-8 w-24 mc-inset bg-white/35 dark:bg-white/10" />
      <div className="absolute left-[14%] top-[18%] h-6 w-16 mc-inset bg-white/30 dark:bg-white/10" />
      <div className="absolute right-[10%] top-[12%] h-10 w-28 mc-inset bg-white/30 dark:bg-white/10" />
      <div className="absolute right-[18%] top-[17%] h-6 w-16 mc-inset bg-white/25 dark:bg-white/10" />
    </div>
  )
}
