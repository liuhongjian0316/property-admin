<template>
  <div>
    <el-row>
      <el-col :span="24" style="margin-top: 20px">
        <el-card style="width: 98%;margin: 0 auto;">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: path }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>正在进行</el-breadcrumb-item>
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
            <vxe-table-column field="work_order_id" title="报修单编号"></vxe-table-column>
            <vxe-table-column field="apply_name" title="申请人"></vxe-table-column>
            <vxe-table-column field="tel" title="联系电话"></vxe-table-column>
            <vxe-table-column field="shop_name" title="商铺名称"></vxe-table-column>
            <vxe-table-column field="work_type_name" title="保修类型"></vxe-table-column>
            <vxe-table-column field="address" title="地址"></vxe-table-column>
            <vxe-table-column field="reserve_time" title="预约时间" formatter="formatDate"></vxe-table-column>
            <vxe-table-column field="state" title="状态" formatter="formatDate">
              <template v-slot="{ row }">
                <span v-if="row.state == 0"><div class="offlinestate"></div><el-tag type="info">未受理</el-tag></span>
                <span v-if="row.state == 1"><div class="onlinestate"></div><el-tag type="success">已派单</el-tag></span>
                <span v-if="row.state == 3"><div class="onlinestate"></div><el-tag type="success">维修中</el-tag></span>
              </template>
            </vxe-table-column>
            <vxe-table-column title="操作">
              <template v-slot="{ row }">
                <vxe-button v-if="row.state != 3 && row.state != 1" size="mini" content="修改" @click="edit(row.work_order_id)"></vxe-button>
                <vxe-button v-if="row.state != 3 && row.state != 1" size="mini" content="删除" @click="del(row.work_order_id)"></vxe-button>
                <vxe-button v-if="row.state == 3" size="mini" content="撤回" @click="recall(row.work_order_id)"></vxe-button>
              </template>
            </vxe-table-column>
          </vxe-table>
          <p style="text-align:center; line-height:50px;" v-loading="loading"><a style="text-decoration: none;" href="javascript:;"  @click="getMData()">点击加载更多</a></p>

          <!--edit page-->
          <vxe-modal v-model="editPage"
                     id="1320551342028230662"
                     title="修改报单" width="800" height="500"
                     resize remember
                     :fullscreen=true
                     :esc-closable=true>
            <template v-slot>
              <!--edit form-->
              <div style="width: 100%;margin: 0 auto;">
                <el-form  ref="form" :model="form"  :rules="rule"  label-width="80px" size="small">
                  <el-form-item label="报单类型" prop="workTypeId">
                    <el-select v-model="form.workTypeId" filterable placeholder="请选择" style="width: 100%">
                      <el-option
                        v-for="item in repairType"
                        :key="item.workTypeId"
                        :label="item.workTypeName"
                        :value="item.workTypeId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="商铺名称" prop="shopName">
                    <el-input v-model="form.shopName" placeholder="请填写商铺名称"> </el-input>
                  </el-form-item>
                  <el-form-item label="申请人" prop="applyName">
                    <el-input v-model="form.applyName" placeholder="请填写申请人"> </el-input>
                  </el-form-item>
                  <el-form-item label="联系电话" prop="tel">
                    <el-input v-model="form.tel" placeholder="请填写联系电话"> </el-input>
                  </el-form-item>
                  <el-form-item label="预约时间" prop="reserveTime">
                    <el-date-picker
                      style="width: 100%;"
                      v-model="form.reserveTime"
                      :picker-options="pickerOptions"
                      type="datetime"
                      placeholder="选择日期时间"
                      default-time="09:00:00">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="详细位置" prop="address">
                    <el-row>
                      <el-col :span="24"><el-input v-model="form.address" placeholder="请填写详细位置"> </el-input></el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="故障描述" prop="faultDescriptionContent">
                    <mavon-editor v-model="form.faultDescriptionContent" ref="md" @imgAdd="$imgAdd" @change="change" style="min-height: 400px"/>
                  </el-form-item>
                  <el-form-item label="备注信息">
                    <el-input v-model="form.remark" placeholder="请填写备注信息,可不填"> </el-input>
                  </el-form-item>
                </el-form>
                <div style="float: right;margin-top: 10px">
                  <el-button class="editor-btn" size="mini" type="primary" @click="save('form')">提交</el-button>
                  <el-button class="editor-btn" size="mini" @click="editPage = false">返回</el-button>
                </div>
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
        name: "handling",
        data(){
            return{
                path:'\/index',
                loading: true,
                tableData:[],
                currentPage: 1,
                pageSize:1,
                total: 100,
                editPage: false,
                repairType:[],//维修类型
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
                this.$axios.get('/api/sp/shop/handing/'+this.$data.currentPage+'/'+this.$data.pageSize)
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
            edit(id){
                this.getWorkType();
                this.$axios.get('/api/sp/shop/order/'+id)
                    .then(function (response) {
                        this.$data.form = response.data;
                        this.$data.editPage = true;
                    }.bind(this))
                    .catch(function (error) {
                    });
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
            //撤回
            recall(id){
                this.$modal.confirm('请与维修员协商后，确认操作').then(type => {
                    if( type == 'confirm'){
                        this.$axios.get('/api/sp/shop/order/recall/'+id)
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
  .dangerlinestate{
    background-color: #ff0000;
    margin-right: 8px;
    width: 10px;
    height: 10px;
    display: inline-block;
    border-radius: 50%;
  }
</style>
