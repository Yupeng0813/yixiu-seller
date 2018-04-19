<template>
  <div class="coupon">
		<item-header :name="infoName" v-on:backParent="backParent" />

		<div class="container">

			<!-- 优惠券类型, 0: 维修优惠券, 1: 商品优惠券 -->

			<div class="box">
				<span>优惠券分类</span>
				<cube-select
					v-model="value"
					:options="options"
					@change="change"
				>
				</cube-select>
			</div>

			<van-field
				v-model="coupon.condition"
				label="满减条件"
				placeholder="满减条件"
			/>

			<van-field
				v-model="coupon.denomination"
				label="满减额度"
				placeholder="满减额度"
			/>

			<van-button size="normal" class="submit" @click="submit">确认添加</van-button>
		</div>

		

		<h2 class="title">预览</h2>

		<!-- <p class="title" v-show="infos.promotion.length == 0">您的店铺还没有优惠券</p> -->

		<coupons
			v-for="(item, index) in infos.promotion"
			:key="index"
			:condition="item.condition"
			:denomination="item.denomination"
			:name="item.name"
			:shopName="item.shopName"
			@deleteData="deleteData"
		/>

	</div>
</template>

<script>
import { Button, Field, Toast } from 'vant';
import itemHeader from '../components/itemHeader'
import coupons from '../components/coupon'
export default {
  methods: {
		change (value, index, text) {
			this.coupon.name = text;
		},
		deleteData (data) {
			this.infos = data;
			this.updateData('删除优惠券成功');
		},
		backParent () {
			this.$router.push('/sellerHome');
		},
		async submit () {
			for (var key in this.coupon) {
				if (this.coupon[ key ] == '') {
					this.prompt('您还有信息未填写!', 'error').show();
					return;
				}
			}
			this.coupon.condition = this.coupon.condition * 100;
			this.coupon.denomination = this.coupon.denomination * 100;
			this.infos.promotion.push(this.coupon);
			this.updateData('添加优惠券成功');
		},
		async updateData (tip) {
			const toast = Toast.loading({
				duration: 0,
				forbidClick: true,
				message: '请稍后...'
			})
			let coupon = await this.$api.sendData('https://m.yixiutech.com/shop/update', this.infos);
			
			if (coupon.code !== 200) {
				this.prompt(coupon.errMsg, 'error').show();
				return;
			}
			this.prompt(tip, 'correct').show();
			if (tip == '添加优惠券成功') {
				this.coupon = Object.assign(this.coupon, {name: '', condition: '', denomination: ''})
			}
			let shop = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
				collection: 'Shop',
				findType: 'findOne',
				owner: JSON.parse(sessionStorage.getItem('user'))._id
			})

			sessionStorage.setItem('shopData', JSON.stringify(shop.data));
			
			this.infos = shop.data;
			toast.clear();
		}
	},
	async created () {
		let shop = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
			collection: 'Shop',
			findType: 'findOne',
			owner: JSON.parse(sessionStorage.getItem('user'))._id
		})

		this.infos = shop.data;
	},
	components: {
		[Button.name]: Button,
		[Field.name]: Field,
		itemHeader,
		coupons
	},
	data () {
		return {
			infoName: '优惠券管理',
			names: ['维修优惠券', '商品优惠券'],
			name: '',
			options: [
				{
					text: '维修优惠券', 
					value: 0
				},
				{
					text: '商品优惠券',
					value: 1
				}
			],
			value: '',
			coupon: {
				condition: '',
				denomination: '',
				name: '',
				shopName: sessionStorage.getItem('shopData') ? JSON.parse(sessionStorage.getItem('shopData')).name : '',
				shop: sessionStorage.getItem('shopData') ? JSON.parse(sessionStorage.getItem('shopData'))._id : ''
			},
			shop: sessionStorage.getItem('shopData') ? JSON.parse(sessionStorage.getItem('shopData'))._id : '',
			infos: {}
		}
	}
}
</script>

<style scoped>
.coupon {
	width: 100%;
	height: 100%;
	background: rgb(248, 248, 248);
}

.container {
	width: 90%;
	margin: 20px auto;
	background: #fff;
	border-radius: 5px;
}

.box {
	width: 92%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	padding: 4%;
	font-size: 14px;
}

.cube-select {
	width: 60%;
	margin-left: 5%;
}

.add-coupon {
	width: 100%;
	text-align: center;
}

.title {
	padding: 5% 0;
	text-align: center;
}

.condition {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-around;
	margin: 5% 0;
}

.submit {
	/* background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%); */
	background: #4991e5;
	color: #fff;
	display: block;
	margin: 10px auto;
}
</style>
