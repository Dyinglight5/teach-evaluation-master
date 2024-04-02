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
    hourDifference: 0,
    status: '',
    modifyPermission: true,
    modifyPermissionOfResearch: true
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
    }
  },
  lifetimes: {
    created() {
      // 在组件实例被创建时执行
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
          
          const hours1 = res.data.total[0];
          const times1 = res.data.total[1];
          // 计算hourDifference
          let hourDifference = times1.hour - hours1.hour;
          hourDifference = hourDifference > 0 ? hourDifference : 0;

          that.setData({
            hours: res.data.total[0],
            times: res.data.total[1],
            hourDifference: hourDifference
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
    }
  }
})
