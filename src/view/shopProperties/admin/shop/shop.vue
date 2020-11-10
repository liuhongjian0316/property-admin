<template>
  <div>
    <el-row>
      <el-col :span="24" style="margin-top: 20px">
        <el-card style="width: 98%;margin: 0 auto;">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: path }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商户管理</el-breadcrumb-item>
            <el-breadcrumb-item>商户信息</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
      </el-col>
    </el-row>
    <!--query postion-->
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

    <!--table postion-->
    <el-row>
      <el-col :span="24">
        <el-col :span="24"style="margin-top: 20px">
          <el-card style="width: 98%;margin: 0 auto;">
            <vxe-toolbar :refresh="{query: reload}" import export print custom>
              <template v-slot:buttons>
                <el-button type="primary" class="el-icon-plus" size="mini" @click="addPage=true">添加商户</el-button>
                <!--add shop-->
                <vxe-modal v-model="addPage"
                           id="198215524654456"
                           title="增加商户" width="800" height="500"
                           resize remember
                           :esc-closable=true>
                  <template v-slot>
                    <!--add form-->
                    <div style="width: 80%;margin: 0 auto;">
                      <el-form  ref="roleForm" :model="roleForm"  :rules="rules"  label-width="80px" size="small">
                        <el-form-item label="商户名称" prop="name">
                          <el-input v-model="roleForm.name" placeholder="请输入商户名称"> </el-input>
                        </el-form-item>
                        <el-form-item label="联系人" prop="realname">
                          <el-input v-model="roleForm.realname" placeholder="请输入联系人姓名"> </el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="tel">
                          <el-input v-model="roleForm.tel" placeholder="请输入商户联系电话"> </el-input>
                        </el-form-item>
                        <el-form-item label="选择地址" prop="cityCode">
                          <el-cascader
                            placeholder="请选择"
                            style="width: 100%"
                            size="mini"
                            :options="options"
                            v-model="cityCode"
                            @change="addressChange">
                          </el-cascader>
                        </el-form-item>
                        <el-form-item label="详细地址" prop="address">
                          <el-input v-model="roleForm.address" placeholder="请输入详细地址"> </el-input>
                        </el-form-item>
                        <el-form-item label="附近地标" prop="landmarks">
                          <el-input v-model="roleForm.landmarks" placeholder="请输入附近地标"></el-input>
                        </el-form-item>
                        <el-form-item label="备注信息" prop="remark">
                          <el-input v-model="roleForm.remark" placeholder="请输入备注信息，可不填"></el-input>
                        </el-form-item>
                        <el-divider></el-divider>
                        <el-form-item style="float: right;position: absolute; bottom: 20px; right: 100px;">
                          <el-button type="primary" @click="add('roleForm')">确定</el-button>
                          <el-button @click="addPage=false">关闭</el-button>
                        </el-form-item>
                      </el-form>
                    </div>
                  </template>
                </vxe-modal>
                <vxe-modal v-model="editPage"
                           id="170789444444"
                           title="编辑商铺" width="800" height="450"
                           resize remember
                           :esc-closable=true>
                  <template v-slot>
                    <!--edit form-->
                    <div style="width: 80%;margin: 0 auto;">
                      <el-form  ref="roleForm" :model="editRoleForm"  :rules="editRules"  label-width="80px" size="small">
                        <el-form-item label="商户名称" prop="name">
                          <el-input v-model="editRoleForm.name" placeholder="请输入商户名称"> </el-input>
                        </el-form-item>
                        <el-form-item label="联系人" prop="realname">
                          <el-input v-model="editRoleForm.realname" placeholder="请输入联系人"> </el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="tel">
                          <el-input v-model="editRoleForm.tel" placeholder="请输入联系电话"> </el-input>
                        </el-form-item>
                        <el-form-item label="详细地址" prop="address">
                          <el-input v-model="editRoleForm.address" placeholder="请输入详细地址"> </el-input>
                        </el-form-item>
                        <el-form-item label="附近地标" prop="landmarks">
                          <el-input v-model="editRoleForm.landmarks"placeholder="请输入附近地标"></el-input>
                        </el-form-item>
                        <el-form-item label="备注信息" prop="remark">
                          <el-input v-model="editRoleForm.remark" placeholder="请输入备注信息，可不填"></el-input>
                        </el-form-item>
                        <el-divider></el-divider>
                        <el-form-item style="float: right;position: absolute; bottom: 20px; right: 100px;">
                          <el-button type="primary" @click="save('roleForm')">确定</el-button>
                          <el-button @click="editPage=false">关闭</el-button>
                        </el-form-item>
                      </el-form>
                    </div>
                  </template>
                </vxe-modal>
              </template>
            </vxe-toolbar>

            <vxe-table
              border
              ref="xTable"
              :data="tableData"
              export-config
              import-config>
              <vxe-table-column field="shopId" title="商户id"></vxe-table-column>
              <vxe-table-column field="name" title="商户名称"></vxe-table-column>
              <vxe-table-column field="username" title="账号"></vxe-table-column>
              <vxe-table-column field="tel" title="手机号"></vxe-table-column>
              <vxe-table-column field="realname" title="真实姓名"></vxe-table-column>
              <vxe-table-column field="address" title="地址"></vxe-table-column>
              <vxe-table-column field="landmarks" title="地标"></vxe-table-column>
              <vxe-table-column field="createTime" title="创建时间" formatter="formatDate"></vxe-table-column>
              <vxe-table-column title="操作">
                <template v-slot="{ row }">
                  <vxe-button size="mini" content="修改" @click="edit(row.shopId)"></vxe-button>
                  <vxe-button size="mini" content="删除" @click="del(row.shopId)"></vxe-button>
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
          </el-card>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    import { regionData,CodeToText } from 'element-china-area-data'
    export default {
        name: "shop",
        data(){
            //添加手机号查重
            var checkAddTel = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机号不能为空'));
                } else {
                    //axios 请求后端查重接口
                    this.$axios.get('/api/sp/admin/shop/checkTel/'+value) //接口
                        .then(function (response) {
                            //根据返回判断
                            return response.data.data ?  callback() : callback(new Error('该手机号已被注册'));
                        }.bind(this))
                        .catch(function (error) {

                        });
                }
            };
            //修改手机号查重
            var checkEditTel = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机号不能为空'));
                } else {
                    //axios 请求后端查重接口
                    this.$axios.get('/api/sp/admin/shop/checkTel/'+value+'/'+this.$data.roleForm.shopId) //接口
                        .then(function (response) {
                            //根据返回判断
                            return response.data.data ?  callback() : callback(new Error('该手机号已被注册'));
                        }.bind(this))
                        .catch(function (error) {

                        });
                }
            };
            return{
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                path:'\/index',
                cityCode:[],//城市编码
                address:'',//临时地址
                options: regionData,
                name:"",
                currentPage: 1,
                pageSize:10,
                total: 100,
                tableData: [],
                editData:{},
                addPage: false,
                editPage: false,
                searchForm:{
                    shopId:'',
                    name:'',
                    address:'',
                    tel:'',
                },
                roleForm: {
                    shopId:'',
                    name:'',
                    username:'',
                    pwd:'',
                    tel:'',
                    realname:'',
                    address:'',
                    landmarks:'',
                    cityCode:'',
                    mapX:'',
                    mapY:'',
                    remark:'',
                },
                editRoleForm: {
                    shopId:'',
                    name:'',
                    username:'',
                    pwd:'',
                    tel:'',
                    realname:'',
                    address:'',
                    landmarks:'',
                    cityCode:'',
                    mapX:'',
                    mapY:'',
                    remark:'',
                },
                editRules: {
                    name: [
                        { required: true, message: '请填写小区名称', trigger: 'blur' },
                        { pattern: /^[\u4e00-\u9fa5]{3,}?$/ , message: '请填写合法名称' }
                    ],
                    realname: [
                        { required: true, message: '请填写联系人', trigger: 'blur' },
                    ],
                    tel: [
                        { required: true, message: '请填写手机号', trigger: 'blur' },
                        { pattern: /^1[3|4|5|7|8][0-9]{9}$/ , message: '请填写合法手机号' },
                        { validator: checkEditTel, trigger: "blur" } // 自定义校验(添加手机号)
                    ],
                    cityCode: [
                        { required: true, message: '请选择', trigger: 'blur' },
                    ],
                    address: [
                        { required: true, message: '请填写商铺详细地址', trigger: 'blur' },
                    ],
                    landmarks: [
                        { required: true, message: '请填写附近地标', trigger: 'blur' },
                    ],
                },
                rules: {
                    name: [
                        { required: true, message: '请填写小区名称', trigger: 'blur' },
                        { pattern: /^[\u4e00-\u9fa5]{3,}?$/ , message: '请填写合法名称' }
                    ],
                    realname: [
                        { required: true, message: '请填写联系人', trigger: 'blur' },
                    ],
                    tel: [
                        { required: true, message: '请填写手机号', trigger: 'blur' },
                        { pattern: /^1[3|4|5|7|8][0-9]{9}$/ , message: '请填写合法手机号' },
                        { validator: checkEditTel, trigger: "blur" } // 自定义校验(修改手机号)
                    ],
                    cityCode: [
                        { required: true, message: '请选择', trigger: 'blur' },
                    ],
                    address: [
                        { required: true, message: '请填写商铺详细地址', trigger: 'blur' },
                    ],
                    landmarks: [
                        { required: true, message: '请填写附近地标', trigger: 'blur' },
                    ],
                },
            }
        },
        methods: {
            //get shop data
            getData(){
                this.$axios.get('/api/sp/admin/shop/page/'+this.$data.currentPage+'/'+this.$data.pageSize)
                    .then(function (response) {
                        this.$data.tableData = response.data.rows;
                        this.$data.total = response.data.records;
                    }.bind(this))
                    .catch(function (error) {
                    }.bind(this));
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
            //reset form
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            //table reload
            reload() {
                // 清除所有状态
                this.$refs.xTable.clearAll();
                return this.getData();
            },
            //page listen
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
            //add shop
            add(formName) {
                this.$data.roleForm.address = this.$data.address+this.$data.roleForm.address;
                this.$data.roleForm.username = this.$data.roleForm.tel;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/api/sp/admin/shop/insert',
                            this.$data.roleForm)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'添加商户成功',
                                        });
                                        this.$data.addPage = false;
                                        this.reload();
                                        this.resetForm(formName);
                                    }, 1000);

                                }
                            }.bind(this))
                            .catch(function (error) {

                            });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //get shop
            edit(id){
                //根据id赋值
                this.$axios.get('/api/sp/admin/shop/id/'+id).then(function (response) {
                    this.$data.editRoleForm = response.data;
                    this.$data.editPage = true;
                }.bind(this)).catch(function (error) {
                    alert(error)
                });
            },
            //save shop
            save(formName){
                //修改信息
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/api/sp/admin/shop/save',
                            this.$data.editRoleForm)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'编辑商户成功',
                                        });
                                        this.$data.editPage = false;
                                        this.reload();
                                        this.resetForm(formName);
                                    }, 1000);

                                }
                            }.bind(this))
                            .catch(function (error) {

                            });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            del(id){
                this.$modal.confirm('确认删除吗？').then(type => {
                    if( type == 'confirm'){
                        this.$axios.get('/api/sp/admin/shop/delete/'+id)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'操作成功',
                                        });
                                        this.$data.editPage = false;
                                        this.reload();
                                    }, 1000);

                                }
                            }.bind(this))
                            .catch(function (error) {

                            });
                    }
                    return false;
                })
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
            auditreturn(id){
                this.$modal.confirm('确认撤回审核？').then(type => {
                    if( type == 'confirm'){
                        this.$axios.get('/api/community/auditreturn/'+id)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'撤回审核成功',
                                        });
                                        this.$data.editPage = false;
                                        this.reload();
                                    }, 1000);

                                }
                            }.bind(this))
                            .catch(function (error) {

                            });
                    }
                    return false;
                })
            },
            addressChange(arr) {
                console.log(arr);
                console.log(CodeToText[arr[0]]+CodeToText[arr[1]]+CodeToText[arr[2]]);
                this.$data.roleForm.cityCode = arr[2];
                this.$data.address = CodeToText[arr[0]]+CodeToText[arr[1]]+CodeToText[arr[2]];

            },
        },
        created() {
            this.getData();
        }
    }
</script>

<style scoped>

</style>
