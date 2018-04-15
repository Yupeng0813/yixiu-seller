<template>
  <div class="login">
    <img :src="logo" alt="" class="logo" />
    <div class="loginBox">
      <div class="loginDes">
        <span>用户名</span>
        <input type="text" placeholder="" v-model="user.username">
      </div>
      <div class="loginDes">
        <span>密码</span>
        <input type="password" v-model="user.password">
      </div>
    </div>
    <div class="buttons">
      <div class="loginButton">
        <button @click="login">立即登录</button>
      </div>
      <div class="register">
        <span @click="toRegister">立即注册</span>
      </div>
    </div>
  </div>
</template>

<script>
  import logo from '@/assets/logo.png';
  import md5 from 'js-md5'; //MD5加密
  export default {
    async mounted () {
      let res = this.$api.sendData('https://m.yixiutech.com/sql/remove', {
        collection: 'Shop',
        _id: '5ad2eaac0334c647774ef046'
      })
    },
    methods: {
      wechatLogin () {
        location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx92877f3243727d9b&redirect_uri=http://m.yixiutech.com/yixiuseller&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"
      },
      toRegister () {
        this.$router.push('/register');
      },
      async login () {
        for (var key in this.user) {
          if (this.user[ key ] == '') {
            this.prompt('您还有信息未填写', 'error').sho+w();
            return;
          }
        }

        this.user.password = md5(this.user.password);

        let userInfo = await this.$api.sendData('https://m.yixiutech.com/login', this.user);

        if (userInfo.code !== 200) {
          this.prompt(userInfo.errMsg, 'error').show();
          return;
        }

        sessionStorage.setItem('user', JSON.stringify(userInfo.data));

        let shop = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
          collection: 'Shop',
          findType: 'findOne',
          owner: userInfo.data._id
        })

        // 店铺不存在
        if (shop == undefined || JSON.stringify(shop.data) == '{}' ) {
          this.$router.push('/enterRules');
        } else {
          // 店铺存在，跳转用户页
          sessionStorage.setItem('shopData', JSON.stringify(shop.data));
          this.$router.push('/sellerHome');
        }
      }
    },
    components: {},
    data() {
      return {
        logo: logo,
        user: {
          username: '',
          password: ''
        }
      }
    }
  }

</script>

<style scoped>
  .login {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    text-align: center;
    min-height: 480px;
    /* background: url('.+/log-bg.jpg') center center no-repeat; */
    /* background-size: 100% 100%; */
    background: -webkit-linear-gradient(left top, #6bc8b7, #3878cd);
    /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(bottom right, #6bc8b7, #3878cd);
    /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(bottom right, #6bc8b7, #3878cd);
    /* Firefox 3.6 - 15 */
    background: linear-gradient(to bottom right, #6bc8b7, #3878cd);
    /* 标准的语法 */
  }

  .logo {
    width: 50%;
    display: inline-block;
    margin-top: 10%;
  }

  .login h3 {
    font-size: 45px;
    color: #fff;
    width: 100%;
    height: auto;
    text-align: center;
    margin-top: 40%;
  }
  .login .loginBox{
    width: auto;
    height: auto;
    margin-top: 5%;
  }
  .login .loginBox .loginDes{
    text-align: left;
    margin: 0 auto;
    padding: 20px 0;
    width: 210px;
    height: 30px;
  }
  .login .loginBox .loginDes span{
    display: inline-block;
    width: 60px;
    height: 20px;
    line-height: 20px;
    color: #fff;
  }
  .login .loginBox .loginDes input{
    width: 150px;
    height: 20px;
    /* border: none; */
    float: right;
    background: none;
    border-bottom: 1px solid #fff;
  }
  .login .buttons .loginButton{
    width: auto;
    text-align: center;
  }
  .login .buttons .loginButton button{
    width: 140px;
    margin: 20px auto;
    border: none;
    background: none;
    color: #fff;
    font-size: 23px;
  }
  .login .buttons .register{
    text-align: center;
    color: #fff;
    font-size: 13px;
  }
  .login .buttons .register span{
    display: inline-block;
    padding: 5px;
  }
</style>
