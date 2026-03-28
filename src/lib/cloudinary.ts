// src/lib/cloudinary.ts
// Cloudinary image upload for product photos

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export interface UploadedImage {
  url:       string
  thumbnail: string
  publicId:  string
  width:     number
  height:    number
}

export async function uploadProductImage(
  fileBuffer: Buffer,
  folder = 'findsolace/products'
): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) return reject(error)
          resolve({
            url:       result.secure_url,
            thumbnail: cloudinary.url(result.public_id, { width: 400, height: 400, crop: 'fill', quality: 'auto' }),
            publicId:  result.public_id,
            width:     result.width,
            height:    result.height,
          })
        }
      )
      .end(fileBuffer)
  })
}

export async function deleteProductImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId)
}

// Client-side: generate a signed upload URL (for direct browser uploads)
export async function getUploadSignature(folder = 'findsolace/products') {
  const timestamp = Math.round(Date.now() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder, upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET },
    process.env.CLOUDINARY_API_SECRET!
  )
  return { timestamp, signature, cloudName: process.env.CLOUDINARY_CLOUD_NAME }
}
