"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Lock } from "lucide-react"
import { getCachedData } from "@/lib/cache"
import { ImageWithLoader } from "@/components/ui/image-with-loader"
import { Skeleton } from "@/components/ui/skeleton"

interface Character {
  id: number
  name: string
  image: string
  description: string
  fullDescription: string
  color: string
  locked?: boolean
}

export default function CharactersPage() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 從 API 載入角色資料
  useEffect(() => {
    async function loadCharacters() {
      try {
        const result = await getCachedData('characters-data-v1', async () => {
          const response = await fetch('/api/characters')
          return await response.json()
        })

        if (result.success) {
          setCharacters(result.data)
        } else {
          setError('載入角色資料失敗')
        }
      } catch (err) {
        console.error('載入角色資料時發生錯誤:', err)
        setError('載入角色資料失敗')
      } finally {
        setLoading(false)
      }
    }

    loadCharacters()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 靜態內容 - 立即顯示 */}
      <h1 className="text-3xl font-bold text-foreground mb-4 text-center flex items-center justify-center gap-2">
        <span className="text-3xl">👥</span> 角色介紹
      </h1>
      <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">
        認識鯊魚 JUMP 世界中的可愛角色們！點擊角色卡片查看詳細介紹。
      </p>

      {/* 錯誤訊息 */}
      {error && (
        <div className="text-center mb-8">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Character Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {loading ? (
          /* 載入中 - 顯示骨架屏 */
          <>
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="border-2">
                <CardContent className="p-6 text-center">
                  <Skeleton className="w-20 h-20 rounded mx-auto mb-3" />
                  <Skeleton className="h-5 w-24 mx-auto mb-2" />
                  <Skeleton className="h-4 w-32 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          /* 資料載入完成 */
          <>
            {characters.map((character) => (
          <Card
            key={character.id}
            onClick={() => !character.locked && setSelectedCharacter(character)}
            className={cn(
              "cursor-pointer transition-all duration-300 border-2 overflow-hidden",
              character.locked
                ? "opacity-60 cursor-not-allowed"
                : "hover:shadow-lg hover:-translate-y-1 hover:border-primary/30"
            )}
          >
            <CardContent className={cn("p-6 text-center", character.color)}>
              <div className="relative w-20 h-20 mx-auto mb-3">
                <ImageWithLoader
                  src={character.image}
                  alt={character.name}
                  width={80}
                  height={80}
                  className="object-contain"
                  containerClassName="w-20 h-20"
                  overlayClassName="rounded"
                />
                {character.locked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-foreground">{character.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {character.locked ? "未解鎖" : character.description}
              </p>
            </CardContent>
          </Card>
            ))}

            {/* Coming Soon Card */}
            {!loading && (
              <Card className="border-2 border-dashed border-border opacity-60">
                <CardContent className="p-6 text-center bg-muted/30">
                  <span className="text-5xl block mb-3">❓</span>
                  <h3 className="font-bold text-foreground">還有更多...</h3>
                  <p className="text-sm text-muted-foreground mt-1">敬請期待</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Character Detail Dialog */}
      <Dialog open={!!selectedCharacter} onOpenChange={() => setSelectedCharacter(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center overflow-hidden",
                  selectedCharacter?.color
                )}
              >
                {selectedCharacter?.image && (
                  <ImageWithLoader
                    src={selectedCharacter.image}
                    alt={selectedCharacter.name}
                    width={80}
                    height={80}
                    className="object-contain"
                    containerClassName="w-20 h-20 rounded-full overflow-hidden"
                    overlayClassName="rounded-full"
                  />
                )}
              </div>
              <div>
                <DialogTitle className="text-2xl">{selectedCharacter?.name}</DialogTitle>
                <DialogDescription>{selectedCharacter?.description}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {selectedCharacter?.fullDescription}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
