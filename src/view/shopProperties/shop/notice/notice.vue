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
    <!--table postion-->
    <el-row>
      <el-col :span="24">
        <el-col :span="24"style="margin-top: 20px">
          <el-card style="width: 98%;margin: 0 auto;">
            <vxe-toolbar>
              <template v-slot:buttons>
                <vxe-modal v-model="editPage"
                           id="170789444123123444"
                           title="详情" width="800" height="450"
                           resize remember
                           :fullscreen=true
                           :esc-closable=true>
                  <template v-slot>
                    <div style="width: 95%;margin: 0 auto;">
                      <el-form  ref="roleForm" :model="editform"  :rules="editrules"  label-width="80px" size="small">
                        <mavon-editor v-model="editform.content" ref="md" @imgAdd="$imgAdd" @change="change" style="max-height: 600px;min-height: 600px" :editable="false"/>
                      </el-form>
                    </div>
                  </template>
                </vxe-modal>
              </template>
            </vxe-toolbar>

            <vxe-table
              border
              ref="xTable"
              :data="tableData">
              <vxe-table-column field="title" title="标题"></vxe-table-column>
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
              <vxe-table-column title="操作">
                <template v-slot="{ row }">
                  <vxe-button size="mini" content="详情" @click="edit(row.noticeId)"></vxe-button>
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
                    customerServiceId:'',
                    noticeId:'',
                    title:'',
                    type:1,
                    state:1,
                },
                editform: {
                    noticeId:'',
                    customerServiceId:'',
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
