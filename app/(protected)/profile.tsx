import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native"
import { FontAwesome6 } from "@expo/vector-icons"
import { useAppDispatch, useAppSelector } from "@/hooks/useAuthHooks"
import { router } from "expo-router"
import { resetLoginData } from "@/contexts/reducers/authReducers"

const ProfileScreen = () => {
  const dispatch = useAppDispatch()

  // 👇 Get the user data from Redux
  const { session } = useAppSelector((state) => state.auth)

  // Return early if session doesn't exist (just to be safe)
  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    )
  }

  // Extract user data, handling both camelCase and snake_case property names
  const { username, email } = session.user

  // Handle both naming conventions for profile picture
  const profilePicture = session.user.profilePicture || session.user.profile_picture || null

  // Handle both naming conventions for first name and last name
  const firstName = session.user.firstName || session.user.first_name || ""
  const lastName = session.user.lastName || session.user.last_name || ""

  const handleLogout = () => {
    dispatch(resetLoginData())
    router.push("/sign-in")
  }

  const handleEditProfile = () => {
    router.push("/edit-profile")
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.accountPictureContainer}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.profileImage} />
          ) : (
            <FontAwesome6 name="circle-user" size={120} color="#1fddee" solid />
          )}
        </View>
        <Text style={styles.fullName}>
          {firstName} {lastName}
        </Text>

      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <View style={styles.infoRow}>
            <FontAwesome6 name="user" size={20} color="#1fddee" />
            <Text style={styles.infoText}>{username}</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome6 name="envelope" size={20} color="#1fddee" />
            <Text style={styles.infoText}>{email}</Text>
          </View>
        </View>
      </View>


      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
          <FontAwesome6 name="pen-to-square" size={20} color="#1fddee" />
          <Text style={styles.actionButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
          <FontAwesome6 name="right-from-bracket" size={20} color="#ff6b6b" />
          <Text style={[styles.actionButtonText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 18,
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  accountPictureContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#1fddee",
  },
  fullName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#1fddee"
  },
  username: {
    fontSize: 16,
    color: "#666",
  },
  debugText: {
    fontSize: 10,
    color: "#999",
    marginTop: 5,
  },
  infoSection: {
  paddingHorizontal: 20,
  paddingTop: 15,
  borderBottomWidth: 1,
  borderBottomColor: "#f0f0f0",
  backgroundColor: "#f9f9f9",
},
  infoItem: {
    paddingLeft: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  infoText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },

  actionsSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  actionButtonText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ffeeee",
    backgroundColor: "#fff5f5",
  },
  logoutText: {
    color: "#ff6b6b",
  },
})
