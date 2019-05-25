// 云函数入口文件
const axios = require('axios');
const movieListReutestURL = "https://douban.uieee.com/v2/movie/in_theaters";

// 云函数入口函数
exports.main = async (event, context) => {
  return axios.get(`${movieListReutestURL}?start=${event.start}&count=${event.count}`).then(function (res) {
    return res.data;
  }).catch(function(err){
    console.error(err)
  })
}