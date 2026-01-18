
'use client'
import { useEffect, useRef, useState } from 'react'

const APPS = {
  DramaBox: '/dramabox/latest',
  FlickReels: '/flickreels/latest'
}

export default function Page() {
  const [tab, setTab] = useState('DramaBox')
  const [list, setList] = useState([])
  const [current, setCurrent] = useState(null)
  const videoRef = useRef(null)

  useEffect(() => {
    fetch(`/api/proxy?path=${APPS[tab]}`)
      .then(r => r.json())
      .then(j => setList(j.data || []))
  }, [tab])

  useEffect(() => {
    if (videoRef.current && current) {
      const t = localStorage.getItem('resume_' + current.id)
      if (t) videoRef.current.currentTime = Number(t)
    }
  }, [current])

  function saveTime() {
    if (videoRef.current && current) {
      localStorage.setItem('resume_' + current.id, videoRef.current.currentTime)
    }
  }

  return (
    <div className="p-3 space-y-3">
      <div className="flex gap-2">
        {Object.keys(APPS).map(k => (
          <button key={k} onClick={() => setTab(k)}
            className={\`px-3 py-1 rounded \${tab===k?'bg-red-600':'bg-zinc-700'}\`}>
            {k}
          </button>
        ))}
      </div>

      {current && (
        <video
          ref={videoRef}
          src={current.stream_url + '?quality=480'}
          controls
          autoPlay
          onTimeUpdate={saveTime}
          className="w-full rounded-xl"
        />
      )}

      <div className="grid grid-cols-2 gap-2">
        {list.map(i => (
          <button key={i.id} onClick={() => setCurrent(i)}
            className="bg-zinc-800 p-2 rounded">
            <img src={i.poster} className="rounded mb-1"/>
            <div className="text-sm">{i.title}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
