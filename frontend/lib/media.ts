import api from './api'

export type InitiateResponse = {
  mediaId: string
  signedUploadUrl: string
  record: any
}

export async function initiateUpload(filename: string, contentType: string, size: number) {
  const res = await api.post('/media/initiate', { filename, contentType, size })
  return res.data as InitiateResponse
}

export async function completeUpload(mediaId: string) {
  const res = await api.post(`/media/${mediaId}/complete`)
  return res.data
}

export async function uploadToSignedUrl(signedUrl: string, file: File, onProgress?: (p: number) => void) {
  // use fetch to PUT to S3 signed URL
  const resp = await fetch(signedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type }
  })
  if (!resp.ok) throw new Error('Upload failed')
  if (onProgress) onProgress(100)
  return true
}
