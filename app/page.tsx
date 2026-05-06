import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BookOpen, Calendar, User } from "lucide-react"

const newsItems = [
  {
    id: 1,
    title: "鯊魚 JUMP 第二話公開！",
    description: "精彩的冒險繼續！鯊魚和朋友們在海底發現了神秘的寶藏地圖...",
    type: "comic",
    date: "2024-01-15",
    link: "/comics?chapter=2",
  },
  {
    id: 2,
    title: "新活動開催！大家集合囉！",
    description: "春季特別活動即將開始！參加活動就有機會獲得限定周邊商品！",
    type: "event",
    date: "2024-01-12",
    link: "/events",
  },
  {
    id: 3,
    title: "新角色介紹 - 玉子燒",
    description: "熱情又溫暖的玉子燒登場！牠是大家的好朋友，最喜歡幫助別人。",
    type: "character",
    date: "2024-01-10",
    link: "/characters",
  },
  {
    id: 4,
    title: "鯊魚 JUMP 第一話公開！",
    description: "全新連載開始！跟著可愛的鯊魚展開一場奇妙的海底探險吧！",
    type: "comic",
    date: "2024-01-05",
    link: "/comics?chapter=1",
  },
  {
    id: 5,
    title: "新角色介紹 - 奶茶",
    description: "甜甜的奶茶來啦！珍珠奶茶是大家的好朋友，個性溫柔又可愛。",
    type: "character",
    date: "2024-01-01",
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
