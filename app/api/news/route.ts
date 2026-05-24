/**
 * 新聞 API 路由
 * 從 Google Sheets 讀取新聞資料
 */

import { NextResponse } from 'next/server'
import { getSheetData, resolveImageUrl } from '@/lib/google-sheets'

export const dynamic = 'force-dynamic' // 強制動態路由，不使用快取

export async function GET() {
  try {
    const data = await getSheetData('News')
    const sortedData = [...data].sort((a: any, b: any) => {
      const aId = parseInt(a.id)
      const bId = parseInt(b.id)
      if (Number.isNaN(aId) && Number.isNaN(bId)) return 0
      if (Number.isNaN(aId)) return 1
      if (Number.isNaN(bId)) return -1
      return aId - bId
    })
    
    // 轉換資料格式以符合前端需求
    const newsItems = sortedData.map((row: any, index: number) => ({
      id: index,
      title: row.title || '',
      description: row.description || '',
      type: row.type || 'announcement',
      date: row.date || '',
      link: row.link || '',
      showDialog: row.showDialog === 'TRUE' || row.showDialog === 'true',
      fullDescription: row.fullDescription ? row.fullDescription.replace(/\\n/g, '\n') : '',
      image: resolveImageUrl(row.image || ''),
    }))

    return NextResponse.json({
      success: true,
      data: newsItems,
    })
  } catch (error) {
    console.error('讀取新聞資料失敗:', error)
    return NextResponse.json(
      {
        success: false,
        error: '讀取新聞資料失敗',
      },
      { status: 500 }
    )
  }
}

