<template>
    <div>
      <el-row>
        <el-col :span="24" style="margin-top: 20px">
          <el-card style="width: 98%;margin: 0 auto;">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: path }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>资产管理</el-breadcrumb-item>
              <el-breadcrumb-item>添加房屋</el-breadcrumb-item>
            </el-breadcrumb>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="margin-top: 20px">
          <el-card style="width: 98%;margin: 0 auto;">
            <el-steps :active=active align-center>
              <el-step title="选择楼"></el-step>
              <el-step title="选择单元"></el-step>
              <el-step title="添加房屋"></el-step>
            </el-steps>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <!--choice building-->
        <div v-if="this.active == 1">
          <el-col :span="24" style="margin-top: 20px">
            <el-card style="width: 98%;margin: 0 auto;">
              <div slot="header" class="clearfix">
                <span>楼信息</span>
                <el-button icon="el-icon-search" style="float: right; padding: 5px" type="success" @click="openBuildingPage">选择楼</el-button>
                <vxe-modal v-model="choiceBuildingPage"
                           id="1317115291964149763"
                           title="选择楼栋" width="800" height="600"
                           resize remember
                           :esc-closable=true>
                  <template v-slot>
                    <!--search-->
                    <el-row :gutter="10">
                      <el-col :span="11"><el-input placeholder="请输入楼栋编号" size="small"></el-input></el-col>
                      <el-col :span="11"><el-input placeholder="请输入楼栋名称" size="small"></el-input></el-col>
                      <el-col :span="2"><el-button type="success" size="small">查询</el-button></el-col>
                    </el-row>
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
                        <vxe-table-column field="remark" title="备注"></vxe-table-column>
                        <vxe-table-column title="操作">
                          <template v-slot="{ row }">
                            <vxe-button type="success" size="mini" content="选择" @click="choiceBuilding(row.buildingId,row.buildingNum,row.buildingName,row.remark)"></vxe-button>
                          </template>
                        </vxe-table-column>
                      </vxe-table>
                    </div>
                  </template>
                </vxe-modal>
              </div>
              <div>
                <el-row style="margin-bottom: 20px;">
                  <el-col :span="8"><span>楼ID:&nbsp;&nbsp;&nbsp;</span><span v-if="this.roleForm.buildingId != ''">{{roleForm.buildingId}}</span></el-col>
                  <el-col :span="8"><span>楼名称:&nbsp;&nbsp;&nbsp;</span><span v-if="this.buildingDate.buildingName != ''">{{buildingDate.buildingName}}</span></el-col>
                  <el-col :span="8"><span>楼编号:&nbsp;&nbsp;&nbsp;</span><span v-if="this.buildingDate.buildingNum != ''">{{buildingDate.buildingNum}}</span></el-col>
                  <el-col :span="8" style="margin-top: 20px"><span>备注:&nbsp;&nbsp;&nbsp;</span><span v-if="this.buildingDate.remark != ''">{{buildingDate.remark}}</span></el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
        </div>
      </el-row>
      <!--choice unit-->
      <el-row>
        <!--choice unit-->
        <div v-if="this.active == 2">
          <el-col :span="24" style="margin-top: 20px">
            <el-card style="width: 98%;margin: 0 auto;">
              <div slot="header" class="clearfix">
                <span>单元信息</span>
                <el-button icon="el-icon-search" style="float: right; padding: 5px" type="success" @click="openUnitPage">选择单元</el-button>
                <vxe-modal v-model="choiceUnitPage"
                           id="1317115291964149763"
                           title="选择单元" width="800" height="600"
                           resize remember
                           :esc-closable=true>
                  <template v-slot>
                    <!--search-->
                    <el-row :gutter="10">
                      <el-col :span="11"><el-input placeholder="请输入单元编号" size="small"></el-input></el-col>
                      <el-col :span="11"><el-input placeholder="请输入单元名称" size="small"></el-input></el-col>
                      <el-col :span="2"><el-button type="success" size="small">查询</el-button></el-col>
                    </el-row>
                    <!--choice building page-->
                    <div>
                      <vxe-table
                        border
                        ref="xunitTable"
                        :data="unittableData"
                        export-config
                        import-config>
                        <vxe-table-column field="unitId" title="单元ID"></vxe-table-column>
                        <vxe-table-column field="unitNumber" title="单元编号"></vxe-table-column>
                        <vxe-table-column field="unitFloorNumber" title="总楼层数"></vxe-table-column>
                        <vxe-table-column field="haslift" title="电梯">
                          <template v-slot="{ row }">
                            <span v-if="row.haslift == '1'">有</span>
                            <span v-else>无</span>
                          </template>
                        </vxe-table-column>
                        <vxe-table-column field="remark" title="备注"></vxe-table-column>
                        <vxe-table-column title="操作">
                          <template v-slot="{ row }">
                            <vxe-button type="success" size="mini" content="选择"
                                        @click="choiceUnit(row.unitId,row.unitNumber,row.unitFloorNumber,row.haslift,row.remark)">
                            </vxe-button>
                          </template>
                        </vxe-table-column>
                      </vxe-table>
                    </div>
                  </template>
                </vxe-modal>
              </div>
              <div>
                <el-row style="margin-bottom: 20px;">
                  <el-col :span="8"><span>单元ID:&nbsp;&nbsp;&nbsp;</span><span v-if="this.roleForm.unitId != ''">{{roleForm.unitId}}</span></el-col>
                  <el-col :span="8"><span>单元编号:&nbsp;&nbsp;&nbsp;</span><span v-if="this.unitDate.unitNumber != ''">{{unitDate.unitNumber}}</span></el-col>
                  <el-col :span="8"><span>总层数:&nbsp;&nbsp;&nbsp;</span><span v-if="this.unitDate.unitFloorNumber != ''">{{unitDate.unitFloorNumber}}</span></el-col>
                  <el-col :span="8" style="margin-top: 20px">
                    <span>电梯:&nbsp;&nbsp;&nbsp;</span>
                    <span v-if="this.unitDate.haslift != ''">
                      <span v-if="this.unitDate.haslift =='1'">有 </span>
                      <span v-else>无</span>
                    </span>
                  </el-col>
                  <el-col :span="8" style="margin-top: 20px"><span>备注:&nbsp;&nbsp;&nbsp;</span><span v-if="this.unitDate.remark != ''">{{unitDate.remark}}</span></el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
        </div>
      </el-row>
      <!--add house-->
      <el-row>
        <!--choice unit-->
        <div v-if="this.active == 3">
          <el-col :span="24" style="margin-top: 20px">
            <el-card style="width: 98%;margin: 0 auto;">
              <div slot="header" class="clearfix">
                <span>添加房屋</span>
              </div>
              <div>
                <!--add house form-->
                <div>
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
                  </el-form>
                </div>
              </div>
            </el-card>
          </el-col>
        </div>
      </el-row>
      <div style="float: right;margin-top: 20px;margin-right: 10px">
        <span v-if="this.active == 1"><el-button @click="previous" disabled size="small">上一步</el-button></span>
        <span v-if="this.active !== 1"><el-button @click="previous" size="small">上一步</el-button></span>
        <span v-if="this.active == 1">
          <span v-if="this.roleForm.buildingId != ''"><el-button type="success" @click="next('roleForm')" size="small">下一步</el-button></span>
          <span v-else>
            <el-button type="success" @click="next('roleForm')" size="small" disabled>下一步</el-button>
          </span>
        </span>
        <span v-if="this.active == 2">
          <span v-if="this.roleForm.unitId != ''"><el-button type="success" @click="next('roleForm')" size="small">下一步</el-button></span>
          <span v-else>
            <el-button type="success" @click="next('roleForm')" size="small" disabled>下一步</el-button>
          </span>
        </span>
        <span v-if="this.active == 3">
          <el-button type="success" @click="next('roleForm')" size="small">提交</el-button>
        </span>

      </div>
    </div>
</template>

<script>
    export default {
        name: "addHouse",
        data(){
            return{
                path:'\/index',
                active: 1,
                communityId:"1",//登陆时，用户角色为物业时，将它所管理的小区列出，并选择一个赋值 这块暂时赋值为 1
                choiceBuildingPage: false,
                choiceUnitPage: false,
                buildingtableData:[],
                unittableData:[],
                houseTypeParm1:'',
                houseTypeParm2:'',
                buildingDate: {
                    buildingName:'',
                    buildingNum:'',
                    remark:'',
                },
                unitDate: {
                    unitNumber:'',
                    unitFloorNumber:'',
                    haslift:'',
                    remark:'',
                },
                roleForm: {
                    communityId:'',
                    buildingId:'',
                    unitId:'',
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
                rules: {
                    state: [
                        { required: true, message: '请选择', trigger: 'blur' },
                    ],
                },
            }
        },
        methods:{
            //下一步
            next(formName){
                // if(this.$data.active < 4) this.$data.active++;
                if(this.$data.active === 1){
                    if(this.$data.roleForm.buildingId != ''){
                        this.$data.active++;
                    }
                }
                if(this.$data.active === 2){
                    if(this.$data.roleForm.unitId != ''){
                        this.$data.active++;
                    }
                }
                if(this.$data.active === 3){
                    this.$data.roleForm.houseType = this.$data.houseTypeParm1 + this.$data.houseTypeParm2;
                    this.$data.roleForm.communityId = this.$data.communityId;
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.$axios.post('/api/house/insert',
                                this.$data.roleForm)
                                .then(function (response) {
                                    if(response.data.status == '200'){
                                        let loding = this.createLoding();
                                        setTimeout(() => {
                                            loding.close();
                                            this.$message({
                                                type:"success",
                                                message:'添加房屋成功',
                                            });
                                            this.$router.push('/house')
                                        }, 1000);

                                    }
                                }.bind(this))
                                .catch(function (error) {

                                });
                        } else {
                            return false;
                        }
                    });
                }
            },
            //上一步
            previous(){
                if(this.$data.active !== 1) this.$data.active--;
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
            getBuildingtableData(){
                this.$axios.get('/api/building/list/'+this.$data.communityId)
                    .then(function (response) {
                        this.$data.buildingtableData = response.data;
                    }.bind(this))
                    .catch(function (error) {
                    }.bind(this));
            },
            //open choice-building of page
            openBuildingPage(){
                this.$data.choiceBuildingPage = true;
                this.getBuildingtableData();
            },
            choiceBuilding(buildingId,buildingNum,buildingName,remark){
                this.$data.roleForm.buildingId = buildingId;
                this.$data.buildingDate.buildingName = buildingName;
                this.$data.buildingDate.buildingNum = buildingNum;
                this.$data.buildingDate.remark = remark;
                this.$data.choiceBuildingPage = false;
            },
            getUnittableData(){
                this.$axios.get('/api/unit/list/'+this.$data.communityId+"/"+this.$data.roleForm.buildingId)
                    .then(function (response) {
                        this.$data.unittableData = response.data;
                    }.bind(this))
                    .catch(function (error) {
                    }.bind(this));
            },
            openUnitPage(){
                this.$data.choiceUnitPage = true;
                this.getUnittableData();
            },
            choiceUnit(unitId,unitNumber,unitFloorNumber,haslift,remark){
                this.$data.roleForm.unitId = unitId;
                this.$data.unitDate.unitNumber = unitNumber;
                this.$data.unitDate.unitFloorNumber = unitFloorNumber;
                this.$data.unitDate.haslift = haslift;
                this.$data.unitDate.remark = remark;
                this.$data.choiceUnitPage = false;
            },
            //listen input
            changeInput(){
                if(this.$data.roleForm.houseNum !== ""){
                    this.$data.roleForm.houseName = this.$data.roleForm.houseNum + '室';
                }else{
                    this.$data.roleForm.houseName = "";
                }
            },

        }
    }
</script>

<style scoped>

</style>
