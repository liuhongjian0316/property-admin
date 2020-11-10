<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">注册用户</div>
      <el-form :model="param" :rules="rules"  ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="tel">
          <el-row>
            <el-col :span="24">
              <el-input  placeholder="手机号" v-model="param.phone">
                <el-button slot="prepend" icon="el-icon-user"></el-button>
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="tel">
          <el-row>
            <el-col :span="14">
              <el-input  placeholder="请输入验证码" v-model="param.code" @keyup.enter.native="submitForm()">
              </el-input>
            </el-col>
            <el-col :span="10">
              <el-button type="primary" @click="getcode"  :disabled=disabledflag>获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm">注册</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
    export default {
        data(){
            return{
                param: {
                    phone: '13136823696',
                    code: '',
                },
                disabledflag: false,
                rules: {
                    phone: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur'}
                        ],
                    code: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                },
            }
        },
        methods:{
            getcode(){
                this.$message({
                    type:"success",
                    message:"获取成功",
                });
                this.disabledflag = true;
                //模拟60s后按钮才能点击
                setTimeout(() => {
                    this.disabledflag = false;
                }, 60000);
                //获取验证码
                // this.$axios.get('/api/getCode?phone='+this.param.phone)
                //     .then(function (response) {
                //         if(response.data.status == '200'){
                //             console.log(response)
                //         }else{
                //
                //         }
                //     }.bind(this))
                //     .catch(function (error) {
                //
                //     });
            },
            codeIsEq(){
                this.$axios.post('/api/getCodeReflush',this.param)
                    .then(function (response) {
                        if(response.data.status == '200'){
                            console.log(response)
                            return true;
                        }else{
                            return false;
                        }
                    }.bind(this))
                    .catch(function (error) {

                    });
                return false;
            },
            submitForm(){
                console.log("表单提交")
                this.$refs.login.validate(valid => {
                    if (valid && this.codeIsEq()) {
                        //axios
                      console.log("表单提交")
                    }else{
                        this.$message({
                            type:"error",
                            message:'验证码不正确',
                        });
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
  .login-wrap {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: url('../../assets/images/login-bg.jpg') no-repeat ;
    background-size: 100% 100%;
  }
  .ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: orangered;
    border-bottom: 1px solid #ddd;
  }
  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }
  .ms-content {
    padding: 30px 30px;
  }
  .login-btn {
    text-align: center;
  }
  .login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
  }
</style>
