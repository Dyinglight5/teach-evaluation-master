// pages/home/changePassword/changePassword.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    originPassword: '',
    newPassword: '',
    againPassword: '',
    errMsg: ''
  },

  onChangeOriginPassword(event: any) {
    this.setData({
      originPassword: event.detail
    })
  },

  onChangeNewPassword(event: any) {
    this.setData({
      newPassword: event.detail
    })
    if (this.data.againPassword !== '') {
      if (this.data.newPassword !== this.data.againPassword) {
        this.setData({
          errMsg: '两次输入不一致'
        })
      } else {
        this.setData({
          errMsg: ''
        })
      }
    }
  },

  onChangeAgainPassword(event: any) {
    this.setData({
      againPassword: event.detail
    })
    if (this.data.newPassword !== this.data.againPassword) {
      this.setData({
        errMsg: '两次输入不一致'
      })
    } else {
      this.setData({
        errMsg: ''
      })
    }
  },

  submit() {
    //判断是否为空
    if (this.data.originPassword.trim() == '' || this.data.newPassword.trim() == '' || this.data.againPassword.trim() == '') {
      wx.showToast({
        title: '输入不能为空',
        icon: 'error'
      })
      return;
    }
    let that = this
    const db = wx.cloud.database();

    const collection = db.collection('WorkhoursData');

    wx.getStorage({
      key: 'my_data',
      success(res) {
        const _id = res.data._id
        //首先进行密码校验
        collection.doc(_id).get({
          success(res) {
            const password = res.data.password
            if (that.data.originPassword !== password) {
              wx.showToast({
                title: '密码输入错误',
                icon: 'error'
              })
              return;
            }

            //然后校验两次输入密码是否一致
            if (that.data.newPassword !== that.data.againPassword) {
              wx.showToast({
                title: '两次输入不一致',
                icon: 'error'
              })
            }            
            //最后修改密码
            collection.doc(_id).update({
              data: {
                password: that.data.newPassword
              }
            })

            wx.navigateBack({
              delta: 1
            })

          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

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