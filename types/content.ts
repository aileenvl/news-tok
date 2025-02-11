export interface Content {
  id: string
  title: string
  summary: string
  imageUrl: string
  author: {
    username: string
    avatar?: string
  }
  date: string
  likes: number
  comments: number
  isBookmarked: boolean
}

