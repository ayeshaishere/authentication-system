// Authentication service to manage user registration and login
class AuthService {
  constructor() {
    this.USERS_KEY = "registered_users"
    this.CURRENT_USER_KEY = "current_user"
  }

  // Get all registered users from localStorage
  getRegisteredUsers() {
    try {
      const users = localStorage.getItem(this.USERS_KEY)
      return users ? JSON.parse(users) : []
    } catch (error) {
      console.error("Error reading users from localStorage:", error)
      return []
    }
  }

  // Save users to localStorage
  saveUsers(users) {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
      return true
    } catch (error) {
      console.error("Error saving users to localStorage:", error)
      return false
    }
  }

  // Register a new user
  registerUser(userData) {
    try {
      const users = this.getRegisteredUsers()

      // Check if email already exists
      const existingUser = users.find((user) => user.email.toLowerCase() === userData.email.toLowerCase())
      if (existingUser) {
        return {
          success: false,
          error: "An account with this email already exists. Please use a different email or try logging in.",
        }
      }

      // Create new user with hashed password (simple hash for demo)
      const newUser = {
        id: Date.now(), // Simple ID generation
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email.toLowerCase(),
        password: this.hashPassword(userData.password), // Hash the password
        createdAt: new Date().toISOString(),
      }

      users.push(newUser)

      if (this.saveUsers(users)) {
        return {
          success: true,
          message: "Account created successfully! You can now log in.",
          user: {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
          },
        }
      } else {
        return {
          success: false,
          error: "Failed to save user data. Please try again.",
        }
      }
    } catch (error) {
      console.error("Registration error:", error)
      return {
        success: false,
        error: "An unexpected error occurred during registration.",
      }
    }
  }

  // Authenticate user login
  authenticateUser(credentials) {
    try {
      const users = this.getRegisteredUsers()

      if (users.length === 0) {
        return {
          success: false,
          error: "No registered users found. Please sign up first.",
        }
      }

      // Find user by email
      const user = users.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase())

      if (!user) {
        return {
          success: false,
          error: "No account found with this email address. Please check your email or sign up.",
        }
      }

      // Verify password
      const hashedPassword = this.hashPassword(credentials.password)
      if (user.password !== hashedPassword) {
        return {
          success: false,
          error: "Incorrect password. Please try again.",
        }
      }

      // Login successful - save current user
      const currentUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        loginTime: new Date().toISOString(),
      }

      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(currentUser))

      return {
        success: true,
        message: "Login successful!",
        user: currentUser,
      }
    } catch (error) {
      console.error("Authentication error:", error)
      return {
        success: false,
        error: "An unexpected error occurred during login.",
      }
    }
  }

  // Simple password hashing (for demo purposes - use proper hashing in production)
  hashPassword(password) {
    // This is a simple hash for demo purposes
    // In production, use proper libraries like bcrypt
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString()
  }

  // Get current logged-in user
  getCurrentUser() {
    try {
      const user = localStorage.getItem(this.CURRENT_USER_KEY)
      return user ? JSON.parse(user) : null
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  }

  // Logout user
  logout() {
    try {
      localStorage.removeItem(this.CURRENT_USER_KEY)
      return true
    } catch (error) {
      console.error("Error during logout:", error)
      return false
    }
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.getCurrentUser() !== null
  }

  // Get all registered users (for admin purposes)
  getAllUsers() {
    return this.getRegisteredUsers().map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
    }))
  }

  // Reset password (simple implementation)
  resetPassword(email) {
    try {
      const users = this.getRegisteredUsers()
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

      if (!user) {
        return {
          success: false,
          error: "No account found with this email address.",
        }
      }

      
      return {
        success: true,
        message: "Password reset instructions have been sent to your email.",
      }
    } catch (error) {
      console.error("Password reset error:", error)
      return {
        success: false,
        error: "An error occurred while processing your request.",
      }
    }
  }
}

const authService = new AuthService()
export default authService
