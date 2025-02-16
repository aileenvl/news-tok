'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Feed } from "../components/feed"
import { useSearch } from "@/hooks/useSearch"
import { useMemo } from "react"

export default function Home() {
  const { content: allContent, loading, totalCount } = useSearch({ limit: 50 }); // Increased limit to see more items

  console.log('Total content items:', allContent.length);
  console.log('Total count from search:', totalCount);

  // Filter content using useMemo to prevent unnecessary recalculations
  const { dailyContent, bookmarkedContent } = useMemo(() => {
    const result = {
      dailyContent: allContent,
      bookmarkedContent: allContent.filter((item) => item.isBookmarked)
    };
    
    console.log('Filtered content:', {
      dailyContentLength: result.dailyContent.length,
      bookmarkedContentLength: result.bookmarkedContent.length
    });

    return result;
  }, [allContent]);

  if (loading) {
    return <div>Loading...</div>
  }

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
