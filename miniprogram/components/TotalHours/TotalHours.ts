// components/TotalHours/TotalHours.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    hours: [],
    times:[],
    department:'',
    jobtitle:'',
    needtime:0,
    status: '',
    modifyPermission: true,
    modifyPermissionOfResearch: true,
    mapping: {
      '内科': { '正高': 60, '副高': 60, '中级': 40, '初级': 20 },
      '外科': { '正高': 60, '副高': 60, '中级': 40, '初级': 20 },
      '妇产科': { '正高': 60, '副高': 60, '中级': 40, '初级': 20 },
      '儿科': { '正高': 60, '副高': 60, '中级': 40, '初级': 20 },
      '神经精神': { '正高': 60, '副高': 60, '中级': 40, '初级': 20 },
      '中西医结合': { '正高': 60, '副高': 60, '中级': 40, '初级': 20 },
      '眼': { '正高': 30, '副高': 30, '中级': 20, '初级': 15 },
      '耳鼻喉': { '正高': 30, '副高': 30, '中级': 20, '初级': 15 },
      '皮肤': { '正高': 30, '副高': 30, '中级': 20, '初级': 15 },
      '肿瘤': { '正高': 30, '副高': 30, '中级': 20, '初级': 15 },
      '急诊': { '正高': 30, '副高': 30, '中级': 20, '初级': 15 },
      '感染': { '正高': 30, '副高': 30, '中级': 20, '初级': 15 },
      '重症': { '正高': 30, '副高': 30, '中级': 20, '初级': 15 },
      '中医': { '正高': 30, '副高': 30, '中级': 20, '初级': 15 },
      '康复': { '正高': 30, '副高': 30, '中级': 20, '初级': 15 },
      '针灸': { '正高': 30, '副高': 30, '中级': 20, '初级': 15 },
      '全科': { '正高': 30, '副高': 30, '中级': 20, '初级': 15 },
      '老年': { '正高': 30, '副高': 30, '中级': 20, '初级': 15 },
      '麻醉': { '正高': 30, '副高': 30, '中级': 20, '初级': 15 },
      '口腔': { '正高': 30, '副高': 30, '中级': 20, '初级': 15 },
      '检验': { '正高': 30, '副高': 30, '中级': 20, '初级': 15 },
      '超声': { '正高': 30, '副高': 30, '中级': 20, '初级': 15 },
      '放射诊断': { '正高': 30, '副高': 30, '中级': 20, '初级': 15 },
      '影像技术': { '正高': 15, '副高': 15, '中级': 10, '初级': 5 },
      '核医学': { '正高': 15, '副高': 15, '中级': 10, '初级': 5 },
      '病理': { '正高': 15, '副高': 15, '中级': 10, '初级': 5 },
      '临床药学': { '正高': 10, '副高': 10, '中级': 10, '初级': 5 },
      '营养': { '正高': 10, '副高': 10, '中级': 10, '初级': 5 },
      '健康管理': { '正高': 10, '副高': 10, '中级': 10, '初级': 5 },
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    confirmByResearch() {
      let that = this
      wx.getStorage({
        key: 'my_data',
        success(res) {
          const _id = res.data._id
          const db = wx.cloud.database()
          db.collection('WorkhoursData').doc(_id).update({
            data: {
              modifyPermission: false
            },
            success() {
              that.setData({
                modifyPermission: false
              })
            }
          })
        }
      })
    },

    confirmByTeaching() {
      let that = this
      wx.getStorage({
        key: 'my_data',
        success(res) {
          const _id = res.data._id
          const db = wx.cloud.database()
          db.collection('WorkhoursData').doc(_id).update({
            data: {
              modifyPermissionOfResearch: false
            },
            success() {
              that.setData({
                modifyPermissionOfResearch: false
              })
            }
          })
        }
      })
    },

    submit() {
      const submitDatabase = require('../../utils/submitDatabase')
      submitDatabase.default.submitAllData()
      wx.showToast({
        title: '提交成功',
        icon: 'success'
      })
    },

    changeJobTitle(e) {
      const index = e.detail.value; // 这是索引值 0, 1, 2
      const titleOptions = ['正高', '副高', '中级','初级'];
      const newTitle = titleOptions[index]; // 将索引转换为实际职称名称
      const that = this;
      
      // 更新本地数据
      that.setData({
        jobtitle: newTitle
      });
      
      // 重新计算需要的学时
      const department = that.data.department;
      const time = that.data.mapping[department]?.[newTitle];
      const needtime = time !== undefined ? time : 0;
      
      that.setData({
        needtime: needtime
      });
      
      
      // 保存到数据库
      wx.getStorage({
        key: 'my_data',
        success(res) {
          const _id = res.data._id;
          const db = wx.cloud.database();
          
          // 更新职称信息
          db.collection('WorkhoursData').doc(_id).update({
            data: {
              'hours.job.1.hour': newTitle // 假设 job[1] 是职称信息
            },
            success() {
              // 显示成功提示
              wx.showToast({
                title: '职称已更新',
                icon: 'success',
                duration: 2000
              });
              
              // 更新小程序存储的数据
              wx.getStorage({
                key: 'hours',
                success(hoursRes) {
                  const hours = hoursRes.data;
                  hours.job[1].hour = newTitle;
                  
                  wx.setStorage({
                    key: 'hours',
                    data: hours
                  });
                }
              });
            },
            fail() {
              wx.showToast({
                title: '更新失败',
                icon: 'none',
                duration: 2000
              });
            }
          });
        }
      });
    }
  },
  // lifetimes: {
  //   created() {
  //     // 在组件实例被创建时执行
  //     const summationUtil = require('../../utils/summationUtil')
  //     summationUtil.default.sumAllHours()
  //     var that = this;
  //     wx.getStorage({
  //       key: 'my_data',
  //       success(res) {
  //         const _id = res.data._id
  //         const db = wx.cloud.database()
  //         db.collection('WorkhoursData').doc(_id).get({
  //           success(res) {
  //             that.setData({
  //               modifyPermission: res.data.modifyPermission,
  //               modifyPermissionOfResearch: res.data.modifyPermissionOfResearch
  //             })
  //             console.log(that.data);
              
  //           }
  //         })
  //       }
  //     })
  //     wx.getStorage({
  //       key: 'hours',
  //       success(res) {
  //         const hours1 = res.data.total[0];
  //         const times1 = res.data.total[1];
  //         // const department1 = res.data.job[0];
  //         // const jobtitle1 = res.data.job[1];
  //         // const result = this.data.mapping[department1]?.[jobtitle1];
  //         // 计算hourDifference
  //         let hourDifference = times1.hour - hours1.hour;
  //         hourDifference = hourDifference > 0 ? hourDifference : 0;
  //         hourDifference = parseFloat(hourDifference.toFixed(1));//保留一位小数
  //         that.setData({
  //           department:res.data.job[0],
  //           jobtitle:res.data.job[1],
  //           hours: res.data.total[0],
  //           times: res.data.total[1],
  //           hourDifference: hourDifference,
  //         })
  //       }
  //     })
  //     wx.getStorage({
  //       key: 'status',
  //       success(res) {
  //         that.setData({
  //           status: res.data
  //         })
  //       }
  //     })
  //     在这里写一段代码，完成这个功能，mapping[department.hour]?.[jobtitle.hour];，并且将匹配到的值赋值给needtime
  //   }
  // }
  
  created() {
    // 已有的初始化代码
    const summationUtil = require('../../utils/summationUtil')
    summationUtil.default.sumAllHours()
    var that = this;
    wx.getStorage({
      key: 'my_data',
      success(res) {
        const _id = res.data._id
        const db = wx.cloud.database()
        db.collection('WorkhoursData').doc(_id).get({
          success(res) {
            that.setData({
              modifyPermission: res.data.modifyPermission,
              modifyPermissionOfResearch: res.data.modifyPermissionOfResearch
            })
            console.log(that.data);
          }
        })
      }
    })
  
    wx.getStorage({
      key: 'hours',
      success(res) {
        const hours = res.data.total[0];
        const times = res.data.total[1];
        let hourDifference = times.hour - hours.hour;

        hourDifference = hourDifference > 0 ? hourDifference : 0;
        hourDifference = parseFloat(hourDifference.toFixed(1)); // 保留一位小数
  
        // 新代码，基于部门和职称查找 needtime
        const department_all = res.data.job[0];
        const jobtitle_all = res.data.job[1];
        const department = department_all.hour;
        const jobtitle = jobtitle_all.hour;
  
        that.setData({
          department: department,
          jobtitle: jobtitle,
          hours: hours,
          times: times,
          hourDifference: hourDifference,
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
    // 结束新代码，计算并设置 needtime
  },
  ready: function() {
    // 从组件的data中获取department和jobtitle
    const department = this.data.department;
    const jobtitle = this.data.jobtitle;
    const titleOptions = ['正高', '副高', '中级','初级'];
    
    // 计算当前职称的索引
    const jobTitleIndex = titleOptions.indexOf(jobtitle);
    
    // 使用department和jobtitle来查找mapping中对应的时间
    const time = this.data.mapping[department as keyof typeof this.data.mapping]?.[jobtitle as '正高' | '副高' | '中级' |'初级'];
  
    // 检查是否找到了对应的时间，如果没有找到，可以根据需要设置一个默认值
    const needtime = time !== undefined ? time : 0; // 如果没有找到对应的时间，这里示例将needtime设置为0
  
    // 将查找到的时间（或默认值）赋值给needtime
    this.setData({
      needtime: needtime,
      titleOptions: titleOptions,
      jobTitleIndex: jobTitleIndex >= 0 ? jobTitleIndex : 0 // 如果找不到，默认选第一个
    });

  }
},
)


