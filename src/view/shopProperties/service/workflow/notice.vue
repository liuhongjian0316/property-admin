<template>
  <div>
    <el-row>
      <el-col :span="24" style="margin-top: 20px">
        <el-card style="width: 98%;margin: 0 auto;">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: path }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>发布通知</el-breadcrumb-item>
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
              <el-form  ref="roleForm" :model="searchForm"  label-width="80px" size="small">
                <el-col :span="5">
                  <el-select v-model="searchForm.type" placeholder="请选择通知类型">
                    <el-option value="" label="请选择"> </el-option>
                    <el-option value="1" label="商户通知"></el-option>
                    <el-option value="2" label="维修员通知"> </el-option>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <el-input placeholder="请输入通知ID" v-model="searchForm.name"></el-input>
                </el-col>
                <el-col :span="5">
                  <el-input placeholder="请输入通知标题" v-model="searchForm.tel"></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button class="el-icon-search" type="success"  size="small" @click="search('searchForm')">搜索</el-button>
                </el-col>
              </el-form>
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
                <el-button type="primary" class="el-icon-plus" size="mini" @click="addPage=true">增加通知</el-button>
                <!--add notices-->
                <vxe-modal v-model="addPage"
                           id="198215524654456"
                           title="增加通知" width="800" height="500"
                           resize remember
                           :fullscreen="true"
                           :esc-closable=true>
                  <template v-slot>
                    <!--add form-->
                    <div style="width: 95%;margin: 0 auto;">
                      <el-form  ref="roleForm" :model="form"  :rules="rules"  label-width="80px" size="small">
                        <el-row>
                          <el-col :span="12">
                            <el-row>
                              <el-form-item label="通知类型" prop="type">
                                <el-select v-model="form.type" placeholder="请选择通知类型" style="width: 100%">
                                  <el-option value="" label="请选择"> </el-option>
                                  <el-option value="1" label="维修员通知"></el-option>
                                  <el-option value="2" label="商户通知"> </el-option>
                                </el-select>
                              </el-form-item>
                            </el-row>
                            <el-row>
                              <el-form-item label="标题" prop="title">
                                <el-input v-model="form.title" placeholder="请输入通知标题"> </el-input>
                              </el-form-item>
                            </el-row>
                            <el-row>
                              <el-form-item label="时间范围" prop="beginTime">
                                <el-date-picker
                                  style="width: 100%"
                                  v-model="form.beginTime"
                                  type="datetimerange"
                                  range-separator="至"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期">
                                </el-date-picker>
                              </el-form-item>
                            </el-row>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="头部图片" prop="img">
                              <div class="img">
                                <el-upload
                                  action="/api/upload"
                                  :headers=myHeaders
                                  :on-preview="handlePictureCardPreview"
                                  :on-success="handleUploadSuccess"
                                  :on-exceed="exceed"
                                  list-type="picture-card"
                                  :on-remove="handleRemove"
                                  :class="{disabled:uploadDisabled}"
                                  :file-list="fileList"
                                  :limit=photolimit
                                >
                                  <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-dialog :visible.sync="dialogVisible2" :modal-append-to-body="false">
                                  <img width="100%" :src="form.img" alt="图片"/>
                                </el-dialog>
                              </div>
                              <div class="imgSpan2">(请上传jpg/png文件，只需上传一张即可)</div>
                            </el-form-item>
                          </el-col>
                        </el-row>

                        <el-form-item label="通告内容" prop="content">
                          <mavon-editor v-model="form.content" ref="md" @imgAdd="$imgAdd" @change="change" style="max-height: 300px"/>
                        </el-form-item>

                        <el-form-item label="备注信息">
                          <el-input v-model="form.remark" placeholder="请输入备注信息，可不填"></el-input>
                        </el-form-item>
                        <el-divider></el-divider>
                        <el-form-item style="float: right;position: absolute; bottom: 20px; right: 50px;">
                          <el-button type="primary" @click="add('roleForm')">确定</el-button>
                          <el-button @click="addPage=false">关闭</el-button>
                        </el-form-item>
                      </el-form>
                    </div>
                  </template>
                </vxe-modal>
                <vxe-modal v-model="editPage"
                           id="170789444123123444"
                           title="编辑公告" width="800" height="450"
                           resize remember
                           :fullscreen=true
                           :esc-closable=true>
                  <template v-slot>
                    <div style="width: 95%;margin: 0 auto;">
                      <el-form  ref="roleForm" :model="editform"  :rules="editrules"  label-width="80px" size="small">
                        <el-row>
                          <el-col :span="12">
                            <el-row>
                              <el-form-item label="通知类型" prop="type">
                                <el-select v-model="editform.type" placeholder="请选择通知类型" style="width: 100%">
                                  <el-option value="" label="请选择"> </el-option>
                                  <el-option value="2" label="维修员通知"></el-option>
                                  <el-option value="1" label="商户通知"> </el-option>
                                </el-select>
                              </el-form-item>
                            </el-row>
                            <el-row>
                              <el-form-item label="标题" prop="title">
                                <el-input v-model="editform.title" placeholder="请输入通知标题"> </el-input>
                              </el-form-item>
                            </el-row>
                            <el-row>
                              <el-form-item label="时间范围" prop="beginTime">
                                <el-date-picker
                                  style="width: 100%"
                                  v-model="editform.beginTime"
                                  type="datetimerange"
                                  range-separator="至"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期">
                                </el-date-picker>
                              </el-form-item>
                            </el-row>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="头部图片" prop="img">
                              <div class="img">
                                <el-upload
                                  action="/api/upload"
                                  :headers=myHeaders
                                  :on-preview="handlePictureCardPreview3"
                                  :on-success="handleUploadSuccess3"
                                  :on-exceed="exceed3"
                                  list-type="picture-card"
                                  :on-remove="handleRemove3"
                                  :class="{disabled:uploadDisabled}"
                                  :file-list="fileList"
                                  :limit=photolimit
                                >
                                  <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-dialog :visible.sync="dialogVisible3" :modal-append-to-body="false">
                                  <img width="100%" :src="editform.img" alt="图片"/>
                                </el-dialog>
                              </div>
                              <div class="imgSpan2">(请上传jpg/png文件，只需上传一张即可)</div>
                            </el-form-item>
                          </el-col>
                        </el-row>

                        <el-form-item label="通告内容" prop="content">
                          <mavon-editor v-model="editform.content" ref="md" @imgAdd="$imgAdd" @change="change" style="max-height: 300px"/>
                        </el-form-item>

                        <el-form-item label="备注信息">
                          <el-input v-model="editform.remark" placeholder="请输入备注信息，可不填"></el-input>
                        </el-form-item>
                        <el-divider></el-divider>
                        <el-form-item style="float: right;position: absolute; bottom: 20px; right: 50px;">
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
              <vxe-table-column field="noticeId" title="公告ID"></vxe-table-column>
              <vxe-table-column field="title" title="标题"></vxe-table-column>
              <vxe-table-column field="type" title="类型">
                <template v-slot="{ row }">
                  <span v-if="row.type == '1'">商户通知</span>
                  <span v-if="row.type == '2'">维修员通知</span>
                </template>
              </vxe-table-column>
              <vxe-table-column field="img" title="显示图片">
                <template v-slot="{ row }">
                  <template>
                    <img :src=row.img  width="120px" @click="dialogVisible=true" alt="图片" />
                    <el-dialog :visible.sync="dialogVisible">
                      <img width="100%" :src=row.img @click="dialogVisible=false" alt="图片" />
                    </el-dialog>
                  </template>
                </template>
              </vxe-table-column>
              <vxe-table-column field="beginTime" title="开始时间" formatter="formatDate"></vxe-table-column>
              <vxe-table-column field="endTime" title="结束时间" formatter="formatDate"></vxe-table-column>
              <vxe-table-column field="createTime" title="创建时间" formatter="formatDate"></vxe-table-column>
              <vxe-table-column field="state" title="通知状态">
                <template v-slot="{ row }">
                  <span v-if="row.state == '0'"><div class="offlinestate"></div>未通知</span>
                  <span v-if="row.state == '1'"><div class="onlinestate"></div>已通知</span>
                </template>
              </vxe-table-column>
              <vxe-table-column title="操作">
                <template v-slot="{ row }">
                  <vxe-button size="mini" content="修改" @click="edit(row.noticeId)"></vxe-button>
                  <vxe-button size="mini" content="删除" @click="del(row.noticeId)"></vxe-button>
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
</template>

<script>
    export default {
        name: "notice",
        data(){
            return{
                path:'\/index',
                myHeaders: {Authorization: "token"},
                currentPage: 1,
                pageSize:10,
                total: 100,
                tableData: [],
                editData:{},
                dialogVisible2:false,//添加时
                dialogVisible3:false,//添加时
                addPage: false,
                editPage: false,
                uploadDisabled: false, //添加
                dialogVisible: false,//table img
                fileList: [],
                newFile:new FormData(),//定义一个表单常量（添加）
                photolimit:1,
                searchForm:{
                    customerServiceId:JSON.parse(localStorage.getItem("serviceinfo")).customerServiceId,
                    noticeId:'',
                    title:'',
                    type:'',
                },
                form: {
                    noticeId:'',
                    customerServiceId:JSON.parse(localStorage.getItem("serviceinfo")).customerServiceId,
                    title:'',
                    type:'',
                    img:'',
                    type:'',
                    contentHtml:'',
                    content:'',
                    beginTime:'',
                    endTime:'',
                    remark:'',
                },
                rules: {
                    title: [
                        { required: true, message: '请填写通知标题', trigger: 'blur' },
                    ],
                    type: [
                        { required: true, message: '请选择通知类型', trigger: 'blur' },
                    ],
                    content: [
                        { required: true, message: '请填写通知内容', trigger: 'blur' },
                    ],
                    beginTime: [
                        { required: true, message: '请选择时间', trigger: 'blur' },
                    ],
                },
                editform: {
                    noticeId:'',
                    customerServiceId:JSON.parse(localStorage.getItem("serviceinfo")).customerServiceId,
                    title:'',
                    type:'',
                    img:'',
                    type:'',
                    contentHtml:'',
                    content:'',
                    beginTime:'',
                    endTime:'',
                    remark:'',
                },
                editrules: {
                    title: [
                        { required: true, message: '请填写通知标题', trigger: 'blur' },
                    ],
                    type: [
                        { required: true, message: '请选择通知类型', trigger: 'blur' },
                    ],
                    content: [
                        { required: true, message: '请填写通知内容', trigger: 'blur' },
                    ],
                    beginTime: [
                        { required: true, message: '请选择时间', trigger: 'blur' },
                    ],
                },
            }
        },
        methods: {
            //get notice data
            getData(){
                this.$axios.post('/api/sp/service/notices/page/'+this.$data.currentPage+'/'+this.$data.pageSize,this.$data.searchForm)
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
                let pageSize = this.$data.pageSize
                //currentPage 变化监听
                this.$axios.get('/api/sp/service/notices/page/'+val+'/'+pageSize+this.$data.searchForm)
                    .then(function (response) {
                        this.$data.total = response.data.records;
                        this.$data.tableData = response.data.rows;
                    }.bind(this))
                    .catch(function (error) {

                    });
            },
            //add notice
            add(formName) {
                this.$data.form.contentHtml = this.$data.html;
                this.$data.form.endTime = this.$data.form.beginTime[1];
                this.$data.form.beginTime = this.$data.form.beginTime[0];
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/api/sp/service/notices/insert',
                            this.$data.form)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'添加成功',
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
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //get shop
            edit(id){
                //根据id赋值
                this.$axios.get('/api/sp/service/notices/edit/'+id).then(function (response) {
                    this.$data.editform = response.data;
                    let timeRange = new Array();
                    timeRange.push(new Date(response.data.beginTime));
                    timeRange.push(new Date(response.data.endTime));
                    this.$data.editform.beginTime = timeRange;
                    let imgs = new Array();
                    let obj = [];
                    obj.name = 'img';
                    obj.url = response.data.img;
                    imgs.push(obj);
                    this.$data.fileList = imgs;
                    this.$data.editPage = true;
                    this.$data.uploadDisabled = true;
                }.bind(this)).catch(function (error) {
                    alert(error)
                });
            },
            //save shop
            save(formName){
                //修改信息
                this.$data.editform.contentHtml = this.$data.html;
                this.$data.editform.endTime = this.$data.editform.beginTime[1];
                this.$data.editform.beginTime = this.$data.editform.beginTime[0];
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/api/sp/service/notices/save',
                            this.$data.editform)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'编辑商户成功',
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
                        this.$axios.get('/api/sp/service/notices/delete/'+id)
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
            search(formName){
                this.$axios.post('/api/sp/service/notices/page/'+this.$data.currentPage+'/'+this.$data.pageSize,
                    this.$data.searchForm)
                    .then(function (response) {
                        this.$data.tableData = response.data.rows;
                        this.$data.total = response.data.records;
                    }.bind(this))
                    .catch(function (error) {
                    }.bind(this));
            },
            //图片上传操作
            //上传前操作
            // BeforeUpload(file){
            //     if(file){
            //         this.$data.newFile.append('file',file); //  2. 上传之前，拿到file对象，并将它添加到刚刚定义的FormData对象中。
            //         this.upload();
            //     }else{
            //         return false;
            //     }
            // },
            // //上传文件
            // upload(){
            //     const formdata= this.$data.newFile; //  3. 拿到刚刚的数据，并将其传给后台
            //     this.$axios({
            //         url: '/api/upload',
            //         method: 'post',
            //         data: formdata,
            //         headers: { 'Content-Type': 'multipart/form-data'},
            //     }).then((url) => {
            //         this.$data.form.img = url.data
            //     })
            // },
            //删除
            handleRemove(file, fileList) {
                this.uploadDisabled = false;
            },
            //回显
            handlePictureCardPreview(file) {
                this.$data.form.img = file.url;
                this.dialogVisible2 = true;
                this.uploadDisabled = true;
            },
            //上传成功
            handleUploadSuccess(file) {
                this.$data.form.img = file;
                this.uploadDisabled = true;
            },
            //超出文件个数
            exceed(files,fileList){
                alert("超出文件个数")
                console.log(fileList)
            },
            //markdown操作
            $imgAdd(pos, $file){
                var formdata = new FormData();
                formdata.append('file', $file);
                // 这里没有服务器供大家尝试，可将下面上传接口替换为你自己的服务器接口
                this.$axios({
                    url: '/api/upload',
                    method: 'post',
                    data: formdata,
                    headers: { 'Content-Type': 'multipart/form-data' },
                }).then((url) => {
                    this.$refs.md.$img2Url(pos, url.data);
                })
            },
            change(value, render){
                // render 为 markdown 解析后的结果
                this.$data.html = render;
            },
            handleRemove3(file, fileList) {
                this.uploadDisabled = false;
            },
            //回显
            handlePictureCardPreview3(file) {
                this.$data.editform.img = file.url;
                this.dialogVisible3 = true;
                this.uploadDisabled = true;
            },
            //上传成功
            handleUploadSuccess3(file) {
                this.$data.editform.img = file;
                this.uploadDisabled = true;
            },
            //超出文件个数
            exceed3(files,fileList){
                console.log(fileList)
            },

        },
        created() {
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
  .imgSpan2{
    font-size: 12px;
    color: red;
  }
</style>
