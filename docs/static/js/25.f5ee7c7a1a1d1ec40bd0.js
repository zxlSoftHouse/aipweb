webpackJsonp([25],{"k+bQ":function(e,t,l){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=l("woOf"),a=l.n(o),n=l("vLgD"),r=function(e,t){return Object(n.a)({url:"api/SERVICE-AIP/lampControl/queryPage",method:"post",data:{pageNum:e,pageSize:t}})},i=function(e){return Object(n.a)({url:"api/SERVICE-AIP/lampControl/deleteLampControl",method:"post",data:e})},s=function(e){return Object(n.a)({url:"api/SERVICE-AIP/lampControl/update",method:"put",data:e})},c=function(e){return Object(n.a)({url:"api/SERVICE-AIP/lampControl/deleteLampControlBind",method:"post",data:e})},d=function(e){return Object(n.a)({url:"api/SERVICE-AIP/lampControl/queryById/"+e,method:"get"})},p=function(){return Object(n.a)({url:"api/SERVICE-AIP/deviceTender/queryList",method:"post",data:{}})},m=function(){return Object(n.a)({url:"api/SERVICE-AIP/deviceModel/queryList",method:"post",data:{deviceType:"02"}})},u=function(e){return Object(n.a)({url:"api/SERVICE-AIP/deviceModel/queryDeviceModelParams",method:"get",params:{deviceModelId:e}})},f=function(e){return Object(n.a)({url:"api/SERVICE-AIP/policyConfig/getPolicyConfigList",method:"post",data:{policyType:e}})},h={data:function(){return{flag:"",total:0,pageSize:10,currentPage:1,tableData:[],multipleSelection:[],showDialog:!1,dialogTitle:"",formLabelWidth:"100px",rules:{controlType:[{required:!0,message:"请选择单控器类型",trigger:"change"}],controlName:[{required:!0,message:"请填写单控器名称",trigger:"blur"}]},lampControl:{rowId:"",controlName:"",protocolXml:"",controlCode:"",controlModelId:"",controlTenderId:"",bindingFlag:"",controlAddress:"",solarPolicyId:"",lampControlParamList:[]},powerSrc:1,formSelection:{htmlOption:[{value:"1",label:"输入框"},{value:"2",label:"下拉框"},{value:"3",label:"多选"},{value:"4",label:"文本框"},{value:"5",label:"单选"}],dataTypeOption:[{value:"1",label:"整数"},{value:"2",label:"文字"}],controlTypeOption:[{value:"0",label:"集中控制器通信"},{value:"1",label:"基站通信"}],tenderOptions:[],modelOptions:[],strategy:[]}}},components:{},mounted:function(){this.getTableData(),this.getFormSelection()},methods:{getTableData:function(){var e=this;r(this.currentPage,this.pageSize).then(function(t){e.total=t.total,e.tableData=t.records})},getFormSelection:function(){this.queryTenderOptions(),this.queryModelOptions()},queryTenderOptions:function(){var e=this;p().then(function(t){e.formSelection.tenderOptions=t.filter(function(e){return"02"===e.deviceType}),console.log(e.formSelection)})},queryModelOptions:function(){var e=this;m().then(function(t){e.formSelection.modelOptions=t})},queryParamsByModel:function(e){var t=this;u(e).then(function(e){t.lampControl.lampControlParamList=e}),this.formSelection.modelOptions.map(function(l){l.rowId===e&&(t.powerSrc=l.lampControlPowersrc)}),f(this.powerSrc).then(function(e){t.formSelection.strategy=e})},deleteLampControlBind:function(){var e=this,t=[];this.multipleSelection.map(function(e){t.push(e.rowId)}),c(t).then(function(t){e.$message({type:"success",message:"解绑成功！"}),e.getTableData()})},handleAdd:function(){this.lampControl.rowId="",this.flag="add",this.dialogTitle="新增",this.showDialog=!0},handleEdit:function(){var e=this;if(0!=this.multipleSelection.length)if(this.flag="edit",1===this.multipleSelection.length){var t=this.multipleSelection[0];this.lampControl=a()(this.lampControl,t),d(t.rowId).then(function(t){e.lampControl.lampControlParamList=t.lampControlParamList}),this.dialogTitle="编辑",this.showDialog=!0}else this.$message({type:"warning",message:"不支持多条编辑"});else this.$message({type:"warning",message:"请先选择一条记录"})},handleDelete:function(){var e=this;0!=this.multipleSelection.length?this.$confirm("确定要删除此条记录？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){var t=[];e.multipleSelection.map(function(l){t.push(l.rowId),"1"==l.bindingFlag?e.$message({type:"info",message:"有单灯控制器已被绑定，请解绑后重试！"}):e.doDelete(t)})}).catch(function(){e.$message({type:"info",message:"已取消删除"})}):this.$message({type:"warning",message:"请先选择一条记录"})},doDelete:function(e){var t=this;i(e).then(function(e){t.$message({type:"success",message:"删除成功"}),t.getTableData()}).catch(function(){t.$message.error("服务器错误")})},cancelUpdate:function(){this.$refs.Form.resetFields(),this.lampControl.lampControlParamList=[],this.showDialog=!1},saveOrUpdate:function(){var e=this;this.$refs.Form.validate(function(t){t&&s(e.lampControl).then(function(t){t.rowId?(e.showDialog=!1,e.$message({type:"success",message:"add"==e.flag?"新增成功":"修改成功"}),e.getTableData()):e.$message.error("服务器错误")})})},current_change:function(e){this.currentPage=e,this.getTableData()},addOneParm:function(){this.lampControl.lampControlParamList.push({param:"",htmlType:"",dataType:"",option:""})},deleteOneParm:function(){this.lampControl.lampControlParamList.pop()},handleSelectionChange:function(e){this.multipleSelection=e},bindingFormat:function(e){return"0"==e.bindingFlag?"未绑定":"已绑定"},getByTenderId:function(e){var t=this.formSelection.tenderOptions.filter(function(t){return t.rowId==e.controlTenderId});return t.length>0?t[0].venderName:"未知厂家"}}},b={render:function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("div",[l("el-row",[l("el-col",{attrs:{span:16}},[l("el-button",{attrs:{type:"success"},on:{click:function(t){return e.handleAdd()}}},[e._v("新增")]),e._v(" "),l("el-button",{on:{click:function(t){return e.handleEdit()}}},[e._v("编辑")]),e._v(" "),l("el-button",{attrs:{type:"danger"},on:{click:function(t){return e.handleDelete()}}},[e._v("删除")]),e._v(" "),l("el-button",{attrs:{type:"danger"},on:{click:function(t){return e.deleteLampControlBind()}}},[e._v("一键解绑")])],1)],1),e._v(" "),l("el-table",{ref:"multipleTable",staticStyle:{width:"100%"},attrs:{data:e.tableData,"tooltip-effect":"dark"},on:{"selection-change":e.handleSelectionChange}},[l("el-table-column",{attrs:{type:"selection",width:"55"}}),e._v(" "),l("el-table-column",{attrs:{prop:"controlName",label:"单控器名称"}}),e._v(" "),l("el-table-column",{attrs:{prop:"bindingFlag",label:"绑定状态",formatter:e.bindingFormat}}),e._v(" "),l("el-table-column",{attrs:{prop:"controlTenderId",formatter:e.getByTenderId,label:"单控器厂家"}}),e._v(" "),l("el-table-column",{attrs:{prop:"controlCode",label:"单控器型号"}}),e._v(" "),l("el-table-column",{attrs:{prop:"controlAddress",label:"单控器地址"}})],1),e._v(" "),l("div",{staticStyle:{"text-align":"center","margin-top":"30px"}},[l("el-pagination",{attrs:{background:"",layout:"prev, pager, next",total:e.total},on:{"current-change":e.current_change}})],1),e._v(" "),l("el-dialog",{staticClass:"dialog-common-sys",attrs:{title:e.dialogTitle,visible:e.showDialog,"modal-append-to-body":!1,"close-on-click-modal":!1},on:{"update:visible":function(t){e.showDialog=t},close:function(t){return e.cancelUpdate()}}},[l("el-form",{ref:"Form",attrs:{model:e.lampControl,rules:e.rules,inline:!0}},[l("el-row",[l("el-col",{attrs:{span:12}},[l("el-form-item",{attrs:{label:"单控器名称","label-width":e.formLabelWidth,prop:"controlName"}},[l("el-input",{attrs:{"auto-complete":"off",placeholder:"请填写单控器名称"},model:{value:e.lampControl.controlName,callback:function(t){e.$set(e.lampControl,"controlName",t)},expression:"lampControl.controlName"}})],1)],1),e._v(" "),l("el-col",{attrs:{span:12}},[l("el-form-item",{attrs:{label:"单控器厂家","label-width":e.formLabelWidth,prop:"controlTenderId"}},[l("el-select",{attrs:{placeholder:"请选择单控器厂家"},model:{value:e.lampControl.controlTenderId,callback:function(t){e.$set(e.lampControl,"controlTenderId",t)},expression:"lampControl.controlTenderId"}},e._l(e.formSelection.tenderOptions,function(e){return l("el-option",{key:e.rowId,attrs:{label:e.venderName,value:e.rowId}})}),1)],1)],1),e._v(" "),l("el-col",{attrs:{span:12}},[l("el-form-item",{attrs:{label:"单控器型号","label-width":e.formLabelWidth,prop:"controlModelId"}},[l("el-select",{attrs:{placeholder:"请选择单控器型号"},on:{change:e.queryParamsByModel},model:{value:e.lampControl.controlModelId,callback:function(t){e.$set(e.lampControl,"controlModelId",t)},expression:"lampControl.controlModelId"}},e._l(e.formSelection.modelOptions,function(e){return l("el-option",{key:e.rowId,attrs:{label:e.modelName,value:e.rowId}})}),1)],1)],1),e._v(" "),l("el-col",{attrs:{span:12}},[l("el-form-item",{attrs:{label:"单控器策略","label-width":e.formLabelWidth,prop:"solarPolicyId"}},[l("el-select",{attrs:{placeholder:"请选择单控器策略"},model:{value:e.lampControl.solarPolicyId,callback:function(t){e.$set(e.lampControl,"solarPolicyId",t)},expression:"lampControl.solarPolicyId"}},e._l(e.formSelection.strategy,function(e){return l("el-option",{key:e.rowId,attrs:{label:e.name,value:e.rowId}})}),1)],1)],1),e._v(" "),l("el-col",{attrs:{span:12}},[l("el-form-item",{attrs:{label:"单控器编号","label-width":e.formLabelWidth,prop:"controlCode"}},[l("el-input",{attrs:{"auto-complete":"off",placeholder:"请填写单控器编号"},model:{value:e.lampControl.controlCode,callback:function(t){e.$set(e.lampControl,"controlCode",t)},expression:"lampControl.controlCode"}})],1)],1),e._v(" "),l("el-col",{attrs:{span:12}},[l("el-form-item",{attrs:{label:"单控器地址","label-width":e.formLabelWidth,prop:"controlAddress"}},[l("el-input",{attrs:{"auto-complete":"off",placeholder:"请填写单控器地址"},model:{value:e.lampControl.controlAddress,callback:function(t){e.$set(e.lampControl,"controlAddress",t)},expression:"lampControl.controlAddress"}})],1)],1)],1),e._v(" "),e._l(e.lampControl.lampControlParamList,function(t,o){return l("el-row",{key:o},[l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"参数项名称","label-width":e.formLabelWidth,prop:""}},[l("el-input",{attrs:{"auto-complete":"off",placeholder:"请填写参数项名称",disabled:!0},model:{value:t.param,callback:function(l){e.$set(t,"param",l)},expression:"item.param"}})],1)],1),e._v(" "),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"Html类型","label-width":e.formLabelWidth,prop:""}},[l("el-select",{attrs:{placeholder:"请选择Html类型",disabled:!0},model:{value:t.htmlType,callback:function(l){e.$set(t,"htmlType",l)},expression:"item.htmlType"}},e._l(e.formSelection.htmlOption,function(e){return l("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1)],1)],1),e._v(" "),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"数据类型","label-width":e.formLabelWidth,prop:""}},[l("el-select",{attrs:{placeholder:"请选择数据类型",disabled:!0},model:{value:t.dataType,callback:function(l){e.$set(t,"dataType",l)},expression:"item.dataType"}},e._l(e.formSelection.dataTypeOption,function(e){return l("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1)],1)],1),e._v(" "),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"选项","label-width":e.formLabelWidth,prop:""}},[l("el-input",{attrs:{"auto-complete":"off",disabled:!0},model:{value:t.option,callback:function(l){e.$set(t,"option",l)},expression:"item.option"}})],1)],1)],1)})],2),e._v(" "),l("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[l("el-button",{on:{click:function(t){return e.cancelUpdate()}}},[e._v("取 消")]),e._v(" "),l("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.saveOrUpdate()}}},[e._v("确 定")])],1)],1)],1)},staticRenderFns:[]},g=l("VU/8")(h,b,!1,null,null,null);t.default=g.exports}});