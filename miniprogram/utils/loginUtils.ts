import DBOptimizer from './dbOptimizer'

const db = wx.cloud.database();
const collection = db.collection('WorkhoursData')
const researchCollection = db.collection('ResearchDepartment')
const teachingCollection = db.collection('TeachingDepartment')

export default {
  //通过医生的身份登录 - 优化版本
  async loginAsDoctor(id: any, name: any) {
    try {
      // 清除之前的教研室和教育教学部登录数据
      wx.removeStorage({ key: 'researchName' })
      
      const res = await this.getCollectionDataAsync(collection, { id: id, name: name })
      
      //判断是否登录过
      if (res.data.length != 0) {
        //如果已经登录过，获取之前的信息
        console.log('getPreviousData');
        const doctorData = res.data[0]
        
        // 批量设置存储数据，提高性能
        const storagePromises = [
          DBOptimizer.setStorageAsync('my_data', {
            _id: doctorData._id,
            name: doctorData.name,
            id: doctorData.id
          }),
          DBOptimizer.setStorageAsync('hours', doctorData.hours),
          DBOptimizer.setStorageAsync('exams', doctorData.exams),
          DBOptimizer.setStorageAsync('image', doctorData.image)
        ]
        
        await Promise.all(storagePromises)
      } else {
        wx.showToast({
          title: '请注册系统',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('医生登录失败:', error)
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    }
  },

  //通过教研室的身份登录 - 优化版本
  async loginAsResearch(name: any) {
    try {
      // 清除之前的医生登录数据
      const clearPromises = [
        wx.removeStorage({ key: 'my_data' }),
        wx.removeStorage({ key: 'hours' }),
        wx.removeStorage({ key: 'exams' })
      ]
      
      // 并行执行清除操作（忽略错误）
      await Promise.allSettled(clearPromises)
      
      const res = await this.getCollectionDataAsync(researchCollection, { name: name })
      console.log(res);
      const researchData = res.data[0]
      
      await Promise.all([
        DBOptimizer.setStorageAsync('researchName', researchData.name),
        DBOptimizer.setStorageAsync('image', researchData.image)
      ])
    } catch (error) {
      console.error('教研室登录失败:', error)
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    }
  },

  //通过教学部身份登录 - 优化版本
  async loginAsEducation() {
    try {
      // 清除之前的医生登录数据
      const clearPromises = [
        wx.removeStorage({ key: 'my_data' }),
        wx.removeStorage({ key: 'hours' }),
        wx.removeStorage({ key: 'exams' }),
        wx.removeStorage({ key: 'researchName' })
      ]
      
      // 并行执行清除操作（忽略错误）
      await Promise.allSettled(clearPromises)
      
      const res = await this.getCollectionDataAsync(teachingCollection, {})
      console.log(res);
      const teachingData = res.data[0]
      
      await DBOptimizer.setStorageAsync('image', teachingData.image)
    } catch (error) {
      console.error('教育教学部登录失败:', error)
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    }
  },

  // 工具方法：Promise化的数据库查询
  getCollectionDataAsync(collection: any, whereCondition: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (Object.keys(whereCondition).length > 0) {
        collection.where(whereCondition).get({
          success: resolve,
          fail: reject
        })
      } else {
        collection.get({
          success: resolve,
          fail: reject
        })
      }
    })
  }
}