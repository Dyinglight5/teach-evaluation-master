export default {
  "id": "002",
  "name": "任我行",
  "password": "yisheng",
  "hours": {
    "theory_course": [{
        "name": "基本理论课",
        "hour": 1,
        "id": 1,
        "coefficient": 1
      },
      {
        "name": "双语授、国际教育（双语班）",
        "hour": 2,
        "id": 2,
        "coefficient": 1.5
      },
      {
        "name": "选修课、规培课程、岗前培训",
        "hour": 3,
        "id": 3,
        "coefficient": 0.9
      },
      {
        "name": "国际教育理论课（英文班）",
        "hour": 4,
        "id": 4,
        "coefficient": 3
      },
      {
        "name": "PBL理论课",
        "hour": 5,
        "id": 5,
        "coefficient": 2
      }
    ],
    "experimental_lesson": [{
        "name": "实验课、技能培训课",
        "hour": 1,
        "id": 1,
        "coefficient": 0.7
      },
      {
        "name": "国际教育实验(英文)",
        "hour": 2,
        "id": 2,
        "coefficient": 1.2
      },
      {
        "name": "临床见习",
        "hour": 3,
        "id": 3,
        "coefficient": 0.7
      }
    ],
    "clinical_teaching": [{
        "name": "博士生导师",
        "coefficient": 20,
        "id": 1,
        "students": []
      },
      {
        "name": "硕士生导师(论文导师)",
        "coefficient": 15,
        "id": 2,
        "students": []
      },
      {
        "name": "社会单位学员规培导师",
        "coefficient": 10,
        "id": 3,
        "students": []
      },
      {
        "name": "临床实习、进修、全科转岗带教",
        "coefficient": 2,
        "id": 4,
        "students": []
      },
      {
        "name": "留学生实习带教",
        "coefficient": 3,
        "id": 5,
        "students": []
      },
      {
        "name": "临床规培带教",
        "coefficient": 3,
        "id": 6,
        "students": []
      }
    ],
    "teaching_management": [{
        "name": "教研室主任、专业基地主任",
        "year": 1,
        "id": 1,
        "coefficient": 15
      },
      {
        "name": "教研室副主任、三级学科主任、教学主任",
        "year": 2,
        "id": 2,
        "coefficient": 10
      },
      {
        "name": "教学秘书",
        "months": 3,
        "id": 3,
        "coefficient": 2
      },
      {
        "name": "科室教学活动(讲座、教学查房、病例讨论、临床技能作带教",
        "times": 4,
        "id": 4,
        "coefficient": 0.5
      },
      {
        "name": "国家级、省级住培考试监考、培训",
        "day": 5,
        "id": 5,
        "coefficient": 3
      },
      {
        "name": "校级、院级监考、批卷、组卷",
        "levels": [{
          "level": "校级",
          "times": 5,
          "id": 1,
          "coefficient": 1
        }, {
          "level": "院级",
          "times": 5,
          "id": 2,
          "coefficient": 0.5
        }],
        "id": 6
      },
      {
        "name": "担任国家级、省级、校级教学比赛评委",
        "id": 7,
        "levels": [{
          "level": "国家级",
          "days": 5,
          "id": 1,
          "coefficient": 5
        }, {
          "level": "省级",
          "days": 5,
          "id": 2,
          "coefficient": 3
        }, {
          "level": "校级",
          "days": 5,
          "id": 3,
          "coefficient": 2
        }]
      },
      {
        "name": "参加国家级、省级、院级评估",
        "id": 8,
        "levels": [{
          "level": "国家级",
          "times": 2,
          "id": 1,
          "coefficient": 10
        }, {
          "level": "省级",
          "times": 5,
          "id": 2,
          "coefficient": 5
        }, {
          "level": "校级",
          "times": 5,
          "id": 3,
          "coefficient": 1
        }]
      },
      {
        "name": "国家级、省级、院级师资培训班、继教班授课",
        "id": 9,
        "levels": [{
          "level": "国家级",
          "hours": 2,
          "id": 1,
          "coefficient": 2
        }, {
          "level": "省级",
          "hours": 5,
          "id": 2,
          "coefficient": 1
        }, {
          "level": "校级",
          "hours": 5,
          "id": 3,
          "coefficient": 0.5
        }]
      },
      {
        "name": "参加各类师资培训班、教学会议",
        "times": 11,
        "id": 10,
        "coefficient": 1
      },
      {
        "name": "进修",
        "months": 12,
        "id": 11,
        "coefficient": 1
      }
    ],
    "teaching_research": [{
        "name": "主持国家级、省级、校级教学课题",
        "levels": [{
          "level": "国家级",
          "times": 2,
          "id": 1,
          "coefficient": 10
        }, {
          "level": "省级",
          "times": 5,
          "id": 2,
          "coefficient": 5
        }, {
          "level": "校级",
          "times": 5,
          "id": 3,
          "coefficient": 3
        }],
        "id": 1
      },
      {
        "name": "第一作者/通讯作者发表教学论文",
        "times": 2,
        "id": 2,
        "coefficient": 5
      },
      {
        "name": "编写教材",
        "times": 3,
        "id": 3,
        "coefficient": 10
      }
    ],
    "honor": [{
        "name": "教师参赛或以指导教师参加各类比赛",
        "times": 1,
        "id": 1,
        "coefficient": 5
      },
      {
        "name": "国家级、省级、校级、院级荣誉称号",
        "levels": [{
          "level": "国家级",
          "times": 2,
          "id": 1,
          "coefficient": 20
        }, {
          "level": "省级",
          "times": 5,
          "id": 2,
          "coefficient": 15
        }, {
          "level": "校级",
          "times": 5,
          "id": 3,
          "coefficient": 10
        }, {
          "level": "院级",
          "times": 5,
          "id": 4,
          "coefficient": 5
        }],
        "id": 2
      },
      {
        "name": "国家级、省级、校级、院级课程",
        "levels": [{
          "level": "国家级",
          "times": 2,
          "id": 1,
          "coefficient": 20
        }, {
          "level": "省级",
          "times": 5,
          "id": 2,
          "coefficient": 15
        }, {
          "level": "校级",
          "times": 5,
          "id": 3,
          "coefficient": 10
        }, {
          "level": "院级",
          "times": 5,
          "id": 4,
          "coefficient": 5
        }],
        "id": 3
      }
    ],
    "other": [{
      "name": "其他",
      "hour": 1,
      "id": 1
    }],
    "total": [{
      "name": "总学时",
      "hour": 1,
      "id": 1
    }]
  },
  "exams": [],
  "modifyPermission": true,
  "modifyPermissionOfResearch": true
}