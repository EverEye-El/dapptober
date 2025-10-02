"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, FileText, Send, Info } from "lucide-react"
import { WalletConnectButton } from "@/components/web3/wallet-connect-button"
import Link from "next/link"

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCollapsed(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const navItems = [
    { href: "/#prompts", label: "Prompts", icon: FileText, active: true },
    { href: "/#submissions", label: "Submissions", icon: Send, active: false },
    { href: "/#about", label: "About", icon: Info, active: false },
  ]

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen glass-card border-r border-primary/20 z-50 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-primary/20">
            <Link href="/" className="flex items-center justify-between hover:opacity-80 transition-opacity">
              {!isCollapsed && (
                <div className="flex-1">
                  <h1 className="text-xl font-bold tracking-tight gradient-text">DAPPTOBER</h1>
                  <p className="text-xs text-white/70 mt-1">Vibe-Coded Web3</p>
                </div>
              )}
              {isCollapsed && (
                <div className="w-full flex justify-center">
                  <span className="text-xl font-bold gradient-text">D</span>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  item.active
                    ? "bg-primary/10 text-white border border-primary/30 neon-glow-orange"
                    : "text-white/70 hover:text-white hover:bg-secondary/50"
                } ${isCollapsed ? "justify-center" : ""}`}
                aria-current={item.active ? "page" : undefined}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-primary/20 flex flex-col gap-4">
            <WalletConnectButton isCollapsed={isCollapsed} />

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`w-full h-8 rounded-lg bg-primary/80 hover:bg-primary text-white flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-neon-orange neon-glow-orange border border-primary/50 ${
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

      {/* Spacer to prevent content from going under sidebar */}
      <div className={`transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`} />
    </>
  )
}
