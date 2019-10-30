<template>
    <div id="test">             

        <div id="top">          
                <el-button type="text" @click="search" style="color:white">查询</el-button>   
                <el-button type="text" @click="handleadd" style="color:white">添加</el-button>                
        </div>  

        <br/>

        <div style="margin-top:15px">   

          <el-table
            ref="testTable"       
            :data="tableData"
            style="width:100%"
            border
            >
            <el-table-column
              prop="job_NAME"
              label="任务名称"
              sortable
              show-overflow-tooltip>
            </el-table-column>

            <el-table-column
              prop="job_GROUP"
              label="任务所在组"
              sortable>
            </el-table-column>

            <el-table-column
              prop="job_CLASS_NAME"
              label="任务类名"
              sortable>
            </el-table-column>

            <el-table-column
              prop="trigger_NAME"
              label="触发器名称"
              sortable>
            </el-table-column>

            <el-table-column
              prop="trigger_GROUP"
              label="触发器所在组"
              sortable>
            </el-table-column>

            <el-table-column
              prop="cron_EXPRESSION"
              label="表达式"
              sortable>
            </el-table-column>

            <el-table-column
              prop="time_ZONE_ID"
              label="时区"
              sortable>
            </el-table-column>

            <el-table-column
              prop="trigger_STATE"
              label="状态"
              sortable>
            </el-table-column>

            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <el-button v-if="scope.row.trigger_STATE!=='PAUSED'"
                  size="small"
                  type="warning"
                  @click="handlePause(scope.$index, scope.row)">暂停</el-button>

                <el-button v-else
                  size="small"
                  type="info"
                  @click="handleResume(scope.$index, scope.row)">恢复</el-button>

                <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>

                <el-button
                  size="small"
                  type="success"
                  @click="handleUpdate(scope.$index, scope.row)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div align="center">
              <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="pagesize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalCount">
              </el-pagination>
          </div>
        </div> 

        <el-dialog title="添加任务" :append-to-body="true" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="任务名称" label-width="120px" style="width:35%">
              <el-input v-model="form.jobName" auto-complete="off"></el-input>
            </el-form-item>     
            <el-form-item label="任务分组" label-width="120px" style="width:35%">
              <el-input v-model="form.jobGroup" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="表达式" label-width="120px" style="width:35%">
              <el-input v-model="form.cronExpression" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="add">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog title="修改任务" :append-to-body="true" :visible.sync="updateFormVisible">
          <el-form :model="updateform">
            <el-form-item label="表达式" label-width="120px" style="width:35%">
              <el-input v-model="updateform.cronExpression" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="updateFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="update">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>
<script>
import quartzApi from '@/api/sysManage/quartz'
export default {   
    data(){      
        return{
            //表格当前页数据
            tableData: [],
            //默认每页数据量
            pagesize: 10,               
            //当前页码
            currentPage: 1,
            //查询的页码
            start: 1,
            //默认数据总数
            totalCount: 1000,
            //添加对话框默认可见性
            dialogFormVisible: false,
            //修改对话框默认可见性
            updateFormVisible: false,
            //提交的表单
            form: {
                jobName: '',
                jobGroup: '',
                cronExpression: '',
            },
            updateform: {
                jobName: '',
                jobGroup: '',
                cronExpression: '',
            },
        } 
        
    },

    mounted(){        
        //载入数据
        this.loadData(this.currentPage, this.pagesize);
    },
    methods: {
        //从服务器读取数据
        loadData(pageNum, pageSize) {        
            quartzApi.queryjob({pageNum,pageSize}).then(res=>{
                this.tableData = res.JobAndTrigger.list;
                this.totalCount = res.JobAndTrigger.total*1;
            },function(){
            });                 
        },                              

        //单行删除
        handleDelete(index, row) {
            quartzApi.deletejob({"jobClassName":row.job_NAME,"jobGroupName":row.job_GROUP}).then(res=>{
                this.loadData( this.currentPage, this.pagesize);
            },function(){
            });
        },

        //暂停任务
        handlePause(index, row){
            quartzApi.pausejob({"jobClassName":row.job_NAME,"jobGroupName":row.job_GROUP}).then(res=>{
                this.loadData( this.currentPage, this.pagesize);
            },function(){
            });
        },

        //恢复任务
        handleResume(index, row){
            quartzApi.resumejob({"jobClassName":row.job_NAME,"jobGroupName":row.job_GROUP}).then(res=>{
                this.loadData( this.currentPage, this.pagesize);
            },function(){
            });
        },

        //搜索
        search(){
            this.loadData(this.currentPage, this.pagesize);
        },

        //弹出对话框
        handleadd(){                      
            this.dialogFormVisible = true;                
        },

        //添加
        add(){
            quartzApi.addjob({
                "jobClassName":this.form.jobName,
                "jobGroupName":
                this.form.jobGroup,
                "cronExpression":this.form.cronExpression
                }).then(res=>{
                this.loadData(this.currentPage, this.pagesize);
                this.dialogFormVisible = false;
            },function(){
            });
        },

        //更新
        handleUpdate(index, row){
            this.updateFormVisible = true;
            this.updateform.jobName = row.job_CLASS_NAME;
            this.updateform.jobGroup = row.job_GROUP;
        },

        //更新任务
        update(){
            quartzApi.reschedulejob
            ({"jobClassName":this.updateform.jobName,
                        "jobGroupName":this.updateform.jobGroup,
                        "cronExpression":this.updateform.cronExpression
                        }
            ).then(res=>{
                this.loadData(this.currentPage, this.pagesize);
                this.updateFormVisible = false;
            },function(){
            });

        },

        //每页显示数据量变更
        handleSizeChange(val) {
            this.pagesize = val;
            this.loadData(this.currentPage, this.pagesize);
        },

        //页码变更
        handleCurrentChange(val) {
            this.currentPage = val;
            this.loadData(this.currentPage, this.pagesize);
        },        

    }
}
</script> 
<style rel="stylesheet/scss" lang="scss">
    #top {
        background:#20A0FF;
        padding:5px;
        overflow:hidden
    }
</style>