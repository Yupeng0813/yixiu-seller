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

      let winUrl = window.location.href;
      //带参数
      if (winUrl.indexOf('?') !== -1) {
        let userData = this.urlDataTurnObj(window.location.href);
        userData = JSON.parse(userData);
        // alert(window.location.href);
        console.log(userData);

        if (userData.state) {
          if (userData.state == 123) { //公众号进入
            sessionStorage.setItem("code", userData.code);
            let res = await this.$api.getData(`https://m.yixiutech.com/user/wx/${userData.code}`);
            let useInfo = this.initUserInfo(res);
            sessionStorage.setItem("userData", JSON.stringify(useInfo));
            if(useInfo.wx.openid){
              let reqUser = {
                wx: useInfo.wx
              }
              let ri = this.$api.sendData("https://m.yixiutech.com/User", reqUser);

              alert(JSON.stringify(ri));
              this.$toast("微信自动登录成功");
            }
            
          } else {

          }
        } else {
          
        }

      } else { // 不带参数

      }
      // let code = location.href.indexOf('code') !== -1 && location.href.split('=')[1].split('&')[0];

      // if (code) {
      //   let res = await this.$api.getData('https://m.yixiutech.com/user/wx/' + code);

      //   sessionStorage.setItem('userInfo', JSON.stringify(res));

      //   this.openid = res.openid;

      //   this.isWeixin();
      // } else {

      //   this.$router.push('/login');

      // }

      // this.isWeixin();
    },
    data () {
      return {
        active: false,
        // openid: ''
      }
    },
    methods: {
      initUserInfo(data) { //初始化用户信息
        const information = {
          headimgurl: data.headimgurl || '',//用户头像
          name: data.nickname || '翼修用户', //用户名称
          email: data.email || '', //邮箱
          mobile: data.mobile || '', //手机号
          password: data.password || '', //密码
          isSys: data.isSys || false, //是否是系统管理员
          role: data.role || [], //如[{name:'普通用户',power:1000},{name:'商家',power,2000}]
          wx: data, //微信信息:如openid,昵称和头像链接等等
          parent: data.parent || 0
        }
        if (information.parent === 0) {
          delete information.parent
        }

        return information;
      },
      async isWeixin () {
        // let res = await this.$api.sendData('https://m.yixiutech.com/shop/user/', {openid: this.openid});
        let res = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
          collection: 'Shop',
          findType: 'findOne',
          owner: '5acb640168b9f01ee807e7bd'
        })
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
    height: 100%;
    min-height: 480px;
    overflow: scroll;
  }
  .nav{
    position: relative;
    top: 0;
  }
</style>
