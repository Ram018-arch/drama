
import { NextResponse } from 'next/server'

const API = 'https://api.sansekai.my.id/api'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path')
  if (!path) return NextResponse.json({ error: 'No path' }, { status: 400 })

  const res = await fetch(API + path, { cache: 'no-store' })
  const data = await res.text()

  return new NextResponse(data, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('content-type') }
  })
}
