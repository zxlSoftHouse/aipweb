
export default{
    //初始化
    EventReady(){
        alert('EventReady')
        SetOcxSize(1040, 592);
    },

    
    //设置窗体缩小
    SetOcxSize(width, height) {
        VSPOcxClient.SetOcxSize(width, height);
        $("#VSPOcxClient").attr("width", width);
        $("#VSPOcxClient").attr("height", height);
        this.loginAlarm();
    },

    //登录
    loginAlarm() {
        console.log('loginAlarm')
        var username = 'sunrn';
        var password = '123456';
        var address = '172.16.1.159';
        var port = '9534';
        VSPOcxClient.LoginServer(address, port, username, password);
    },

    //播放视频
    PlayVideo(CameraID, Index = 0) {
        var handle = VSPOcxClient.PlayVideo(CameraID, Index);
    },
    //关闭所有视频
    CloseAllVideo() {
        VSPOcxClient.CloseVideo(2, -1);
    },
    //关闭指定视频
    closeVideo(index) {
        VSPOcxClient.CloseVideo(1, index);
    },

    //设置窗口布局 支持1，4，5，8，9，13，16
	SetLayout(num) {
    	VSPOcxClient.SetLayout(num);
    }


 /*    EventLoginServer(bSuccess) {
        if (!bSuccess) {
            alert("登录失败");
        }
        else {
            alert("登录成功！");
            // GetVersion();
        }
    } */
}