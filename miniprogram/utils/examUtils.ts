const db = wx.cloud.database();
const examCollection = db.collection('exam');
const doctorCollection = db.collection('WorkhoursData')

export default {
  //教研室添加考试
  addExam(name: any, data: any, time: any, personCeiling: any) {
    examCollection.add({
      data: {
        name: name,
        time: data + ' ' + time,
        personCount: 0,
        personCeiling: parseInt(personCeiling)
      }
    })
  },
  //医生申请考试
  applyExam(name: any, time: any, _id: any) {
    //考试信息的数据库中人数加1
    examCollection.where({
      name: name,
      time: time
    }).get({
      success(res) {
        const _id = res.data._id
        const personCount = res.data.personCount
        examCollection.doc(_id).update({
          data: {
            personCount: personCount + 1
          }
        })
      }
    })
    //医生数据库中添加上相应的考试信息
    doctorCollection.doc(_id).get({
      success(res) {
        const newExams = res.data.exams
        newExams.push({
          name: name,
          time: time
        })
        wx.setStorage({
          key: 'exams',
          data: newExams
        })
        doctorCollection.doc(_id).update({
          data: {
            exams: newExams
          }
        })
      }
    })
  },
  //医生取消申请
  cancelExam(name: any, time: any, _id: any) {
    //考试信息的数据库中人数减1
    examCollection.where({
      name: name,
      time: time
    }).get({
      success(res) {
        const _id = res.data._id
        const personCount = res.data.personCount
        examCollection.doc(_id).update({
          data: {
            personCount: personCount - 1
          }
        })
      }
    })
    //医生数据库中删除上相应的考试信息
    doctorCollection.doc(_id).get({
      success(res) {
        const newExams = res.data.exams
        let index = 0
        for (let i = 0; i < newExams.length; i++) {
          if (newExams[i].time == time && newExams[i].name == name) {
            index = i
            break
          }
        }
        newExams.splice(index, 1)
        wx.setStorage({
          key: 'exams',
          data: newExams
        })
        doctorCollection.doc(_id).update({
          data: {
            exams: newExams
          }
        })
      }
    })
  }
  
}