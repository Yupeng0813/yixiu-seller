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

      alert(location.href);

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

        // 如果用户存在的情况下
        if (user == undefined) {
          // 不存在的情况下, 让他注册, 进入用户条款
          this.$router.push('/enterRules');

          return;
        } else {
          // 进商家首页

          let shop = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
            collection: 'Shop',
            findType: 'findOne',
            owner: user.data._id
          })

          // 如果有该用户，但是没有注册店铺的

          // 店铺不存在
          if (shop == undefined) {
            this.$router.push('/enterRules');
          } else {
            sessionStorage.setItem('shopData', JSON.stringify(shop.data));

            this.$router.push('/sellerHome');
          }
        }

        // this.isWeixin();
      } else {
        // 非微信环境

        this.$router.push('/service');

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
