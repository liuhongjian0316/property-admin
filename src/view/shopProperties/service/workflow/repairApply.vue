<template>
  <div>
    <div style="width: 98%;margin: 0 auto;">
      <img src="../../../../assets/images/repair.gif" alt="logo" width="100%" height="200">
    </div>
    <el-row>
      <el-col :span="24" style="margin-top: 20px">
        <el-card style="width: 98%;margin: 0 auto;">
          <el-steps :active=active align-center>
            <el-step @click="this.active = 1" title="选择维修类型"></el-step>
            <el-step title="新建维修申请单"></el-step>
          </el-steps>
        </el-card>
      </el-col>
    </el-row>
    <!--step 1-->
    <el-row>
      <div v-if="this.active == 1">
        <el-col :span="24" style="margin-top: 20px">
          <el-card style="width: 98%;margin: 0 auto;">
            <div slot="header" class="clearfix">
              <span>故障类型</span>
            </div>
            <div>
              <el-row>
                <div v-for="(item,index) in repairType" :key="index">
                  <el-col :span="6" style="margin-top: 20px" v-if="index>3">
                    <el-tag @click="choiceType(item.workTypeId)">{{item.workTypeName}}</el-tag>
                  </el-col>
                  <el-col :span="6" v-else>
                    <el-tag @click="choiceType(item.workTypeId)">{{item.workTypeName}}</el-tag>
                  </el-col>
                </div>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </div>
    </el-row>
    <!--step 2-->
    <el-row>
      <div v-if="this.active == 2">
        <el-col :span="24" style="margin-top: 20px">
          <el-card style="width: 98%;margin: 0 auto;">
            <div slot="header" class="clearfix">
              <span>填写报修单</span>
            </div>
            <div>
              <!--form-->
              <el-form  ref="form" :model="form"  :rules="rule"  label-width="80px" size="small">
                <el-form-item label="商铺名称" prop="shopName">
                  <el-input v-model="form.shopName" placeholder="请填写商铺名称" @click.native="chocieShopPage = true"> </el-input>
                  <vxe-modal v-model="chocieShopPage"
                             style="z-index: 99999999999999"
                             id="13205513412312312328230662"
                             title="派单详情" width="800" height="500"
                             resize remember
                             :fullscreen=true
                             :esc-closable=true>
                    <template v-slot>
                      <!--load menu-->
                      <!--filter menu to search menu-->
                      <div style="width: 98%;margin: 0 auto;">
                        <el-row>
                          <el-col :span="24" style="margin-top: 20px">
                            <el-card style="width: 98%;margin: 0 auto;">
                              <div slot="header" class="clearfix">
                                <span>查询条件</span>
                              </div>
                              <div>
                                <el-row :gutter="70">
                                  <el-form  ref="roleForm" :model="searchForm"  label-width="80px" size="small">
                                    <el-col :span="5">
                                      <el-input placeholder="请输入商户ID" v-model="searchForm.shopId"></el-input>
                                    </el-col>
                                    <el-col :span="5">
                                      <el-input placeholder="请输入商户名称" v-model="searchForm.name"></el-input>
                                    </el-col>
                                    <el-col :span="5">
                                      <el-input placeholder="请输入联系电话" v-model="searchForm.tel"></el-input>
                                    </el-col>
                                    <el-col :span="5">
                                      <el-input placeholder="请输入商户地址" v-model="searchForm.address"></el-input>
                                    </el-col>
                                    <el-col :span="4">
                                      <el-button class="el-icon-search" type="success"  size="small" @click="search('searchForm')">搜索</el-button>
                                    </el-col>
                                  </el-form>
                                </el-row>
                              </div>
                            </el-card>
                          </el-col>
                        </el-row>
                        <!--table-->
                        <vxe-table
                          border
                          ref="xTable"
                          :data="tableData"
                          export-config
                          import-config>
                          <vxe-table-column field="name" title="商户名称"></vxe-table-column>
                          <vxe-table-column field="username" title="账号"></vxe-table-column>
                          <vxe-table-column field="tel" title="手机号"></vxe-table-column>
                          <vxe-table-column field="realname" title="真实姓名"></vxe-table-column>
                          <vxe-table-column field="address" title="地址"></vxe-table-column>
                          <vxe-table-column field="landmarks" title="地标"></vxe-table-column>
                          <vxe-table-column field="createTime" title="创建时间" formatter="formatDate"></vxe-table-column>
                          <vxe-table-column title="操作">
                            <template v-slot="{ row }">
                              <vxe-button size="mini" content="选择" @click="choice(row)"></vxe-button>
                            </template>
                          </vxe-table-column>
                        </vxe-table>
                        <!--分页-->
                        <el-pagination
                          @current-change="handleCurrentChange"
                          :current-page=currentPage
                          :page-size=pageSize
                          layout="total, prev, pager, next, jumper"
                          :total=total>
                        </el-pagination>
                      </div>
                    </template>
                  </vxe-modal>

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
                    <el-col :span="12">
                      <el-cascader
                        placeholder="请选择"
                        style="width: 100%"
                        size="mini"
                        :options="options"
                        v-model="cityCode"
                        @change="addressChange">
                      </el-cascader>
                    </el-col>
                    <el-col :span="12"><el-input v-model="form.address" placeholder="请填写详细位置"> </el-input></el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="故障描述" prop="faultDescriptionContent">
                  <mavon-editor v-model="form.faultDescriptionContent" ref="md" @imgAdd="$imgAdd" @change="change" style="min-height: 400px"/>
                </el-form-item>
                <el-form-item label="备注信息">
                  <el-input v-model="form.remark" placeholder="请填写备注信息,可不填"> </el-input>
                </el-form-item>
              </el-form>
              <div style="float: right;margin-top: -20px">
                <el-button class="editor-btn" size="mini" type="primary" @click="submit('form')">提交</el-button>
                <el-button class="editor-btn" size="mini" @click="previous">上一步</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </div>

    </el-row>
  </div>
</template>

<script>
    import { regionData,CodeToText } from 'element-china-area-data'
    export default {
        name: "repairApply",
        data(){
            return{
                tableData: [],
                currentPage: 1,
                pageSize:10,
                total: 100,
                chocieShopPage: false,
                customerServiceId:'1',
                customerServiceName:'小爱',
                //城市三级
                options: regionData,
                cityCode:[],
                active: 1,//步骤条
                pickerOptions:{
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }

                },
                repairType:[],
                searchForm:{
                    shopId:'',
                    name:'',
                    address:'',
                    tel:'',
                },
                form:{
                    customerServiceId:'',
                    customerServiceName:'',
                    workType:'',//工单类型
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
                //富文本
                content:'',
                html:'',
                configs: {
                }
            }
        },
        methods: {
            //获取商户表格数据
            getData(){
                this.$axios.get('/api/sp/admin/shop/page/'+this.$data.currentPage+'/'+this.$data.pageSize)
                    .then(function (response) {
                        this.$data.tableData = response.data.rows;
                        this.$data.total = response.data.records;
                    }.bind(this))
                    .catch(function (error) {
                    }.bind(this));
            },
            handleCurrentChange(val) {
                let pageSize = this.$data.pageSize
                //currentPage 变化监听
                this.$axios.get('/api/community/page/'+val+'/'+pageSize)
                    .then(function (response) {
                        this.$data.total = response.data.records;
                        this.$data.tableData = response.data.rows;
                    }.bind(this))
                    .catch(function (error) {

                    });
            },
            search(formName){
                this.$axios.post('/api/sp/admin/shop/search/'+this.$data.currentPage+'/'+this.$data.pageSize,
                    this.$data.searchForm)
                    .then(function (response) {
                        this.$data.tableData = response.data.rows;
                        this.$data.total = response.data.records;
                    }.bind(this))
                    .catch(function (error) {
                    }.bind(this));
            },
            choice(row){
                this.$data.form.address = row.address
                this.$data.form.tel = row.tel
                this.$data.form.applyName = row.realname
                this.$data.form.shopId = row.shopId
                this.$data.form.shopName = row.name
                this.$data.chocieShopPage = false;
            },
            //选择维修类型
            choiceType(id){
                this.$data.form.workType = id;
                this.$data.active = 2;
                this.$message.success('请询问商户信息，认真填写');
            },
            //获取报修类型列表
            getWorkType(){
                this.$axios.get('/api/sp/admin/worktype/list')
                    .then(function (response) {
                        this.$data.repairType = response.data;
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
            previous(){
                this.$data.active = 1;
            },
            submit(formName){
                this.$data.form.customerServiceName = this.$data.customerServiceName;
                this.$data.form.customerServiceId = this.$data.customerServiceId;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$data.form.faultDescription = this.$data.html;
                        this.$axios.post('/api/sp/service/applayOrder',
                            this.$data.form)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$alert('代填成功，请提醒商户查看自己的订单', '提示', {
                                            confirmButtonText: '确定',
                                            callback: action => {
                                                location.reload();
                                            }
                                        });
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
            addressChange(arr) {
                this.$data.form.address = CodeToText[arr[0]]+CodeToText[arr[1]]+CodeToText[arr[2]];
            },
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
            this.getWorkType();
            this.getData();
        }
    }
</script>

<style scoped>
  .editor-btn{
    margin-top: 20px;
  }
</style>
