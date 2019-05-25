// pages/collect/collect.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showItems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  cellClick(event) {
    let movieid = event.target.dataset.movieid;
    let url = `../detail/detail?movieid=${movieid}`
    wx.navigateTo({
      url: url,
    });
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
    wx.showLoading({
      title: '加载中',
    });
    db.collection("SeenMovies").get().then(res => {
      wx.hideLoading();
      if (res.data.length > 0) {
        this.setData({
          showItems: res.data
        });
      } else {
        wx.showToast({
          title: '暂无数据',
        });
      }
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})