<template>
  <div class="coupon">
		<item-header :name="infoName" v-on:backParent="backParent" />

		<div class="add-coupon">
			<div class="condition">
				<van-field
					v-model="condition"
					class="full-cut"
					label="满减条件"
					placeholder="满减条件"
				/>

				<van-field
					v-model="denomination"
					class="full-cut"
					label="满减额度"
					placeholder="满减额度"
				/>
			</div>

			<van-button size="normal" class="submit" @click="submit">确认添加</van-button>
		</div>

		<h2 class="title">预览</h2>

		<p class="title" v-show="infos.promotion.length == 0">您的店铺还没有优惠券</p>

		<coupons
			v-for="(item, index) in infos.promotion"
			:key="index"
			:condition="item.condition"
			:denomination="item.denomination"
		/>

	</div>
</template>

<script>
import { Button, Field } from 'vant';
import itemHeader from '../components/itemHeader'
import coupons from '../components/coupon'
export default {
  methods: {
		backParent () {
			this.$router.push('/sellerHome');
		},
		async submit () {
			this.infos.promotion.push({
				condition: this.condition,
				denomination: this.denomination
			})
			const toast = this.$createToast({
				txt: '加载中...',
				type: 'loading'
			})
			toast.show();
			let coupon = await this.$api.sendData('https://m.yixiutech.com/shop/update', this.infos);
			toast.hide();
			if (res.code !== 200) {
				this.prompt(res.errMsg, 'error').show();
				return;
			}
			this.prompt('添加优惠券成功', 'correct').show();
			let shop = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
				collection: 'Shop',
				findType: 'findOne',
				owner: JSON.parse(sessionStorage.getItem('user'))._id
			})
			
			this.infos = shop.data;
		}
	},
	async mounted () {
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
			
			shop: sessionStorage.getItem('shopData') ? JSON.parse(sessionStorage.getItem('shopData'))._id : '',
			infos: {
			
			}
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

.add-coupon {
	width: 100%;
	text-align: center;
}

.title {
	padding: 5% 0;
	text-align: center;
}

.condition {
	display: flex;
	align-items: center;
	justify-content: space-around;
	margin: 5% 0;
}

.submit {
	background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
	color: #fff;
}
</style>
