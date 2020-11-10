<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height:252px;">
          <div class="user-info">
            <img :src="userinfo.businessLicensePhoto" class="user-avator" alt />
            <div class="user-info-cont">
              <div class="user-info-name">{{userinfo.name}}</div>
            </div>
          </div>
          <div class="user-info-list">
            法人：
            <span>{{userinfo.legalPerson}}</span>
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
              <el-tab-pane label="订单派单" name="1">
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
              <el-tab-pane label="商户统计" name="2">
                <div>
                  <span>{{ cityName || '-' }}:</span> <span>{{ cityNum || '0' }}个</span>
                  <div>
                    <el-row :gutter="100">
                      <el-col :span="12">
                        <ve-map :data="shopCityData" :settings="shopCitySettings" :events="shopCityEvents" ref="chart2"></ve-map>
                      </el-col>
                      <el-col :span="12">
                        <el-row>
                          <el-col :span="24">
                            <el-card class="box-card" style="height: 500px">
                              <div slot="header" class="clearfix">
                                <span class="el-icon-s-data">数据表格</span>
                                <vxe-toolbar :refresh="{query: reload}" export print custom> </vxe-toolbar>
                              </div>
                              <div>
                                <vxe-table
                                  border
                                  ref="shopCityTable"
                                  :data="shopCityData.rows"
                                  export-config
                                >
                                  <vxe-table-column field="位置" title="位置">
                                  </vxe-table-column>
                                  <vxe-table-column field="数量" title="数量">
                                    <template v-slot="{ row }">
                                      <span>{{row.数量}}个</span>
                                    </template>
                                  </vxe-table-column>
                                </vxe-table>
                              </div>
                            </el-card>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="维修员统计" name="3">
                <el-row :gutter="50">
                  <el-col :span="12">
                    <el-col :span="24">
                      <el-card class="box-card" style="height: 500px">
                        <div slot="header" class="clearfix">
                          <span class="el-icon-s-check">性别分布</span>
                        </div>
                        <div>
                          <ve-ring :data="repairSexData" ref="chart3"></ve-ring>
                        </div>
                      </el-card>
                    </el-col>
                  </el-col>
                  <el-col :span="12">
                    <el-card class="box-card" style="height: 500px">
                      <div slot="header" class="clearfix">
                        <span class="el-icon-s-custom">性别分布</span>
                      </div>
                      <div>
                        <ve-histogram :data="repairAgeData"
                                      :extend='{series: {label: { show: true, position: "top" }}}' ref="chartt3"></ve-histogram>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
                <el-row :gutter="100">
                  <el-col :span="12">
                    <span>{{ repairCityName || '-' }}:</span> <span>{{ repairCityNum || '0' }}个</span>
                    <ve-map :data="repairCityData" :settings="repairCitySettings" :events="repairCityEvents" ref="charttt3"></ve-map>
                  </el-col>
                  <el-col :span="12">
                    <el-row>
                      <el-col :span="24">
                        <el-card class="box-card" style="height: 500px">
                          <div slot="header" class="clearfix">
                            <span class="el-icon-s-data">数据表格</span>
                            <vxe-toolbar :refresh="{query: reload2}" export print custom> </vxe-toolbar>
                          </div>
                          <div>
                            <vxe-table
                              border
                              ref="repairCityTable"
                              :data="repairCityData.rows"
                              export-config
                            >
                              <vxe-table-column field="位置" title="位置">
                              </vxe-table-column>
                              <vxe-table-column field="数量" title="数量">
                                <template v-slot="{ row }">
                                  <span>{{row.数量}}个</span>
                                </template>
                              </vxe-table-column>
                            </vxe-table>
                          </div>
                        </el-card>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="客服统计" name="4">
                <el-row :gutter="100">
                  <el-col :span="24">
                    <el-row :gutter="20" class="mgb20">
                      <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                          <div class="grid-content grid-con-1">
                            <i class="el-icon-lx-people grid-con-icon el-icon-user-solid"></i>
                            <div class="grid-cont-right">
                              <div class="grid-num">{{serviceNum}}</div>
                              <div>客服数量</div>
                            </div>
                          </div>
                        </el-card>
                      </el-col>
                      <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                          <div class="grid-content grid-con-2">
                            <i class="el-icon-lx-notice grid-con-icon el-icon-message-solid"></i>
                            <div class="grid-cont-right">
                              <div class="grid-num">{{noticeNum}}</div>
                              <div>发布通知</div>
                            </div>
                          </div>
                        </el-card>
                      </el-col>
                      <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                          <div class="grid-content grid-con-3">
                            <i class="el-icon-lx-goods grid-con-icon el-icon-s-shop"></i>
                            <div class="grid-cont-right">
                              <div class="grid-num">{{orderNum}}</div>
                              <div>处理订单</div>
                            </div>
                          </div>
                        </el-card>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <div>
                      <el-card class="box-card" style="height: 500px">
                        <div slot="header" class="clearfix">
                          <span class="el-icon-s-check">公告类型</span>
                        </div>
                        <div>
                          <ve-histogram :data="noticeTypeData" :extend='{series: {label: { show: true, position: "top" }}}' ref="chart4"></ve-histogram>
                        </div>
                      </el-card>
                    </div>
                  </el-col>
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
                    this.reload();
                    this.reload2();
                })
                this.$nextTick(_ => {
                    this.$refs[`chartt${v}`].echarts.resize()
                    this.reload();
                    this.reload2();
                })
                this.$nextTick(_ => {
                    this.$refs[`charttt${v}`].echarts.resize()
                    this.reload();
                    this.reload2();
                })
            }
        },
        data() {
            this.shopCitySettings = {
                position: 'china',
                // selectData: true,
                selectedMode: 'single'
            }
            this.shopCityEvents = {
                click: (v) => {
                    console.log(v)
                    this.cityName = v.name
                    this.cityNum = v.value
                }
            }
            this.repairCitySettings = {
                position: 'china',
                // selectData: true,
                selectedMode: 'single'
            }
            this.repairCityEvents = {
                click: (v) => {
                    this.repairCityName = v.name
                    this.repairCityNum = v.value
                }
            }
            this.typeArr = ['line', 'histogram', 'pie']
            this.index = 0
            return {
                userinfo:JSON.parse(localStorage.getItem("spadmininfo")),
                activeName: '1', //tab
                shoptotal:123,
                cityName: '',
                cityNum:'',
                repairCityName: '',
                repairCityNum:'',
                shopCityData: {
                    columns: ['位置', '数量'],
                    rows: []
                },//商户统计地域分布
                repairCityData: {
                    columns: ['位置', '数量'],
                    rows: []
                },//维修员统计地域分布
                serviceNum:'',//客服数量
                noticeNum:'',//通告数量
                orderNum:'',//通告数量
                noticeTypeData:{
                    columns: ['类型', '数量'],
                    rows: []
                },//按通知类型统计
                pickerOptions:{
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e7;
                    }
                },//时间范围控制
                searchTime:[],
                chartData: {
                    columns: ['日期','订单'],
                    rows: []
                },
                chartSettings: { type: this.typeArr[this.index] },
                //性别统计
                repairSexData: {
                    columns: ['性别', '人数'],
                    rows: []
                },
                //年龄统计
                repairAgeData: {
                    columns: ['年龄', '人数'],
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
            //商户地域分布
            getShopAddress(){
                this.$axios.get('/api/sp/admin/statistics/shop/countByAddress')
                    .then(function (response) {
                        this.$data.shopCityData.rows = response.data
                    }.bind(this))
                    .catch(function (error) {

                    });
            },
            //维修员地域分布
            getRepairCityData(){
                this.$axios.get('/api/sp/admin/statistics/repair/countByAddress')
                    .then(function (response) {
                        this.$data.repairCityData.rows = response.data
                    }.bind(this))
                    .catch(function (error) {

                    });
            },
            //维修员性别分布
            getRepairSexData(){
                this.$axios.get('/api/sp/admin/statistics/repair/countBySex')
                    .then(function (response) {
                        this.$data.repairSexData.rows = response.data
                    }.bind(this))
                    .catch(function (error) {

                    });
            },
            //年龄分布
            getRepairAgeData(){
                this.$axios.get('/api/sp/admin/statistics/repair/countRepairByAges')
                    .then(function (response) {
                        this.$data.repairAgeData.rows = response.data
                    }.bind(this))
                    .catch(function (error) {

                    });
            },
            //获取客服数量
            getServiceNum(){
                this.$axios.get('/api/sp/admin/statistics/service/total')
                    .then(function (response) {
                        this.$data.serviceNum = response.data
                    }.bind(this))
                    .catch(function (error) {
                    });
            },
            //获取通知数量
            getNoticeNum(){
                this.$axios.get('/api/sp/admin/statistics/service/numOfNotice')
                    .then(function (response) {
                        this.$data.noticeNum = response.data
                    }.bind(this))
                    .catch(function (error) {
                    });
            },
            //获取客服订单总数
            getOrderNum(){
                this.$axios.get('/api/sp/admin/statistics/service/numOfNotice')
                    .then(function (response) {
                        this.$data.orderNum = response.data
                    }.bind(this))
                    .catch(function (error) {
                    });
            },
            //按类型统计通知
            getNoticeTypeData(){
                this.$axios.get('/api/sp/admin/statistics/service/countNoticeType')
                    .then(function (response) {
                        this.$data.noticeTypeData.rows = response.data
                    }.bind(this))
                    .catch(function (error) {
                    });
            },
            //数据表格 刷新
            reload() {
                // 清除所有状态
                this.$refs.shopCityTable.clearAll();
                return this.getShopAddress();
            },
            reload2() {
                // 清除所有状态
                this.$refs.repairCityTable.clearAll();
                return this.getShopAddress();
            },
            changeType: function () {
                this.index++
                if (this.index >= this.typeArr.length) { this.index = 0 }
                this.chartSettings = { type: this.typeArr[this.index] }
            },
            //v-charts 数据 时间选择器 change 监听
            handleTime(val){
                this.$axios.post('/api/sp/admin/statistics/order/adminOrderDetails',
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
            //v-charts 数据 7 14 30 按钮监听
            search(days){
                //将时间范围器赋值 当前日期的前7天 包括当前日期(2020-11-4)  2020-10-28---2020-11-4
                let array = new Array();
                array.push(new Date(this.getBeforeDate(days)));
                array.push(new Date());
                this.$data.searchTime = array;
                //将日期传回后端
                this.$axios.post('/api/sp/admin/statistics/order/adminOrderDetails',
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
            jump(path){
                this.$router.push(path)
            },
        },created() {
            this.getShopAddress();
            this.getRepairCityData();
            this.getRepairSexData();
            this.getRepairAgeData();
            this.getServiceNum();
            this.getNoticeNum();
            this.getOrderNum();
            this.getNoticeTypeData();

            this.search(7);
            this.getTotal();
            this.reload();
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
