// const cloud = require('wx-server-sdk');
// cloud.init({
//   env: cloud.DYNAMIC_CURRENT_ENV
// });
// const xlsx = require('node-xlsx');
// const db = cloud.database();

// exports.main = async (event, context) => {
//     try {
//         const department = event.department;//从前端传递过来的科室名称
//         const StuInfo = await db.collection('WorkhoursData').get();
        
//         const dataCVS = `WorkhoursHours-${Math.floor(Math.random()*1000000000)}.xlsx`;
//         const alldata = [];
//         // 假设你想要在Excel的表头添加“小时数”
//         const row = ['姓名','医生号','密码','科室','职称','剩余待完成学时','需完成学时']; 
//         alldata.push(row);
        
//         // 遍历查询到的每条记录
//         for (const item of StuInfo.data) {
//             let hasInternalMedicine = false; // 标记是否存在 "内科" 的 job
//             const arr = [];
//             if (item.hours && item.hours.job) {
//                 for (const job of item.hours.job) {
//                     if (job.hour === department) { // 如果找到了 "内科" 的 job，则标记为 true
//                         hasInternalMedicine = true;
//                         break;
//                     }
//                 }
//             }
//             if (hasInternalMedicine) {
//               // 如果有 "内科" 的 job，则导出数据
//                 arr.push(item.name)
//                 arr.push(item.id)
//                 arr.push(item.password)
//                 if (item.hours && item.hours.job) {
//                   item.hours.job.forEach(ct => {
//                       arr.push(ct.hour); // 提取科室和职称字段
//                   }); 
//                 if (item.hours && item.hours.total) {
//                     // 假设数组中的第一个和第二个元素就是我们需要的
//                     allHour = item.hours.total[0].hour; // 获取第一个hour值
//                     needHour = item.hours.total[1].hour; // 获取第二个hour值
//                     hourDifference = Math.max(0, needHour - allHour);
//                     arr.push(hourDifference)
//                     arr.push(needHour)
//                 }
//                 // arr.push(item.hours.honor[1].levels[0].times)
//                     // 填充空白以保持每行数据的一致性
//                     while (arr.length < row.length) {
//                         arr.push('');
//                     }
//                     alldata.push(arr);
//                 }
//             }
//         }

//         // 如果没有需要导出的数据，则直接返回失败信息
//         if (alldata.length <= 1) {
//             return {
//                 success: false,
//                 message: '没有需要导出的数据',
//             };
//         }

//         const buffer = await xlsx.build([{   
//             name: "Sheet1",
//             data: alldata
//         }]); 
        
//         // 上传文件到云存储
//         const uploadResult = await cloud.uploadFile({
//             cloudPath: dataCVS,
//             fileContent: buffer,
//         });

//         if (uploadResult.fileID) {
//             return {
//                 success: true,
//                 message: '文件成功上传到云存储',
//                 fileID: uploadResult.fileID
//             };
//         } else {
//             return {
//                 success: false,
//                 message: '文件上传失败',
//             };
//         }
//     } catch (error) {
//         console.error(error);
//         return {
//             success: false,
//             message: '发生异常，请检查云函数日志',
//             error: JSON.stringify(error)
//         };
//     }
// }
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const xlsx = require('node-xlsx');
const db = cloud.database();
const MAX_LIMIT = 100; // 每次最多取 100 条数据

exports.main = async (event, context) => {
    try {
        const department = event.department; // 从前端传递过来的科室名称
        
        // 分页查询
        const countResult = await db.collection('WorkhoursData').count();
        const total = countResult.total;
        const batchTimes = Math.ceil(total / MAX_LIMIT);
        const tasks = [];
        
        for (let i = 0; i < batchTimes; i++) {
            const promise = db.collection('WorkhoursData').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
            tasks.push(promise);
        }

        // 等待所有数据查询完成
        const allData = (await Promise.all(tasks)).reduce((acc, cur) => {
            return acc.concat(cur.data);
        }, []);
        
        const dataCVS = `WorkhoursHours-${Math.floor(Math.random() * 1000000000)}.xlsx`;
        const alldata = [];
        const row = ['姓名', '医生号', '密码', '科室', '职称', '剩余待完成学时', '需完成学时']; 
        alldata.push(row);

        // 遍历查询到的每条记录
        for (const item of allData) {
            let hasDepartment = false; // 标记是否存在指定科室的 job
            const arr = [];
            if (item.hours && item.hours.job) {
                for (const job of item.hours.job) {
                    if (job.hour === department) { // 如果找到了指定科室的 job，则标记为 true
                        hasDepartment = true;
                        break;
                    }
                }
            }
            if (hasDepartment) {
                // 如果有指定科室的 job，则导出数据
                arr.push(item.name);
                arr.push(item.id);
                arr.push(item.password);
                if (item.hours && item.hours.job) {
                    for (const job of item.hours.job) {
                        if (job.hour === department) {
                            arr.push(job.department || '');
                            arr.push(job.title || ''); // 提取科室和职称字段
                        }
                    }
                }
                if (item.hours && item.hours.total) {
                    const allHour = item.hours.total[0]?.hour || 0; // 获取第一个hour值
                    const needHour = item.hours.total[1]?.hour || 0; // 获取第二个hour值
                    const hourDifference = Math.max(0, needHour - allHour);
                    arr.push(hourDifference);
                    arr.push(needHour);
                }
                // 填充空白以保持每行数据的一致性
                while (arr.length < row.length) {
                    arr.push('');
                }
                alldata.push(arr);
            }
        }

        // 如果没有需要导出的数据，则直接返回失败信息
        if (alldata.length <= 1) {
            return {
                success: false,
                message: '没有需要导出的数据',
            };
        }

        const buffer = await xlsx.build([{   
            name: "Sheet1",
            data: alldata
        }]); 
        
        // 上传文件到云存储
        const uploadResult = await cloud.uploadFile({
            cloudPath: dataCVS,
            fileContent: buffer,
        });

        if (uploadResult.fileID) {
            return {
                success: true,
                message: '文件成功上传到云存储',
                fileID: uploadResult.fileID
            };
        } else {
            return {
                success: false,
                message: '文件上传失败',
            };
        }
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: '发生异常，请检查云函数日志',
            error: JSON.stringify(error)
        };
    }
}