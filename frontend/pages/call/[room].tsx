import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useSocket } from '../../components/SocketProvider'

export default function CallRoom() {
  const router = useRouter()
  const { room } = router.query
  const { socket } = useSocket()
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const localRef = useRef<HTMLVideoElement | null>(null)
  const remoteRef = useRef<HTMLVideoElement | null>(null)
  const [joined, setJoined] = useState(false)

  useEffect(() => {
    if (!socket || !room) return

    const pc = new RTCPeerConnection()
    pcRef.current = pc

    pc.onicecandidate = (e) => {
      if (e.candidate) socket.emit('call:ice', { room, candidate: e.candidate })
    }

    pc.ontrack = (e) => {
      if (remoteRef.current) remoteRef.current.srcObject = e.streams[0]
    }

    socket.on('call:offer', async (data: any) => {
      await pc.setRemoteDescription(new RTCSessionDescription(data.offer))
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      socket.emit('call:answer', { room, answer })
    })

    socket.on('call:answer', async (data: any) => {
      await pc.setRemoteDescription(new RTCSessionDescription(data.answer))
    })

    socket.on('call:ice', async (data: any) => {
      try {
        await pc.addIceCandidate(data.candidate)
      } catch (e) {
        console.warn('ice add failed', e)
      }
    })

    return () => {
      socket.off('call:offer')
      socket.off('call:answer')
      socket.off('call:ice')
      pc.close()
    }
  }, [socket, room])

  async function startCall() {
    if (!pcRef.current) return
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    if (localRef.current) localRef.current.srcObject = stream
    stream.getTracks().forEach((t) => pcRef.current?.addTrack(t, stream))
    const offer = await pcRef.current.createOffer()
    await pcRef.current.setLocalDescription(offer)
    socket?.emit('call:offer', { room, offer })
    setJoined(true)
  }

  return (
    <div className="min-h-screen bg-dark-surface p-8 flex flex-col items-center">
      <div className="max-w-6xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h1 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            Secure Session: <span className="text-neon-accent">{room}</span>
          </h1>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
            Ecosystem Sync Active
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-950">
          <div className="relative group">
            <video ref={localRef} autoPlay muted className="w-full aspect-video bg-slate-900 rounded-2xl object-cover border border-slate-800 group-hover:border-neon-accent transition-all shadow-inner" />
            <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
              Local Feed (You)
            </div>
          </div>
          <div className="relative group">
            <video ref={remoteRef} autoPlay className="w-full aspect-video bg-slate-900 rounded-2xl object-cover border border-slate-800 group-hover:border-neon-accent transition-all shadow-inner" />
            <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
              Remote Peer
            </div>
          </div>
        </div>

        <div className="p-8 flex justify-center items-center gap-6 bg-slate-900/50">
          {!joined ? (
            <button
              onClick={startCall}
              className="px-12 py-4 bg-neon-accent text-dark-surface font-black rounded-2xl hover:bg-neon-accent-hover transition-all shadow-neon uppercase tracking-widest text-sm"
            >
              Initialize Connection
            </button>
          ) : (
            <div className="flex gap-4">
               <button className="p-4 bg-slate-800 rounded-full text-white hover:bg-slate-700 transition-all border border-slate-700">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                 </svg>
               </button>
               <button className="p-4 bg-slate-800 rounded-full text-white hover:bg-slate-700 transition-all border border-slate-700">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                 </svg>
               </button>
               <button
                 onClick={() => window.location.href = '/dashboard'}
                 className="px-8 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 uppercase tracking-widest text-sm"
               >
                 Terminate Session
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
