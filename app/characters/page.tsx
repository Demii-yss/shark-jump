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
    fullDescription: "學弟鯊",
    color: "bg-blue-100 hover:bg-blue-200",
  },
  {
    id: "tamagoyaki",
    name: "玉子燒",
    image: "/images/characters/tamagoyaki.jpg",
    description: "溫暖的料理朋友",
    fullDescription: "玉子燒是一個熱情又溫暖的角色！牠總是散發著香香的味道，讓周圍的朋友都感到幸福。玉子燒最擅長的就是照顧大家，無論是誰遇到困難，牠都會第一個伸出援手。牠的座右銘是「溫暖的心比什麼都重要」！",
    color: "bg-yellow-100 hover:bg-yellow-200",
  },
  {
    id: "milktea",
    name: "奶茶",
    image: "/images/characters/milktea.jpg",
    description: "甜甜的珍珠奶茶",
    fullDescription: "奶茶是一杯超級可愛的珍珠奶茶！牠的個性溫柔又甜蜜，就像牠的味道一樣讓人感到療癒。奶茶最喜歡和朋友們聊天，分享每天發生的有趣事情。牠的夢想是讓每個人都能嚐到幸福的滋味！",
    color: "bg-amber-100 hover:bg-amber-200",
  },
  {
    id: "baoni",
    name: "宝膩",
    image: "/images/characters/boboli.jpg",
    description: "軟萌的糰子精靈",
    fullDescription: "宝膩是一顆軟軟糯糯的糰子精靈！牠的外表看起來總是懶懶的，但其實內心充滿了對世界的好奇。宝膩最喜歡在陽光下打盹，然後做各種奇妙的夢。牠經常會分享自己夢境中的冒險故事給大家聽！",
    color: "bg-pink-100 hover:bg-pink-200",
  },
  {
    id: "awang",
    name: "阿汪",
    image: "/images/characters/awang.jpg",
    description: "忠誠的狗狗夥伴",
    fullDescription: "阿汪是一隻活潑又忠誠的小狗！牠有著毛茸茸的外表和搖搖晃晃的尾巴，看到朋友就會開心地跳來跳去。阿汪的嗅覺超級靈敏，經常在冒險中幫助大家找到正確的方向。牠最喜歡的獎勵是大家的讚美！",
    color: "bg-orange-100 hover:bg-orange-200",
  },
  {
    id: "cookie",
    name: "巧克力餅乾",
    image: "/images/characters/choco_cookie.jpg",
    description: "酥脆的甜點朋友",
    fullDescription: "巧克力餅乾是一塊香噴噴的餅乾！牠看起來有點酷酷的，但其實內心超級柔軟（就像牠的巧克力豆一樣會融化）。餅乾最喜歡收集各種有趣的東西，牠的收藏室裡有很多神奇的寶貝。牠是團隊中最可靠的情報專家！",
    color: "bg-amber-100 hover:bg-amber-200",
  },
  {
    id: "ebifly",
    name: "炸蝦",
    image: "/images/characters/ebifurai.png",
    description: "神秘的新角色",
    fullDescription: "這個角色還沒有解鎖，敬請期待！",
    color: "bg-gray-200",
    locked: true,
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
        <DialogContent className="sm:max-w-md">
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
