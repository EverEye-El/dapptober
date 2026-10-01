"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useActiveAccount } from "thirdweb/react"
import { updateProfile, uploadProfileImage } from "@/app/actions/profiles"
import { isDisplayableImageUrl } from "@/lib/community/image-url"

function isAvatarUrl(url: string | null | undefined) {
  if (!url) return false
  if (isDisplayableImageUrl(url)) return true
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "https:") return false
    if (parsed.hostname === "api.dicebear.com") return true
    return /\.svg(\?.*)?$/i.test(parsed.pathname)
  } catch {
    return false
  }
}
import { Pencil, Check, X, User } from "lucide-react"

interface ProfileHeaderProps {
  profile: {
    wallet_address: string
    display_name: string | null
    bio: string | null
    avatar_url: string | null
  }
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const account = useActiveAccount()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(() => {
    const cleaned = profile.display_name?.replace("@wallet.local", "").trim() || ""
    const wallet = profile.wallet_address.replace("@wallet.local", "")
    if (!cleaned || cleaned.toLowerCase() === wallet.toLowerCase()) return ""
    return cleaned
  })
  const [bio, setBio] = useState(profile.bio || "")
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSaving, setIsSaving] = useState(false)

  const chooseImage = (file: File | null) => {
    if (file && !file.type.startsWith("image/")) {
      setError("Use a PNG, JPG, WEBP, or GIF.")
      return
    }
    setError(null)
    setImageFile(file)
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current)
      return file ? URL.createObjectURL(file) : null
    })
    if (file) setIsEditing(true)
  }

  const cleanWalletAddress = profile.wallet_address.replace("@wallet.local", "")
  const isOwnProfile = account?.address.toLowerCase() === cleanWalletAddress.toLowerCase()
  const readableName = (name: string | null | undefined) => {
    const cleaned = name?.replace("@wallet.local", "").trim() || ""
    if (!cleaned || cleaned.toLowerCase() === cleanWalletAddress.toLowerCase()) return ""
    return cleaned
  }

  const handleSave = async () => {
    if (!account) return

    setIsSaving(true)
    setError(null)
    let nextAvatar = avatarUrl.trim() || null
    if (imageFile) {
      const body = new FormData()
      body.set("file", imageFile)
      const uploaded = await uploadProfileImage(body)
      if (!uploaded.success) {
        setError(uploaded.error)
        setIsSaving(false)
        return
      }
      nextAvatar = uploaded.url
      setAvatarUrl(uploaded.url)
    }

    const result = await updateProfile(account.address, {
      display_name: displayName.trim() || null,
      bio: bio.trim() || null,
      ...(nextAvatar ? { avatar_url: nextAvatar } : {}),
    })

    if (result.success) {
      setImageFile(null)
      setPreview(null)
      setIsEditing(false)
      router.refresh()
    } else {
      setError(result.error || "Could not save profile")
    }
    setIsSaving(false)
  }

  const handleCancel = () => {
    setDisplayName(readableName(profile.display_name))
    setBio(profile.bio || "")
    setAvatarUrl(profile.avatar_url || "")
    setImageFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setError(null)
    setIsEditing(false)
  }

  const cleanDisplayName = readableName(profile.display_name)
  const shownAvatar = preview || (isAvatarUrl(avatarUrl) ? avatarUrl : null)
  const heading = cleanDisplayName || (isOwnProfile ? "Set a name" : "Builder")
  const canUpload = isOwnProfile && isEditing
  const photo = shownAvatar ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={shownAvatar} alt="" draggable={false} className="pointer-events-none h-full w-full object-cover" />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-copper-dim">
      <User className="h-12 w-12" aria-hidden="true" />
    </div>
  )

  return (
    <Card className="glass-card border-primary/30 p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-5 flex-1 min-w-0">
          {canUpload ? (
            <button
              type="button"
              aria-label="Upload profile photo"
              onClick={() => fileInputRef.current?.click()}
              className={`relative size-24 shrink-0 cursor-pointer overflow-hidden border p-0 bg-[oklch(0.16_0.014_55)] ${dragging ? "border-copper-bright" : "border-primary/40"}`}
              onDragOver={(event) => {
                event.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault()
                setDragging(false)
                chooseImage(event.dataTransfer.files?.[0] ?? null)
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="sr-only"
                onChange={(event) => chooseImage(event.target.files?.[0] ?? null)}
              />
              {photo}
            </button>
          ) : (
            <Link
              href={`/profile/${cleanWalletAddress}`}
              aria-label="View profile"
              className="relative size-24 shrink-0 overflow-hidden border border-primary/40 bg-[oklch(0.16_0.014_55)]"
            >
              {photo}
            </Link>
          )}
          <div className="flex flex-col justify-center gap-2 flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Display Name</label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                  className="bg-slate-900/90 border-primary/50 text-white"
                  maxLength={50}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Bio</label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="bg-slate-900/90 border-primary/50 text-white min-h-[100px]"
                  maxLength={500}
                />
              </div>
              {error ? <p className="text-sm text-orange-400">{error}</p> : null}
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="term-btn"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button onClick={handleCancel} variant="outline" className="border-primary/50 bg-transparent">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold gradient-text">{heading}</h1>
                <p className="text-sm text-copper-dim font-mono break-all">{cleanWalletAddress}</p>
              </div>

              {profile.bio && <p className="text-white leading-relaxed">{profile.bio}</p>}
            </>
          )}
          </div>
        </div>

        {isOwnProfile && !isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="border-primary/50">
            <Pencil className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>
    </Card>
  )
}
