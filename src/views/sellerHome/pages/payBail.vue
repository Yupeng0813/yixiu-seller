<template>
  	<div class="payBail">
      <cube-scroll class="scroll">
      <item-header
        :name="name"
        @backParent="back"
      />
      <div class="rules">
        
        <div class="content">
          <p class="content__clause">第一章 入驻须知 </p>
          <p>翼修暂未授权任何机构进行代理招商服务，入驻申请流程及相关的收费说明均以官方招商页面为准。</p>

          <p>翼修有权根据包括但不仅限于品牌需求、公司经营状况、服务水平等其他因素退回客户申请；同时翼修有权在申请入驻及后续经营阶段要求客户提供其他资质；翼修将结合各行业发展动态、国家相关规定及消费者购买需求，不定期更新招商标准。</p>

          <p>商家必须如实提供资料和信息。</p>
          <p>（一） 请务必确保您申请入驻及后续经营阶段提供的相关资质和信息的真实性（若您提供的相关资质为第三方提供，包括但不限于商标注册证、授权书等，请务必先行核实文件的真实有效性），一旦发现虚假资质或信息的，您的公司将被列入非诚信客户名单，翼修将不再与您进行合作；</p>
          <p>（二） 商家应如实提供其店铺运营的主体及相关信息，包括但不限于代理运营商、实际店铺经营主体等信息；</p>
          <p>（三） 翼修关于商家信息和资料变更有相关规定的从其规定，但商家如变更第二款所列信息，应（提前十五天）告知翼修。</p>
          <p class="content__clause">第二章 翼修店铺类型及相关要求</p>
          <p>旗舰店，商家以自有品牌，或由权利人独占性授权，入驻翼修开设的平台。</p>
          <p>（一） 旗舰店，可以有以下几种情形： </p>
          <p>1、 经营一个自有品牌商品的旗舰店；</p>
          <p>2、 经营多个自有品牌商品且各品牌归同一实际控制人；</p>
          <p>3、 卖场型品牌（服务类商标）所有者开设的旗舰店；</p>
          <p>其中2、3两种类型旗舰店仅限翼修主动邀请入驻。</p>
          <p>（二） 开店主体必须是品牌（商标）权利人或持有权利人出具的开设翼修旗舰店独占性授权文件的企业。</p>
          <p>专卖店，商家持他人品牌授权文件在翼修开设的店铺。</p>
          <p>（一） 专卖店有以下几种情形：</p>
          <p>1、 经营一个授权销售品牌商品的专卖店；</p>
          <p>2、 经营多个授权销售品牌的商品且各品牌归同一实际控制人的专卖店；</p>
          <p>其中第2点所述类型的专卖店仅限翼修主动邀请入驻。</p>
          <p class="content__clause">第三章 翼修申请入驻资质标准</p>
          <p>商家应向翼修提供有效营业执照副本、资质证书、法人代表身份证原件及其身份证复印件</p>
          <p class="content__clause">第四章 开店入驻限制</p>
          <p>同一主体重新入驻翼修限制：</p>
          <p>（一） 严重违规、资质造假被翼修清退的，永久限制入驻；</p>
          <p>（二） 商家一自然年内主动退出2次，6个月内限制入驻。</p>
          <p class="content__clause">第五章 翼修保证金/费率标准</p>
          <p>平台使用费：服务商在翼修经营必须交纳保证金，保证金主要用于保证商家按照翼修的规则进行经营，并且在商家有违规行为时根据《翼修服务协议》及相关规则规定用于向翼修及消费者支付违约金。续约商家须在当年续签要求的时间内一次性缴纳次年度平台使用费1000元。 </p>    
          <p>新签商家在申请入驻获得批准时一次性缴纳当年度的平台使用费1000元。</p>
          <p>如商家与翼修的协议有效期起始时间均在2018年内的，如商家与翼修的协议有效期跨自然年的。</p>
          <p class="content__clause">第六章 续约</p>
          <p>续签须在合同结束前30天之前完成续签申请的提交，并在合同结束15天之前完成年费的缴纳及保证金的锁定，如果上一年及下一年资费及资料未补足，翼修将在7天内监管店铺并清退出翼修平台。</p>
          <p class="content__clause">第七章 退出</p>
          <p>保证金的返还结算在协议终止后15天进行返还。</p>
        </div>
      </div>
		<van-button @click="surePayBail" bottom-action>
      <sicon name="nextStep" scale="1.8"></sicon><span>缴纳保证金￥{{this.totalFee}}</span>
    </van-button>
    </cube-scroll>
	</div>
</template>


<script>
import { Button, Dialog } from "vant";
import itemHeader from '../components/itemHeader';
import wx from "weixin-js-sdk";
export default {
  components: {
	[Button.name]: Button,
  [Dialog.name]: Dialog,
  itemHeader
  },
  data() {
    return {
	  totalFee: 1,
	  // totalFee: 0.01,//测试用
    shopId: "",
    name: '缴纳平台使用费'
    };
  },
  methods: {
    back () {
      this.$router.push('/sellerHome');
    },
    surePayBail: function() {
      // alert(sessionStorage.getItem('shopData'));
      this.shopId = JSON.parse(sessionStorage.getItem('shopData'))._id;
      // alert(shopId);
      Dialog.confirm({
            title: '是否立即支付',
          }).then(() => {
        // on confirm
        console.log(this);
        let payInfo = {
          shopId:this.shopId,
          totalFee: this.totalFee*100
        }
        console.log(payInfo)
        this._pay(payInfo);
      }).catch(() => {
        // on cancel
        console.log("取消");
      });
    },
    async _pay(payInfo) {
      let isWxMini;
      let openid = sessionStorage.getItem("openid");
      let that = this;
      // console.log(data);
      isWxMini = window.__wxjs_environment === "miniprogram";
      payInfo = Object.assign({}, payInfo, {type: 1});

      if(isWxMini){
          //小程序环境
          // alert("小程序环境")
          let jumpUrl = encodeURIComponent(window.location.origin);
          let path = `/pages/wxpay/wxpay?payInfo=${JSON.stringify(payInfo)}&jumpUrl=${jumpUrl}&orderId=${res._id}`;
          wx.miniProgram.navigateTo({
            url: path
          });
        }else {
          //非小程序环境
          // alert(openid)
          if(openid){
            // alert(openid);
            // 
            history.pushState(null,null,"/payInfo");

            let req = {
              total_fee: this.totalFee*100,
              openid: openid,
              trade_type: 'JSAPI'
            }
            console.log(req);
            let sign = await this.$api.sendData('https://m.yixiutech.com/wx/pay/sign', req);
            // alert(JSON.stringify(sign));
            if(sign.code == 200){
              function onBridgeReady(){
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', sign.data,
                    async function(wxres){     
                      // alert(JSON.stringify(res));
                      // alert(JSON.stringify(payInfo));
                        if(wxres.err_msg == "get_brand_wcpay_request:ok" ) {
                          that.prompt("支付成功", 'correct').show();
                          let update = await that.$api.sendData('https://m.yixiutech.com/sql/update', {
                            collection: 'Shop',
                            find: {
                              _id: payInfo.shopId
                            },
                            update: {
                              pay: true,
                              payment: payInfo.totalFee
                            }
                          })
                          if (update.code == 200) {
                            let newShop = await that.$api.sendData('https://m.yixiutech.com/sql/find', {
                              collection: 'Shop',
                              _id: payInfo.shop
                            })
                            sessionStorage.setItem('shopData', JSON.stringify(newShop.data));
                            that.$router.push("/sellerHome");
                          } else {
                            alert(update.errMsg);
                          }
                        }else{
                          that.prompt("支付失败", 'error').show();
                        }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
                    }
                ); 
              }
              if (typeof WeixinJSBridge == "undefined"){
                if( document.addEventListener ){
                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                }else if (document.attachEvent){
                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                }
              }else{
                onBridgeReady();
              }
            }
          }
          
        }
    }
  }
};
</script>

<style scoped>
.rules {
	width: 100%;
}

.rules .rules__title {
	padding: 10px 0;
	text-align: center;
	background: #ffbd5c;
	color: #fff;
}

.content {
	width: 96%;
	padding: 2%;
}
.scroll{
  height: 100vh;
}
.content p {
	text-indent: 2em;
}

.content .content__clause {
	text-align: center;
	font-weight: bold;
	font-size: 20px;
	text-indent: 0;
}
</style>
