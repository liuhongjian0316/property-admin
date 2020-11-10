<template>
  <fragment>
    <fragment  v-for="list in items" :key="list.id">
      <el-submenu :index="list.url" v-if="list.subs">
        <template slot="title">
          <i :class=list.icon></i>
          <span>{{list.name}}</span>
        </template>
        <label>
          <menuUtils :items="list.subs"></menuUtils>
        </label>
      </el-submenu>
      <el-menu-item v-else :index="list.url">
        <i :class=list.icon></i>
        <span slot="title">{{list.name}}</span>
      </el-menu-item>
    </fragment>
  </fragment>
</template>
<script>
    export default {
        name: "menuUtils",
        props: ['items'],
        data(){
          return {
              menus: [],
          }
        },
        components:{

        },
        methods: {
            handleOpen(key, keyPath) {

            },
            handleClose(key, keyPath) {

            },
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>
