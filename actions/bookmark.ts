"use server"

// This is a mock implementation. In a real app, you'd store this in a database
const bookmarkedContent = new Set<string>()

export async function toggleBookmark(contentId: string) {
  if (bookmarkedContent.has(contentId)) {
    bookmarkedContent.delete(contentId)
    return false
  } else {
    bookmarkedContent.add(contentId)
    return true
  }
}

export async function isBookmarked(contentId: string) {
  return bookmarkedContent.has(contentId)
}

