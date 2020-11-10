<template>
  <div class="reload">
    <div class="reloadbox">
      <el-button @click="reload" icon="el-icon-refresh" circle ></el-button>
    </div>
  </div>
</template>

<script>
    export default {
        data () {
            return {

            }
        },
        methods: {
            reload(){
                window.location.reload();
            }
        }
    }
</script>

<style>
  .reload{
    position: fixed;
    right: 0px;
    bottom: 0px;
    margin-bottom: 80px;
    margin-right: 30px;
  }
  .reloadbox{
    width: 50px;
    height: 50px;
  }
</style>
