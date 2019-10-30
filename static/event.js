var m_sum=0;
var m_sumre=0;
var m_online=0;
var m_offline=0;
var m_bLogin= false;
var m_strTime;
var mm_name;

var mm_id;

	//关闭所有视频
	function CloseAllVideo() {
		alert(1);
		VSPOcxClient.CloseVideo(2, -1);
	}

	function EventReady() {
		//Login();
		SetOcxSize(1040,592);
		document.getElementById("online").innerHTML = 0;
		document.getElementById("offline").innerHTML = 0;
	}

	function EventLoginServer(bSuccess) {
		if (!bSuccess)
		{
			console.log("登录失败！");
		}
		else
		{
			alert(1);
			console.log("登录成功！");			
			GetVersion();			
		}
	}
	//服务器信息
	function EventALCOperator(lOpType, lALCHandle, strName, ulState){
		var strState = 1===ulState ? "在线" : "离线";
		if(0 == lOpType)
		{//add
			var name = strName+"-"+strState;
			updateNode(1,name);
			updateNode_server(1,ulState);
		}
		else if(1 == lOpType)
		{//remove
		}
		else if(2 == lOpType)
		{//restate
			var name = strName+"-"+strState;
			updateNode(1,name);
		}
		else if(3 == lOpType)
		{//rename
		}
		else if(4 == lOpType)
		{//move
		}
	}
	//用户信息
	function EventCLIOperator(lOpType, lUserHandle, strName, ulState){
		var obtxt = ["未知状态","正在连接","连接失败","正在验证","验证失败","断开连接","成功登陆"];
			if(0 == lOpType)
			{//add
				var name = strName;
				AddNode(2,1,name);
			}
			else if(1 == lOpType)
			{//remove
				Destroy();
			}
			else if(2 == lOpType)
			{//restate
				var name = strName;
				updateNode(2,name);
				updateNode_user(2,ulState);
				
			}
			else if(3 == lOpType)
			{//rename
			}
			else if(4 == lOpType)
			{//move
			}
		
		}
	//组信息
	function EventGroupOperator(lOpType,  ulGroupID,  ulParentGroupID,  ulGroupType,  strName){

		var obtxt = ["正常分组","联动分组","联防分组"];
		if(0 == lOpType)
		{//add
			var name = strName;
			if(ulParentGroupID)
				AddNode(ulGroupID,ulParentGroupID,name);
			else			
				AddNode(ulGroupID,2,name);
				updateNode_shebei(ulGroupID,name,ulGroupType);
		}
		else if(1 == lOpType)
		{//remove
		}
		else if(2 == lOpType)
		{//restate
			var name = strName;
		}
		else if(3 == lOpType)
		{//rename
		}
		else if(4 == lOpType)
		{//move
		}
	}
	//摄像头信息回调
	function EventCameraOperator(lOpType, ulCameraID, ulParentGroupID, ulCameraType, strName, ulState){	
		var obtxt = ["报警设备","联动设备","其它设备"];
		var obstate = ["未知状态","正常状态","离线状态","报警状态","报警处理状态"];
		if(0 == lOpType)
		{//add
	
			var name = strName;
			m_sum = m_sum + 1;

			AddNode(ulCameraID,ulParentGroupID,name,false,ulState);
				
		}
		else if(1 == lOpType)
		{//remove
			m_sum = m_sum - 1;
			m_sumre = m_sumre - 1;
			if(1==ulState)
			{
				m_online = m_online-1;
				m_offline = m_sum - m_online;
			}
			if(2==ulState)
			{
				m_offline = m_offline-1;
				m_online = m_sum - m_offline;
			}
			document.getElementById("online").innerHTML = m_online;
		    document.getElementById("offline").innerHTML = m_offline;
			RemoveNode(ulCameraID);
		}
		else if(2 == lOpType)
		{//restate							
			var name = strName;
			updateNode(ulCameraID,name);
			updateNode_baojing(ulCameraID,name,ulState,ulParentGroupID);
			
			if(m_sumre==m_sum)
			{
				if(1==ulState)
				{
				m_online = m_online+1;
				m_offline = m_offline - 1;
				document.getElementById("online").innerHTML = m_online;
				document.getElementById("offline").innerHTML = m_offline;
				}
				if(2==ulState)
				{
				m_offline = m_offline + 1;
				m_online = m_online - 1;
				document.getElementById("online").innerHTML = m_online;
				document.getElementById("offline").innerHTML = m_offline;
				}
				if(3==ulState)
				{
				m_online = m_online-1;
				m_offline = m_offline + 1;
				}
					
			}
			else
			{
				m_sumre = m_sumre + 1;
				if(1==ulState)
				{
				m_online = m_online+1;
				m_offline = m_sumre - m_online;
				}
				if(2==ulState)
				{
				m_offline = m_offline+1;
				m_online = m_sumre - m_offline;
				}
				document.getElementById("online").innerHTML = m_online;
				document.getElementById("offline").innerHTML = m_offline;
			}
			
		
			
			if(ulState == 3)
			{				
			CloseAllVideo();
			curAlarmCameraID = ulCameraID;//此处将报警的设备ID付给curAlarmCameraID 			
			}
		}
		else if(3 == lOpType)
		{//rename
			var name = strName;
			updateNode(ulCameraID,name);
		}
		else if(4 == lOpType)
		{//move
		}

		if(1==ulState)
		{
			mm_id=ulCameraID;
			mm_name=strName;
			mm_state="报警处理状态";
			mm_time=m_strTime;
			dele();
		}				
		if(3==ulState)
		{
		var mytime=new Date();
		m_strTime=mytime.toLocaleString(); //获取当前时间
		
		mm_id=ulCameraID;
		mm_name=strName;
		mm_state="报警状态";
		mm_time=m_strTime;
		formBnt();
	
		alarmID=ulCameraID;
		}
		if(4==ulState)
		{
		mm_id=ulCameraID;
		mm_name=strName;
		mm_state="报警处理状态";
		mm_time=m_strTime;
		dele();
		formBnt();
		alarmID=0;
		}
		document.getElementById("online").innerHTML = m_online;
		document.getElementById("offline").innerHTML = m_offline;
		}
		
	//播放状态结果
	function EventCameraPlayRTState( ulCameraID,  ulState){
		//var obtxt = ["无","请求播放","等待媒体数据","播放视频","停止播放"];
		//alert(obtxt[ulState]);
		if(ulState == 0 )
			alert("打开视频失败！");
		if(ulState==3)
		{
		    PlayVideo(treeNode.id,-1);
		}
			
		if(ulState == 4)
		{
			onStopPlay(ulCameraID);
		}
	}