"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, MessageCircle, Globe } from "lucide-react"
import { getCachedData } from "@/lib/cache"
import { ImageWithLoader } from "@/components/ui/image-with-loader"

interface Event {
    id: number
    title: string
    description: string
    date: string
    location: string
    status: string
    statusColor: string
    highlights: string[]
}

// 聯絡資訊保持靜態
const contactInfo = [
    {
        type: "line",
        label: "LINE 官方帳號",
        value: "@604dpuva",
        qrcode: "https://qr-official.line.me/gs/M_604dpuva_GW.png?oat_content=qr",
        href: "https://line.me/R/ti/p/@604dpuva",
    },
    {
        type: "website",
        label: "官方網站",
        value: "www.sharkjump.example.com",
        href: "#",
    },
]

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // 從 API 載入活動資料
    useEffect(() => {
        async function loadEvents() {
            try {
                const result = await getCachedData('events-data-v1', async () => {
                    const response = await fetch('/api/events')
                    return await response.json()
                })

                if (result.success) {
                    setEvents(result.data)
                } else {
                    setError('載入活動資料失敗')
                }
            } catch (err) {
                console.error('載入活動資料時發生錯誤:', err)
                setError('載入活動資料失敗')
            } finally {
                setLoading(false)
            }
        }

        loadEvents()
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
            <h1 className="text-3xl font-bold text-foreground mb-8 text-center flex items-center justify-center gap-2">
                <span className="text-3xl">🎉</span> 活動資訊
            </h1>

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Events Section */}
                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-primary" />
                        活動公告
                    </h2>

                    {events.map((event) => (
                        <Card key={event.id} className="border-2 overflow-hidden">
                            <CardHeader className="bg-secondary/30">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <Badge className={event.statusColor}>{event.status}</Badge>
                                </div>
                                <CardTitle className="text-xl mt-2">{event.title}</CardTitle>
                                <CardDescription className="flex flex-wrap gap-4 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                      {event.date}
                  </span>
                                    <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                                        {event.location}
                  </span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <p className="text-foreground mb-4 whitespace-pre-line">{event.description}</p>
                                <div className="bg-muted rounded-lg p-4">
                                    <h4 className="font-medium text-foreground mb-2">活動資訊</h4>
                                    <ul className="space-y-1">
                                        {event.highlights.map((highlight, index) => (
                                            <li key={index} className="text-muted-foreground text-sm flex items-center gap-2">
                                                <span className="text-primary">✦</span>
                                                {highlight}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                {/* Contact Section */}
                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                        <MessageCircle className="w-6 h-6 text-primary" />
                        聯絡資訊
                    </h2>

                    <Card className="border-2">
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground mb-6">
                                有任何問題或建議嗎？歡迎透過以下方式聯絡我們！我們很樂意聽到你的聲音 🦈
                            </p>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {contactInfo.map((contact) => (
                                    <a
                                        key={contact.label}
                                        href={contact.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center p-6 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                                    >
                                        {contact.type === "line" && contact.qrcode ? (
                                            <>
                                                <div className="w-32 h-32 mb-4 bg-white rounded-lg p-2">
                                                    <ImageWithLoader
                                                        src={contact.qrcode}
                                                        alt="LINE QR Code"
                                                        width={112}
                                                        height={112}
                                                        className="w-full h-full object-contain"
                                                        containerClassName="w-full h-full"
                                                        overlayClassName="rounded"
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-foreground">
                          {contact.label}
                        </span>
                                                <span className="text-xs text-muted-foreground mt-1 text-center">
                          {contact.value}
                        </span>
                                            </>
                                         ) : contact.type === "website" ? (
                                            <>
                                                <div className="w-32 h-32 mb-4 flex items-center justify-center">
                                                    <Globe className="w-32 h-32 text-primary group-hover:scale-110 transition-transform" />
                                                </div>
                                                <span className="text-sm font-medium text-foreground">
                          {contact.label}
                        </span>
                                                <span className="text-xs text-muted-foreground mt-1 text-center">
                          {contact.value}
                        </span>
                                            </>
                                        ) : null}
                                    </a>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Fun Message */}
                <div className="text-center py-8">
                    <div className="inline-flex items-center gap-2 bg-card px-6 py-3 rounded-full border-2 border-border shadow-sm">
                        <span className="text-2xl">🦈</span>
                        <span className="text-muted-foreground">感謝你的支持！鯊魚和朋友們會繼續努力的！</span>
                        <span className="text-2xl">💕</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
