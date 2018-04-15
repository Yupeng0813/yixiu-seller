<template>
  <div class="coupon">
		<item-header :name="infoName" v-on:backParent="backParent" />

		<div class="container">
			<van-field
				v-model="coupon.name"
				label="优惠券名称"
				placeholder="请输入优惠券名称"
			/>

			<!-- 优惠券类型, 0: 维修优惠券, 1: 商品优惠券 -->

			<div class="box">
				<span>优惠券分类</span>
				<cube-select
					v-model="value"
					:options="options">
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
import { Button, Field } from 'vant';
import itemHeader from '../components/itemHeader'
import coupons from '../components/coupon'
export default {
  methods: {
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
			const toast = this.$createToast({
				txt: '加载中...',
				type: 'loading'
			})
			toast.show();
			let coupon = await this.$api.sendData('https://m.yixiutech.com/shop/update', this.infos);
			toast.hide();
			if (coupon.code !== 200) {
				this.prompt(coupon.errMsg, 'error').show();
				return;
			}
			this.prompt(tip, 'correct').show();
			let shop = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
				collection: 'Shop',
				findType: 'findOne',
				owner: JSON.parse(sessionStorage.getItem('user'))._id
			})

			sessionStorage.setItem('shopData', JSON.stringify(shop.data));
			
			this.infos = shop.data;
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
			value: {
				text: '商品优惠券',
				value: 1
			},
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
	background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
	color: #fff;
	display: block;
	margin: 10px auto;
}
</style>
