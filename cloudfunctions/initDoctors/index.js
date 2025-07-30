const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
var xlsx = require("node-xlsx");
const db = cloud.database();

exports.main = async (event, context) => {
  const mapping = {
    内科: { 正高: 60, 副高: 60, 中级: 40 },
    外科: { 正高: 60, 副高: 60, 中级: 40 },
    妇产科: { 正高: 60, 副高: 60, 中级: 40 },
    儿科: { 正高: 60, 副高: 60, 中级: 40 },
    神经精神: { 正高: 60, 副高: 60, 中级: 40 },
    中西医结合: { 正高: 60, 副高: 60, 中级: 40 },
    眼: { 正高: 30, 副高: 30, 中级: 20 },
    耳鼻喉: { 正高: 30, 副高: 30, 中级: 20 },
    皮肤: { 正高: 30, 副高: 30, 中级: 20 },
    肿瘤: { 正高: 30, 副高: 30, 中级: 20 },
    急诊: { 正高: 30, 副高: 30, 中级: 20 },
    感染: { 正高: 30, 副高: 30, 中级: 20 },
    重症: { 正高: 30, 副高: 30, 中级: 20 },
    中医: { 正高: 30, 副高: 30, 中级: 20 },
    康复: { 正高: 30, 副高: 30, 中级: 20 },
    针灸: { 正高: 30, 副高: 30, 中级: 20 },
    全科: { 正高: 30, 副高: 30, 中级: 20 },
    老年: { 正高: 30, 副高: 30, 中级: 20 },
    麻醉: { 正高: 30, 副高: 30, 中级: 20 },
    口腔: { 正高: 30, 副高: 30, 中级: 20 },
    检验: { 正高: 30, 副高: 30, 中级: 20 },
    超声: { 正高: 30, 副高: 30, 中级: 20 },
    放射诊断: { 正高: 30, 副高: 30, 中级: 20 },
    介入: { 正高: 30, 副高: 30, 中级: 20, 初级: 15 },
    影像技术: { 正高: 15, 副高: 15, 中级: 10 },
    核医学: { 正高: 15, 副高: 15, 中级: 10 },
    病理: { 正高: 15, 副高: 15, 中级: 10 },
    临床药学: { 正高: 10, 副高: 10, 中级: 10 },
    营养: { 正高: 10, 副高: 10, 中级: 10 },
    健康管理: { 正高: 10, 副高: 10, 中级: 10 },
  };
  let fileID = event.fileID;
  //1,通过fileID下载云存储里的excel文件
  const res = await cloud.downloadFile({
    fileID: fileID,
  });
  const buffer = res.fileContent;

  const all_excel_data = []; //用来存储所有的excel数据
  //2,解析excel文件里的数据
  var sheets = xlsx.parse(buffer); //获取到所有sheets
  sheets.forEach(function (sheet) {
    console.log(sheet["name"]);
    for (var rowId in sheet["data"]) {
      //console.log(rowId);
      var row = sheet["data"][rowId]; //第几行数据
      console.log(rowId, row);
      if (rowId > 1 && row) {
        //第一二行是表格标题，所以我们要从第3行开始读
        //3，把解析到的数据存到excelList数据表里
        teachtime = mapping[row[44]]?.[row[45]]; //44和45位置存放的是科室和职称
        if (teachtime == undefined) {
          teachtime = 0;
        }

        all_excel_data.push({
          name: row[0], //姓名
          id: row[1] + "", //工号
          exams: [], //默认考试列表为空
          modifyPermission: true,
          modifyPermissionOfResearch: true,
          password: "yisheng", //默认密码
          hours: {
            clinical_teaching: [
              {
                coefficient: 20,
                id: 1,
                hour: 0,
                name: "博士生导师",
                students: [],
              },
              {
                coefficient: 15,
                id: 2,
                hour: 0,
                name: "硕士生导师（论文导师）",
                students: [],
              },
              {
                coefficient: 10,
                id: 3,
                hour: 0,
                name: "社会单位学员规培导师",
                tudents: [],
              },
              {
                coefficient: 2,
                id: 4,
                hour: 0,
                name: "临床实习、进修、全科转岗带教",
                students: [],
              },
              {
                coefficient: 3,
                id: 5,
                hour: 0,
                name: "留学生实习带教",
                students: [],
              },
              {
                coefficient: 3,
                id: 6,
                hour: 0,
                name: "临床规培带教",
                students: [],
              },
              {
                coefficient: 10,
                id: 7,
                hour: 0,
                name: "本科论文导师",
                students: [],
              },
            ],
            experimental_lesson: [
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
              {
                coefficient: 0.7,
                hour: row[4],
                id: 3,
                name: "临床实习",
              },
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
                  {
                    coefficient: 15,
                    id: 2,
                    level: "省级",
                    times: row[7],
                  },
                  {
                    coefficient: 10,
                    id: 3,
                    level: "校级",
                    times: row[8],
                  },
                  {
                    coefficient: 5,
                    id: 4,
                    level: "院级",
                    times: row[9],
                  },
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
                  {
                    coefficient: 15,
                    id: 2,
                    level: "省级",
                    times: row[11],
                  },
                  {
                    coefficient: 10,
                    id: 3,
                    level: "校级",
                    times: row[12],
                  },
                  {
                    coefficient: 5,
                    id: 4,
                    level: "院级",
                    times: row[13],
                  },
                ],
                name: "国家级、省级、校级、院级课程",
              },
            ],
            other: [
              {
                hour: row[14],
                id: 1,
                name: "其他",
                remark: "", // 添加备注字段
              },
            ],
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
              {
                coefficient: 2,
                months: row[17],
                id: 3,
                name: "教学秘书",
              },
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
                  {
                    coefficient: 1,
                    id: 1,
                    level: "校级",
                    times: row[20],
                  },
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
                  {
                    coefficient: 5,
                    id: 1,
                    level: "国家级",
                    days: row[22],
                  },
                  {
                    coefficient: 3,
                    id: 2,
                    level: "省级",
                    days: row[23],
                  },
                  {
                    coefficient: 2,
                    id: 3,
                    level: "校级",
                    days: row[24],
                  },
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
                  {
                    coefficient: 5,
                    id: 2,
                    level: "省级",
                    times: row[26],
                  },
                  {
                    coefficient: 1,
                    id: 3,
                    level: "校级",
                    times: row[27],
                  },
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
                  {
                    coefficient: 1,
                    id: 2,
                    level: "省级",
                    hours: row[29],
                  },
                  {
                    coefficient: 0.5,
                    id: 3,
                    level: "校级",
                    hours: row[30],
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
              {
                coefficient: 1,
                months: row[32],
                id: 11,
                name: "进修",
              },
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
                  {
                    coefficient: 5,
                    id: 2,
                    level: "省级",
                    times: row[34],
                  },
                  {
                    coefficient: 3,
                    id: 3,
                    level: "校级",
                    times: row[35],
                  },
                ],
                name: "主持国家级、省级、校级教学课题",
              },
              {
                coefficient: 5,
                id: 2,
                name: "第一作者/通讯作者发表教学论文",
                times: row[36],
              },
              {
                coefficient: 10,
                id: 3,
                name: "编写教材",
                times: row[37],
              },
            ],

            theory_course: [
              {
                coefficient: 1,
                hour: row[38],
                id: 1,
                name: "基本理论课",
              },
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
              {
                coefficient: 2,
                hour: row[42],
                id: 5,
                name: "PBL理论课",
              },
            ],
            total: [
              {
                hour: row[43],
                id: 1,
                name: "总学时",
              },
              {
                hour: teachtime,
                id: 2,
                name: "需完成学时",
              },
            ],
            job: [
              {
                hour: row[44],
                id: 1,
                name: "科室",
              },
              {
                hour: row[45],
                id: 2,
                name: "职称",
              },
            ],
          },
        });
      }
    }
  });
  // 一起添加所有数据
  var result = await db
    .collection("WorkhoursData")
    .add({
      data: all_excel_data,
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  return result;
};
