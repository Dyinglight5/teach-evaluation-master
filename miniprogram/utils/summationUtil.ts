//对所有学时进行统计，将和展示并保存
export default {
  sumAllHours() {
    wx.getStorage({
      key: 'hours',
      success(res) {
        let hours: any
        let sum = 0
        hours = res.data
        // console.log(hours);
        //统计总学时的值
        //理论课
        const theory_course = hours['theory_course']
        theory_course.forEach((item: any) => {
          sum = sum + item.coefficient * item.hour
        })
        // console.log(sum);
        
        //实验课
        const experimental_lesson = hours['experimental_lesson']
        experimental_lesson.forEach((item: any) => {
          sum = sum + item.coefficient * item.hour
        })
        // console.log(sum);

        //临床带教
        const clinical_teaching = hours['clinical_teaching']
        clinical_teaching.forEach((item: any) => {
          let times = 0
          item.students.forEach((item: any) => {
            times = times + item.year
          })
          sum = sum + times * item.coefficient
        })
        // console.log(sum);

        //教学管理
        const teaching_management = hours['teaching_management']
        sum = sum + teaching_management[0].coefficient * teaching_management[0].year
        sum = sum + teaching_management[1].coefficient * teaching_management[1].year
        sum = sum + teaching_management[2].coefficient * teaching_management[2].months
        sum = sum + teaching_management[3].coefficient * teaching_management[3].times
        sum = sum + teaching_management[4].coefficient * teaching_management[4].day
    
        teaching_management[5].levels.forEach((item: any) => {
          sum = sum + item.coefficient * item.times
        })
        teaching_management[6].levels.forEach((item: any) => {
          sum = sum + item.coefficient * item.days
        })
        teaching_management[7].levels.forEach((item: any) => {
          sum = sum + item.coefficient * item.times
        })
        teaching_management[8].levels.forEach((item: any) => {
          sum = sum + item.coefficient * item.hours
        })
        sum = sum + teaching_management[9].coefficient * teaching_management[9].times
        sum = sum + teaching_management[10].coefficient * teaching_management[10].months
        // console.log(sum);

        //教学研究
        const teaching_research = hours['teaching_research']
        sum = sum + teaching_research[1].coefficient * teaching_research[1].times
        sum = sum + teaching_research[2].coefficient * teaching_research[2].times
        teaching_research[0].levels.forEach((item: any) => {
          sum = sum + item.coefficient * item.times
        })
        // console.log(sum);

        //荣誉
        const honor = hours['honor']
        sum = sum + honor[0].coefficient * honor[0].times
        honor[1].levels.forEach((item: any) => {
          sum = sum + item.coefficient * item.times
        })
        honor[2].levels.forEach((item: any) => {
          sum = sum + item.coefficient * item.times
        })
        // console.log(sum);

        //其他
        sum = sum + hours['other'][0].hour
        hours.total[0].hour = sum
        // console.log(sum);

        //修改内存中总学时的值
        wx.setStorage({
          key: 'hours',
          data: hours,
          success() {
            wx.getStorage({
              key: 'hours',
              success(res) {
                console.log(res.data);
                
              }
            })
            
          }
        })
      }
    })
  }
}
