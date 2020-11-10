<template>
    <div>
      <el-row>
        <el-col :span="24" style="margin-top: 20px">
          <el-card style="width: 98%;margin: 0 auto;">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: path }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>工作流程</el-breadcrumb-item>
              <el-breadcrumb-item>增援待派</el-breadcrumb-item>
            </el-breadcrumb>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="margin-top: 20px">
          <el-card style="width: 98%;margin: 0 auto;">
            <vxe-table
              border
              :loading=loading
              ref="xTable"
              :data="tableData"
              export-config
              import-config>
              <vxe-table-column field="distributeOrderId" title="派单编号"></vxe-table-column>
              <vxe-table-column field="applyName" title="申请人"></vxe-table-column>
              <vxe-table-column field="tel" title="联系电话"></vxe-table-column>
              <vxe-table-column field="shopName" title="商铺名称"></vxe-table-column>
              <vxe-table-column field="address" title="地址"></vxe-table-column>
              <vxe-table-column field="reserveTime" title="预约时间" formatter="formatDate"></vxe-table-column>
              <vxe-table-column field="state" title="状态">
                <template v-slot="{ row }">
                  <span v-if="row.state == 1"><div class="offlinestate"></div><el-tag type="info">待接单</el-tag></span>
                  <span v-if="row.state == 3"><div class="onlinestate"></div><el-tag type="success">维修中</el-tag></span>
                </template>
              </vxe-table-column>
                <vxe-table-column field="isReinforce" title="增援状态">
                <template v-slot="{ row }">
                  <span v-if="row.isReinforce == 1"><div class="offlinestate"></div><el-tag type="info">待增援</el-tag></span>
                </template>
              </vxe-table-column>
              <vxe-table-column title="操作">
                <template v-slot="{ row }">
                  <el-row>
                    <el-col :span="12">
                      <el-dropdown trigger="click">
                        <el-button size="mini">处理<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item><vxe-button size="mini" content="增援" @click="receiveOrder(row)"></vxe-button></el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                    <el-col :span="12"><vxe-button size="mini" content="详情" @click="details(row.distributeOrderId)"></vxe-button></el-col>
                  </el-row>
                </template>
              </vxe-table-column>
            </vxe-table>
            <p style="text-align:center; line-height:50px;" v-loading="loading"><a style="text-decoration: none;" href="javascript:;"  @click="getMData()">点击加载更多</a></p>

            <!--details page-->
            <vxe-modal v-model="detailsPage"
                       id="13205513412328230662"
                       title="派单详情" width="800" height="500"
                       resize remember
                       :fullscreen=true
                       :esc-closable=true>
              <template v-slot>
                <!--details form-->
                <div style="width: 100%;margin: 0 auto;">
                  <el-form  ref="form" :model="detailsForm"  :rules="detailsRule"  label-width="80px" size="small">
                    <el-form-item label="报单类型" prop="workType">
                      <el-select v-model="detailsForm.workType" filterable placeholder="请选择" style="width: 100%" :disabled="true">
                        <el-option
                          v-for="item in repairType"
                          :key="item.workTypeId"
                          :label="item.workTypeName"
                          :value="item.workTypeId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="商铺名称" prop="shopName">
                      <el-input v-model="detailsForm.shopName" placeholder="请填写商铺名称"  :disabled="true"> </el-input>
                    </el-form-item>
                    <el-form-item label="申请人" prop="applyName">
                      <el-input v-model="detailsForm.applyName" placeholder="请填写申请人"  :disabled="true"> </el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="tel">
                      <el-input v-model="detailsForm.tel" placeholder="请填写联系电话"  :disabled="true"> </el-input>
                    </el-form-item>
                    <el-form-item label="预约时间" prop="reserveTime">
                      <el-date-picker
                        :disabled="true"
                        style="width: 100%;"
                        v-model="detailsForm.reserveTime"
                        :picker-options="pickerOptions"
                        type="datetime"
                        placeholder="选择日期时间"
                        default-time="09:00:00">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="详细位置" prop="address">
                      <el-row>
                        <el-col :span="24"><el-input v-model="detailsForm.address" placeholder="请填写详细位置"  :disabled="true"> </el-input></el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item label="故障描述" prop="faultDescriptionContent">
                      <mavon-editor :editable="false" v-model="detailsForm.faultDescriptionContent" ref="md" @imgAdd="$imgAdd" @change="change" style="min-height: 400px"/>
                    </el-form-item>
                    <el-form-item label="备注信息">
                      <el-input v-model="detailsForm.remark" placeholder="请填写备注信息,可不填"  :disabled="true"> </el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </template>
            </vxe-modal>

            <!--reinforce page-->
            <vxe-modal v-model="reinforcePage"
                       id="13205513412328230662"
                       title="增援列表" width="800" height="500"
                       resize remember
                       :fullscreen=true
                       :esc-closable=true>
              <template v-slot>
                <div style="width: 100%;margin: 0 auto;">
                  <!--工种筛选-->
                  <el-row>
                    <el-col :span="24">
                      <!--query postion-->
                      <el-card style="width: 98%;margin: 0 auto;">
                        <div slot="header" class="clearfix">
                          <span>维修员列表</span>
                        </div>
                        <div>
                          <el-row :gutter="70">
                            <el-form  ref="searchForm" :model="searchForm"  label-width="80px" size="small">
                              <el-col :span="5">
                                <el-select v-model="searchForm.trems" filterable placeholder="请选择" style="width: 100%">
                                  <el-option
                                    v-for="item in repairType"
                                    :key="item.workTypeId"
                                    :label="item.workTypeName"
                                    :value="item.workTypeId">
                                  </el-option>
                                </el-select>
                              </el-col>
                              <el-col :span="4">
                                <el-button class="el-icon-search" type="success"  size="small" @click="search('searchForm')">搜索</el-button>
                                <el-button class="el-icon-search" type="success"  size="small" @click="choice()">选车</el-button>
                              </el-col>
                            </el-form>
                          </el-row>
                          <el-row>
                            <el-col :span="24">
                              <vxe-table
                                border
                                :column-key=true
                                :row-key=true
                                ref="xWorkerTable"
                                :data="workerTableData">
                                <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                                <vxe-table-column field="repair_worker_id" title="维修员ID"></vxe-table-column>
                                <vxe-table-column field="real_name" title="真实姓名"></vxe-table-column>
                                <vxe-table-column field="repair_worker_type_name" title="工种">
                                  <template v-slot="{ row }">
                                    <span style="color: red;">
                                      {{row.repair_worker_type_name}}
                                    </span>
                                  </template>
                                </vxe-table-column>
                                <vxe-table-column field="name" title="角色"></vxe-table-column>
                                <vxe-table-column field="sex" title="性别">
                                  <template v-slot="{ row }">
                                    <span v-if="row.sex == 0">男</span>
                                    <span v-if="row.sex == 1">女</span>
                                  </template>
                                </vxe-table-column>
                                <vxe-table-column field="age" title="年龄"></vxe-table-column>
                                <vxe-table-column field="tel" title="手机号"></vxe-table-column>
                                <vxe-table-column field="address" title="地址"></vxe-table-column>
                                <vxe-table-column field="organize_name" title="组织"></vxe-table-column>
                                <vxe-table-column field="state" title="状态">
                                  <template v-slot="{ row }">
                                    <span v-if="row.state == 1"><el-tag type="success">空闲</el-tag></span>
                                    <span v-if="row.state == 0"><el-tag type="danger">维修中</el-tag></span>
                                  </template>
                                </vxe-table-column>
                              </vxe-table>
                              <!--分页-->
                              <el-pagination
                                @current-change="handleCurrentChange2"
                                :current-page=currentPage2
                                :page-size=pageSize2
                                layout="total, prev, pager, next, jumper"
                                :total=total2>
                              </el-pagination>
                            </el-col>
                          </el-row>
                        </div>
                      </el-card>
                    </el-col>
                  </el-row>
                </div>
                增援列表
              </template>
            </vxe-modal>


          </el-card>
        </el-col>
      </el-row>
    </div>
</template>

<script>
    export default {
        name: "unreinforce",
        data(){
            return{
                path:'\/index',
                loading: true,
                tableData:[],//待处理表格
                workerTableData:[],//维修员表格
                repairType:[],//维修类型
                detailsPage:false, //详情
                reinforcePage:false,//增援页面 （派维修员页面）
                choiceRepairWorkerPage:false, //选择维修员
                chioceWorkerOrderId:'',//指派增援维修员的订单id
                rowDate:{},
                currentPage: 1,
                pageSize:1,
                total: 100,
                currentPage2: 1,
                pageSize2:10,
                total2: 100,
                detailsForm:{
                    workOrderId:'',
                    workType:'',
                    shopId:'',
                    shopName:'',
                    applyName:'',
                    tel:'',
                    reserveTime:'',
                    address:"",
                    remark:"",
                    faultDescriptionContent:'',
                    faultDescription:'',
                },
                detailsRule:{
                    shopName: [
                        { required: true, message: '请填写商户名称', trigger: 'blur' },
                    ],
                    applyName: [
                        { required: true, message: '请填写姓名', trigger: 'blur' },
                    ],
                    tel: [
                        { required: true, message: '请填写联系电话', trigger: 'blur' },
                        { pattern: /^1[3|4|5|7|8][0-9]{9}$/ , message: '请填写合法手机号' },
                    ],
                    reserveTime: [
                        { required: true, message: '请选择预约时间', trigger: 'blur' },
                    ],
                    address: [
                        { required: true, message: '请填写详细信息', trigger: 'blur' },
                    ],
                    faultDescriptionContent: [
                        { required: true, message: '请填写故障描述', trigger: 'blur' },
                    ],
                },
                searchForm:{
                    trems:'',
                },
                pickerOptions:{
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }

                },
            }
        },
        methods:{
            getWorkType(){
                this.$axios.get('/api/sp/admin/worktype/list')
                    .then(function (response) {
                        this.$data.repairType = response.data;
                    }.bind(this))
                    .catch(function (error) {
                    });
            },
            getWorker(){
                //get worker data
                this.$axios.get('/api/sp/admin/worker/page/'+this.$data.currentPage2+'/'+this.$data.pageSize2+'?trems='+this.$data.searchForm.trems)
                    .then(function (response) {
                        this.$data.workerTableData = response.data.rows;
                        this.$data.total2 = response.data.records;
                    }.bind(this))
                    .catch(function (error) {
                    }.bind(this));
            },
            //page listen
            handleCurrentChange2(val) {
                let pageSize = this.$data.pageSize2
                //currentPage 变化监听
                this.$axios.get('/api/sp/admin/worker/page/'+val+'/'+pageSize+'?trems='+this.$data.searchForm.trems)
                    .then(function (response) {
                        this.$data.total2 = response.data.records;
                        this.$data.workerTableData = response.data.rows;
                    }.bind(this))
                    .catch(function (error) {});
            },
            search(formName){
                this.$axios.get('/api/sp/admin/worker/page/'+this.$data.currentPage2+'/'+this.$data.pageSize2+'?trems='+this.$data.searchForm.trems)
                    .then(function (response) {
                        this.$data.workerTableData = response.data.rows;
                        this.$data.total2 = response.data.records;
                    }.bind(this))
                    .catch(function (error) {
                    }.bind(this));
            },
            getWorkType(){
                this.$axios.get('/api/sp/admin/worktype/list')
                    .then(function (response) {
                        this.$data.repairType = response.data;
                    }.bind(this))
                    .catch(function (error) {
                    });
            },
            getData(){
                let item = localStorage.getItem("managerinfo");
                this.$axios.get('/api/sp/manager/unReinforce/page/'+this.$data.currentPage+'/'+this.$data.pageSize+"/"+JSON.parse(item).employeeId)
                    .then(function (response) {
                        this.$data.loading = false;
                        this.$data.tableData = response.data.rows;
                        this.$data.total = response.data.records;
                    }.bind(this))
                    .catch(function (error) {
                    });
            },
            getMData() {
                this.$data.loading = true;
                this.$data.pageSize = this.$data.pageSize + 2;
                this.getData();
            },
            details(id){
                this.getWorkType();
                this.$axios.get('/api/sp/repair/order/'+id)
                    .then(function (response) {
                        this.$data.detailsForm = response.data;
                        this.$data.detailsPage = true;
                    }.bind(this))
                    .catch(function (error) {
                    });
            },
            //增援
            receiveOrder(row){
                this.$data.reinforcePage = true;
                this.getWorker();
                this.getWorkType();
                this.$data.chioceWorkerOrderId = row.distributeOrderId;
            },
            choice(){
                let selectRecords = this.$refs.xWorkerTable.getCheckboxRecords()
                if(selectRecords.length === 0){
                    this.$XModal.alert("请选择维修员")
                }else {
                    let ids = [];
                    for (let i= 0; i<selectRecords.length;i++){
                        ids.push(selectRecords[i].repair_worker_id)
                    }
                    this.$axios.post('/api/sp/manager/reinforce/'+this.$data.chioceWorkerOrderId,ids)
                        .then(function (response) {
                            if(response.data.status == '200'){
                                let loding = this.createLoding();
                                setTimeout(() => {
                                    loding.close();
                                    this.$message({
                                        type: "success",
                                        message: '增派成功',
                                    });
                                    this.$data.reinforcePage = false;
                                    this.reload();
                                }, 1000);
                            }
                        }.bind(this))
                        .catch(function (error) {
                        });
                }
            },
            // 将图片上传到服务器，返回地址替换到md中
            $imgAdd(pos, $file){
                var formdata = new FormData();
                formdata.append('file', $file);
                // 这里没有服务器供大家尝试，可将下面上传接口替换为你自己的服务器接口
                this.$axios({
                    url: '/api/upload',
                    method: 'post',
                    data: formdata,
                    headers: { 'Content-Type': 'multipart/form-data' },
                }).then((url) => {
                    this.$refs.md.$img2Url(pos, url.data);
                })
            },
            change(value, render){
                // render 为 markdown 解析后的结果
                this.$data.html = render;
            },
            //loading status
            createLoding(){
                return this.$loading({
                    lock: true,//lock的修改符--默认是false
                    text: '加载中',//显示在加载图标下方的加载文案
                    spinner: 'el-icon-loading',//自定义加载图标类名
                    background: 'rgba(0, 0, 0, 0.7)',//遮罩层颜色
                    target: document.querySelector('#table')//loadin覆盖的dom元素节点
                });
            },
            reload() {
                // 清除所有状态
                this.$refs.xTable.clearAll();
                return this.getData();
            },
        },
        created() {
            this.getData();
        }
    }
</script>

<style scoped>
  .offlinestate{
    background-color: #cacfda;
    margin-right: 8px;
    width: 10px;
    height: 10px;
    display: inline-block;
    border-radius: 50%;
  }
  .onlinestate{
    background-color: #66da24;
    margin-right: 8px;
    width: 10px;
    height: 10px;
    display: inline-block;
    border-radius: 50%;
  }
</style>
