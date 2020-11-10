<template>
  <div>
    <div style="width: 98%;margin: 0 auto;">
      <img src="@/assets/images/repair.gif" alt="logo" width="100%" height="200" >
    </div>
    <el-row>
      <el-col :span="24" style="margin-top: 20px">
        <el-card style="width: 98%;margin: 0 auto;">
          <el-steps :active=active align-center>
            <el-step @click="this.active = 1" title="选择维修类型"></el-step>
            <el-step title="新建维修申请单"></el-step>
            <el-step title="支付金额"></el-step>
          </el-steps>
        </el-card>
      </el-col>
    </el-row>
    <!--step 1-->
    <el-row>
      <div v-if="this.active == 1">
        <el-col :span="24" style="margin-top: 20px">
          <el-card style="width: 98%;margin: 0 auto;">
            <div slot="header" class="clearfix">
              <span>故障类型</span>
            </div>
            <div>
              <el-row>
                <div v-for="(item,index) in repairType" :key="index">
                  <el-col :span="6" style="margin-top: 20px" v-if="index>3">
                    <el-tag @click="choiceType(item.workTypeId)">{{item.workTypeName}}</el-tag>
                  </el-col>
                  <el-col :span="6" v-else>
                    <el-tag @click="choiceType(item.workTypeId)">{{item.workTypeName}}</el-tag>
                  </el-col>
                </div>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </div>
    </el-row>
    <!--step 2-->
    <el-row>
      <div v-if="this.active == 2">
        <el-col :span="24" style="margin-top: 20px">
          <el-card style="width: 98%;margin: 0 auto;">
            <div slot="header" class="clearfix">
              <span>填写报修单</span>
            </div>
            <div>
              <!--form-->
              <el-form  ref="form" :model="form"  :rules="rule"  label-width="80px" size="small">
                <el-form-item label="悬赏金额" prop="rewardMoney">
                  <el-input v-model="form.rewardMoney" placeholder="请填写悬赏金额（单位：元）"> </el-input>
                </el-form-item>
                <el-form-item label="商铺名称" prop="shopName">
                  <el-input v-model="form.shopName" placeholder="请填写商铺名称"> </el-input>
                </el-form-item>
                <el-form-item label="申请人" prop="applyName">
                  <el-input v-model="form.applyName" placeholder="请填写申请人"> </el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="tel">
                  <el-input v-model="form.tel" placeholder="请填写联系电话"> </el-input>
                </el-form-item>
                <el-form-item label="预约时间" prop="reserveTime">
                  <el-date-picker
                    style="width: 100%;"
                    v-model="form.createTime"
                    :picker-options="pickerOptions"
                    type="datetime"
                    placeholder="选择日期时间"
                    default-time="09:00:00">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="详细位置" prop="address">
                  <el-row>
                    <el-col :span="12">
                      <el-cascader
                      placeholder="请选择"
                      style="width: 100%"
                      size="mini"
                      :options="options"
                      v-model="cityCode"
                      @change="addressChange">
                      </el-cascader>
                    </el-col>
                    <el-col :span="12"><el-input v-model="form.address" placeholder="请填写详细位置"> </el-input></el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="故障描述" prop="faultDescriptionContent">
                  <mavon-editor v-model="form.faultDescriptionContent" ref="md" @imgAdd="$imgAdd" @change="change" style="min-height: 400px"/>
                </el-form-item>
                <el-form-item label="备注信息">
                  <el-input v-model="form.remark" placeholder="请填写备注信息,可不填"> </el-input>
                </el-form-item>
              </el-form>
              <div style="float: right;margin-top: -20px">
                <el-button class="editor-btn" size="mini" @click="previous">上一步</el-button>
                <el-button class="editor-btn" size="mini" @click="next('form')">下一步</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </div>
    </el-row>
    <el-row>
      <div v-if="this.active == 3">
        <el-col :span="24" style="margin-top: 20px">
          <el-card style="width: 98%;margin: 0 auto;">
            <div slot="header" class="clearfix">
              <span>支付</span>
            </div>
            <div style="margin: 0 30%">
              <img src="@/assets/images/pay.jpg" alt="" width="400px" height="400px">
            </div>
            <div style="float: right;margin-top: -20px">
              <el-button class="editor-btn" size="mini" @click="previous">上一步</el-button>
              <el-button type="primary" class="editor-btn" size="mini" @click="submit('form')">提交</el-button>
            </div>
          </el-card>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>
    import { regionData,CodeToText } from 'element-china-area-data'
    export default {
        name: "repairApply",
        data(){
            return{
                userid:'1',
                //城市三级
                options: regionData,
                cityCode:[],
                active: 1,//步骤条
                pickerOptions:{
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }

                },
                repairType:[],
                form:{
                    rewardWorkOderId:'',
                    workTypeId:'',
                    shopId:'',
                    shopName:'',
                    applyName:'',
                    tel:'',
                    createTime:'',
                    address:"",
                    remark:"",
                    faultDescriptionContent:'',
                    faultDescription:'',
                    rewardMoney:'',
                },//申请表单
                rule:{
                    rewardMoney: [
                        { required: true, message: '请填写悬赏金额', trigger: 'blur' },
                        { pattern: /^[0-9]+(.[0-9]{2})?$/ , message: '请输入合法金额' },
                    ],
                    shopName: [
                        { required: true, message: '请填写商户名称', trigger: 'blur' },
                    ],
                    applyName: [
                        { required: true, message: '请填写姓名', trigger: 'blur' },
                    ],
                    tel: [
                        { required: true, message: '请填写联系电话', trigger: 'blur' },
                        { pattern: /^1[3|4|5|7|8][0-9]{9}$/ , message: '请填写合法手机号' },
                    ],
                    createTime: [
                        { required: true, message: '请选择预约时间', trigger: 'blur' },
                    ],
                    address: [
                        { required: true, message: '请填写详细信息', trigger: 'blur' },
                    ],
                    faultDescriptionContent: [
                        { required: true, message: '请填写故障描述', trigger: 'blur' },
                    ],

                },//校验
                //富文本
                content:'',
                html:'',
                configs: {
                }
            }
        },
        methods: {
            //选择维修类型
            choiceType(id){
                this.$data.form.workTypeId = id;
                this.$data.active = 2;
                this.$message.success('请认真填写，方便我们为你提高更好的服务！！！');
                let item = localStorage.getItem("shopinfo");
                this.$data.form.shopName = JSON.parse(item).name;
                this.$data.form.applyName = JSON.parse(item).realname;
                this.$data.form.tel = JSON.parse(item).tel;
                this.$data.form.address = JSON.parse(item).address;

            },
            //获取报修类型列表
            getWorkType(){
                this.$axios.get('/api/sp/admin/worktype/list')
                    .then(function (response) {
                        this.$data.repairType = response.data;
                    }.bind(this))
                    .catch(function (error) {
                    });
            },
            // 将图片上传到服务器，返回地址替换到md中
            $imgAdd(pos, $file){
                var formdata = new FormData();
                formdata.append('file', $file);
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
            previous(){
                this.$data.active--;
            },
            next(formName){
                this.$refs[formName].validate((valid) => {
                        if (valid) {
                            if(this.$data.active < 3 && this.$data.active > 1){
                                this.$data.active ++;
                            }
                        }
                })
            },
            //支付成功，自动提交表单
            submit(formName){
                //上面下一步的时候 已经校验过
                this.$data.form.shopId = this.$data.userid;
                this.$data.form.faultDescription = this.$data.html;
                this.$axios.post('/api/sp/shop/reward/order/publish',
                    this.$data.form)
                    .then(function (response) {
                        if(response.data.status == '200'){
                            let loding = this.createLoding();
                            setTimeout(() => {
                                loding.close();
                                this.$alert('请等待维修员的接单', '提示', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        location.reload();
                                    }
                                });
                            }, 1000);
                        }
                    }.bind(this))
                    .catch(function (error) {
                    });
            },
            addressChange(arr) {
                this.$data.form.address = CodeToText[arr[0]]+CodeToText[arr[1]]+CodeToText[arr[2]];
            },
            createLoding(){
                return this.$loading({
                    lock: true,//lock的修改符--默认是false
                    text: '加载中',//显示在加载图标下方的加载文案
                    spinner: 'el-icon-loading',//自定义加载图标类名
                    background: 'rgba(0, 0, 0, 0.7)',//遮罩层颜色
                    target: document.querySelector('#table')//loadin覆盖的dom元素节点
                });
            },
        },
        created() {
            this.getWorkType();
        }
    }
</script>

<style scoped>
  .editor-btn{
    margin-top: 20px;
  }
</style>
