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
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-4 rounded shadow">
        <h1 className="text-xl font-semibold mb-3">Call: {room}</h1>
        <div className="grid grid-cols-2 gap-2">
          <video ref={localRef} autoPlay muted className="w-full h-64 bg-black" />
          <video ref={remoteRef} autoPlay className="w-full h-64 bg-black" />
        </div>
        <div className="mt-3">
          {!joined ? (
            <button onClick={startCall} className="px-3 py-2 bg-green-600 text-white rounded">Start / Join</button>
          ) : (
            <div>In call</div>
          )}
        </div>
      </div>
    </div>
  )
}
