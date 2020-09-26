const basePath = 'https://接口统一前缀';
const urlList = {

  //developer为开发版；trial为体验版；formal为正式版；
  // version: 'formal',
  version: 'trial',

  // 提交巡查信息（告知单、签到信息）
  submitCheckInInfo: basePath + '/AddPatrol',
  // 上传巡查信息附带的图片
  submitCheckInPhoto: basePath + '/AddPatrolPhotos',

}
module.exports = urlList;
