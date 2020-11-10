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
  import sider from '@/view/shopProperties/manager/layout/sideMenu.vue'
  import vheader from '@/view/shopProperties/manager/layout/vheader.vue'
  import scrollToTop from '@/components/scrollToTop/scrollToTop.vue';
  import reload from '@/components/reloadButton/reloadButton.vue';
    export default {
        name: "index",
        data(){
            return{

            }
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
