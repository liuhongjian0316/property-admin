<template>
  <div>
    <el-row>
      <el-col :span="24" style="margin-top: 20px">
        <el-card style="width: 98%;margin: 0 auto;">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: path }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>员工管理</el-breadcrumb-item>
            <el-breadcrumb-item>员工信息</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
      </el-col>
    </el-row>
    <div style="width: 98%;margin: 0 auto;">
      <el-row>
        <el-col :span="6" style="margin-top: 20px">
          <el-card style="width: 98%;margin: 0 auto;">
            <div slot="header" class="clearfix">
              <span>组织信息</span>
            </div>
            <div>
              <el-row>
                <el-col :span="16">
                  <el-input
                    size="mini"
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
                  </el-input>
                </el-col>
                <el-col :span="8">
                  <el-button  size="mini" @click="handleExpand"> <i class="el-icon-s-fold">折叠</i>  / <i class="el-icon-s-unfold">展开</i></el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-tree
                    class="filter-tree"
                    :data="organizeTableData"
                    :props="defaultProps"
                    :default-expand-all= isExpand
                    :filter-node-method="filterNode"
                    ref="tree"
                    node-key="organizeId"
                    @node-click="handleCheckChange22">
                  </el-tree>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :span="18" style="margin-top: 20px">
          <div v-if="employeeType == '维修员'">
            <el-row>
              <!--query postion-->
              <el-card style="width: 98%;margin: 0 auto;">
                <div slot="header" class="clearfix">
                  <span>查询条件</span>
                  <el-button type="success" style="float: right; padding: 10px 0" @click="SETypes">当前：{{employeeType}}</el-button>
                </div>
                <div>
                  <el-row :gutter="70">
                    <el-form  ref="searchForm" :model="searchForm"  label-width="80px" size="small">
                      <el-col :span="5">
                        <el-input placeholder="请输入条件" v-model="searchForm.trems"></el-input>
                      </el-col>
                      <el-col :span="4">
                        <el-button class="el-icon-search" type="success"  size="small" @click="search('searchForm')">搜索</el-button>
                      </el-col>
                    </el-form>
                  </el-row>
                </div>
              </el-card>
            </el-row>
          </div>
          <div v-if="employeeType == '客服'">
            <el-row>
              <!--query postion-->
              <el-card style="width: 98%;margin: 0 auto;">
                <div slot="header" class="clearfix">
                  <span>查询条件</span>
                  <el-button type="success" style="float: right; padding: 10px 0" @click="SETypes">当前：{{employeeType}}</el-button>
                </div>
                <div>
                  <el-row :gutter="70">
                    <el-form  ref="searchForm2" :model="searchForm2"  label-width="80px" size="small">
                      <el-col :span="5">
                        <el-input placeholder="请输入条件" v-model="searchForm2.trems"></el-input>
                      </el-col>
                      <el-col :span="4">
                        <el-button class="el-icon-search" type="success"  size="small" @click="search2('searchForm2')">搜索</el-button>
                      </el-col>
                    </el-form>
                  </el-row>
                </div>
              </el-card>
            </el-row>
          </div>
          <div v-if="employeeType == '其他'">
            <el-row>
              <!--query postion-->
              <el-card style="width: 98%;margin: 0 auto;">
                <div slot="header" class="clearfix">
                  <span>查询条件</span>
                  <el-button type="success" style="float: right; padding: 10px 0" @click="SETypes">当前：{{employeeType}}</el-button>
                </div>
                <div>
                  <el-row :gutter="70">
                    <el-form  ref="searchForm3" :model="searchForm3"  label-width="80px" size="small">
                      <el-col :span="5">
                        <el-input placeholder="请输入条件" v-model="searchForm3.trems"></el-input>
                      </el-col>
                      <el-col :span="4">
                        <el-button class="el-icon-search" type="success"  size="small" @click="search3('searchForm3')">搜索</el-button>
                      </el-col>
                    </el-form>
                  </el-row>
                </div>
              </el-card>
            </el-row>
          </div>

          <!--table postion-->
          <div v-show="employeeType == '维修员'">
            <el-row>
              <el-col :span="24">
                <el-col :span="24"style="margin-top: 20px">
                  <el-card style="width: 98%;margin: 0 auto;">
                    <vxe-toolbar :refresh="{query: reload}" import export print custom>
                      <template v-slot:buttons>
                        <el-button type="primary" class="el-icon-plus" size="mini" @click="addPage=true">添加维修员</el-button>
                        <!--add worker-->
                        <vxe-modal v-model="addPage"
                                   id="1319239482016403459"
                                   title="增加维修员" width="800" height="750"
                                   resize remember
                                   :esc-closable=true>
                          <template v-slot>
                            <!--add form-->
                            <div style="width: 90%;margin: 0 auto;">
                              <el-form  ref="roleForm" :model="roleForm"  :rules="rules"  label-width="80px" size="small">
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="真实姓名" prop="realName">
                                      <el-input v-model="roleForm.realName" placeholder="请输入真实姓名"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="性别" prop="sex">
                                      <el-select v-model="roleForm.sex" placeholder="请选择" style="width: 100%">
                                        <el-option label="请选择" value=""></el-option>
                                        <el-option label="男" value="0"></el-option>
                                        <el-option label="女" value="1"></el-option>
                                      </el-select>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="年龄" prop="age">
                                      <el-input v-model="roleForm.age" placeholder="请输入维修员年龄"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="联系电话" prop="tel">
                                      <el-input v-model="roleForm.tel" placeholder="请输入维修员联系电话"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="身份证号" prop="card">
                                      <el-input v-model="roleForm.card" placeholder="请输入维修员身份证号"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="选择地址" prop="cityCode">
                                      <el-cascader
                                        placeholder="请选择"
                                        style="width: 100%"
                                        size="mini"
                                        :options="options"
                                        v-model="roleForm.cityCode"
                                        @change="addressChange">
                                      </el-cascader>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-form-item label="详细地址" prop="address">
                                  <el-input v-model="roleForm.address" placeholder="请输入详细地址"> </el-input>
                                </el-form-item>
                                <el-form-item label="工种">
                                  <div>
                                    <el-transfer
                                      :titles="['待选工种', '已选工种']"
                                      v-model="transferWorkerTypeChoiceData"
                                      :props="{
                                      key: 'repairWorkerTypeId',
                                      label: 'repairWorkerTypeName'
                                      }"
                                      :data="transferWorkerTypedata"
                                      @change="handleChange">
                                    </el-transfer>
                                  </div>
                                </el-form-item>
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="上级组织"  v-show=false>
                                      <el-input v-model="roleForm.organizeId"> </el-input>
                                    </el-form-item>
                                    <el-form-item label="组织" prop="organizeName">
                                      <el-input v-model="roleForm.organizeName"
                                                @click.native="choiceOrganize=true"
                                                suffix-icon="el-icon-search"></el-input>
                                      <vxe-modal v-model="choiceOrganize" title="组织选择" width="500" height="400" resize remember>
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
                                              :data="organizeTableData"
                                              :props="defaultProps"
                                              :default-expand-all= isExpand
                                              :filter-node-method="filterNode"
                                              ref="tree"
                                              node-key="organizeId"
                                              @node-click="handleAddWorkerOrganize">
                                            </el-tree>
                                          </div>
                                        </template>
                                      </vxe-modal>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="角色" prop="roleId">
                                      <el-select v-model="roleForm.roleId" placeholder="请选择" style="width: 100%">
                                        <el-option label="请选择" value=""></el-option>
                                        <el-option label="商户物业维修员" value="4"></el-option>
                                      </el-select>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-form-item label="备注信息">
                                  <el-input v-model="roleForm.remark" placeholder="请输入备注信息，可不填"></el-input>
                                </el-form-item>
                                <el-divider></el-divider>
                                <el-form-item style="float: right;position: absolute; bottom: 20px; right: 50px;">
                                  <el-button type="primary" @click="addWorker('roleForm')">确定</el-button>
                                  <el-button @click="addPage=false">关闭</el-button>
                                </el-form-item>
                              </el-form>
                            </div>
                          </template>
                        </vxe-modal>
                        <!--edit worker-->
                        <vxe-modal v-model="editPage"
                                   id="1319239482016403429"
                                   title="编辑维修员" width="800" height="750"
                                   resize remember
                                   :esc-closable=true>
                          <template v-slot>
                            <!--edit form-->
                            <div style="width: 90%;margin: 0 auto;">
                              <el-form  ref="editRoleForm" :model="editRoleForm"  :rules="editRules"  label-width="80px" size="small">
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="真实姓名" prop="realName">
                                      <el-input v-model="editRoleForm.realName" placeholder="请输入真实姓名"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="性别" prop="sex">
                                      <el-select v-model="editRoleForm.sex" placeholder="请选择" style="width: 100%">
                                        <el-option label="请选择" value=""></el-option>
                                        <el-option label="男" value="0"></el-option>
                                        <el-option label="女" value="1"></el-option>
                                      </el-select>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="年龄" prop="age">
                                      <el-input v-model="editRoleForm.age" placeholder="请输入维修员年龄"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="联系电话" prop="tel">
                                      <el-input v-model="editRoleForm.tel" placeholder="请输入维修员联系电话"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="身份证号" prop="card">
                                      <el-input v-model="editRoleForm.card" placeholder="请输入维修员身份证号"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="选择地址" prop="cityCode">
                                      <el-cascader
                                        placeholder="请选择"
                                        style="width: 100%"
                                        size="mini"
                                        :options="options"
                                        v-model="editRoleForm.cityCode"
                                        @change="addressChange">
                                      </el-cascader>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-form-item label="详细地址" prop="address">
                                  <el-input v-model="editRoleForm.address" placeholder="请输入详细地址"> </el-input>
                                </el-form-item>
                                <el-form-item label="工种">
                                  <div>
                                    <el-transfer
                                      :titles="['待选工种', '已选工种']"
                                      v-model="transferWorkerTypeChoiceData"
                                      :props="{
                                      key: 'repairWorkerTypeId',
                                      label: 'repairWorkerTypeName'
                                      }"
                                      :data="transferWorkerTypedata"
                                      @change="handleChange">
                                    </el-transfer>
                                  </div>
                                </el-form-item>
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="上级组织"  v-show=false>
                                      <el-input v-model="editRoleForm.organizeId"> </el-input>
                                    </el-form-item>
                                    <el-form-item label="组织" prop="organizeName">
                                      <el-input v-model="editRoleForm.organizeName"
                                                @click.native="choiceOrganize=true"
                                                suffix-icon="el-icon-search"></el-input>
                                      <vxe-modal v-model="choiceOrganize" title="组织选择" width="500" height="400" resize remember>
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
                                              :data="organizeTableData"
                                              :props="defaultProps"
                                              :default-expand-all= isExpand
                                              :filter-node-method="filterNode"
                                              ref="tree"
                                              node-key="organizeId"
                                              @node-click="handleAddWorkerOrganize2">
                                            </el-tree>
                                          </div>
                                        </template>
                                      </vxe-modal>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="角色" prop="roleId">
                                      <el-select v-model="editRoleForm.roleId" placeholder="请选择" style="width: 100%">
                                        <el-option label="请选择" value=""></el-option>
                                        <el-option label="商户物业维修员" value="4"></el-option>
                                      </el-select>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-form-item label="备注信息">
                                  <el-input v-model="editRoleForm.remark" placeholder="请输入备注信息，可不填"></el-input>
                                </el-form-item>
                                <el-divider></el-divider>
                                <el-form-item style="float: right;position: absolute; bottom: 20px; right: 50px;">
                                  <el-button type="primary" @click="saveWorker('editRoleForm')">确定</el-button>
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
                      :column-key=true
                      :row-key=true
                      ref="xTable"
                      :data="tableData"
                      export-config
                      import-config>
                      <vxe-table-column field="repair_worker_id" title="维修员ID"></vxe-table-column>
                      <vxe-table-column field="real_name" title="真实姓名"></vxe-table-column>
                      <vxe-table-column field="repair_worker_type_name" title="工种">
                        <template v-slot="{ row }">
                        <span style="color: red;">
                          {{row.repair_worker_type_name}}
                        </span>
                        </template>
                      </vxe-table-column>
                      <vxe-table-column field="name" title="角色"></vxe-table-column>
                      <vxe-table-column field="sex" title="性别">
                        <template v-slot="{ row }">
                          <span v-if="row.sex == 0">男</span>
                          <span v-if="row.sex == 1">女</span>
                        </template>
                      </vxe-table-column>
                      <vxe-table-column field="age" title="年龄"></vxe-table-column>
                      <vxe-table-column field="tel" title="手机号"></vxe-table-column>
                      <vxe-table-column field="address" title="地址"></vxe-table-column>
                      <vxe-table-column field="organize_name" title="组织"></vxe-table-column>
                      <vxe-table-column title="操作">
                        <template v-slot="{ row }">
                          <el-row>
                            <el-col :span="24"><vxe-button size="mini" content="修改" @click="edit(row.repair_worker_id)"></vxe-button></el-col>
                            <el-col :span="24"><vxe-button size="mini" content="重置密码" @click="resetWorkerPwd(row.repair_worker_id)"></vxe-button></el-col>
                            <el-col :span="24"><vxe-button size="mini" content="删除" @click="delWorker(row.repair_worker_id)"></vxe-button></el-col>
                          </el-row>
                        </template>
                      </vxe-table-column>
                    </vxe-table>

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

          <!--service page-->
          <div v-show="employeeType == '客服'">
            <el-row>
              <el-col :span="24">
                <el-col :span="24"style="margin-top: 20px">
                  <el-card style="width: 98%;margin: 0 auto;">
                    <vxe-toolbar :refresh="{query: reload2}" import export print custom>
                      <template v-slot:buttons>
                        <el-button type="primary" class="el-icon-plus" size="mini" @click="addServicePage=true">添加客服</el-button>
                        <!--add service-->
                        <vxe-modal v-model="addServicePage"
                                   id="13192394820236403459"
                                   title="增加客服" width="800" height="450"
                                   resize remember
                                   :esc-closable=true>
                          <template v-slot>
                            <!--add form-->
                            <div style="width: 90%;margin: 0 auto;">
                              <el-form  ref="serviceForm" :model="serviceForm"  :rules="serviceRules"  label-width="80px" size="small">
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="客服名称" prop="customerServiceName">
                                      <el-input v-model="serviceForm.customerServiceName" placeholder="请输入客服名称"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="真实姓名" prop="realName">
                                      <el-input v-model="serviceForm.realName" placeholder="请输入真实姓名"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="性别" prop="sex">
                                      <el-select v-model="serviceForm.sex" placeholder="请选择" style="width: 100%">
                                        <el-option label="请选择" value=""></el-option>
                                        <el-option label="男" value="0"></el-option>
                                        <el-option label="女" value="1"></el-option>
                                      </el-select>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="联系电话" prop="tel">
                                      <el-input v-model="serviceForm.tel" placeholder="请输入维修员联系电话"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="选择地址" prop="cityCode">
                                      <el-cascader
                                        placeholder="请选择"
                                        style="width: 100%"
                                        size="mini"
                                        :options="options"
                                        v-model="serviceForm.cityCode"
                                        @change="addressChange">
                                      </el-cascader>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="详细地址" prop="address">
                                      <el-input v-model="serviceForm.address" placeholder="请输入详细地址"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="上级组织"  v-show=false>
                                      <el-input v-model="serviceForm.organizeId"> </el-input>
                                    </el-form-item>
                                    <el-form-item label="组织" prop="organizeName">
                                      <el-input v-model="serviceForm.organizeName"
                                                @click.native="choiceOrganize=true"
                                                suffix-icon="el-icon-search"></el-input>
                                      <vxe-modal v-model="choiceOrganize" title="组织选择" width="500" height="400" resize remember>
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
                                              :data="organizeTableData"
                                              :props="defaultProps"
                                              :default-expand-all= isExpand
                                              :filter-node-method="filterNode"
                                              ref="tree"
                                              node-key="organizeId"
                                              @node-click="handleAddWorkerOrganize3">
                                            </el-tree>
                                          </div>
                                        </template>
                                      </vxe-modal>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="角色" prop="roleId">
                                      <el-select v-model="serviceForm.roleId" placeholder="请选择" style="width: 100%">
                                        <el-option label="请选择" value=""></el-option>
                                        <el-option label="商户物业客服" value="5"></el-option>
                                      </el-select>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-form-item label="备注信息">
                                  <el-input type="textarea" :autosize="{minRows:4,maxRows:4}" v-model="serviceForm.remark" placeholder="请输入备注信息，可不填"></el-input>
                                </el-form-item>
                                <el-divider></el-divider>
                                <el-form-item style="float: right;position: absolute; bottom: 20px; right: 50px;">
                                  <el-button type="primary" @click="addService('serviceForm')">确定</el-button>
                                  <el-button @click="addServicePage=false">关闭</el-button>
                                </el-form-item>
                              </el-form>
                            </div>
                          </template>
                        </vxe-modal>
                        <!--edit service-->
                        <vxe-modal v-model="editServicePage"
                                   id="13192394820236403459"
                                   title="编辑客服" width="800" height="450"
                                   resize remember
                                   :esc-closable=true>
                          <template v-slot>
                            <!--edit form-->
                            <div style="width: 90%;margin: 0 auto;">
                              <el-form  ref="editServiceForm" :model="editServiceForm"  :rules="editServiceRules"  label-width="80px" size="small">
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="客服名称" prop="customerServiceName">
                                      <el-input v-model="editServiceForm.customerServiceName" placeholder="请输入客服名称"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="真实姓名" prop="realName">
                                      <el-input v-model="editServiceForm.realName" placeholder="请输入真实姓名"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="性别" prop="sex">
                                      <el-select v-model="editServiceForm.sex" placeholder="请选择" style="width: 100%">
                                        <el-option label="请选择" value=""></el-option>
                                        <el-option label="男" value="0"></el-option>
                                        <el-option label="女" value="1"></el-option>
                                      </el-select>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="联系电话" prop="tel">
                                      <el-input v-model="editServiceForm.tel" placeholder="请输入维修员联系电话"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="选择地址" prop="cityCode">
                                      <el-cascader
                                        placeholder="请选择"
                                        style="width: 100%"
                                        size="mini"
                                        :options="options"
                                        v-model="editServiceForm.cityCode"
                                        @change="addressChange">
                                      </el-cascader>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="详细地址" prop="address">
                                      <el-input v-model="editServiceForm.address" placeholder="请输入详细地址"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="上级组织"  v-show=false>
                                      <el-input v-model="editServiceForm.organizeId"> </el-input>
                                    </el-form-item>
                                    <el-form-item label="组织" prop="organizeName">
                                      <el-input v-model="editServiceForm.organizeName"
                                                @click.native="choiceOrganize=true"
                                                suffix-icon="el-icon-search"></el-input>
                                      <vxe-modal v-model="choiceOrganize" title="组织选择" width="500" height="400" resize remember>
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
                                              :data="organizeTableData"
                                              :props="defaultProps"
                                              :default-expand-all= isExpand
                                              :filter-node-method="filterNode"
                                              ref="tree"
                                              node-key="organizeId"
                                              @node-click="handleAddWorkerOrganize4">
                                            </el-tree>
                                          </div>
                                        </template>
                                      </vxe-modal>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="角色" prop="roleId">
                                      <el-select v-model="editServiceForm.roleId" placeholder="请选择" style="width: 100%">
                                        <el-option label="请选择" value=""></el-option>
                                        <el-option label="商户物业客服" value="5"></el-option>
                                      </el-select>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-form-item label="备注信息">
                                  <el-input type="textarea" :autosize="{minRows:4,maxRows:4}" v-model="editServiceForm.remark" placeholder="请输入备注信息，可不填"></el-input>
                                </el-form-item>
                                <el-divider></el-divider>
                                <el-form-item style="float: right;position: absolute; bottom: 20px; right: 50px;">
                                  <el-button type="primary" @click="saveService('editServiceForm')">确定</el-button>
                                  <el-button @click="editServicePage=false">关闭</el-button>
                                </el-form-item>
                              </el-form>
                            </div>
                          </template>
                        </vxe-modal>

                      </template>
                    </vxe-toolbar>

                    <vxe-table
                      border
                      :column-key=true
                      :row-key=true
                      ref="xServiceTable"
                      :data="serviceTableData"
                      export-config
                      import-config>
                      <vxe-table-column field="customer_service_id" title="客服ID" ></vxe-table-column>
                      <vxe-table-column field="customer_service_name" title="客服名称"></vxe-table-column>
                      <vxe-table-column field="real_name" title="姓名"></vxe-table-column>
                      <vxe-table-column field="sex" title="性别">
                        <template v-slot="{ row }">
                          <span v-if="row.sex == 0">男</span>
                          <span v-if="row.sex == 1">女</span>
                        </template>
                      </vxe-table-column>
                      <vxe-table-column field="tel" title="手机号"></vxe-table-column>
                      <vxe-table-column field="organize_name" title="组织"></vxe-table-column>
                      <vxe-table-column field="state" title="在线状态">
                        <template v-slot="{ row }">
                          <span v-if="row.state == 0"><el-tag type="danger">离线</el-tag></span>
                          <span v-if="row.state == 1"><el-tag type="success">在线</el-tag></span>
                        </template>
                      </vxe-table-column>
                      <vxe-table-column title="操作">
                        <template v-slot="{ row }">
                          <el-row>
                            <el-col :span="24"><vxe-button size="mini" content="修改" @click="editService(row.customer_service_id)"></vxe-button></el-col>
                            <el-col :span="24"><vxe-button size="mini" content="重置密码" @click="resetServicePwd(row.customer_service_id)"></vxe-button></el-col>
                            <el-col :span="24"><vxe-button size="mini" content="删除" @click="delService(row.customer_service_id)"></vxe-button></el-col>
                          </el-row>
                        </template>
                      </vxe-table-column>
                    </vxe-table>
                    <!--分页-->
                    <el-pagination
                      @current-change="handleCurrentChange2"
                      :current-page=currentPage2
                      :page-size=pageSize2
                      layout="total, prev, pager, next, jumper"
                      :total=total2>
                    </el-pagination>
                  </el-card>
                </el-col>
              </el-col>
            </el-row>
          </div>

          <!--employees page-->
          <div v-show="employeeType == '其他'">
            <el-row>
              <el-col :span="24">
                <el-col :span="24"style="margin-top: 20px">
                  <el-card style="width: 98%;margin: 0 auto;">
                    <vxe-toolbar :refresh="{query: reload3}" import export print custom>
                      <template v-slot:buttons>
                        <el-button type="primary" class="el-icon-plus" size="mini" @click="addEmployeePage=true">添加员工</el-button>
                        <!--add employees-->
                        <vxe-modal v-model="addEmployeePage"
                                   id="13192394820256403459"
                                   title="增加员工" width="800" height="450"
                                   resize remember
                                   :esc-closable=true>
                          <template v-slot>
                            <!--add form-->
                            <div style="width: 90%;margin: 0 auto;">
                              <el-form  ref="employeeForm" :model="employeeForm"  :rules="employeeRules"  label-width="80px" size="small">
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="真实姓名" prop="realName">
                                      <el-input v-model="employeeForm.realName" placeholder="请输入真实姓名"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="年龄" prop="age">
                                      <el-input v-model="employeeForm.age" placeholder="请输入年龄，单位：岁"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="性别" prop="sex">
                                      <el-select v-model="employeeForm.sex" placeholder="请选择" style="width: 100%">
                                        <el-option label="请选择" value=""></el-option>
                                        <el-option label="男" value="0"></el-option>
                                        <el-option label="女" value="1"></el-option>
                                      </el-select>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="联系电话" prop="tel">
                                      <el-input v-model="employeeForm.tel" placeholder="请输入联系电话"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="选择地址" prop="cityCode">
                                      <el-cascader
                                        placeholder="请选择"
                                        style="width: 100%"
                                        size="mini"
                                        :options="options"
                                        v-model="employeeForm.cityCode"
                                        @change="addressChange">
                                      </el-cascader>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="详细地址" prop="address">
                                      <el-input v-model="employeeForm.address" placeholder="请输入详细地址"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="上级组织"  v-show=false>
                                      <el-input v-model="employeeForm.organizeId"> </el-input>
                                    </el-form-item>
                                    <el-form-item label="组织" prop="organizeName">
                                      <el-input v-model="employeeForm.organizeName"
                                                @click.native="choiceOrganize=true"
                                                suffix-icon="el-icon-search"></el-input>
                                      <vxe-modal v-model="choiceOrganize" title="组织选择" width="500" height="400" resize remember>
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
                                              :data="organizeTableData"
                                              :props="defaultProps"
                                              :default-expand-all= isExpand
                                              :filter-node-method="filterNode"
                                              ref="tree"
                                              node-key="organizeId"
                                              @node-click="handleAddWorkerOrganize5">
                                            </el-tree>
                                          </div>
                                        </template>
                                      </vxe-modal>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="角色" prop="roleId">
                                      <el-select v-model="employeeForm.roleId" placeholder="请选择" style="width: 100%">
                                        <el-option label="请选择" value=""></el-option>
                                        <el-option label="商户物业员工" value="6"></el-option>
                                      </el-select>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-form-item label="备注信息">
                                  <el-input type="textarea" :autosize="{minRows:4,maxRows:4}" v-model="employeeForm.remark" placeholder="请输入备注信息，可不填"></el-input>
                                </el-form-item>
                                <el-divider></el-divider>
                                <el-form-item style="float: right;position: absolute; bottom: 20px; right: 50px;">
                                  <el-button type="primary" @click="addEmployee('employeeForm')">确定</el-button>
                                  <el-button @click="addEmployeePage=false">关闭</el-button>
                                </el-form-item>
                              </el-form>
                            </div>
                          </template>
                        </vxe-modal>
                        <!--edit employee-->
                        <vxe-modal v-model="editEmployeePage"
                                   id="13192394820256403459"
                                   title="编辑员工" width="800" height="450"
                                   resize remember
                                   :esc-closable=true>
                          <template v-slot>
                            <!--add form-->
                            <div style="width: 90%;margin: 0 auto;">
                              <el-form  ref="editEmployeeForm" :model="editEmployeeForm"  :rules="editEmployeeRules"  label-width="80px" size="small">
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="真实姓名" prop="realName">
                                      <el-input v-model="editEmployeeForm.realName" placeholder="请输入真实姓名"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="年龄" prop="age">
                                      <el-input v-model="editEmployeeForm.age" placeholder="请输入年龄，单位：岁"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="性别" prop="sex">
                                      <el-select v-model="editEmployeeForm.sex" placeholder="请选择" style="width: 100%">
                                        <el-option label="请选择" value=""></el-option>
                                        <el-option label="男" value="0"></el-option>
                                        <el-option label="女" value="1"></el-option>
                                      </el-select>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="联系电话" prop="tel">
                                      <el-input v-model="editEmployeeForm.tel" placeholder="请输入联系电话"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="选择地址" prop="cityCode">
                                      <el-cascader
                                        placeholder="请选择"
                                        style="width: 100%"
                                        size="mini"
                                        :options="options"
                                        v-model="editEmployeeForm.cityCode"
                                        @change="addressChange">
                                      </el-cascader>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="详细地址" prop="address">
                                      <el-input v-model="editEmployeeForm.address" placeholder="请输入详细地址"> </el-input>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="12">
                                    <el-form-item label="上级组织"  v-show=false>
                                      <el-input v-model="editEmployeeForm.organizeId"> </el-input>
                                    </el-form-item>
                                    <el-form-item label="组织" prop="organizeName">
                                      <el-input v-model="editEmployeeForm.organizeName"
                                                @click.native="choiceOrganize=true"
                                                suffix-icon="el-icon-search"></el-input>
                                      <vxe-modal v-model="choiceOrganize" title="组织选择" width="500" height="400" resize remember>
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
                                              :data="organizeTableData"
                                              :props="defaultProps"
                                              :default-expand-all= isExpand
                                              :filter-node-method="filterNode"
                                              ref="tree"
                                              node-key="organizeId"
                                              @node-click="handleAddWorkerOrganize6">
                                            </el-tree>
                                          </div>
                                        </template>
                                      </vxe-modal>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-form-item label="角色" prop="roleId">
                                      <el-select v-model="editEmployeeForm.roleId" placeholder="请选择" style="width: 100%">
                                        <el-option label="请选择" value=""></el-option>
                                        <el-option label="商户物业员工" value="6"></el-option>
                                      </el-select>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-form-item label="备注信息">
                                  <el-input type="textarea" :autosize="{minRows:4,maxRows:4}" v-model="editEmployeeForm.remark" placeholder="请输入备注信息，可不填"></el-input>
                                </el-form-item>
                                <el-divider></el-divider>
                                <el-form-item style="float: right;position: absolute; bottom: 20px; right: 50px;">
                                  <el-button type="primary" @click="saveEmployee('editEmployeeForm')">确定</el-button>
                                  <el-button @click="editEmployeePage=false">关闭</el-button>
                                </el-form-item>
                              </el-form>
                            </div>
                          </template>
                        </vxe-modal>
                      </template>
                    </vxe-toolbar>

                    <vxe-table
                      border
                      :column-key=true
                      :row-key=true
                      ref="xEmployeeTable"
                      :data="employeeTableData"
                      export-config
                      import-config>
                      <vxe-table-column field="employee_id" title="员工ID" ></vxe-table-column>
                      <vxe-table-column field="real_name" title="姓名"></vxe-table-column>
                      <vxe-table-column field="sex" title="性别">
                        <template v-slot="{ row }">
                          <span v-if="row.sex == 0">男</span>
                          <span v-if="row.sex == 1">女</span>
                        </template>
                      </vxe-table-column>
                      <vxe-table-column field="tel" title="手机号"></vxe-table-column>
                      <vxe-table-column field="organize_name" title="组织"></vxe-table-column>
                      <vxe-table-column title="操作">
                        <template v-slot="{ row }">
                          <el-row>
                            <el-col :span="24"><vxe-button size="mini" content="修改" @click="editEmployee(row.employee_id)"></vxe-button></el-col>
                            <el-col :span="24"><vxe-button size="mini" content="重置密码" @click="resetEmployeePwd(row.employee_id)"></vxe-button></el-col>
                            <el-col :span="24"><vxe-button size="mini" content="删除" @click="delEmployee(row.employee_id)"></vxe-button></el-col>
                          </el-row>
                        </template>
                      </vxe-table-column>
                    </vxe-table>
                    <!--分页-->
                    <el-pagination
                      @current-change="handleCurrentChange3"
                      :current-page=currentPage3
                      :page-size=pageSize3
                      layout="total, prev, pager, next, jumper"
                      :total=total3>
                    </el-pagination>
                  </el-card>
                </el-col>
              </el-col>
            </el-row>
          </div>


        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
    import { regionData,CodeToText } from 'element-china-area-data'
    export default {
        name: "worker",
        data(){
            var requiredOrganizeName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择组织名称'));
                }else if(typeof(value) == 'undefined'){
                    return callback();
                }
                return callback();
            };
            var requiredOrganizeName2 = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择组织名称'));
                }else if(typeof(value) == 'undefined'){
                    return callback();
                }
                return callback();
            };
            var requiredOrganizeName3 = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择组织名称'));
                }else if(typeof(value) == 'undefined'){
                    return callback();
                }
                return callback();
            };
            //添加维修员手机号查重
            var checkAddWorkerTel = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机号不能为空'));
                } else {
                    //axios 请求后端查重接口
                    this.$axios.get('/api/sp/admin/worker/checkTel/'+value) //接口
                        .then(function (response) {
                            //根据返回判断
                            return response.data ?  callback() : callback(new Error('该手机号已被注册'));
                        }.bind(this))
                        .catch(function (error) {

                        });
                }
            };
            //添加维修员身份证号查重
            var checkAddWorkerCard = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('身份证号不能为空'));
                } else {
                    //axios 请求后端查重接口
                    this.$axios.get('/api/sp/admin/worker/checkCard/'+value) //接口
                        .then(function (response) {
                            //根据返回判断
                            return response.data ?  callback() : callback(new Error('该身份证号已被注册'));
                        }.bind(this))
                        .catch(function (error) {

                        });
                }
            };
            //修改维修员手机号查重
            var checkEditWorkerTel = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机号不能为空'));
                } else {
                    //axios 请求后端查重接口
                    this.$axios.get('/api/sp/admin/worker/checkEditTel/'+value+"/"+this.$data.editRoleForm.repairWorkerId) //接口
                        .then(function (response) {
                            //根据返回判断
                            return response.data ?  callback() : callback(new Error('该手机号已被注册'));
                        }.bind(this))
                        .catch(function (error) {

                        });
                }
            };
            //修改维修员身份证号查重
            var checkEditWorkerCard = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('身份证号不能为空'));
                } else {
                    //axios 请求后端查重接口
                    this.$axios.get('/api/sp/admin/worker/checkEditCard/'+value+"/"+this.$data.editRoleForm.repairWorkerId) //接口
                        .then(function (response) {
                            //根据返回判断
                            return response.data ?  callback() : callback(new Error('该手机号号已被注册'));
                        }.bind(this))
                        .catch(function (error) {});
                }
            };
            //添加客服手机号查重
            var checkAddServiceTel = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机好号不能为空'));
                } else {
                    //axios 请求后端查重接口
                    this.$axios.get('/api/sp/admin/service/checkAddTel/'+value) //接口
                        .then(function (response) {
                            //根据返回判断
                            return response.data ?  callback() : callback(new Error('该手机号已被注册'));
                        }.bind(this))
                        .catch(function (error) {});
                }
            };
            //编辑客服手机号查重
            var checkEditServiceTel = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机好号不能为空'));
                } else {
                    //axios 请求后端查重接口
                    this.$axios.get('/api/sp/admin/service/checkEditTel/'+value+"/"+this.$data.editServiceForm.customerServiceId) //接口
                        .then(function (response) {
                            //根据返回判断
                            return response.data ?  callback() : callback(new Error('该手机号已被注册'));
                        }.bind(this))
                        .catch(function (error) {});
                }
            };
            var checkAddEmployeeTel = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机好号不能为空'));
                } else {
                    //axios 请求后端查重接口
                    this.$axios.get('/api/sp/admin/employee/checkAddTel/'+value) //接口
                        .then(function (response) {
                            //根据返回判断
                            return response.data ?  callback() : callback(new Error('该手机号已被注册'));
                        }.bind(this))
                        .catch(function (error) {});
                }
            };
            var checkEditEmployeeTel = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机好号不能为空'));
                } else {
                    //axios 请求后端查重接口
                    this.$axios.get('/api/sp/admin/employee/checkEditTel/'+value+"/"+this.$data.editEmployeeForm.employeeId) //接口
                        .then(function (response) {
                            //根据返回判断
                            return response.data ?  callback() : callback(new Error('该手机号已被注册'));
                        }.bind(this))
                        .catch(function (error) {});
                }
            };
            return{
                //穿梭狂
                transferWorkerTypedata: [], //左边
                transferWorkerTypeChoiceData: [], //右边
                transferIsValidate:false, //穿梭狂验证状态
                //添加维修员 选择部门模态框
                choiceOrganize: false,
                path:'\/index',
                organizeId:'2', //全局组织id
                defaultProps: { //element tree 默认字段
                    children: 'children',
                    label: 'organizeName'
                },
                employeeType:'维修员',
                isExpand:true,
                filterText:'', //过滤树字段
                cityCode:[],//城市编码
                address:'',//临时地址
                options: regionData,
                currentPage: 1,
                pageSize:10,
                total: 100,
                currentPage2: 1,
                pageSize2:10,
                total2: 100,
                currentPage3: 1,
                pageSize3:10,
                total3: 100,
                tableData: [],//维修员表格
                serviceTableData: [],//客服表格
                employeeTableData: [],//员工表格
                organizeTableData: [],
                originData:[],
                editData:{},
                addPage: false,
                editPage: false,
                addServicePage: false,
                editServicePage: false,
                addEmployeePage: false,
                editEmployeePage: false,
                searchForm:{
                    trems:''
                },
                searchForm2:{
                    trems:''
                },
                searchForm3:{
                    trems:''
                },
                employeeForm:{
                    cityCode:[],
                    employeeId:'',
                    sex:'',
                    age:'',
                    tel:'',
                    address:'',
                    remark:'',
                    organizeId:'',
                    organizeName:'',
                    roleId:'',
                },
                editEmployeeForm:{
                    cityCode:[],
                    employeeId:'',
                    sex:'',
                    age:'',
                    tel:'',
                    address:'',
                    remark:'',
                    organizeId:'',
                    organizeName:'',
                    roleId:'',
                },
                editEmployeeRules:{
                    realName: [
                        { required: true, message: '请填写真实姓名', trigger: 'blur' },
                    ],
                    sex: [
                        { required: true, message: '请选择', trigger: 'blur' },
                    ],
                    age: [
                        { required: true, message: '请填写年龄，单位：岁', trigger: 'blur' },
                        { pattern: /^(?:[1-9][0-9]?|1[01][0-9]|120)$/, message: '请输入合法年龄'}
                    ],
                    tel: [
                        { required: true, message: '请填写手机号', trigger: 'blur' },
                        { pattern: /^1[3|4|5|7|8][0-9]{9}$/ , message: '请填写合法手机号' },
                        { validator: checkEditEmployeeTel, trigger: "blur" } // 自定义校验(手机号)
                    ],
                    cityCode: [
                        { required: true, message: '请选择', trigger: 'blur' },
                    ],
                    address: [
                        { required: true, message: '请填写详细地址', trigger: 'blur' },
                    ],
                    organizeName: [
                        { validator: requiredOrganizeName, trigger: "blur" } // 自定义校验
                    ],
                    roleId: [
                        { required: true, message: '请选择角色', trigger: 'blur' },
                    ],
                },
                employeeRules:{
                    realName: [
                        { required: true, message: '请填写真实姓名', trigger: 'blur' },
                    ],
                    sex: [
                        { required: true, message: '请选择', trigger: 'blur' },
                    ],
                    age: [
                        { required: true, message: '请填写年龄，单位：岁', trigger: 'blur' },
                        { pattern: /^(?:[1-9][0-9]?|1[01][0-9]|120)$/, message: '请输入合法年龄'}
                    ],
                    tel: [
                        { required: true, message: '请填写手机号', trigger: 'blur' },
                        { pattern: /^1[3|4|5|7|8][0-9]{9}$/ , message: '请填写合法手机号' },
                        { validator: checkAddEmployeeTel, trigger: "blur" } // 自定义校验(手机号)
                    ],
                    cityCode: [
                        { required: true, message: '请选择', trigger: 'blur' },
                    ],
                    address: [
                        { required: true, message: '请填写详细地址', trigger: 'blur' },
                    ],
                    organizeName: [
                        { required: true, message: '请选择组织', trigger: 'blur' },
                    ],
                    roleId: [
                        { required: true, message: '请选择角色', trigger: 'blur' },
                    ],
                },
                roleForm: {
                    cityCode:[],
                    repairWorkerId:'',
                    userName:'',
                    pwd:'',
                    realName:'',
                    sex:'',
                    age:'',
                    tel:'',
                    card:'',
                    address:'',
                    repairWorkerTypeId:'',
                    organizeId:'',
                    organizeName:'',
                    roleId:'',
                    createTime:'',
                    status:'',
                    state:'',
                    remark:'',
                    lastLoginTime:'',
                },
                rules: {
                    realName: [
                        { required: true, message: '请填写真实姓名', trigger: 'blur' },
                    ],
                    sex: [
                        { required: true, message: '请选择', trigger: 'blur' },
                    ],
                    age: [
                        { required: true, message: '请填写年龄，单位：岁', trigger: 'blur' },
                        { pattern: /^(?:[1-9][0-9]?|1[01][0-9]|120)$/, message: '请输入合法年龄'}
                    ],
                    card: [
                        { required: true, message: '请输入身份证号', trigger: 'blur' },
                        { pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入合法身份证号'},
                        { validator: checkAddWorkerCard, trigger: "blur" } // 自定义校验(身份证)
                    ],
                    tel: [
                        { required: true, message: '请填写手机号', trigger: 'blur' },
                        { pattern: /^1[3|4|5|7|8][0-9]{9}$/ , message: '请填写合法手机号' },
                        { validator: checkAddWorkerTel, trigger: "blur" } // 自定义校验(手机号)
                    ],
                    cityCode: [
                        { required: true, message: '请选择', trigger: 'blur' },
                    ],
                    address: [
                        { required: true, message: '请填写详细地址', trigger: 'blur' },
                    ],
                    repairWorkerTypeId: [
                        { required: true, message: '请选择工种', trigger: 'blur' },
                    ],
                    organizeName: [
                        { required: true, message: '请选择组织', trigger: 'blur' },
                    ],
                    roleId: [
                        { required: true, message: '请选择角色', trigger: 'blur' },
                    ],
                },
                editRoleForm: {
                    cityCode:[],
                    repairWorkerId:'',
                    userName:'',
                    pwd:'',
                    realName:'',
                    sex:'',
                    age:'',
                    tel:'',
                    card:'',
                    address:'',
                    repairWorkerTypeId:'',
                    organizeId:'',
                    organizeName:'',
                    roleId:'',
                    createTime:'',
                    status:'',
                    state:'',
                    remark:'',
                    lastLoginTime:'',
                },
                editRules: {
                    realName: [
                        { required: true, message: '请填写真实姓名', trigger: 'blur' },
                    ],
                    sex: [
                        { required: true, message: '请选择', trigger: 'blur' },
                    ],
                    age: [
                        { required: true, message: '请填写年龄，单位：岁', trigger: 'blur' },
                        { pattern: /^(?:[1-9][0-9]?|1[01][0-9]|120)$/, message: '请输入合法年龄'}
                    ],
                    card: [
                        { required: true, message: '请输入身份证号', trigger: 'blur' },
                        { pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入合法身份证号'},
                        { validator: checkEditWorkerCard, trigger: "blur" } // 自定义校验(身份证)
                    ],
                    tel: [
                        { required: true, message: '请填写手机号', trigger: 'blur' },
                        { pattern: /^1[3|4|5|7|8][0-9]{9}$/ , message: '请填写合法手机号' },
                        { validator: checkEditWorkerTel, trigger: "blur" } // 自定义校验(手机号)
                    ],
                    cityCode: [
                        { required: true, message: '请选择', trigger: 'blur' },
                    ],
                    address: [
                        { required: true, message: '请填写详细地址', trigger: 'blur' },
                    ],
                    repairWorkerTypeId: [
                        { required: true, message: '请选择工种', trigger: 'blur' },
                    ],
                    roleId: [
                        { required: true, message: '请选择角色', trigger: 'blur' },
                    ],
                    organizeName: [
                        { validator: requiredOrganizeName2, trigger: "blur" } // 自定义校验
                    ],
                },
                serviceForm:{
                    customerServiceName:'',
                    username:'',
                    pwd:'',
                    organizeId:'',
                    realName:'',
                    customerServiceName:'',
                    sex:'',
                    tel:'',
                    address:'',
                    roleId:'',
                    remark:'',
                    organizeName:'',
                    cityCode:[],
                },
                serviceRules:{
                    customerServiceName: [
                        { required: true, message: '请填写客服名称', trigger: 'blur' },
                    ],
                    realName: [
                        { required: true, message: '请填写真实姓名', trigger: 'blur' },
                    ],
                    sex: [
                        { required: true, message: '请选择', trigger: 'blur' },
                    ],
                    tel: [
                        { required: true, message: '请填写手机号', trigger: 'blur' },
                        { pattern: /^1[3|4|5|7|8][0-9]{9}$/ , message: '请填写合法手机号' },
                        { validator: checkAddServiceTel, trigger: "blur" } // 自定义校验(手机号)
                    ],
                    cityCode: [
                        { required: true, message: '请选择', trigger: 'blur' },
                    ],
                    address: [
                        { required: true, message: '请填写详细地址', trigger: 'blur' },
                    ],
                    roleId: [
                        { required: true, message: '请选择角色', trigger: 'blur' },
                    ],
                    organizeName: [
                        { required: true, message: '请选择组织', trigger: 'blur' },
                    ],
                },
                editServiceForm:{
                    customerServiceId:'',
                    customerServiceName:'',
                    username:'',
                    pwd:'',
                    organizeId:'',
                    realName:'',
                    customerServiceName:'',
                    sex:'',
                    tel:'',
                    address:'',
                    roleId:'',
                    remark:'',
                    organizeName:'',
                    cityCode:[],
                },
                editServiceRules:{
                    customerServiceName: [
                        { required: true, message: '请填写客服名称', trigger: 'blur' },
                    ],
                    realName: [
                        { required: true, message: '请填写真实姓名', trigger: 'blur' },
                    ],
                    sex: [
                        { required: true, message: '请选择', trigger: 'blur' },
                    ],
                    tel: [
                        { required: true, message: '请填写手机号', trigger: 'blur' },
                        { pattern: /^1[3|4|5|7|8][0-9]{9}$/ , message: '请填写合法手机号' },
                        { validator: checkEditServiceTel, trigger: "blur" } // 自定义校验(手机号)
                    ],
                    cityCode: [
                        { required: true, message: '请选择', trigger: 'blur' },
                    ],
                    address: [
                        { required: true, message: '请填写详细地址', trigger: 'blur' },
                    ],
                    roleId: [
                        { required: true, message: '请选择角色', trigger: 'blur' },
                    ],
                    organizeName: [
                        { validator: requiredOrganizeName3, trigger: "blur" } // 自定义校验
                    ],
                },
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            //添加维修工时 选择工种穿梭狂赋值
            getAddTransferData(){
                this.$axios.get('/api/sp/admin/workertype/all') //接口
                    .then(function (response) {
                        this.$data.transferWorkerTypedata = response.data;
                    }.bind(this))
                    .catch(function (error) {});
            },
            //切换员工类型
            SETypes(){
                if(this.$data.employeeType === '维修员'){
                    this.$data.employeeType = '客服'
                    this.getServiceData();
                    this.reload2();
                }else if(this.$data.employeeType === '客服'){
                    this.$data.employeeType = '其他'
                    this.getEmployeeData();
                    this.reload2();
                }else {
                    this.$data.employeeType = '维修员'
                    this.getWorkerData();
                    this.reload3();

                }
            },
            //get employees data
            getWorkerData(){
                //get worker data
                this.$axios.get('/api/sp/admin/worker/page/'+this.$data.currentPage+'/'+this.$data.pageSize+'?trems='+this.$data.searchForm.trems)
                    .then(function (response) {
                        this.$data.tableData = response.data.rows;
                        this.$data.total = response.data.records;
                    }.bind(this))
                    .catch(function (error) {
                    }.bind(this));
            },
            //get service data
            getServiceData(){
                //get service data
                this.$axios.get('/api/sp/admin/service/page/'+this.$data.currentPage2+'/'+this.$data.pageSize2+'?trems='+this.$data.searchForm2.trems)
                    .then(function (response) {
                        this.$data.serviceTableData = response.data.rows;
                        this.$data.total2 = response.data.records;
                    }.bind(this))
                    .catch(function (error) {
                    }.bind(this));
            },
            //get employee data
            getEmployeeData(){
                this.$axios.get('/api/sp/admin/employee/page/'+this.$data.currentPage3+'/'+this.$data.pageSize3+'?trems='+this.$data.searchForm3.trems)
                    .then(function (response) {
                        this.$data.employeeTableData = response.data.rows;
                        this.$data.total3 = response.data.records;
                    }.bind(this))
                    .catch(function (error) {
                    }.bind(this));
            },
            //get organize data
            getOrganizeData(){
                this.$axios.get('/api/sp/admin/organize/getCurrent/'+this.$data.organizeId)
                    .then(function (response) {
                        this.$data.organizeTableData = response.data;
                        this.$data.originData = response.data;
                    }.bind(this))
                    .catch(function (error) {

                    });
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.organizeName.indexOf(value) !== -1;
            },
            handleExpand(){
                this.$data.isExpand = !this.$data.isExpand
                this.expandFunc(this.organizeTableData);
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
                return this.getWorkerData();
            },
            reload2() {
                // 清除所有状态
                this.$refs.xServiceTable.clearAll();
                return this.getServiceData();
            },
            reload3() {
                // 清除所有状态
                this.$refs.xEmployeeTable.clearAll();
                return this.getEmployeeData();
            },
            //page listen
            handleCurrentChange(val) {
                let pageSize = this.$data.pageSize
                //currentPage 变化监听
                this.$axios.get('/api/sp/admin/worker/page/'+val+'/'+pageSize+'?trems='+this.$data.searchForm.trems)
                    .then(function (response) {
                        this.$data.total = response.data.records;
                        this.$data.tableData = response.data.rows;
                    }.bind(this))
                    .catch(function (error) {

                    });
            },
            //page listen
            handleCurrentChange2(val) {
                let pageSize = this.$data.pageSize2
                //currentPage 变化监听
                this.$axios.get('/api/sp/admin/service/page/'+val+'/'+pageSize+'?trems='+this.$data.searchForm2.trems)
                    .then(function (response) {
                        this.$data.total2 = response.data.records;
                        this.$data.serviceTableData = response.data.rows;
                    }.bind(this))
                    .catch(function (error) {

                    });
            },
            //page listen
            handleCurrentChange3(val) {
                let pageSize = this.$data.pageSize3
                //currentPage 变化监听
                this.$axios.get('/api/sp/admin/employee/page/'+val+'/'+pageSize+'?trems='+this.$data.searchForm3.trems)
                    .then(function (response) {
                        this.$data.total3 = response.data.records;
                        this.$data.employeeTableData = response.data.rows;
                    }.bind(this))
                    .catch(function (error) {
                    });
            },
            //add worker
            addWorker: function (formName) {
                this.$data.roleForm.address = this.$data.address + this.$data.roleForm.address;
                //处理工种
                let typeids = this.$data.transferWorkerTypeChoiceData;
                if (typeids.length != 1) {
                    this.$data.roleForm.repairWorkerTypeId = typeids.join();
                } else {
                    this.$data.roleForm.repairWorkerTypeId = typeids;
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/api/sp/admin/worker/insert',
                            this.$data.roleForm)
                            .then(function (response) {
                                if (response.data.status == '200') {
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type: "success",
                                            message: '添加维修员成功',
                                        });
                                        this.$data.addPage = false;
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
            addEmployee: function (formName) {
                this.$data.employeeForm.address = this.$data.address + this.$data.employeeForm.address;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/api/sp/admin/employee/insert',
                            this.$data.employeeForm)
                            .then(function (response) {
                                if (response.data.status == '200') {
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type: "success",
                                            message: '添加客服成功',
                                        });
                                        this.$data.address ='';
                                        this.$data.addEmployeePage = false;
                                        this.reload3();
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
            addService: function (formName) {
                this.$data.serviceForm.address = this.$data.address + this.$data.serviceForm.address;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/api/sp/admin/service/insert',
                            this.$data.serviceForm)
                            .then(function (response) {
                                if (response.data.status == '200') {
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type: "success",
                                            message: '添加客服成功',
                                        });
                                        this.$data.address ='';
                                        this.$data.addServicePage = false;
                                        this.reload2();
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
            //get worker
            edit(id){
                //根据id赋值
                this.$axios.get('/api/sp/admin/worker/id/'+id).then(function (response) {
                    this.$data.editRoleForm = response.data;
                    this.$data.transferWorkerTypeChoiceData = response.data.repairWorkerTypeId.split(",");
                    this.$data.editPage = true;
                }.bind(this)).catch(function (error) {
                    alert(error)
                });
            },
            editService(id){
                //根据id赋值
                this.$axios.get('/api/sp/admin/service/id/'+id).then(function (response) {
                    this.$data.editServiceForm = response.data;
                    this.$data.editServicePage = true;
                }.bind(this)).catch(function (error) {
                    alert(error)
                });
            },
            editEmployee(id){
                //根据id赋值
                this.$axios.get('/api/sp/admin/employee/id/'+id).then(function (response) {
                    this.$data.editEmployeeForm = response.data;
                    this.$data.editEmployeePage = true;
                }.bind(this)).catch(function (error) {
                    //alert(error)
                });
            },
            //save employee
            saveEmployee(formName){
                console.log(this.$data.editEmployeeForm.organizeName)
                console.log(this.$data.editEmployeeForm.organizeId)
                //修改信息
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/api/sp/admin/employee/save',
                            this.$data.editEmployeeForm)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'编辑员工成功',
                                        });
                                        this.$data.editEmployeePage = false;
                                        this.reload3();
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
            //save worker
            saveWorker(formName){
                //修改信息
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/api/sp/admin/worker/save',
                            this.$data.editRoleForm)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'编辑维修员成功',
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
                        return false;
                    }
                });
            },
            saveService(formName){
                //修改信息
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/api/sp/admin/service/save',
                            this.$data.editServiceForm)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'编辑客服成功',
                                        });
                                        this.$data.editServicePage = false;
                                        this.reload2();
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
            delEmployee(id){
                this.$modal.confirm('确认删除吗？').then(type => {
                    if( type == 'confirm'){
                        this.$axios.get('/api/sp/admin/employee/delete/'+id)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'操作成功',
                                        });
                                        this.reload3();
                                    }, 1000);

                                }
                            }.bind(this))
                            .catch(function (error) {});
                    }
                    return false;
                })
            },
            delWorker(id){
                this.$modal.confirm('确认删除吗？').then(type => {
                    if( type == 'confirm'){
                        this.$axios.get('/api/sp/admin/worker/delete/'+id)
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
            delService(id){
                this.$modal.confirm('确认删除吗？').then(type => {
                    if( type == 'confirm'){
                        this.$axios.get('/api/sp/admin/service/delete/'+id)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'操作成功',
                                        });
                                        this.reload2();
                                    }, 1000);
                                }
                            }.bind(this))
                            .catch(function (error) {});
                    }
                    return false;
                })
            },
            resetWorkerPwd(id){
                this.$modal.confirm('请确认操作？').then(type => {
                    if( type == 'confirm'){
                        this.$axios.get('/api/sp/admin/worker/resetpwd/'+id)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'已重置密码',
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
            resetEmployeePwd(id){
                this.$modal.confirm('请确认操作？').then(type => {
                    if( type == 'confirm'){
                        this.$axios.get('/api/sp/admin/employee/resetpwd/'+id)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'已重置密码',
                                        });
                                        this.reload3();
                                    }, 1000);
                                }
                            }.bind(this))
                            .catch(function (error) {});
                    }
                    return false;
                })
            },
            resetServicePwd(id){
                this.$modal.confirm('请确认操作？').then(type => {
                    if( type == 'confirm'){
                        this.$axios.get('/api/sp/admin/service/resetpwd/'+id)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'已重置密码',
                                        });
                                        this.reload2();
                                    }, 1000);
                                }
                            }.bind(this))
                            .catch(function (error) {});
                    }
                    return false;
                })
            },
            search(formName){
                this.$axios.get('/api/sp/admin/worker/page/'+this.$data.currentPage+'/'+this.$data.pageSize+'?trems='+this.$data.searchForm.trems)
                    .then(function (response) {
                        this.$data.tableData = response.data.rows;
                        this.$data.total = response.data.records;
                    }.bind(this))
                    .catch(function (error) {
                    }.bind(this));
            },
            search2(formName){
                this.$axios.get('/api/sp/admin/service/page/'+this.$data.currentPage2+'/'+this.$data.pageSize2+'?trems='+this.$data.searchForm2.trems)
                    .then(function (response) {
                        this.$data.serviceTableData = response.data.rows;
                        this.$data.total2 = response.data.records;
                    }.bind(this))
                    .catch(function (error) {
                    }.bind(this));
            },
            search3(formName){
                this.$axios.get('/api/sp/admin/employee/page/'+this.$data.currentPage3+'/'+this.$data.pageSize3+'?trems='+this.$data.searchForm3.trems)
                    .then(function (response) {
                        this.$data.employeeTableData = response.data.rows;
                        this.$data.total3 = response.data.records;
                    }.bind(this))
                    .catch(function (error) {
                    }.bind(this));
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
                // console.log(arr);
                // console.log(CodeToText[arr[0]]+CodeToText[arr[1]]+CodeToText[arr[2]]);
                this.$data.roleForm.cityCode = arr[2];
                this.$data.address = CodeToText[arr[0]]+CodeToText[arr[1]]+CodeToText[arr[2]];

            },
            //穿梭框赋值打印
            handleChange(value, direction, movedKeys) {
                //console.log(value, direction, movedKeys);
                //console.log(this.$data.transferWorkerTypeChoiceData)
                if(this.$data.transferWorkerTypeChoiceData.length > 0){
                    this.$data.repairWorkerTypeId = "true";
                }

            },
            //点击组织赋值并关闭模态框
            handleAddWorkerOrganize(data,checked,node){
                this.$data.roleForm.organizeName = data.organizeName;
                this.$data.roleForm.organizeId = data.organizeId;
                this.$data.choiceOrganize= false;
            },
            handleAddWorkerOrganize2(data,checked,node){
                this.$data.editRoleForm.organizeName = data.organizeName;
                this.$data.editRoleForm.organizeId = data.organizeId;
                this.$data.choiceOrganize= false;
            },
            handleAddWorkerOrganize3(data,checked,node){
                this.$data.serviceForm.organizeName = data.organizeName;
                this.$data.serviceForm.organizeId = data.organizeId;
                this.$data.choiceOrganize= false;
            },
            handleAddWorkerOrganize4(data,checked,node){
                this.$data.editServiceForm.organizeName = data.organizeName;
                this.$data.editServiceForm.organizeId = data.organizeId;
                this.$data.choiceOrganize= false;
            },
            handleAddWorkerOrganize5(data,checked,node){
                this.$data.employeeForm.organizeName = data.organizeName;
                this.$data.employeeForm.organizeId = data.organizeId;
                this.$data.choiceOrganize= false;
            },
            handleAddWorkerOrganize6(data,checked,node){
                this.$data.editEmployeeForm.organizeName = data.organizeName;
                this.$data.editEmployeeForm.organizeId = data.organizeId;
                this.$data.choiceOrganize= false;
            },
            handleCheckChange22(data,checked,node) {
                this.$data.searchForm.trems = data.organizeName
                this.$data.searchForm2.trems = data.organizeName
                this.$data.searchForm3.trems = data.organizeName
                this.getEmployeeData();
                this.getServiceData();
                this.getWorkerData();
            },

        },
        created() {
            this.getWorkerData();
            this.getOrganizeData();
            this.getAddTransferData();
            //this.getData();
        }
    }
</script>

<style scoped>

</style>
