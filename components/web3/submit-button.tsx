"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useActiveAccount } from "thirdweb/react"
import { useRouter } from "next/navigation"
import { ComingSoonModal } from "./coming-soon-modal"
import { ConnectModal } from "./connect-modal"

interface SubmitButtonProps {
  dappDay: number
  variant?: "card" | "button"
}

export function SubmitButton({ dappDay, variant = "button" }: SubmitButtonProps) {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)
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

  const handleClick = () => {
    console.log("[v0] Submit button clicked", { account: account?.address })

    if (!account) {
      console.log("[v0] No wallet connected, showing connect modal")
      setShowConnectModal(true)
      return
    }

    console.log("[v0] Showing coming soon modal for submissions")
    setShowComingSoonModal(true)
  }

  return (
    <div>
      <ConnectModal isOpen={showConnectModal} onClose={() => setShowConnectModal(false)} />

      <ComingSoonModal
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
        feature="submissions"
      />

      {variant === "card" ? (
        <Button
          onClick={handleClick}
          disabled={isLoading}
          size="lg"
          className="w-full gap-2 bg-gradient-to-r from-neon-purple to-neon-orange text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Upload className="h-5 w-5" />
          Submit Your DApp
        </Button>
      ) : (
        <Button
          onClick={handleClick}
          disabled={isLoading}
          size="lg"
          className="gap-2 bg-gradient-to-r from-neon-purple to-neon-orange text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Upload className="h-5 w-5" />
          Submit DApp
        </Button>
      )}
    </div>
  )
}
