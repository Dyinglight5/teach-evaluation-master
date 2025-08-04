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
    showEndDate: false,
    // 新增：学生信息查询结果
    studentInfo: null as any,
    // 新增：重复录入检查结果
    duplicateCheckResult: null as any
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

  // 查询学生信息
  queryStudentInfo() {
    const studentId = this.data.id;
    if (!studentId) {
      wx.showToast({
        title: '请输入学生学号',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    const db = wx.cloud.database();
    const studentsCollection = db.collection('students');
    
    studentsCollection.where({
      id: studentId
    }).get({
      success: (result: any) => {
        if (result.data.length > 0) {
          const studentInfo = result.data[0];
          this.setData({
            studentInfo: studentInfo
          });
          wx.showToast({
            title: '查询成功',
            icon: 'success',
            duration: 2000
          });
        } else {
          this.setData({
            studentInfo: null
          });
          wx.showToast({
            title: '未找到该学生',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: (error: any) => {
        console.error('查询学生信息失败:', error);
        wx.showToast({
          title: '查询失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  // 检查重复录入
  checkDuplicateStudent() {
    const studentId = this.data.id;
    if (!studentId) {
      wx.showToast({
        title: '请输入学生学号',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    const db = wx.cloud.database();
    const studentsCollection = db.collection('students');
    
    // 查询是否已存在该学生
    studentsCollection.where({
      id: studentId
    }).get({
      success: (result: any) => {
        if (result.data.length > 0) {
          const existingStudent = result.data[0];
          this.setData({
            duplicateCheckResult: {
              isDuplicate: true,
              existingRecord: existingStudent
            }
          });
          wx.showToast({
            title: '该学生已存在',
            icon: 'none',
            duration: 2000
          });
        } else {
          this.setData({
            duplicateCheckResult: {
              isDuplicate: false,
              existingRecord: null
            }
          });
          wx.showToast({
            title: '学生不存在，可以添加',
            icon: 'success',
            duration: 2000
          });
        }
      },
      fail: (error: any) => {
        console.error('检查重复录入失败:', error);
        wx.showToast({
          title: '检查失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  addStudent() {
    // 检查输入是否为空
    if (!this.data.name || !this.data.id) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 如果已经检查过重复且发现重复，需要用户确认
    if (this.data.duplicateCheckResult && this.data.duplicateCheckResult.isDuplicate) {
      wx.showModal({
        title: '重复提醒',
        content: '该学生已存在，是否确认添加？',
        success: (res) => {
          if (res.confirm) {
            this.performAddStudent();
          }
        }
      });
    } else {
      // 先检查是否重复，然后再添加
      this.checkBeforeAdd();
    }
  },

  // 添加前检查重复
  checkBeforeAdd() {
    const db = wx.cloud.database();
    const studentsCollection = db.collection('students');
    
    studentsCollection.where({
      id: this.data.id
    }).get({
      success: (result: any) => {
        if (result.data.length > 0) {
          wx.showModal({
            title: '重复提醒',
            content: '该学生已存在，是否确认添加？',
            success: (res) => {
              if (res.confirm) {
                this.performAddStudent();
              }
            }
          });
        } else {
          this.performAddStudent();
        }
      },
      fail: (error: any) => {
        console.error('检查重复失败:', error);
        // 检查失败也继续添加
        this.performAddStudent();
      }
    });
  },

  // 执行添加学生操作
  performAddStudent() {
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