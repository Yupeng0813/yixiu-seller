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
  var auths = null;
  document.addEventListener( "plusready", function(){
    // alert("app测试api");
		// 扩展API加载完毕，现在可以正常调用扩展API
		plus.oauth.getServices( function(services){
			// console.log(JSON.stringify(services));
			auths = services;
      // alert("webapp测试调用");
      authLogin(auths);
            // alert("webapp获取信息");
            // that.authUserInfo(auths);
		}, function(e){
			alert( "获取分享服务列表失败："+e.message+" - "+e.code );
		} );
	}, false );
	function authLogin(){
		// alert(JSON.stringify(auths));
		var s = auths[0];
		if ( !s.authResult ) {
			s.login( function(e){
				alert( "登录认证成功！" );
			}, function(e){
				alert( "登录认证失败！" );
			} );
			s.getUserInfo( function(e){
				// alert( "获取用户信息成功："+JSON.stringify(s.userInfo) );
        sessionStorage.setItem("infoOfWX", JSON.stringify(s.userInfo));
        plus.storage.setItem('wxuserinfo', JSON.stringify(s.userInfo));
			}, function(e){
				alert( "获取用户信息失败："+e.message+" - "+e.code );
			} );
		}else{
			alert( "已经登录认证！" );
		}
	}
  
  // plusReady();
  // document.addEventListener('plusready', plusReady, false);

  import { reguser } from './views/common/api'
  // var toast;
  export default {
    name: 'App',
    // components: {
    //   // mainApp
    // },
    async created() {
      // toast = this.$createToast({
      //   txt: 'Loading...',
      //   mask: true,
      //   time: 2000
      // })
      // toast.show();
      // let res = await this.$api.sendData('https://m.yixiutech.com/shop/filter', {limit: 100, skip: 0});
			// sessionStorage.setItem('shopData', JSON.stringify(res.data[65]));
      // sessionStorage.setItem('shopData', JSON.stringify(res.data[74]));

      let code = location.href.indexOf('code') !== -1 && location.href.split('=')[1].split('&')[0];

      let state = location.href.indexOf('state') !== -1 && location.href.split('state=')[1].split('#')[0];  

      if (state != '123') {
        sessionStorage.setItem('parent', state);
      }

      let user = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
        collection: 'User',
        limit: 10000
      })

      if (code) {
        // 如果是微信

        // 获取微信信息
        let res = await this.$api.getData('https://m.yixiutech.com/user/wx/' + code);

        // alert(JSON.stringify(res));

        sessionStorage.setItem('userInfo', JSON.stringify(res));

        sessionStorage.setItem("openid", res.openid);

        this.openid = res.openid;

        let userInfo = this.initUserInfo(res);


        // // 用获取到的openid去查商家表中的ownerOpenid

        // let shop = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
        //   collection: 'Shop',
        //   ownerOpenid: res.openid
        // })


        // // 用店铺的contactNumber字段去更新用户信息中的部分，包括mobile，wx信息，wxopenid

        // let updateUser = await this.$api.sendData('https://m.yixiutech.com/sql/update', {
        //   collection: 'User',
        //   find: {
        //     _id: shop.data[0].owner
        //   },
        //   update: {
        //     mobile: shop.data[0].contactNumber,
        //     wx: res,
        //     '$addToSet': {
        //       wxopenid: res.openid
        //     }
        //   }
        // })

        this.isUserRegister(userInfo);

      } else {
        // console.log("------------------");
        // alert("webapp入口");
        // 非微信环境
        // plusReady();
        // document.addEventListener('plusready', plusReady, false);
        // let wxuserinfo = plus.storage.getItem('wxuserinfo');
        // let shop = plus.storage.getItem('shopData');
        // let user = JSON.parse(plus.storage.getItem('user'));

            
        // alert("app进入");
        // let that = this;
        // // this.$router.push("/userlogin");
        // let auths = null;
        // alert("app获取auths值");
        // document.addEventListener( "plusready", function(){
        //   alert("app加载api");
			  //   // 扩展API加载完毕，现在可以正常调用扩展API
			  //   plus.oauth.getServices( function(services){
				//     console.log(JSON.stringify(services));
				//     auths = services;
        //     alert("webapp调用");
        //     that.authLogin(auths);
        //     // alert("webapp获取信息");
        //     // that.authUserInfo(auths);
			  //   }, function(e){
				//     alert( "获取分享服务列表失败："+e.message+" - "+e.code );
			  //   } );
		    // }, false );

        // 先判断用户是否注册过

        // if (user) {
        //   if (shop) {
        //     // 登录过店铺
        //     this.$router.push('/sellerHome');
        //     this.prompt('自动登录成功', 'correct').show();
        //   } else {
        //     // 没有登录过店铺

        //     let shop = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
        //       collection: 'Shop',
        //       findType: 'findOne',
        //       owner: user._id
        //     })

        //     // 店铺不存在
        //     if (shop == undefined || JSON.stringify(shop.data) == '{}' ) {
        //       this.$router.push('/enterRules');
        //     } else {
        //       // 店铺存在，跳转用户页
        //       sessionStorage.setItem('shopData', JSON.stringify(shop.data));
        //       // 在webapp上运行时的数据
        //       plus.storage.setItem('shopData', JSON.stringify(shop.data));
        //       this.$router.push('/sellerHome');
        //     }
        //   }
        // } else {
        //   this.$router.push('/login');
        // }
        // alert("app结束");
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
      authLogin(auths) {
			  let s = auths[0];
			  if ( !s.authResult ) {
				  s.login( function(e){
				    alert( "登录认证成功！" );
				  }, function(e){
					  alert( "登录认证失败！" );
				  } );
				  s.getUserInfo( function(e){
					  alert( "获取用户信息成功："+JSON.stringify(s.userInfo) );
            sessionStorage.setItem("infoOfWX", JSON.stringify(s.userInfo));
            plus.storage.setItem('wxuser', JSON.stringify(s.userInfo));
				  }, function(e){
					  alert( "获取用户信息失败："+e.message+" - "+e.code );
				  } );
			  }else{
				  alert( "已经登录认证！" );
			  }
      },
		  authUserInfo(auths) {
			  var s = auths[0];
			  if ( !s.authResult ) {
				  alert("未登录授权！");
			  } else {
				  s.getUserInfo( function(e){
					  alert( "获取用户信息成功："+JSON.stringify(s.userInfo) );
            sessionStorage.setItem("infoOfWX", JSON.stringify(s.userInfo));
				  }, function(e){
					  alert( "获取用户信息失败："+e.message+" - "+e.code );
				  } );
			  }
		  },
      setStorage (user, phone) {
        plus.storage.setItem('xuhaichao', '18883994599');
      },
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

            if (userInfo._id) {
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
            }
          
            sessionStorage.setItem("user", JSON.stringify(userInfo));

            

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
