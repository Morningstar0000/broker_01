"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, CheckCircle, AlertCircle } from "lucide-react"
import { uploadAvatar } from "@/app/actions/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AvatarUploadProps {
  currentAvatarUrl: string | null
  firstName: string
  lastName: string
}

export default function AvatarUpload({ currentAvatarUrl, firstName, lastName }: AvatarUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getInitials = (fName?: string, lName?: string) => {
    if (!fName || !lName) return "U"
    return `${fName.charAt(0)}${lName.charAt(0)}`.toUpperCase()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
      setMessage(null)
    } else {
      setFile(null)
      setPreviewUrl(currentAvatarUrl)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: "error", text: "Please select an image to upload." })
      return
    }

    setIsLoading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append("avatar", file)

    try {
      const result = await uploadAvatar(formData)
      if (result.success) {
        setMessage({ type: "success", text: result.message || "Avatar uploaded successfully!" })
        // Update the preview URL to the newly uploaded public URL
        setPreviewUrl(result.profile?.avatar_url || null)
        setFile(null) // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "" // Clear the actual file input element
        }
      } else {
        setMessage({ type: "error", text: result.error || "Failed to upload avatar." })
      }
    } catch (error) {
      console.error("Avatar upload error:", error)
      setMessage({ type: "error", text: "An unexpected error occurred during upload." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-24 w-24 border-2 border-blue-600">
          <AvatarImage src={previewUrl || undefined} alt="Profile Avatar" />
          <AvatarFallback className="bg-blue-600 text-white text-3xl">
            {getInitials(firstName, lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2 text-center">
          <Label htmlFor="avatar" className="sr-only">
            Upload new avatar
          </Label>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="bg-slate-700 border-slate-600 text-white file:text-blue-400 file:bg-slate-600 file:border-slate-500 file:hover:bg-slate-500"
            disabled={isLoading}
          />
          <p className="text-sm text-slate-400">Max file size: 5MB. Allowed formats: JPG, PNG, GIF.</p>
        </div>
      </div>

      {message && (
        <Alert
          className={`mb-4 ${
            message.type === "success" ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <AlertDescription className={message.type === "success" ? "text-green-400" : "text-red-400"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Button onClick={handleUpload} disabled={!file || isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Avatar
          </>
        )}
      </Button>
    </div>
  )
}
