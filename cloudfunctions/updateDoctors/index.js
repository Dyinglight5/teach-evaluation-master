const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
var xlsx = require("node-xlsx");
const db = cloud.database();

exports.main = async (event, context) => {
  console.log(event);
  let fileID = event.fileID;
  //1,通过fileID下载云存储里的excel文件
  const res = await cloud.downloadFile({
    fileID: fileID,
  });
  const buffer = res.fileContent;
  const tasks = []; //用来存储所有的添加数据操作
  //2,解析excel文件里的数据
  var sheets = xlsx.parse(buffer); //获取到所有sheets
  sheets.forEach(function (sheet) {
    console.log(sheet["name"]);
    for (var rowId in sheet["data"]) {
      console.log(rowId);
      var row = sheet["data"][rowId]; //第几行数据
      if (rowId > 1 && row) {
        //第一二行是表格标题，所有我们要从第3行开始读
        //3，把解析到的数据存到excelList数据表里
        const promise = db
          .collection("users")
          .where({
            id: row[1],
          })
          .update({
            data: {
              name: row[0], //姓名
              id: row[1], //工号
              exams: [], //默认考试列表为空
              modifyPermission: true,
              modifyPermissionOfResarch: true,
              password: "yisheng", //默认密码
              hours: {
                clinical_teaching: [
                  { coefficient: 20, id: 1, name: "博士生导师", students: [] },
                  {
                    coefficient: 15,
                    id: 2,
                    name: "硕士生导师（论文导师）",
                    students: [],
                  },
                  {
                    coefficient: 10,
                    id: 3,
                    name: "社会单位学员规培导师",
                    tudents: [],
                  },
                  {
                    coefficient: 2,
                    id: 4,
                    name: "临床实习、进修、全科转岗带教",
                    students: [],
                  },
                  {
                    coefficient: 3,
                    id: 5,
                    name: "留学生实习带教",
                    students: [],
                  },
                  { coefficient: 3, id: 6, name: "临床规培带教", students: [] },
                  { coefficient: 1, id: 7, name: "本科论文导师", students: [] },
                ],
                experimenta_lesson: [
                  {
                    coefficient: 0.7,
                    hour: row[2],
                    id: 1,
                    name: "实验课、技能培训课",
                  },
                  {
                    coefficient: 1.2,
                    hour: row[3],
                    id: 2,
                    name: "国际教育实验（英文）",
                  },
                  { coefficient: 0.7, hour: row[4], id: 3, name: "临床实习" },
                ],
                honor: [
                  {
                    coefficient: 5,
                    id: 1,
                    name: "教师参赛或以指导教师参加各类比赛",
                    times: row[5],
                  },
                  {
                    id: 2,
                    levels: [
                      {
                        coefficient: 20,
                        id: 1,
                        level: "国家级",
                        times: row[6],
                      },
                      { coefficient: 15, id: 2, level: "省级", times: row[7] },
                      { coefficient: 10, id: 3, level: "校级", times: row[8] },
                      { coefficient: 5, id: 4, level: "院级", times: row[9] },
                    ],
                    name: "国家级、省级、校级、院级荣誉称号",
                  },
                  {
                    id: 3,
                    levels: [
                      {
                        coefficient: 20,
                        id: 1,
                        level: "国家级",
                        times: row[10],
                      },
                      { coefficient: 15, id: 2, level: "省级", times: row[11] },
                      { coefficient: 10, id: 3, level: "校级", times: row[12] },
                      { coefficient: 5, id: 4, level: "院级", times: row[13] },
                    ],
                    name: "国家级、省级、校级、院级课程",
                  },
                ],
                other: [{ hour: row[14], id: 1, name: "其他", remark: "" }],
                teaching_management: [
                  {
                    coefficient: 15,
                    year: row[15],
                    id: 1,
                    name: "教研室主任、专业基地主任",
                  },
                  {
                    coefficient: 10,
                    year: row[16],
                    id: 2,
                    name: "教研室副主任、三级学科主任、教学主任",
                  },
                  { coefficient: 2, months: row[17], id: 3, name: "教学秘书" },
                  {
                    coefficient: 0.5,
                    times: row[18],
                    id: 4,
                    name: "科室教学活动",
                  },
                  {
                    coefficient: 0.3,
                    day: row[19],
                    id: 5,
                    name: "国家、省级住培考试监考、培训",
                  },
                  {
                    id: 6,
                    levels: [
                      { coefficient: 1, id: 1, level: "校级", times: row[20] },
                      {
                        coefficient: 0.5,
                        id: 2,
                        level: "院级",
                        times: row[21],
                      },
                    ],
                    name: "校级、院级监考、批卷、组卷",
                  },
                  {
                    id: 7,
                    levels: [
                      { coefficient: 5, id: 1, level: "国家级", days: row[22] },
                      { coefficient: 3, id: 2, level: "省级", days: row[23] },
                      { coefficient: 2, id: 3, level: "校级", days: row[24] },
                    ],
                    name: "担任国家级、省级、校级教学部比赛评委",
                  },
                  {
                    id: 8,
                    levels: [
                      {
                        coefficient: 10,
                        id: 1,
                        level: "国家级",
                        times: row[25],
                      },
                      { coefficient: 5, id: 2, level: "省级", times: row[26] },
                      { coefficient: 1, id: 3, level: "校级", times: row[27] },
                    ],
                    name: "参加国家级、省级、院级评估",
                  },
                  {
                    id: 9,
                    levels: [
                      {
                        coefficient: 2,
                        id: 1,
                        level: "国家级",
                        hours: row[28],
                      },
                      { coefficient: 1, id: 2, level: "省级", hours: row[29] },
                      {
                        coefficient: 0.5,
                        id: 3,
                        level: "校级",
                        times: row[30],
                      },
                    ],
                    name: "国家级、省级、院级师资培训班、继教班",
                  },
                  {
                    coefficient: 1,
                    times: row[31],
                    id: 10,
                    name: "参加各类师资培训班、教学会议",
                  },
                  { coefficient: 1, months: row[32], id: 11, name: "进修" },
                ],
                teaching_research: [
                  {
                    id: 1,
                    levels: [
                      {
                        coefficient: 10,
                        id: 1,
                        level: "国家级",
                        times: row[33],
                      },
                      { coefficient: 5, id: 2, level: "省级", times: row[34] },
                      { coefficient: 3, id: 3, level: "校级", times: row[35] },
                    ],
                    name: "主持国家级、省级、校级教学课题",
                  },
                  {
                    coefficient: 5,
                    id: 2,
                    name: "第一作者/通讯作者发表教学论文",
                    times: row[36],
                  },
                  { coefficient: 10, id: 3, name: "编写教材", times: row[37] },
                ],
                theory_course: [
                  { coefficient: 1, hour: row[38], id: 1, name: "基本理论课" },
                  {
                    coefficient: 1.5,
                    hour: row[39],
                    id: 2,
                    name: "双语授课，国际教育（双语班）",
                  },
                  {
                    coefficient: 0.9,
                    hour: row[40],
                    id: 3,
                    name: "选修课、规培课、岗前培训",
                  },
                  {
                    coefficient: 3,
                    hour: row[41],
                    id: 4,
                    name: "国际教育理论课（英文班）",
                  },
                  { coefficient: 2, hour: row[42], id: 5, name: "PBL理论课" },
                ],
                total: [{ hour: row[43], id: 1, name: "总学时" }],
              },
            },
          });
        tasks.push(promise);
      }
    }
  });

  // 等待所有数据添加完成
  let result = await Promise.all(tasks)
    .then((res) => {
      return res;
    })
    .catch(function (err) {
      return err;
    });
  return result;
};
