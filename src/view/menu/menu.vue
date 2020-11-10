<template>
    <div>
      <el-row>
        <el-col :span="24"style="margin-top: 20px">
          <el-card style="width: 98%;margin: 0 auto;">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>系统管理</el-breadcrumb-item>
              <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
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
                <vxe-input v-model="filterName" type="type" placeholder="搜索名称" @keyup="handleSearch"/>
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
                <!--add menu modal-->
                <!--it is to set key-id for prevent the moadl from poping -->
                <vxe-modal v-model="menuAddpage"
                           id="198215524654456"
                           title="增加菜单" width="800" height="580"
                           resize remember
                           :esc-closable=true>
                  <template v-slot>
                    <!--add menu form-->
                    <div style="width: 80%;margin: 0 auto;">
                      <el-form  ref="menuForm" :model="menuForm"  :rules="rules"  label-width="80px" size="small">
                        <el-form-item label="父级菜单id"  v-show=false>
                          <el-input v-model="menuForm.parentId"> </el-input>
                        </el-form-item>
                        <el-form-item label="上级菜单" prop="parentName" >
                          <el-input v-model="menuForm.parentName" @click.native="choiceParentMenu=true" suffix-icon="el-icon-search"></el-input>
                            <!--load menu tree. show into modal-->
                          <vxe-modal v-model="choiceParentMenu" title="菜单选择" width="500" height="400" resize remember>
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
                                  node-key="id"
                                  @node-click="handleCheckChange">
                                </el-tree>
                                <el-form-item style="float: right;position: absolute; bottom: 0px; right: 80px;">
                                  <el-button type="primary" @click="choiceParentMenu=false">确定</el-button>
                                </el-form-item>
                              </div>
                            </template>
                          </vxe-modal>
                        </el-form-item>
                        <el-form-item label="菜单类型" prop="type">
                          <el-radio-group v-model="menuForm.type">
                            <el-radio label="0">目录</el-radio>
                            <el-radio label="1">菜单</el-radio>
                            <el-radio label="2">按钮</el-radio>
                          </el-radio-group>
                        </el-form-item>
                        <span v-if="menuForm.type == '0' || menuForm.type == ''">
                        <el-form-item label="菜单名称" prop="name">
                          <el-input v-model="menuForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="菜单描述" prop="description">
                          <el-input v-model="menuForm.description"></el-input>
                        </el-form-item>
                        <el-form-item label="显示排序" prop="orderNum">
                          <el-input v-model.number="menuForm.orderNum"></el-input>
                        </el-form-item>
                        <el-form-item label="选择图标" prop="icon">
                          <el-select v-model="menuForm.icon" filterable placeholder="请选择" style="width: 100%"
                                     popper-class="select-panel"
                                     :popper-append-to-body=false>
                            <el-option
                              style="float: left"
                              v-for="(item,index) in iconlist"
                              :key="index"
                              :value="item.value">
                            <i :class="item.label"></i>
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="菜单状态" prop="status">
                          <el-radio-group v-model="menuForm.status">
                            <el-radio label="1">开启</el-radio>
                            <el-radio label="2">删除</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </span>
                        <span v-if="menuForm.type == '1'">
                        <el-form-item label="菜单名称" prop="name">
                          <el-input v-model="menuForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="菜单描述" prop="description">
                          <el-input v-model="menuForm.description"></el-input>
                        </el-form-item>
                        <el-form-item label="请求地址" prop="url">
                          <el-input v-model="menuForm.url"></el-input>
                        </el-form-item>
                        <el-form-item label="显示排序" prop="orderNum">
                          <el-input v-model.number="menuForm.orderNum"></el-input>
                        </el-form-item>
                        <el-form-item label="选择图标" prop="icon">
                          <el-select v-model="menuForm.icon" filterable placeholder="请选择" style="width: 100%"
                                     popper-class="select-panel"
                                     :popper-append-to-body=false>
                            <el-option
                                      style="float: left"
                                       v-for="(item,index) in iconlist"
                                       :key="index"
                                       :value="item.value">
                            <i :class="item.label"></i>
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="菜单状态" prop="status">
                          <el-radio-group v-model="menuForm.status">
                            <el-radio label="1">开启</el-radio>
                            <el-radio label="2">删除</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </span>
                        <span v-if="menuForm.type == '2'">
                        <el-form-item label="菜单名称" prop="name">
                          <el-input v-model="menuForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="菜单描述" prop="description">
                          <el-input v-model="menuForm.description"></el-input>
                        </el-form-item>
                        <el-form-item label="请求地址" prop="url">
                          <el-input v-model="menuForm.url"></el-input>
                        </el-form-item>
                        <el-form-item label="权限标识" prop="perms">
                          <el-input v-model="menuForm.perms"></el-input>
                        </el-form-item>
                        <el-form-item label="显示排序" prop="orderNum">
                          <el-input v-model.number="menuForm.orderNum"></el-input>
                        </el-form-item>
                        <el-form-item label="菜单状态" prop="status">
                          <el-radio-group v-model="menuForm.status">
                            <el-radio label="1">开启</el-radio>
                            <el-radio label="2">删除</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </span>
                        <el-form-item style="float: right;position: absolute; bottom: 20px; right: 100px;">
                          <el-button type="primary" @click="onSubmit('menuForm')">确定</el-button>
                          <el-button @click="resetForm('menuForm')">重置</el-button>
                          <el-button @click="menuAddpage=false">关闭</el-button>
                        </el-form-item>
                      </el-form>
                    </div>
                  </template>
                </vxe-modal>
                <el-button type="primary" icon="el-icon-edit" size="mini" round @click="getTreeRadioEvent" :disabled="disabled">修改</el-button>
                <!--menu edit page-->
                <vxe-modal v-model="menuEditpage"
                           id="198215524654456"
                           title="编辑菜单" width="800" height="580"
                           resize remember
                           :esc-closable=true>
                  <template v-slot>
                    <!--edit menu form-->
                    <div style="width: 80%;margin: 0 auto;">
                      <el-form  ref="menuForm" :model="menuForm"  :rules="rules"  label-width="80px" size="small">
                        <el-form-item label="父级菜单id"  v-show=false>
                          <el-input v-model="menuForm.parentId"> </el-input>
                        </el-form-item>
                        <el-form-item label="上级菜单" prop="parentName" >
                          <el-input v-model="menuForm.parentName" @click.native="choiceParentMenu=true" suffix-icon="el-icon-search"></el-input>
                          <!--load menu tree. show into modal-->
                          <vxe-modal v-model="choiceParentMenu" title="菜单选择" width="500" height="400" resize remember>
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
                                  node-key="id"
                                  @node-click="handleCheckChange">
                                </el-tree>
                                <el-form-item style="float: right;position: absolute; bottom: 0px; right: 80px;">
                                  <el-button type="primary" @click="choiceParentMenu=false">确定</el-button>
                                </el-form-item>
                              </div>
                            </template>
                          </vxe-modal>
                        </el-form-item>
                        <el-form-item label="菜单类型" prop="type">
                          <el-radio-group v-model="menuForm.type">
                            <el-radio label="0">目录</el-radio>
                            <el-radio label="1">菜单</el-radio>
                            <el-radio label="2">按钮</el-radio>
                          </el-radio-group>
                        </el-form-item>
                        <span v-if="menuForm.type == '0' || menuForm.type == ''">
                        <el-form-item label="菜单名称" prop="name">
                          <el-input v-model="menuForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="菜单描述" prop="description">
                          <el-input v-model="menuForm.description"></el-input>
                        </el-form-item>
                        <el-form-item label="显示排序" prop="orderNum">
                          <el-input v-model.number="menuForm.orderNum"></el-input>
                        </el-form-item>
                        <el-form-item label="选择图标" prop="icon">
                          <el-select v-model="menuForm.icon" filterable placeholder="请选择" style="width: 100%"
                                     popper-class="select-panel"
                                     :popper-append-to-body=false>
                            <el-option
                              style="float: left"
                              v-for="(item,index) in iconlist"
                              :key="index"
                              :value="item.value">
                            <i :class="item.label"></i>
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="菜单状态" prop="status">
                          <el-radio-group v-model="menuForm.status">
                            <el-radio label="1">开启</el-radio>
                            <el-radio label="2">删除</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </span>
                        <span v-if="menuForm.type == '1'">
                        <el-form-item label="菜单名称" prop="name">
                          <el-input v-model="menuForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="菜单描述" prop="description">
                          <el-input v-model="menuForm.description"></el-input>
                        </el-form-item>
                        <el-form-item label="请求地址" prop="url">
                          <el-input v-model="menuForm.url"></el-input>
                        </el-form-item>
                        <el-form-item label="显示排序" prop="orderNum">
                          <el-input v-model.number="menuForm.orderNum"></el-input>
                        </el-form-item>
                        <el-form-item label="选择图标" prop="icon">
                          <el-select v-model="menuForm.icon" filterable placeholder="请选择" style="width: 100%"
                                     popper-class="select-panel"
                                     :popper-append-to-body=false>
                            <el-option
                              style="float: left"
                              v-for="(item,index) in iconlist"
                              :key="index"
                              :value="item.value">
                            <i :class="item.label"></i>
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="菜单状态" prop="status">
                          <el-radio-group v-model="menuForm.status">
                            <el-radio label="1">开启</el-radio>
                            <el-radio label="2">删除</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </span>
                        <span v-if="menuForm.type == '2'">
                        <el-form-item label="菜单名称" prop="name">
                          <el-input v-model="menuForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="菜单描述" prop="description">
                          <el-input v-model="menuForm.description"></el-input>
                        </el-form-item>
                        <el-form-item label="请求地址" prop="url">
                          <el-input v-model="menuForm.url"></el-input>
                        </el-form-item>
                        <el-form-item label="权限标识" prop="perms">
                          <el-input v-model="menuForm.perms"></el-input>
                        </el-form-item>
                        <el-form-item label="显示排序" prop="orderNum">
                          <el-input v-model.number="menuForm.orderNum"></el-input>
                        </el-form-item>
                        <el-form-item label="菜单状态" prop="status">
                          <el-radio-group v-model="menuForm.status">
                            <el-radio label="1">开启</el-radio>
                            <el-radio label="2">删除</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </span>
                        <el-form-item style="float: right;position: absolute; bottom: 20px; right: 100px;">
                          <el-button type="primary" @click="onSubmit('menuForm')">确定</el-button>
                          <el-button @click="resetForm('menuForm')">重置</el-button>
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
              <vxe-table-column field="permissionId" title="权限id" :visible="false"></vxe-table-column>
              <vxe-table-column field="name" title="名称" tree-node>
                <template v-slot="{ row }">
                  <i :class="row.icon">{{ row.name }}</i>
                </template>
              </vxe-table-column>
              <vxe-table-column field="orderNum" title="排序"></vxe-table-column>
              <vxe-table-column field="url" title="请求地址" ></vxe-table-column>
              <vxe-table-column field="type" title="类型" >
                <template v-slot="{ row }">
                  <template v-if="row.type === 0">
                    <el-tag>目录</el-tag>
                  </template>
                  <template v-else-if="row.type === 1">
                    <el-tag type="success">菜单</el-tag>
                  </template>
                  <template v-else-if="row.type === 2">
                    <el-tag type="warning">按钮</el-tag>
                  </template>
                </template>
              </vxe-table-column>
              <vxe-table-column field="status" title="状态" >
                <template v-slot="{ row }">
                  <template>
                    <vxe-switch v-model="row.status" on-label="开启" :on-value="1" off-label="关闭" :off-value="2" @change="HandlerChangeStatus(row)"></vxe-switch>
                  </template>
                </template>
              </vxe-table-column>
              <vxe-table-column field="perms" title="权限标识"></vxe-table-column>
              <vxe-table-column title="操作" width=200px>
                <template v-slot="{ row }" >
                  <el-button type="primary" icon="el-icon-edit" size="mini" round ></el-button>
                  <el-button type="success" icon="el-icon-plus" size="mini" round ></el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" round ></el-button>
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
                        this.$axios.get('/api/permisson/menuBtnlist') //接口
                            .then(function (response) {
                                //根据返回判断
                                return response.data.isLegal ?  callback() : callback(new Error('菜单名称已存在'));
                            }.bind(this))
                            .catch(function (error) {

                            });
                    }
            };
            return {
                disabled: true,
                isExpand: true,//element tree 是否默认展开
                defaultProps: { //element tree 默认字段
                    children: 'children',
                    label: 'name'
                },
                choiceParentMenu: false,
                filterText:'', //过滤树字段
                iconlist: [],
                menuForm: {
                    id:'',
                    permissionId:'',
                    name:'',
                    description:'',
                    url:'',
                    perms:'',
                    parentId:'',
                    parentName:'',
                    type:'',
                    orderNum:'',
                    icon:'',
                    status:'',
                    createTime:'',
                    updateTime:'',
                },
                rules: {
                    parentName: [
                        { required: true, message: '请选择上级菜单', trigger: 'blur' },
                    ],
                    type: [
                        { required: true, message: '请选择菜单类型', trigger: 'blur' },
                    ],
                    name: [
                        { required: true, message: '请填写菜单名称', trigger: 'blur' },
                        { validator: checkAddName, trigger: "blur" } // 自定义校验
                    ],
                    url: [
                        { required: true, message: '请填写显示请求地址', trigger: 'blur' },
                        { pattern: /^([a-zA-z]:)?(\/[a-zA-Z0-9_-]+)+\/?$/ , message: '请填写正确的请求地址' }
                    ],
                    orderNum: [
                        { required: true, message: '请填写显示排序', trigger: 'blur' },
                        { type: 'number', message: '排序必须为数字值'}
                    ],
                    icon: [
                        { required: true, message: '请选择图标', trigger: 'blur' },
                    ],
                    status: [
                        { required: true, message: '请选择菜单状态', trigger: 'blur' },
                    ],
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
                    subs: 'subs'
                }
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            handleSearch () {
                let filterName = this.$XEUtils.toString(this.filterName).trim()
                if (filterName) {
                    let options = { children: 'children' }
                    let searchProps = ['name']
                    this.$data.tableData = this.$XEUtils.searchTree(this.$data.originData, item => searchProps.some(key => this.$XEUtils.toString(item[key]).indexOf(filterName) > -1), options)
                    // 搜索之后默认展开所有子节点
                    this.$nextTick(() => {
                        this.$refs.xTree.setAllTreeExpand(true)
                    })
                } else {
                    this.$data.tableData = this.$data.originData
                }
            },
            HandlerChangeStatus(row){
                //根据id修改状态
                this.$axios.get('/xxx?id='+row.id+"&status="+row.status)
                    .then(function (response) {
                        this.$data.tableData = response.data;
                    }.bind(this))
                    .catch(function (error) {
                        this.$modal.alert("请检查网络！！！！");
                    }.bind(this));
            },
            getTreeRadioEvent(){
                if(this.$refs.xTree.getRadioRecord() == null){
                    this.$modal.alert("请重新选择数据！！！！");
                }
                //根据id 获取菜单数据
                this.$axios.get('/xxx?id='+this.$refs.xTree.getRadioRecord().id)
                    .then(function (response) {
                        this.$data.tableData = response.data;
                    }.bind(this))
                    .catch(function (error) {
                        this.$modal.alert("请检查网络！！！！");
                    }.bind(this));
                //界面赋值
                //打开修改模态框
                this.$data.menuEditpage = true;

            },
            radioChange(){
                this.$data.disabled = false;
            },
            loadIcon(){
                this.$data.iconlist = this.$store.getters.getIconList;
            },
            loadMenu(){
                this.$axios.get('/api/permisson/menuBtnlist')
                    .then(function (response) {
                        this.$data.tableData = response.data;
                        this.$data.originData = response.data;
                    }.bind(this))
                    .catch(function (error) {

                    });
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
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            reload () {
                // 清除所有状态
                this.$refs.xTree.clearAll()
                return this.loadMenu()
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            handleExpand(){
                this.$data.isExpand = !this.$data.isExpand
                this.expandFunc(this.tableData);
            },
            expandFunc(data) {
                data.forEach(item=> {
                    this.$refs.tree.store.nodesMap[item.id].expanded = this.isExpand
                })
            },
            handleCheckChange(data,checked,node){
                this.$data.menuForm.parentName = data.name;
                this.$data.menuForm.parentId = data.parentId;

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
            this.loadMenu();
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
