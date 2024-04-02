export default {
  searchDoctor(id: any) {
    const db = wx.cloud.database()
    db.collection('WorkhoursData').where({
      id: id
    }).get({
      success(res) {
        console.log(res.data);
        if (res.data.length == 0) {
          wx.showToast({
            title: '没有这个医生号',
            icon: 'error'
          })
          return;
        }        
        wx.showToast({
          title: '搜索成功',
          icon: 'success'
        })

        const doctor = res.data[0];
        wx.setStorage({
          key: 'my_data',
          data: {
            _id: doctor._id,
            name: doctor.name,
            id: doctor.id
          }
        })
        wx.setStorage({
          key: 'hours',
          data: doctor.hours
        })
        wx.setStorage({
          key: 'exams',
          data: doctor.exams
        })
      }
    })

  }
}