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
    modifyPermission: false,
    modifyPermissionOfResearch: false,
    status: '',
    permission: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

    onChange(event: any) {
      // console.log(event);
      // console.log(this.data.hours);
      
      const index = event.currentTarget.dataset.index;
      const newHours = this.data.hours;
      newHours[index].hour = event.detail
      this.setData({
        hours: newHours
      })
      //将修改的数据储存在本地
      wx.getStorage({
        key: 'hours',
        success(res) {
          let hours = res.data
          hours['theory_course'] = newHours
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
    
  },
  lifetimes: {
    created() {
      // 在组件实例被创建时执行
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
          // console.log(res.data.theory_course);
          
          that.setData({
            hours: res.data.theory_course
          }) 
        }
      })
      
    }
  }
})
