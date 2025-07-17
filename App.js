"use client"

import { useState } from "react"
import apiService from "./services/apiService"
import "./App.css"
import authService from "./services/authService"
import { UserInfo } from "./components/UserInfo"

function App() {
  const [currentPage, setCurrentPage] = useState("login")

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <LoginPage setCurrentPage={setCurrentPage} />
      case "signup":
        return <SignupPage setCurrentPage={setCurrentPage} />
      case "forgot-password":
        return <ForgotPasswordPage setCurrentPage={setCurrentPage} />
      case "dashboard":
        return <DashboardPage setCurrentPage={setCurrentPage} />
      default:
        return <LoginPage setCurrentPage={setCurrentPage} />
    }
  }

  return <div className="App">{renderPage()}</div>
}


function DashboardPage({ setCurrentPage }) {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [updateUserId, setUpdateUserId] = useState(null)
  const [updateData, setUpdateData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    phone: "",
  })
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    phone: "",
  })

  const handleGetAllUsers = async () => {
    setLoading(true)
    const result = await apiService.getAllUsers()
    if (result.success) {
      setUsers(result.data || [])
      alert(`✅ Successfully fetched !`)
    } else {
      alert(`⚠️ API Error: ${result.error}`)
    }
    setLoading(false)
  }

  const handleGetUser = async (id) => {
    setLoading(true)
    const result = await apiService.getUserById(id)
    if (result.success) {
      setSelectedUser(result.data)
      alert("✅ Successfully fetched !")
    } else {
      alert(`⚠️ API Error: ${result.error}`)
    }
    setLoading(false)
  }

  const handleCreateUser = async () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.age) {
      alert("Please fill all required fields (First Name, Last Name, Email, Age)")
      return
    }

    setLoading(true)
    const result = await apiService.createUser(newUser)
    if (result.success) {
    
      const createdUser = {
        id: result.data.id,
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        email: result.data.email,
        age: result.data.age,
        phone: result.data.phone || "+1234567890",
        username: result.data.username,
        isLocallyCreated: true, // Mark as locally created
      }

      setUsers((prevUsers) => [createdUser, ...prevUsers]) // Add to top of list

      alert(`✅ User created successfully!

`)

      setNewUser({ firstName: "", lastName: "", email: "", age: "", phone: "" })
    } else {
      alert(`⚠️ API Error: ${result.error}`)
    }
    setLoading(false)
  }

  const handleShowUpdateForm = (user) => {
    console.log("🔄 Opening update form for user:", user)
    setUpdateUserId(user.id)
    setUpdateData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      age: user.age ? user.age.toString() : "",
      phone: user.phone || "",
    })
    setShowUpdateForm(true)
  }

  const handleUpdateInputChange = (field, value) => {
    console.log(`🔄 Updating field ${field} with value:`, value)
    setUpdateData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleUpdateUser = async () => {
    console.log("🔄 Attempting to update user with data:", updateData)

    const hasData =
      updateData.firstName.trim() ||
      updateData.lastName.trim() ||
      updateData.email.trim() ||
      updateData.age.trim() ||
      updateData.phone.trim()

    if (!hasData) {
      alert("Please fill at least one field to update")
      return
    }

    setLoading(true)

    const dataToUpdate = {}
    if (updateData.firstName.trim()) dataToUpdate.firstName = updateData.firstName.trim()
    if (updateData.lastName.trim()) dataToUpdate.lastName = updateData.lastName.trim()
    if (updateData.email.trim()) dataToUpdate.email = updateData.email.trim()
    if (updateData.age.trim()) dataToUpdate.age = Number.parseInt(updateData.age.trim())
    if (updateData.phone.trim()) dataToUpdate.phone = updateData.phone.trim()

    const result = await apiService.updateUser(updateUserId, dataToUpdate)
    if (result.success) {
      // 🎯 UPDATE the user in our LOCAL list to show what WOULD happen
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updateUserId
            ? {
                ...user,
                ...dataToUpdate,
                isLocallyUpdated: true, // Mark as locally updated
              }
            : user,
        ),
      )

      alert(`✅ User updated successfully!`)

      setShowUpdateForm(false)
      setUpdateData({ firstName: "", lastName: "", email: "", age: "", phone: "" })
      setUpdateUserId(null)
    } else {
      alert(`⚠️ API Error: ${result.error}`)
    }
    setLoading(false)
  }

  const handleCancelUpdate = () => {
    setShowUpdateForm(false)
    setUpdateData({ firstName: "", lastName: "", email: "", age: "", phone: "" })
    setUpdateUserId(null)
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return
    }

    setLoading(true)
    const result = await apiService.deleteUser(id)
    if (result.success) {
     
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id))

      alert(`✅ User deleted successfully!`)
    } else {
      alert(`⚠️ API Error: ${result.error}`)
    }
    setLoading(false)
  }

  const handleLogout = () => {
    authService.logout()
    alert("You have been logged out successfully.")
    setCurrentPage("login")
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
       
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <UserInfo />

      

      <div className="api-section">
        <h2>1. GET - Fetch All Users</h2>
        <button onClick={handleGetAllUsers} disabled={loading} className="api-button">
          {loading ? "Loading..." : "Get All Users from DummyJSON Server"}
        </button>
        {users.length > 0 && (
          <div className="employee-list">
            <h3>Users data:</h3>
            {users.slice(0, 10).map((user) => (
              <div key={user.id} className="employee-item">
                <span>
                  ID:{user.id} - {user.firstName} {user.lastName} - {user.email}
                  {user.isLocallyCreated && (
                    <span
                      style={{
                        backgroundColor: "#10b981",
                        color: "white",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "10px",
                        marginLeft: "8px",
                      }}
                    >
                      NEW
                    </span>
                  )}
                  {user.isLocallyUpdated && (
                    <span
                      style={{
                        backgroundColor: "#f59e0b",
                        color: "white",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "10px",
                        marginLeft: "8px",
                      }}
                    >
                      UPDATED
                    </span>
                  )}
                  
                </span>
                <button onClick={() => handleGetUser(user.id)} className="small-button">
                  Get Details
                </button>
                <button onClick={() => handleShowUpdateForm(user)} className="small-button update">
                  Update
                </button>
                <button onClick={() => handleDeleteUser(user.id)} className="small-button delete">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="api-section">
        <h2>2. GET - Fetch Single User </h2>
        <button onClick={() => handleGetUser(1)} disabled={loading} className="api-button">
          Get User ID: 1 
        </button>
        {selectedUser && (
          <div className="employee-details">
            <h3>User Details :</h3>
            <p>ID: {selectedUser.id}</p>
            <p>
              Name: {selectedUser.firstName} {selectedUser.lastName}
            </p>
            <p>Email: {selectedUser.email}</p>
            <p>Age: {selectedUser.age}</p>
            <p>Phone: {selectedUser.phone}</p>
            <p>Username: {selectedUser.username}</p>
            <p>Company: {selectedUser.company?.name}</p>
            <p>City: {selectedUser.address?.city}</p>
            <p>Birth Date: {selectedUser.birthDate}</p>
          </div>
        )}
      </div>

      <div className="api-section">
        <h2>3. POST - Create New User </h2>
        <div className="create-form">
          <input
            type="text"
            placeholder="First Name *"
            value={newUser.firstName}
            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Last Name *"
            value={newUser.lastName}
            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email *"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            type="number"
            placeholder="Age *"
            value={newUser.age}
            onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
          />
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
          />
          <button onClick={handleCreateUser} disabled={loading} className="api-button">
            {loading ? "Creating..." : "Create User "}
          </button>
        </div>
        
      </div>

      {/* Update Form */}
      {showUpdateForm && (
        <div
          className="api-section"
          style={{
            border: "3px solid #10b981",
            backgroundColor: "#ecfdf5",
            padding: "20px",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          <h2>🔄 4. PUT - Update User ID: {updateUserId} (SIMULATED + LOCAL UPDATE)</h2>
          <p>
            <strong>Edit fields and see the changes in the list above!</strong>
          </p>

          <div className="create-form" style={{ gap: "15px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>First Name:</label>
              <input
                type="text"
                placeholder="Enter new first name"
                value={updateData.firstName}
                onChange={(e) => handleUpdateInputChange("firstName", e.target.value)}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>Last Name:</label>
              <input
                type="text"
                placeholder="Enter new last name"
                value={updateData.lastName}
                onChange={(e) => handleUpdateInputChange("lastName", e.target.value)}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>Email:</label>
              <input
                type="email"
                placeholder="Enter new email"
                value={updateData.email}
                onChange={(e) => handleUpdateInputChange("email", e.target.value)}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>Age:</label>
              <input
                type="number"
                placeholder="Enter new age"
                value={updateData.age}
                onChange={(e) => handleUpdateInputChange("age", e.target.value)}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>Phone:</label>
              <input
                type="tel"
                placeholder="Enter new phone"
                value={updateData.phone}
                onChange={(e) => handleUpdateInputChange("phone", e.target.value)}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "end" }}>
              <button
                onClick={handleUpdateUser}
                disabled={loading}
                className="api-button"
                style={{ backgroundColor: "#10b981", color: "white" }}
              >
                {loading ? "Updating..." : "✅ Update User "}
              </button>
              <button
                onClick={handleCancelUpdate}
                className="api-button"
                style={{ backgroundColor: "#6b7280", color: "white" }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Keep the same Login, Signup, and ForgotPassword components...
function LoginPage({ setCurrentPage }) {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true)

      // Use the new authentication service
      const result = authService.authenticateUser(formData)

      if (result.success) {
        alert(`Welcome back, ${result.user.firstName}! Login successful.`)
        setCurrentPage("dashboard")
      } else {
        alert(`Login failed: ${result.error}`)
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-content">
          <h1>Welcome back!</h1>
        </div>
      </div>
      <div className="auth-right">
        <div className="form-container">
          <div className="form-header">
            <h2>Login</h2>
            <p>Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <div className="form-row">
                <label htmlFor="password">Password</label>
                <button type="button" className="link-button" onClick={() => setCurrentPage("forgot-password")}>
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="form-footer">
            Don't have an account?{" "}
            <button className="link-button" onClick={() => setCurrentPage("signup")}>
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SignupPage({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email) => {
    if (!email) return "Email is required"
    if (email.length > 254) return "Email must be less than 254 characters"

    const atSymbols = email.split("@").length - 1
    if (atSymbols !== 1) return "Email must contain exactly one @ symbol"

    const [localPart, domainPart] = email.split("@")

    if (!localPart) return "Email username part cannot be empty"
    if (localPart.startsWith(".") || localPart.endsWith(".")) return "Email username cannot start or end with a dot"
    if (localPart.includes("..")) return "Email username cannot contain consecutive dots"

    const validLocalPartRegex = /^[a-zA-Z0-9._-]+$/
    if (!validLocalPartRegex.test(localPart))
      return "Email username can only contain letters, numbers, dots, underscores, and hyphens"

    if (!domainPart) return "Email domain cannot be empty"
    if (!domainPart.includes(".")) return "Email domain must include at least one dot"

    const domainExtension = domainPart.split(".").pop()
    if (!domainExtension || domainExtension.length < 2) return "Email domain extension should be at least 2 characters"

    const validDomainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!validDomainRegex.test(domainPart)) return "Email domain is invalid"

    return ""
  }

  const validatePassword = (password) => {
    if (!password) return "Password is required"
    if (password.length < 8) return "Password must be at least 8 characters"
    if (password.length > 64) return "Password must be less than 64 characters"
    if (!/[A-Z]/.test(password)) return "Password must include at least one uppercase letter"
    if (!/[a-z]/.test(password)) return "Password must include at least one lowercase letter"
    if (!/[0-9]/.test(password)) return "Password must include at least one number"
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password))
      return "Password must include at least one special character"
    return ""
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"

    const emailError = validateEmail(formData.email)
    if (emailError) newErrors.email = emailError

    const passwordError = validatePassword(formData.password)
    if (passwordError) newErrors.password = passwordError

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true)

      // Use the new authentication service
      const result = authService.registerUser(formData)

      if (result.success) {
        alert(`Account created successfully! Welcome ${result.user.firstName}. You can now log in.`)
        setCurrentPage("login")
      } else {
        alert(`Signup failed: ${result.error}`)
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-content">
          <h1>Let's Get Started!</h1>
        </div>
      </div>
      <div className="auth-right">
        <div className="form-container">
          <div className="form-header">
            <h2>Create Account</h2>
            <p>Enter your information to create an account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className={errors.firstName ? "error" : ""}
                />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={errors.lastName ? "error" : ""}
                />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
              <small>
                Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
              </small>
            </div>

           

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="form-footer">
            Already have an account?{" "}
            <button className="link-button" onClick={() => setCurrentPage("login")}>
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ForgotPasswordPage({ setCurrentPage }) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    setIsLoading(true)

    // Use the new authentication service
    const result = authService.resetPassword(email)

    setTimeout(() => {
      setIsLoading(false)
      if (result.success) {
        setIsSubmitted(true)
      } else {
        setError(result.error)
      }
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-content">
            <h1>Check your email</h1>
            <p>We've sent you a reset link</p>
          </div>
        </div>
        <div className="auth-right">
          <div className="form-container">
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h2>Check your email</h2>
              <p>We've sent a password reset link to {email}</p>
              <button className="submit-button" onClick={() => setCurrentPage("login")}>
                Back to login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-content">
          <h1>Reset Password</h1>
          <p>We'll send you a link to reset your password</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="form-container">
          <div className="form-header">
            <h2>Forgot Password</h2>
            <p>Enter your email address and we'll send you a link to reset your password</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError("")
                }}
                placeholder="john.doe@example.com"
                className={error ? "error" : ""}
              />
              {error && <span className="error-text">{error}</span>}
            </div>

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="form-footer">
            Remember your password?{" "}
            <button className="link-button" onClick={() => setCurrentPage("login")}>
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
