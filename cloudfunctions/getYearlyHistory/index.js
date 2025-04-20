const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

exports.main = async (event, context) => {
  const db = cloud.database();
  const _ = db.command;

  try {
    const { userId, year } = event;

    // 构建查询条件
    const query = { userId: userId };
    if (year) {
      query.year = year;
    }

    // 查询历史记录
    const result = await db
      .collection("YearlyHoursHistory")
      .where(query)
      .orderBy("updatedAt", "desc")
      .get();

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("获取历史记录失败", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
