"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Target,
  Clock,
  Shield,
} from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: Target,
      title: "Adaptive Testing",
      description: "AI-powered tests that adapt to your skill level for optimal learning",
      color: "from-teal-600 to-teal-700",
      hoverColor: "hover:shadow-teal-900/30",
    },
    {
      icon: Clock,
      title: "Real-time Doubt Resolution",
      description: "Get instant help from expert tutors whenever you're stuck",
      color: "from-blue-600 to-blue-700",
      hoverColor: "hover:shadow-blue-900/30",
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Detailed insights into your progress and areas for improvement",
      color: "from-yellow-500 to-yellow-600",
      hoverColor: "hover:shadow-yellow-900/30",
    },
    {
      icon: Shield,
      title: "Secure Testing Environment",
      description: "Proctored tests with advanced security measures for fair assessment",
      color: "from-purple-600 to-purple-700",
      hoverColor: "hover:shadow-purple-900/30",
    },
  ]

  const stats = [
    { label: "Active Students", value: "10,000+", icon: Users },
    { label: "Tests Completed", value: "50,000+", icon: Award },
    { label: "Success Rate", value: "95%", icon: TrendingUp },
    { label: "Expert Tutors", value: "500+", icon: Star },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary">
      {/* Navigation */}
      <nav className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-glow-primary">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                EdTech Platform
              </span>
            </div>
            <div className="flex space-x-3">
              <Button onClick={() => router.push("/login")} variant="outline" size="sm">
                Login
              </Button>
              <Button onClick={() => router.push("/register")} variant="primary" size="sm">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div
            className={`text-center transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-900/50 to-blue-900/50 border border-teal-800/50 rounded-full text-sm text-teal-300 mb-8 backdrop-blur-sm">
              <Zap className="h-4 w-4 mr-2 text-yellow-400" />
              Revolutionizing JEE Preparation
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-teal-400 via-blue-400 to-yellow-400 bg-clip-text text-transparent">
                Master JEE
              </span>
              <br />
              <span className="text-slate-200">with AI-Powered Learning</span>
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience the future of test preparation with adaptive CBT tests, real-time doubt resolution, and
              personalized learning paths designed to maximize your JEE success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/register")}
                variant="primary"
                size="lg"
                className="group shadow-glow-primary"
              >
                Start Your Journey
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              <Button onClick={() => router.push("/tests")} variant="outline" size="lg">
                Explore Tests
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-teal-600/20 to-blue-600/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-yellow-600/20 to-teal-600/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-500 delay-${index * 100} ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-teal-900/50 to-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow-primary">
                  <stat.icon className="h-8 w-8 text-teal-400" />
                </div>
                <div className="text-3xl font-bold text-slate-200 mb-2">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                Why Choose Our Platform?
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Cutting-edge technology meets proven pedagogy to deliver an unparalleled learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                variant="primary"
                className={`group transform hover:scale-105 transition-all duration-300 ${feature.hoverColor} cursor-pointer`}
              >
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-200 mb-3 group-hover:text-teal-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-surface-tertiary via-surface-primary to-surface-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md rounded-2xl p-12 border border-slate-700 shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow-accent">
              <CheckCircle className="h-10 w-10 text-slate-900" />
            </div>
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-teal-400 bg-clip-text text-transparent">
                Ready to Excel in JEE?
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Join thousands of successful students who have transformed their preparation with our platform. Start your
              journey to JEE success today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/register")}
                variant="accent"
                size="lg"
                className="group shadow-glow-accent"
              >
                Create Free Account
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              <Button onClick={() => router.push("/login")} variant="outline" size="lg">
                Already have an account?
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/80 backdrop-blur-md border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                EdTech Platform
              </span>
            </div>
            <div className="text-sm text-slate-400">
              © {new Date().getFullYear()} EdTech Platform. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
