<template>
	<div class="view-service">
		<item-header
			:name="name"
			v-on:backParent="back"
		/>

		<service-item
			:data="model"
		/>

	</div>
</template>

<script>
import serviceItem from '../components/serviceItem'
import itemHeader from '../components/itemHeader'
export default {
  async mounted () {
		// let data = { shop: this.shop };
		// let serviceMap = await this.$api.sendData('https://m.yixiutech.com/service/shop', data);
		// serviceMap.code == 200 ? this.services = serviceMap.data : null;

		// 已添加维修服务的手机型号
		let phone = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
			collection: 'Service',
			shop: this.shop
		})

		// 自有的手机型号
		let ownModel = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
			collection: 'PhoneModel',
			shop: this.shop
		})

		let temp = [];

		phone.data.map(item => {
			ownModel.data.map(modelItem => {
				item.support[0] == modelItem._id ? temp.push(modelItem) : null;
			})
		})

		var hash = {};
		this.model = temp.reduce(function(item, next) {
				hash[next.name] ? '' : hash[next.name] = true && item.push(next);
				return item
		}, [])
	},
	methods: {
		back () {
			this.$router.push('/sellerHome')
		} 
	},
	data () {
		return {
			name: '已添加过服务的手机型号',
			model: [],
			shop: JSON.parse(sessionStorage.getItem('shopData'))._id
		}
	},
	components: {
		itemHeader,
		serviceItem
	}
}
</script>

<style scoped>

</style>
