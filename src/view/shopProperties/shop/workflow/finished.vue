<template>
  <div>
    <el-row>
      <el-col :span="24" style="margin-top: 20px">
        <el-card style="width: 98%;margin: 0 auto;">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: path }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>工作流程</el-breadcrumb-item>
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
            <vxe-table-column field="workOrderId" title="编号"></vxe-table-column>
            <vxe-table-column field="applyName" title="申请人"></vxe-table-column>
            <vxe-table-column field="tel" title="联系电话"></vxe-table-column>
            <vxe-table-column field="shopName" title="商铺名称"></vxe-table-column>
            <vxe-table-column field="address" title="地址"></vxe-table-column>
            <vxe-table-column field="reserveTime" title="预约时间" formatter="formatDate"></vxe-table-column>
            <vxe-table-column field="state" title="状态">
              <template v-slot="{ row }">
                <div class="offlinestate"></div><el-tag type="info">已完成</el-tag>
              </template>
            </vxe-table-column>
            <vxe-table-column title="操作">
              <template v-slot="{ row }">
                <el-row>
                  <el-col :span="12" v-if="row.state == 'unmark'">
                    <span></span><vxe-button size="mini" content="待评价" @click="openEPage(row.workOrderId)"></vxe-button>
                  </el-col>
                  <el-col :span="12"><vxe-button size="mini" content="详情" @click="details(row.workOrderId)"></vxe-button></el-col>
                </el-row>
              </template>
            </vxe-table-column>
          </vxe-table>
          <p style="text-align:center; line-height:50px;" v-loading="loading"><a style="text-decoration: none;" href="javascript:;"  @click="getMData()">点击加载更多</a></p>


          <!--evaluate page-->
          <vxe-modal v-model="evaluatePage"
                     id="13205513412328230662"
                     title="评价" width="800" height="600"
                     resize remember
                     :fullscreen=false
                     :esc-closable=true>
            <template v-slot>
              <div style="width: 80%;margin: 0 auto;">
                <el-form  ref="form" :model="evaluateForm"  :rules="evaluateRule"  label-width="80px" size="small">
                  <div>
                    <el-form-item label="反应速度">
                      <el-rate
                        v-model="evaluateForm.reactSpeed"
                        show-text
                        :colors="colors"
                        :texts= texts
                        :text-color="textcolor"
                        @change="changeColor"
                      >
                      </el-rate>
                    </el-form-item>
                    <el-form-item label="专业水平">
                      <el-rate
                        v-model="evaluateForm.professionLevel"
                        show-text
                        :colors="colors"
                        :texts= texts2
                        :text-color="textcolor2"
                        @change="changeColor2"
                      >
                      </el-rate>
                    </el-form-item>
                    <el-form-item label="服务态度">
                      <el-rate
                        v-model="evaluateForm.serviceAttitude"
                        show-text
                        :colors="colors"
                        :texts= texts3
                        :text-color="textcolor3"
                        @change="changeColor3"
                      >
                      </el-rate>
                    </el-form-item>
                  </div>
                  <mavon-editor v-model="evaluateForm.contentEvaluationContent" ref="md" @imgAdd="$imgAdd" @change="change"
                                style="max-height: 300px;max-width: 600px" placeholder="请对该单服务进行评价"/>
                </el-form>
                <div style="float: right;margin-top: 20px">
                  <span v-if="evaluateForm.contentEvaluationContent == ''">
                    <el-button class="editor-btn" size="mini" type="primary" disabled>请填写服务评价</el-button>
                  </span>
                  <span v-else>
                    <el-button class="editor-btn" size="mini" type="primary" @click="submitEva('evaluateForm')">提交评价</el-button>
                  </span>
                  <el-button class="editor-btn" size="mini" type="primary" @click="evaluatePage=false">关闭</el-button>
                </div>
              </div>
            </template>
          </vxe-modal>


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

        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
        name: "finished",
        data(){
            return{
                userid:'123',//假设useid为123 之后会从localstronger 或 store 中获取
                path:'\/index',
                loading: true,
                tableData:[],//待处理表格
                workerTableData:[],//维修员表格
                repairType:[],//维修类型
                rowDate:{},
                currentPage: 1,
                pageSize:1,
                total: 100,
                detailsPage:false,
                evaluatePage:false,
                //评价
                value: null,
                colors: ['#99A9BF', '#F7BA2A', '#FF9900'],  // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
                texts:["极慢","较慢","一般","较快","极快"],
                texts2:["不专业","较不专业","一般","专业","极专业"],
                texts3:["非常差","差","一般","赞","超赞"],
                textcolor:'#99A9BF',
                textcolor2:'#99A9BF',
                textcolor3:'#99A9BF',
                //评价表单
                evaluateForm:{
                    workOrderId:'',
                    reactSpeed:'5',
                    professionLevel:'5',
                    serviceAttitude:'5',
                    contentEvaluation:'',
                    contentEvaluationContent:'',
                },
                searchForm:{
                    trems:'',
                },
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
                this.$axios.get('/api/sp/shop/order/finish/'+this.$data.currentPage+'/'+this.$data.pageSize+"/"+1)
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
            openEPage(id){
                this.$data.evaluatePage = true;
                this.$data.evaluateForm.workOrderId = id;
            },
            //评分改变事件
            changeColor(value){
                if(value == 1 || value == 2) this.$data.textcolor = this.$data.colors[0]
                if(value == 3 || value == 4) this.$data.textcolor = this.$data.colors[1]
                if(value == 5) this.$data.textcolor = this.$data.colors[2]
            },
            changeColor2(value){
                if(value == 1 || value == 2) this.$data.textcolor2 = this.$data.colors[0]
                if(value == 3 || value == 4) this.$data.textcolor2 = this.$data.colors[1]
                if(value == 5) this.$data.textcolor2 = this.$data.colors[2]
            },
            changeColor3(value){
                if(value == 1 || value == 2) this.$data.textcolor3 = this.$data.colors[0]
                if(value == 3 || value == 4) this.$data.textcolor3 = this.$data.colors[1]
                if(value == 5) this.$data.textcolor3 = this.$data.colors[2]
            },
            //提交评价
            submitEva(formName){
                this.$data.evaluateForm.contentEvaluation = this.$data.html;
                this.$axios.post('/api/sp/shop/order/evaluate/',this.$data.evaluateForm)
                    .then(function (response) {
                        if(response.data.status == '200'){
                            let loding = this.createLoding();
                            setTimeout(() => {
                                loding.close();
                                this.$message({
                                    type:"success",
                                    message:'已提交评价，我们会采取意见，对服务进一步提高',
                                });
                                this.$data.evaluatePage = false;
                                this.reload();
                            }, 1000);
                        }
                    }.bind(this))
                    .catch(function (error) {});
            },
            finishOrder(row){
                this.$modal.confirm('确认操作').then(type => {
                    if( type == 'confirm'){
                        this.$axios.post('/api/sp/repair/order/finish/',row)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'订单完成',
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

