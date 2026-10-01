"use client"

import { useRef, useState, type DragEvent, type FormEvent, type PointerEvent } from "react"
import { useRouter } from "next/navigation"
import { useActiveAccount } from "thirdweb/react"
import { updateSubmission, uploadSubmissionImage } from "@/app/actions/submissions"
import { formatBannerPosition, parseBannerPosition, type BannerFocus } from "@/lib/community/banner-position"
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
  bannerPosition: string | null
}

const MAX_COVER_BYTES = 5 * 1024 * 1024
const CENTER: BannerFocus = { x: 50, y: 50 }

function isCoverFile(file: File) {
  if (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/webp" || file.type === "image/gif") {
    return true
  }
  return /\.(png|jpe?g|webp|gif)$/i.test(file.name)
}

function clamp(value: number) {
  return Math.min(100, Math.max(0, value))
}

export function SubmissionEditor({
  submissionId,
  ownerWallet,
  title,
  description,
  demoUrl,
  githubUrl,
  imageUrl,
  bannerPosition,
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
  const [preview, setPreview] = useState<string | null>(null)
  const [fileOver, setFileOver] = useState(false)
  const [focus, setFocus] = useState<BannerFocus>(() => parseBannerPosition(bannerPosition))
  const frameRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const focusRef = useRef(focus)
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    originX: number
    originY: number
  } | null>(null)

  const isOwner = account?.address.toLowerCase() === ownerWallet.toLowerCase()
  if (!isOwner) return null

  const coverIsImage = isDisplayableImageUrl(fields.imageUrl || imageUrl)
  const shownCover = preview || (coverIsImage ? fields.imageUrl || imageUrl : null)
  const objectPosition = formatBannerPosition(focus)

  const rememberFocus = (next: BannerFocus) => {
    focusRef.current = next
    setFocus(next)
  }

  const saveBuild = async (nextImage: string | null, nextFocus: BannerFocus) => {
    if (!account) return
    const saved = await updateSubmission(submissionId, account.address, {
      title: fields.title,
      description: fields.description,
      demo_url: fields.demoUrl,
      github_url: fields.githubUrl,
      image_url: nextImage,
      banner_position: formatBannerPosition(nextFocus),
    })
    if (!saved.success) throw new Error(saved.error)
    router.refresh()
  }

  const uploadCover = async (file: File | null) => {
    if (!file || !account) return
    if (!isCoverFile(file)) {
      setError("Use a PNG, JPG, WEBP, or GIF.")
      return
    }
    if (file.size > MAX_COVER_BYTES) {
      setError("Image must be 5 MB or smaller.")
      return
    }

    setError(null)
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current)
      return URL.createObjectURL(file)
    })
    rememberFocus(CENTER)
    setPending(true)
    try {
      const body = new FormData()
      body.set("file", file)
      const uploaded = await uploadSubmissionImage(body)
      if (!uploaded.success) throw new Error(uploaded.error)
      await saveBuild(uploaded.url, CENTER)
      setFields((current) => ({ ...current, imageUrl: uploaded.url }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload that photo")
    } finally {
      setPending(false)
    }
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setFileOver(false)
    void uploadCover(event.dataTransfer.files?.[0] ?? null)
  }

  const onPointerDown = (event: PointerEvent<HTMLImageElement>) => {
    if (!shownCover || pending) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: focusRef.current.x,
      originY: focusRef.current.y,
    }
  }

  const onPointerMove = (event: PointerEvent<HTMLImageElement>) => {
    const drag = dragRef.current
    const frame = frameRef.current
    const image = imageRef.current
    if (!drag || drag.pointerId !== event.pointerId || !frame || !image) return
    if (!image.naturalWidth || !image.naturalHeight) return

    const frameW = frame.clientWidth
    const frameH = frame.clientHeight
    const scale = Math.max(frameW / image.naturalWidth, frameH / image.naturalHeight)
    const extraX = image.naturalWidth * scale - frameW
    const extraY = image.naturalHeight * scale - frameH
    const nextX = extraX > 1 ? clamp(drag.originX - ((event.clientX - drag.startX) / extraX) * 100) : drag.originX
    const nextY = extraY > 1 ? clamp(drag.originY - ((event.clientY - drag.startY) / extraY) * 100) : drag.originY
    rememberFocus({ x: nextX, y: nextY })
  }

  const onPointerUp = async (event: PointerEvent<HTMLImageElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId || !account) return
    dragRef.current = null
    const next = focusRef.current
    if (Math.abs(next.x - drag.originX) < 0.4 && Math.abs(next.y - drag.originY) < 0.4) return
    setError(null)
    try {
      await saveBuild(fields.imageUrl.trim() || null, next)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the banner position")
    }
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!account) return
    setPending(true)
    setError(null)
    try {
      const nextImage = fields.imageUrl.trim() || null
      await saveBuild(nextImage, focusRef.current)
      setPreview((current) => {
        if (current) URL.revokeObjectURL(current)
        return null
      })
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this build")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="space-y-3 border border-primary/30 bg-[oklch(0.175_0.014_55)] p-6">
      {!coverIsImage ? (
        <p className="text-xs text-copper-dim">
          This build has no banner image. An X post or page link will not show in the frame.
        </p>
      ) : null}
      <Button type="button" className="term-btn h-10" onClick={() => setOpen((value) => !value)}>
        {open ? "Close editor" : "Edit this build"}
      </Button>
      {open ? (
        <form onSubmit={onSubmit} className="space-y-4 border border-primary/30 p-4">
          <div className="space-y-2">
            <p className="text-sm text-white">{shownCover ? "Banner image" : "Upload Banner Image"}</p>
            <div
              ref={frameRef}
              onDragOver={(event) => {
                event.preventDefault()
                setFileOver(true)
              }}
              onDragLeave={() => setFileOver(false)}
              onDrop={onDrop}
              className={`relative h-40 w-full border bg-[oklch(0.16_0.014_55)] text-sm text-copper-bright md:h-48 ${fileOver ? "border-copper-bright" : "border-primary/40"}`}
            >
              {shownCover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  ref={imageRef}
                  src={shownCover}
                  alt=""
                  draggable={false}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={(event) => {
                    void onPointerUp(event)
                  }}
                  onPointerCancel={() => {
                    dragRef.current = null
                  }}
                  style={{ objectPosition }}
                  className="h-full w-full cursor-grab touch-none object-cover active:cursor-grabbing"
                />
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif"
                    aria-label="Upload Banner Image"
                    disabled={pending}
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-wait"
                    onChange={(event) => {
                      void uploadCover(event.target.files?.[0] ?? null)
                      event.target.value = ""
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span>{pending ? "Uploading banner…" : "Upload Banner Image"}</span>
                  </div>
                </>
              )}
              {shownCover && pending ? (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50">
                  <span>Uploading banner…</span>
                </div>
              ) : null}
            </div>
            {shownCover ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-copper-dim">Drag the photo to line it up.</p>
                <label className="term-btn relative inline-flex h-10 cursor-pointer px-3">
                  Replace banner
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif"
                    aria-label="Replace banner"
                    disabled={pending}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={(event) => {
                      void uploadCover(event.target.files?.[0] ?? null)
                      event.target.value = ""
                    }}
                  />
                </label>
              </div>
            ) : null}
          </div>
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
            <Label htmlFor="edit-image-url" className="text-white">Or paste an image URL</Label>
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
