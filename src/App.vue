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
      // let userData = this.urlDataTurnObj(window.location.href);
      // userData = JSON.parse(userData);
      // if (location.href.indexOf('sellerHome') !== -1) {
      //   this.checkIsShop(userData);
      // }

      // this.$router.push('/login');

      let code = location.href.split('=')[1].split('&')[0];

      // let code = '001W2XZ60rUfsH1Tsa070l93070W2XZn'

      let res = await this.$api.getData('https://m.yixiutech.com/user/wx/' + code);

      alert(JSON.stringify(res));

    },
    data () {
      return {
        active: false
      }
    },
    methods: {
      async checkIsShop (userData) {
        let res = await this.$api.sendData('https://m.yixiutech.com/shop/user/', {openid: userData.openid});
        if (res.code == 4004) {
          this.$router.push('/enterRules');
          return;
        }
        localStorage.setItem('shopData', JSON.stringify(res.data));
        this.$router.push('/sellerHome')
      },
      // 是不是app，用接口判断是否有openid
      async checkIsApp (userData) {
        let res = await this.$api.sendData('https://m.yixiutech.com/shop/user/', {openid: userData.openid});
        if (res.code !== 200) {
          this.$router.push('/enterRules');
          return;
        }
        localStorage.setItem('shopData', JSON.stringify(res.data));
        this.$router.push('/login');
      }
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
    /* height: 92%; */
    min-height: 480px;
    overflow: scroll;
  }
  .nav{
    position: relative;
    top: 0;
  }
</style>
