
// pages/moive/moive.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieList:[],
    totalCount:-1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMoiveIntheater();
  },

  getMoiveIntheater:function(){
    wx.showLoading({
      title: '正在加载...',
    })
    wx.cloud.callFunction({
      name:"movieList",
      data:{
        start:this.data.movieList.length,
        count:10
      }
    }).then(res=>{
      wx.hideLoading()
      let movieItems = res.result.subjects
      this.setData({
        movieList: this.data.movieList.concat(movieItems),
        totalCount: res.result.total
      })
    }).catch(err=>{
      wx.hideLoading()
      console.error(err)
    })
  },

  showDetail:function(event){
    let url = `../detail/detail?movieid=${event.currentTarget.dataset.movieid}`
    wx.navigateTo({
      url: url
    })
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
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
    this.getMoiveIntheater()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})