"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useActiveAccount, ConnectButton } from "thirdweb/react"
import { useRouter } from "next/navigation"
import { client } from "@/lib/web3/thirdweb-client"
import { createWallet } from "thirdweb/wallets"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
]

interface SubmitButtonProps {
  dappDay: number
  variant?: "card" | "button"
}

export function SubmitButton({ dappDay, variant = "button" }: SubmitButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    demo_url: "",
    github_url: "",
    image_url: "",
  })
  const account = useActiveAccount()
  const router = useRouter()
  const supabase = createClient()
  const connectButtonRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!account) {
      const connectBtn = connectButtonRef.current?.querySelector("button")
      if (connectBtn) {
        connectBtn.click()
      }
      return
    }

    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        const connectBtn = connectButtonRef.current?.querySelector("button")
        if (connectBtn) {
          connectBtn.click()
        }
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          day: dappDay,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit")
      }

      // Reset form and close dialog
      setFormData({
        title: "",
        description: "",
        demo_url: "",
        github_url: "",
        image_url: "",
      })
      setIsOpen(false)
      router.refresh()
      alert("Submission successful! 🎉")
    } catch (error) {
      console.error("[v0] Submission error:", error)
      alert(error instanceof Error ? error.message : "Failed to submit. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div ref={connectButtonRef} className="hidden">
        <ConnectButton client={client} wallets={wallets} theme="dark" />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {variant === "card" ? (
            <Button
              disabled={isLoading}
              size="lg"
              className="w-full gap-2 bg-gradient-to-r from-neon-purple to-neon-orange text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Upload className="h-5 w-5" />
              Submit Your DApp
            </Button>
          ) : (
            <Button
              disabled={isLoading}
              size="lg"
              className="gap-2 bg-gradient-to-r from-neon-purple to-neon-orange text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Upload className="h-5 w-5" />
              Submit DApp
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="glass-card border-primary/30 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-text">Submit Your DApp</DialogTitle>
            <DialogDescription>
              Share your Dapptober Day {dappDay} creation with the community. All fields are required except the image
              URL.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                placeholder="My Awesome DApp"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="glass-card border-primary/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your DApp, its features, and what makes it special..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="glass-card border-primary/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demo_url">Demo URL *</Label>
              <Input
                id="demo_url"
                type="url"
                placeholder="https://my-dapp.vercel.app"
                value={formData.demo_url}
                onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                required
                className="glass-card border-primary/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub URL *</Label>
              <Input
                id="github_url"
                type="url"
                placeholder="https://github.com/username/repo"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                required
                className="glass-card border-primary/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Screenshot/Image URL (optional)</Label>
              <Input
                id="image_url"
                type="url"
                placeholder="https://example.com/screenshot.png"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="glass-card border-primary/30"
              />
              <p className="text-xs text-muted-foreground">
                Provide a screenshot or preview image of your DApp (recommended)
              </p>
            </div>

            {!account && (
              <p className="text-sm text-muted-foreground text-center py-2">Connect your wallet to submit your DApp</p>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1 border-primary/30"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-neon-purple to-neon-orange text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit DApp"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
