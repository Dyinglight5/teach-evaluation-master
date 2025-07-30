// components/OtherHours/OtherHours.ts
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
    status: '',
    remark: '' // 添加备注字段
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event: any) {
      // console.log(event);
      // console.log(this.data.hours);
      const newHours = this.data.hours
      newHours[0].hour = event.detail
      this.setData({
        hours: newHours
      })
      //将修改的数据储存在本地
      wx.getStorage({
        key: 'hours',
        success(res) {
          let hours = res.data
          hours['other'] = newHours
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
    
    // 处理备注输入
    onRemarkChange(event: any) {
      const remarkValue = event.detail;
      this.setData({
        remark: remarkValue
      });
      
      // 更新数据库中的备注
      this.updateRemark(remarkValue);
    },
    
    // 更新备注到数据库和本地存储
    updateRemark(remarkValue: string) {
      const newHours = this.data.hours;
      newHours[0].remark = remarkValue;
      
      this.setData({
        hours: newHours
      });
      
      // 更新本地存储
      wx.getStorage({
        key: 'hours',
        success(res) {
          let hours = res.data;
          hours['other'] = newHours;
          wx.setStorage({
            key: 'hours',
            data: hours
          });
        }
      });
      
      // 更新数据库
      wx.getStorage({
        key: 'my_data',
        success(res) {
          const _id = res.data._id;
          const db = wx.cloud.database();
          db.collection('WorkhoursData').doc(_id).update({
            data: {
              'hours.other': newHours
            }
          });
        }
      });
    }
  },
  lifetimes: {
    created() {
      // 在组件实例被创建时执行
      var that = this;
      wx.getStorage({
        key: 'hours',
        success(res) {
          const otherData = res.data.other;
          // 确保备注字段存在，如果不存在则初始化为空字符串
          if (otherData[0] && !otherData[0].remark) {
            otherData[0].remark = '';
            // 更新本地存储
            let hours = res.data;
            hours['other'] = otherData;
            wx.setStorage({
              key: 'hours',
              data: hours
            });
            // 同时更新数据库
            wx.getStorage({
              key: 'my_data',
              success(userData) {
                const _id = userData.data._id;
                const db = wx.cloud.database();
                db.collection('WorkhoursData').doc(_id).update({
                  data: {
                    'hours.other': otherData
                  }
                });
              }
            });
          }
          
          that.setData({
            hours: otherData,
            remark: otherData[0]?.remark || ''
          }) 
          console.log(that.data);
          
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
