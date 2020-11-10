<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">员工登录</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="用户名">
            <el-button slot="prepend" icon="el-icon-user"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input
            type="password"
            placeholder="密码"
            v-model="param.pwd"
            @keyup.enter.native="submitForm()"
          >
            <el-button slot="prepend" icon="el-icon-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
      </el-form>
      <div class="login-btn">
      <span>还没有账号？ <router-link to='/register'>立即注册</router-link></span>
      </div>
    </div>
  </div>
</template>

<script>
  import menu from "@/utils/menuUtils";
    class Storage{
        constructor(name){
            this.name = 'storage';
        }
        //设置缓存
        setItem(params){
            let obj = {
                name:'',
                value:'',
                expires:5000, //过期时间
                startTime:new Date().getTime()//记录何时将值存入缓存，毫秒级
            }
            let options = {};
            //将obj和传进来的params合并
            Object.assign(options,obj,params);
            if(options.expires){
                //如果options.expires设置了的话
                //以options.name为key，options为值放进去
                localStorage.setItem(options.name,JSON.stringify(options));
            }else{
                //如果options.expires没有设置，就判断一下value的类型
                let type = Object.prototype.toString.call(options.value);
                //如果value是对象或者数组对象的类型，就先用JSON.stringify转一下，再存进去
                if(Object.prototype.toString.call(options.value) == '[object Object]'){
                    options.value = JSON.stringify(options.value);
                }
                if(Object.prototype.toString.call(options.value) == '[object Array]'){
                    options.value = JSON.stringify(options.value);
                }
                localStorage.setItem(options.name,options.value);
            }
        }
        //拿到缓存
        getItem(name){
            let item = localStorage.getItem(name);
            //先将拿到的试着进行json转为对象的形式
            try{
                item = JSON.parse(item);
            }catch(error){
                //如果不行就不是json的字符串，就直接返回
                item = item;
            }
            //如果有startTime的值，说明设置了失效时间
            if(item.startTime){
                let date = new Date().getTime();
                //何时将值取出减去刚存入的时间，与item.expires比较，如果大于就是过期了，如果小于或等于就还没过期
                if(date - item.startTime > item.expires){
                    //缓存过期，清除缓存，返回false
                    localStorage.removeItem(name);
                    return false;
                }else{
                    //缓存未过期，返回值
                    return item.value;
                }
            }else{
                //如果没有设置失效时间，直接返回值
                return item;
            }
        }
        //移出缓存
        removeItem(name){
            localStorage.removeItem(name);
        }
        //移出全部缓存
        clear(){
            localStorage.clear();
        }
    }
    export default {
        components:{
            "v-menu":menu
        },
        data: function() {
            return {
                param: {
                    username: '',
                    pwd: '',
                    deviceId:  Math.uuid,
                },
                rules: {
                    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                },
            };
        },
        methods: {
            createLoding(){
                return this.$loading({
                    lock: true,//lock的修改符--默认是false
                    text: '登录中',//显示在加载图标下方的加载文案
                    spinner: 'el-icon-loading',//自定义加载图标类名
                    background: 'rgba(0, 0, 0, 0.7)',//遮罩层颜色
                    target: document.querySelector('#table')//loadin覆盖的dom元素节点
                });
            },
            //提交表单
            submitForm() {
                this.$refs.login.validate(valid => {
                    if (valid) {
                        this.$axios.post('/api/sp/manager/login',
                            this.$data.param)
                            .then(function (response) {
                                if(response.data.status == '200'){
                                    //将员工信息存入localStorage
                                    localStorage.setItem("managerinfo",JSON.stringify(response.data.data));
                                    var storage = new Storage();
                                    storage.setItem({"name":"Authorization","value":"12312312331"});
                                    this.$router.push(this.$route.query.redirect);
                                   //localStorage.setItem("Authorization",response.headers.authorization);
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                        this.$router.push({path:'/sp/manager/index'});
                                    }, 1000);
                                }else{
                                    let loding = this.createLoding();
                                    setTimeout(() => {
                                        loding.close();
                                    }, 1000);
                                    this.$message({
                                        type:"error",
                                        message:'账号或密码错误',
                                    });
                                }
                            }.bind(this))
                            .catch(function (error) {

                            });
                    } else {
                        this.$message({
                            type:"error",
                            message:'数据不合法',
                        });
                        return false;
                    }
                });
            },
        },
    };
</script>

<style scoped>
  .login-wrap {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: url('../../../../assets/images/login-bg.jpg') no-repeat ;
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
