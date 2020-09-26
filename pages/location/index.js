// pages/location/index.js
const util = require('../../utils/util')
const app = getApp()
const urlList = require("../../utils/api.js")  // 根据实际项目自己配置

// 实例化API核心类
const qqmapsdk = app.globalData.qqmapsdk

Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: '',
    poi: {
      latitude: '',
      longitude: ''
    },
    addressName: '',
    time: '',
    timer: '',
    timer2: '',  // 用来每个一段时间自动刷新一次定位
    canClick: true
  },

  getAddress(e) {
    var that = this;
    qqmapsdk.reverseGeocoder({
      //位置坐标，默认获取当前位置，非必须参数
      /**
       * 
        location: {
          latitude: 39.984060,
          longitude: 116.307520
        },
      */
      // 成功后的回调
      success: function (res) {
        // console.log(res);
        that.setData({
          addressName: res.result.address
        })
        var res = res.result;
        var mks = [];
        //当get_poi为0时或者为不填默认值时，检索目标位置，按需使用
        mks.push({ // 获取返回结果，放到mks数组中
          title: res.address,
          id: 0,
          latitude: res.location.lat,
          longitude: res.location.lng,
          iconPath: '../../images/zcxj/myPosition.png', // 图标路径
          width: 21,
          height: 28,
          // callout: { //在markers上展示地址名称，根据需求是否需要
          //   content: res.address,
          //   color: '#000',
          //   display: 'ALWAYS'
          // }
        });
        that.setData({ // 设置markers属性和地图位置poi，将结果在地图展示
          markers: mks,
          poi: {
            latitude: res.location.lat,
            longitude: res.location.lng
          }
        });
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  getTime: function () {
    let that = this
    let time = that.data.time
    that.setData({
      timer: setInterval(function () {
        time = util.formatTime(new Date())
        that.setData({
          time: time.substr(-8)
        });
        if (time == 0) {
          // 页面跳转后，要把定时器清空掉，免得浪费性能
          clearInterval(that.data.timer)
        }
      }, 1000)
    })
  },
  rePosition: function () {
    console.log('用户点了重新定位')
    this.getAddress()
  },
  checkIn: function () {
    this.setData({
      canClick: false
    })
    console.log('用户点击了签到')


    var that = this
    var nowTime = util.formatTime(new Date())
    wx.showModal({
      title: '请确认打卡信息',
      // content: '请确认待整改项已整改完毕！',
      content: `地点：${this.data.addressName}\n时间：${nowTime}`,  // 开发者工具上没有换行，真机调试时会有的
      confirmText: '确认',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          // 调起签到接口
          that.realyCheckIn()

        } else if (res.cancel) {
          console.log('用户点击取消')
          that.setData({
            canClick: true
          })
        }
      }
    })
  },
  realyCheckIn: function () {
    var that = this
    var patrolForm = app.globalData.patrolForm  // 其他需要一并提交过去的业务数据

    console.log(app.globalData)
    // debugger
    // 要在这里给 patrolForm 补充其他的参数
    patrolForm.checkaddress = this.data.addressName
    patrolForm.searchtime = util.formatTime(new Date())
    // 应该先判断用户有没有登录，没登录就授权登录
    patrolForm.searchuser = app.globalData.user ? app.globalData.user.UserName : app.globalData.userInfo.nickName
    console.log("传给后台的 searchuser：", patrolForm.searchuser)
    // 拼接："经度,纬度"
    patrolForm.latandlon = this.data.poi.longitude + "," + this.data.poi.latitude


    console.log(patrolForm)
    console.log("↑ 签到提交的post参数")

    var tmpNumber = 0
    wx.request({
      url: urlList.submitCheckInInfo,
      data: patrolForm,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.data.IsSuccess) {
          console.log(res.data.IsSuccess, typeof (res.data.IsSuccess))
          console.log("请求成功")
          var patrolId = res.data.ReturnData[0].id
          // // 看怎么取到返回的id
          // debugger

          if (patrolForm.img_arr1.length > 0) {
            for (var i = 0; i < patrolForm.img_arr1.length; i++) {
              tmpNumber = i
              wx.uploadFile({
                // 图片上传的接口地址
                url: urlList.submitCheckInPhoto + "?patrolid=" + patrolId,
                filePath: patrolForm.img_arr1[i],
                name: 'content',
                // formData: {
                //   // 这里面可以携带一些参数一并传过去
                //   patrolId: patrolId
                // },
                // header: {
                //   Authorization: token
                // },
                success: function (res) {
                  console.log(res)
                },
                fail: function (res) {
                  that.setData({
                    canClick: true
                  })
                },
                complete: function () {
                  // 因为上传图片是异步操作,所以会导致这里的 i 会取不到，故需要用个作用域更大点的变量来标识，否则 if 里面的代码不会执行
                  if (tmpNumber === patrolForm.img_arr1.length - 1) {
                    // 有图片就等图片上传完了再返回首页
                    wx.showToast({
                      title: '巡查签到成功！',
                      icon: 'success',
                      duration: 2000,
                      complete: function () {
                        wx.navigateBack({
                          delta: 2  // 回退两层页面
                        })
                      }
                    })
                  }
                }
              })
            }
          } else {
            wx.showToast({
              title: '巡查签到成功！',
              icon: 'success',
              duration: 2000,
              complete: function () {
                wx.navigateBack({
                  delta: 2
                })
              }
            })
          }
        }
      },
      fail: function (res) {
        that.setData({
          canClick: true
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getTime()
    that.getAddress()

    that.setData({
      canClick: true, // 允许用户点击，防止多次提交
      timer2: setInterval(function () {
        that.getAddress()
      }, 20000)  // 每20秒刷新一次定位
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer)
    clearInterval(this.data.timer2)
    console.log("定时器已被清除")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})