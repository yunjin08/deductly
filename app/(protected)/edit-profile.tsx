"use client"

import { useState, useEffect } from "react"
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, ActivityIndicator } from "react-native"
import { FontAwesome6 } from "@expo/vector-icons"
import { useAppDispatch, useAppSelector } from "@/hooks/useAuthHooks"
import { router } from "expo-router"
import { Image } from "expo-image"
import { updateUserProfile } from "@/contexts/actions/authActions"
import * as ImagePicker from "expo-image-picker"
import { uploadProfilePicture } from "@/services/api/cloudinaryApi"

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
      const { username, email, profilePicture } = session.user

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
      // Open image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true, 
      })

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedImage = result.assets[0]

        // Start upload process
        setIsUploading(true)

        // Get base64 data
        const base64Data = selectedImage.base64
        if (!base64Data) {
          throw new Error("Failed to get base64 data from image")
        }

        // Upload to Cloudinary
        const uploadResult = await uploadProfilePicture({
          base64Image: `data:image/jpeg;base64,${base64Data}`,
          username: formData.username,
        })

        if (uploadResult.success && uploadResult.secure_url) {
          // Log the URL for debugging
          console.log("Cloudinary image URL:", uploadResult.secure_url)

          // Make sure the URL starts with https://
          let imageUrl = uploadResult.secure_url
          if (!imageUrl.startsWith("http")) {
            imageUrl = `https:${imageUrl}`
          }

          // Update form data with new profile picture URL
          setFormData((prev) => ({
            ...prev,
            profilePicture: imageUrl as string,
          }))

          Alert.alert("Success", "Profile picture updated successfully")
        } else {
          throw new Error(uploadResult.error || "Failed to upload image")
        }
      }
    } catch (error) {
      console.error("Error changing profile picture:", error)
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to update profile picture")
    } finally {
      setIsUploading(false)
    }
  }

  if (!session || !session.user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
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
            </View>
          ) : (
            <Image
              source={{
                uri:
                  formData.profilePicture ||
                  session?.user?.profilePicture ||
                  undefined,
              }}
              style={styles.profileImage}
              contentFit="cover"
              transition={300}
              cachePolicy="memory-disk"
              onError={(error) => {
                console.error("Image loading error:", error)
                Alert.alert("Image Error", "Failed to load profile image. Please try again.")
              }}
            />
          )}

          <TouchableOpacity style={styles.changePictureButton} onPress={handleChangePicture} disabled={isUploading}>
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
            />
          </View>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(text) => handleChange("lastName", text)}
              placeholder="Last Name"
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
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isUploading}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
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
