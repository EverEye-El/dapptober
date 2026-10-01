"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useActiveAccount } from "thirdweb/react"
import { updateSubmission, uploadSubmissionImage } from "@/app/actions/submissions"
import { isDisplayableImageUrl } from "@/lib/community/image-url"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface SubmissionEditorProps {
  submissionId: string
  ownerWallet: string
  title: string
  description: string
  demoUrl: string
  githubUrl: string | null
  imageUrl: string | null
}

export function SubmissionEditor({
  submissionId,
  ownerWallet,
  title,
  description,
  demoUrl,
  githubUrl,
  imageUrl,
}: SubmissionEditorProps) {
  const account = useActiveAccount()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fields, setFields] = useState({
    title,
    description,
    demoUrl,
    githubUrl: githubUrl ?? "",
    imageUrl: imageUrl ?? "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  const isOwner = account?.address.toLowerCase() === ownerWallet.toLowerCase()
  if (!isOwner) return null

  const coverIsImage = isDisplayableImageUrl(imageUrl)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!account) return
    setPending(true)
    setError(null)
    try {
      let nextImage: string | null = fields.imageUrl.trim() || null
      if (imageFile) {
        const body = new FormData()
        body.set("file", imageFile)
        const uploaded = await uploadSubmissionImage(body)
        if (!uploaded.success) throw new Error(uploaded.error)
        nextImage = uploaded.url
      }
      const saved = await updateSubmission(submissionId, account.address, {
        title: fields.title,
        description: fields.description,
        demo_url: fields.demoUrl,
        github_url: fields.githubUrl,
        image_url: nextImage,
      })
      if (!saved.success) throw new Error(saved.error)
      setOpen(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this build")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="space-y-3">
      {!coverIsImage ? (
        <p className="text-xs text-copper-dim">
          This build has no cover image file. An X post or page link will not show in the frame. Upload a PNG, JPG, WEBP, or GIF.
        </p>
      ) : null}
      <Button type="button" className="term-btn h-10" onClick={() => setOpen((value) => !value)}>
        {open ? "Close editor" : "Edit this build"}
      </Button>
      {open ? (
        <form onSubmit={onSubmit} className="space-y-4 border border-primary/30 p-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title" className="text-white">Title</Label>
            <Input id="edit-title" required value={fields.title} onChange={(e) => setFields({ ...fields, title: e.target.value })} className="bg-slate-900/90 border-primary/50 text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description" className="text-white">Description</Label>
            <Textarea id="edit-description" required value={fields.description} onChange={(e) => setFields({ ...fields, description: e.target.value })} className="bg-slate-900/90 border-primary/50 text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-demo" className="text-white">Demo URL</Label>
            <Input id="edit-demo" required value={fields.demoUrl} onChange={(e) => setFields({ ...fields, demoUrl: e.target.value })} className="bg-slate-900/90 border-primary/50 text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-github" className="text-white">GitHub URL</Label>
            <Input id="edit-github" value={fields.githubUrl} onChange={(e) => setFields({ ...fields, githubUrl: e.target.value })} className="bg-slate-900/90 border-primary/50 text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-cover" className="text-white">Cover image</Label>
            <Input id="edit-cover" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="bg-slate-900/90 border-primary/50 text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-image-url" className="text-white">Image URL</Label>
            <Input id="edit-image-url" value={fields.imageUrl} onChange={(e) => setFields({ ...fields, imageUrl: e.target.value })} className="bg-slate-900/90 border-primary/50 text-white" />
          </div>
          {error ? <p className="text-sm text-orange-400">{error}</p> : null}
          <Button type="submit" disabled={pending} className="term-btn h-10">
            {pending ? "Saving…" : "Save build"}
          </Button>
        </form>
      ) : null}
    </div>
  )
}
