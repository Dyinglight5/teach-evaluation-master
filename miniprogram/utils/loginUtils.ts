const db = wx.cloud.database();
const collection = db.collection('WorkhoursData')
const researchCollection = db.collection('ResearchDepartment')
const teachingCollection = db.collection('TeachingDepartment')
export default {
  //通过医生的身份登录
  loginAsDoctor(id: any, name: any) {
    // 清除之前的教研室和教育教学部登录数据
    wx.removeStorage({
      key: 'researchName'
    })
    
    collection.where({
      id: id,
      name: name
    }).get({
      success(res) {
        //判断是否登录过
        if (res.data.length != 0) {
          //如果已经登录过，获取之前的信息
          console.log('getPreviousData');
          collection.where({
            id: id,
            name: name
          }).get({
            success(res) {
              console.log(res);
              const doctorData = res.data[0]
              wx.setStorage({
                key: 'my_data',
                data: {
                  _id: doctorData._id,
                  name: doctorData.name,
                  id: doctorData.id
                }
              })
              wx.setStorage({
                key: 'hours',
                data: doctorData.hours
              })
              wx.setStorage({
                key: 'exams',
                data: doctorData.exams
              })
              wx.setStorage({
                key: 'image',
                data: doctorData.image
              })
            }
          })

        } else {
          wx.showToast({
            title: '请注册系统',
            icon: 'none'
          })
        }
      }
    })
  },

  //通过教研室的身份登录
  loginAsResearch(name: any) {
    // 清除之前的医生登录数据
    wx.removeStorage({
      key: 'my_data'
    })
    wx.removeStorage({
      key: 'hours'
    })
    wx.removeStorage({
      key: 'exams'
    })
    
    researchCollection.where({
      name: name
    }).get({
      success(res) {
        console.log(res);
        const researchData = res.data[0]
        wx.setStorage({
          key: 'researchName',
          data: researchData.name
        })
        wx.setStorage({
          key: 'image',
          data: researchData.image
        })
      }
    })

  },

  //通过教学部身份登录
  loginAsEducation() {
    // 清除之前的医生登录数据
    wx.removeStorage({
      key: 'my_data'
    })
    wx.removeStorage({
      key: 'hours'
    })
    wx.removeStorage({
      key: 'exams'
    })
    wx.removeStorage({
      key: 'researchName'
    })
    
    teachingCollection.get({
      success(res) {
        console.log(res);
        const teachingData = res.data[0]
        wx.setStorage({
          key: 'image',
          data: teachingData.image
        })
      }
    })
  },



}