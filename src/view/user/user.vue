<template>
    <div>
      <el-row>
        <el-col :span="24"style="margin-top: 20px">
          <el-card style="width: 98%;margin: 0 auto;">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>用户信息</el-breadcrumb-item>
            </el-breadcrumb>
          </el-card>
        </el-col>
        <el-col :span="24"style="margin-top: 20px;">
          <el-card class="box-card" style="width: 98%;margin: 0 auto; height: 130px;">
            <div slot="header" class="clearfix">
              <span>条件筛选</span>
            </div>
            <div class="text item">
              <el-form :inline="true" :model="formInline">
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="审批人">
                      <el-input v-model="formInline.user" placeholder="审批人"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="活动区域">
                      <el-select v-model="formInline.region" placeholder="活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item>
                      <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-card>
        </el-col>
        <el-col :span="24" style="margin-top: 20px;">
          <el-card class="box-card" >
            <div class="box">
              <div slot="header" class="clearfix">
                <span>数据表格</span>
              </div>
              <div class="text item">
                <el-button type="primary" v-has="'user:add'" @click="addUser">新增用户</el-button>
                <el-button type="primary" v-has="'user:del'" >删除用户</el-button>
                <el-table
                  ref="multipleTable"
                  :data="tableData"
                  tooltip-effect="dark"
                  style="width: 100%"
                  @selection-change="handleSelectionChange">
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column
                    prop="id"
                    label="id"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="userId"
                    label="userId"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="username"
                    label="账号"
                    show-overflow-tooltip>
                  </el-table-column>
                </el-table>
                <div class="block" style="margin-top: 20px">
                  <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page=currentPage
                    :page-size=pageSize
                    layout="total, prev, pager, next, jumper"
                    :total=total>
                  </el-pagination>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
</template>

<script>
    export default {
        name: "user",
        data(){
            return{
                tableData: [],
                multipleSelection: [],
                formInline: {
                    user: '',
                    region: ''
                },
                currentPage: 1,
                pageSize:10,
                total: 100,
            }
        },methods:{
            createLoding(){
                return this.$loading({
                    lock: true,//lock的修改符--默认是false
                    text: '加载中',//显示在加载图标下方的加载文案
                    spinner: 'el-icon-loading',//自定义加载图标类名
                    background: 'rgba(0, 0, 0, 0.7)',//遮罩层颜色
                    target: document.querySelector('#table')//loadin覆盖的dom元素节点
                });
            },
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            onSubmit() {
                console.log('submit!');
            },
            handleCurrentChange(val) {
                //currentPage 变化监听
                this.$axios.get('/api/userpage?pageSize='+this.$data.pageSize+'&currentPage='+val)
                    .then(function (response) {
                        this.$data.total = response.data.total;
                        this.$data.tableData = response.data.rows;
                    }.bind(this))
                    .catch(function (error) {

                    });
            },
            loadUserTable(){
                this.$axios.get('/api/userpage?currentPage='+this.$data.currentPage+"&pageSize="+this.$data.pageSize)
                    .then(function (response) {
                        this.$data.total = response.data.total;
                        this.$data.tableData = response.data.rows;
                    }.bind(this))
                    .catch(function (error) {

                    });
            },
            addUser(){
                this.$axios.post('/api/addUser')
                    .then(function (response) {
                       console.log(response.data.username)
                       alert(response.data.username)

                    }.bind(this))
                    .catch(function (error) {

                    });
            },
            queryPers(){
                this.$axios.get('/api/permisson/perslist?username='+'admin')
                    .then(function (response) {
                        let perms = [];
                        response.data.forEach(function (value,key,arr) {
                            perms.push(value.perms);
                        });
                        this.$store.commit("SET_BTNS",perms);
                    }.bind(this))
                    .catch(function (error) {

                    });
            },
        },
        mounted() {
        },
        created(){
            //查询权限
            this.queryPers();
            this.loadUserTable();
        }
    }
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card{
    width: 98%;
    margin: 0 auto;
    height: 680px;
  }
  .box{
    height: 100%;
    overflow: auto;
  }
</style>
