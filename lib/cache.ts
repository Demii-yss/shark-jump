/**
 * API 資料快取管理工具
 */

interface CacheItem<T> {
  data: T
  timestamp: number
}

// 快取儲存
const cache = new Map<string, CacheItem<any>>()
const pendingRequests = new Map<string, Promise<any>>()

// 快取有效時間（毫秒）- 預設 5 分鐘
const CACHE_DURATION = 5 * 60 * 1000

/**
 * 從快取取得資料，如果沒有或過期則執行 fetcher
 */
export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  duration: number = CACHE_DURATION
): Promise<T> {
  const cached = cache.get(key)
  const now = Date.now()

  // 如果快取存在且未過期，返回快取資料
  if (cached && now - cached.timestamp < duration) {
    return cached.data
  }

  const pending = pendingRequests.get(key)
  if (pending) {
    return pending
  }

  // 否則重新取得資料
  const request = fetcher()
    .then((data) => {
      cache.set(key, { data, timestamp: Date.now() })
      return data
    })
    .finally(() => {
      pendingRequests.delete(key)
    })

  pendingRequests.set(key, request)
  return request
}



