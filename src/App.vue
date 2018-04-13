<template>
  <div id="app">
    
    <div class="appBox">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive">
        <!-- 这里是会被缓存的视图组件-->
        </router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive">
        <!-- 这里是不被缓存的视图组件-->
      </router-view>
    </div>
  </div>
</template>

<script>
  import { reguser } from './views/common/api'
  export default {
    name: 'App',
    async created() {
      let code = location.href.indexOf('code') !== -1 && location.href.split('=')[1].split('&')[0];

      if (code) {
        // 如果是微信

        // 获取微信信息
        let res = await this.$api.getData('https://m.yixiutech.com/user/wx/' + code);

        sessionStorage.setItem('userInfo', JSON.stringify(res));

        this.openid = res.openid;

        let user = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
          collection: 'User',
          findType: 'findOne',
          'wx.openid': this.openid
        })

        if (user == undefined) {
          // 用户在系统中不存在的情况下, 让他注册
          this.$router.push('/register');
        
        } else {
          // 用户注册过的情况下
          this.$router.push('/login');
          
        }

      } else {
        // 非微信环境
        this.$router.push('/login');

      }
    },
    data () {
      return {
        active: false,
        openid: ''
      }
    },
    methods: {
      
    }
  }
</script>


<style scoped>
  #app{
    position: fixed;
    top: 0;
    left: 0;
    /* height: 97%;
    min-height: 550px; */
  }
  .van-field input, .van-field textarea{
    text-align: right;
  }
  .appBox{
    width: 100%;
    height: 100%;
    min-height: 480px;
    overflow: scroll;
  }
  .nav{
    position: relative;
    top: 0;
  }
</style>
