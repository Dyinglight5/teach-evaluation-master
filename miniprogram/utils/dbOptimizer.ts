// 数据库优化工具类
export class DBOptimizer {
  private static cache: Map<string, { data: any, timestamp: number }> = new Map()
  private static CACHE_DURATION = 30000 // 30秒缓存

  /**
   * Promise化的getStorage
   */
  static getStorageAsync(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: key,
        success: (res) => resolve(res.data),
        fail: reject
      })
    })
  }

  /**
   * Promise化的setStorage
   */
  static setStorageAsync(key: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key: key,
        data: data,
        success: () => resolve(),
        fail: reject
      })
    })
  }

  /**
   * 批量获取Storage数据
   */
  static async batchGetStorage(keys: string[]): Promise<{ [key: string]: any }> {
    const promises = keys.map(key => 
      this.getStorageAsync(key).catch(() => null)
    )
    
    const results = await Promise.all(promises)
    const dataMap: { [key: string]: any } = {}
    
    keys.forEach((key, index) => {
      dataMap[key] = results[index]
    })
    
    return dataMap
  }

  /**
   * 带缓存的数据库查询
   */
  static async getCachedDocument(collection: string, docId: string): Promise<any> {
    const cacheKey = `${collection}_${docId}`
    const cached = this.cache.get(cacheKey)
    
    // 检查缓存是否有效
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      return cached.data
    }

    // 从数据库获取
    return new Promise((resolve, reject) => {
      const db = wx.cloud.database()
      db.collection(collection).doc(docId).get({
        success: (res) => {
          // 更新缓存
          this.cache.set(cacheKey, {
            data: res.data,
            timestamp: Date.now()
          })
          resolve(res.data)
        },
        fail: reject
      })
    })
  }

  /**
   * 清除缓存
   */
  static clearCache() {
    this.cache.clear()
  }

  /**
   * 清除过期缓存
   */
  static clearExpiredCache() {
    const now = Date.now()
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.cache.delete(key)
      }
    }
  }
}

export default DBOptimizer
