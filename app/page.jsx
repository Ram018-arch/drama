// Next.js 14 App Router – Mobile-first Drama Streaming App
// FIXED: Webpack syntax error + valid JSX
// Uses API proxy to avoid CORS

'use client'

import { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'

const TABS = {
  DramaBox: '/dramabox/latest',
  FlickReels: '/flickreels/latest'
}

export default function Page() {
  const [tab, setTab] = useState('DramaBox')
  const [items, setItems] = useState([])
  const [current, setCurrent] = useState(null)
  const [error, setError] = useState(null)
  const videoRef = useRef(null)

  useEffect(() => {
    loadList()
  }, [tab])

  async function loadList() {
    try {
      setError(null)
      const res = await fetch(`/api/proxy?path=${TABS[tab]}`)
      if (!res.ok) throw new Error('Fetch failed')
      const json = await res.json()
      setItems(json.data || [])
    } catch (e) {
      console.error(e)
      setError('Gagal memuat data')
    }
  }

  // Resume play
  useEffect(() => {
    if (!videoRef.current || !current) return
    const t = localStorage.getItem('resume_' + current.id)
    if (t) videoRef.current.currentTime = Number(t)
  }, [current])

  function saveTime() {
    if (!videoRef.current || !current) return
    localStorage.setItem('resume_' + current.id, videoRef.current.currentTime)
  }

  return (
    <div className="min-h-screen bg-black text-white p-3">
      <h1 className="text-lg font-bold mb-3">Drama Streaming</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-3">
        {Object.keys(TABS).map(k => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={
              'px-3 py-1 rounded text-sm ' +
              (tab === k ? 'bg-red-600' : 'bg-zinc-700')
            }
          >
            {k}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-600 text-white p-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}

      {current && (
        <video
          ref={videoRef}
          src={current.stream_url + '?quality=480'}
          controls
          autoPlay
          playsInline
          onTimeUpdate={saveTime}
          className="w-full rounded-xl mb-4"
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrent(item)}
            className="bg-zinc-800 rounded-xl p-2 text-left"
          >
            <img
              src={item.poster}
              alt={item.title}
              className="rounded-lg mb-1"
            />
            <div className="text-sm font-semibold line-clamp-2">
              {item.title}
            </div>
            <div className="flex items-center gap-1 text-xs opacity-70 mt-1">
              <Play size={12} /> Play
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

/*
REQUIRED FILE:
app/api/proxy/route.js
------------------------------------------------
import { NextResponse } from 'next/server'

const API = 'https://api.sansekai.my.id/api'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path')

  if (!path) {
    return NextResponse.json({ error: 'Missing path' }, { status: 400 })
  }

  const res = await fetch(API + path, { cache: 'no-store' })
  const data = await res.text()

  return new NextResponse(data, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' }
  })
}
------------------------------------------------
*/
