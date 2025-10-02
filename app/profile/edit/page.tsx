import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/sidebar"
import { ProfileEditForm } from "@/components/profile/profile-edit-form"

export default async function EditProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/")
  }

  return (
    <div className="min-h-screen">
      <Sidebar />

      <div className="container mx-auto px-4 lg:px-8 py-8 max-w-3xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold gradient-text-main">Edit Profile</h1>
            <p className="text-muted-foreground">Update your profile information and social links.</p>
          </div>

          <ProfileEditForm profile={profile} />
        </div>
      </div>
    </div>
  )
}
