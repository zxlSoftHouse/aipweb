
    var alarmVersion = "";
    var alarmList = [];

    //初始化
    function EventReady(){
        // console.log('EventReady')
        SetOcxSize(1040, 592);
    }

    
    //设置窗体缩小
    function SetOcxSize(width, height) {
        VSPOcxClient.SetOcxSize(width, height);
        $("#VSPOcxClient").attr("width", width);
        $("#VSPOcxClient").attr("height", height);
    }

    //登录回调
    function EventLoginServer(bSuccess) {
        if (!bSuccess) {
            alarmList=[];
            pubsub.emit('login', {state: 'error', msg:'一键告警登陆失败'});
        }
        else {
            pubsub.emit('login', {state: 'success', msg:'一键告警登陆成功'});
            GetVersion();
        }
    }

    //获取版本号
    function GetVersion() {
        version = VSPOcxClient.GetVersion();
        // console.log("获取版本号")
        // console.log(version)
        //	$("#version").html(version);
    }

    //服务器信息  
    //lOpType操作类型 0 添加 1移除 2状态改变 3更名
    function EventALCOperator(lOpType, lALCHandle, strName, ulState) {
        console.log("报警服务器变化通知")
        console.log(lOpType+"___"+lALCHandle+"___"+strName+"___"+"___"+ulState)
        var strState = 1 === ulState ? "在线" : "离线";
    }
    //用户信息
    function EventCLIOperator(lOpType, lUserHandle, strName, ulState) {
        // console.log("登录用户变化通知")
        // console.log(lOpType+"___"+lUserHandle+"___"+strName+"___"+"___"+ulState)
        var obtxt = ["未知状态", "正在连接", "连接失败", "正在验证", "验证失败", "断开连接", "成功登陆"];
        
    }
    //组信息
    function EventGroupOperator(lOpType, ulGroupID, ulParentGroupID, ulGroupType, strName) {

        var obtxt = ["正常分组", "联动分组", "联防分组"];
        if (0 == lOpType) {//add
        }
        else if (1 == lOpType) {//remove
        }
        else if (2 == lOpType) {//restate
            var name = strName;
        }
        else if (3 == lOpType) {//rename
        }
        else if (4 == lOpType) {//move
        }
    }

    //设备变化通知 摄像头信息回调
    //lOpType操作类型 0添加 1移除 2状态改变 3更名 4移动
    //ulCameraID 设备ID
    //ulParentGroupID父分组ID
    //ulCameraType设备类型 0报警设备 1联动设备
    //strName 设备名称
    //ulState 当前状态 1正常 2离线 3报警 4报警处理
    function EventCameraOperator(lOpType, ulCameraID, ulParentGroupID, ulCameraType, strName, ulState) {
        console.log("设备变化通知")
        console.log(alarmList)
        // console.log(lOpType+"___"+ulCameraID+"___"+"___"+ulParentGroupID+"___"+ulCameraType+"___"+strName+"___"+"___"+ulState)
        var obtxt = ["报警设备", "联动设备", "其它设备"];
        var obstate = ["未知状态", "正常状态", "离线状态", "报警状态", "报警处理状态"];
        var alarmInfo = {
            'lOpType':lOpType, 'ulCameraID':ulCameraID, 'ulParentGroupID':ulParentGroupID, 
            'ulCameraType':ulCameraType, 'strName':strName, 'ulState':ulState
        };
        if(alarmList.length==0){
            alarmList.push(alarmInfo)
        }else{
            var idx = alarmList.findIndex(function (res) {
                return res.strName == alarmInfo.strName;
            });
            idx!=-1?alarmList[idx]=alarmInfo:alarmList.push(alarmInfo)
        }
        
        // console.log(alarmList)
        pubsub.emit('EventCameraOperator',alarmList)
    }

    //播放状态结果
    function EventCameraPlayRTState(ulCameraID, ulState) {
        var obtxt = ["无","请求播放","等待媒体数据","播放视频","停止播放"];
        console.log(obtxt[ulState]);
        if (ulState == 0)
            alert("打开视频失败！");
        if (ulState == 3) {
            // PlayVideo(treeNode.id, -1);
        }

        if (ulState == 4) {
            // onStopPlay(ulCameraID);
        }
    }

    