// pages/profile/profile.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cellLists:[
      { title: "我收藏的", icon:"star-o",type:"collect"},
      { title: "我看过的", icon:"passed",type:"done" },
      { title: "我评论的", icon:"comment-o",type:"comment"}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },


  cellClick:function(event){
    let type = event.target.dataset.type;
    if (type === "collect") {
      wx.navigateTo({
        url:"../collect/collect"
      })
    } else if (type === "done") {
      wx.navigateTo({
        url: "../haveSeen/haveSeen"
      })
    } else if (type === "comment") {
      wx.navigateTo({
        url: "../comment/comment"
      })
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})