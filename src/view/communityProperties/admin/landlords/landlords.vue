<template>
  <div>
    <el-row>
      <el-col :span="24" style="margin-top: 20px">
        <el-card style="width: 98%;margin: 0 auto;">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: path }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>业主管理</el-breadcrumb-item>
            <el-breadcrumb-item>业主信息</el-breadcrumb-item>
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
              <el-col :span="6">
                <el-input placeholder="请输入小区ID" v-model="name"></el-input>
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
                <el-button class="el-icon-search" type="success"  size="small" @click="onSubmit('searchForm')">搜索</el-button>
                <el-button class="el-icon-refresh" type="warning"  size="small" @click="resetForm('searchForm')">重置</el-button>
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
                <el-button type="primary" class="el-icon-plus" size="mini" @click="openAddPage()">添加业主</el-button>
                <!--add model-->
                <vxe-modal v-model="addPage"
                           id="198215524654456"
                           title="增加业主" width="800" height="450"
                           resize remember
                           :esc-closable=true>
                  <template v-slot>
                    <!--add form-->
                    <div>
                      <el-form  ref="roleForm" :model="roleForm"  :rules="rules"  label-width="80px" size="small">
                        <el-row>
                          <el-col :span="12">
                            <el-form-item label="姓名" prop="landlordsName">
                              <el-input v-model="roleForm.landlordsName" placeholder="请填写姓名"> </el-input>
                            </el-form-item>
                            <el-form-item label="性别" prop="landlordsSex" >
                              <el-select style="width: 100%" v-model="roleForm.landlordsSex" placeholder="请选择">
                                <el-option label="请选择" value=""></el-option>
                                <el-option label="男" value="0"></el-option>
                                <el-option label="女" value="1"></el-option>
                              </el-select>
                            </el-form-item>
                            <el-form-item label="年龄" prop="landlordsAge">
                              <el-input v-model="roleForm.landlordsAge" placeholder="请填写年龄"></el-input>
                            </el-form-item>
                            <el-form-item label="身份证" prop="landlordsCard">
                              <el-input v-model="roleForm.landlordsCard" placeholder="请填写身份证"></el-input>
                            </el-form-item>
                            <el-form-item label="手机" prop="landlordsTel">
                              <el-input v-model="roleForm.landlordsTel" placeholder="请填写手机号"></el-input>
                            </el-form-item>
                            <el-form-item label="微信" prop="landlordsWX">
                              <el-input v-model="roleForm.landlordsWx" placeholder="请填写微信"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <div style="margin-left: 50px; margin-bottom: 20px">
                              <el-row>
                                <el-col :span="24">
                                  <div v-if="imgSrc" class="img_bg_camera">
                                    <img :src="imgSrc" alt="" class="tx_img">
                                  </div>
                                  <div v-else>
                                    <video id="videoCamera" :width="videoWidth" :height="videoHeight" autoplay></video>
                                    <canvas style="display:none;" id="canvasCamera" :width="videoWidth" :height="videoHeight" ></canvas>
                                  </div>
                                </el-col>
                                <el-col :span="24" style="margin-top: 10px;">
                                  <el-button @click="getCompetence" size="mini" type="success">打开摄像头</el-button>
                                  <el-button @click="setImage()" size="mini" type="success">拍照</el-button>
                                  <el-button @click="setImage()" size="mini">上传</el-button>
                                </el-col>
                              </el-row>
                            </div>

                            <el-form-item label="备注" prop="remark">
                              <el-input v-model="roleForm.remark" placeholder="请填写备注"></el-input>
                            </el-form-item>
                            <el-form-item label="QQ" prop="landlordsQq">
                              <el-input v-model="roleForm.landlordsQq" placeholder="请填写QQ"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-divider></el-divider>
                        <el-form-item style="float: right;position: absolute; bottom: 0px; right: 12px;">
                          <el-button type="primary" @click="add('roleForm')">确定</el-button>
                          <el-button @click="addPage=false">关闭</el-button>
                        </el-form-item>
                      </el-form>
                    </div>
                  </template>
                </vxe-modal>
                <vxe-modal v-model="editPage"
                           id="170789444444"
                           title="编辑业主" width="800" height="450"
                           resize remember
                           :esc-closable=true>
                  <template v-slot>
                    <!--edit form-->
                    <div>
                      <el-form  ref="roleForm" :model="roleForm"  :rules="rules"  label-width="80px" size="small">
                        <el-row>
                          <el-col :span="12">
                            <el-form-item label="姓名" prop="landlordsName">
                              <el-input v-model="roleForm.landlordsName" placeholder="请填写姓名"> </el-input>
                            </el-form-item>
                            <el-form-item label="性别" prop="landlordsSex" >
                              <el-select style="width: 100%" v-model="roleForm.landlordsSex" placeholder="请选择">
                                <el-option label="请选择" value=""></el-option>
                                <el-option label="男" value="0"></el-option>
                                <el-option label="女" value="1"></el-option>
                              </el-select>
                            </el-form-item>
                            <el-form-item label="年龄" prop="landlordsAge">
                              <el-input v-model="roleForm.landlordsAge" placeholder="请填写年龄"></el-input>
                            </el-form-item>
                            <el-form-item label="身份证" prop="landlordsCard">
                              <el-input v-model="roleForm.landlordsCard" placeholder="请填写身份证"></el-input>
                            </el-form-item>
                            <el-form-item label="手机" prop="landlordsTel">
                              <el-input v-model="roleForm.landlordsTel" placeholder="请填写手机号"></el-input>
                            </el-form-item>
                            <el-form-item label="微信" prop="landlordsWX">
                              <el-input v-model="roleForm.landlordsWx" placeholder="请填写微信"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <div style="margin-left: 50px; margin-bottom: 20px">
                              <el-row>
                                <el-col :span="24">
                                  <div v-if="imgSrc" class="img_bg_camera">
                                    <img :src="imgSrc" alt="" class="tx_img">
                                  </div>
                                  <div v-else>
                                    <video id="videoCamera2" :width="videoWidth" :height="videoHeight" autoplay></video>
                                    <canvas style="display:none;" id="canvasCamera2" :width="videoWidth" :height="videoHeight" ></canvas>
                                  </div>
                                </el-col>
                                <el-col :span="24" style="margin-top: 10px;">
                                  <el-button @click="getCompetence" size="mini" type="success">打开摄像头</el-button>
                                  <el-button @click="setImage()" size="mini" type="success">拍照</el-button>
                                  <el-button @click="setImage()" size="mini">上传</el-button>
                                </el-col>
                              </el-row>
                            </div>

                            <el-form-item label="备注" prop="remark">
                              <el-input v-model="roleForm.remark" placeholder="请填写备注"></el-input>
                            </el-form-item>
                            <el-form-item label="QQ" prop="landlordsQq">
                              <el-input v-model="roleForm.landlordsQq" placeholder="请填写QQ"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-divider></el-divider>
                        <el-form-item style="float: right;position: absolute; bottom: 0px; right: 12px;">
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
              <vxe-table-column field="landlordsId" title="业主ID"></vxe-table-column>
              <vxe-table-column field="landlordsName" title="姓名"></vxe-table-column>
              <vxe-table-column field="landlordsSex" title="性别">
                <template v-slot="{ row }">
                  <template>
                    <span v-if="row.landlordsSex == 0">男</span>
                    <span v-if="row.landlordsSex == 1">女</span>
                  </template>
                </template>
              </vxe-table-column>
              <vxe-table-column field="landlordsAge" title="年龄"></vxe-table-column>
              <vxe-table-column field="landlordsCard" title="身份证"></vxe-table-column>
              <vxe-table-column field="landlordsTel" title="联系电话"></vxe-table-column>
              <vxe-table-column field="landlordsWx" title="微信"></vxe-table-column>
              <vxe-table-column field="landlordsQq" title="QQ"></vxe-table-column>
              <vxe-table-column title="操作">
                <template v-slot="{ row }">
                  <el-row>
                    <el-col :span="12">
                      <el-dropdown trigger="click">
                        <el-button size="mini">变更<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item><vxe-button size="mini" content="修改" @click="edit(row.landlordsId)"></vxe-button></el-dropdown-item>
                          <el-dropdown-item><vxe-button size="mini" content="删除" @click="del(row.landlordsId)"></vxe-button></el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                    <el-col :span="12"><vxe-button size="mini" content="详情" @click="details(row.landlordsId)"></vxe-button></el-col>
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
</template>

<script>
    import { regionData,CodeToText } from 'element-china-area-data'
    export default {
        name: "landlords",
        data(){
            return{
                videoWidth: 300,
                videoHeight: 140,
                imgSrc: '',
                thisCancas: null,
                thisContext: null,
                thisVideo: null,

                path:'\/index',
                cityCode:[],//城市编码
                address:'',//临时地址
                options: regionData,
                name:"",
                currentPage: 1,
                pageSize:10,
                total: 100,
                tableData: [],
                editData:{},
                addPage: false,
                editPage: false,
                roleForm: {
                    landlordsId:'',
                    landlordsName:'',
                    landlordsSex:'',
                    landlordsAge:'',
                    landlordsCard:'',
                    landlordsTel:'',
                    landlordsWx:'',
                    landlordsQq:'',
                    landlordsAvatar:'',
                    remark:''
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
            }
        },
        methods: {
            //open add-page and open camera
            openAddPage(){
                this.$data.addPage = true;
            },
            closeAddPage(){
                this.stopNavigator();
                this.stopNavigator();
                this.$data.addfalse = true;
            },
            getCompetence () {
                var _this = this
                this.thisCancas = document.getElementById('canvasCamera')
                this.thisContext = this.thisCancas.getContext('2d')
                this.thisVideo = document.getElementById('videoCamera')
                // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
                if (navigator.mediaDevices === undefined) {
                    navigator.mediaDevices = {}
                }
                // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
                // 使用getUserMedia，因为它会覆盖现有的属性。
                // 这里，如果缺少getUserMedia属性，就添加它。
                if (navigator.mediaDevices.getUserMedia === undefined) {
                    navigator.mediaDevices.getUserMedia = function (constraints) {
                        // 首先获取现存的getUserMedia(如果存在)
                        var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia
                        // 有些浏览器不支持，会返回错误信息
                        // 保持接口一致
                        if (!getUserMedia) {
                            return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
                        }
                        // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
                        return new Promise(function (resolve, reject) {
                            getUserMedia.call(navigator, constraints, resolve, reject)
                        })
                    }
                }
                var constraints = { audio: false, video: { width: this.videoWidth, height: this.videoHeight, transform: 'scaleX(-1)' } }
                navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                    // 旧的浏览器可能没有srcObject
                    if ('srcObject' in _this.thisVideo) {
                        _this.thisVideo.srcObject = stream
                    } else {
                        // 避免在新的浏览器中使用它，因为它正在被弃用。
                        _this.thisVideo.src = window.URL.createObjectURL(stream)
                    }
                    _this.thisVideo.onloadedmetadata = function (e) {
                        _this.thisVideo.play()
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            //  绘制图片（拍照功能）
            setImage () {
                var _this = this
                // 点击，canvas画图
                _this.thisContext.drawImage(_this.thisVideo, 0, 0, _this.videoWidth, _this.videoHeight)
                // 获取图片base64链接
                var image = this.thisCancas.toDataURL('image/png')
                _this.imgSrc = image
                this.$emit('refreshDataList', this.imgSrc)
            },
            // base64转文件
            dataURLtoFile (dataurl, filename) {
                var arr = dataurl.split(',')
                var mime = arr[0].match(/:(.*?);/)[1]
                var bstr = atob(arr[1])
                var n = bstr.length
                var u8arr = new Uint8Array(n)
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n)
                }
                return new File([u8arr], filename, { type: mime })
            },
            // 关闭摄像头
            stopNavigator () {
                this.thisVideo.srcObject.getTracks()[0].stop()
            },
            //get community data
            getData(){
                this.$axios.get('/api/landlords/page/'+this.$data.currentPage+'/'+this.$data.pageSize)
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
                this.$axios.get('/api/landlords/page/'+val+'/'+pageSize)
                    .then(function (response) {
                        this.$data.total = response.data.records;
                        this.$data.tableData = response.data.rows;
                    }.bind(this))
                    .catch(function (error) {

                    });
            },
            //add landlords
            add(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/api/landlords/insert',
                            this.$data.roleForm)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'添加业主成功',
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
            //get landlords
            edit(id){
                //根据id赋值
                this.$axios.get('/api/landlords/id/'+id).then(function (response) {
                    this.$data.roleForm = response.data;
                    this.$data.editPage = true;
                }.bind(this)).catch(function (error) {
                    alert(error)
                });
            },
            //save landlords
            save(formName){
                //修改信息
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/api/landlords/save',
                            this.$data.roleForm)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$message({
                                            type:"success",
                                            message:'编辑业主成功',
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
                        this.$axios.get('/api/landlords/delete/'+id)
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
