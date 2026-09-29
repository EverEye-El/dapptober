"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Sparkles, Grid3x3, Info, ScrollText, User, Menu, X } from "lucide-react"
import { WalletConnectButton } from "@/components/web3/wallet-connect-button"
import Link from "next/link"
import { useActiveAccount } from "thirdweb/react"
import { DAPPTOBER_YEAR } from "@/lib/dapp-prompts"

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const account = useActiveAccount()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCollapsed(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

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
    ...(account?.address
      ? [
          {
            href: `/profile/${account.address}`,
            label: "Profile",
            icon: User,
            active: false,
          },
        ]
      : []),
    { href: "/showcase", label: "Showcase", icon: Grid3x3, active: false },
    { href: "/rules", label: "Rules", icon: ScrollText, active: false },
    { href: "/about", label: "About", icon: Info, active: false },
  ]

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 glass-card border-b border-primary/20">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <span className="text-lg font-bold tracking-tight gradient-text">DAPPTOBER</span>
            <span className="ml-2 text-xs text-white/70">{DAPPTOBER_YEAR}</span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-neon-orange"
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
        className={`fixed left-0 top-0 h-dvh glass-card border-r border-primary/20 z-50 transition-all duration-300 ease-in-out w-64 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 ${isCollapsed ? "md:w-20" : "md:w-64"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-primary/20 flex items-center gap-2">
            <Link
              href="/"
              onClick={closeMobile}
              className="flex-1 flex items-center justify-between hover:opacity-80 transition-opacity"
            >
              {showLabels ? (
                <div className="flex-1">
                  <h1 className="text-xl font-bold tracking-tight gradient-text">DAPPTOBER</h1>
                  <p className="text-xs text-white/70 mt-1">{DAPPTOBER_YEAR} · AI Agents x Crypto</p>
                </div>
              ) : (
                <div className="w-full flex justify-center">
                  <span className="text-xl font-bold gradient-text">D</span>
                </div>
              )}
            </Link>
            <button
              onClick={closeMobile}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-neon-orange"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  item.active
                    ? "bg-primary/10 text-white border border-primary/30 neon-glow-orange"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                } ${showLabels ? "" : "justify-center"}`}
                aria-current={item.active ? "page" : undefined}
                title={showLabels ? undefined : item.label}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                {showLabels && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-primary/20 flex flex-col gap-4">
            <WalletConnectButton isCollapsed={!showLabels} />

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`hidden md:flex w-full h-8 rounded-lg bg-primary/80 hover:bg-primary text-white items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-neon-orange neon-glow-orange border border-primary/50 ${
                isCollapsed ? "px-2" : ""
              }`}
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
    </>
  )
}
