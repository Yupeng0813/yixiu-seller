<template>
	<div class="view-service">
		<item-header
			:name="name"
			v-on:backParent="back"
		/>

		<service-item
			:data="model"
			@deleteTarget="deleteTarget"
		/>

	</div>
</template>

<script>
import serviceItem from '../components/serviceItem'
import itemHeader from '../components/itemHeader'
export default {
  async mounted () {

		// let search = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
		// 	collection: 'PhoneModel',
		// 	_id: '5ae1a166e3c2bf0434448961'
		// })
		
		// 已添加维修服务的手机型号
		let phone = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
			collection: 'Service',
			shop: this.shop,
			limit: 1000
		})

		// 自有的手机型号
		let ownModel = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
			collection: 'PhoneModel',
			shop: this.shop,
			limit: 1000
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
		deleteTarget (data) {
			this.model.map( (item, index) => {
				item._id == data ? this.model.splice(index, 1) : null;
			})
		},
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
