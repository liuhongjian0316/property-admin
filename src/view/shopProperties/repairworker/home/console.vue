<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height:252px;">
          <div class="user-info">
            <img src="../../../../assets/images/login-bg.jpg" class="user-avator" alt />
            <div class="user-info-cont">
              <div class="user-info-name">{{userinfo.userName}}</div>
            </div>
          </div>
          <div class="user-info-list">
            姓名：
            <span>{{userinfo.realName}}</span>
          </div>
          <div class="user-info-list">
            地址：
            <span>{{userinfo.address}}</span>
          </div>
        </el-card>
        <el-card shadow="hover" style="height:252px;">
          <div slot="header" class="clearfix">
            <span>快捷操作</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="12"><el-button icon="el-icon-s-order" @click="jump('/sp/repair/grabOrder')">抢单</el-button></el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
                <i class="el-icon-lx-people grid-con-icon el-icon-user-solid"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">1234</div>
                  <div>用户访问量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
                <i class="el-icon-lx-notice grid-con-icon el-icon-message-solid"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">321</div>
                  <div>系统消息</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
                <i class="el-icon-lx-goods grid-con-icon el-icon-s-shop"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{total}}</div>
                  <div>订单</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-card shadow="hover" style="height:403px;">
          <div slot="header" class="clearfix">
            <span>待办事项</span>
            <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
          </div>
          <el-table :show-header="false" :data="todoList" style="width:100%;">
            <el-table-column width="40">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.status"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <div
                  class="todo-item"
                  :class="{'todo-item-del': scope.row.status}"
                >{{scope.row.title}}</div>
              </template>
            </el-table-column>
            <el-table-column width="60">
              <template>
                <i class="el-icon-edit"></i>
                <i class="el-icon-delete"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>数据概览</span>
          </div>
          <div>
            <el-tabs type="border-card" v-model="activeName">
              <el-tab-pane label="概述" name="1">
                <el-button @click="changeType" size="mini">切换图表类型</el-button>
                <div style="margin-left: 350px">
                  <el-row>
                    <el-col :span="1">时间: </el-col>
                    <el-col :span="1"><el-link type="primary" @click="search(7)">7天</el-link></el-col>
                    <el-col :span="1"><el-link type="primary" @click="search(14)">14天</el-link></el-col>
                    <el-col :span="1"><el-link type="primary" @click="search(30)">30天</el-link></el-col>
                    <el-col :span="6">
                      <el-date-picker
                        v-model="searchTime"
                        @change="handleTime"
                        :picker-options="pickerOptions"
                        type="daterange"
                        size="mini"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd">
                      </el-date-picker>
                    </el-col>
                  </el-row>
                </div>
                <div style="margin-left: 100px">
                  <div>
                    <ve-chart :data="chartData" :settings="chartSettings" ref="chart1"></ve-chart>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="订单类型" name="2">
                <ve-histogram :data="typeTotalOrder" :extend="extend" ref="chart2"></ve-histogram>
              </el-tab-pane>
              <el-tab-pane label="订单方式" name="3">
                <ve-histogram :data="methodTotalOrder" :extend="extend" ref="chart3"></ve-histogram>
              </el-tab-pane>
              <el-tab-pane label="收入分析" name="4">
                <el-row>
                  <el-col :span="8">
                    <div style="margin-left: 150px;margin-top: 50px">
                      <el-row>
                        <span >昨日收益</span>
                      </el-row>
                      <el-row>
                        <span style="font-size: 32px;font-weight: bold">{{yesterdayEarnings}}</span>元
                      </el-row>
                      <el-row>
                        <span>近30日 {{monthEarnings}}元</span>
                      </el-row>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div style="margin-left: 150px;margin-top: 50px">
                      <el-row>
                        <span >本月收益
                          <el-popover
                            placement="top-start"
                            width="200"
                            trigger="hover"
                            content="自本月 1 号至昨天产生的收益总和">
                            <el-button slot="reference" icon="el-icon-question" circle size="mini"></el-button>
                          </el-popover>
                        </span>
                      </el-row>
                      <el-row>
                        <span style="font-size: 32px;font-weight: bold">{{currentEarnings}}</span>元
                      </el-row>
                      <el-row>
                        <span>累计收益 {{totalEarnings}}元
                        <el-popover
                          placement="top-start"
                          width="200"
                          trigger="hover"
                          content="自注册帐号以来到昨天为止产生的收益总和">
                            <el-button slot="reference" icon="el-icon-question" circle size="mini"></el-button>
                          </el-popover>
                        </span>
                      </el-row>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div style="margin-left: 150px;margin-top: 50px">
                      <el-row>
                        <span >可提现金额</span>
                      </el-row>
                      <el-row>
                        <span style="font-size: 32px;font-weight: bold">{{canCarryEarnings}}</span>元
                      </el-row>
                      <el-row>
                        <span> <el-link type="info">查看明细&gt;</el-link></span>
                      </el-row>
                    </div>
                  </el-col>
                </el-row>
                <div style="margin-left: 350px">
                  <el-row>
                    <el-col :span="1">时间: </el-col>
                    <el-col :span="1"><el-link type="primary" @click="search2(7)">7天</el-link></el-col>
                    <el-col :span="1"><el-link type="primary" @click="search2(14)">14天</el-link></el-col>
                    <el-col :span="1"><el-link type="primary" @click="search2(30)">30天</el-link></el-col>
                    <el-col :span="6">
                      <el-date-picker
                        v-model="searchTime2"
                        @change="handleTime2"
                        :picker-options="pickerOptions"
                        type="daterange"
                        size="mini"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd">
                      </el-date-picker>
                    </el-col>
                  </el-row>
                </div>
                <el-row>
                  <el-tabs type="border-card" v-model="activeName2">
                    <el-tab-pane label="趋势图" name="1">
                      <el-button @click="changeType2" size="mini">切换图表类型</el-button>
                      <div style="margin-left: 100px">
                        <div>
                          <ve-chart :data="earningsDetails" :settings="chartSettings2" ref="chart4"></ve-chart>
                        </div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="数据列表" name="2">
                      <vxe-toolbar :refresh="{query: reload}" export print custom>
                      </vxe-toolbar>
                      <vxe-table
                        border
                        ref="xTable"
                        :data="earningsDetails.rows"
                        export-config
                        >
                        <vxe-table-column field="日期" title="日期">
                        </vxe-table-column>
                        <vxe-table-column field="收入" title="收入">
                          <template v-slot="{ row }">
                            <span>{{row.收入}}元</span>
                          </template>
                        </vxe-table-column>
                      </vxe-table>

                      <!--分页-->
                      <el-pagination
                        :current-page=currentPage
                        :page-size=pageSize
                        layout="total"
                        :total=pagetotal>
                      </el-pagination>
                    </el-tab-pane>
                  </el-tabs>
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
        name: "console",
        watch: {
            activeName (v) {
                this.$nextTick(_ => {
                    this.$refs[`chart${v}`].echarts.resize()
                })
            },
            activeName2 (v) {

                this.reload()
            }
        },
        data: function () {
            this.extend = {
                series: {
                    type:'bar',
                    label: { show: true, position: "top" }
                }
            }
            this.typeArr = ['line', 'histogram', 'pie']
            this.typeArr2 = ['line', 'histogram', 'pie']
            this.index = 0
            this.index2 = 0
            return {
                userinfo:JSON.parse(localStorage.getItem("repairinfo")),
                activeName: '1', //tab
                activeName2: '1', //tab
                pickerOptions:{
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e7;
                    }

                },
                searchTime:[],
                searchTime2:[],
                chartData: {
                    columns: ['日期','订单'],
                    rows: []
                },
                earningsDetails: {
                    columns: ['日期','收入'],
                    rows: []
                },
                chartSettings: { type: this.typeArr[this.index] },
                chartSettings2: { type: this.typeArr2[this.index2] },
                typeTotalOrder:{
                    columns: ['类型','订单'],
                    rows: []
                },
                currentPage: 1,
                pageSize:10,
                pagetotal: 100,
                methodTotalOrder:{
                    columns: ['方式','总计','反应速度好评','专业水平好评','服务态度好评'],
                    rows: []
                },
                total:'', //订单总数
                yesterdayEarnings:'',//昨日收益
                monthEarnings:'',//近30天收益
                currentEarnings:'',//本月收益
                totalEarnings:'',//总计收益
                canCarryEarnings:'',//可提现收益
                todoList: [
                    {
                        title: '今天要修复100个bug',
                        status: false
                    },
                    {
                        title: '今天要修复100个bug',
                        status: false
                    },
                    {
                        title: '今天要写100行代码加几个bug吧',
                        status: false
                    },
                    {
                        title: '今天要修复100个bug',
                        status: false
                    },
                    {
                        title: '今天要修复100个bug',
                        status: true
                    },
                    {
                        title: '今天要写100行代码加几个bug吧',
                        status: true
                    }
                ],
                data: [
                    {
                        name: '2018/09/04',
                        value: 1083
                    },
                    {
                        name: '2018/09/05',
                        value: 941
                    },
                    {
                        name: '2018/09/06',
                        value: 1139
                    },
                    {
                        name: '2018/09/07',
                        value: 816
                    },
                    {
                        name: '2018/09/08',
                        value: 327
                    },
                    {
                        name: '2018/09/09',
                        value: 228
                    },
                    {
                        name: '2018/09/10',
                        value: 1065
                    }
                ],
            }
        },
        methods:{
            //数据表格 刷新
            reload() {
                // 清除所有状态
                this.$refs.xTable.clearAll();
                return this.search2(7);
            },
            changeType: function () {
                this.index++
                if (this.index >= this.typeArr.length) { this.index = 0 }
                this.chartSettings = { type: this.typeArr[this.index] }
            },
            changeType2: function () {
                this.index2++
                if (this.index2 >= this.typeArr2.length) { this.index2 = 0 }
                this.chartSettings2 = { type: this.typeArr2[this.index2] }
            },
            //v-charts 数据 时间选择器 change 监听
            handleTime(val){
                this.$axios.post('/api/sp/repair/statistics/orderDetails?id='+JSON.parse(localStorage.getItem("repairinfo")).repairWorkerId,
                    val)
                    .then(function (response) {
                        if(response.data.status == '200'){
                            this.$data.chartData.rows = response.data.data
                        }else{
                            this.$alert(response.data.msg)
                        }
                    }.bind(this))
                    .catch(function (error) {

                    });
            },
            handleTime2(val){
                this.$axios.post('/api/sp/repair/statistics/earningsDetails?id='+JSON.parse(localStorage.getItem("repairinfo")).repairWorkerId,
                    val)
                    .then(function (response) {
                        if(response.data.status == '200'){
                            this.$data.earningsDetails.rows = response.data.data;
                            this.$data.pagetotal = this.$data.earningsDetails.rows.length;
                        }else{
                            this.$alert(response.data.msg)
                        }
                    }.bind(this))
                    .catch(function (error) {

                    });
            },
            //v-charts 数据 7 14 30 按钮监听
            search(days){
                //将时间范围器赋值 当前日期的前7天 包括当前日期(2020-11-4)  2020-10-28---2020-11-4
                let array = new Array();
                array.push(new Date(this.getBeforeDate(days)));
                array.push(new Date());
                this.$data.searchTime = array;
                //将日期传回后端
                this.$axios.post('/api/sp/repair/statistics/orderDetails?id='+JSON.parse(localStorage.getItem("repairinfo")).repairWorkerId,
                    this.$data.searchTime)
                    .then(function (response) {
                        if(response.data.status == '200'){
                            this.$data.chartData.rows = response.data.data
                        }else{
                            this.$alert(response.data.msg)
                        }
                    }.bind(this))
                    .catch(function (error) {
                    });
            },
            search2(days){
                //将时间范围器赋值 当前日期的前7天 包括当前日期(2020-11-4)  2020-10-28---2020-11-4
                let array = new Array();
                array.push(new Date(this.getBeforeDate(days)));
                array.push(new Date());
                this.$data.searchTime2 = array;
                //将日期传回后端
                this.$axios.post('/api/sp/repair/statistics/earningsDetails?id='+JSON.parse(localStorage.getItem("repairinfo")).repairWorkerId,
                    this.$data.searchTime2)
                    .then(function (response) {
                        if(response.data.status == '200'){
                            this.$data.earningsDetails.rows = response.data.data
                            this.$data.pagetotal = this.$data.earningsDetails.rows.length;
                        }else{
                            this.$alert(response.data.msg)
                        }
                    }.bind(this))
                    .catch(function (error) {
                    });
            },
            //获取前n天日期
            getBeforeDate(n) {
                var n = n;
                var d = new Date();
                var year = d.getFullYear();
                var mon = d.getMonth() + 1;
                var day = d.getDate();
                if (day <= n) {
                    if (mon > 1) {
                        mon = mon - 1;
                    } else {
                        year = year - 1;
                        mon = 12;
                    }
                }
                d.setDate(d.getDate() - n);
                year = d.getFullYear();
                mon = d.getMonth() + 1;
                day = d.getDate();
                return year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
            },
            //订单总数
            getTotal(){
                  this.$axios.get('/api/sp/repair/statistics/totalOrders/'+JSON.parse(localStorage.getItem("repairinfo")).repairWorkerId)
                    .then(function (response) {
                        this.$data.total = response.data
                    }.bind(this))
                    .catch(function (error) {

                    });
            },
            //类型总计
            getTypeTotal(){
                this.$axios.get('/api/sp/repair/statistics/reparirTypeOrder/'+JSON.parse(localStorage.getItem("repairinfo")).repairWorkerId)
                    .then(function (response) {
                        this.$data.typeTotalOrder.rows = response.data
                    }.bind(this))
                    .catch(function (error) {});
            },
            //统计普通订单悬赏订单电话订单数量
            getMethodTotal(){
                this.$axios.get('/api/sp/repair/statistics/repairMethodOrder/'+JSON.parse(localStorage.getItem("repairinfo")).repairWorkerId)
                    .then(function (response) {
                        this.$data.methodTotalOrder.rows = response.data
                    }.bind(this))
                    .catch(function (error) {});
            },
            //昨日收入
            getYesterdayEarnings(){
                this.$axios.get('/api/sp/repair/statistics/yesterdayEarnings/'+JSON.parse(localStorage.getItem("repairinfo")).repairWorkerId)
                    .then(function (response) {
                        this.$data.yesterdayEarnings = response.data
                    }.bind(this))
                    .catch(function (error) {});
            },
            //近30天收入
            getMonthEarnings(){
                this.$axios.get('/api/sp/repair/statistics/monthEarnings/'+JSON.parse(localStorage.getItem("repairinfo")).repairWorkerId)
                    .then(function (response) {
                        this.$data.monthEarnings = response.data
                    }.bind(this))
                    .catch(function (error) {});
            },
            //本月收入
            getCurrentEarnings(){
                this.$axios.get('/api/sp/repair/statistics/currentEarnings/'+JSON.parse(localStorage.getItem("repairinfo")).repairWorkerId)
                    .then(function (response) {
                        this.$data.currentEarnings = response.data
                    }.bind(this))
                    .catch(function (error) {});
            },
            //总计收入
            getTotalEarnings(){
                this.$axios.get('/api/sp/repair/statistics/totalEarnings/'+JSON.parse(localStorage.getItem("repairinfo")).repairWorkerId)
                    .then(function (response) {
                        this.$data.totalEarnings = response.data
                    }.bind(this))
                    .catch(function (error) {});
            },
            //可提现收入
            getCanCarryEarnings(){
                this.$axios.get('/api/sp/repair/statistics/canCarryEarnings/'+JSON.parse(localStorage.getItem("repairinfo")).repairWorkerId)
                    .then(function (response) {
                        this.$data.canCarryEarnings = response.data
                    }.bind(this))
                    .catch(function (error) {});
            },
            jump(path){
                this.$router.push(path)
            },
        },created() {
            this.search(7);
            this.search2(7);
            this.getTotal();
            this.getTypeTotal();
            this.getMethodTotal();
            this.getYesterdayEarnings();
            this.getMonthEarnings();
            this.getCurrentEarnings();
            this.getTotalEarnings();
            this.getCanCarryEarnings();
        }
    }
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }
  .grid-content {
    display: flex;
    align-items: center;
    height: 100px;
  }

  .grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
  }

  .grid-num {
    font-size: 30px;
    font-weight: bold;
  }

  .grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
  }

  .grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
  }

  .grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
  }

  .grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
  }

  .grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
  }

  .grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
  }

  .grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
  }

  .user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
  }

  .user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }

  .user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
  }

  .user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
  }

  .user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
  }

  .user-info-list span {
    margin-left: 70px;
  }

  .mgb20 {
    margin-bottom: 20px;
  }

  .todo-item {
    font-size: 14px;
  }

  .todo-item-del {
    text-decoration: line-through;
    color: #999;
  }

  .schart {
    width: 100%;
    height: 300px;
  }
</style>
