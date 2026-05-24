"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCachedData } from "@/lib/cache"

const loadedComicImages = new Set<string>()

interface Chapter {
  id: number
  title: string
  description: string
  image: string
  isPlaceholder?: boolean
}

const DEFAULT_TOTAL_CHAPTERS = 5
const PLACEHOLDER_OPTIONS = [
  { status: "努力", img: 0 },
  { status: "構想", img: 1 },
  { status: "摸魚", img: 2 },
]

// 將使用 useSearchParams 的邏輯分離到子組件
function ComicsContent() {
  const searchParams = useSearchParams()
  const chapterParam = searchParams.get("chapter")
  const [selectedChapter, setSelectedChapter] = useState(0)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [imageLoading, setImageLoading] = useState<Record<number, boolean>>({})

  // 根據章節索引取得對應的站位文案與圖片（0~2 圖與文案一一對應）
  const getPlaceholderStatusWithImage = (index: number) => {
    const selected = PLACEHOLDER_OPTIONS[index % PLACEHOLDER_OPTIONS.length]
    return {
      description: `阿鯊正在${selected.status}...`,
      image: `/images/comics/no-page-img/${selected.img}.png`
    }
  }

  const buildPlaceholderChapters = (count: number, startIndex = 0): Chapter[] => {
    return Array.from({ length: count }, (_, offset) => {
      const chapterIndex = startIndex + offset
      const placeholder = getPlaceholderStatusWithImage(chapterIndex)

      return {
        id: chapterIndex,
        title: "敬請期待",
        description: placeholder.description,
        image: placeholder.image,
        isPlaceholder: true,
      }
    })
  }

  // 從 API 載入漫畫資料（使用快取）
  useEffect(() => {
    async function loadChapters() {
      try {
        // 使用快取，避免重複載入
        const result = await getCachedData('comics-data-v2', async () => {
          const response = await fetch('/api/comics')
          return await response.json()
        })

        if (result.success) {
          // 將 API 資料轉換為章節格式
          const loadedChapters = result.data.map((comic: any) => ({
            id: comic.id,
            title: comic.title,
            description: comic.description,
            image: comic.image,
          }))

          const totalChapters = Math.max(
            Number(result.totalChapters) || 0,
            loadedChapters.length,
            loadedChapters.length > 0 ? 0 : DEFAULT_TOTAL_CHAPTERS
          )

          const placeholderChapters = buildPlaceholderChapters(
            Math.max(totalChapters - loadedChapters.length, 0),
            loadedChapters.length
          )

          const allChapters = [...loadedChapters, ...placeholderChapters]
          setChapters(allChapters)

          const requestedChapterNumber = chapterParam ? parseInt(chapterParam) : NaN
          const requestedIndex = Number.isNaN(requestedChapterNumber)
            ? -1
            : Math.max(requestedChapterNumber - 1, 0)
          const targetId = allChapters[requestedIndex]?.id ?? allChapters[0]?.id ?? 0
          setSelectedChapter(targetId)
        } else {
          // 如果沒有資料，顯示預設內容
          const defaultChapters = buildPlaceholderChapters(DEFAULT_TOTAL_CHAPTERS)
          setChapters(defaultChapters)
          setSelectedChapter(defaultChapters[0].id)
        }
      } catch (error) {
        console.error('載入漫畫資料失敗:', error)
        // 錯誤時顯示預設內容
        const defaultChapters = buildPlaceholderChapters(DEFAULT_TOTAL_CHAPTERS)
        setChapters(defaultChapters)
        setSelectedChapter(defaultChapters[0].id)
      } finally {
        setLoading(false)
      }
    }

    loadChapters()
  }, [chapterParam])

  const currentChapter = chapters.find((c) => c.id === selectedChapter)
  const currentIndex = chapters.findIndex((c) => c.id === selectedChapter)

  useEffect(() => {
    if (!currentChapter?.image) {
      return
    }

    setImageLoading((prev) => ({
      ...prev,
      [selectedChapter]: loadedComicImages.has(currentChapter.image) ? false : true,
    }))
  }, [selectedChapter, currentChapter?.image])

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setSelectedChapter(chapters[currentIndex - 1].id)
    }
  }

  const goToNext = () => {
    if (currentIndex >= 0 && currentIndex < chapters.length - 1) {
      setSelectedChapter(chapters[currentIndex + 1].id)
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
        <div className="lg:w-72 shrink-0">
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
            <div className="min-h-[420px] md:min-h-[520px] bg-muted flex items-center justify-center p-4 relative">
              {currentChapter?.image ? (
                <div className="relative w-full min-h-[388px] md:min-h-[488px] flex items-center justify-center">
                  {/* 載入動畫 */}
                  {imageLoading[selectedChapter] !== false && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-muted-foreground">載入中...</p>
                      </div>
                    </div>
                  )}

                  {currentChapter.image.includes('/no-page-img/') ? (
                    // 預設圖片：顯示為原始尺寸的 2 倍 (126x126 -> 252x252)
                    <div className="relative" style={{ width: '252px', height: '252px' }}>
                      <Image
                        src={currentChapter.image}
                        alt={currentChapter.title}
                        width={252}
                        height={252}
                        className={cn(
                          "object-contain transition-opacity duration-300",
                          imageLoading[selectedChapter] === false ? "opacity-100" : "opacity-0"
                        )}
                        priority
                        onLoad={() => {
                          loadedComicImages.add(currentChapter.image)
                          setImageLoading(prev => ({ ...prev, [selectedChapter]: false }))
                        }}
                        onError={() => setImageLoading(prev => ({ ...prev, [selectedChapter]: false }))}
                      />
                    </div>
                  ) : (
                    // 一般漫畫圖片：使用原生 img 提高 Google Drive 相容性
                    <img
                      key={currentChapter.image}
                      src={currentChapter.image}
                      alt={currentChapter.title}
                      referrerPolicy="no-referrer"
                      className={cn(
                        "max-w-full max-h-[488px] object-contain rounded-lg transition-opacity duration-300",
                        imageLoading[selectedChapter] === false ? "opacity-100" : "opacity-0"
                      )}
                      onLoad={() => {
                        loadedComicImages.add(currentChapter.image)
                        setImageLoading(prev => ({ ...prev, [selectedChapter]: false }))
                      }}
                      onError={() => setImageLoading(prev => ({ ...prev, [selectedChapter]: false }))}
                    />
                  )}
                </div>
              ) : (
                <div className="w-full h-full bg-card rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground">
                  <span className="text-8xl mb-4">🦈</span>
                  <p className="text-lg font-medium">第 {currentIndex >= 0 ? currentIndex + 1 : selectedChapter + 1} 話</p>
                  <p className="text-sm mt-2">{currentChapter?.title}</p>
                  <p className="text-xs mt-4 text-muted-foreground/70">
                    章節內容載入失敗
                  </p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-secondary/30">
              <Button
                variant="outline"
                onClick={goToPrevious}
                disabled={currentIndex <= 0}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                上一話
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentIndex >= 0 ? currentIndex + 1 : 1} / {chapters.length}
              </span>
              <Button
                variant="outline"
                onClick={goToNext}
                disabled={currentIndex < 0 || currentIndex >= chapters.length - 1}
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

// 主組件：使用 Suspense 包裹 ComicsContent
export default function ComicsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">載入中...</p>
        </div>
      </div>
    }>
      <ComicsContent />
    </Suspense>
  )
}

