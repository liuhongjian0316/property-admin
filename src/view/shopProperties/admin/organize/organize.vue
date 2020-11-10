<template>
  <div>
    <el-row>
      <el-col :span="24"style="margin-top: 20px">
        <el-card style="width: 98%;margin: 0 auto;">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>组织管理</el-breadcrumb-item>
            <el-breadcrumb-item>组织信息</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24"style="margin-top: 20px">
        <el-card style="width: 98%;margin: 0 auto;">
          <el-collapse v-model="activeseachPage">
            <el-collapse-item name="seachPage" :disabled="true">
              <template slot="title">
                <i class="header-icon el-icon-search"></i>深层搜素
              </template>
              <vxe-input v-model="filterName" type="type" placeholder="部门名称" @keyup="handleSearch" style="width:100%"/>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div>
          <vxe-toolbar :refresh="{query: reload}" export print custom style="width: 98%;margin: 0 auto;">
            <template v-slot:buttons>
              <el-button type="success" icon="el-icon-plus" size="mini" round @click="menuAddpage=true">新增</el-button>
              <!--add organize modal-->
              <!--it is to set key-id for prevent the moadl from poping -->
              <vxe-modal v-model="menuAddpage"
                         id="19821552465445231231236"
                         title="增加组织" width="800" height="350"
                         resize remember
                         :esc-closable=true>
                <template v-slot>
                  <!--add menu form-->
                  <div style="width: 80%;margin: 0 auto;">
                    <el-form  ref="menuForm" :model="organizeForm"  :rules="rules"  label-width="80px" size="small">
                      <el-form-item label="上级组织"  v-show=false>
                        <el-input v-model="organizeForm.organizeParent"> </el-input>
                      </el-form-item>
                      <el-form-item label="上级组织" prop="parentName" >
                        <el-input v-model="organizeForm.organizeParentName" @click.native="choiceParentOrganize=true" suffix-icon="el-icon-search"></el-input>
                        <!--load menu tree. show into modal-->
                        <vxe-modal v-model="choiceParentOrganize" title="组织选择" width="500" height="400" resize remember>
                          <template v-slot>
                            <!--load menu-->
                            <!--filter menu to search menu-->
                            <div style="width: 98%;margin: 0 auto;">
                              <el-row>
                                <el-col :span="16">
                                  <el-input
                                    placeholder="输入关键字进行过滤"
                                    v-model="filterText">
                                  </el-input>
                                </el-col>
                                <el-col :span="8">
                                  <el-button  @click="handleExpand"> <i class="el-icon-s-fold">折叠</i>  / <i class="el-icon-s-unfold">展开</i></el-button>
                                </el-col>
                              </el-row>
                              <!--tree struct-->
                              <el-tree
                                class="filter-tree"
                                :data="tableData"
                                :props="defaultProps"
                                :default-expand-all= isExpand
                                :filter-node-method="filterNode"
                                ref="tree"
                                node-key="organizeId"
                                @node-click="handleCheckChange">
                              </el-tree>
                              <el-form-item style="float: right;position: absolute; bottom: 0px; right: 80px;">
                                <el-button type="primary" @click="chioceParentAsFirst">作为一级组织</el-button>
                              </el-form-item>
                            </div>
                          </template>
                        </vxe-modal>
                      </el-form-item>
                      <el-form-item label="组织名称"  prop="organizeName">
                        <el-input v-model="organizeForm.organizeName" placeholder="请填写组织名称"> </el-input>
                      </el-form-item>
                      <el-form-item label="组织级别" prop="organizeLevel">
                        <el-radio-group v-model="organizeForm.organizeLevel" placeholder="请选择">
                          <el-radio label="2">部门</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="备注信息">
                        <el-input v-model="organizeForm.remark" placeholder="请填写备注信息，选填"> </el-input>
                      </el-form-item>
                      <el-divider></el-divider>
                      <el-form-item style="float: right;position: absolute; bottom: 20px; right: 100px;">
                        <el-button type="primary" @click="add('menuForm')">确定</el-button>
                        <el-button @click="menuAddpage=false">关闭</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </template>
              </vxe-modal>
              <el-button type="primary" icon="el-icon-edit" size="mini" round @click="getTreeRadioEvent" :disabled="disabled">修改</el-button>
              <!--organize edit page-->
              <vxe-modal v-model="menuEditpage"
                         id="198215524654456"
                         title="编辑组织" width="800" height="350"
                         resize remember
                         :esc-closable=true>
                <template v-slot>
                  <!--edit menu form-->
                  <div style="width: 80%;margin: 0 auto;">
                    <el-form  ref="menuForm" :model="organizeEditForm"  :rules="editRules"  label-width="80px" size="small">
                      <el-form-item label="上级组织"  v-show=false>
                        <el-input v-model="organizeEditForm.organizeParent"> </el-input>
                      </el-form-item>
                      <el-form-item label="上级组织" prop="parentName" >
                        <el-input v-model="organizeEditForm.organizeParentName" @click.native="choiceParentOrganize=true" suffix-icon="el-icon-search"></el-input>
                        <!--load menu tree. show into modal-->
                        <vxe-modal v-model="choiceParentOrganize" title="组织选择" width="500" height="400" resize remember>
                          <template v-slot>
                            <!--load menu-->
                            <!--filter menu to search menu-->
                            <div style="width: 98%;margin: 0 auto;">
                              <el-row>
                                <el-col :span="16">
                                  <el-input
                                    placeholder="输入关键字进行过滤"
                                    v-model="filterText">
                                  </el-input>
                                </el-col>
                                <el-col :span="8">
                                  <el-button  @click="handleExpand"> <i class="el-icon-s-fold">折叠</i>  / <i class="el-icon-s-unfold">展开</i></el-button>
                                </el-col>
                              </el-row>
                              <!--tree struct-->
                              <el-tree
                                class="filter-tree"
                                :data="tableData"
                                :props="defaultProps"
                                :default-expand-all= isExpand
                                :filter-node-method="filterNode"
                                ref="tree"
                                node-key="organizeId"
                                @node-click="handleCheckChange">
                              </el-tree>
                              <el-form-item style="float: right;position: absolute; bottom: 0px; right: 80px;">
                                <el-button type="primary" @click="chioceParentAsFirst">作为一级组织</el-button>
                              </el-form-item>
                            </div>
                          </template>
                        </vxe-modal>
                      </el-form-item>
                      <el-form-item label="组织名称"  prop="organizeName">
                        <el-input v-model="organizeEditForm.organizeName" placeholder="请填写组织名称"> </el-input>
                      </el-form-item>
                      <el-form-item label="组织级别" prop="organizeLevel">
                        <el-radio-group v-model="organizeEditForm.organizeLevel" placeholder="请选择">
                          <el-radio label="2">部门</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="备注信息">
                        <el-input v-model="organizeEditForm.remark" placeholder="请填写备注信息，选填"> </el-input>
                      </el-form-item>
                      <el-divider></el-divider>
                      <el-form-item style="float: right;position: absolute; bottom: 20px; right: 100px;">
                        <el-button type="primary" @click="save('menuForm')">确定</el-button>
                        <el-button @click="menuEditpage=false">关闭</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </template>
              </vxe-modal>

              <el-button type="info" icon="el-icon-search" size="mini" round :value=searchStatus @click="openSearchPage">搜索</el-button>
              <el-button type="warning" icon="el-icon-s-fold" size="mini" round :value=treeStatus @click="changeTreeStatus">展开/全部</el-button>
            </template>
          </vxe-toolbar>

          <vxe-table
            resizable
            show-overflow
            export-config
            keep-source
            show-header-overflow
            :radio-config="{labelField: 'asd'}"
            @radio-change="radioChange"
            ref="xTree"
            row-id="id"
            :loading="loading"
            :tree-config="treeConfig"
            :data="tableData" style="width: 98%;margin: 0 auto;">
            <vxe-table-column type="radio" width="60"></vxe-table-column>
            <vxe-table-column field="organizeId" title="组织ID" :visible="false"></vxe-table-column>
            <vxe-table-column field="organizeName" title="组织名称" tree-node></vxe-table-column>
            <vxe-table-column field="organizeLevel" title="组织级别" >
              <template v-slot="{ row }">
                <template v-if="row.organizeLevel == 0">
                  <el-tag>总公司</el-tag>
                </template>
                <template v-else-if="row.organizeLevel == 1">
                  <el-tag type="success">分公司</el-tag>
                </template>
                <template v-else-if="row.organizeLevel == 2">
                  部门
                </template>
              </template>
            </vxe-table-column>
            <vxe-table-column title="操作" width=200px>
              <template v-slot="{ row }" >
                <el-button type="danger" icon="el-icon-delete" size="mini" round @click="del(row.organizeId)">删除</el-button>
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
        data () {
            //菜单名称查重校验
            var checkAddName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('菜单名称不能为空'));
                } else {
                    //axios 请求后端查重接口
                    this.$axios.get('/api/sp/admin/organize/checkAddName/'+value+"/"+this.$data.organizeId) //接口
                        .then(function (response) {
                            //根据返回判断
                            return response.data.data ?  callback() : callback(new Error('菜单名称已存在'));
                        }.bind(this))
                        .catch(function (error) {

                        });
                }
            };
            var checkEditName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('菜单名称不能为空'));
                } else {
                    //axios 请求后端查重接口
                    this.$axios.get('/api/sp/admin/organize/checkEditName/'+value+"/"+this.$data.organizeEditForm.organizeId+"/"+this.$data.organizeId) //接口
                        .then(function (response) {
                            //根据返回判断
                            return response.data.data ?  callback() : callback(new Error('菜单名称已存在'));
                        }.bind(this))
                        .catch(function (error) {

                        });
                }
            };
            return {
                organizeId: '2',//全局组织id
                disabled: true,
                isExpand: true,//element tree 是否默认展开
                defaultProps: { //element tree 默认字段
                    children: 'children',
                    label: 'organizeName'
                },
                choiceParentOrganize: false,
                filterText:'', //过滤树字段
                iconlist: [],
                organizeForm: {
                    organizeId:'',
                    organizeName:'',
                    organizeParentName:'',
                    organizeLevel:'',
                    organizeParent:'',
                    status:'',
                    remark:'',
                },
                organizeEditForm: {
                    organizeId:'',
                    organizeName:'',
                    organizeParentName:'',
                    organizeLevel:'',
                    organizeParent:'',
                    status:'',
                    remark:'',
                },
                rules: {
                    organizeId: [
                        { required: true, message: '请选择上级组织', trigger: 'blur' },
                    ],
                    organizeName: [
                        { required: true, message: '请填写组织名称', trigger: 'blur' },
                        { validator: checkAddName, trigger: "blur" } // 自定义校验
                    ],
                    organizeLevel: [
                        { required: true, message: '请选择组织级别', trigger: 'blur' },
                    ],
                    url: [
                        { required: true, message: '请填写显示请求地址', trigger: 'blur' },
                        { pattern: /^([a-zA-z]:)?(\/[a-zA-Z0-9_-]+)+\/?$/ , message: '请填写正确的请求地址' }
                    ]
                },
                editRules: {
                    organizeId: [
                        { required: true, message: '请选择上级组织', trigger: 'blur' },
                    ],
                    organizeName: [
                        { required: true, message: '请填写组织名称', trigger: 'blur' },
                        { validator: checkEditName, trigger: "blur" } // 自定义校验
                    ],
                    organizeLevel: [
                        { required: true, message: '请选择组织级别', trigger: 'blur' },
                    ],
                    url: [
                        { required: true, message: '请填写显示请求地址', trigger: 'blur' },
                        { pattern: /^([a-zA-z]:)?(\/[a-zA-Z0-9_-]+)+\/?$/ , message: '请填写正确的请求地址' }
                    ]
                },
                dialogVisible: false,
                menuAddpage:false,
                menuEditpage:false,
                value9:false,
                activeseachPage: [],
                searchStatus: true,
                filterName: '',
                originData: [],
                loading: false,
                treeStatus: true,
                tableData: [
                    {
                        id: "10000",
                        parentId: null,
                        name: "vxe-table 从入门到放弃 10000",
                        size: "53k",
                        type: "",
                        subs: [{
                            checked: false,
                            date: "2019-05-21",
                            id: "11000",
                            indeterminate: false,
                            name: "vxe-table 从入门到放弃.avi",
                            parentId: "10000",
                            size: "11k",
                            type: "avi"
                        },{
                            date: "2019-05-21",
                            id: "11000",
                            indeterminate: false,
                            name: "vxe-table 从入门到放弃.avi",
                            parentId: "10000",
                            size: "11k",
                            type: "avi"
                        }]
                    }
                ],
                removeList: [],
                treeConfig: {
                    subs: 'subs',
                    expandAll: true,
                }
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            setorganizeId(){
                let item = localStorage.getItem("spadmininfo");
                this.$data.organizeId = JSON.parse(item).organizeId;
            },
            getData(){
                this.$axios.get('/api/sp/admin/organize/getCurrent/'+this.$data.organizeId)
                    .then(function (response) {
                        this.$data.tableData = response.data;
                        this.$data.originData = response.data;
                    }.bind(this))
                    .catch(function (error) {

                    });
            },
            handleSearch () {
                let filterName = this.$XEUtils.toString(this.filterName).trim()
                if (filterName) {
                    let options = { children: 'children' }
                    let searchProps = ['organizeName']
                    this.$data.tableData = this.$XEUtils.searchTree(this.$data.originData, item => searchProps.some(key => this.$XEUtils.toString(item[key]).indexOf(filterName) > -1), options)
                    // 搜索之后默认展开所有子节点
                    this.$nextTick(() => {
                        this.$refs.xTree.setAllTreeExpand(true)
                    })
                } else {
                    this.$data.tableData = this.$data.originData
                }
            },
            getTreeRadioEvent(){
                if(this.$refs.xTree.getRadioRecord() == null){
                    this.$modal.alert("请重新选择数据！！！！");
                }
                //根据id 获取组织数据
                this.$axios.get('/api/sp/admin/organize/id/'+this.$refs.xTree.getRadioRecord().organizeId)
                    .then(function (response) {
                        this.$data.organizeEditForm = response.data;
                        this.$data.menuEditpage = true;
                    }.bind(this))
                    .catch(function (error) {
                        this.$modal.alert("请检查网络！！！！");
                    }.bind(this));
            },
            radioChange(){
                this.$data.disabled = false;
            },
            loadIcon(){
                this.$data.iconlist = this.$store.getters.getIconList;
            },
            changeTreeStatus(){
                if(this.$data.treeStatus){
                    this.$refs.xTree.setAllTreeExpand(true);
                    this.$data.treeStatus = !this.$data.treeStatus;
                    return;
                }else{
                    this.$refs.xTree.clearTreeExpand();
                    this.$data.treeStatus = !this.$data.treeStatus;
                    return;
                }
            },
            chioceParentAsFirst(){
                this.$data.organizeForm.organizeParentName='一级组织';
                this.$data.organizeForm.organizeParent = this.$data.organizeId;
                this.$data.organizeEditForm.organizeParentName='一级组织';
                this.$data.organizeEditForm.organizeParent = this.$data.organizeId;
                this.$data.choiceParentOrganize= false;

            },
            openSearchPage(){
                if(this.$data.searchStatus){
                    this.$data.activeseachPage =  ['seachPage'];
                    this.$data.searchStatus = !this.$data.searchStatus;
                    return;
                }else{
                    this.$data.activeseachPage =  [];
                    this.$data.searchStatus = !this.$data.searchStatus;
                    return;
                }
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
            add(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/api/sp/admin/organize/insert',
                            this.$data.organizeForm)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'添加组织成功',
                                        });
                                        this.$data.menuAddpage = false;
                                        this.reload();
                                        this.resetForm(formName);
                                    }, 1000);
                                }
                            }.bind(this))
                            .catch(function (error) {});
                    } else {
                        return false;
                    }
                });
            },
            save(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/api/sp/admin/organize/save',
                            this.$data.organizeEditForm)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'修改组织成功',
                                        });
                                        this.$data.menuEditpage = false;
                                        this.reload();
                                        this.resetForm(formName);
                                    }, 1000);
                                }
                            }.bind(this))
                            .catch(function (error) {});
                    } else {
                        return false;
                    }
                });
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
            del(id){
                this.$modal.confirm('确认删除吗？').then(type => {
                    if( type == 'confirm'){
                        this.$axios.get('/api/sp/admin/organize/delete/'+id)
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
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            reload () {
                // 清除所有状态
                this.$refs.xTree.clearAll()
                return this.getData();
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.organizeName.indexOf(value) !== -1;
            },
            handleExpand(){
                this.$data.isExpand = !this.$data.isExpand
                this.expandFunc(this.tableData);
            },
            expandFunc(data) {
                data.forEach(item=> {
                    this.$refs.tree.store.nodesMap[item.organizeId].expanded = this.$data.isExpand
                })
            },
            handleCheckChange(data,checked,node){
                this.$data.organizeForm.organizeParentName = data.organizeName;
                this.$data.organizeForm.organizeParent = data.organizeId;
                this.$data.organizeEditForm.organizeParentName = data.organizeName;
                this.$data.organizeEditForm.organizeParent = data.organizeId;
                this.$data.choiceParentOrganize= false;
            },
            saveEvent () {
                const { insertRecords, updateRecords } = this.$refs.xTree.getRecordset()
                this.$XModal.alert(`insertRecords=${insertRecords.length} updateRecords=${updateRecords.length}`)
            },
            change(){
                this.$axios.get('/api/change')
                    .then(function (response) {
                        alert(response.data)
                    }.bind(this))
                    .catch(function (error) {

                    });
            },
        },
        mounted() {
        },
        created() {
            this.setorganizeId();
            this.getData();
            this.loadIcon();

        }
    }
</script>

<style scoped>
  /deep/ .select-panel .el-select-dropdown__wrap{
    background-color: #FFF7F7 !important;
    float: left !important;
    min-width: 168px !important;
    opacity: 0.618;
    max-height: 200px;
    max-width: 550px;
  }
</style>
