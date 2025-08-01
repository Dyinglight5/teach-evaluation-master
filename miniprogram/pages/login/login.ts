// pages/register/register.ts
import loginUtils from '../../utils/loginUtils';

const researchOptions = require('../../public/researchOptions')

const options = researchOptions.default


Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    name: '',
    password: '',
    show: false,
    options,
    statusValue: '',
    cascaderValue: '',
    passwordCorrect: false
  },
  //展示选择身份的弹窗
  onClick() {
    this.setData({
      show: true,
    });
  },
  //关闭选择身份的弹窗
  onClose() {
    this.setData({
      show: false,
    });
  },
  //选择身份完毕之后
  onFinish(e: any) {
    const { selectedOptions, value } = e.detail;
    // console.log(selectedOptions);
    if (selectedOptions.length == 1) {
      if (selectedOptions[0].text == '教育教学部') {
        this.setData({
          name: '教育教学部'
        })
      }
      this.setData({
        statusValue: selectedOptions[0].text,
        cascaderValue: value
      })
    } else {
      this.setData({
        statusValue: selectedOptions[0].text + ' / ' + selectedOptions[1].text,
        cascaderValue: value,
        name: selectedOptions[1].text
      })
    }

    this.onClose()
  },

  //检验是否为空
  checkIfNull() {
    //将身份分离出来
    const statusArr = this.data.statusValue.split(' / ');

    if (this.data.password.trim() == '') {
      return true
    }

    if (statusArr[0] == '医生' && (this.data.name.trim() == '' || this.data.id.trim() == '')) {
      return true
    }

    return false

  },
  //进行身份和密码的校验
  checkPassword(callback: any) {
    let that = this
    const db = wx.cloud.database();
    const collection = db.collection('WorkhoursData');
    const researchCollection = db.collection('ResearchDepartment')
    const teachingCollection = db.collection('TeachingDepartment')
    //将身份分离出来
    const statusArr = this.data.statusValue.split(' / ');
    console.log(statusArr, this.data.password);
    if (statusArr.length == 1) {
      if (statusArr[0] == '教育教学部') {
        teachingCollection.get({
          success(res: any) {
            if (that.data.password == res.data[0].password){
              that.setData({
                passwordCorrect: true
              })
            }
          }
        })
      } else if (statusArr[0] == '医生') {
        collection.where({
          id: that.data.id
        }).get({
          success(res: any) {
            if (that.data.password == res.data[0].password){
              that.setData({
                passwordCorrect: true
              })
            }
          }
        })
      }
    } else if (statusArr.length == 2) {
      //如果是教研部
      researchCollection.where({
        name: statusArr[1]
      }).get({
        success(res: any) {
          console.log(res);
          const researchData = res.data
          // return;
          researchData.forEach((item: any) => {
            if (item.password == that.data.password) {
              //成功之后的逻辑
              that.data.passwordCorrect = true
            }
          })
        }
      })
    }
    callback()
  },

  //提交登录
  submit() {
    const that = this
    //检验输入是否为空
    if (this.checkIfNull()) {
      wx.showToast({
        title: '输入不能为空',
        icon: 'none'
      })
      return;
    }

    //进行密码校验
    this.checkPassword(function() {
      setTimeout(() => {
        that.login()
      }, 1000)
    })

  },

  login() {
    if (!this.data.passwordCorrect) {
      // console.log('this');
      
      wx.showToast({
        title: '密码输入错误',
        icon: 'none'
      })
      return;
    }
    console.log('登录成功');
    // return;
    
    //先把身份信息储存在本地
    const statusArr = this.data.statusValue.split(' / ');
    wx.setStorage({
      key: 'status',
      data: statusArr[0]
    })
    //检验通过的时候，处理相关的逻辑
    if (statusArr[0] == '医生') {
      loginUtils.loginAsDoctor(this.data.id, this.data.name)
    } else {
      if (statusArr[0] == '教研室') {
        loginUtils.loginAsResearch(statusArr[1])
      } else if (statusArr[0] == '教育教学部') {
        loginUtils.loginAsEducation()
      }
    }
    
    wx.showToast({
      title: '登录成功',
      icon: 'success'
    })
    
    // 延迟跳转，确保数据保存完成
    setTimeout(() => {
      wx.switchTab({
        url: '../index/index',
        success: () => {
          // 跳转成功后，通过事件或者重新加载来刷新首页数据
          const pages = getCurrentPages();
          const indexPage = pages.find(page => page.route === 'pages/index/index');
          if (indexPage) {
            // 如果首页已经存在，直接调用onLoad方法刷新数据
            indexPage.onLoad();
          }
        }
      })
    }, 1000)
  },

  //号码记录
  idChange(event: any) {
    this.setData({
      id: event.detail.value
    })

  },

  //姓名记录
  nameChange(event: any) {
    this.setData({
      name: event.detail.value
    })

  },

  //密码记录
  onPasswordChange(event: any) {
    this.setData({
      password: event.detail.value
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