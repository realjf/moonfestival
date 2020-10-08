const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()


  return [year, month, day].map(formatNumber).join('-')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 经纬度转换成三角函数中度分表形式。
function rad(d) {
  return d * Math.PI / 180.0;
}


// 根据经纬度计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
const  getDistance = (lat1, lng1, lat2, lng2) =>{

  var radLat1 = rad(lat1);
  var radLat2 = rad(lat2);
  var a = radLat1 - radLat2;
  var b = rad(lng1) - rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000; //输出为公里

  var distance = s;
  var distance_str = "";

  if (parseInt(distance) >= 1) {
    distance_str = distance.toFixed(1) + "km";
  } else {
    distance_str = distance * 1000 + "m";
  }

  //s=s.toFixed(4);

  // console.info('lyj 距离是', s);
  // console.info('lyj 距离是', distance_str);
  return s;
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  getDistance: getDistance
}

