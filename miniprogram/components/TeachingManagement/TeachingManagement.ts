// components/TheoryCourse.ts
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
    hours: [] as any,
    activeNames: ['1'],
    modifyPermission: false,
    modifyPermissionOfResearch: false,
    status: '',
    permission: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

    onChangeHours(event: any) {
      // console.log(event);
      const index = event.currentTarget.dataset.index;
      const newHours = this.data.hours;
      if (newHours[index].times != null) {
        newHours[index].times = event.detail  
      } else if (newHours[index].day != null) {
        newHours[index].day = event.detail
      } else if (newHours[index].month != null) {
        newHours[index].month = event.detail
      } else if (newHours[index].year != null) {
        newHours[index].year = event.detail
      } else if (newHours[index].months != null) {
        newHours[index].months = event.detail
      }
      this.setData({
        hours: newHours
      })
      this.processData()
      //将修改的数据储存在本地
      wx.getStorage({
        key: 'hours',
        success(res) {
          let hours = res.data
          hours['teaching_management'] = newHours
          wx.setStorage({
            key: 'hours',
            data: hours,
            success() {
              const summationUtil = require('../../utils/summationUtil')
              summationUtil.default.sumAllHours()
            }
          })
        }
      })
      
    },

    onChange(event: any) {
      this.setData({
        activeNames: event.detail,
      });
    },

    onChangeStepper(event: any) {
      // console.log(event);
      const id = event.currentTarget.dataset.id
      const index = event.currentTarget.dataset.index
      let newHours = this.data.hours
      const data = newHours[id - 1].levels[index]
      if (data.times != null) {
        newHours[id - 1].levels[index].times = event.detail
      } else if (data.days != null) {
        newHours[id - 1].levels[index].days = event.detail
      } else if (data.hours != null) {
        newHours[id - 1].levels[index].hours = event.detail
      }
      this.setData({
        hours: newHours
      })
      this.processData()
      //将数据储存在本地
      wx.getStorage({
        key: 'hours',
        success(res) {
          let hours = res.data
          hours['teaching_management'] = newHours
          wx.setStorage({
            key: 'hours',
            data: hours,
            success() {
              const summationUtil = require('../../utils/summationUtil')
              summationUtil.default.sumAllHours()
            }
          })
        }
      })
    },

    //处理数据，计算出学时
    processData() {
      let data = this.data.hours;
      data[0].hour = data[0].coefficient * data[0].year
      data[1].hour = data[1].coefficient * data[1].year
      data[2].hour = data[2].coefficient * data[2].month
      data[3].hour = data[3].coefficient * data[3].times
      data[4].hour = data[4].coefficient * data[4].day
      let sum = 0
      data[5].levels.forEach((item: any) => {
        sum = sum + item.coefficient * item.times
      })
      data[5].hour = sum
      sum = 0
      data[6].levels.forEach((item: any) => {
        sum = sum + item.coefficient * item.days
      })
      data[6].hour = sum
      sum = 0
      data[7].levels.forEach((item: any) => {
        sum = sum + item.coefficient * item.times
      })
      data[7].hour = sum
      sum = 0
      data[8].levels.forEach((item: any) => {
        sum = sum + item.coefficient * item.hours
      })
      data[8].hour = sum
      data[9].hour = data[9].coefficient * data[9].times
      data[10].hour = data[10].coefficient * data[10].months

      this.setData({
        hours: data
      })
      // console.log(data);
      
    }
  },
  lifetimes: {
    created() {
      //获取修改权限
      let that = this
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
              wx.getStorage({
                key: 'status',
                success(res) {
                  that.setData({
                    status: res.data
                  })
                  const status = that.data.status
                  const doctor = that.data.modifyPermission
                  const research = that.data.modifyPermissionOfResearch
                  if ((status == '医生' && doctor == true) || (status == '教研室' && research == true) || (status == '教育教学部')) {
                    that.setData({
                      permission: true
                    })
                  }
                }
              })
            }
          })
        }
      })
      wx.getStorage({
        key: 'hours',
        success(res) {
          // console.log(res.data.clinical_teaching);

          that.setData({
            hours: res.data.teaching_management
          })
          that.processData()
        }
      })


    }
  }
})
