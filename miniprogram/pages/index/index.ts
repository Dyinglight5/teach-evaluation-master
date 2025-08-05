// index.ts
// 获取应用实例
import DBOptimizer from '../../utils/dbOptimizer'

const app = getApp<IAppOption>()

Page({
  data: {
    option1: [
      { text: '理论课', value: 0 },
      { text: '实验课', value: 1 },
      { text: '临床带教', value: 2 },
      { text: '教学管理', value: 3 },
      { text: '教学研究', value: 4 },
      { text: '荣誉', value: 5 },
      { text: '其他', value: 6 },
      { text: '总学时', value: 7 },
      { text: '历史学时', value: 8 }
    ],
    value1: 0,
    value2: 1,
    findname:'',
    id: '',
    showingComponentNumber: 1,
    status: '',
    name: '',
    isDataLoaded: false, // 数据加载状态标识
    isFromLogin: false   // 是否来自登录页面
  },

  onChangename(e: any) {
    this.setData({
      findname: e.detail
    });  
  },
  onChangeid(e: any) {
    this.setData({
      id: e.detail
    });  
    console.log(this.data.id)
  },
  //刷新一下组件
  updatePage() {
    // this.setData({
    //   showingComponentNumber: 0
    // })
    // this.setData({
    //   showingComponentNumber: 1
    // })
  },
  //搜索功能实现
  search() {
    //根据id搜索医生
    const searchDoctorUtil = require('../../utils/searchDoctorUtil')
    console.log(this.data.findname)
    searchDoctorUtil.default.searchDoctor(this.data.findname,this.data.id)
    //关闭下拉菜单
    const dropdownComponent = this.selectComponent('#searchItem');
    dropdownComponent.toggle(false)
    setTimeout(() => {
      //搜索框置空
      this.setData({
        id: ''
      })
      this.setData({
        findname: ''
      })
      this.loadUserData()
    }, 500)
  },
  //按下回车键触发
  onSearch() {
    this.search();
  },
  //点击搜索按钮触发
  onClick() {
    this.search();
  },

  //选择某类课程内容
  changeValue(value: any) {
    const detail = value.detail;
    console.log(detail);
    //根据不同的detail传递不同的数据
    switch (detail) {
      case 0:
        this.setData({
          showingComponentNumber: 1
        })
        break;
      case 1:
        this.setData({
          showingComponentNumber: 2
        })
        break;
      case 2:
        this.setData({
          showingComponentNumber: 3
        })
        break;
      case 3:
        this.setData({
          showingComponentNumber: 4
        })
        break;
      case 4:
        this.setData({
          showingComponentNumber: 5
        })
        break;
      case 5:
        this.setData({
          showingComponentNumber: 6
        })
        break;
      case 6:
        this.setData({
          showingComponentNumber: 7
        })
        break;
      case 7:
        this.setData({
          showingComponentNumber: 8
        })
        break;
      case 8:
        this.setData({
          showingComponentNumber: 9
        })
        break;
    }

  },
  onLoad(options: any = {}) {
    // @ts-ignore
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    
    // 标记是否来自登录页面
    if (options.fromLogin) {
      this.setData({
        isFromLogin: true
      })
    }
    
    this.updatePage()
    this.loadUserData()
  },

  /**
   * 页面显示时的回调函数
   */
  onShow() {
    // 只有在数据未加载或者不是来自登录时才重新加载
    if (!this.data.isDataLoaded && !this.data.isFromLogin) {
      this.loadUserData()
    }
    // 重置登录标识
    if (this.data.isFromLogin) {
      this.setData({
        isFromLogin: false
      })
    }
  },

  /**
   * 加载用户数据的通用方法 - 优化版本
   */
  async loadUserData() {
    // 如果数据已加载且不需要强制刷新，直接返回
    if (this.data.isDataLoaded && this.data.status && this.data.name) {
      return
    }

    try {
      // 使用优化的批量获取方法
      const storageData = await DBOptimizer.batchGetStorage(['status', 'my_data', 'researchName'])
      
      if (!storageData.status) {
        return
      }

      this.setData({
        status: storageData.status
      })
      
      // 根据不同身份获取不同的用户名
      let name = ''
      if (storageData.status === '医生') {
        name = storageData.my_data?.name || '未登录'
      } else if (storageData.status === '教研室') {
        name = storageData.researchName || '教研室'
      } else if (storageData.status === '教育教学部') {
        name = '教育教学部'
      }

      this.setData({
        name: name,
        isDataLoaded: true
      })
    } catch (error) {
      console.error('加载用户数据失败:', error)
    }
  },

  /**
   * Promise化的getStorage方法
   */
  getStorageAsync(key: string): Promise<any> {
    return DBOptimizer.getStorageAsync(key)
  },

  /**
   * 强制刷新用户数据
   */
  refreshUserData() {
    this.setData({
      isDataLoaded: false
    })
    this.loadUserData()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.refreshUserData()
    wx.stopPullDownRefresh()
  }
})
