/**
 * Google Sheets API 客戶端工具
 * 用於從 Google Sheets 讀取資料
 */

import { google } from 'googleapis'

// 從環境變數取得 Google API 憑證
const getGoogleAuth = () => {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  
  if (!email || !privateKey) {
    throw new Error('缺少 Google API 憑證環境變數')
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: email,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })
}

// 從指定的工作表讀取資料
export async function getSheetData(sheetName: string) {
  try {
    const auth = getGoogleAuth()
    const sheets = google.sheets({ version: 'v4', auth })
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID

    if (!spreadsheetId) {
      throw new Error('缺少 GOOGLE_SPREADSHEET_ID 環境變數')
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:Z1000`, // 讀取 A1 到 Z1000 範圍
    })

    const rows = response.data.values || []
    
    if (rows.length === 0) {
      return []
    }

    // 第一行作為標題
    const headers = rows[0]
    
    // 將其餘行轉換為物件陣列
    const data = rows.slice(1).map((row) => {
      const obj: Record<string, any> = {}
      headers.forEach((header, index) => {
        obj[header] = row[index] || ''
      })
      return obj
    })

    return data
  } catch (error) {
    console.error(`讀取工作表 "${sheetName}" 時發生錯誤:`, error)
    throw error
  }
}

// 從 Config 工作表讀取設定值，支援 key/value 結構與單列欄位結構
export async function getConfigValue(key: string): Promise<string | undefined> {
  try {
    const rows = await getSheetData('Config')
    const normalizedKey = key.trim().toLowerCase()

    for (const row of rows) {
      const rowKey = String(row.key ?? row.name ?? row.setting ?? '').trim().toLowerCase()
      if (rowKey === normalizedKey) {
        return String(row.value ?? row.config ?? row.data ?? '').trim()
      }

      const matchedEntry = Object.entries(row).find(
        ([entryKey]) => entryKey.trim().toLowerCase() === normalizedKey
      )

      if (matchedEntry) {
        return String(matchedEntry[1] ?? '').trim()
      }
    }

    return undefined
  } catch (error) {
    console.error(`讀取 Config 設定 ${key} 失敗:`, error)
    return undefined
  }
}

// 轉換圖片 ID/路徑為完整 URL
export function resolveImageUrl(imageValue: string): string {
  if (!imageValue || !imageValue.trim()) {
    return ''
  }

  const trimmed = imageValue.trim()

  const driveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/)
  if (driveMatch?.[1]) {
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w2000`
  }

   const driveOpenMatch = trimmed.match(/[?&]id=([^&]+)/)
   if (trimmed.includes('drive.google.com') && driveOpenMatch?.[1]) {
     return `https://drive.google.com/thumbnail?id=${driveOpenMatch[1]}&sz=w2000`
   }

  // 如果已經是完整 URL（http:// 或 https://），直接返回
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }

  // 如果是本地路徑（以 / 開頭），直接返回
  if (trimmed.startsWith('/')) {
    return trimmed
  }

  // 否則當作 Google Drive File ID，轉換為 Google Drive URL
  return `https://drive.google.com/thumbnail?id=${trimmed}&sz=w2000`
}

// 驗證 Google Sheets 連線
export async function validateConnection() {
  try {
    const auth = getGoogleAuth()
    const sheets = google.sheets({ version: 'v4', auth })
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID

    if (!spreadsheetId) {
      throw new Error('缺少 GOOGLE_SPREADSHEET_ID 環境變數')
    }

    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    })

    return {
      success: true,
      title: response.data.properties?.title,
      sheets: response.data.sheets?.map((sheet) => sheet.properties?.title),
    }
  } catch (error) {
    console.error('驗證 Google Sheets 連線失敗:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知錯誤',
    }
  }
}




