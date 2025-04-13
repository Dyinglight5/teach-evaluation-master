const cloud = require('wx-server-sdk');
cloud.init();
var xlsx = require('node-xlsx');
const db = cloud.database();

exports.main = async (event, context) => {
  let { fileID } = event;
  // 1, 通过fileID下载云存储里的excel文件
  const res = await cloud.downloadFile({
    fileID: fileID,
  });
  const buffer = res.fileContent;
  const all_excel_data = []; // 用来存储所有的excel数据

  // 2, 解析excel文件里的数据
  var sheets = xlsx.parse(buffer); // 获取到所有sheets
  sheets.forEach(function(sheet) {
    console.log(sheet['name']);
    for (var rowId in sheet['data']) {
      var row = sheet['data'][rowId]; // 第几行数据
      if (rowId > 0 && row) { // 第一行是表格标题，所以我们要从第2行开始读
        // 3, 把解析到的数据存到excelList数据表里
        all_excel_data.push({
          name: row[0],
          id: String(row[1]), // 将id转换为字符串格式
          beginDate: row[2],
          endDate: row[3],
          unavailableDates: []
        });
      }
    }
  });
  console.log(all_excel_data);
  // 一起添加所有数据
  var result = await db.collection('students').add({
    data: all_excel_data
  }).then(res => {
    return res;
  }).catch(err => {
    return err;
  });
  return result;
};