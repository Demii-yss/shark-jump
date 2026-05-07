"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Calendar, User, Megaphone } from "lucide-react"

interface NewsItem {
    id: number
    title: string
    description: string
    type: string
    date: string
    link?: string
    showDialog?: boolean
    fullDescription?: string
    image?: string
}

const newsItems: NewsItem[] = [
    {
        id: 0,
        title: "新角色介紹 - 炸蝦",
        description: "夢想成為偶像的炸蝦登場！因為太硬而被吃剩，希望自己有一天會被吃掉！",
        type: "character",
        date: "2026-05-07",
        link: "/characters",
    },
    {
        id: 1,
        title: "首次見面會明晚舉行！學弟鯊正在準備什麼呢？",
        description: "特別的驚喜正在醞釀中！",
        type: "announcement",
        date: "2026-05-07",
        showDialog: true,
        link: "/events",
        image: "/images/news/0.jpg",
        fullDescription: "" +
            "學弟鯊似乎正在準備一個特別的驚喜給大家！\n" +
            "大家都準備好了嗎？",
    },
    {
        id: 2,
        title: "首次線下見面會即將舉辦！時間訂在 2026-05-08！",
        description: "即將召開首次的線下見面會，邀請所有阿鯊的朋友們一起來參加！會場有豐富的活動和驚喜等著大家！",
        type: "event",
        date: "2026-05-07",
        link: "/events",
    },
    {
        id: 3,
        title: "鯊魚 JUMP 第二話公開！",
        description: "大家都喜歡的新朋友登場了！是誰呢？",
        type: "comic",
        date: "2024-05-06",
        link: "/comics?chapter=2",
    },
    {
        id: 4,
        title: "新角色介紹 - 玉子燒",
        description: "心情總是很好的玉子燒登場！背上的玉子燒香香的，讓大家忍不住想吃一口！",
        type: "character",
        date: "2026-05-02",
        link: "/characters",
    },
    {
        id: 5,
        title: "鯊魚 JUMP 第一話公開！",
        description: "開篇就遇到大麻煩！究竟阿鯊是怎麼解決的呢？",
        type: "comic",
        date: "2026-04-30",
        link: "/comics?chapter=1",
    },
    {
        id: 6,
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
        case "announcement":
            return <Megaphone className="w-4 h-4" />
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
        case "announcement":
            return <Badge className="bg-red-500 text-white">重要公告</Badge>
        default:
            return null
    }
}

export default function HomePage() {
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <div className="inline-block mb-4">
                    <Image
                        src="/images/home/title.png"
                        alt="鯊魚 JUMP"
                        width={64}
                        height={64}
                        className="w-16 h-auto"
                    />
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

                {newsItems.map((item, index) => {
                    // 如果是彈窗類型的卡片
                    if (item.showDialog) {
                        return (
                            <div key={item.id}>
                                <Card
                                    onClick={() => setSelectedNews(item)}
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
                            </div>
                        )
                    }

                    // 如果是跳轉類型的卡片
                    return (
                        <Link key={item.id} href={item.link || "#"} className="block">
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
                    )
                })}
            </div>

            {/* News Detail Dialog */}
            <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            {selectedNews && getTypeBadge(selectedNews.type)}
                            <span className="text-sm text-muted-foreground">{selectedNews?.date}</span>
                        </div>
                        <DialogTitle className="text-2xl flex items-center gap-2">
                            {selectedNews && getTypeIcon(selectedNews.type)}
                            {selectedNews?.title}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            {selectedNews?.description}
                        </DialogDescription>
                    </DialogHeader>

                    {/* 圖片區域 */}
                    {selectedNews?.image && (
                        <div className="relative w-full rounded-lg overflow-hidden bg-muted">
                            <Image
                                src={selectedNews.image}
                                alt={selectedNews.title}
                                width={800}
                                height={600}
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    )}

                    <div className="mt-4">
                        <p className="text-foreground leading-relaxed whitespace-pre-line">
                            {selectedNews?.fullDescription}
                        </p>
                    </div>
                    {selectedNews?.link && (
                        <div className="mt-6 flex justify-center">
                            <Link
                                href={selectedNews.link}
                                className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                onClick={() => setSelectedNews(null)}
                            >
                                查看完整活動資訊 →
                            </Link>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
