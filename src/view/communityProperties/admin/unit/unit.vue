<template>
    <div>
      <el-row>
        <el-col :span="24" style="margin-top: 20px">
          <el-card style="width: 98%;margin: 0 auto;">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: path }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>资产管理</el-breadcrumb-item>
              <el-breadcrumb-item>单元信息</el-breadcrumb-item>
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
                  <el-button type="primary" class="el-icon-plus" size="mini" @click="openAddPage">添加单元</el-button>
                  <!--add model-->
                  <vxe-modal v-model="addPage"
                             id="198215524654456"
                             title="增加单元" width="800" height="400"
                             resize remember
                             :esc-closable=true>
                    <template v-slot>
                      <!--add form-->
                      <div style="width: 80%;margin: 0 auto;">
                        <el-form  ref="roleForm" :model="roleForm"  :rules="rules"  label-width="80px" size="small">
                          <el-form-item label="单元编号" prop="buildingNum">
                            <el-input
                              placeholder="请输入单元编号"
                              v-model="roleForm.unitNumber"
                              @input="changeInput"
                            > </el-input>
                          </el-form-item>
                          <el-form-item label="单元名称" prop="unitName" >
                            <el-input v-model="roleForm.unitName" placeholder="请输入单元名称"></el-input>
                          </el-form-item>
                          <el-form-item label="楼层数" prop="unitFloorNumber">
                            <el-input v-model="roleForm.unitFloorNumber" placeholder="请输入楼层数"></el-input>
                          </el-form-item>
                          <el-form-item label="电梯" prop="haslift">
                            <el-select v-model="roleForm.haslift" placeholder="请选择">
                              <el-option label="请选择" value=""></el-option>
                              <el-option label="有" value="1"></el-option>
                              <el-option label="无" value="0"></el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="备注信息">
                            <el-input type="textarea" v-model="roleForm.remark"  placeholder="请填写备注信息"></el-input>
                          </el-form-item>
                          <el-form-item style="float: right;position: absolute; bottom: 20px; right: 100px;">
                            <el-button type="primary" @click="add('roleForm')">确定</el-button>
                            <el-button @click="addPage=false">关闭</el-button>
                          </el-form-item>
                        </el-form>
                      </div>
                    </template>
                  </vxe-modal>
                  <vxe-modal v-model="editPage"
                             id="1316729266263691280"
                             title="编辑单元" width="800" height="400"
                             resize remember
                             :esc-closable=true>
                    <template v-slot>
                      <!--edit form-->
                      <div style="width: 80%;margin: 0 auto;">
                        <el-form  ref="roleForm" :model="roleForm"  :rules="rules"  label-width="80px" size="small">
                          <el-form-item label="单元编号" prop="buildingNum">
                            <el-input
                              placeholder="请输入单元编号"
                              v-model="roleForm.unitNumber"
                              @input="changeInput"
                            > </el-input>
                          </el-form-item>
                          <el-form-item label="单元名称" prop="unitName" >
                            <el-input v-model="roleForm.unitName" placeholder="请输入单元名称"></el-input>
                          </el-form-item>
                          <el-form-item label="楼层数" prop="unitFloorNumber">
                            <el-input v-model="roleForm.unitFloorNumber" placeholder="请输入楼层数"></el-input>
                          </el-form-item>
                          <el-form-item label="电梯" prop="haslift">
                            <el-select v-model="roleForm.haslift" placeholder="请选择">
                              <el-option label="请选择" value=""></el-option>
                              <el-option label="有" value="1"></el-option>
                              <el-option label="无" value="0"></el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="备注信息">
                            <el-input type="textarea" v-model="roleForm.remark"  placeholder="请填写备注信息"></el-input>
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
                <vxe-table-column field="unitId" title="单元ID"></vxe-table-column>
                <vxe-table-column field="unitNumber" title="单元号"></vxe-table-column>
                <vxe-table-column field="unitName" title="单元名称"></vxe-table-column>
                <vxe-table-column field="unitFloorNumber" title="楼层数">
                  <template v-slot="{ row }">
                    <span>{{row.unitFloorNumber}} 层</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="haslift" title="是否有电梯">
                  <template v-slot="{ row }">
                    <span v-if="row.haslift == 1">有</span>
                    <span v-if="row.haslift == 0">无</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column title="操作">
                  <template v-slot="{ row }">
                    <vxe-button size="mini" content="修改" @click="edit(row.unitId)"></vxe-button>
                    <vxe-button size="mini" content="删除" @click="del(row.unitId)"></vxe-button>
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
        name: "unit",
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
                roleForm: {
                    unitId:'',
                    buildingId:'',
                    communityId:"",
                    unitName:'',
                    unitNumber:'',
                    haslift:'',
                    unitFloorNumber:'',
                    remark:'',
                },
                rules: {
                    name: [
                        { required: true, message: '请填写小区名称', trigger: 'blur' },
                        { pattern: /^[\u4e00-\u9fa5]{3,}?$/ , message: '请填写合法名称' }
                    ],
                    cityCode: [
                        { required: true, message: '请选择', trigger: 'blur' },
                    ],
                    address: [
                        { required: true, message: '请填写小区详细地址', trigger: 'blur' },
                    ],
                    nearbyLandmarks: [
                        { required: true, message: '请填写附近地标', trigger: 'blur' },
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
                this.$axios.get('/api/unit/page/'+this.$data.currentPage+'/'+
                    this.$data.pageSize+"/"+this.$data.communityId+"/"+this.$data.buildingId)
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
            reload(id) {
                // 清除所有状态
                this.$refs.xTable.clearAll();
                return this.choiceBuilding(id);
            },
            //page listen
            handleCurrentChange(val) {
                if(this.$data.tableData != ""){
                    let pageSize = this.$data.pageSize
                    //currentPage 变化监听
                    this.$axios.get('/api/unit/page/'+val+'/'+pageSize+"/"+this.$data.communityId+"/"+this.$data.buildingId)
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
            //open add page
            openAddPage(){
                if(this.$data.buildingId !== ''){
                    this.$data.addPage = true;
                    return;
                }else{
                    this.$modal.alert({ message: '请选择楼栋', status: 'warning' });
                }
            },
            //listen input
            changeInput(){
                if(this.$data.roleForm.unitNumber !== ""){
                    this.$data.roleForm.unitName = this.$data.roleForm.unitNumber + '单元';
                }else{
                    this.$data.roleForm.unitName = "";
                }
            },
            //add building
            add(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$data.roleForm.communityId = this.$data.communityId;
                        this.$data.roleForm.buildingId = this.$data.buildingId;
                        this.$axios.post('/api/unit/insert',
                            this.$data.roleForm)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'添加单元成功',
                                        });
                                        this.$data.addPage = false;
                                        this.reload(this.$data.buildingId);
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
            //get building
            edit(id){
                //根据id赋值
                this.$axios.get('/api/unit/id/'+id).then(function (response) {
                    this.$data.roleForm = response.data;
                    this.$data.editPage = true;
                }.bind(this)).catch(function (error) {
                    alert(error)
                });
            },
            //save community
            save(formName){
                //修改信息
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/api/unit/save',
                            this.$data.roleForm)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'编辑单元成功',
                                        });
                                        this.$data.editPage = false;
                                        this.reload(this.$data.buildingId);
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
                        this.$axios.get('/api/unit/delete/'+id)
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
                                        this.reload(this.$data.buildingId);
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

        }
    }
</script>

<style scoped>

</style>
