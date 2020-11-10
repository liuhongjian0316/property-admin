<template>
    <div>
      <el-row>
        <el-col :span="24" style="margin-top: 20px">
          <el-card style="width: 98%;margin: 0 auto;">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: path }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>小区管理</el-breadcrumb-item>
              <el-breadcrumb-item>审核小区</el-breadcrumb-item>
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
                <el-col :span="6">
                  <el-input placeholder="请输入小区ID" v-model="name"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-input placeholder="请输入小区名称" v-model="name"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-cascader
                    size="large"
                    placeholder="请选择小区位置"
                    :options="options"
                    v-model="cityCode"
                    @change="addressChange">
                  </el-cascader>
                </el-col>
                <el-col :span="4">
                  <el-button class="el-icon-search" type="success"  size="small" @click="onSubmit('searchForm')">搜索</el-button>
                  <el-button class="el-icon-refresh" type="warning"  size="small" @click="resetForm('searchForm')">重置</el-button>
                </el-col>
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
                  未审核小区
                </template>
              </vxe-toolbar>

              <vxe-table
                border
                ref="xTable"
                :data="tableData"
                export-config
                import-config>
                <vxe-table-column field="communityId" title="小区ID"></vxe-table-column>
                <vxe-table-column field="name" title="小区名称"></vxe-table-column>
                <vxe-table-column field="nearbyLandmarks" title="附近地标"></vxe-table-column>
                <vxe-table-column field="address" title="小区地址	"></vxe-table-column>
                <vxe-table-column field="state" title="状态">
                  <template v-slot="{ row }">
                    <template>
                      <span v-if="row.state == 0">待审核</span>
                    </template>
                  </template>
                </vxe-table-column>
                <vxe-table-column title="操作">
                  <template v-slot="{ row }">
                    <vxe-button size="mini" content="审核" @click="openModal(row.communityId)"></vxe-button>
                    <vxe-button size="mini" content="删除" @click="del(row.communityId)"></vxe-button>
                  </template>
                </vxe-table-column>
              </vxe-table>

              <!--audit modal-->
              <vxe-modal v-model="auditPage"
                         id="1315972361727643649"
                         title="审核小区" width="800" height="300"
                         resize remember
                         :esc-closable=true>
                <template v-slot>
                  <!--audit form-->
                  <div style="width: 80%;margin: 0 auto;">
                    <el-form  ref="roleForm" :model="roleForm"  :rules="rules"  label-width="80px" size="small">
                      <el-form-item label="审核状态" prop="name">
                        <el-select v-model="roleForm.state" placeholder="请审核" style="width: 100%">
                          <el-option label="请审核" value=""></el-option>
                          <el-option label="同意" value="1"></el-option>
                          <el-option label="拒绝" value="2"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="原因">
                        <el-input v-model="roleForm.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 5}"> </el-input>
                      </el-form-item>
                      <el-form-item style="float: right;position: absolute; bottom: 20px; right: 100px;">
                        <el-button type="primary" @click="save('roleForm')">提交</el-button>
                        <el-button @click="auditPage=false">关闭</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </template>
              </vxe-modal>
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
        name: "community",
        data(){
            return{
                path:'\/index',
                cityCode:[],//城市编码
                address:'',//临时地址
                options: regionData,
                name:"",
                currentPage: 1,
                pageSize:10,
                total: 100,
                tableData: [],
                auditPage: false,//审核模态框状态
                roleForm: {
                    communityId:'',
                    state:'',
                    remark:'',
                },
                rules: {
                    state: [
                        { required: true, message: '请选择', trigger: 'blur' },
                    ],
                },
            }
        },
        methods: {
            //get community data
            getData(){
                this.$axios.get('/api/community/unaudited/'+this.$data.currentPage+'/'+this.$data.pageSize)
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
                this.$axios.get('/api/unaudited/page/'+val+'/'+pageSize)
                    .then(function (response) {
                        this.$data.total = response.data.records;
                        this.$data.tableData = response.data.rows;
                    }.bind(this))
                    .catch(function (error) {

                    });
            },
            //open modal
            openModal(id){
                this.auditPage=true;
                this.$data.roleForm.communityId = id;
            },
            //audit community
            save(formName){
                //审核小区
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/api/community/audit',
                            this.$data.roleForm)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'审核小区成功',
                                        });
                                        this.$data.auditPage = false;
                                        this.reload();
                                        this.resetForm(formName);
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
                        this.$axios.get('/api/community/delete/'+id)
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
                            .catch(function (error) {

                            });
                    }
                    return false;
                })
            },
            addressChange(arr) {
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
