//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '打卡签到',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userno: '',
    usernofound: '未找到',
    userArray: {
      "realjf": 1,
      "real": 2,
      "neyo": 3,
      "林晓滨": 1,
      "陈杰峰": 4,
      "陈敏": 2
    }
  },
  // 获取桌号
  formSubmit: function(e){
    console.log(e.detail);
    if(this.data.userArray[e.detail.value.username] != undefined){
      this.setData({
        userno: this.data.userArray[e.detail.value.username],
      })
    }else{
      this.setData({
        userno: this.data.usernofound,
      })
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../location/index'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
