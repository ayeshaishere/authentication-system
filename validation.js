/**
 * Validates an email address based on comprehensive rules
 * @param {string} email - The email to validate
 * @returns {string} Error message or empty string if valid
 */
export function validateEmail(email) {
  // Basic structure check
  if (!email) return "Email is required"
  if (email.length > 254) return "Email must be less than 254 characters"

  // Check for exactly one @ symbol
  const atSymbols = email.split("@").length - 1
  if (atSymbols !== 1) return "Email must contain exactly one @ symbol"

  const [localPart, domainPart] = email.split("@")

  // Local part validation
  if (!localPart) return "Email username part cannot be empty"
  if (localPart.startsWith(".") || localPart.endsWith(".")) return "Email username cannot start or end with a dot"
  if (localPart.includes("..")) return "Email username cannot contain consecutive dots"

  // Local part character validation
  const validLocalPartRegex = /^[a-zA-Z0-9._-]+$/
  if (!validLocalPartRegex.test(localPart))
    return "Email username can only contain letters, numbers, dots, underscores, and hyphens"

  // Domain part validation
  if (!domainPart) return "Email domain cannot be empty"
  if (!domainPart.includes(".")) return "Email domain must include at least one dot"

  const domainExtension = domainPart.split(".").pop()
  if (!domainExtension || domainExtension.length < 2) return "Email domain extension should be at least 2 characters"

  // Domain character validation
  const validDomainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!validDomainRegex.test(domainPart)) return "Email domain is invalid"

  return ""
}

/**
 * Validates a password based on security requirements
 * @param {string} password - The password to validate
 * @returns {string} Error message or empty string if valid
 */
export function validatePassword(password) {
  if (!password) return "Password is required"
  if (password.length < 8) return "Password must be at least 8 characters"
  if (password.length > 64) return "Password must be less than 64 characters"

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) return "Password must include at least one uppercase letter"

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) return "Password must include at least one lowercase letter"

  // Check for digit
  if (!/[0-9]/.test(password)) return "Password must include at least one number"

  // Check for special character
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password))
    return "Password must include at least one special character"

  return ""
}
