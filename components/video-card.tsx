"use client"

import { useState } from "react"
import { BookmarkIcon, ShareIcon, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { toggleBookmark } from "../actions/bookmark"
import type { Content } from "../types/content"

interface VideoCardProps {
  content: Content
  onBookmarkToggle?: (id: string, isBookmarked: boolean) => void
}

export function VideoCard({ content, onBookmarkToggle }: VideoCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(content.isBookmarked)
  const [isLiked, setIsLiked] = useState(false)

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
          text: content.description,
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
      className="relative w-full max-w-md mx-auto bg-card rounded-xl overflow-hidden shadow-lg"
    >
      <div className="aspect-[9/16] relative">
        <video
          src={content.videoUrl}
          poster={content.thumbnailUrl}
          className="w-full h-full object-cover"
          controls
          playsInline
        />
      </div>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <img
            src={content.author.avatar || "/placeholder.svg"}
            alt={content.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold line-clamp-2">{content.title}</h3>
            <p className="text-sm text-muted-foreground">{content.author.name}</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{content.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
              className={isLiked ? "text-red-500" : ""}
            >
              <Heart className={isLiked ? "fill-current" : ""} />
            </Button>
            <span className="text-sm text-muted-foreground">{content.likes + (isLiked ? 1 : 0)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleBookmark}>
              <BookmarkIcon className={isBookmarked ? "fill-current" : ""} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <ShareIcon />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

