export default {
  submitAllData() {
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
                hours: res.data
              }
            })
          }
        })
      }
    })
  }
}