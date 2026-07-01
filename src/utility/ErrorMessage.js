export function getErrorMessage(error, fallback = "Something went wrong.") {
  if (!navigator.onLine) {
    return "No internet connection.";
  }

  if (!error) return fallback;

  switch (error.code) {
    case 401:
      return "Invalid email or password.";

    case 409:
      return "An account with this email already exists.";

    case 429:
      return "Too many requests. Please try again later.";

    default:
      return fallback;
  }
}