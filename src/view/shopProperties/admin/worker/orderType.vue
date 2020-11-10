<template>
  <div>
    <el-row>
      <el-col :span="24" style="margin-top: 20px">
        <el-card style="width: 98%;margin: 0 auto;">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: path }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>员工管理</el-breadcrumb-item>
            <el-breadcrumb-item>工单类型</el-breadcrumb-item>
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
                <el-col :span="12">
                  <el-input placeholder="请输入工单类型" v-model="searchForm.type"></el-input>
                </el-col>
                <el-col :span="12">
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
                <el-button type="primary" class="el-icon-plus" size="mini" @click="addPage=true">添加工单类型</el-button>
                <!--add shop-->
                <vxe-modal v-model="addPage"
                           id="198215524654456"
                           title="增加类型" width="800" height="250"
                           resize remember
                           :esc-closable=true>
                  <template v-slot>
                    <!--add form-->
                    <div style="width: 80%;margin: 0 auto;">
                      <el-form  ref="roleForm" :model="roleForm"  :rules="rules"  label-width="80px" size="small">
                        <el-form-item label="类型名称" prop="workTypeName">
                          <el-input v-model="roleForm.workTypeName" placeholder="请输入类型名称"> </el-input>
                        </el-form-item>
                        <el-form-item label="备注信息">
                          <el-input v-model="roleForm.remark" placeholder="请填写备注信息"> </el-input>
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
                           id="17078944545454774544544444"
                           title="编辑工单类型" width="800" height="250"
                           resize remember
                           :esc-closable=true>
                  <template v-slot>
                    <!--edit form-->
                    <div style="width: 80%;margin: 0 auto;">
                      <el-form  ref="roleForm" :model="editRoleForm"  :rules="editRules"  label-width="80px" size="small">
                        <el-form-item label="类型名称" prop="workTypeName">
                          <el-input v-model="editRoleForm.workTypeName" placeholder="请输入类型名称"> </el-input>
                        </el-form-item>
                        <el-form-item label="备注信息">
                          <el-input v-model="editRoleForm.remark" placeholder="请填写备注信息"> </el-input>
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
              <vxe-table-column field="workTypeId" title="工单类型ID"></vxe-table-column>
              <vxe-table-column field="workTypeName" title="类型名称"></vxe-table-column>
              <vxe-table-column field="remark" title="备注信息"></vxe-table-column>
              <vxe-table-column title="操作">
                <template v-slot="{ row }">
                  <vxe-button size="mini" content="修改" @click="edit(row.workTypeId)"></vxe-button>
                  <vxe-button size="mini" content="删除" @click="del(row.workTypeId)"></vxe-button>
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
            var checkAddName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('类型名称不能为空'));
                } else {
                    //axios 请求后端查重接口
                    this.$axios.get('/api/sp/admin/worktype/checkAddName?name='+value) //接口
                        .then(function (response) {
                            //根据返回判断
                            return response.data ?  callback() : callback(new Error('该类型已存在'));
                        }.bind(this))
                        .catch(function (error) {

                        });
                }
            };
            //修改手机号查重
            var checkEditName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('类型名称不能为空'));
                } else {
                    //axios 请求后端查重接口
                    this.$axios.get('/api/sp/admin/worktype/checkEditName/'+value+'/'+this.$data.editRoleForm.workTypeId) //接口
                        .then(function (response) {
                            //根据返回判断
                            return response.data ?  callback() : callback(new Error('该类型已存在'));
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
                  type:'',
                },
                roleForm: {
                    workTypeName:'',
                    remark:'',
                },
                editRoleForm: {
                    workTypeId:'',
                    workTypeName:'',
                    remark:'',
                    status:'',
                },
                editRules: {
                    workTypeName: [
                        { required: true, message: '请填写工单类型名称', trigger: 'blur' },
                        { validator: checkEditName, trigger: "blur" } // 自定义校验(添加手机号)
                    ],
                },
                rules: {
                    workTypeName: [
                        { required: true, message: '请填写工单类型名称', trigger: 'blur' },
                        { validator: checkAddName, trigger: "blur" } // 自定义校验(修改手机号)
                    ],
                },
            }
        },
        methods: {
            //get work type data
            getData(){
                this.$axios.get('/api/sp/admin/worktype/page/'+this.$data.currentPage+'/'+this.$data.pageSize+'?type='+this.$data.searchForm.type)
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
                this.$axios.get('/api/sp/admin/worktype/page/'+val+'/'+pageSize+"?type="+this.$data.searchForm.type)
                    .then(function (response) {
                        this.$data.total = response.data.records;
                        this.$data.tableData = response.data.rows;
                    }.bind(this))
                    .catch(function (error) {

                    });
            },
            //add work type
            add(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/api/sp/admin/worktype/add',
                            this.$data.roleForm)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'添加工单类型成功',
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
                this.$axios.get('/api/sp/admin/worktype/id/'+id).then(function (response) {
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
                        this.$axios.post('/api/sp/admin/worktype/save',
                            this.$data.editRoleForm)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'保存成功',
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
                        this.$axios.get('/api/sp/admin/worktype/delete/'+id)
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
                this.$axios.get('/api/sp/admin/worktype/page/'+this.$data.currentPage+'/'+this.$data.pageSize+'?type='+this.$data.searchForm.type,)
                    .then(function (response) {
                        this.$data.tableData = response.data.rows;
                        this.$data.total = response.data.records;
                    }.bind(this))
                    .catch(function (error) {
                    }.bind(this));
            },
        },
        created() {
            this.getData();
        }
    }
</script>

<style scoped>

</style>
