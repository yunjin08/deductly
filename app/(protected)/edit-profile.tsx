"use client"

import { useState, useEffect } from "react"
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, ActivityIndicator } from "react-native"
import { FontAwesome6 } from "@expo/vector-icons"
import { useAppDispatch, useAppSelector } from "@/hooks/useAuthHooks"
import { router } from "expo-router"
import { Image } from "expo-image"
import { updateUserProfile } from "@/contexts/actions/authActions"
import * as ImagePicker from "expo-image-picker"
import { api } from "@/services/api/baseApi"

const EditProfileScreen = () => {
  const dispatch = useAppDispatch()

  // Get the user data from Redux
  const { session } = useAppSelector((state) => state.auth)
  const [isUploading, setIsUploading] = useState(false)

  // Initialize form data with the user's current profile details
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profilePicture: "",
  })

  // Set the form data with the session data when it changes
  useEffect(() => {
    if (session && session.user) {
      console.log(session.user,'session')
      // Handle both camelCase and snake_case property names
      const firstName = session.user.firstName || session.user.first_name || ""
      const lastName = session.user.lastName || session.user.last_name || ""
      const profilePicture = session.user.profilePicture || session.user.profile_picture || ""
      const { username, email } = session.user

      setFormData({
        username,
        firstName,
        lastName,
        email,
        password: "", // Clear password initially
        profilePicture,
      })
    }
  }, [session])

  useEffect(() => {
    // Request permission for image library
    ;(async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission Required", "Sorry, we need camera roll permissions to make this work!")
      }
    })()
  }, [])

  // Custom upload function that only sends the required parameters
  const uploadProfilePictureFixed = async (base64Image: string, username: string) => {
    try {
      const formData = new FormData()
      
      // Only add the parameters that the backend expects
      formData.append("image", base64Image)
      formData.append("username", username)
      
      console.log("Sending request with only image and username parameters")

      const response = await api.post("/account/profile-picture/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      })

      console.log("Upload response:", response.data)

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

      if (error.response) {
        console.error("Error response data:", error.response.data)
        console.error("Error response status:", error.response.status)
      } else if (error.request) {
        console.error("No response received:", error.request)
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload profile picture",
      }
    }
  }

  const handleChange = (field: keyof typeof formData, value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    try {
      const safeFormData: any = {
        username: formData.username,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        profilePicture: formData.profilePicture,
      }

      if (formData.password) {
        safeFormData.password = formData.password
      }

      await dispatch(updateUserProfile(safeFormData)).unwrap()
      Alert.alert("Success", "Profile updated successfully", [
        {
          text: "OK",
          onPress: () => {
            setTimeout(() => {
              router.back()
            }, 300) // Give Redux time to update session safely
          },
        },
      ])
    } catch (err) {
      Alert.alert("Error", err?.toString() || "Profile update failed")
    }
  }

  const handleChangePicture = async () => {
    try {
      // Show action sheet for image selection options
      Alert.alert(
        "Select Image",
        "Choose how you want to select your profile picture",
        [
          {
            text: "Camera",
            onPress: () => openCamera(),
          },
          {
            text: "Photo Library",
            onPress: () => openImageLibrary(),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      )
    } catch (error) {
      console.error("Error in handleChangePicture:", error)
      Alert.alert("Error", "Failed to open image selection")
    }
  }

  const openCamera = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission Required", "Camera permission is required to take photos")
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'Images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      })

      if (!result.canceled) {
        await processSelectedImage(result.assets[0])
      }
    } catch (error) {
      console.error("Error opening camera:", error)
      Alert.alert("Error", "Failed to open camera")
    }
  }

  const openImageLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      })

      if (!result.canceled) {
        await processSelectedImage(result.assets[0])
      }
    } catch (error) {
      console.error("Error opening image library:", error)
      Alert.alert("Error", "Failed to open image library")
    }
  }

  const processSelectedImage = async (selectedImage: ImagePicker.ImagePickerAsset) => {
    try {
      if (!selectedImage.base64) {
        throw new Error("Failed to get base64 data from image")
      }

      // Start upload process
      setIsUploading(true)

      // Determine the image type from the URI
      const imageType = selectedImage.uri.toLowerCase().includes('.png') ? 'png' : 'jpeg'
      
      console.log("Starting upload process...")
      console.log("Image type:", imageType)
      console.log("Username:", formData.username)

      // Use the fixed upload function that only sends required parameters
      const base64Image = `data:image/${imageType};base64,${selectedImage.base64}`
      const uploadResult = await uploadProfilePictureFixed(base64Image, formData.username)

      console.log("Upload result:", uploadResult)

      if (uploadResult.success && uploadResult.secure_url) {
        // Log the URL for debugging
        console.log("Cloudinary image URL:", uploadResult.secure_url)

        // Ensure the URL is properly formatted
        let imageUrl = uploadResult.secure_url
        
        // Handle different URL formats from Cloudinary
        if (imageUrl.startsWith('//')) {
          imageUrl = `https:${imageUrl}`
        } else if (!imageUrl.startsWith('http')) {
          imageUrl = `https://${imageUrl}`
        }

        // Validate the URL format
        try {
          new URL(imageUrl)
          console.log("Valid URL:", imageUrl)
        } catch (urlError) {
          console.error("Invalid URL format:", imageUrl)
          throw new Error("Invalid image URL received from server")
        }

        // Update form data with new profile picture URL
        setFormData((prev) => ({
          ...prev,
          profilePicture: imageUrl,
        }))

        Alert.alert("Success", "Profile picture updated successfully!")
      } else {
        console.error("Upload failed:", uploadResult)
        throw new Error(uploadResult.error || "Failed to upload image to server")
      }
    } catch (error) {
      console.error("Error processing selected image:", error)
      
      // More specific error messages
      let errorMessage = "Failed to update profile picture"
      if (error instanceof Error) {
        if (error.message.includes("500")) {
          errorMessage = "Server error occurred. Please try again later."
        } else if (error.message.includes("network")) {
          errorMessage = "Network error. Please check your connection."
        } else {
          errorMessage = error.message
        }
      }
      
      Alert.alert("Upload Error", errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const getCurrentProfilePicture = () => {
    const currentPicture = formData.profilePicture || 
                          session?.user?.profilePicture || 
                          session?.user?.profile_picture

    // Add cache busting parameter to force reload if needed
    if (currentPicture && !currentPicture.includes('?')) {
      return `${currentPicture}?t=${Date.now()}`
    }
    
    return currentPicture
  }

  if (!session || !session.user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1fddee" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.pictureSection}>
        <View style={styles.profilePictureContainer}>
          {isUploading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1fddee" />
              <Text style={styles.uploadingText}>Uploading...</Text>
            </View>
          ) : getCurrentProfilePicture() ? (
            <Image
              source={{ uri: getCurrentProfilePicture() }}
              style={styles.profileImage}
              contentFit="cover"
              transition={300}
              cachePolicy="none"
              onError={(error) => {
                console.error("Image loading error:", error)
                console.log("Failed to load image:", getCurrentProfilePicture())
                if (formData.profilePicture) {
                  setFormData(prev => ({ ...prev, profilePicture: "" }))
                }
              }}
              onLoad={() => {
                console.log("Profile image loaded successfully:", getCurrentProfilePicture())
              }}
            />
          ) : (
            <View style={[styles.profileImage, styles.defaultAvatar]}>
              <FontAwesome6 name="circle-user" size={60} color="#1fddee" solid />
            </View>
          )}

          <TouchableOpacity 
            style={[styles.changePictureButton, isUploading && styles.disabledButton]} 
            onPress={handleChangePicture} 
            disabled={isUploading}
          >
            <FontAwesome6 name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={formData.username}
            onChangeText={(text) => handleChange("username", text)}
            placeholder="Username"
            editable={!isUploading}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(text) => handleChange("firstName", text)}
              placeholder="First Name"
              editable={!isUploading}
            />
          </View>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(text) => handleChange("lastName", text)}
              placeholder="Last Name"
              editable={!isUploading}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            placeholder="Email"
            keyboardType="email-address"
            editable={!isUploading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password (Optional - only fill to change password)</Text>
          <TextInput
            style={styles.input}
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            placeholder="New Password"
            secureTextEntry
            editable={!isUploading}
          />
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.saveButton, isUploading && styles.disabledButton]} 
        onPress={handleSave} 
        disabled={isUploading}
      >
        <Text style={styles.saveButtonText}>
          {isUploading ? "Uploading..." : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default EditProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  pictureSection: {
    alignItems: "center",
    paddingVertical: 30,
  },
  profilePictureContainer: {
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#1fddee",
  },
  defaultAvatar: {
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f0f0f0'
  },
  loadingContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#1fddee",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  uploadingText: {
    fontSize: 10,
    color: "#1fddee",
    marginTop: 5,
    textAlign: "center",
  },
  changePictureButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1fddee",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  formSection: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#1fddee",
    marginHorizontal: 20,
    marginVertical: 30,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})