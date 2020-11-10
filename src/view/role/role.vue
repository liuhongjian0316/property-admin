<template>
    <div>
      <el-row>
        <el-col :span="24">
          <el-col :span="24"style="margin-top: 20px">
            <el-card style="width: 98%;margin: 0 auto;">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>角色管理</el-breadcrumb-item>
              </el-breadcrumb>
            </el-card>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-col :span="24"style="margin-top: 20px">
            <el-card style="width: 98%;margin: 0 auto;">
              <el-form ref="searchForm" :model="searchForm" :rules="searchRuleForm" label-width="80px" size="mini">
                <el-row>
                  <el-col :span="4">
                    <el-form-item label="角色名称" prop="name">
                      <el-input v-model="searchForm.name"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="权限字符" prop="perm">
                      <el-input v-model="searchForm.perm"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item label="角色状态" prop="status">
                      <el-select placeholder="" v-model="searchForm.status">
                        <el-option value="">所有</el-option>
                        <el-option value="1">正常</el-option>
                        <el-option value="2">停用</el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="创建时间" prop="createTime">
                      <el-date-picker
                        v-model="searchForm.createTime"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-button class="el-icon-searc" type="success" round size="mini" @click="onSubmit('searchForm')">搜索</el-button>
                    <el-button class="el-icon-refresh" type="warning" round size="mini" @click="resetForm('searchForm')">重置</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </el-card>
          </el-col>
        </el-col>
      </el-row>

      <!--role table -->
      <el-row>
        <el-col :span="24">
          <el-col :span="24"style="margin-top: 20px">
            <el-card style="width: 98%;margin: 0 auto;">
              <vxe-toolbar :refresh="{query: reload}" import export print custom>
                <template v-slot:buttons>
                  <el-button type="primary" class="el-icon-plus" size="mini" round @click="addPage=true">新增</el-button>
                  <!--增加角色模态框-->
                  <vxe-modal v-model="addPage"
                             id="198215524654456"
                             title="增加角色" width="800" height="380"
                             resize remember
                             :esc-closable=true>
                    <template v-slot>
                      <!--add role form-->
                      <div style="width: 80%;margin: 0 auto;">
                        <el-form  ref="roleForm" :model="roleForm"  :rules="rules"  label-width="80px" size="small">
                          <el-form-item label="角色名称" prop="name">
                            <el-input v-model="roleForm.name"> </el-input>
                          </el-form-item>
                          <el-form-item label="权限字符" prop="perm" >
                            <el-input v-model="roleForm.perm"></el-input>
                          </el-form-item>
                          <el-form-item label="角色描述">
                            <el-input v-model="roleForm.description"></el-input>
                          </el-form-item>
                          <el-form-item label="角色状态" prop="status">
                            <vxe-switch v-model="roleForm.status" on-label="开启" :on-value="1" off-label="关闭" :off-value="2"></vxe-switch>
                          </el-form-item>
                          <el-form-item style="float: right;position: absolute; bottom: 20px; right: 100px;">
                            <el-button type="primary" @click="onSubmit('roleForm')">确定</el-button>
                            <el-button @click="resetForm('roleForm')">重置</el-button>
                            <el-button @click="addPage=false">关闭</el-button>
                          </el-form-item>
                        </el-form>
                      </div>
                    </template>
                  </vxe-modal>

                  <el-button type="success" class="el-icon-edit" size="mini" round :disabled="editBtndisabled" @click="eidtRole">修改</el-button>
                  <!--修改角色模态框-->
                  <vxe-modal v-model="editPage"
                             id="198215524654456"
                             title="修改角色" width="800" height="380"
                             resize remember
                             :esc-closable=true>
                    <template v-slot>
                      <!--add role form-->
                      <div style="width: 80%;margin: 0 auto;">
                        <el-form  ref="roleForm" :model="roleForm"  :rules="rules"  label-width="80px" size="small">
                          <el-form-item label="角色名称" prop="name">
                            <el-input v-model="roleForm.name"> </el-input>
                          </el-form-item>
                          <el-form-item label="权限字符" prop="perm" >
                            <el-input v-model="roleForm.perm"></el-input>
                          </el-form-item>
                          <el-form-item label="角色描述">
                            <el-input v-model="roleForm.description"></el-input>
                          </el-form-item>
                          <el-form-item label="角色状态" prop="status">
                            <vxe-switch v-model="roleForm.status" on-label="开启" :on-value="1" off-label="关闭" :off-value="2"></vxe-switch>
                          </el-form-item>
                          <el-form-item style="float: right;position: absolute; bottom: 20px; right: 100px;">
                            <el-button type="primary" @click="onSubmit('roleForm')">确定</el-button>
                            <el-button @click="resetForm('roleForm')">重置</el-button>
                            <el-button @click="editPage=false">关闭</el-button>
                          </el-form-item>
                        </el-form>
                      </div>
                    </template>
                  </vxe-modal>
                  <el-button type="danger" class="el-icon-delet" size="mini" round :disabled="delBtuDisale" @click="delRole">删除</el-button>
                </template>
              </vxe-toolbar>

              <vxe-table
                border
                ref="xTable"
                :data="tableData"
                export-config
                import-config
                @checkbox-all="selectAllEvent"
                @checkbox-change="selectChangeEvent">
                <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                <vxe-table-column field="roleId" title="角色id"></vxe-table-column>
                <vxe-table-column field="name" title="角色名称"></vxe-table-column>
                <vxe-table-column field="perm" title="权限字符"></vxe-table-column>
                <vxe-table-column field="status" title="状态">
                  <template v-slot="{ row }">
                    <template>
                      <vxe-switch v-model="row.status" on-label="开启" :on-value="1" off-label="关闭" :off-value="2" @change="HandlerChangeStatus(row)"></vxe-switch>
                    </template>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="createTime" title="创建时间" formatter="formatDate"></vxe-table-column>
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

    export default {
        name: "role",
        data(){
            return {
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
                addPage: false,
                editPage: false,
                editBtndisabled: true,
                delBtuDisale:true,
                roleForm: {
                    id:'',
                    roleId:'',
                    name:'',
                    perm:'',
                    description:'',
                    status:'',
                    createTime:'',
                    updateTime:'',
                },
                rules: {
                    name: [
                        { required: true, message: '请填写角色名称', trigger: 'blur' },
                    ],
                    perm: [
                        { required: true, message: '请填写角色名称', trigger: 'blur' },
                    ],
                    status: [
                        { required: true, message: '请选择角色状态', trigger: 'blur' },
                    ],
                },
                searchForm: {
                    name: "",
                    perm: "",
                    status:"",
                    createTime:''
                },
                searchRuleForm:{
                    name: [],
                    perm: [],
                    status: [],
                    createTime: [],
                },
                currentPage: 1,
                pageSize:10,
                total: 100,
                tableData: [
                    { id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', age: 28, address: 'vxe-table 从入门到放弃' },
                    { id: 10002, name: 'Test2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
                    { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
                    { id: 10004, name: 'Test4', role: 'Designer', sex: 'Women ', age: 23, address: 'vxe-table 从入门到放弃' },
                    { id: 10005, name: 'Test5', role: 'Develop', sex: 'Women ', age: 30, address: 'Shanghai' }
                ],
            }
        },
        created() {
            this.getData();
        },
        methods: {
            delRole(){
                let selectRecords = this.$refs.xTable.getCheckboxRecords();
                this.$XModal.confirm('您确定要删除'+selectRecords.length+'条数据吗？').then(type => {
                    if(type == 'confirm'){
                        this.$XModal.alert("调用批量删除角色接口");
                        return;
                    }
                    if(type == 'cancel'){
                        this.$XModal.close;
                        return;
                    }

                })
            },
            eidtRole(){
                let selectRecords = this.$refs.xTable.getCheckboxRecords()
                if(selectRecords.length==0){
                    this.$XModal.alert("请至少选择一项数据")
                }else if(selectRecords.length>1){
                    this.$XModal.alert("请选择一项数据")
                }else{
                    this.$data.editPage=true;
                    this.$XModal.alert(selectRecords[0].id);
                    //根据id修改状态
                    this.$axios.get('/xxx?id='+selectRecords[0].id)
                        .then(function (response) {
                            //赋值
                            //调用修改数据接口
                            this.$data.editPage=false;
                        }.bind(this))
                        .catch(function (error) {
                            this.$modal.alert("请检查网络！！！！");
                        }.bind(this));
                }
            },
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            handleCurrentChange(val) {
                let pageSize = this.$data.pageSize
                //currentPage 变化监听
                this.$axios.get('/api/role/page/'+val+'/'+pageSize)
                    .then(function (response) {
                        this.$data.total = response.data.records;
                        this.$data.tableData = response.data.rows;
                    }.bind(this))
                    .catch(function (error) {

                    });
            },
            reload() {
                // 清除所有状态
                this.$refs.xTable.clearAll()
                return this.loadMenu()
            },
            HandlerChangeStatus(row){
                //根据id修改状态
                this.$axios.get('/xxx?id='+row.id+"&status="+row.status)
                    .then(function (response) {
                        this.$data.tableData = response.data;
                        this.$data.total = response.data.records;
                    }.bind(this))
                    .catch(function (error) {
                        this.$modal.alert("请检查网络！！！！");
                    }.bind(this));
            },
            selectAllEvent ({ checked, records }) {
                if(checked){
                    this.$data.delBtuDisale= false;
                    this.$data.editBtndisabled= false;
                }else{
                    this.$data.delBtuDisale= true;
                    this.$data.editBtndisabled= true;
                }
            },
            selectChangeEvent ({ checked, records }) {
                if(checked){
                    this.$data.delBtuDisale= false;
                    this.$data.editBtndisabled= false;
                }else{
                    this.$data.delBtuDisale= true;
                    this.$data.editBtndisabled= true;
                }
            },
            getSelectEvent () {
                let selectRecords = this.$refs.xTable.getCheckboxRecords()
                this.$XModal.alert(selectRecords.length)
            },
            getData(){
                this.$axios.get('/api/role/page/'+this.$data.currentPage+'/'+this.$data.pageSize)
                    .then(function (response) {
                        this.$data.tableData = response.data.rows;
                        this.$data.total = response.data.records;
                    }.bind(this))
                    .catch(function (error) {
                    }.bind(this));
            }
        }
    }
</script>

<style scoped>

</style>
