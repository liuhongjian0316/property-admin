<template>
    <div>
      <el-row>
        <el-col :span="24" style="margin-top: 20px">
          <el-card style="width: 98%;margin: 0 auto;">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: path }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>资产管理</el-breadcrumb-item>
              <el-breadcrumb-item>房屋信息</el-breadcrumb-item>
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
                <el-col :span="8">
                  <el-row>
                    <el-col :span="12"><el-input placeholder="请选择楼栋" v-model="queryForm.buildingId" size="small"></el-input></el-col>
                    <el-col :span="12"><el-button type="success" icon="el-icon-search" size="small" @click="openChoice">选择</el-button></el-col>
                    <vxe-modal v-model="choicePage"
                               id="1316941673720320001"
                               title="选择楼栋" width="800" height="600"
                               resize remember
                               :esc-closable=true>
                      <template v-slot>
                        <!--choice building page-->
                        <div>
                          <vxe-table
                            border
                            ref="xbuildingTable"
                            :data="buildingtableData"
                            export-config
                            import-config>
                            <vxe-table-column field="buildingId" title="楼栋ID"></vxe-table-column>
                            <vxe-table-column field="buildingNum" title="楼栋号"></vxe-table-column>
                            <vxe-table-column field="buildingName" title="楼栋名称"></vxe-table-column>
                            <vxe-table-column field="buidingArea" title="楼栋面积">
                              <template v-slot="{ row }">
                                <span>{{row.buidingArea}} 平方米</span>
                              </template>
                            </vxe-table-column>
                            <vxe-table-column field="buidingFloorNumber" title="总楼层数	">
                              <template v-slot="{ row }">
                                <span>{{row.buidingFloorNumber}}层</span>
                              </template>
                            </vxe-table-column>
                            <vxe-table-column title="操作">
                              <template v-slot="{ row }">
                                <vxe-button size="mini" content="选择" @click="choiceBuilding(row.buildingId)"></vxe-button>
                              </template>
                            </vxe-table-column>
                          </vxe-table>
                        </div>
                      </template>
                    </vxe-modal>
                  </el-row>
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
                  <el-row>
                    <el-col :span="12"><el-button class="el-icon-search" type="success"  size="small" @click="onSubmit('searchForm')">搜索</el-button></el-col>
                    <el-col :span="12"><el-button class="el-icon-refresh" type="warning"  size="small" @click="resetForm('searchForm')">重置</el-button></el-col>
                  </el-row>
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
                  <router-link :to="{path:'/addhouse'}">
                    <el-button type="primary" class="el-icon-plus" size="mini">添加房屋</el-button>
                  </router-link>
                  <vxe-modal v-model="editPage"
                             id="1317348223672782852"
                             title="编辑房屋" width="800" height="600"
                             resize remember
                             :esc-closable=true>
                    <template v-slot>
                      <!--edit form-->
                      <div style="width: 80%;margin: 0 auto;">
                        <el-form  ref="roleForm" :model="roleForm"  :rules="rules"  label-width="80px" size="small">
                          <el-form-item label="房屋编号" prop="houseNum">
                            <el-input v-model="roleForm.houseNum" placeholder="必填，请填写房屋编号" @input="changeInput"> </el-input>
                          </el-form-item>
                          <el-form-item label="房屋名称" prop="houseName">
                            <el-input v-model="roleForm.houseName" placeholder="必填，请填写房屋名称"> </el-input>
                          </el-form-item>
                          <el-form-item label="房屋楼层" prop="houseFloor">
                            <el-input v-model="roleForm.houseFloor" placeholder="必填，请填写房屋楼层"> </el-input>
                          </el-form-item>
                          <el-form-item label="房屋户型" prop="houseType" >
                            <el-col :span="12">
                              <el-select v-model="houseTypeParm1" placeholder="请选择" style="width: 100%">
                                <el-option label="请选择" value=""></el-option>
                                <el-option label="一室" value="一室"></el-option>
                                <el-option label="两室" value="两室"></el-option>
                                <el-option label="三室" value="三室"></el-option>
                                <el-option label="四室" value="四室"></el-option>
                                <el-option label="五室" value="五室"></el-option>
                                <el-option label="六室" value="六室"></el-option>
                                <el-option label="七室" value="七室"></el-option>
                                <el-option label="八室" value="八室"></el-option>
                                <el-option label="九室" value="九室"></el-option>
                              </el-select>
                            </el-col>
                            <el-col :span="12">
                              <el-select v-model="houseTypeParm2" placeholder="请选择" style="width: 100%">
                                <el-option label="请选择" value=""></el-option>
                                <el-option label="一厅" value="一厅"></el-option>
                                <el-option label="两厅" value="两厅"></el-option>
                                <el-option label="三厅" value="三厅"></el-option>
                                <el-option label="四厅" value="四厅"></el-option>
                                <el-option label="五厅" value="五厅"></el-option>
                                <el-option label="六厅" value="六厅"></el-option>
                                <el-option label="七厅" value="七厅"></el-option>
                                <el-option label="八厅" value="八厅"></el-option>
                                <el-option label="九厅" value="九厅"></el-option>
                              </el-select>
                            </el-col>
                          </el-form-item>
                          <el-form-item label="房屋面积" prop="houseArea">
                            <el-input v-model="roleForm.houseArea"></el-input>
                          </el-form-item>
                          <el-form-item label="算费系数" prop="houseCostFactor">
                            <el-input v-model="roleForm.houseCostFactor"></el-input>
                          </el-form-item>
                          <el-form-item label="商铺" prop="isShop">
                            <el-select v-model="roleForm.isShop" placeholder="请选择">
                              <el-option label="请选择" value=""></el-option>
                              <el-option label="是" value="1"></el-option>
                              <el-option label="否" value="0"></el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="商品房" prop="isCommercialHouse">
                            <el-select v-model="roleForm.isCommercialHouse" placeholder="请选择">
                              <el-option label="请选择" value=""></el-option>
                              <el-option label="是" value="1"></el-option>
                              <el-option label="否" value="0"></el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="备注信息">
                            <el-input type="textarea" v-model="roleForm.remark"  :autosize="{ minRows: 2, maxRows: 5}" placeholder="请填写备注信息"></el-input>
                          </el-form-item>
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
                <vxe-table-column field="buildingNum" title="楼栋号">
                  <template v-slot="{ row }">
                    <span>{{row.buildingNum}}号楼</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="unitNumber" title="单元号">
                  <template v-slot="{ row }">
                    <span>{{row.unitNumber}}单元</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="houseFloor" title="楼层">
                  <template v-slot="{ row }">
                    <span>{{row.houseFloor}}层</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="houseName" title="房屋名称"></vxe-table-column>
                <vxe-table-column field="houseArea" title="面积">
                  <template v-slot="{ row }">
                    <span>{{row.houseArea}}平方米</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="houseCostFactor" title="算费系数"></vxe-table-column>
                <vxe-table-column field="state" title="房屋状态">
                  <template v-slot="{ row }">
                    <span v-if="row.state == 0">未销售</span>
                    <span v-if="row.state == 1">已入住</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="isShop" title="商铺">
                  <template v-slot="{ row }">
                    <span v-if="row.isShop == 0">是</span>
                    <span v-if="row.isShop == 1">否</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="isCommercialHouse" title="商品房">
                  <template v-slot="{ row }">
                    <span v-if="row.isCommercialHouse == 0">是</span>
                    <span v-if="row.isCommercialHouse == 1">否</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column title="操作">
                  <template v-slot="{ row }">
                    <el-row>
                      <el-col :span="12"><vxe-button size="mini" content="修改" @click="edit(row.houseId)"></vxe-button></el-col>
                      <el-col :span="12"><vxe-button size="mini" content="删除" @click="del(row.houseId)"></vxe-button></el-col>
                    </el-row>
                  </template>
                </vxe-table-column>
              </vxe-table>

              <!--分页-->
              <span v-if="this.$data.tableData != ''">
                <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page=currentPage
                  :page-size=pageSize
                  layout="total, prev, pager, next, jumper"
                  :total=total>
              </el-pagination>
              </span>
            </el-card>
          </el-col>
        </el-col>
      </el-row>
    </div>
</template>

<script>
    import { regionData,CodeToText } from 'element-china-area-data'
    export default {
        name: "house",
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
                buildingtableData:[],//查询楼栋表格数据
                editData:{},
                addPage: false,
                editPage: false,
                choicePage: false,
                communityId:"1",//登陆时，用户角色为物业时，将它所管理的小区列出，并选择一个赋值 这块暂时赋值为 1
                buildingId:"",//暂时赋值为1
                houseTypeParm1:"",
                houseTypeParm2:"",
                roleForm: {
                    roleForm: {
                        communityId:'',
                        buildingId:'',
                        unitId:'',
                        houseId:'',
                        houseNum:'',
                        houseName:'',
                        houseFloor:'',
                        houseType:'',
                        houseArea:'',
                        houseCostFactor:'',
                        isShop:'',
                        isCommercialHouse:'',
                        remark:'',
                    },
                },
                rules: {
                    name: [
                        { required: true, message: '请填写小区名称', trigger: 'blur' },
                        { pattern: /^[\u4e00-\u9fa5]{3,}?$/ , message: '请填写合法名称' }
                    ],
                },
                queryForm:{
                    buildingId:'',
                },
            }
        },
        methods: {
            //get community data
            getData(){
                this.$axios.get('/api/house/page/'+this.$data.currentPage+'/'+
                    this.$data.pageSize+"/"+this.$data.communityId)
                    .then(function (response) {
                        this.$data.tableData = response.data.rows;
                        this.$data.total = response.data.records;
                    }.bind(this))
                    .catch(function (error) {
                    }.bind(this));
            },
            getBuildingData(){
                this.$axios.get('/api/building/page/'+this.$data.currentPage+'/'+this.$data.pageSize)
                    .then(function (response) {
                        this.$data.buildingtableData = response.data.rows;
                        this.$data.total = response.data.records;
                    }.bind(this))
                    .catch(function (error) {
                    }.bind(this));
            },
            //open choice building page
            openChoice(){
                this.$data.choicePage = true;
                this.getBuildingData();
            },
            choiceBuilding(id){
                this.$data.buildingId = id;
                this.$data.queryForm.buildingId = id;
                this.$data.choicePage = false;
                this.$axios.get('/api/unit/page/'+this.$data.currentPage+'/'+
                    this.$data.pageSize+"/"+this.$data.communityId+"/"+id)
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
                if(this.$data.tableData != ""){
                    let pageSize = this.$data.pageSize
                    //currentPage 变化监听
                    this.$axios.get('/api/house/page/'+val+'/'+pageSize+"/"+this.$data.communityId)
                        .then(function (response) {
                            this.$data.total = response.data.records;
                            this.$data.tableData = response.data.rows;
                        }.bind(this))
                        .catch(function (error) {

                        });
                }else{
                    return;
                }

            },
            //get house
            edit(id){
                //根据id赋值
                this.$axios.get('/api/house/id/'+id).then(function (response) {
                    this.$data.roleForm = response.data;
                    this.$data.houseTypeParm1 = this.$data.roleForm.houseType.substr(0,2);
                    this.$data.houseTypeParm2 = this.$data.roleForm.houseType.substr(2,2);
                    this.$data.editPage = true;
                }.bind(this)).catch(function (error) {
                    alert(error)
                });
            },
            //save house
            save(formName){
                //修改信息
                this.$data.roleForm.houseType = '';
                this.$data.roleForm.houseType = this.$data.houseTypeParm1 + this.$data.houseTypeParm2;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/api/house/save',
                            this.$data.roleForm)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'编辑房屋成功',
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
                        this.$axios.get('/api/house/delete/'+id)
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
