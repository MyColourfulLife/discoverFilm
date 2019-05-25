// pages/detail/detail.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    movieid: -1,
    moiveCover:"",
    summary:"",
    bloopers:[],
    popular_reviews:[],
    mycomment:"",
    myrate:3,
    collectColor:"black",
    passedColor:"black",
    commentImages:[],
    commentImagesCloudIds:[],
    canCommit:false,
    tempComent:""
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      movieid: options.movieid
    });
    this.getMovieDetailById(options.movieid)
  },
  getMovieDetailById: function (movieid) {
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name: "movieDetail",
      data: {
        movieid: movieid
      }
    }).then(res => {
      wx.hideLoading()
      let detail = res.result;
      wx.setNavigationBarTitle({
        title: detail.title,
      });
      var commentImages = [];
      if (detail.mycomment && detail.mycomment.commentFiles) {
        commentImages = detail.mycomment.commentFiles;
      }
      this.setData({
        title: detail.title,
        moiveCover: detail.images.large,
        summary:detail.summary,
        bloopers:detail.bloopers,
        popular_reviews:detail.popular_reviews,
        myrate:detail.mycomment ? detail.mycomment.rate : 3,
        collectColor:detail.mycollect ? "green" : "black",
        passedColor:detail.myseen ? "green" : "black",
        mycomment:detail.mycomment ? detail.mycomment.comment : "",
        commentImages: commentImages,
      })
    }).catch(err => {
      wx.hideLoading()
      wx.showModal({
        title: '错误',
        content: '加载失败',
        showCancel: false
      })
      console.error(err)
    })
  },

  onCommentChange(event){
    this.setData({
      tempComent: event.detail,
      canCommit:event.detail.length > 0      
    })
  },
  onrateChange(event){
    this.setData({
      myrate:event.detail
    })
  },
  collect(event){
    let newColor = this.data.collectColor === "black" ? "green" : "black";
    this.setData({
      collectColor: newColor
    });
    let isCollected = newColor === "green";
    if (isCollected) {
      wx.showLoading({
        title: '正在收藏',
      });
      db.collection("collectMoives").add({
        data:{
          _id: this.data.movieid,
          collected: isCollected,
          movieName: this.data.title,
        }
      }).then(res=>{
        wx.hideLoading()
        wx.showToast({
          title: '收藏成功',
        })
      }).catch(err=>{
        console.error(err)
        wx.hideLoading()
        wx.showToast({
          title: '收藏失败',
        })
      });
    }else {
      db.collection('collectMoives').doc(`${this.data.movieid}`).remove().then(res => {
        // res.data 包含该记录的数据
        wx.hideLoading()
        wx.showToast({
          title: '取消成功',
        })
        console.log(res.data)
      }).catch(err=>{
        console.error(err)
        wx.hideLoading()
      });
    }
  },
  pass(event){
    let newColor = this.data.passedColor === "black" ? "green" : "black";
  console.log(`passedColor:${this.data.passedColor},newColor:${newColor}`);
    this.setData({
      passedColor: newColor
    });
    let isSeen = newColor === "green";
    if (isSeen) {
      wx.showLoading({
        title: '标记中...',
      });
      db.collection("SeenMovies").add({
        data:{
          _id: this.data.movieid,
          collected: isSeen,
          movieName: this.data.title,
        }
      }).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '标记成功',
        })
        console.log(res)
      }).catch(err => {
        wx.hideLoading()
        wx.showToast({
          title: '标记失败',
        });
        console.error(err)
      });
    } else {
      db.collection('SeenMovies').doc(this.data.movieid).remove().then(res => {
        // res.data 包含该记录的数据
        console.log(res.data)
        wx.showToast({
          title: '取消成功',
        });
      }).catch(err=>{
        console.error(err);
      });
  }
  },

  upLoadImage:function(){
    // 选择图片
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:res=> {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        this.setData({
commentImages:this.data.commentImages.concat(tempFilePaths)
        });
      }
    })
  },

  uploadComment(){
wx.showLoading({
  title: '评论中...',
});
// 上传图片
let promiseArr = [];
for (let i = 0; i < this.data.commentImages.length;i++){
    let item = this.data.commentImages[i];
        promiseArr.push(new Promise((reslove,reject)=>{
          let suffix = /\.\w+$/.exec(item)[0]; // 正则表达式，返回文件扩展名
          wx.cloud.uploadFile({
            cloudPath: new Date().getTime() + suffix,
            filePath: item,
            success: res => {
              this.setData({
                commentImagesCloudIds: this.data.commentImagesCloudIds.concat(res.fileID)
              });
              reslove();
            },
            fail: err => {
              console.error(err)
              reject();
            }
          })
        }));
}
if(promiseArr.length > 0) {
  Promise.all(promiseArr).then(this.doComment).catch(err => {
    wx.hideLoading();
    wx.showToast({
      title: '评论失败',
    });
    console.error(err);
  });
}else {
  this.doComment();
}
  },

  doComment: function(){
    if (this.data.mycomment.length > 0) {
      db.collection("comment").doc(this.data.movieid).update({
        data:{
          movieName: this.data.title,
          comment: this.data.tempComent,
          rate: this.data.myrate,
          commentFiles: this.data.commentImagesCloudIds
        }
      });
    }else {
      if(this.data.tempComent.length <= 0) {
        wx.showToast({
          title: '请输入评论内容',
          icon: 'none'
        });
        canCommit:false;
        return;
      }
      db.collection("comment").add({
        data: {
          _id: this.data.movieid,
          movieName: this.data.title,
          comment: this.data.tempComent,
          rate: this.data.myrate,
          commentFiles: this.data.commentImagesCloudIds
        }
      }).then(res => {
        wx.hideLoading();
        wx.showToast({
          title: '评论成功',
        });
        this.setData({
          mycomment: this.data.tempComent
        });
      }).catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: '评论失败',
        });
        console.error(err);
      });
    }

  },

  deleteComment:function(){
    wx.showLoading({
      title: '正在删除',
    });
    db.collection("comment").doc(this.data.movieid).remove().then(res=>{
      wx.hideLoading();
      wx.showToast({
        title: '删除成功',
      });
      this.setData({
        mycomment:"",
        tempComent:"",
        canCommit:false,
        myrate:3,
        commentImages:[],
        commentImagesCloudIds:[]
      });
    }).catch(err=>{
      wx.hideLoading();
      wx.showToast({
        title: '删除失败',
      });
      console.error(err);
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