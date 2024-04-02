// pages/teach/teach.ts
const teachdb = wx.cloud.database();
const studentCollection = teachdb.collection('students');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    minDate: new Date(2020, 0, 1).getTime(),
    maxDate: new Date(2030, 0, 31).getTime(),
    showCalendar:false,
    studentName: '',
    studentNumber: '',
    begintime:'',
    endtime:'',
    //是否冲突
    timeconflicts:false,
    //带教时间
    teachtime:0,
    //存放从数据库获取的数据
    teachlist:[],
    //是否找到学生
    findstudent:false,
  },
  //打开日历窗口
  onOpenCalendar() {
    this.setData({
      showCalendar: true
    })
  },
  //关闭日历窗口
  onCloseCalendar() {
    this.setData({ showCalendar: false });
  },
  //点击日历的确认
  onConfirmCalendar(event: any) {
    console.log(event);
    return
    const [start, end] = event.detail;
    //直接四舍五入转换到了学时
    var days = parseInt(((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)).toString()) + 1;
    var teachtime1 = days / 21
    var teachtime2 = parseFloat(teachtime1.toFixed())
    //console.log(teachtime2)
    this.setData({
      showCalendar: false,
      //时间赋值
      begintime: start,
      endtime: end,
      teachtime: teachtime2,
    });
    //计算带教天数
    //console.log(days)
  },
  //添加学生
  // addteachtime() {
  //   const that = this
  //   let datas = this.data.teachlist[0].newtime;
  //   //console.log(this.data.begintime)
  //   //console.log(this.data.endtime)
  //   for (var index in datas) {
  //     console.log(index + ' 开始时间：' + datas[index].begin + ' 结束时间：' + datas[index].end);
  //     //console.log(this.data.begintime > datas[index].end)
  //     //console.log( this.data.endtime < datas[index].begin)
  //     if (this.data.begintime > datas[index].end || this.data.endtime < datas[index].begin) {
  //       console.log('无冲突')
  //     }
  //     else {
  //       this.setData({
  //         timeconflicts: true
  //         //冲突
  //       })
  //       console.log('冲突')
  //     }
  //   }
  //   console.log('timeconflicts', this.data.timeconflicts)
  //   if (this.data.timeconflicts) {
  //     console.log(this.data.timeconflicts)
  //     console.log('添加失败')
  //     wx.showModal({
  //       title: '添加失败',
  //       content: '该同学该时间段已存在带教',
  //       success: function (res) {
  //         if (res.confirm) {//这里是点击了确定以后
  //           console.log('用户点击确定')
  //         } else {//这里是点击了取消以后
  //           console.log('用户点击取消')
  //         }
  //       }
  //     })
  //   }
  //   else {
  //     //输入正确，添加数据库，同时给老师时间
  //     // 已经添加了数据库，但是没有给老师赋值
  //     console.log('添加成功')
  //     teachCollection.where({
  //       studentName: this.data.studentName,
  //       studentNumber: this.data.studentNumber
  //     }).get({
  //       success(res) {
  //         const _id = res.data._id
  //         teachCollection.doc(_id).update({
  //           data: {
  //             newtime: db.command.push({ begin: that.data.begintime, end: that.data.endtime })
  //           }
  //         })
  //       }
  //     })
  //     wx.showModal({
  //       title: '添加成功',
  //       success: function (res) {
  //         if (res.confirm) {//这里是点击了确定以后
  //           console.log('用户点击确定')
  //         } else {//这里是点击了取消以后
  //           console.log('用户点击取消')
  //         }
  //       }
  //     })
  //   }

  // },
  //查看数据库中有没有该学生
  // findstu() {
  //   const that = this
  //   teachCollection.where({
  //     studentName: this.data.studentName,
  //     studentNumber: this.data.studentNumber
  //   }).get({
  //       success: res => {
  //         console.log(res.data.length);
  //         if (res.data.length == 1) {
  //           that.setData({
  //             teachlist: res.data,
  //             findstudent: true
  //           })
  //         }
  //         else {
  //           wx.showModal({
  //             title: '未找到该同学',
  //             success: function (res) {
  //               if (res.confirm) {//这里是点击了确定以后
  //                 console.log('用户点击确定')
  //               } else {//这里是点击了取消以后
  //                 console.log('用户点击取消')
  //               }
  //             }
  //           })
  //         }
  //       }
  //     });
  //   console.log('findstudent', this.data.findstudent)
  //   //存在异步问题
  //   if (this.data.findstudent) {
  //     this.addteachtime()
  //   }
  // },

  //输入学生姓名
  onChangeStudentName(event: any) {
    console.log(event);
    
    this.setData({
      studentName: event.detail
    })
  },
  //输入学生学号
  onChangeStudentNumber(event: any) {
    console.log(event);

    this.setData({
      studentNumber: event.detail
    })
    console.log(this.data.studentNumber);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  }
})