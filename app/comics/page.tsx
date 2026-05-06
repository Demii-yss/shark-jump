"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChapterData {
  title: string
  description: string
  img: string
}

interface Chapter {
  id: number
  title: string
  description: string
  image: string
}

// 定義可用的章節數量
const TOTAL_CHAPTERS = 5

export default function ComicsPage() {
  const searchParams = useSearchParams()
  const chapterParam = searchParams.get("chapter")
  const [selectedChapter, setSelectedChapter] = useState(1)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)

  // 載入所有章節資料
  useEffect(() => {
    async function loadChapters() {
      const loadedChapters: Chapter[] = []
      
      for (let i = 1; i <= TOTAL_CHAPTERS; i++) {
        try {
          const response = await fetch(`/images/comics/chapter_${i}/content.json`)
          if (response.ok) {
            const data: ChapterData = await response.json()
            loadedChapters.push({
              id: i,
              title: data.title,
              description: data.description,
              image: `/images/comics/chapter_${i}/${data.img}`,
            })
          } else {
            // 如果檔案不存在，使用預設值
            loadedChapters.push({
              id: i,
              title: `第 ${i} 話`,
              description: "章節內容載入中...",
              image: "",
            })
          }
        } catch (error) {
          console.error(`載入章節 ${i} 失敗:`, error)
          loadedChapters.push({
            id: i,
            title: `第 ${i} 話`,
            description: "章節內容載入失敗",
            image: "",
          })
        }
      }
      
      setChapters(loadedChapters)
      setLoading(false)
    }

    loadChapters()
  }, [])

  useEffect(() => {
    if (chapterParam) {
      const chapterNum = parseInt(chapterParam)
      if (chapterNum >= 1 && chapterNum <= TOTAL_CHAPTERS) {
        setSelectedChapter(chapterNum)
      }
    }
  }, [chapterParam])

  const currentChapter = chapters.find((c) => c.id === selectedChapter)

  const goToPrevious = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1)
    }
  }

  const goToNext = () => {
    if (selectedChapter < chapters.length) {
      setSelectedChapter(selectedChapter + 1)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">載入中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8 text-center flex items-center justify-center gap-2">
        <span className="text-3xl">📚</span> 漫畫列表
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
        {/* Chapter List - Sidebar */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-card rounded-xl border-2 border-border overflow-hidden sticky top-24">
            <div className="bg-primary/10 px-4 py-3 border-b border-border">
              <h2 className="font-bold text-foreground">章節總覽</h2>
            </div>
            <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => setSelectedChapter(chapter.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 transition-all duration-200",
                    selectedChapter === chapter.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary text-foreground"
                  )}
                >
                  <div className="font-medium text-sm">{chapter.title}</div>
                  <div
                    className={cn(
                      "text-xs mt-1",
                      selectedChapter === chapter.id
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    )}
                  >
                    {chapter.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Comic Viewer */}
        <div className="flex-1">
          <div className="bg-card rounded-xl border-2 border-border overflow-hidden">
            {/* Chapter Header */}
            <div className="bg-secondary/50 px-6 py-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">
                {currentChapter?.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {currentChapter?.description}
              </p>
            </div>

            {/* Comic Image */}
            <div className="aspect-[3/4] md:aspect-[4/3] bg-muted flex items-center justify-center p-4">
              {currentChapter?.image ? (
                <div className="relative w-full h-full">
                  <Image
                    src={currentChapter.image}
                    alt={currentChapter.title}
                    fill
                    className="object-contain rounded-lg"
                    priority
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-card rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground">
                  <span className="text-8xl mb-4">🦈</span>
                  <p className="text-lg font-medium">第 {selectedChapter} 話</p>
                  <p className="text-sm mt-2">{currentChapter?.title}</p>
                  <p className="text-xs mt-4 text-muted-foreground/70">
                    圖片檔案：{currentChapter?.image}
                  </p>
                  <p className="text-xs mt-1 text-muted-foreground/70">
                    請將圖片放入 public{currentChapter?.image}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-secondary/30">
              <Button
                variant="outline"
                onClick={goToPrevious}
                disabled={selectedChapter === 1}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                上一話
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedChapter} / {chapters.length}
              </span>
              <Button
                variant="outline"
                onClick={goToNext}
                disabled={selectedChapter === chapters.length}
                className="gap-2"
              >
                下一話
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
