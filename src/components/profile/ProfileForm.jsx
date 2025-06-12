"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/Card"
import { apiClient } from "@/lib/api-client"

export default function ProfileForm() {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsappNo: "",
    class: "",
    enrolledInCoaching: false,
    coachingName: "",
    profile: {
      dateOfBirth: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
  })
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setFormData({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        whatsappNo: parsedUser.whatsappNo || "",
        class: parsedUser.class || "",
        enrolledInCoaching: parsedUser.enrolledInCoaching || false,
        coachingName: parsedUser.coachingName || "",
        profile: {
          dateOfBirth: parsedUser.profile?.dateOfBirth
            ? new Date(parsedUser.profile.dateOfBirth).toISOString().split("T")[0]
            : "",
          address: parsedUser.profile?.address || "",
          city: parsedUser.profile?.city || "",
          state: parsedUser.profile?.state || "",
          pincode: parsedUser.profile?.pincode || "",
        },
      })
      if (parsedUser.profile?.avatar) {
        setAvatarPreview(parsedUser.profile.avatar)
      }
    } else {
      router.push("/login")
    }
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatar(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.whatsappNo.trim()) newErrors.whatsappNo = "WhatsApp number is required"
    if (!formData.class) newErrors.class = "Class is required"
    if (formData.enrolledInCoaching && !formData.coachingName.trim()) {
      newErrors.coachingName = "Coaching name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      const token = localStorage.getItem("token")

      // First, upload avatar if exists
      let avatarUrl = user.profile?.avatar || null
      if (avatar) {
        const formData = new FormData()
        formData.append("avatar", avatar)

        const avatarResponse = await apiClient.request("/api/profile/avatar", {
          method: "POST",
          headers: {}, // Remove Content-Type to let browser set it for FormData
          body: formData,
        })

        if (avatarResponse.ok) {
          const avatarData = await avatarResponse.json()
          avatarUrl = avatarData.avatarUrl
        }
      }

      // For profile update
      const response = await apiClient.put("/api/profile", {
        ...formData,
        profile: {
          ...formData.profile,
          avatar: avatarUrl,
        },
      })

      const data = await response.json()

      if (response.ok) {
        // Update local storage with new user data
        localStorage.setItem("user", JSON.stringify(data.user))
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setErrors({ submit: data.error })
      }
    } catch (error) {
      setErrors({ submit: "Profile update failed. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Update Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">Profile updated successfully!</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-6">
            <div
              className="w-24 h-24 rounded-full bg-gray-200 mb-3 overflow-hidden flex items-center justify-center border-2 border-gray-300"
              style={{
                backgroundImage: avatarPreview ? `url(${avatarPreview})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!avatarPreview && <span className="text-gray-500">No Image</span>}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current.click()}>
              Change Avatar
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Enter your full name"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              placeholder="Email cannot be changed"
            />

            <Input
              label="WhatsApp Number"
              name="whatsappNo"
              value={formData.whatsappNo}
              onChange={handleChange}
              error={errors.whatsappNo}
              placeholder="Enter your WhatsApp number"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Class</label>
              <select
                name="class"
                value={formData.class}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Class</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
                <option value="Dropper">Dropper</option>
              </select>
              {errors.class && <p className="text-sm text-red-600">{errors.class}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="enrolledInCoaching"
              checked={formData.enrolledInCoaching}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">Are you enrolled in any coaching?</label>
          </div>

          {formData.enrolledInCoaching && (
            <Input
              label="Coaching Name"
              name="coachingName"
              value={formData.coachingName}
              onChange={handleChange}
              error={errors.coachingName}
              placeholder="Enter coaching name"
            />
          )}

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Date of Birth"
                name="profile.dateOfBirth"
                type="date"
                value={formData.profile.dateOfBirth}
                onChange={handleChange}
                placeholder="Select your date of birth"
              />

              <Input
                label="Address"
                name="profile.address"
                value={formData.profile.address}
                onChange={handleChange}
                placeholder="Enter your address"
              />

              <Input
                label="City"
                name="profile.city"
                value={formData.profile.city}
                onChange={handleChange}
                placeholder="Enter your city"
              />

              <Input
                label="State"
                name="profile.state"
                value={formData.profile.state}
                onChange={handleChange}
                placeholder="Enter your state"
              />

              <Input
                label="Pincode"
                name="profile.pincode"
                value={formData.profile.pincode}
                onChange={handleChange}
                placeholder="Enter your pincode"
              />
            </div>
          </div>

          {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
