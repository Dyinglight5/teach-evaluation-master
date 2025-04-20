// 云函数 - resetYearlyHours/index.js
const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

exports.main = async (event, context) => {
  const db = cloud.database();
  const _ = db.command;
  const $ = db.command.aggregate;

  try {
    // 获取当前年份
    const currentYear = event.year || new Date().getFullYear().toString();
    const previousYear = (parseInt(currentYear) - 1).toString();

    // 1. 查询所有需要重置的用户数据
    const usersData = await db
      .collection("WorkhoursData")
      .where({
        // 可以添加其他条件，例如只重置特定状态的用户
      })
      .get();

    // 2. 批量处理用户数据
    const updatePromises = usersData.data.map(async (user) => {
      // 归档当前年度数据
      const yearlyData = {
        year: previousYear,
        completedHours: user.hours?.total?.[0]?.hour || 0,
        department: user.hours?.job?.[0]?.hour || "",
        jobtitle: user.hours?.job?.[1]?.hour || "",
        // 添加分数归档
        score: user.score || 0,
        updatedAt: new Date(),
      };

      // 保存历史数据到历史记录集合
      await db.collection("YearlyHoursHistory").add({
        data: {
          userId: user._id,
          userName: user.name,
          ...yearlyData,
        },
      });

      // 重置用户当前学时和分数数据
      return db
        .collection("WorkhoursData")
        .doc(user._id)
        .update({
          data: {
            "hours.total.0.hour": 0, // 重置已完成学时
            "hours.year": currentYear, // 更新年份标记
            score: 0, // 重置分数为0
            yearlyReset: true, // 标记已经进行了年度重置
            resetTime: new Date(), // 记录重置时间
            // 可以保留其他必要信息如部门、职称等
          },
        });
    });

    // 执行所有更新操作
    await Promise.all(updatePromises);

    return {
      success: true,
      affectedUsers: usersData.data.length,
      message: `成功重置${usersData.data.length}个用户的年度学时和分数`,
    };
  } catch (error) {
    console.error("重置学时和分数失败", error);

    return {
      success: false,
      error: error.message,
    };
  }
};
