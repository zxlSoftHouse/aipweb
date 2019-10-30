<template>
  <div>
    <el-row>
      <el-col :span="16">
        <el-button type="success" @click="handleAdd()">新增</el-button>
        <el-button type="danger" @click="restart()">重启</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  data() {
    return {};
  },
  methods: {
    handleAdd() {
      request({
        url: "led/command/y30-219-84181",
        method: "post",
        data: {
          type: "commandXixunPlayer",
          _id: "28dc5b76-51c9-11e9-9b24-4ccc6a85f6dc",
          command: {
            _type: "PlayXixunTask",
            id: "28dd5a80-51c9-11e9-9b24-4ccc6a95f6dc",
            preDownloadURL: "http://192.168.1.104:8081/",
            notificationURL: "",
            task: {
              _id: "28dd55c6-51c9-11e9-9b24-4ccc6a95f6dc",
              name: "视频2",
              items: [
                {  //节目单
                  _id: "28dd531e-51c9-11e9-9b24-4ccc6a95f6dc",
                  _program: {
                    _id: "28dd2786-51c9-11e9-9b24-4ccc6a95f6dc",
                    totalSize: "7171243",
                    version: 2,
                    name: "定时",
                    width: 1920,
                    height: 1080,
                    layers: [
                      {  //资源
                        sources: [
                          {
                            _type: "Video",
                            _id: "1",
                            id: "21.mp4",
                            name: "21.mp4",
                            size: "2386468",
                            playTime: 0,
                            timeSpan: 3,
                            fileExt: ".mp4",
                            mime: "video/mp4"
                          },
                          {
                            _type: "Video",
                            _id: "2",
                            id: "test.mp4",
                            name: "test.mp4",
                            size: "4177647",
                            playTime: 20,
                            timeSpan: 3,
                            fileExt: ".mp4",
                            mime: "video/mp4"
                          },
                          {
                            _type: "Image",
                            _id: "3",
                            id: "link.jpg",
                            name: "link.jpg",
                            size: "197879",
                            playTime: 30,
                            timeSpan: 3,
                            fileExt: ".jpg",
                            mime: "image/jpeg"
                          },
                          {
                            _type: "Image",
                            _id: "4",
                            id: "风景2.jpeg",
                            name: "风景2.jpeg",
                            size: "409249",
                            playTime: 10,
                            timeSpan: 3,
                            fileExt: ".jpeg",
                            mime: "image/jpeg"
                          }
                        ],
                        repeat: true
                      }
                    ]
                  },
                  repeatTimes: 1,
                  version: 1,
                  schedules: [
                    {
                      filterType: "None",
                      timeType: "All",
                      dateType: "All",
                      name: "2019-03-2910: 04: 50"
                    }
                  ]
                }
              ]
            }
          }
        }
      }).then(res => {
      });
      // var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
      // httpRequest.open('POST', 'set/settings', true); //第二步：打开连接/***发送json格式文件必须设置请求头 ；如下 - */
      // httpRequest.setRequestHeader("Content-Type","text/plain");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
      // var obj = {
      //     // 标识一条命令，为客户端随机字符串
      //     "_id": "98e8d3cd47fad6ce8e3f7b8d42cb4d9b",
      //     // 命令类型
      //     "_type": "GetCardName"
      // }
      // httpRequest.send(JSON.stringify(obj));//发送请求 将json写入send中
      // /**
      // * 获取数据后的处理程序
      // */
      // httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
      //     if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
      //         var json = httpRequest.responseText;//获取到服务端返回的数据
      //     }
      // };
    },
    restart(){
      request({
        url: "led/command/y30-219-84181",
        method: "post",
        data:{
            "type": "callCardService",
            "fn": "reboot",
            "arg1": 1, //delayForSecond
        }
      }).then(res => {
      });
    }
  }
};
</script>