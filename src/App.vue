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

        sessionStorage.setItem("openid", res.openid);

        this.openid = res.openid;

        let userInfo = this.initUserInfo(res);

        this.isUserRegister(userInfo);

        // let user = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
        //   collection: 'User',
        //   findType: 'findOne',
        //   'wx.openid': this.openid
        // })

        // if (user == undefined) {
        //   // 用户在系统中不存在的情况下, 让他注册
        //   this.$router.push('/register');
        
        // } else {
        //   // 用户注册过的情况下
        //   this.$router.push('/login');
          
        // }

      } else {
        // 非微信环境
        this.$router.push('/login');

      }
    },
    data () {
      return {
        active: false,
        openid: '',
        userInfo: ''
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
      async isUserRegister(userInfo){
        //根据openid判断是否注册
        let nowopenid = [userInfo.wx.openid];
        nowopenid.push()
        let register = {
          collection: "User",
          wxopenid: {
            '$in': nowopenid
          }
        }
        let isRegister = await this.$api.sendData(`https://m.yixiutech.com/sql/find`, register);


        if (isRegister.data.length == 0) {
          //注册

          sessionStorage.setItem("userData", JSON.stringify(userInfo));

          alert("你还未登录，请先登录");

          this.$router.push("/login");
        } else {
          userInfo = isRegister.data[isRegister.data.length - 1];
          
          if(userInfo.mobile == ''){
            alert("你还未登录，请先登录");
            this.$router.push("/login");
          }else{
            let update = {
              collection: "User",
              find: {
                _id: userInfo._id
              },
              update: {
                name: userInfo.wx.nickname,
                mobile: userInfo.mobile,
                wx: userInfo.wx
              }
            }
            let updateInfo = await this.$api.sendData(`https://m.yixiutech.com/sql/update`, update);
          
            sessionStorage.setItem("userData", JSON.stringify(userInfo));

            this.prompt('微信自动登录成功', 'correct').show();

            let shop = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
              collection: 'Shop',
              findType: 'findOne',
              owner: userInfo._id
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
        }
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
