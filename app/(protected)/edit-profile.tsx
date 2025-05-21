"use client"

import { useState, useEffect } from "react"
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from "react-native"
import { FontAwesome6 } from "@expo/vector-icons"
import { useAppDispatch, useAppSelector } from "@/hooks/useAuthHooks"
import { router } from "expo-router"
import { Image } from "expo-image"
import { updateUserProfile } from "@/contexts/actions/authActions"

const EditProfileScreen = () => {
  const dispatch = useAppDispatch()

  // Get the user data from Redux
  const { session } = useAppSelector((state) => state.auth)

  // Initialize form data with the user's current profile details
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profilePicture: null,
  })

  // Set the form data with the session data when it changes
  useEffect(() => {
    if (session && session.user) {
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

  const handleChange = (field: keyof typeof formData, value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }


  

  const handleSave = async () => {
  try {
    const safeFormData: any = {
      username: formData.username,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      profilePicture: formData.profilePicture,
    };

    if (formData.password) {
      safeFormData.password = formData.password;
    }

    await dispatch(updateUserProfile(safeFormData)).unwrap();
    Alert.alert("Success", "Profile updated successfully", [
      {
        text: "OK",
        onPress: () => {
          setTimeout(() => {
            router.back();
          }, 300); // Give Redux time to update session safely
        },
      },
    ]);

  } catch (err) {
    Alert.alert("Error", err?.toString() || "Profile update failed");
  }
};


  const handleChangePicture = () => {
    // In a real app, this would open the image picker
    Alert.alert("Change Picture", "This would open the image picker in a real app")
  }

  if (!session || !session.user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }


  return (
    <ScrollView style={styles.container}>
      <View style={styles.pictureSection}>
        <View style={styles.profilePictureContainer}>
          {formData.profilePicture ? (
            <Image source={{ uri: formData.profilePicture }} style={styles.profileImage} />
          ) : (
            <FontAwesome6 name="circle-user" size={100} color="#1fddee" solid />
          )}
          <TouchableOpacity style={styles.changePictureButton} onPress={handleChangePicture}>
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

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
