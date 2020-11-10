<template>
  <div>
    <div class="sidebar">
      <el-menu
        :default-active=$route.path
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapse"
        background-color="#324157"
        text-color="#bfcbd9"
        active-text-color="#20a0ff"
        unique-opened
        router>
        <el-menu-item style="color: red" @click="openClose">
          <i style="color: red">Aijiu</i>
          <span>物业维修后台</span>
        </el-menu-item>
        <menuUtils :items="items"></menuUtils>
      </el-menu>
    </div>
  </div>
</template>

<script>
    import menuUtils from "@/utils/menuUtils";
    export default {
        data () {
            return {
                isCollapse: false,
                items: [],
                currentUrl:'',
            }
        },
        components:{
            'menuUtils': menuUtils,
        },
        methods: {
            getAData(val) {
                //   console.log(`a组件传递过来的数据: ${val}`); //
                this.$refs.menu.activeIndex = val;
            },
            handleOpen(key, keyPath) {

            },
            handleClose(key, keyPath) {

            },
            openClose(){
                this.$data.isCollapse = !this.$data.isCollapse;
            },
            jump(e){
                window.open(e);
            },
            loadeMenu(){
                this.$axios.get('/api/permisson/spMenu/'+2)
                    .then(function (response) {
                        this.$data.items = response.data;
                    }.bind(this))
                    .catch(function (error) {
                        console.log('发生异常了'+error)
                    });
            },
        },
        mounted() {
            this.loadeMenu();
        }
    }
</script>

<style scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 180px;
  }
  .sidebar {
    padding: 0;
    margin: 0;
    height: 1000px;
    overflow-y: scroll;
  }
  .sidebar::-webkit-scrollbar {
    width: 0;
  }
  .sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
  }
  .sidebar > ul {
    height: 100%;
  }
</style>

