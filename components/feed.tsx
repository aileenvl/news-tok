"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ContentCard } from "./content-card"
import type { Content } from "../types/content"

interface FeedProps {
  initialContent: Content[]
  type: "daily" | "bookmarked"
}

export function Feed({ initialContent, type }: FeedProps) {
  const [content, setContent] = useState(initialContent)

  const handleBookmarkToggle = (id: string, isBookmarked: boolean) => {
    if (type === "bookmarked") {
      setContent((prev) => prev.filter((item) => item.id !== id))
    } else {
      setContent((prev) => prev.map((item) => (item.id === id ? { ...item, isBookmarked } : item)))
    }
  }

  if (content.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <h2 className="text-2xl font-semibold mb-2">
          {type === "daily" ? "You're all caught up!" : "No bookmarked content yet"}
        </h2>
        <p className="text-muted-foreground text-center">
          {type === "daily"
            ? "Check back tomorrow for new content"
            : "Start bookmarking content you want to save for later"}
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[calc(100vh-8rem)] w-full">
      <div className="max-w-xl mx-auto p-4 space-y-6">
        <AnimatePresence mode="popLayout">
          {content.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ContentCard content={item} onBookmarkToggle={handleBookmarkToggle} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  )
}

