import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete("thirdweb_auth_token")
  return response
}
