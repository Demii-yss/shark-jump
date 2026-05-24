/**
 * 活動 API 路由
 * 從 Google Sheets 讀取活動資料
 */

import { NextResponse } from 'next/server'
import { getSheetData } from '@/lib/google-sheets'

export const dynamic = 'force-dynamic' // 強制動態路由，不使用快取

export async function GET() {
  try {
    // 讀取活動資料
    const eventsData = await getSheetData('Events')
    const sortedData = [...eventsData].sort((a: any, b: any) => {
      const aId = parseInt(a.id)
      const bId = parseInt(b.id)
      if (Number.isNaN(aId) && Number.isNaN(bId)) return 0
      if (Number.isNaN(aId)) return 1
      if (Number.isNaN(bId)) return -1
      return aId - bId
    })

    const events = sortedData.map((row: any, index: number) => {
      // 將 highlights 字串分割成陣列（用換行符號或分號分割）
      const highlights = row.highlights
        ? row.highlights.split(/[\n;]/).filter((h: string) => h.trim())
        : []

      // 將 description 中的 \n 字符串轉換為真正的換行符號
      const description = row.description ? row.description.replace(/\\n/g, '\n') : ''

      return {
        id: index,
        title: row.title || '',
        description: description,
        date: row.date || '',
        location: row.location || '',
        status: row.status || '即將到來',
        statusColor: row.statusColor || 'bg-accent text-accent-foreground',
        highlights: highlights,
      }
    })

    return NextResponse.json({
      success: true,
      data: events,
    })
  } catch (error) {
    console.error('讀取活動資料失敗:', error)
    return NextResponse.json(
      {
        success: false,
        error: '讀取活動資料失敗',
      },
      { status: 500 }
    )
  }
}


