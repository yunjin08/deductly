import { api } from "@/services/api/baseApi"

interface UploadProfilePictureParams {
  base64Image: string
  username: string
  oldPublicId?: string
}

interface UploadProfilePictureResponse {
  success: boolean
  secure_url?: string
  public_id?: string
  error?: string
}

export const uploadProfilePicture = async (
  params: UploadProfilePictureParams,
): Promise<UploadProfilePictureResponse> => {
  try {
    const formData = new FormData()

    // Add the base64 image data
    formData.append("image", params.base64Image)

    // Add the username for folder organization
    formData.append("username", params.username)

    // Add the old public_id if available for deletion
    if (params.oldPublicId) {
      formData.append("oldPublicId", params.oldPublicId)
    }

    // Fix the URL path - remove the duplicate "api" segment
    const response = await api.post("/account/profile-picture/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      // Add timeout to prevent hanging requests
      timeout: 30000,
    })

    console.log("Upload response:", response.data)

    // Validate the response
    if (response.data && response.data.success && response.data.secure_url) {
      return {
        success: true,
        secure_url: response.data.secure_url,
        public_id: response.data.public_id,
      }
    } else {
      console.error("Invalid response format:", response.data)
      return {
        success: false,
        error: "Invalid response format from server",
      }
    }
  } catch (error) {
    console.error("Error uploading profile picture:", error)

    // More detailed error logging
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response data:", error.response.data)
      console.error("Error response status:", error.response.status)
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request)
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload profile picture",
    }
  }
}