"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useActiveAccount } from "thirdweb/react"
import { useRouter } from "next/navigation"
import { ConnectModal } from "./connect-modal"
import { createPortal } from "react-dom"
import { submitDapp } from "@/app/actions/submissions"
import { ensureProfile } from "@/app/actions/profiles"

interface SubmitButtonProps {
  dappDay: number
  variant?: "card" | "button"
}

export function SubmitButton({ dappDay, variant = "button" }: SubmitButtonProps) {
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    demo_url: "",
    github_url: "",
    image_url: "",
  })
  const account = useActiveAccount()
  const router = useRouter()

  const handleClick = () => {
    console.log("[v0] Submit button clicked", { account: account?.address })

    if (!account) {
      console.log("[v0] No wallet connected, showing connect modal")
      setShowConnectModal(true)
      return
    }

    console.log("[v0] Opening submission form")
    setShowSubmitModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim() || !formData.description.trim() || !formData.demo_url.trim()) {
      setError("Please fill in all required fields")
      return
    }

    const normalizeUrl = (url: string) => {
      const trimmed = url.trim()
      if (!trimmed) return trimmed
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed
      }
      return `https://${trimmed}`
    }

    setIsSubmitting(true)

    try {
      if (!account) {
        setError("Please connect your wallet to submit")
        setShowConnectModal(true)
        setIsSubmitting(false)
        return
      }

      console.log("[v0] Ensuring profile for wallet:", account.address)
      const profile = await ensureProfile(account.address)

      if (!profile) {
        setError("Failed to create profile. Please try again.")
        setIsSubmitting(false)
        return
      }

      console.log("[v0] Submitting DApp for wallet:", account.address)

      const result = await submitDapp(dappDay, account.address, {
        title: formData.title,
        description: formData.description,
        demo_url: normalizeUrl(formData.demo_url),
        github_url: formData.github_url ? normalizeUrl(formData.github_url) : undefined,
        image_url: formData.image_url ? normalizeUrl(formData.image_url) : undefined,
      })

      if (!result.success) {
        setError(result.error || "Failed to submit DApp")
        setIsSubmitting(false)
        return
      }

      console.log("[v0] DApp submitted successfully:", result.data)

      setShowSuccess(true)
      setTimeout(() => {
        setShowSubmitModal(false)
        setShowSuccess(false)
        setFormData({
          title: "",
          description: "",
          demo_url: "",
          github_url: "",
          image_url: "",
        })
        router.refresh()
      }, 2000)
    } catch (err) {
      console.error("[v0] Submission error:", err)
      setError(err instanceof Error ? err.message : "Failed to submit DApp")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <ConnectModal isOpen={showConnectModal} onClose={() => setShowConnectModal(false)} />

      {variant === "card" ? (
        <Button
          onClick={handleClick}
          disabled={isSubmitting}
          size="lg"
          className="w-full gap-2 bg-gradient-to-r from-neon-purple to-neon-orange text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Upload className="h-5 w-5" />
          Submit Your DApp
        </Button>
      ) : (
        <Button
          onClick={handleClick}
          disabled={isSubmitting}
          size="lg"
          className="gap-2 bg-gradient-to-r from-neon-purple to-neon-orange text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Upload className="h-5 w-5" />
          Submit DApp
        </Button>
      )}

      {showSubmitModal &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSubmitModal(false)} />

            <div className="relative w-full max-w-2xl animate-in zoom-in-95 duration-200">
              <div className="glass-modal rounded-2xl p-8 space-y-6 relative overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-neon-orange/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-neon-purple/20 rounded-full blur-3xl" />

                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold gradient-text">Submit Your DApp</h2>
                    <p className="text-gray-300 text-sm">Share your Day {dappDay} creation with the community</p>
                  </div>

                  {showSuccess ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <CheckCircle2 className="w-16 h-16 text-green-400" />
                      <h3 className="text-xl font-bold text-white">Submission Successful!</h3>
                      <p className="text-gray-300 text-center">Your DApp has been submitted and will appear shortly.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-white">
                          Title <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="My Awesome DApp"
                          maxLength={140}
                          className="bg-slate-900/90 border-primary/50 text-white placeholder:text-gray-400"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-white">
                          Description <span className="text-red-400">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Describe your DApp and what makes it special..."
                          className="min-h-[100px] bg-slate-900/90 border-primary/50 text-white placeholder:text-gray-400"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="demo_url" className="text-white">
                          Demo URL <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="demo_url"
                          type="url"
                          value={formData.demo_url}
                          onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                          placeholder="https://my-dapp.vercel.app"
                          className="bg-slate-900/90 border-primary/50 text-white placeholder:text-gray-400"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="github_url" className="text-white">
                          GitHub URL
                        </Label>
                        <Input
                          id="github_url"
                          type="url"
                          value={formData.github_url}
                          onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                          placeholder="https://github.com/username/repo"
                          className="bg-slate-900/90 border-primary/50 text-white placeholder:text-gray-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="image_url" className="text-white">
                          Image URL
                        </Label>
                        <Input
                          id="image_url"
                          type="url"
                          value={formData.image_url}
                          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          placeholder="https://example.com/screenshot.png"
                          className="bg-slate-900/90 border-primary/50 text-white placeholder:text-gray-400"
                        />
                        <p className="text-xs text-gray-400">
                          Use a direct image URL (ending in .png, .jpg, .gif, etc.)
                        </p>
                      </div>

                      {error && (
                        <div className="flex items-center gap-2 text-orange-400 p-3 rounded-lg bg-orange-400/10 border border-orange-400/20">
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm">{error}</span>
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowSubmitModal(false)}
                          className="flex-1 border-primary/30 text-white hover:bg-white/10"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-gradient-to-r from-neon-purple to-neon-orange text-white font-semibold hover:opacity-90"
                        >
                          {isSubmitting ? "Submitting..." : "Submit DApp"}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
