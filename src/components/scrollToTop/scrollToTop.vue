<template>
  <div id="app">
    <el-backtop target="#app" :visibility-height="100"></el-backtop>
  </div>
</template>

<script>
    export default {
        name: "App",
        data() {
            return {};
        },
        methods: {},
        mounted() {}
    };
</script>

<style>
  #app {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    max-height: 720px;
    /* 这里给app一个滚动效果 */
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>

