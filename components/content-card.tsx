"use client"

import { useState } from "react"
import { BookmarkIcon, MessageCircle, ArrowUpFromLine } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { toggleBookmark } from "../actions/bookmark"
import type { Content } from "../types/content"

interface ContentCardProps {
  content: Content
  onBookmarkToggle?: (id: string, isBookmarked: boolean) => void
}

export function ContentCard({ content, onBookmarkToggle }: ContentCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(content.isBookmarked)

  const handleBookmark = async () => {
    const newBookmarkState = await toggleBookmark(content.id)
    setIsBookmarked(newBookmarkState)
    onBookmarkToggle?.(content.id, newBookmarkState)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          text: `Check out this post by ${content.author.username}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative w-full max-w-xl mx-auto bg-background rounded-lg overflow-hidden"
    >
      <div className="relative aspect-square">
        <img src={content.imageUrl || "/placeholder.svg"} alt={content.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />

        {/* Interaction buttons */}
        <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
              onClick={handleBookmark}
            >
              <BookmarkIcon className={`w-5 h-5 ${isBookmarked ? "fill-white" : ""}`} />
            </Button>
            <span className="text-xs text-white font-medium">{content.likes}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
            <span className="text-xs text-white font-medium">{content.comments}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
            onClick={handleShare}
          >
            <ArrowUpFromLine className="w-5 h-5" />
          </Button>
        </div>

        {/* Content info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h2 className="text-xl font-bold mb-2">{content.title}</h2>
          <p className="text-sm opacity-90 line-clamp-2 mb-2">{content.summary}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-90">{content.author.username}</span>
            <span className="text-sm opacity-75">{format(new Date(content.date), "M/d/yyyy")}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

