<template>
  <div>
    <el-row>
      <el-col :span="24" style="margin-top: 20px">
        <el-card style="width: 98%;margin: 0 auto;">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: path }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>撤回处理</el-breadcrumb-item>
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
            <vxe-table-column field="distributeOrderId" title="编号"></vxe-table-column>
            <vxe-table-column field="applyName" title="申请人"></vxe-table-column>
            <vxe-table-column field="tel" title="联系电话"></vxe-table-column>
            <vxe-table-column field="shopName" title="商铺名称"></vxe-table-column>
            <vxe-table-column field="address" title="地址"></vxe-table-column>
            <vxe-table-column field="reserveTime" title="预约时间" formatter="formatDate"></vxe-table-column>
            <vxe-table-column field="state" title="状态" formatter="formatDate">
              <template v-slot="{ row }">
                <span v-if="row.state == 4"><div class="offlinestate"></div><el-tag type="info">待撤回</el-tag></span>
              </template>
            </vxe-table-column>
            <vxe-table-column title="操作">
              <template v-slot="{ row }">
                <vxe-button  size="mini" content="同意" @click="access(row)"></vxe-button>
                <vxe-button  size="mini" content="拒绝" @click="refused(row)"></vxe-button>
              </template>
            </vxe-table-column>
          </vxe-table>
          <p style="text-align:center; line-height:50px;" v-loading="loading"><a style="text-decoration: none;" href="javascript:;"  @click="getMData()">点击加载更多</a></p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
        name: "recall",
        data(){
            return{
                path:'/sp/repair/index',
                loading: true,
                tableData:[],//撤回申请列表
                currentPage: 1,
                pageSize:1,
                total: 100,
            }
        },methods:{
            getData(){
                this.$axios.get('/api/sp/repair/recall/list/'+this.$data.currentPage+'/'+this.$data.pageSize)
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
            //同意
            access(row){
                this.$modal.confirm('确认操作').then(type => {
                    if( type == 'confirm'){
                        this.$axios.post('/api/sp/repair/order/accessRecall/',row)
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
            //拒绝
            refused(row){
                this.$modal.confirm('确认操作').then(type => {
                    if( type == 'confirm'){
                        this.$axios.post('/api/sp/repair/order/refusedRecall/',row)
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
        },created() {
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
