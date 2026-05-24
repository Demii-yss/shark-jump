/**
 * 角色 API 路由
 * 從 Google Sheets 讀取角色資料
 */

import { NextResponse } from 'next/server'
import { getSheetData, resolveImageUrl } from '@/lib/google-sheets'

export const dynamic = 'force-dynamic' // 強制動態路由，不使用快取

export async function GET() {
  try {
    const data = await getSheetData('Characters')
    const sortedData = [...data].sort((a: any, b: any) => {
      const aId = parseInt(a.id)
      const bId = parseInt(b.id)
      if (Number.isNaN(aId) && Number.isNaN(bId)) return 0
      if (Number.isNaN(aId)) return 1
      if (Number.isNaN(bId)) return -1
      return aId - bId
    })

    // 轉換資料格式以符合前端需求
    const characters = sortedData.map((row: any, index: number) => ({
      id: index,
      name: row.name || '',
      image: resolveImageUrl(row.image || ''),
      description: row.description || '',
      fullDescription: row.fullDescription ? row.fullDescription.replace(/\\n/g, '\n') : '',
      color: row.color || 'bg-gray-100 hover:bg-gray-200',
      locked: row.locked === 'TRUE' || row.locked === 'true',
    }))

    return NextResponse.json({
      success: true,
      data: characters,
    })
  } catch (error) {
    console.error('讀取角色資料失敗:', error)
    return NextResponse.json(
      {
        success: false,
        error: '讀取角色資料失敗',
      },
      { status: 500 }
    )
  }
}

