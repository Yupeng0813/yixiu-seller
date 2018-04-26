<template>
  <div class="myinfo-container">
    <item-header :name="infoName" v-on:backParent="back"/>
    <!-- 顶部留白 -->
    <div class="topblank"></div>

    <!-- 用户看到的分享 -->
    <div class="messageTag">
      <!-- 信息标题 -->
      <div class="myinfo-title-container">
        <div class="myinfo-title">邀请商家二维码</div>
      </div>

      <div class="row-line"></div>

      <div class="qrcodeBox">
        <div id="qrcode" ref="qrcode"></div>
      </div>

      <p class="tips">邀请注册成功后，可获得商家 <span>2%</span></p>
    </div>
    <div>
      <div class="tips">邀请用户返利</div>
      <div class="row-line-money"></div>
      <div class="money" >
        <div class="money">总返利：{{allnumber}}元</div>
        <div class="money">已返利：{{surplusnumber}}元</div>
        <div class="money">待返利：{{number}}元</div>
      </div>
      <div class="funcbtn">
        <button @click="searchmoney">查询</button>
        <button @click="getmoney()" class="other">提现</button>
      </div>
    </div>
  </div>

</template>

<script>
  import '../modules/jquery-1.10.2.min.js';
  import '../modules/jquery.qrcode.min.js';
  import itemHeader from '../components/itemHeader.vue'

  import { NavBar, Button} from 'vant';


  export default {
    data () {
      return {
        infoName: '分享',
        allnumber: 100,
        surplusnumber: 100,
        number: this.allnumber - this.surplusnumber
      }
    },
    components: {
      [NavBar.name]: NavBar,
      [Button.name]: Button,
      itemHeader
    },
    methods: {
      back () {
        this.$router.push('/sellerHome');
      },
      qrcode () {
        // let userData = this.getUserInfo();

        let user = JSON.parse(sessionStorage.getItem('user'));

        let num  = user.moblie;
        let userId = user._id;
        
        $("#qrcode").qrcode({
          text: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx92877f3243727d9b&redirect_uri=http://m.yixiutech.com/yixiuseller/&response_type=code&scope=snsapi_userinfo&state=${userId}#wechat_redirect`,
          width:150,
          height:150
        });
      },
      async searchmoney () {
        // let user = JSON.parse(sessionStorage.getItem('user'));
        // let userId = user._id;
        // this.allnumber = userId;

        // let shopId = '5ad21852ab85e142eaef9276';
        // let shopId = '5ae17c86e3c2bf043444890a';
        let shopId = '5ad243afab85e142eaef928d';
        // let shopId = '5ad6cf52060e415f31618742';

        let shopList = await this.$api.sendData('https://m.yixiutech.com/sql/find/', {
            collection:'Shop',
            parentShop: shopId,
			      // shop: JSON.parse(sessionStorage.getItem('shopData'))._id
			  // shop: '5ab93879d4e7f1497d58d94e'
		    })
        console.log(shopList);
        // let userOrderlist = await this.$api.sendData('https://m.yixiutech.com/sql/find/', {
        //   collection:'Order',
        //   shop:{
        //     $in:[shopList]//遍历childrenShoplist的_id放到这里面
        //   }
        // })
        // console.log(userOrderlist);
        // alert(shopInfo);
        
        // let childrenShoplist = ajax.post('/sql/find',{
        //   collection:'Shop',
        //   parent:'5ad6cf52060e415f31618742'
        // })
        // alert(childrenShoplist);
        // alert(this.allnumber);
      }
    },
    mounted () {    //钩子函数，等于vue1.0中的ready
      this.qrcode();
    }
  }
</script>

<style scoped>
  .myinfo-container{
    min-height: 90vh;
    /* padding: 2vh 3vw 5vh 3vw; */
    background: #fff;
    
  }
  .topblank{
    margin-top: 15.6px;
  }
  .funcbtn button.other{
        background: #fff;
        color: #2796CB;
  }
  .funcbtn{
      position: absolute;
      display: flex;
      bottom: 0;
      left: 0;
      right: 0;
  }
  .funcbtn button{
      flex: 1;
      border: none;
      background-color: #4991e5;
      float: left;
      padding: 0;
      width: 100vw;
      line-height: 60px;
      text-align: center;
      color: #fff;
      font-size: 6vw;
        
      border-top: 1px solid #eee;
  }
  .messageTag{
    border: 0.1px solid rgb(240, 241, 245);
    padding: 3vh 4vw 4vh 4vw;
    margin-bottom: 4vh;
  }
  .myinfo-title-container{
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    align-items: center;
    margin-bottom: 2vh;
  }
  .myinfo-title{
    color: #727272;
    font-size: 4vw;
  }
  .row-line{
    width: 100%;
    height: 0.3vh;
    margin-top: 4vh;
    margin-bottom: 4vh;
    background: #ecebeb;
  }
  .row-line-money{
    width: 100%;
    height: 0.2vh;
    margin-top: 3vh;
    margin-bottom: 2vh;
  }
  .money{
    margin-left: 5vh;
    margin-bottom: 2vh;
  }
  .myinfo-message{
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .qrcodeBox{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tips{
    font-size: 3.8vw;
    margin-top: 4vh;
    text-align: center;
    color: #323643;
  }
  .tips span{
    color: #4BC2C5;
  }
</style>