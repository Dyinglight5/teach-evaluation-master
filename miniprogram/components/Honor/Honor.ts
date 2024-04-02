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

    getPermission() {
      const status = this.data.status
      const doctor = this.data.modifyPermission
      const research = this.data.modifyPermissionOfResearch
      this.setData({
        permission: (status == '医生' && doctor) || (status == '教研室' && research) || (status == '教育教学部')
      })
    },

    onChangeHours(event: any) {
      // console.log(event);
      const index = event.currentTarget.dataset.index;
      const newHours = this.data.hours;
      newHours[index].times = event.detail
      this.setData({
        hours: newHours
      })
      this.processData()
      //将修改的数据储存在本地
      wx.getStorage({
        key: 'hours',
        success(res) {
          let hours = res.data
          hours['honor'] = newHours
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
      newHours[id - 1].levels[index].times = event.detail
      this.setData({
        hours: newHours
      })
      this.processData()
      //将数据储存在本地
      wx.getStorage({
        key: 'hours',
        success(res) {
          let hours = res.data
          hours['honor'] = newHours
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
      data[0].hour = data[0].coefficient * data[0].times
      let sum = 0
      data[1].levels.forEach((item: any) => {
        sum = sum + item.coefficient * item.times
      })
      data[1].hour = sum
      sum = 0
      data[2].levels.forEach((item: any) => {
        sum = sum + item.coefficient * item.times
      })
      data[2].hour = sum

      this.setData({
        hours: data
      })

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
            hours: res.data.honor
          })
          that.processData()
        }
      })

    }
  }
})
