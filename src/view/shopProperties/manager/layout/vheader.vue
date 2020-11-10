<template>
  <div class="wrapper">
    <div class="content">
      <div class="right">
        <i class="el-icon-refresh" @click="reload">
          <el-tooltip effect="dark" :content="fullscreen ? `取消全屏`:`全屏`" placement="bottom">
          </el-tooltip>
        </i>

        <!--full screen -->
        <i class="el-icon-full-screen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen ? `取消全屏`:`全屏`" placement="bottom">
          </el-tooltip>
        </i>
        <!--the postion of traders. it's for location-->
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            {{realName}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>金星</el-dropdown-item>
            <el-dropdown-item>火星</el-dropdown-item>
            <el-dropdown-item>木星</el-dropdown-item>
            <el-dropdown-item><router-link to="as">更多小区<i class="el-icon-arrow-right"></i></router-link></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!--welcome information-->
        <span style="font-size: 12px; color: grey">欢迎 <b>{{realName}}</b>访问物业管理系统</span>
        <!--消息通知-->
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <el-badge  is-dot  class="item" style="line-height: 20px;margin-bottom: 10px;width: 20px;">
              <i class="el-icon-bell" size="small"></i>
          </el-badge>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              公告
            </el-dropdown-item>
            <el-dropdown-item>
              评论
            </el-dropdown-item>
            <el-dropdown-item>
              点赞
            </el-dropdown-item>
            <el-dropdown-item>
              <el-badge :value=msgNum class="item" style="line-height: 20px;margin-left: 32px">
                通知
              </el-badge>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!--退出按钮-->
        <i class="el-icon-caret-right" @click="exit">退出</i>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "vheader",
        data(){
            return{
                fullscreen: false,
                realName:'爱久',
                msgNum:100,
            }
        },
        components:{

        },
        methods:{
            getInfo(){
                let item = localStorage.getItem("managerinfo");
                this.$data.realName = JSON.parse(item).realName;
            },
            exit(){
                localStorage.removeItem('Authorization');
                this.$router.push("/login");
            },
            handleFullScreen(){
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            },
            reload(){
              location.reload();
            },
        },
        created() {
            this.getInfo();
        }
    }
</script>

<style scoped>
  a{
    text-decoration: none;
    color: black;
  }
  .wrapper{
    height: 50px;
    box-shadow: 0 0 1px 0px rgba(0,0,0,0.15);
    overflow:hidden;
  }
  .content{
    margin: 0 auto;
    width: 100%;
    line-height: 50px;
  }
  .left{
    float: left;
  }
  .right{
    float: right;
    margin-right: 10px;
  }
  .right span{
    margin-right: 20px;
    font-weight: bold;
  }
  .right i{
    margin-right: 30px;
  }
  .right b{
    color: red;
    font-size: 18px;
  }
  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
  .el-dropdown-menu__item{
    text-align: center;
    width: 100px;
    color: #160a09;
  }
  .el-dropdown-menu__item:not(.is-disabled):hover{
    background-color:grey;
    color: #e1e1e1;
  }
</style>
