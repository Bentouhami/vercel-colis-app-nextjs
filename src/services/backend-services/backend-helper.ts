// is user existing or not by id
export async function isUserExistingById(userId: number): Promise<boolean> {
  // check id is a valid number
  if (isNaN(userId) || userId <= 0) {
    console.error("Invalid user ID:", userId);
    return false; // Return false if the ID is invalid
  }
  try {
    // check if user exists in database using prima.user.findUnique

    const response = await fetch(`/api/v1/admin/users/${userId}`);
    if (!response.ok) {
      throw new Error(`Error fetching user: ${response.statusText}`);
    }
    const data = await response.json();
    return !!data.data; // Return true if user data exists
  } catch (error) {
    console.error("Error checking user existence:", error);
    return false; // Return false if any error occurs
  }
}
