<script>
// const ip = "117.71.63.86"; //安徽现场环境
// const ip = "192.168.20.18";//开发地址
// const ip = "192.168.20.21";//本地测试服务器地址
// const ip = "118.31.2.114";//民航阿里云
/* let serveInfo = { //本地测试服务器地址
  ip : "172.16.1.241",
  wsuriPort: 8100,
  ftpPort: 212,
  downloadUriPort: 211,
  downloadProgressUriPort: 211
} */
let serveInfo = { //民航阿里云
  ip : "118.31.2.114",
  wsuriPort: 8100,
  ftpPort: 8484,
  downloadUriPort: 8100,
  downloadProgressUriPort: 8100
}
const CoLogo = "/imgs/logo.png";
const imgUrl = "/imgs/";
const wsuri = "ws://"+ serveInfo.ip + ":"+serveInfo.wsuriPort+"/public/aipSocket";  //本地服务
const ftpuri = "http://"+ serveInfo.ip + ":"+serveInfo.ftpPort+"/resource";  //本地服务
const downloadUri = "http://"+ serveInfo.ip + ":"+serveInfo.downloadUriPort+"/ledResource/resource/ledResourceDownload?id=";  //本地服务
const downloadProgressUri = "http://"+ serveInfo.ip + ":"+serveInfo.downloadProgressUriPort+"/ledResource/resource/getByJSON";  //本地服务
const alarmTimeOut = 60000;//一键报警超时时间

  export default
  {
    wsuri,  //ws地址
    ftpuri,  //文件服务器地址
    downloadUri,  //下载服务路径
    downloadProgressUri,  //下载进度post路径
    CoLogo,  //公司Logo
    alarmTimeOut,//一键报警超时时间
	imgUrl,
    methods: {
      // 当前登录人所在公司
      areaFormat(val) {  
        var text = CodeToText[val.provinceId] + CodeToText[val.cityId] + CodeToText[val.districtId];
        return text;
      },
    },
  }
</script>