"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Link from "next/link"
import { BookOpen, Calendar, User, Megaphone } from "lucide-react"
import { getCachedData } from "@/lib/cache"
import { ImageWithLoader } from "@/components/ui/image-with-loader"

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
    const [newsItems, setNewsItems] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // 從 API 載入新聞資料
    useEffect(() => {
        async function loadNews() {
            try {
                const result = await getCachedData('news-data-v1', async () => {
                    const response = await fetch('/api/news')
                    return await response.json()
                })

                if (result.success) {
                    setNewsItems(result.data)
                } else {
                    setError('載入新聞失敗')
                }
            } catch (err) {
                console.error('載入新聞資料時發生錯誤:', err)
                setError('載入新聞失敗')
            } finally {
                setLoading(false)
            }
        }

        loadNews()
    }, [])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-muted-foreground">載入中...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <div className="inline-block mb-4">
                    <ImageWithLoader
                        src="/images/home/title.png"
                        alt="鯊魚 JUMP"
                        width={64}
                        height={64}
                        className="w-16 h-auto"
                        containerClassName="rounded-lg"
                        overlayClassName="rounded-lg"
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
                        <ImageWithLoader
                            src={selectedNews.image}
                            alt={selectedNews.title}
                            width={800}
                            height={600}
                            className="w-full h-auto object-contain"
                            containerClassName="w-full rounded-lg overflow-hidden bg-muted"
                            overlayClassName="rounded-lg"
                        />
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
