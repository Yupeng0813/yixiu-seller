<template>
  <div class="seller">
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh" v-show="!waitStatus">
			<Header
				:shopData="shopData"
			/>
			<List 
				:shopData="shopData"
				:modules="modules"
			/>
			<Content v-for="(item, index) in content" :key="index"
				:name="item.name"
				:icon="item.icon"
				:link="item.link"
			/>
		</van-pull-refresh>

		<wait
			v-show="waitStatus"
		/>
		 
		 <!-- 删除店铺信息按钮 慎用 -->
		 <!-- <button @click="deleteData">删除</button> -->
  </div>
</template>

<script>
	import { PullRefresh } from 'vant';
	import Header from './components/header.vue'
	import List from './components/list.vue'
	import Content from './components/content.vue'
	import defaults from '@/assets/default.jpg'
	import wait from '../businessRegister/pages/wait.vue'
  export default {
    components: {
			Header,
			List,
			Content,
			wait,
			[PullRefresh.name]: PullRefresh
		},
		data () {
			return {
				isRegister: true,
				state: '',
				waitStatus: false,
				isLoading: false,
				content: [
					// { name: '添加手机维修服务', icon: 'fuwu', link: '/service' },
					// { name: '查看手机服务列表', icon: 'view', link: '/viewServices' },
					// { name: '修改手机维修服务', icon: 'update', link: '/updateService' },
					// { name: '二手手机交易', icon: 'publish', link: '/publishPhone' },
					// { name: '删除已发布二手手机', icon: 'delete', link: '/deletePhone' },
					// { name: '完善信息', icon: 'identification', link: '/updateMsg' },
					// { name: '缴纳保证金', icon: 'baozhengjin', link: '/payBail' },
					// { name: '商家钱包', icon: 'wallet', link: '/shopWallet' }
				],
				shop: '',
				beforeOrder: [],
				inOrder: [],
				afterOrder: [],
				allOrder: [],
				price: 0,
				modules: [
					{ name: '待接单', num: 0, state: 11},
					{ name: '维修中', num: 0, state: 12 },
					{ name: '已完成', num: 0, state: 13 },
					{ name: '浏览量', num: 0, state: 0 }
				],
				shopData: {}
			}
		},
		watch: {
			shopData: function(val){
				this.shopData = val;
			}
		},
		// async created () {
		// 	// let data = { shop: '5a9fe2a27c67ee2f8c98c9d5', state: 12 }
		// 	// let res = await this.$api.sendData('https://yixiu.natappvip.cc/order/service/filter', data);
		// },
		// 删除店铺信息  慎用
		async created () {
			let res = await this.$api.sendData('https://m.yixiutech.com/shop/filter', {limit: 100, skip: 0});
			sessionStorage.setItem('shopData', JSON.stringify(res.data[9]));

			// let reset = await this.$api.sendData('https://m.yixiutech.com/sql/update', {
			// 	collection: 'User',
			// 	find: {
			// 		_id: '5ad243afab85e142eaef928d'
			// 	},
			// 	update: {
			// 		money: 0
			// 	}
			// })
			const toast = this.$createToast({
				txt: '加载中...',
				type: 'loading'
			})
			toast.show();
			// let userData = JSON.parse(this.urlDataTurnObj(window.location.href)).openid;
			// userData !== undefined ? localStorage.setItem('openid', userData) : null;

			this.shopData = JSON.parse(sessionStorage.getItem('shopData'));

			this.shop = this.shopData._id;
			
			// let res = await this.$api.sendData('https://m.yixiutech.com/shop/user/', {openid: openid});

			// alert(JSON.stringify(res.data));
			// this.shopData = res.data;
			toast.hide();

			if (this.shopData.qualificationState !== '正常') {
				this.waitStatus = true;
				return;
			}


			if (this.shopData.pay) { //已缴纳保证金
				this.content = [
					{ name: '添加手机维修服务', icon: 'fuwu', link: '/service' },
					{ name: '管理手机服务列表', icon: 'view', link: '/viewServices' },
					// { name: '修改手机维修服务', icon: 'update', link: '/updateService' },
					{ name: '优惠券管理', icon: 'card', link: '/manageCoupon' },
					// { name: '二手手机交易', icon: 'publish', link: '/publishPhone' },
					// { name: '删除已发布二手手机', icon: 'delete', link: '/deletePhone' },
					{ name: '完善信息', icon: 'identification', link: '/updateMsg' },
					{ name: '商家钱包', icon: 'wallet', link: '/shopWallet' }
				];
			} else { // 未缴纳保证金
				this.content = [
					{ name: '缴纳保证金', icon: 'baozhengjin', link: '/payBail' }
				]
				this.prompt('您还未缴纳保证金，请缴纳保证金', 'error').show()
			}

			if (this.shopData.sellPhone) {
				this.content.splice(2, 0, 
				{ name: '发布精品手机', icon: 'publishPhone', link: '/publishPhone' }, 
				{
					name: '管理精品手机', icon: 'manage', link: '/showPhones'
				});
			}

			let i = 3;

			this.modules.slice(0, 3).map( async (item, index) => {
				let res = await this.$api.sendData('https://m.yixiutech.com/order/service/filter', { shop: this.shop, state: item.state });
				i--;
				this.allOrder = this.allOrder.concat(res.data);
				index == 0 ? this.beforeOrder = res.data : (index == 1 ? this.inOrder = res.data : this.afterOrder = res.data);
				i == 0 ? this.updateShop() : null;
				item.num = res.data.length;
			})
			this.modules[3].num = this.shopData.pv;

			// 操作数据

		},
		methods: {
			async updateShop () {
				this.allOrder.map(item => {
					this.price += item.payment / 100
				})

				let services = await this.$api.sendData('https://m.yixiutech.com/sql/find', { 
					collection: 'Service', 
					limit: 1000, 
					shop: JSON.parse(sessionStorage.getItem('shopData'))._id
				})

				let data = {
					'serviceFinishCount': this.allOrder.length,
					'price': this.price,
					'serviceCount': services.data.length
				}

				let updateShop = await this.$api.sendData('https://m.yixiutech.com/sql/update', {
					collection: 'Shop',
					find: {
						_id: JSON.parse(sessionStorage.getItem('shopData'))._id
					},
					update: data
				})


			},
			async onRefresh() {
				let shop = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
					collection: 'Shop',
					findType: 'findOne',
					_id: this.shopData._id
				})

				this.shopData = shop.data;

				if (this.shopData.qualificationState !== '正常') {
					this.waitStatus = true;
          return;
        }

				if (this.shopData.pay) { //已缴纳保证金
					this.content = [
						{ name: '添加手机维修服务', icon: 'fuwu', link: '/service' },
						{ name: '管理手机服务列表', icon: 'view', link: '/viewServices' },
						// { name: '修改手机维修服务', icon: 'update', link: '/updateService' },
						{ name: '优惠券管理', icon: 'card', link: '/manageCoupon' },
						// { name: '二手手机交易', icon: 'publish', link: '/publishPhone' },
						// { name: '删除已发布二手手机', icon: 'delete', link: '/deletePhone' },
						{ name: '完善信息', icon: 'identification', link: '/updateMsg' },
						{ name: '商家钱包', icon: 'wallet', link: '/shopWallet' }
					];
				} else { // 未缴纳保证金
					this.content = [
						{ name: '缴纳保证金', icon: 'baozhengjin', link: '/payBail' }
					]
					this.prompt('您还未缴纳保证金，请缴纳保证金', 'error').show();
				}

				if (this.shopData.sellPhone) {
					this.content.splice(2, 0, { name: '发布精品手机', icon: 'publishPhone', link: '/publishPhone' }, 
					{
						name: '管理精品手机', icon: 'manage', link: '/showPhones'
					});
				}

				this.modules.slice(0, 3).map( async item => {
					let res = await this.$api.sendData('https://m.yixiutech.com/order/service/filter', { shop: this.shop, state: item.state });
					index == 0 ? this.beforeOrder = res.data : (index == 1 ? this.inOrder = res.data : this.afterOrder = res.data);
					item.num = res.data.length;
				})

				this.modules[3].num = this.shopData.pv;

				this.isLoading = false;
			},
			async deleteData(){
				// 删除店铺
				let req = {
					_id: "5ad37f7e1f38b549961e4f83"
				}
				let res = await this.$api.sendData('https://m.yixiutech.com/shop/delete', req);
				console.log(res);

				//删除手机型号
				// let req = {
				// 	_id: "5ab8afbbd4e7f1497d58d906",
				// 	shop: "5ab8ae16d4e7f1497d58d8fc"
				// }
				// let res = await this.$api.sendData('https://m.yixiutech.com/phone/model/delete', req);
				// console.log(res);

				//删除分类
				// let req = {
				// 	_id: "5ab8d946d4e7f1497d58d92a"
				// }
				// let res = await this.$api.sendData('https://m.yixiutech.com/category/delete', req);
				// console.log(res);

			}
		}
  }
</script>

<style scoped>
	.seller{
		width: 100vw;
		height: 100vh;
	}
</style>
