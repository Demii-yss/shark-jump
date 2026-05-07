import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BookOpen, Calendar, User } from "lucide-react"

const newsItems = [
  {
    id: 1,
    title: "首次線下見面會即將舉辦！時間訂在 2026-05-08！",
    description: "即將召開首次的線下見面會，邀請所有阿鯊的朋友們一起來參加！會場有豐富的活動和驚喜等著大家！",
    type: "event",
    date: "2026-05-07",
    link: "/events",
  },
  {
    id: 2,
    title: "鯊魚 JUMP 第二話公開！",
    description: "大家都喜歡的新朋友登場了！是誰呢？",
    type: "comic",
    date: "2024-05-06",
    link: "/comics?chapter=2",
  },
  {
    id: 3,
    title: "新角色介紹 - 玉子燒",
    description: "心情總是很好的玉子燒登場！背上的玉子燒香香的，讓大家忍不住想吃一口！",
    type: "character",
    date: "2026-05-02",
    link: "/characters",
  },
  {
    id: 4,
    title: "鯊魚 JUMP 第一話公開！",
    description: "開篇就遇到大麻煩！究竟阿鯊是怎麼解決的呢？",
    type: "comic",
    date: "2026-04-30",
    link: "/comics?chapter=1",
  },
  {
    id: 5,
    title: "新角色介紹 - 奶茶",
    description: "噗！奶茶身體柔軟又有彈性，非常擅長打滾！很喜歡爬到朋友身上撒嬌！",
    type: "character",
    date: "2026-04-30",
    link: "/characters",
  },
]

function getTypeIcon(type: string) {
  switch (type) {
    case "comic":
      return <BookOpen className="w-4 h-4" />
    case "event":
      return <Calendar className="w-4 h-4" />
    case "character":
      return <User className="w-4 h-4" />
    default:
      return null
  }
}

function getTypeBadge(type: string) {
  switch (type) {
    case "comic":
      return <Badge className="bg-primary text-primary-foreground">漫畫</Badge>
    case "event":
      return <Badge className="bg-accent text-accent-foreground">活動</Badge>
    case "character":
      return <Badge variant="secondary">角色</Badge>
    default:
      return null
  }
}

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-block mb-4">
          <span className="text-6xl">🦈</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
          歡迎來到鯊魚 JUMP！
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          和可愛的鯊魚與朋友們一起展開奇妙的冒險吧！
        </p>
      </div>

      {/* News Cards */}
      <div className="max-w-3xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <span className="text-2xl">📰</span> 最新消息
        </h2>
        
        {newsItems.map((item, index) => (
          <Link key={item.id} href={item.link}>
            <Card 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/30"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeBadge(item.type)}
                  </div>
                  <span className="text-sm text-muted-foreground">{item.date}</span>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center gap-2">
                  {getTypeIcon(item.type)}
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
