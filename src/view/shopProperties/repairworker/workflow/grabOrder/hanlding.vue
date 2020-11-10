<template>
  <div>
    <el-row>
      <el-col :span="24" style="margin-top: 20px">
        <el-card style="width: 98%;margin: 0 auto;">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: path }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>工作流程</el-breadcrumb-item>
            <el-breadcrumb-item>抢单专区</el-breadcrumb-item>
            <el-breadcrumb-item>正在处理</el-breadcrumb-item>
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
            <vxe-table-column field="reward_work_oder_id" title="报修单编号"></vxe-table-column>
            <vxe-table-column field="apply_name" title="申请人"></vxe-table-column>
            <vxe-table-column field="tel" title="联系电话"></vxe-table-column>
            <vxe-table-column field="shop_name" title="商铺名称"></vxe-table-column>
            <vxe-table-column field="work_type_name" title="保修类型"></vxe-table-column>
            <vxe-table-column field="address" title="地址"></vxe-table-column>
            <vxe-table-column field="create_time" title="预约时间" formatter="formatDate"></vxe-table-column>
            <vxe-table-column field="state" title="状态">
              <template v-slot="{ row }">
                <span v-if="row.state == 1"><div class="onlinestate"></div><el-tag type="info">已接单</el-tag></span>
                <span v-if="row.state == 3"><div class="onlinestate"></div><el-tag type="info">维修中</el-tag></span>
              </template>
            </vxe-table-column>
            <vxe-table-column title="操作">
              <template v-slot="{ row }">
                <el-row>
                  <el-col :span="12">
                    <el-dropdown trigger="click">
                      <el-button size="mini">处理<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="row.state == 1"><vxe-button size="mini" content="开始维修" @click="beginRepair(row)"></vxe-button></el-dropdown-item>
                        <el-dropdown-item v-if="row.state == 1"><vxe-button size="mini" content="退单" @click="chargeBack(row.reward_work_oder_id)"></vxe-button></el-dropdown-item>
                        <el-dropdown-item v-if="row.state == 3"><vxe-button size="mini" content="完成订单" @click="finishOrder(row)"></vxe-button></el-dropdown-item>
                        <el-dropdown-item v-if="row.state == 3"><vxe-button size="mini" content="退单" @click="chargeBack2(row.reward_work_oder_id)"></vxe-button></el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                  <el-col :span="12"><vxe-button size="mini" content="详情" @click="details(row.reward_work_oder_id)"></vxe-button></el-col>
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
                    <el-select v-model="detailsForm.workTypeId" filterable placeholder="请选择" style="width: 100%" :disabled="true">
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

        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
        name: "grabOrder",
        data(){
            return{
                userid:'1',//假设useid为123 之后会从localstronger 或 store 中获取
                path:'\/index',
                loading: true,
                tableData:[],//待处理表格
                workerTableData:[],//维修员表格
                repairType:[],//维修类型
                rowDate:{},
                currentPage: 1,
                pageSize:1,
                total: 100,
                currentPage2: 1,
                pageSize2:10,
                total2: 100,
                detailsPage:false, //详情
                choiceRepairWorkerPage:false, //选择维修员
                refusePage:false, //拒绝页面
                searchForm:{
                    trems:'',
                },
                refuseForm:{
                    cause:'',
                    causeContent:'',
                    worker:'',
                    workOrderId:'',
                },
                detailsForm:{
                    workOrderId:'',
                    workTypeId:'',
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
                form:{
                    workOrderId:'',
                    workTypeId:'',
                    shopId:'',
                    shopName:'',
                    applyName:'',
                    tel:'',
                    reserveTime:'',
                    address:"",
                    remark:"",
                    faultDescriptionContent:'',
                    faultDescription:'',
                },//申请表单
                rule:{
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

                },//校验
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
            getData(){
                this.$axios.get('/api/sp/repair/grabOrder/hanlding/'+this.$data.currentPage+'/'+this.$data.pageSize+'/'+this.$data.userid)
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
                this.$axios.get('/api/sp/shop/reward/order/'+id)
                    .then(function (response) {
                        this.$data.detailsForm = response.data;
                        this.$data.detailsPage = true;
                    }.bind(this))
                    .catch(function (error) {
                    });
            },
            //接单 开始维修
            beginRepair(row){
                this.$modal.confirm('详细查看详情之后，确认操作').then(type => {
                    if(type == 'confirm'){
                        this.$axios.post('/api/sp/repair/reward/order/beginRepair/'+this.$data.userid,row)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'开始维修',
                                        });
                                        this.reload();
                                    }, 1000);
                                }
                            }.bind(this))
                            .catch(function (error) {});
                    }
                    return false;
                })
            },
            //没维修之前退单
            chargeBack(id){
                this.$modal.confirm('请与商户协商后，确认操作').then(type => {
                    if(type == 'confirm'){
                        this.$axios.get('/api/sp/repair/reward/order/chargeBack/'+id+'/'+this.$data.userid)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'等待商户审核',
                                        });
                                        this.reload();
                                    }, 1000);
                                }
                            }.bind(this))
                            .catch(function (error) {});
                    }
                    return false;
                })
            },
            //维修中 突发情况等情况退单
            chargeBack2(id){
                let item = localStorage.getItem("repairinfo");
                this.$modal.confirm('请与商户协商后，确认操作').then(type => {
                    if(type == 'confirm'){
                        this.$axios.get('/api/sp/repair/reward/order/chargeBackAfter/'+id+'/'+JSON.parse(item).repairWorkerId)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'等待商户审核',
                                        });
                                        this.reload();
                                    }, 1000);
                                }
                            }.bind(this))
                            .catch(function (error) {});
                    }
                    return false;
                })
            },
            //完成订单
            finishOrder(row){
                //将订单和派单的状态改成remark
                //维修员的状态改为1
                this.$modal.confirm('确认操作').then(type => {
                    if(type == 'confirm'){
                        this.$axios.post('/api/sp/repair/reward/order/finish/'+this.$data.userid,row)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'已完成订单,等待商户评价',
                                        });
                                        this.reload();
                                    }, 1000);
                                }
                            }.bind(this))
                            .catch(function (error) {});
                    }
                    return false;
                })
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
            $imgAdd2(pos, $file){
                var formdata = new FormData();
                formdata.append('file', $file);
                // 这里没有服务器供大家尝试，可将下面上传接口替换为你自己的服务器接口
                this.$axios({
                    url: '/api/upload',
                    method: 'post',
                    data: formdata,
                    headers: { 'Content-Type': 'multipart/form-data' },
                }).then((url) => {
                    this.$refs.rmd.$img2Url(pos, url.data);
                })
            },
            change(value, render){
                // render 为 markdown 解析后的结果
                this.$data.html = render;
            },
            save(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$data.form.faultDescription = this.$data.html;
                        this.$axios.post('/api/sp/shop/order/save',
                            this.$data.form)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type: "success",
                                            message: '保存订单成功',
                                        });
                                        this.$data.editPage = false;
                                        this.reload();
                                    }, 1000);
                                }
                            }.bind(this))
                            .catch(function (error) {
                            });
                    } else {
                        return false;
                    }
                });
            },
            del(id){
                this.$modal.confirm('确认删除吗？').then(type => {
                    if( type == 'confirm'){
                        this.$axios.get('/api/sp/shop/order/delete/'+id)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'操作成功',
                                        });
                                        this.reload();
                                    }, 1000);
                                }
                            }.bind(this))
                            .catch(function (error) {});
                    }
                    return false;
                })
            },
            reload() {
                // 清除所有状态
                this.$refs.xTable.clearAll();
                return this.getData();
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
