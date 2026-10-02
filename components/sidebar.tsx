"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Sparkles, Info, ScrollText, Trophy, User, Menu, X } from "lucide-react"
import { WalletConnectButton } from "@/components/web3/wallet-connect-button"
import { ConnectModal } from "@/components/web3/connect-modal"
import Link from "next/link"
import { useActiveAccount } from "thirdweb/react"
import { DAPPTOBER_YEAR } from "@/lib/dapp-prompts"
import { RAIL_MARK } from "@/lib/ascii"
import { SiteSearch } from "@/components/search/site-search"
import type { ReactNode } from "react"

function RailTip({ label, enabled, children }: { label: string; enabled: boolean; children: ReactNode }) {
  if (!enabled) return children
  return (
    <div className="group/tip relative">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap border border-copper/50 bg-[oklch(0.14_0.012_55)] px-2 py-1 font-mono text-[10px] tracking-[0.16em] uppercase text-copper-bright opacity-0 shadow-[0_0_16px_oklch(0.78_0.11_62/0.2)] transition-opacity group-hover/tip:opacity-100 group-focus-within/tip:opacity-100"
      >
        <span className="mr-1.5 text-copper">&gt;</span>
        {label}
      </span>
    </div>
  )
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [showConnect, setShowConnect] = useState(false)
  const account = useActiveAccount()

  useEffect(() => {
    document.body.dataset.rail = isCollapsed ? "closed" : "open"
    return () => {
      document.body.dataset.rail = "closed"
    }
  }, [isCollapsed])

  useEffect(() => {
    if (!isMobileOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isMobileOpen])

  // The mobile drawer always shows labels; the desktop rail follows the collapse toggle.
  const showLabels = isMobileOpen || !isCollapsed
  const closeMobile = () => setIsMobileOpen(false)

  const navItems = [
    { href: "/", label: "Prompts", icon: Sparkles, active: false },
    { href: "/showcase", label: "Showcase", icon: Trophy, active: false },
    { href: "/rules", label: "Rules", icon: ScrollText, active: false },
    { href: "/about", label: "About", icon: Info, active: false },
  ]
  const prompts = navItems.slice(0, 1)
  const fromShowcase = navItems.slice(1)
  const itemClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 border border-transparent transition-all duration-200 group font-mono text-xs tracking-[0.14em] uppercase ${
      active
        ? "border-copper/50 text-copper-bright bg-copper/10"
        : "text-copper-dim hover:text-copper-bright hover:border-copper/40 hover:bg-copper/5"
    } ${showLabels ? "" : "justify-center"}`

  return (
    <>
      <ConnectModal isOpen={showConnect} onClose={() => setShowConnect(false)} />
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 border-b border-copper/30 bg-background/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="hover:opacity-80 transition-opacity font-mono">
            <span className="text-sm tracking-[0.2em] text-copper-bright">DAPPTOBER</span>
            <span className="ml-2 text-[11px] tracking-[0.16em] text-copper-dim">{DAPPTOBER_YEAR}</span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="term-btn inline-flex items-center justify-center w-10 h-10"
            aria-label="Open menu"
            aria-expanded={isMobileOpen}
            aria-controls="site-sidebar"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60" onClick={closeMobile} aria-hidden="true" />
      )}

      {/* Sidebar: slide-out drawer on mobile, fixed rail on md+ */}
      <aside
        id="site-sidebar"
        className={`fixed left-0 top-0 h-dvh border-r border-copper/30 term-rail backdrop-blur-md z-50 transition-all duration-300 ease-in-out w-64 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 ${isCollapsed ? "md:w-20" : "md:w-64"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-3 border-b border-copper/30 flex items-center gap-2">
            <Link
              href="/"
              onClick={closeMobile}
              className="flex-1 flex items-center justify-between hover:opacity-80 transition-opacity min-w-0"
            >
              {showLabels ? (
                <div className="flex-1 min-w-0">
                  <p className="text-sm tracking-[0.22em] text-copper-bright">DAPPTOBER</p>
                  <p className="text-[10px] tracking-[0.18em] uppercase text-copper-dim mt-1">
                    sys {DAPPTOBER_YEAR}
                  </p>
                </div>
              ) : (
                <div className="w-full flex justify-center">
                  <pre className="text-[10px] leading-none text-copper-bright">{RAIL_MARK}</pre>
                </div>
              )}
            </Link>
            <button
              onClick={closeMobile}
              className="term-btn inline-flex items-center justify-center md:hidden w-9 h-9"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2" role="navigation" aria-label="Main navigation">
            {prompts.map((item) => (
              <RailTip key={item.href} label={item.label} enabled={!showLabels}>
              <Link
                href={item.href}
                onClick={closeMobile}
                className={itemClass(item.active)}
                aria-current={item.active ? "page" : undefined}
                aria-label={item.label}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                {showLabels && (
                  <span>
                    <span className="text-copper mr-2">&gt;</span>
                    {item.label}
                  </span>
                )}
              </Link>
              </RailTip>
            ))}
            {account?.address ? (
              <RailTip label="Profile" enabled={!showLabels}>
              <Link
                href="/profile"
                onClick={closeMobile}
                className={itemClass(false)}
                aria-label="Profile"
              >
                <User className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                {showLabels ? (
                  <span>
                    <span className="text-copper mr-2">&gt;</span>
                    Profile
                  </span>
                ) : null}
              </Link>
              </RailTip>
            ) : (
              <RailTip label="Profile" enabled={!showLabels}>
              <button
                type="button"
                onClick={() => setShowConnect(true)}
                className={`w-full ${itemClass(false)}`}
                aria-label="Profile"
              >
                <User className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                {showLabels ? (
                  <span>
                    <span className="text-copper mr-2">&gt;</span>
                    Profile
                  </span>
                ) : null}
              </button>
              </RailTip>
            )}
            {fromShowcase.map((item) => (
              <RailTip key={item.href} label={item.label} enabled={!showLabels}>
              <Link
                href={item.href}
                onClick={closeMobile}
                className={itemClass(item.active)}
                aria-current={item.active ? "page" : undefined}
                aria-label={item.label}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                {showLabels && (
                  <span>
                    <span className="text-copper mr-2">&gt;</span>
                    {item.label}
                  </span>
                )}
              </Link>
              </RailTip>
            ))}
          </nav>

          <div className="px-4 pb-3 flex flex-col gap-3">
            <WalletConnectButton isCollapsed={!showLabels} />
          </div>

          <div className="p-4 border-t border-copper/30 flex flex-col gap-3">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`term-btn hidden md:flex w-full h-8 ${isCollapsed ? "px-2" : ""}`}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!isCollapsed}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span className="text-xs font-medium">Collapse</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
      <SiteSearch />
    </>
  )
}
