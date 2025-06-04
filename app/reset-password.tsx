

"use client"

import { useState } from "react"
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, ActivityIndicator } from "react-native"
import { FontAwesome6 } from "@expo/vector-icons"
import { router } from "expo-router"
import { api } from "@/services/api/baseApi"

type Step = "email" | "verification" | "password"

const ForgotPasswordScreen = () => {
  const [currentStep, setCurrentStep] = useState<Step>("email")
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSendVerificationCode = async () => {
    if (!formData.email.trim()) {
      Alert.alert("Error", "Please enter your email address")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address")
      return
    }

    setIsLoading(true)
    try {
      // Replace with your actual API endpoint
      const response = await api.post("/auth/forgot-password/", {
        email: formData.email,
      })

      if (response.data && response.data.success) {
        Alert.alert("Verification Code Sent", "Please check your email for the verification code", [
          {
            text: "OK",
            onPress: () => setCurrentStep("verification"),
          },
        ])
      } else {
        throw new Error(response.data?.message || "Failed to send verification code")
      }
    } catch (error) {
      console.error("Error sending verification code:", error)
      Alert.alert("Error", error?.response?.data?.message || "Failed to send verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!formData.verificationCode.trim()) {
      Alert.alert("Error", "Please enter the verification code")
      return
    }

    setIsLoading(true)
    try {
      // Replace with your actual API endpoint
      const response = await api.post("/auth/verify-reset-code/", {
        email: formData.email,
        code: formData.verificationCode,
      })

      if (response.data && response.data.success) {
        Alert.alert("Code Verified", "Please enter your new password", [
          {
            text: "OK",
            onPress: () => setCurrentStep("password"),
          },
        ])
      } else {
        throw new Error(response.data?.message || "Invalid verification code")
      }
    } catch (error) {
      console.error("Error verifying code:", error)
      Alert.alert("Error", error?.response?.data?.message || "Invalid verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!formData.newPassword.trim()) {
      Alert.alert("Error", "Please enter a new password")
      return
    }

    if (formData.newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long")
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    setIsLoading(true)
    try {
      // Replace with your actual API endpoint
      const response = await api.post("/auth/reset-password/", {
        email: formData.email,
        code: formData.verificationCode,
        newPassword: formData.newPassword,
      })

      if (response.data && response.data.success) {
        Alert.alert(
          "Password Reset Successful",
          "Your password has been reset successfully. You can now sign in with your new password.",
          [
            {
              text: "OK",
              onPress: () => {
                // Navigate back to sign in or wherever appropriate
                router.replace("/auth/signin")
              },
            },
          ],
        )
      } else {
        throw new Error(response.data?.message || "Failed to reset password")
      }
    } catch (error) {
      console.error("Error resetting password:", error)
      Alert.alert("Error", error?.response?.data?.message || "Failed to reset password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    await handleSendVerificationCode()
  }

  const renderEmailStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <FontAwesome6 name="envelope" size={40} color="#1fddee" />
      </View>

      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we'll send you a verification code to reset your password.
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
          placeholder="Enter your email address"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, isLoading && styles.disabledButton]}
        onPress={handleSendVerificationCode}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Send Verification Code</Text>
        )}
      </TouchableOpacity>
    </View>
  )

  const renderVerificationStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <FontAwesome6 name="shield-halved" size={40} color="#1fddee" />
      </View>

      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={styles.subtitle}>
        We've sent a verification code to {formData.email}. Please enter the code below.
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Verification Code</Text>
        <TextInput
          style={styles.input}
          value={formData.verificationCode}
          onChangeText={(text) => handleChange("verificationCode", text)}
          placeholder="Enter verification code"
          keyboardType="number-pad"
          maxLength={6}
          editable={!isLoading}
        />
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, isLoading && styles.disabledButton]}
        onPress={handleVerifyCode}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Verify Code</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={handleResendCode} disabled={isLoading}>
        <Text style={styles.secondaryButtonText}>Resend Code</Text>
      </TouchableOpacity>
    </View>
  )

  const renderPasswordStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <FontAwesome6 name="lock" size={40} color="#1fddee" />
      </View>

      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your new password below. Make sure it's secure and easy to remember.</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          value={formData.newPassword}
          onChangeText={(text) => handleChange("newPassword", text)}
          placeholder="Enter new password"
          secureTextEntry
          editable={!isLoading}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm New Password</Text>
        <TextInput
          style={styles.input}
          value={formData.confirmPassword}
          onChangeText={(text) => handleChange("confirmPassword", text)}
          placeholder="Confirm new password"
          secureTextEntry
          editable={!isLoading}
        />
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, isLoading && styles.disabledButton]}
        onPress={handleResetPassword}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Reset Password</Text>
        )}
      </TouchableOpacity>
    </View>
  )

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={styles.stepIndicatorContainer}>
        <View style={[styles.stepDot, currentStep === "email" && styles.activeStepDot]} />
        <View
          style={[
            styles.stepLine,
            (currentStep === "verification" || currentStep === "password") && styles.activeStepLine,
          ]}
        />
        <View
          style={[
            styles.stepDot,
            currentStep === "verification" && styles.activeStepDot,
            currentStep === "password" && styles.completedStepDot,
          ]}
        />
        <View style={[styles.stepLine, currentStep === "password" && styles.activeStepLine]} />
        <View style={[styles.stepDot, currentStep === "password" && styles.activeStepDot]} />
      </View>
    </View>
  )

  return (
    <ScrollView style={styles.container}>
      {renderStepIndicator()}

      <View style={styles.content}>
        {currentStep === "email" && renderEmailStep()}
        {currentStep === "verification" && renderVerificationStep()}
        {currentStep === "password" && renderPasswordStep()}
      </View>
    </ScrollView>
  )
}

export default ForgotPasswordScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  stepIndicator: {
    paddingVertical: 30,
    alignItems: "center",
  },
  stepIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ddd",
  },
  activeStepDot: {
    backgroundColor: "#1fddee",
  },
  completedStepDot: {
    backgroundColor: "#4CAF50",
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: "#ddd",
    marginHorizontal: 10,
  },
  activeStepLine: {
    backgroundColor: "#1fddee",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 20,
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
    paddingVertical: 12,
    fontSize: 16,
    width: "100%",
  },
  primaryButton: {
    backgroundColor: "#1fddee",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#1fddee",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  disabledButton: {
    opacity: 0.6,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    marginBottom: 30,
  },
  backButtonText: {
    color: "#666",
    fontSize: 14,
    marginLeft: 8,
  },
})
