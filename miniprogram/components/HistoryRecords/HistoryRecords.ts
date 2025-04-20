// components/HistoryRecords/HistoryRecords.ts
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
    historyRecords: [],
    isLoading: true,
    currentYear: new Date().getFullYear().toString(),
    yearOptions: [],
    selectedYear: '',
    hasRecords: false,
    department: '',
    jobtitle: '',
    userName: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 选择年份
    changeYear(e) {
      const year = e.detail.value;
      this.setData({
        selectedYear: this.data.yearOptions[year]
      });
      this.loadHistoryRecords();
    },

    // 加载历史记录数据
    loadHistoryRecords() {
      const that = this;
      that.setData({ isLoading: true });
      
      wx.getStorage({
        key: 'my_data',
        success(res) {
          const userId = res.data._id;
          const userName = res.data.name;
          
          that.setData({
            userName: userName
          });
          
          // 调用云函数获取历史记录
          wx.cloud.callFunction({
            name: 'getYearlyHistory',
            data: {
              userId: userId,
              year: that.data.selectedYear
            },
            success(res) {
              console.log('获取历史记录成功:', res.result);
              const records = res.result.data || [];
              
              if (records.length > 0) {
                // 格式化日期并处理数据
                const formattedRecords = records.map(record => {
                  if (record.updatedAt) {
                    const date = new Date(record.updatedAt);
                    record.updatedAtFormatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                  }
                  return record;
                });
                
                that.setData({
                  historyRecords: formattedRecords,
                  hasRecords: true,
                  department: records[0].department || '',
                  jobtitle: records[0].jobtitle || '',
                  isLoading: false
                });
              } else {
                that.setData({
                  historyRecords: [],
                  hasRecords: false,
                  isLoading: false
                });
              }
            },
            fail(err) {
              console.error('获取历史记录失败', err);
              that.setData({ 
                isLoading: false,
                hasRecords: false
              });
              wx.showToast({
                title: '获取历史记录失败',
                icon: 'none'
              });
            }
          });
        },
        fail() {
          that.setData({ isLoading: false });
          wx.showToast({
            title: '请先登录',
            icon: 'none'
          });
        }
      });
    }
  },
  
  lifetimes: {
    attached() {
      // 生成年份选项：过去5年
      const currentYear = new Date().getFullYear();
      const yearOptions = [];
      
      for (let i = 0; i < 5; i++) {
        const year = (currentYear - i).toString();
        yearOptions.push(year);
      }
      
      this.setData({
        yearOptions,
        selectedYear: (currentYear - 1).toString() // 默认选择去年
      });
      
      // 加载历史记录
      this.loadHistoryRecords();
    }
  }
})