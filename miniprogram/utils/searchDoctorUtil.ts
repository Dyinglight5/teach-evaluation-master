export default {
  searchDoctor(name: any, studentID: any) {
    console.log(name);
    const db = wx.cloud.database();
    // 首先，通过姓名查询
    db.collection('WorkhoursData').where({
      name: name
    }).get().then(res => {
      console.log(res.data);
      // 如果没有查询到任何医生信息
      if (res.data.length === 0) {
        wx.showToast({
          title: '没有这个医生',
          icon: 'error'
        });
      } else if (res.data.length === 1) {
        // 如果恰好查询到一个医生，直接使用这个医生的信息
        wx.showToast({
          title: '搜索成功',
          icon: 'success'
        });
        this.storeDoctorInfo(res.data[0]);
      } else {
        // 如果查询到多个医生
        if (!studentID) {
          // 如果学号为空，提示用户需要同时输入姓名和学号
          wx.showToast({
            title: '有同名医生，请同时输入姓名和医生号进行搜索',
            icon: 'none'
          });
        } else {
          // 如果学号非空，使用姓名和学号进行二次查询
          db.collection('WorkhoursData').where({
            name: name,
            id: studentID // 确保字段名称与数据库一致
          }).get().then(secondRes => {
            if (secondRes.data.length > 0) {
              // 如果根据学号找到医生
              wx.showToast({
                title: '搜索成功',
                icon: 'success'
              });
              this.storeDoctorInfo(secondRes.data[0]);
            } else {
              // 如果根据学号没有找到医生
              wx.showToast({
                title: '没有找到匹配的医生号',
                icon: 'error'
              });
            }
          });
        }
      }
    }).catch(err => {
      console.error(err);
      wx.showToast({
        title: '查询出错',
        icon: 'error'
      });
    });
  },

  // 用于存储医生信息的函数
  storeDoctorInfo(doctor: any) {
    wx.setStorage({
      key: 'my_data',
      data: {
        _id: doctor._id,
        name: doctor.name,
        id: doctor.id
      }
    });
    wx.setStorage({
      key: 'hours',
      data: doctor.hours
    });
    wx.setStorage({
      key: 'exams',
      data: doctor.exams
    });
  }
}
// export default {
//   searchDoctor(id: any, ) {
//     const db = wx.cloud.database()
//     db.collection('WorkhoursData').where({
//       id: id
//     }).get({
//       success(res) {
//         console.log(res.data);
//         if (res.data.length == 0) {
//           wx.showToast({
//             title: '没有这个医生号',
//             icon: 'error'
//           })
//           return;
//         }        
//         wx.showToast({
//           title: '搜索成功',
//           icon: 'success'
//         })

//         const doctor = res.data[0];
//         wx.setStorage({
//           key: 'my_data',
//           data: {
//             _id: doctor._id,
//             name: doctor.name,
//             id: doctor.id
//           }
//         })
//         wx.setStorage({
//           key: 'hours',
//           data: doctor.hours
//         })
//         wx.setStorage({
//           key: 'exams',
//           data: doctor.exams
//         })
//       }
//     })

//   }
// }