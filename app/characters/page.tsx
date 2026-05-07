"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Lock } from "lucide-react"

interface Character {
  id: string
  name: string
  image: string
  description: string
  fullDescription: string
  color: string
  locked?: boolean
}

const characters: Character[] = [
  {
    id: "shark",
    name: "阿鯊",
    image: "/images/characters/shark.jpg",
    description: "威嚴又可愛的代表",
    fullDescription: "鯊魚是一隻可愛又勇敢的小鯊魚！\n擅長是鋼鐵尾巴和裝可愛🤍",
    color: "bg-blue-100 hover:bg-blue-200",
  },
  {
    id: "shark-2",
    name: "學弟鯊",
    image: "/images/characters/shark-2.jpg",
    description: "我弟啦",
    fullDescription: "學弟鯊把大家照顧得非常好！\n總是帶著奶茶和玉子燒一起玩耍\n🤜蝸牛✌️",
    color: "bg-blue-100 hover:bg-blue-200",
  },
  {
    id: "tamagoyaki",
    name: "玉子燒",
    image: "/images/characters/tamagoyaki.jpg",
    description: "心情總是很好",
    fullDescription: "玉子燒隨時保持著愉快的心情！\n背上的玉子燒香香的，讓大家忍不住想吃一口！",
    color: "bg-yellow-100 hover:bg-yellow-200",
  },
  {
    id: "milktea",
    name: "奶茶",
    image: "/images/characters/milktea.jpg",
    description: "噗",
    fullDescription: "奶茶身體柔軟又有彈性，非常擅長打滾！\n很喜歡爬到朋友身上撒嬌！",
    color: "bg-amber-100 hover:bg-amber-200",
  },
  {
    id: "boboli",
    name: "宝膩",
    image: "/images/characters/boboli.jpg",
    description: "軟萌的妹子",
    fullDescription: "宝膩是大家的偶像！\n喜歡吃吃喝喝，也喜歡大家！",
    color: "bg-pink-100 hover:bg-pink-200",
  },
  {
    id: "awang",
    name: "阿汪",
    image: "/images/characters/awang.jpg",
    description: "忠誠的汪汪",
    fullDescription: "阿汪是個胖胖的汪汪！\n總是在大家旁邊搗蛋！",
    color: "bg-orange-100 hover:bg-orange-200",
  },
  {
    id: "cookie",
    name: "巧克力餅乾",
    image: "/images/characters/choco_cookie.jpg",
    description: "酥脆的點心",
    fullDescription: "巧克力餅乾是一塊脆脆的餅乾！\n看起來有點酷酷的呢！",
    color: "bg-amber-100 hover:bg-amber-200",
  },
  {
    id: "ebifly",
    name: "炸蝦",
    image: "/images/characters/ebifurai.png",
    description: "夢想成為偶像",
    fullDescription: "" +
        "炸蝦因為太硬而被吃剩，跟炸豬排為心靈相通的好朋友。\n" +
        "羨慕在便當裏最受歡迎的章魚，希望自己有一天會被吃掉。\n" +
        "下一步是成為 idol！",
    color: "bg-gray-200",
  },
  {
    id: "tokage",
    name: "とかげ",
    image: "/images/characters/tokage.png",
    description: "來自日本的朋友",
    fullDescription: "這個角色還沒有解鎖，敬請期待！",
    color: "bg-gray-200",
    locked: true,
  },
]

export default function CharactersPage() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-4 text-center flex items-center justify-center gap-2">
        <span className="text-3xl">👥</span> 角色介紹
      </h1>
      <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">
        認識鯊魚 JUMP 世界中的可愛角色們！點擊角色卡片查看詳細介紹。
      </p>

      {/* Character Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
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
                <Image
                  src={character.image}
                  alt={character.name}
                  width={80}
                  height={80}
                  className="object-contain"
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
        <Card className="border-2 border-dashed border-border opacity-60">
          <CardContent className="p-6 text-center bg-muted/30">
            <span className="text-5xl block mb-3">❓</span>
            <h3 className="font-bold text-foreground">還有更多...</h3>
            <p className="text-sm text-muted-foreground mt-1">敬請期待</p>
          </CardContent>
        </Card>
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
                  <Image
                    src={selectedCharacter.image}
                    alt={selectedCharacter.name}
                    width={80}
                    height={80}
                    className="object-contain"
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
