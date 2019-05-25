// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

const axios = require("axios")
const movieDetailURl = "https://douban.uieee.com/v2/movie/subject/"

function finalReuslt(detail, mycomment, myseen, mycollect) {
  detail.mycollect = mycollect;
  detail.myseen = myseen;
  detail.mycomment = mycomment;
  return detail;
}

// 获取收藏信息
function collectInfo(movieid) {
  return db.collection('collectMoives').doc(movieid).get().then(res => {
    return res.data;
  }).catch(err => {
    return false;
  });
}

// 获取看过信息
function seenMoiveInfo(movieid) {
  return db.collection('SeenMovies').doc(movieid).get().then(res => {
    return res.data;
  }).catch(err => {
    return false;
  });
}

// 获取评论信息
function commentInfo(movieid) {
  return db.collection('comment').doc(movieid).get().then(res => {
    return res.data;
  }).catch(err => {
    return false;
  });
}

function detailInfo(movieid) {
  return axios.get(movieDetailURl + movieid).then(res => {
    return res.data;
  })
}

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取参数movieid
  const movieid = event.movieid;
  const detailPromise = detailInfo(movieid);
  const commentPromise = commentInfo(movieid);
  const seenPromise = seenMoiveInfo(movieid);
  const collectPromise = collectInfo(movieid);
  return Promise.all([detailPromise, commentPromise, seenPromise, collectPromise]).then(([detail, comment, seen, collect]) => finalReuslt(detail, comment,seen,collect));
}