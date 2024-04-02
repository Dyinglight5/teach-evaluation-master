// pages/change/change.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hour: 0,
    name: '',
    index: 0,
    value: 0,
    hours: {} as any,
    _id: ''
  },

  submit() {
    //找到上一个页面对象
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    this.data.hours[this.data.name][this.data.index - 1].hour = this.data.value
    wx.setStorage({
      key: 'hours',
      data: this.data.hours
    })


    const db = wx.cloud.database();
    const def =  db.collection('WorkhoursData').doc(this.data._id);
    def.update({
      data: {
        hours: this.data.hours
      }
    })

    wx.navigateBack({
      delta: 1,
      success() {
        if (prevPage == undefined || prevPage  == null) return;
        prevPage.reload();
      }
    })
    
  },

  onChange(event: any) {
    // event.detail 为当前输入的值
    if (event.detail) {
      const value = parseInt(event.detail)
      this.setData({
      value: value
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    this.setData({
      name: e.name
    })
    if (e.hour != undefined) {
      this.setData({
        hour: parseInt(e.hour),
        value: parseInt(e.hour)
      })
    }
    if (e.index != undefined) {
      this.setData({
        index: parseInt(e.index)
      })
    }

    //从本地获取相关数据
    let that = this;
    wx.getStorage({
      key: 'hours',
      success(res) {
        that.setData({
          hours: res.data
        })
        
      }
    })

    wx.getStorage({
      key: 'my_data',
      success(res) {
        that.setData({
          _id: res.data._id
        })
      }
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