"use server"

import { UploadApiResponse, v2 as cloudinary } from "cloudinary"
import { actionClient } from "@/server/safe-action"
import z from "zod"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

const formData = z.object({
  image: z.instanceof(FormData),
})

type UploadResult =
  | { success: UploadApiResponse; error?: never }
  | { error: string; success?: never }

export const uploadImage = actionClient
  .schema(formData)
  .action(async ({ parsedInput: { image } }): Promise<UploadResult> => {
    console.log(image)
    
    const formImage = image.get("image")

    if (!formImage) return { error: "No image provided" }
    if (!image) return { error: "No image provided" }

    const file = formImage as File

    try {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      

      return new Promise<UploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            upload_preset: process.env.CLOUDINARY_CLOUD_NAME,
            use_filename: true,
            unique_filename: false,
            filename_override: file.name,
          },
          (error, result) => {
            if (error || !result) {
              console.log("adrian::::4")
              console.log(process.env.CLOUDINARY_CLOUD_NAME)
              console.log(uploadStream)
              console.error("Upload failed:", error)
              reject({ error: "Upload failed" })
            } else {
              console.log("Upload successful:", result)
              resolve({ success: result })
            }
          }
        )

        uploadStream.end(buffer)
      })
    } catch (error) {
      console.log("adrian::::5")
      console.error("Error processing file:", error)
      return { error: "Error processing file" }
    }
  })