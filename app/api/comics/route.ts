/**
 * 漫畫 API 路由
 * 從 Google Sheets 讀取漫畫資料
 */

import { NextResponse } from 'next/server'
import { getConfigValue, getSheetData, resolveImageUrl } from '@/lib/google-sheets'

export const dynamic = 'force-dynamic' // 強制動態路由，不使用快取

export async function GET() {
  try {
    const [data, configTotalChapters] = await Promise.all([
      getSheetData('Comics'),
      getConfigValue('comicsTotalChapters'),
    ])

    const sortedData = [...data].sort((a: any, b: any) => {
      const aId = parseInt(a.id)
      const bId = parseInt(b.id)
      if (Number.isNaN(aId) && Number.isNaN(bId)) return 0
      if (Number.isNaN(aId)) return 1
      if (Number.isNaN(bId)) return -1
      return aId - bId
    })

    // 轉換資料格式以符合前端需求
    const comics = sortedData.map((row: any, index: number) => ({
      id: index,
      title: row.title || '',
      description: row.description || '',
      image: resolveImageUrl(row.image || ''),
    })).sort((a, b) => a.id - b.id)

    const parsedTotalChapters = parseInt(configTotalChapters || '')
    const totalChapters = Number.isNaN(parsedTotalChapters)
      ? comics.length
      : Math.max(parsedTotalChapters, comics.length)

    return NextResponse.json({
      success: true,
      data: comics,
      totalChapters,
    })
  } catch (error) {
    console.error('讀取漫畫資料失敗:', error)
    return NextResponse.json(
      {
        success: false,
        error: '讀取漫畫資料失敗',
      },
      { status: 500 }
    )
  }
}






