<template>
  <div>
    <div class="wrapper">
      <div class="stable">
        <v-sider></v-sider>
      </div>
      <div class="change">
        <v-header></v-header>
        <router-view/>

      </div>
    </div>
    <!--刷新按钮-->
    <v-reload></v-reload>
    <v-scrollToTop></v-scrollToTop>
  </div>
</template>

<script>
  import sider from '@/view/shopProperties/admin/layout/sideMenu.vue'
  import vheader from '@/view/shopProperties/admin/layout/vheader.vue'
  import scrollToTop from '@/components/scrollToTop/scrollToTop.vue';
  import reload from '@/components/reloadButton/reloadButton.vue';
  var ws;
  //避免重复连接
  var lockReconnect = false;
  var wsUrl = "ws://localhost:8888/websocket";
  createWebSocket(wsUrl);
  function createWebSocket(url) {
      try {
          ws = new WebSocket(url);
          initEventHandle();
      } catch (e) {
          //重新连接
          reconnect(url);
      }
  }

  window.initEventHandle = function(){
      ws.onclose = function () {
          console.info("连接关闭");
          reconnect(wsUrl);
      };
      ws.onerror = function () {
          console.info("传输异常");
          reconnect(wsUrl);
      };
      ws.onopen = function () {
          //心跳检测重置
          heartCheck.reset().start();
      };

      ws.onmessage = function(event) {
          console.info(event.data);
          if(event.data=="2"){
              layer.alert("有任务要处理",function (index) {
                  layer.close(index);
                  location.reload();
              });
          }
          //如果获取到消息，心跳检测重置
          heartCheck.reset().start();
      }
  }
  function reconnect(url) {
      if(lockReconnect) return;
      lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      setTimeout(function () {
          createWebSocket(url);
          lockReconnect = false;
      }, 5000);
  }
  //心跳检测,每5s心跳一次
  var heartCheck = {
      timeout: 5000,
      timeoutObj: null,
      serverTimeoutObj: null,
      reset: function(){
          clearTimeout(this.timeoutObj);
          clearTimeout(this.serverTimeoutObj);
          return this;
      },
      start: function(){
          var self = this;
          this.timeoutObj = setTimeout(function(){
              //这里发送一个心跳，后端收到后，返回一个心跳消息，
              //onmessage拿到返回的心跳就说明连接正常
              self.serverTimeoutObj = setTimeout(function(){
                  //如果超过一定时间还没重置，说明后端主动断开了

                  ws.close();
                  //如果onclose会执行reconnect，我们执行ws.close()就行了.
                  //如果直接执行reconnect 会触发onclose导致重连两次
              }, self.timeout)
          }, this.timeout)
      }
  }
    export default {
        name: "index",
        data(){
            return{

            }
        },
        methods:{
            contect(){
                this.$axios.get('/api/message')
                    .then(function (response) {
                    }.bind(this))
                    .catch(function (error) {

                    });
                // var ws = new WebSocket("ws://localhost:8888/websocket");
                //
                // ws.onopen = function(evt) {  //绑定连接事件
                //     console.log("Connection open ...");
                //     ws.send("发送的数据");
                // };
                //
                // ws.onmessage = function(evt) {//绑定收到消息事件
                //     console.log( "Received Message: " + evt.data);
                // };
                //
                // ws.onclose = function(evt) { //绑定关闭或断开连接事件
                //     console.log(evt)
                //     console.log("Connection closed.");
                // };
            }
        },
        created(){
            this.contect();
        },
        components:{
            'v-sider': sider,
            'v-header': vheader,
            'v-scrollToTop': scrollToTop,
            'v-reload': reload,
        },
    }
</script>

<style scoped>
  .wrapper{
    display: inline-flex;
    display:flex;/*设为伸缩容器*/
    flex-flow:row;/*伸缩项目单行排列*/
  }
  .stable{
    height: 100%;
  }
  .change{
    flex:1;
    width: auto;
  }
  .wrappers{
    height: 50px;
    box-shadow: 0 0 1px 0px rgba(0,0,0,0.15);
    overflow:hidden;
  }
  .content{
    margin: 0 auto;
    width: 100%;
    line-height: 50px;
  }
</style>
