"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { AuthLayout } from "../common/AuthLayout"
import { FormInput } from "../common/FormInput"
import { Button } from "../common/Button"
import { SpinnerIcon } from "../common/Icons"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    setEmail(e.target.value)
    if (error) setError("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1500)
  }

  return (
    <AuthLayout title="Reset Password" subtitle="We'll send you a link to reset your password">
      <div className="space-y-6">
        {isSubmitted ? (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Check your email</h2>
            <p className="text-gray-500">We've sent a password reset link to {email}</p>
            <Button
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => (window.location.href = "/login")}
            >
              Back to login
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Forgot Password</h1>
              <p className="text-sm text-gray-500">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                label="Email"
                placeholder="john.doe@example.com"
                error={error}
              />

              <Button
                type="submit"
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <SpinnerIcon className="mr-2 h-4 w-4" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>

            <div className="text-center text-sm">
              Remember your password?{" "}
              <Link to="/login" className="font-medium text-indigo-600 hover:underline">
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  )
}

function CheckIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  )
}