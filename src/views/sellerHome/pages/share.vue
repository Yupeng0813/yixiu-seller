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
      <div class="tips">邀请商户返利</div>
      <div class="row-line-money"></div>
      <div class="money" >
        <div class="money">已邀请：{{shopnumber}}户</div>
        <div class="money">总返利：{{allnumber}}元</div>
        <div class="money">已返利：{{surplusnumber}}元</div>
        <div class="money">待返利：{{allnumber-surplusnumber}}元</div>
      </div>
      <div class="funcbtn">
        <button @click="searchmoney" class="other">查询</button>
        <button @click="getmoney">提现</button>
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
        allnumber: 0,
        surplusnumber: 0,
        allShopIds: [],
        shopnumber: 0,
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

        let shop = JSON.parse(sessionStorage.getItem('shopData'));

        // let user = JSON.parse(sessionStorage.getItem('user'));

        let shopId = shop._id;

        // let num  = user.moblie;
        // let userId = user._id;
        
        $("#qrcode").qrcode({
          text: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx92877f3243727d9b&redirect_uri=http://m.yixiutech.com/yixiuseller/&response_type=code&scope=snsapi_userinfo&state=${shopId}#wechat_redirect`,
          width:150,
          height:150
        });
      },
      async searchmoney () {

        let shop = JSON.parse(sessionStorage.getItem('shopData'));
        let shopId = shop._id;
        // let shopId = '5ae17c86e3c2bf043444890a';
        let shopList = await this.$api.sendData('https://m.yixiutech.com/sql/find/', {
            collection:'Shop',
            parent: shopId,
            limit: 0,
            select:{_id:1}
		    })
        console.log(shopList);
        let shopLists = shopList.data;
        this.shopnumber = shopLists.length;
        // alert("已推荐" + shopLists.length + "人");
        let shopids = [];

        if(shopLists.length>0){
          for(var x= 0; x<shopLists.length; x++){
            shopids.push(shopLists[x]._id);
          }
        }
        this.allShopIds = shopids;
        //订单查询
        let shopOrderList = await this.$api.sendData('https://m.yixiutech.com/sql/find/', {
            collection:'Order',
            shop: {
                $in:shopids,
            },
            limit: 0,
            state: 13,
            select:{payment:1, service:1},
		    })
        console.log("--------------------------2");
        console.log(shopOrderList);
        let shopOrderLists = shopOrderList.data;
        let sumMoney = 0;
        if(shopOrderLists.length>0){
          for(var y= 0; y<shopOrderLists.length; y++){
            if(shopOrderLists[y].service.length !== 0){
              sumMoney = sumMoney + shopOrderLists[y].payment;
            }
           }
        }
        console.log("--------------------------3");
        console.log(sumMoney);
        this.allnumber = (sumMoney/100)*0.02;
        console.log(this.allnumber);
        console.log("--------------------------------------------------------------------");
        let shopOrderListHadGet = await this.$api.sendData('https://m.yixiutech.com/sql/find/', {
            collection:'Order',
            shop: {
                $in:shopids,
            },
            limit: 0,
            state: 13,
            rebate: true,
            select:{payment:1, service:1},
		    })
        console.log("--------------------------2");
        console.log(shopOrderList);
        let shopOrderListHadGets = shopOrderListHadGet.data;
        let sum = 0;
        if(shopOrderListHadGet.length>0){
          for(var y= 0; y<shopOrderListHadGet.length; y++){
            if(shopOrderListHadGet[y].service.length !== 0){
              sum = sum + shopOrderListHadGet[y].payment;
            }
           }
        }
        console.log("--------------------------4");
        console.log(sum);
        this.surplusnumber = (sum/100)*0.02;
        console.log(this.surplusnumber);

      },
      async getmoney () {
        let data = { rebate: true};
        if(this.allnumber - this.surplusnumber == 0){
          alert("暂时没有可以提现的金额，加油哦！");
        } else {
          let res = await this.$api.sendData('https://m.yixiutech.com/sql/update', {
            collection:'Order',
				    find: {
					    user: this.userids,
              state: 13,
				    },
				    update: data
          });
          if(res.code==200){
            alert("提现成功");
          } else {
            alert("提现失败");
          }
        }
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
    margin-top: 0px;
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
    margin-top: 3vh;
    text-align: center;
    color: #323643;
  }
  .tips span{
    color: #4BC2C5;
  }
</style>