<template>
    <div class="shopWallet">
        <div class="navBox">
            <div @click="goBack" class="back"><span><sicon name="find-leftArr" scale="1.2"></sicon>&nbsp;返回</span></div>
            <div class="navtitle">我的钱包</div>
            <div></div>
        </div>
        <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
            <div class="countBox">
                <img src="https://paraslee-img-bucket-1253369066.cos.ap-chengdu.myqcloud.com/dribbble2.png" alt="">
                <div class="money">{{wallentMoney}} 元</div>
            </div>
        <!-- </van-pull-refresh> -->
        <div class="funcbtn">
            <button @click="getMoney">提现</button>
            <button @click="returnMoney" class="other">联系客服</button>
        </div>
        <cube-popup :center="false" type="my-popup" ref="getMyMoney">
            <div class="moneyBox">
                <h3>请输入提现金额(元)</h3>
                <input placeholder="0" v-model="MoneyValue">
                <cube-button @click="sureGet">提现到微信</cube-button>
                <cube-button class="bottom" @click="closeMoney">取消</cube-button>
            </div>
        </cube-popup>
				<div class="tip" v-show="status">
					<p>请联系客服，客服电话:</p>
					<p><a href="tel://023-68595677">023-68595677</a></p>
					<button @click="confirm">确定</button>
				</div>
				<div class="shadow" v-show="status"></div>
    </div>
</template>

<script>
export default {
    name: "shop-wallet",
    data(){
        return {
            wallentMoney: 0,
            MoneyValue: "",
						status: false
        }
    },
    async mounted() {
        // const toast = this.$createToast({
		// 	txt: '加载中...',
		// 	type: 'correct'
        // });
		// 		// let userData = JSON.parse(sessionStorage.getItem('user'));
		// 		let userInfo = JSON.parse(sessionStorage.getItem('user'));
        // let res = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
		// 	collection: 'User',
        //     _id: userInfo._id
		// });
        // if(res.code == 200){
        //     this.wallentMoney = res.data[0].money / 100;
        // }
        // toast.hide();
        this.wallentMoney = JSON.parse(sessionStorage.getItem('user')).money / 100;
    },
    methods: {
				confirm () {
					this.status = false;
				},
        goBack: function(){
            this.$router.push("/sellerHome");
        },
        getMoney: function(){
            const getMyMoney = this.$refs.getMyMoney
            getMyMoney.show();
        },
        sureGet: function(){
            const getMyMoney = this.$refs.getMyMoney
            let that = this;
            if (this.MoneyValue != '') {
                console.log(this.MoneyValue,this.wallentMoney)
                if(Number(this.MoneyValue) > Number(this.wallentMoney)){
                    this.$createToast({
                    type: 'warn',
                    time: 1000,
                    txt: '你没有那么多钱'
                }).show()
                }else{
                    this.$createDialog({
                        type: 'confirm',
                        title: '提现到微信',
                        content: that.MoneyValue + '元',
                        confirmBtn: {
                            text: '确定',
                            active: true,
                            disabled: false,
                            href: 'javascript:;'
                        },
                        cancelBtn: {
                            text: '取消',
                            active: false,
                            disabled: false,
                            href: 'javascript:;'
                        },
                        onConfirm: async () => {
                            let withdrawCash = await this.$api.sendData('https://m.yixiutech.com/shop/withdrawals', {
								_id: JSON.parse(sessionStorage.getItem('shopData'))._id,
								openid: sessionStorage.getItem('openid'),
								payment: that.MoneyValue
							})

							if (withdrawCash.code !== 200) {
								alert(withdrawCash.errMsg);
								return;
							}

							this.prompt('提现成功', 'correct').show();
							this.wallentMoney = this.wallentMoney - that.MoneyValue
                        },
                        onCancel: () => {
                            getMyMoney.hide();
                        }
                    }).show()
                }
                
            }else{
                this.$createToast({
                    type: 'warn',
                    time: 1000,
                    txt: '未输入金额'
                }).show()
            }

            

            // getMyMoney.hide();
        },
        returnMoney: function(){
            // alert("请联系客服，客服电话");
						this.status = true;
        },
        closeMoney: function(){
            const getMyMoney = this.$refs.getMyMoney
            getMyMoney.hide();
        },
        moneyBackSure: function(){
					this.status = true;
        }
    }
}
</script>

<style scoped>
    .shopWallet{
        width: 100%;
        height: 100vh;
    }
    .shopWallet .navBox{
        width: auto;
        height: 15vh;
        line-height: 15vh;
        display: flex;
        /* background-image: linear-gradient(to right, #434343 0%, black 100%); */
		background: #4991e5;
        color: #fff;
    }
    .shopWallet .navBox > div{
        flex: 1;
    }
    .shopWallet .navBox .back span{
        display: inline-block;
        padding-left: 10px;
    }
    .shopWallet .navBox .navtitle{
        text-align: center;
    }
    .shopWallet .countBox{
        padding-top: 10vh;
        /*height: 70vh;*/
        text-align: center;
    }
    .shopWallet .countBox img{
        width: 186px;
        height: 263.3px;
    }
    .shopWallet .money{
        position: relative;
        color:#3c6b7a;
        font-size: 6vw;
        bottom: 35px;
    }
    .shopWallet .funcbtn{
        position: absolute;
        display: flex;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .shopWallet .funcbtn button{
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
    .shopWallet .funcbtn button.other{
        background: #fff;
        color: #2796CB;
    }

    .moneyBox{
        width: 100vw;
        height: 85vh;
        margin: 0 auto;
        background: #fff;
    }
    .moneyBox h3{
        padding: 10px;
        text-align: center;
        height: 30px;
        line-height: 30px;
    }
    .moneyBox input{
        display: block;
        margin: 0 auto;
        padding: 5px 10px;
        width: auto;
        height: 30px;
        border: 2px solid #eee;
        border-radius: 5px;
    }
    .moneyBox button{
        margin: 20px auto;
        width: 60%;
    }
    .moneyBox button.bottom{
        width: 100%;
        position: absolute;
        bottom: 0;
    }

		.tip {
			width: 70%;
			padding: 5%;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			z-index: 4;
			background: #fff;
			text-align: center;
		}

		.tip p {
			padding: 2% 0;
		}

		.tip button {
			width: 100%;
			border: 1px solid #000;
			padding: 4% 0;
			background: #fff;
			margin-top: 2%;
		}

		.shadow {
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			position: absolute;
			background: rgba(0, 0, 0, 0.4);
			z-index: 2;
		}

</style>
