export default {
  // 保存草稿
  saveAsDraft() {
    const database = wx.cloud.database()
    const collection = database.collection('WorkhoursData')

    wx.getStorage({
      key: 'my_data',
      success(res) {
        const _id = res.data._id
        wx.getStorage({
          key: 'hours',
          success(res) {
            collection.doc(_id).update({
              data: {
                hours: res.data,
                submitStatus: 'draft',
                lastSaveTime: new Date().toISOString()
              }
            })
          }
        })
      }
    })
  },

  // 最终提交
  submitAllDataFinal() {
    const database = wx.cloud.database()
    const collection = database.collection('WorkhoursData')

    wx.getStorage({
      key: 'my_data',
      success(res) {
        const _id = res.data._id
        wx.getStorage({
          key: 'hours',
          success(res) {
            collection.doc(_id).update({
              data: {
                hours: res.data,
                submitStatus: 'submitted',
                submitTime: new Date().toISOString()
              }
            })
          }
        })
      }
    })
  },

  // 保持原有的方法以兼容其他地方的调用
  submitAllData() {
    this.submitAllDataFinal()
  }
}