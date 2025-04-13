// components/TheoryCourse.ts
const data = wx.cloud.database();
const teachCollection = data.collection('teach');
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
    _id:'',
    activeNames: ['1'],
    modifyPermission: false,
    modifyPermissionOfResearch: false,
    status: '',
    permission: false,
    studentName: '',
    studentNumber: '',
    //是否冲突
    timeconflicts: false,
    //带教时间
    teachtime: 0,
    //存放从数据库获取的数据
    teachlist: [] as any,
    //是否找到学生
    findstudent: false,
    showAddStudent: false,
    beginTime: new Date().getTime(),
    endTime: new Date().getTime(),
    selectedTime: new Date().getTime(),
    beginDate: '',
    endDate: '',
    selectedDate: '',
    minTime: new Date(2023, 0).getTime(),
    showBeginDate: false,
    showEndDate: false,
    showDate: false,
    addStudentId: 1,
    //带教的时间（年份）
    studentYear: '1',
    //带教的时间（天数）
    studentDays: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    //id 1-3 输入学生的年份
    // onDeleteStudent1(event: WechatMiniprogram.TouchEvent): void {
    //   const studentId = event.currentTarget.dataset.id as string;  // 明确类型为string
    //   // console.log("要删除的学生ID是：" + studentId);
      
    //   // 定义云数据库和目标集合
    //   const db = wx.cloud.database();
    //   const teachCollection = db.collection('WorkhoursData');
      
    //   // 获取_id值
    //   const _id = this.data._id;
    
    //   // 检查_id是否存在
    //   if (!_id) {
    //     console.error("未指定有效的文档ID");
    //     wx.showToast({
    //       title: '未指定文档ID',
    //       icon: 'none',
    //       duration: 2000
    //     });
    //     return;
    //   }
    
    //   // 尝试获取文档
    //   teachCollection.doc(_id).get().then(res => {
    //     console.log('找到文档：', res.data);
    //     // 继续进行删除操作
    //     const updateCommand = db.command;
    //     teachCollection.doc(_id).update({
    //       data: {
    //         "hours.clinical_teaching.0.students": updateCommand.pull({
    //           id: studentId  // 根据 id 匹配并删除该学生
    //         })
    //       }
    //     }).then(res => {
    //       if (res.stats.updated) {
    //         console.log('学生删除成功');
    //         wx.showToast({
    //           title: '删除成功',
    //           icon: 'success',
    //           duration: 2000
    //         });
    //         // 更新本地数据
    //         this.data.hours.forEach((item: any, index: number) => {
    //           if (item.students) {
    //             const idx = item.students.findIndex((s: any) => s.id === studentId);
    //             if (idx !== -1) {
    //               item.students.splice(idx, 1);  // 从数组中移除学生
    //               this.setData({ [`hours[${index}]`]: item });  // 更新数据绑定
    //             }
    //           }
    //         });
    //         this.processData();  // 重新计算时间
    //       } else {
    //         console.log('未找到匹配的学生或删除失败');
    //         wx.showToast({
    //           title: '删除失败',
    //           icon: 'none',
    //           duration: 2000
    //         });
    //       }
    //     }).catch(err => {
    //       console.error("更新文档时发生错误：", err);
    //       wx.showToast({
    //         title: '更新过程出错',
    //         icon: 'none',
    //         duration: 2000
    //       });
    //     });
    //   }).catch(err => {
    //     console.error("未找到指定的文档：", err);
    //     wx.showToast({
    //       title: '未找到文档',
    //       icon: 'none',
    //       duration: 2000
    //     });
    //   });
    // },
    // onDeleteStudent2(event: WechatMiniprogram.TouchEvent): void {
    //   const studentId = event.currentTarget.dataset.id as string;  // 明确类型为string
    //   // console.log("要删除的学生ID是：" + studentId);
      
    //   // 定义云数据库和目标集合
    //   const db = wx.cloud.database();
    //   const teachCollection = db.collection('WorkhoursData');
      
    //   // 获取_id值
    //   const _id = this.data._id;
    
    //   // 检查_id是否存在
    //   if (!_id) {
    //     console.error("未指定有效的文档ID");
    //     wx.showToast({
    //       title: '未指定文档ID',
    //       icon: 'none',
    //       duration: 2000
    //     });
    //     return;
    //   }
    
    //   // 尝试获取文档
    //   teachCollection.doc(_id).get().then(res => {
    //     console.log('找到文档：', res.data);
    //     // 继续进行删除操作
    //     const updateCommand = db.command;
    //     teachCollection.doc(_id).update({
    //       data: {
    //         "hours.clinical_teaching.1.students": updateCommand.pull({
    //           id: studentId  // 根据 id 匹配并删除该学生
    //         })
    //       }
    //     }).then(res => {
    //       if (res.stats.updated) {
    //         console.log('学生删除成功');
    //         wx.showToast({
    //           title: '删除成功',
    //           icon: 'success',
    //           duration: 2000
    //         });
    //         // 更新本地数据
    //         this.data.hours.forEach((item: any, index: number) => {
    //           if (item.students) {
    //             const idx = item.students.findIndex((s: any) => s.id === studentId);
    //             if (idx !== -1) {
    //               item.students.splice(idx, 1);  // 从数组中移除学生
    //               this.setData({ [`hours[${index}]`]: item });  // 更新数据绑定
    //             }
    //           }
    //         });
    //         this.processData();  // 重新计算时间
    //       } else {
    //         console.log('未找到匹配的学生或删除失败');
    //         wx.showToast({
    //           title: '删除失败',
    //           icon: 'none',
    //           duration: 2000
    //         });
    //       }
    //     }).catch(err => {
    //       console.error("更新文档时发生错误：", err);
    //       wx.showToast({
    //         title: '更新过程出错',
    //         icon: 'none',
    //         duration: 2000
    //       });
    //     });
    //   }).catch(err => {
    //     console.error("未找到指定的文档：", err);
    //     wx.showToast({
    //       title: '未找到文档',
    //       icon: 'none',
    //       duration: 2000
    //     });
    //   });
    // },
    // onDeleteStudent3(event: WechatMiniprogram.TouchEvent): void {
    //   const studentId = event.currentTarget.dataset.id as string;  // 明确类型为string
    //   // console.log("要删除的学生ID是：" + studentId);
      
    //   // 定义云数据库和目标集合
    //   const db = wx.cloud.database();
    //   const teachCollection = db.collection('WorkhoursData');
      
    //   // 获取_id值
    //   const _id = this.data._id;
    
    //   // 检查_id是否存在
    //   if (!_id) {
    //     console.error("未指定有效的文档ID");
    //     wx.showToast({
    //       title: '未指定文档ID',
    //       icon: 'none',
    //       duration: 2000
    //     });
    //     return;
    //   }
    
    //   // 尝试获取文档
    //   teachCollection.doc(_id).get().then(res => {
    //     console.log('找到文档：', res.data);
    //     // 继续进行删除操作
    //     const updateCommand = db.command;
    //     teachCollection.doc(_id).update({
    //       data: {
    //         "hours.clinical_teaching.2.students": updateCommand.pull({
    //           id: studentId  // 根据 id 匹配并删除该学生
    //         })
    //       }
    //     }).then(res => {
    //       if (res.stats.updated) {
    //         console.log('学生删除成功');
    //         wx.showToast({
    //           title: '删除成功',
    //           icon: 'success',
    //           duration: 2000
    //         });
    //         // 更新本地数据
    //         this.data.hours.forEach((item: any, index: number) => {
    //           if (item.students) {
    //             const idx = item.students.findIndex((s: any) => s.id === studentId);
    //             if (idx !== -1) {
    //               item.students.splice(idx, 1);  // 从数组中移除学生
    //               this.setData({ [`hours[${index}]`]: item });  // 更新数据绑定
    //             }
    //           }
    //         });
    //         this.processData();  // 重新计算时间
    //       } else {
    //         console.log('未找到匹配的学生或删除失败');
    //         wx.showToast({
    //           title: '删除失败',
    //           icon: 'none',
    //           duration: 2000
    //         });
    //       }
    //     }).catch(err => {
    //       console.error("更新文档时发生错误：", err);
    //       wx.showToast({
    //         title: '更新过程出错',
    //         icon: 'none',
    //         duration: 2000
    //       });
    //     });
    //   }).catch(err => {
    //     console.error("未找到指定的文档：", err);
    //     wx.showToast({
    //       title: '未找到文档',
    //       icon: 'none',
    //       duration: 2000
    //     });
    //   });
    // },
    // onDeleteStudent4(event: WechatMiniprogram.TouchEvent): void {
    //   const studentId = event.currentTarget.dataset.id as string;  // 明确类型为string
    //   // console.log("要删除的学生ID是：" + studentId);
      
    //   // 定义云数据库和目标集合
    //   const db = wx.cloud.database();
    //   const teachCollection = db.collection('WorkhoursData');
      
    //   // 获取_id值
    //   const _id = this.data._id;
    
    //   // 检查_id是否存在
    //   if (!_id) {
    //     console.error("未指定有效的文档ID");
    //     wx.showToast({
    //       title: '未指定文档ID',
    //       icon: 'none',
    //       duration: 2000
    //     });
    //     return;
    //   }
    
    //   // 尝试获取文档
    //   teachCollection.doc(_id).get().then(res => {
    //     console.log('找到文档：', res.data);
    //     // 继续进行删除操作
    //     const updateCommand = db.command;
    //     teachCollection.doc(_id).update({
    //       data: {
    //         "hours.clinical_teaching.3.students": updateCommand.pull({
    //           id: studentId  // 根据 id 匹配并删除该学生
    //         })
    //       }
    //     }).then(res => {
    //       if (res.stats.updated) {
    //         console.log('学生删除成功');
    //         wx.showToast({
    //           title: '删除成功',
    //           icon: 'success',
    //           duration: 2000
    //         });
    //         // 更新本地数据
    //         this.data.hours.forEach((item: any, index: number) => {
    //           if (item.students) {
    //             const idx = item.students.findIndex((s: any) => s.id === studentId);
    //             if (idx !== -1) {
    //               item.students.splice(idx, 1);  // 从数组中移除学生
    //               this.setData({ [`hours[${index}]`]: item });  // 更新数据绑定
    //             }
    //           }
    //         });
    //         this.processData();  // 重新计算时间
    //       } else {
    //         console.log('未找到匹配的学生或删除失败');
    //         wx.showToast({
    //           title: '删除失败',
    //           icon: 'none',
    //           duration: 2000
    //         });
    //       }
    //     }).catch(err => {
    //       console.error("更新文档时发生错误：", err);
    //       wx.showToast({
    //         title: '更新过程出错',
    //         icon: 'none',
    //         duration: 2000
    //       });
    //     });
    //   }).catch(err => {
    //     console.error("未找到指定的文档：", err);
    //     wx.showToast({
    //       title: '未找到文档',
    //       icon: 'none',
    //       duration: 2000
    //     });
    //   });
    // },

    // onDeleteStudent5(event: WechatMiniprogram.TouchEvent): void {
    //   const studentId = event.currentTarget.dataset.id as string;  // 明确类型为string
    //   // console.log("要删除的学生ID是：" + studentId);
      
    //   // 定义云数据库和目标集合
    //   const db = wx.cloud.database();
    //   const teachCollection = db.collection('WorkhoursData');
      
    //   // 获取_id值
    //   const _id = this.data._id;
    
    //   // 检查_id是否存在
    //   if (!_id) {
    //     console.error("未指定有效的文档ID");
    //     wx.showToast({
    //       title: '未指定文档ID',
    //       icon: 'none',
    //       duration: 2000
    //     });
    //     return;
    //   }
    
    //   // 尝试获取文档
    //   teachCollection.doc(_id).get().then(res => {
    //     console.log('找到文档：', res.data);
    //     // 继续进行删除操作
    //     const updateCommand = db.command;
    //     teachCollection.doc(_id).update({
    //       data: {
    //         "hours.clinical_teaching.4.students": updateCommand.pull({
    //           id: studentId  // 根据 id 匹配并删除该学生
    //         })
    //       }
    //     }).then(res => {
    //       if (res.stats.updated) {
    //         console.log('学生删除成功');
    //         wx.showToast({
    //           title: '删除成功',
    //           icon: 'success',
    //           duration: 2000
    //         });
    //         // 更新本地数据
    //         this.data.hours.forEach((item: any, index: number) => {
    //           if (item.students) {
    //             const idx = item.students.findIndex((s: any) => s.id === studentId);
    //             if (idx !== -1) {
    //               item.students.splice(idx, 1);  // 从数组中移除学生
    //               this.setData({ [`hours[${index}]`]: item });  // 更新数据绑定
    //             }
    //           }
    //         });
    //         this.processData();  // 重新计算时间
    //       } else {
    //         console.log('未找到匹配的学生或删除失败');
    //         wx.showToast({
    //           title: '删除失败',
    //           icon: 'none',
    //           duration: 2000
    //         });
    //       }
    //     }).catch(err => {
    //       console.error("更新文档时发生错误：", err);
    //       wx.showToast({
    //         title: '更新过程出错',
    //         icon: 'none',
    //         duration: 2000
    //       });
    //     });
    //   }).catch(err => {
    //     console.error("未找到指定的文档：", err);
    //     wx.showToast({
    //       title: '未找到文档',
    //       icon: 'none',
    //       duration: 2000
    //     });
    //   });
    // },
    // onDeleteStudent6(event: WechatMiniprogram.TouchEvent): void {
    //   const studentId = event.currentTarget.dataset.id as string;  // 明确类型为string
    //   // console.log("要删除的学生ID是：" + studentId);
      
    //   // 定义云数据库和目标集合
    //   const db = wx.cloud.database();
    //   const teachCollection = db.collection('WorkhoursData');
      
    //   // 获取_id值
    //   const _id = this.data._id;
    
    //   // 检查_id是否存在
    //   if (!_id) {
    //     console.error("未指定有效的文档ID");
    //     wx.showToast({
    //       title: '未指定文档ID',
    //       icon: 'none',
    //       duration: 2000
    //     });
    //     return;
    //   }
    
    //   // 尝试获取文档
    //   teachCollection.doc(_id).get().then(res => {
    //     console.log('找到文档：', res.data);
    //     // 继续进行删除操作
    //     const updateCommand = db.command;
    //     teachCollection.doc(_id).update({
    //       data: {
    //         "hours.clinical_teaching.5.students": updateCommand.pull({
    //           id: studentId  // 根据 id 匹配并删除该学生
    //         })
    //       }
    //     }).then(res => {
    //       if (res.stats.updated) {
    //         console.log('学生删除成功');
    //         wx.showToast({
    //           title: '删除成功',
    //           icon: 'success',
    //           duration: 2000
    //         });
    //         // 更新本地数据
    //         this.data.hours.forEach((item: any, index: number) => {
    //           if (item.students) {
    //             const idx = item.students.findIndex((s: any) => s.id === studentId);
    //             if (idx !== -1) {
    //               item.students.splice(idx, 1);  // 从数组中移除学生
    //               this.setData({ [`hours[${index}]`]: item });  // 更新数据绑定
    //             }
    //           }
    //         });
    //         this.processData();  // 重新计算时间
    //       } else {
    //         console.log('未找到匹配的学生或删除失败');
    //         wx.showToast({
    //           title: '删除失败',
    //           icon: 'none',
    //           duration: 2000
    //         });
    //       }
    //     }).catch(err => {
    //       console.error("更新文档时发生错误：", err);
    //       wx.showToast({
    //         title: '更新过程出错',
    //         icon: 'none',
    //         duration: 2000
    //       });
    //     });
    //   }).catch(err => {
    //     console.error("未找到指定的文档：", err);
    //     wx.showToast({
    //       title: '未找到文档',
    //       icon: 'none',
    //       duration: 2000
    //     });
    //   });
    // },
    onDeleteStudent(event: WechatMiniprogram.TouchEvent): void {
      const studentId = event.currentTarget.dataset.id as string;  // 学生 ID
      const groupId = event.currentTarget.dataset.group; // 组别 ID，对应 clinical_teaching 下的索引
    
      const db = wx.cloud.database();
      const teachCollection = db.collection('WorkhoursData');
      const _id = this.data._id;
    
      if (!_id) {
        console.error("未指定有效的文档ID");
        wx.showToast({
          title: '未指定文档ID',
          icon: 'none',
          duration: 2000
        });
        return;
      }
    
      // 尝试获取文档
      teachCollection.doc(_id).get().then(res => {
        const updateCommand = db.command;
        // 动态建立路径字符串
        const path = `hours.clinical_teaching.${groupId - 1}.students`;
        teachCollection.doc(_id).update({
          data: {
            [path]: updateCommand.pull({ id: studentId })
          }
        }).then(res => {
          if (res.stats.updated) {
            console.log('学生删除成功');
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
            });
            // 更新本地数据
            this.data.hours[groupId - 1].students = this.data.hours[groupId - 1].students.filter((s: any) => s.id !== studentId);
            this.setData({ [`hours[${groupId - 1}]`]: this.data.hours[groupId - 1] });
            this.processData();
          } else {
            console.log('未找到匹配的学生或删除失败');
            wx.showToast({
              title: '删除失败',
              icon: 'none',
              duration: 2000
            });
          }
        }).catch(err => {
          console.error("更新文档时发生错误：", err);
          wx.showToast({
            title: '更新过程出错',
            icon: 'none',
            duration: 2000
          });
        });
      }).catch(err => {
        console.error("未找到指定的文档：", err);
        wx.showToast({
          title: '未找到文档',
          icon: 'none',
          duration: 2000
        });
      });
    },


    onChangeStudentYear() {
      // this.setData({
      //   studentYear: '1'
      // })
    },
    //id 4-5 输入学生的天数
    onChangeStudentDay(event: any) {
      this.setData({
        studentDays: event.detail
      })
    },
    //点击确认添加学生的按钮（年份）
    // addStudent() {
    //   //检查是否为空
    //   const data = this.data
    //   const flag = (data.addStudentId < 4 && data.studentName.trim() != '' && data.studentNumber.trim() != '' && data.studentYear.trim() != '') || ((data.addStudentId == 4 || data.addStudentId == 5) && data.studentName.trim() != '' && data.studentNumber.trim() != '' && data.studentDays.trim() != '') || (data.addStudentId == 6 && data.studentName.trim() != '' && data.studentNumber.trim() != '')
    //   if (!flag) {
    //     wx.showToast({
    //       title: '输入不能为空',
    //       icon: 'error'
    //     })
    //     return
    //   }
    //   //检查数据库中是否有该学生
    //   const db = wx.cloud.database()
    //   const studentCollection = db.collection('students')
    //   new Promise((resolve, reject) => {
    //     if (data.addStudentId < 4) {
    //       resolve(true)
    //     } else {
    //       studentCollection.where({
    //         name: data.studentName,
    //         id: data.studentNumber
    //       }).get({
    //         success(res) {
    //           const data = res.data
    //           if (data.length != 0) {
    //             resolve(true)
    //           } else {
    //             reject(false)
    //           }
    //         }
    //       })
    //     }
    //   }).then(() => {
    //     //成功后将学生添加到本地中
    //     let newHours = data.hours
    //     if (data.addStudentId < 4) {
    //       newHours[data.addStudentId - 1].students.push({
    //         id: data.studentNumber,
    //         name: data.studentName,
    //         year: parseInt(data.studentYear)
    //       })
    //     } else if (data.addStudentId == 4 || data.addStudentId == 5) {
    //       if (parseInt(data.studentDays) > 15) {
    //         //大于15天就算作三周
    //         newHours[data.addStudentId - 1].students.push({
    //           id: data.studentNumber,
    //           name: data.studentName,
    //           year: 1
    //         })
    //       }
    //     } else if (data.addStudentId == 6) {
    //       const beginDateArr = data.beginDate.split('-')
    //       const endDateArr = data.endDate.split('-')
    //       newHours[data.addStudentId - 1].students.push({
    //         id: data.studentNumber,
    //         name: data.studentName,
    //         year: parseInt(endDateArr[1]) - parseInt(beginDateArr[1])
    //       })
    //     }
    //     console.log(newHours);
    //     this.setData({
    //       hours: newHours
    //     })
    //     wx.getStorage({
    //       key: 'hours',
    //       success(res) {
    //         const hours = res.data
    //         hours['clinical_teaching'] = newHours
    //         wx.setStorage({
    //           key: 'hours',
    //           data: hours
    //         })
    //         const summationUtil = require('../../utils/summationUtil')
    //         summationUtil.default.sumAllHours()
    //       }
    //     })
    //     //清空输入框
    //     this.setData({
    //       studentName: '',
    //       studentNumber: '',
    //       studentDays: '',
    //       studentYear: '1' // 保证studentYear永远是1不清空
    //     })
    //     this.initDate()
    //     //关闭弹窗
    //     this.onCloseAddStudentPopup()
    //     //重新加载数据
    //     this.processData()
    //   }, () => {
    //     //没有找到学生后提示
    //     wx.showToast({
    //       title: '学生不存在',
    //       icon: 'error'
    //     })
    //   })
    // },
    addStudent() {
      // 检查是否为空
      const data = this.data;
      const flag = (data.addStudentId < 4 && data.studentName.trim() != '' && data.studentNumber.trim() != '' && data.studentYear.trim() != '') || 
                   ((data.addStudentId == 4 || data.addStudentId == 5) && data.studentName.trim() != '' && data.studentNumber.trim() != '' && data.studentDays.trim() != '') || 
                   (data.addStudentId == 6 && data.studentName.trim() != '' && data.studentNumber.trim() != '');
      if (!flag) {
        wx.showToast({
          title: '输入不能为空',
          icon: 'error'
        });
        return;
      }
    
      // 检查数据库中是否有该学生
      const db = wx.cloud.database();
      const studentCollection = db.collection('students');
      new Promise((resolve, reject) => {
        if (data.addStudentId < 4) {
          resolve(true);
        } else {
          // 打印查询条件
          console.log('查询条件:', {
            name: data.studentName.trim(),
            id: new RegExp(`^${String(data.studentNumber).trim()}$`)
          });
    
          studentCollection.where({
            name: data.studentName.trim(),
            id: new RegExp(`^${String(data.studentNumber).trim()}$`)
          }).get({
            success(res) {
              const data = res.data;
              console.log('数据库查询结果:', res.data); // 打印数据库查询结果
              if (data.length != 0) {
                resolve(true);
              } else {
                reject(false);
              }
            },
            fail(err) {
              console.error('数据库查询错误:', err); // 打印数据库查询错误
              reject(false);
            }
          });
        }
      }).then(() => {
        // 成功后将学生添加到本地中
        let newHours = data.hours;
        if (data.addStudentId < 4) {
          newHours[data.addStudentId - 1].students.push({
            id: String(data.studentNumber).trim(),
            name: data.studentName.trim(),
            year: parseInt(data.studentYear)
          });
        } else if (data.addStudentId == 4 || data.addStudentId == 5) {
          if (parseInt(data.studentDays) > 15) {
            // 大于15天就算作三周
            newHours[data.addStudentId - 1].students.push({
              id: String(data.studentNumber).trim(),
              name: data.studentName.trim(),
              year: 1
            });
          }
        } else if (data.addStudentId == 6) {
          const beginDateArr = data.beginDate.split('-');
          const endDateArr = data.endDate.split('-');
          newHours[data.addStudentId - 1].students.push({
            id: String(data.studentNumber).trim(),
            name: data.studentName.trim(),
            year: parseInt(endDateArr[1]) - parseInt(beginDateArr[1])
          });
        }
        console.log(newHours);
        this.setData({
          hours: newHours
        });
        wx.getStorage({
          key: 'hours',
          success(res) {
            const hours = res.data;
            hours['clinical_teaching'] = newHours;
            wx.setStorage({
              key: 'hours',
              data: hours
            });
            const summationUtil = require('../../utils/summationUtil');
            summationUtil.default.sumAllHours();
          }
        });
        // 清空输入框
        this.setData({
          studentName: '',
          studentNumber: '',
          studentDays: '',
          studentYear: '1' // 保证studentYear永远是1不清空
        });
        this.initDate();
        // 关闭弹窗
        this.onCloseAddStudentPopup();
        // 重新加载数据
        this.processData();
      }).catch(() => {
        // 没有找到学生后提示
        wx.showToast({
          title: '学生不存在',
          icon: 'error'
        });
      });
    },
    //打开选择日期的弹窗
    onDisplayDate() {
      this.setData({
        showDate: true
      })
    },
    //关闭选择日期的弹窗
    onCloseDate() {
      this.setData({
        showDate: false
      })
    },
    //打开开始日期的弹窗
    onDisplayBeginDate() {
      this.setData({
        showBeginDate: true
      })
    },
    //打开结束日期的弹窗
    onDisplayEndDate() {
      this.setData({
        showEndDate: true
      })
    },
    //关闭开始日期的弹窗
    onCloseBeginDate() {
      this.setData({
        showBeginDate: false
      })
    },
    //关闭结束日期的弹窗
    onCloseEndDate() {
      this.setData({
        showEndDate: false
      })
    },

    //选择日期
    onInputDate(event: any) {
      const date = new Date(event.detail)
      this.setData({
        selectedTime: event.detail,
        selectedDate: date.getFullYear() + '-' + ((date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1))
      })
    },
    //选择开始日期
    onInputBeginDate(event: any) {
      const date = new Date(event.detail)
      this.setData({
        beginTime: event.detail,
        beginDate: date.getFullYear() + '-' + ((date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1))
      })
    },
    //选择结束日期
    onInputEndDate(event: any) {
      const date = new Date(event.detail)
      this.setData({
        endTime: event.detail,
        endDate: date.getFullYear() + '-' + ((date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1))
      });
    },
    //输入学生的姓名
    onChangeStudentName(event: any) {
      this.setData({
        studentName: event.detail
      })
    },
    //输入学生的学号
    onChangeStudentNumber(event: any) {
      this.setData({
        studentNumber: event.detail
      })
    },
    //打开添加学生的弹窗
    showAddStudentPopup(event: any) {
      this.setData({
        showAddStudent: true,
        addStudentId: event.currentTarget.dataset.id
      });
    },
    //关闭添加学生的弹窗
    onCloseAddStudentPopup() {
      this.setData({ showAddStudent: false });
    },

    //点击添加按钮，选择时间，输入姓名ID，添加成功，学生展示次数就可以，步进器医生不可见
    //处理折叠面板
    onChange(event: any) {
      this.setData({
        activeNames: event.detail,
      });
    },
    //处理步进器
    onChangeStepper(event: any) {
      // console.log(event);
      const id = event.currentTarget.dataset.id
      const index = event.currentTarget.dataset.index
      let newHours = this.data.hours
      newHours[id - 1].students[index].year = event.detail
      this.setData({
        hours: newHours
      })
      this.processData()
      //将数据储存在本地
      wx.getStorage({
        key: 'hours',
        success(res) {
          let hours = res.data
          hours['clinical_teaching'] = newHours
          wx.setStorage({
            key: 'hours',
            data: hours,
            success() {
              //计算和保存到本地
              // console.log('success');
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
      console.log(data)

      data.forEach((item: any) => {
        let sum = 0;
        if (item.students != null) {
          item.students.forEach((student: any) => {
            sum = sum + student.year
          })
        }
        item.hour = item.coefficient * sum
      })
      this.setData({
        hours: data
      })
    },

    initDate() {
      const date = new Date(this.data.minTime)
      this.setData({
        beginDate: date.getFullYear() + '-' + ((date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)),
        endDate: date.getFullYear() + '-' + ((date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)),
        selectedDate: date.getFullYear() + '-' + ((date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1))
      })
    }
  },

  lifetimes: {
    created() {
      this.initDate()
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
                _id:res.data._id,
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
                  const research = that.data.modifyPermissionOfResearch
                  if ((status == '教研室' && research == true) || (status == '教育教学部')) {
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
            hours: res.data.clinical_teaching
          })
          that.processData()
        }
      })


    },
    attached() {
      // 在组件被添加到页面节点树中时执行
      // console.log('attached');

    },
    detached() {
      // 在组件被从页面节点树中移除时执行
      //  console.log('detached');

    },
    ready() {
      // 在组件布局完成后执行
      // console.log('ready');

    },
    moved() {
      // 在组件在页面节点树中的位置发生变化时执行
      // console.log('moved');

    }
  }
})
