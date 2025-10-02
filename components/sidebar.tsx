"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Wallet, FileText, Send, Info } from "lucide-react"

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    { href: "#prompts", label: "Prompts", icon: FileText, active: true },
    { href: "#submissions", label: "Submissions", icon: Send, active: false },
    { href: "#about", label: "About", icon: Info, active: false },
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
            <div className="flex items-center justify-between">
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
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <a
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
              </a>
            ))}
          </nav>

          {/* Footer with Connect Wallet and Toggle */}
          <div className="p-4 border-t border-primary/20 space-y-3">
            <Button
              className={`w-full bg-primary hover:bg-primary/90 transition-all neon-glow-orange hover:neon-glow-purple ${
                isCollapsed ? "px-2" : ""
              }`}
              size={isCollapsed ? "icon" : "default"}
              aria-label="Connect Wallet"
            >
              <Wallet className="w-5 h-5" aria-hidden="true" />
              {!isCollapsed && <span className="ml-2">Connect Wallet</span>}
            </Button>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`w-full h-8 rounded-lg bg-[oklch(0.55_0.25_300)] hover:bg-[oklch(0.6_0.25_300)] text-white flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background neon-glow-orange ${
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
