import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Feed } from "../components/feed"

// This would typically come from your database
const mockContent = [
  {
    id: "1",
    title: "Retaking the Web Browser, One Small Step at a Time",
    summary:
      "Exploring how modern web browsers are evolving and how developers are pushing the boundaries of what's possible in web applications.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-08%20at%2010.16.57%E2%80%AFp.m.-ssm1Karvg2ZvNXveI4NNOL7KETEqK6.png",
    author: {
      username: "@surprisetalk",
    },
    date: "2025-02-08",
    likes: 12,
    comments: 1,
    isBookmarked: false,
  },
  {
    id: "2",
    title: "Building the Future of Web Development",
    summary: "A deep dive into emerging web technologies and how they're shaping the future of development practices.",
    imageUrl: "/placeholder.svg?height=600&width=600",
    author: {
      username: "@webdev",
    },
    date: new Date().toISOString(),
    likes: 45,
    comments: 3,
    isBookmarked: true,
  },
  {
    id: "3",
    title: "The Art of Modern Web Design",
    summary:
      "Exploring contemporary design principles and how they intersect with user experience in modern web applications.",
    imageUrl: "/placeholder.svg?height=600&width=600",
    author: {
      username: "@designpro",
    },
    date: new Date().toISOString(),
    likes: 89,
    comments: 7,
    isBookmarked: false,
  },
  {
    id: "4",
    title: "Exploring New Frontend Patterns",
    summary:
      "Discovering innovative patterns and practices that are revolutionizing frontend development and user interfaces.",
    imageUrl: "/placeholder.svg?height=600&width=600",
    author: {
      username: "@frontend",
    },
    date: new Date().toISOString(),
    likes: 67,
    comments: 5,
    isBookmarked: false,
  },
]

export default function Home() {
  // Filter content for today's date
  const today = new Date().toISOString().split("T")[0]
  const dailyContent = mockContent.filter((item) => item.date.split("T")[0] === today)

  const bookmarkedContent = mockContent.filter((item) => item.isBookmarked)

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 container mx-auto flex flex-col">
        <h1 className="text-2xl font-bold text-center py-4">Daily Digest</h1>
        <Tabs defaultValue="daily" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 max-w-xl mx-auto">
            <TabsTrigger value="daily">For You</TabsTrigger>
            <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="flex-1 mt-2">
            <Feed initialContent={dailyContent} type="daily" />
          </TabsContent>
          <TabsContent value="bookmarked" className="flex-1 mt-2">
            <Feed initialContent={bookmarkedContent} type="bookmarked" />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

