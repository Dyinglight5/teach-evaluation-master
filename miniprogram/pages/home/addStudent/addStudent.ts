// pages/home/addStudent/addStudent.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    id: '',
    beginTime: new Date().getTime(),
    beginDate: '',
    endTime: new Date().getTime(),
    endDate: '',
    minTime: new Date(2023, 0).getTime(),
    showBeginDate: false,
    showEndDate: false
  },

  onDisplayBeginDate() {
    this.setData({
      showBeginDate: true
    })
  },
  onDisplayEndDate() {
    this.setData({
      showEndDate: true
    })
  },
  onCloseBeginDate() {
    this.setData({
      showBeginDate: false
    })
  },
  onCloseEndDate() {
    this.setData({
      showEndDate: false
    })
  },

  onInputBeginDate(event: any) {
    const date = new Date(event.detail)
    this.setData({
      beginTime: event.detail,
      beginDate: date.getFullYear() + '-' + ((date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1))
    })
  },

  onInputEndDate(event: any) {
    const date = new Date(event.detail)
    this.setData({
      endTime: event.detail,
      endDate: date.getFullYear() + '-' + ((date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1))
    });
  },

  onChangeStudentName(event: any) {
    this.setData({
      name: event.detail
    })
  },

  onChangeStudentNumber(event: any) {
    this.setData({
      id: event.detail
    })
  },

  addStudent() {
    //unavailableDate
    const db = wx.cloud.database();
    const studentCollection = db.collection('students');
    
    studentCollection.add({
      data: {
        name: this.data.name,
        id: this.data.id,
        beginDate: this.data.beginDate,
        endDate: this.data.endDate,
        unavailableDates: []
      },
      success: res => {
        // 数据添加成功
        console.log('添加成功', res);
  
        // 弹出提示框
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 1000, // 提示持续的时间
          complete: () => {
            // 延时1秒后返回上一页
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              });
            }, 1000);
          }
        });
      },
      fail: err => {
        // 数据添加失败
        console.error('添加失败', err);
  
        // 弹出提示框
        wx.showToast({
          title: '添加失败',
          icon: 'none',
          duration: 1000 // 提示持续的时间
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const date = new Date(this.data.beginTime)
    this.setData({
      beginDate: date.getFullYear() + '-' + ((date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)),
      endDate: date.getFullYear() + '-' + ((date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1))
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})