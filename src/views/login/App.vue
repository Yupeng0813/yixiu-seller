<template>
  <div class="login">
    <img :src="logo" alt="" class="logo" />
    <h3>Welcome</h3>
    <div class="loginBox">
      <div class="loginDes">
        <span>手机号</span>
        <input type="text" placeholder="手机号" v-model="username">
      </div>
      <div class="loginDes">
        <span>密码</span>
        <input type="password" v-model="password">
      </div>
      <div @click="loginNow" class="loginButton">
        <!-- <button>立即登录</button> -->
        <span>立即登录</span>
      </div>
      <div class="register">
        <span @click="forgetPassword">忘记密码?</span>|<span @click="toRegister">立即注册</span>
      </div>
    </div>
    
    <div class="buttons">
      <!-- <div class="loginButton">
        <button @click="login">立即登录</button>
      </div>
      <div class="register">
        <span @click="forgetPassword">忘记密码?</span>|<span @click="toRegister">立即注册</span>
      </div> -->
    </div>
    <wx-login class="wxLogin"></wx-login>
  </div>
</template>

<script>
  import logo from '@/assets/logo.png';
  import wxLogin from './components/wxLogin.vue'
  import md5 from 'js-md5'; //MD5加密
  export default {
    components: {
      wxLogin
    },
    methods: {
      forgetPassword(){
        this.$router.push("/forget");
      },
      wechatLogin () {
        location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx92877f3243727d9b&redirect_uri=http://m.yixiutech.com/yixiuseller&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"
      },
      toRegister () {
        this.$router.push('/register');
      },
      async loginNow () {

        let that = this;
        let openid = sessionStorage.getItem("openid");

        let data = {
          "username":that.username,//这里填手机号,用这个字段名称是为了以后可以拓展
          "password":md5(that.password)//注册的时候用什么加密,这里就用什么加密方式,不要明文
        }

        //登录
        let res = await this.$api.sendData(`https://m.yixiutech.com/login`, data);
        console.log(res);
        // alert(JSON.stringify(res));
        if(res.code == 200){
          //若已有账号 更新wxopenid
          if(res.data.wxopenid.length > 0){
            console.log(res.data);
            let req;
            for(let i=0; i< res.data.wxopenid.length; i++){
              if(openid == res.data.wxopenid[i]){
                this.prompt("登录成功", 'correct').show();
                break;
              }else{
                req = {
                  collection:'User',
                  find: {
                    _id: res.data._id
                  },
                  update: {
                    '$addToSet': {
                      wxopenid: openid
                    }
                  }
                }
              }
            }
            // alert(JSON.stringify(req));
            if(req){
              let openidreturn = await this.$api.sendData(`https://m.yixiutech.com/sql/update`, req);
              //wxopenid更新成功
              // alert(JSON.stringify(openidreturn));
              if(openidreturn.code == 200){
                let newRes = await this.$api.sendData(`https://m.yixiutech.com/login`, data);
                let newUserData = JSON.stringify(newRes.data);
                sessionStorage.setItem("user", newUserData);
              }
            }
            else{
              let userData = JSON.stringify(res.data);
              sessionStorage.setItem("user", userData);
            }
          }else{
            let userData = JSON.stringify(res.data);
            sessionStorage.setItem("user", userData);
          }

          this.prompt("登录成功", 'correct').show();

          plus.storage.setItem('user', JSON.stringify(res));
          
          let shop = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
            collection: 'Shop',
            findType: 'findOne',
            owner: res.data._id
          })

          // 店铺不存在
          if (shop == undefined || JSON.stringify(shop.data) == '{}' ) {
            this.$router.push('/enterRules');
          } else {
            // 店铺存在，跳转用户页
            sessionStorage.setItem('shopData', JSON.stringify(shop.data));
            // 在webapp上运行时的数据
            plus.storage.setItem('shopData', JSON.stringify(shop.data));
            this.$router.push('/sellerHome');
          }


        }else{
          this.prompt(res.errMsg, 'error').show();
        }
      }
    },
    data() {
      return {
        logo: logo,
        username: '',
        password: ''
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
    min-height: 480px;
    /* background: url('./log-bg.jpg') center center no-repeat; */
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
    display: block;
    width: 50%;
    height: auto;
    margin: 10% auto;
  }
  .login h3 {
    font-size: 45px;
    color: #fff;
    width: 100%;
    height: auto;
    text-align: center;
    margin-top: 5%;
  }
  .login .loginBox{
    width: auto;
    height: auto;
    margin-top: 5%;
  }
  .login .loginBox .loginDes{
    margin: 0 auto;
    padding: 10px 0;
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
    border: none;
    float: right;
    background: none;
    border-bottom: 1px solid #fff;
  }
  .login .buttons{
    width: auto;
    height: auto;
  }
  .loginButton{
    width: auto;
    text-align: center;
  }
  .loginButton span{
    display: inline-block;
    text-align: center;
    width: 80vw;
    margin: 10px auto;
    padding: 10px 0;
    border: none;
    background: #fff;
    color: #3878cd;
    border-radius: 5px;
    font-size: 23px;
  }
  .register{
    text-align: center;
    color: #fff;
    font-size: 13px;
  }
  .register span{
    display: inline-block;
    padding: 5px;
  }
  .wxLogin{
    position: absolute;
    bottom: 5vh;
  }
</style>