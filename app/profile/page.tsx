import { Sidebar } from "@/components/sidebar"
import { ProfileAccess } from "@/components/profile/profile-access"

export default function ProfileIndexPage() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="container mx-auto px-4 lg:px-8 py-8 max-w-7xl">
        <ProfileAccess />
      </div>
    </div>
  )
}
