import { notFound } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { ProfileAccess } from "@/components/profile/profile-access"

interface ProfilePageProps {
  params: Promise<{
    address: string
  }>
}

export default async function ProfilePage(props: ProfilePageProps) {
  const params = await props.params;
  const { address } = params

  if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="container mx-auto px-4 lg:px-8 py-8 max-w-7xl">
        <ProfileAccess address={address} />
      </div>
    </div>
  )
}
