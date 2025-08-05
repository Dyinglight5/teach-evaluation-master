// 组件数据加载优化器
import DBOptimizer from './dbOptimizer'

export class ComponentDataLoader {
  /**
   * 优化后的组件数据加载方法
   * 适用于所有需要加载用户数据和权限的组件
   */
  static async loadComponentData(component: any, dataKeys: string[] = ['hours']) {
    try {
      // 批量获取基础数据
      const storageKeys = ['my_data', 'status', ...dataKeys]
      const storageData = await DBOptimizer.batchGetStorage(storageKeys)
      
      const { my_data, status } = storageData
      
      // 设置基础状态
      if (status) {
        component.setData({ status })
      }
      
      // 设置组件特定数据
      dataKeys.forEach(key => {
        if (storageData[key]) {
          const componentKey = this.getComponentDataKey(key)
          if (componentKey && storageData[key][componentKey]) {
            component.setData({
              [key]: storageData[key][componentKey]
            })
          }
        }
      })
      
      // 处理权限数据（如果需要）
      if (my_data && my_data._id) {
        try {
          const permissionData = await DBOptimizer.getCachedDocument('WorkhoursData', my_data._id)
          
          component.setData({
            modifyPermission: permissionData.modifyPermission,
            modifyPermissionOfResearch: permissionData.modifyPermissionOfResearch
          })
          
          // 计算最终权限
          const hasPermission = this.calculatePermission(
            status,
            permissionData.modifyPermission,
            permissionData.modifyPermissionOfResearch
          )
          
          component.setData({ permission: hasPermission })
        } catch (error) {
          console.warn('获取权限数据失败，使用默认权限:', error)
          component.setData({ permission: status === '教育教学部' })
        }
      }
      
    } catch (error) {
      console.error('组件数据加载失败:', error)
      // 降级处理，只加载基础数据
      this.fallbackLoad(component, dataKeys)
    }
  }

  /**
   * 根据组件类型映射数据键
   */
  private static getComponentDataKey(storageKey: string): string {
    const mapping: { [key: string]: string } = {
      'hours': 'theory_course' // 默认映射，可以根据组件类型扩展
    }
    return mapping[storageKey] || storageKey
  }

  /**
   * 计算用户权限
   */
  private static calculatePermission(
    status: string,
    doctorPermission: boolean,
    researchPermission: boolean
  ): boolean {
    switch (status) {
      case '医生':
        return doctorPermission === true
      case '教研室':
        return researchPermission === true
      case '教育教学部':
        return true
      default:
        return false
    }
  }

  /**
   * 降级加载方法
   */
  private static fallbackLoad(component: any, dataKeys: string[]) {
    console.log('执行降级数据加载')
    
    // 简单加载状态
    wx.getStorage({
      key: 'status',
      success: (res) => {
        component.setData({ status: res.data })
      }
    })
    
    // 加载第一个数据键的数据
    if (dataKeys.length > 0) {
      wx.getStorage({
        key: dataKeys[0],
        success: (res) => {
          const componentKey = this.getComponentDataKey(dataKeys[0])
          if (res.data && res.data[componentKey]) {
            component.setData({
              [dataKeys[0]]: res.data[componentKey]
            })
          }
        }
      })
    }
  }

  /**
   * 针对不同组件类型的专用加载器
   */
  static async loadTheoryCourseData(component: any) {
    return this.loadComponentData(component, ['hours'])
  }

  static async loadTotalHoursData(component: any) {
    return this.loadComponentData(component, ['hours', 'times'])
  }

  static async loadExperimentalLessonData(component: any) {
    return this.loadComponentData(component, ['hours'])
  }

  // 可以继续为其他组件添加专用方法...
}

export default ComponentDataLoader
