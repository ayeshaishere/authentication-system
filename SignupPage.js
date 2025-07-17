"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { AuthLayout } from "../common/AuthLayout"
import { FormInput } from "../common/FormInput"
import { Button } from "../common/Button"
import { SpinnerIcon } from "../common/Icons"
import { validateEmail, validatePassword } from "../../utils/validation"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",

  })
  const [errors, setErrors] = useState({})
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }



  const validateForm = () => {
    const newErrors = {}

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    // Validate email
    const emailError = validateEmail(formData.email)
    if (emailError) {
      newErrors.email = emailError
    }

    // Validate password
    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      newErrors.password = passwordError
    }

  

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormSubmitted(true)

    if (validateForm()) {
      setIsLoading(true)

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
        // Redirect to login
        console.log("Signup successful", formData)
      }, 1500)
    }
  }


  return (
    <AuthLayout title="Let's Get Started!" isLeftSide={true}>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create Account</h1>
          <p className="text-sm text-gray-500">Enter your information to create an account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              label="First name"
              placeholder="John"
              error={formSubmitted ? errors.firstName : ""}
            />
            <FormInput
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              label="Last name"
              placeholder="Doe"
              error={formSubmitted ? errors.lastName : ""}
            />
          </div>

          <FormInput
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            label="Email"
            placeholder="john.doe@example.com"
            error={formSubmitted ? errors.email : ""}
          />

          <div className="space-y-2">
            <FormInput
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              label="Password"
              error={formSubmitted ? errors.password : ""}
            />
            <div className="text-xs text-gray-500">
              Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
            </div>
          </div>

          

          <Button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-700" disabled={isLoading}>
            {isLoading ? (
              <>
                <SpinnerIcon className="mr-2 h-4 w-4" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
           
          </div>

          

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-indigo-600 hover:underline">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}

