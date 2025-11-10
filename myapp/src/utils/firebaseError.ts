export function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "Invalid email address. Please check and try again."

    case "auth/user-not-found":
      return "No account found with this email."

    case "auth/wrong-password":
      return "Incorrect password. Try again."

    case "auth/email-already-in-use":
      return "This email is already registered."

    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters."

    case "auth/too-many-requests":
      return "Too many failed attempts. Please wait and try again later."

    case "auth/network-request-failed":
      return "Network error. Check your internet connection."

    default:
      return "Something went wrong. Please try again."
  }
}

export function getFirestoreErrorMessage(code: string): string {
  switch (code) {
    case "permission-denied":
      return "You don’t have permission to perform this action."

    case "unavailable":
      return "The database is temporarily unavailable. Try again later."

    case "not-found":
      return "Requested data was not found."

    case "resource-exhausted":
      return "Too many requests. Please wait a moment."

    case "cancelled":
      return "Request cancelled. Please try again."

    case "deadline-exceeded":
      return "The request took too long. Please retry."

    default:
      return "Something went wrong while connecting to the database."
  }
}
