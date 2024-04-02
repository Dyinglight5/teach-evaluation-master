// pages/home/home.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: '',
    name: '',
    id: '',
    image: 'https://ts3.cn.mm.bing.net/th?id=OIP-C.g5M-iZUiocFCi9YAzojtRAAAAA&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2'
  },
  //展示教学量文件
  ViewPDF(){
    wx.cloud.downloadFile({
      fileID: "cloud://cloud1-5g9hp9d4688324e0.636c-cloud1-5g9hp9d4688324e0-1321670010/大连医科大学附属第一医院文件.pdf", // 云文件路径
      success: res => {
        // 下载成功后的临时路径
        console.log('下载文件成功', res.tempFilePath);
        wx.openDocument({
          filePath: res.tempFilePath,
          fileType: 'pdf',
          success: function () {
            console.log('打开PDF成功');
          },
          fail: function (err) {
            console.error('打开PDF失败', err);
          }
        });
      },
      fail: err => {
        console.error('下载文件失败', err);
      }
    });
  },
  //选择文件
  chooseExceldoc() {
    let that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        let path = res.tempFiles[0].path;
        console.log("选择excel成功", path)
        that.uploadExceldoc(path);
      }
    })
  },

  //上传文件到云存储
  uploadExceldoc(path: any) {
    let that = this
    wx.cloud.uploadFile({
      cloudPath: new Date().getTime() + '.xls',
      filePath: path,
      success: res => {
        console.log("上传成功", res.fileID)
        that.genxindoc(res.fileID)
      },
      fail: err => {
        console.log("上传失败", err)
      }
    })
  },

  //更新数据
  genxindoc(fileId: any) {
    wx.cloud.callFunction({
      name: "initDoctors",
      data: {
        fileID: fileId
      },
      success(res) {
        console.log("解析成功", res)
        wx.showToast({
          title: '上传成功',
          icon: 'success'
        })
      },
      fail(res) {
        console.log("解析失败", res)
      }
    })
  },


  chooseExcelstu() {
    let that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        let path = res.tempFiles[0].path;
        console.log("选择excel成功", path)
        that.uploadExcelstu(path);
      }
    })
  },

  //上传文件到云存储
  uploadExcelstu(path:any) {
    let that = this
    wx.cloud.uploadFile({
      cloudPath: new Date().getTime() + '.xls',
      filePath: path,
      success: res => {
        console.log("上传成功", res.fileID)
        that.genxinstu(res.fileID)
      },
      fail: err => {
        console.log("上传失败", err)
      }
    })
  },
  genxinstu(fileId:any) {
    wx.cloud.callFunction({
      name: "initstudents",
      data: {
        fileID: fileId
      },
      success(res) {
        console.log("解析成功", res.result)
        wx.showToast({
          title: '上传成功',
          icon: 'success'
        })
      },
      fail(res) {
        console.log("解析失败", res)
      }
    })
  },



  changeImage() {
    const that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success(res) {
        const image = res.tempFiles[0].tempFilePath
        that.setData({
          image: image
        })
        const db = wx.cloud.database()
        const collection = db.collection('WorkhoursData')
        const researchCollection = db.collection('ResearchDepartment')
        const teachingCollection = db.collection('TeachingDepartment')
        if (that.data.status == '医生') {
          collection.where({
            id: that.data.id
          }).get({
            success(res) {
              const _id = res.data[0]._id
              collection.doc(_id).update({
                data: {
                  image: image
                }
              })
            }
          })
        } else if (that.data.status == '教研部') {
          researchCollection.where({
            name: that.data.name
          }).get({
            success(res) {
              const _id = res.data[0]._id
              researchCollection.doc(_id).update({
                data: {
                  image: image
                }
              })
            }
          })
        } else if (that.data.status == '教学部') {
          teachingCollection.get({
            success(res) {
              const _id = res.data[0]._id
              teachingCollection.doc(_id).update({
                data: {
                  image: image
                }
              })
            }
          })
        }
      }
    })

  },

  //添加学生
  goToAddStudent() {
    wx.navigateTo({
      url: '../home/addStudent/addStudent'
    })
  },

  getSum() {
    const summationUtil = require('../../utils/summationUtil')
    summationUtil.default.sumAllHours()
    setTimeout(() => {
      wx.getStorage({
        key: 'hours',
        success(res) {
          console.log('getSum', res.data.total[0].hour);
          // require('../../utils/submitDatabase')
          // summationUtil.default.submitAllData()
          console.log("success submit");

        }
      })
    }, 500)

  },

  onAddTest() {
    // return;
    const doctorData = require('../../public/hoursInitialization.json.js')

    console.log(doctorData.default);
    const doctor = doctorData.default
    const db = wx.cloud.database()
    db.collection('WorkhoursData').add({
      data: doctor,
      success() {
        console.log('add database success');

      }
    })
  },

  //测试添加数据用
  onTest() {
    // return;
    const db = wx.cloud.database()
    db.collection('WorkhoursData').where({
      id: '001'
    }).get({
      success(res) {
        console.log('add success');
        console.log(res.data);

        const doctor = res.data[0];
        wx.setStorage({
          key: 'my_data',
          data: {
            _id: doctor._id,
            name: doctor.name,
            id: doctor.id
          }
        })
        wx.setStorage({
          key: 'hours',
          data: doctor.hours
        })
        wx.setStorage({
          key: 'exams',
          data: doctor.exams
        })
      }
    })





  },

  //跳转到修改密码页面
  goToChangePassword() {
    wx.navigateTo({
      url: './changePassword/changePassword'
    })
  },

  //跳转到登录页面
  goToLogin() {
    wx.navigateTo({
      url: '../login/login'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let that = this
    wx.getStorage({
      key: 'image',
      success(res) {
        that.setData({
          image: res.data
        })
      }
    })
    wx.getStorage({
      key: 'status',
      success(res) {
        console.log(res.data);

        const status = res.data
        that.setData({
          status: status
        })
        if (status == '教研部') {
          wx.getStorage({
            key: 'researchName',
            success(res) {
              that.setData({
                name: res.data
              })
            }
          })
          
        } else if (status == '医生') {
          wx.getStorage({
            key: 'my_data',
            success(res) {
              const doctorData = res.data
              that.setData({
                name: doctorData.name,
                id: doctorData.id
              })
            }
          })
        }
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