// pages/apply/apply.ts
const db = wx.cloud.database();
const examCollection = db.collection('exam');
const doctorCollection = db.collection('WorkhoursData')
const exam = require('../../utils/examUtils')
const examUtils = exam.default
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //控制弹窗展示
    showConfirmApplyExamPopup: false,
    showCancelApplyPopup: false,
    examlist: [] as any,
    time: '',
    timelist: [] as any,
    mytimelist: [] as any,
    status: '',
    showAddExam: false,
    //输入考试内容
    addExamName: '',
    //选择年月日
    currentDate: new Date().getTime(),
    addDate: '',
    minDate: new Date().getTime(),
    //选择时间
    currentTime: '12:00',
    minHour: 7,
    maxHour: 22,
    //人数上限
    addExamPersonCeiling: '',
    myExams: [] as any,
    //我的信息(医生端)
    my_data: {} as any,
    applyExamTime: '',
    applyExamName: '',
    timeConflictFlag: false
  },

  //打开添加考试场次的窗口
  onOpenAddExam() {
    this.setData({
      showAddExam: true
    })
  },
  //关闭取消申请的弹窗
  onCloseCancelApplyPopup() {
    this.setData({ showCancelApplyPopup: false });
  },
  //关闭添加考试场次的窗口
  onCloseAddExam() {
    this.setData({
      showAddExam: false
    })
  },
  //打开申请的弹窗
  showApplyExamPopup: function (event: any) {
    this.setData({
      showConfirmApplyExamPopup: true,
      applyExamName: event.currentTarget.dataset.applyexamname,
      applyExamTime: event.currentTarget.dataset.applyexamtime
    })

  },
  //关闭申请的弹窗
  closeConfirmApplyExamPopup() {
    this.setData({
      showConfirmApplyExamPopup: false
    })
  },
  //展示取消申请弹窗
  onShowCancelApplyPopup: function (event: any) {
    this.setData({
      showCancelApplyPopup: true,
      _id: event.currentTarget.dataset._id
    })
  },
  //输入人数上限
  onChangeExamPersonCeiling(event: any) {
    this.setData({
      addExamPersonCeiling: event.detail
    })
  },
  // 输入考试名称
  onChangeAddExamName(event: any) {
    this.setData({
      addExamName: event.detail
    })
  },
  // 输入时间
  onInputTime(event: any) {
    this.setData({
      currentTime: event.detail,
    });
  },
  // 输入日期
  onInputDate(event: any) {
    const time = event.detail;
    const date = new Date(time)
    // 获取特定格式的日期
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 加1是因为月份是从0开始计算的，padStart用来确保是两位数
    const day = date.getDate().toString().padStart(2, '0');
    this.setData({
      currentDate: time,
      addDate: `${year}-${month}-${day}`
    });
  },

  //添加考试场次
  addExam() {
    //首先检查输入是否为空
    if (this.data.addExamName == '' || this.data.addExamPersonCeiling == '') {
      wx.showToast({
        title: '输入不能为空',
        icon: 'error'
      })
      return
    }
    //添加考试场次到数据库
    examUtils.addExam(this.data.addExamName, this.data.addDate, this.data.currentTime, this.data.addExamPersonCeiling)
    console.log(this.data.addDate + ' ' + this.data.currentTime);
    //输入置空
    this.setData({
      showAddExam: false,
      addExamName: '',
      addExamPersonCeiling: '',
      currentDate: new Date().getTime()
    })

  },
  //获取考试场次数据
  getexamData() {
    let that = this;
    examCollection.get({
      success: (res) => {
        this.setData({
          examlist: res.data,
        })
        wx.getStorage({
          key: 'status',
          success(res) {
            const status = res.data
            that.setData({
              status: status
            })
            //如果身份是医生
            if (status == '医生') {
              wx.getStorage({
                key: 'exams',
                success(res) {
                  const myExams = res.data;
                  that.setData({
                    myExams: myExams
                  })

                  //遍历将考试信息进行更新
                  for (let j = 0; j < that.data.examlist.length; j++) {
                    that.data.examlist[j].state = false
                    if (myExams) {
                      for (let i = 0; i < myExams.length; i++) {
                        if (myExams[i].name == that.data.examlist[j].name && myExams[i].time == that.data.examlist[j].time) {
                          that.data.examlist[j].state = true
                        }
                      }
                    }
                  }

                  that.setData({
                    examlist: that.data.examlist
                  })
                  console.log(that.data.examlist);

                }
              })
            }
          }
        })
      }
    })
  },
  //判断是否时间冲突
  checkIfTimeConflict() {
    let that = this
    doctorCollection.doc(that.data.my_data._id).get({
      success(res) {
        const exams = res.data.exams
        for (let i = 0; i < exams.length; i++) {
          if (exams[i].time == that.data.applyExamTime) {
            that.setData({
              timeConflictFlag: true
            })
          }
        }
      }
    })

  },
  
  // 确认申请按钮点击事件
  onConfirmApplyExam() {
    wx.showToast({
      title: '申请成功',
      icon: 'success'
    })
    //判断是否时间冲突
    this.checkIfTimeConflict()
    if (this.data.timeConflictFlag) {
      wx.showToast({
        title: '时间冲突',
        icon: 'error'
      })
      return
    }
    //更新数据库中的数据
    examUtils.applyExam(this.data.applyExamName, this.data.applyExamTime, this.data.my_data._id)
    // 关闭弹窗
    this.closeConfirmApplyExamPopup()
    //重新加载数据
    this.onLoad()
  },

  // 确认取消按钮点击事件
  onConfirmCancelApply() {
    wx.showToast({
      title: '取消成功',
      icon: 'success'
    })
    //更新数据库中的数据
    examUtils.cancelExam(this.data.applyExamName, this.data.applyExamTime, this.data.my_data._id)
    // 关闭弹窗
    this.onCloseCancelApplyPopup()
    //重新加载数据
    this.onLoad()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let that = this
    this.getexamData();
    wx.getStorage({
      key: 'my_data',
      success(res) {
        that.setData({
          my_data: res.data
        })
      }
    })
    wx.getStorage({
      key: 'status',
      success(res) {
        that.setData({
          status: res.data
        })
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.onLoad()
    wx.stopPullDownRefresh()
  }
})