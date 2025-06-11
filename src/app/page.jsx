"use client"

import { useRouter } from "next/navigation"
import Button from "@/components/ui/Button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/Card"
import { useState, useEffect } from "react"

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">EduTech Platform</h1>
            </div>
            <div className="space-x-4">
              {user ? (
                <>
                  <Button onClick={() => router.push("/dashboard")} variant="outline">
                    Dashboard
                  </Button>
                  {user.role === "admin" && (
                    <Button onClick={() => router.push("/admin")} variant="primary">
                      Admin Panel
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button onClick={() => router.push("/login")} variant="outline">
                    Login
                  </Button>
                  <Button onClick={() => router.push("/register")} variant="primary">
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Master JEE with Our
            <span className="text-blue-600"> CBT Platform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Practice with JEE Main style CBT tests, get instant doubt resolution, and track your progress with detailed
            analytics.
          </p>

          {/* CTA Button */}
          <div className="space-y-4">
            <Button onClick={() => router.push("/book-session")} size="lg" className="text-xl px-8 py-4">
              Book a Doubt Session Now
            </Button>
            <p className="text-sm text-gray-500">Get instant help from expert teachers</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Everything you need to excel in JEE Main and Advanced</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>CBT Test Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Practice with JEE Main style Computer Based Tests with auto-save, timer, and instant results.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Doubt Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Book one-on-one doubt clearing sessions with expert teachers via WhatsApp, Zoom, or Google Meet.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get comprehensive analysis of your performance with subject-wise breakdown and improvement
                  suggestions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your JEE Journey?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already improving their scores with our platform.
          </p>
          <div className="space-x-4">
            <Button onClick={() => router.push("/register")} variant="secondary" size="lg">
              Get Started Free
            </Button>
            <Button
              onClick={() => router.push("/book-session")}
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Book Demo Session
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">EduTech Platform</h3>
              <p className="text-gray-400">
                Your ultimate destination for JEE preparation with CBT tests and expert guidance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>CBT Test Portal</li>
                <li>Doubt Sessions</li>
                <li>Performance Analytics</li>
                <li>Chapter-wise Tests</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>WhatsApp Support</li>
                <li>Email Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="text-gray-400 space-y-2">
                <p>Email: support@edutech.com</p>
                <p>Phone: +91 9876543210</p>
                <p>WhatsApp: +91 9876543210</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EduTech Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
