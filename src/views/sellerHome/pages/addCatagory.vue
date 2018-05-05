<template>
  <div class="info">
		<item-header :name="infoName" v-on:backParent="backParent" />
		
		<div class="info__name">
			<p>系统推荐分类</p>
			<!-- <cube-select
				v-model="category.name"
				:options="categoryName"
				@change="typeChange"
			/> -->
		</div>

		<div class="info__name">
			<div class="service">
				<selects ref="select" v-for="(item, index) in brand.list"
					:type="brand.type"
					:key="index"
					:data="item.name"
					@sendMsg="sendMsg(index, item.name)"
					@remove="remove(index, item.name)"
					:index="index"
				/>
			</div>
		</div>


		<!-- <van-field
			v-model="category.name"
			label="分类名称"
			placeholder="请输入分类名称"
		/> -->

		<!-- <van-field
			v-model="category.cover"
			label="封面图片链接"
			placeholder="请输入分类封面图片信息"
		/> -->

		<!-- <van-field
			v-model="category.name"
			label="分类描述"
			placeholder="请输入分类描述"
		/> -->

		<!-- <van-field
			v-model="category.parent"
			label="此分类的父级"
			placeholder="请输入次分类的父级"
		/> -->

		<van-button size="large" @click="submit">确认添加</van-button>

	</div>
</template>

<script>
import { Field, Button } from 'vant'
import selects from '../components/select'
import ItemHeader from '../components/itemHeader'
export default {
	props: {
		parentCategory: String,
		categoryinfos: Array
	},
	components: {
		[Field.name]: Field,
		[Button.name]: Button,
		ItemHeader,
		selects
	},
	data () {
		return {
			categoryList: [],
			categoryName: [],
			infoName: '添加手机分类',
			brand: {
				type: 'category',
				list: []
			},
			categorys: [],
			category: {
				type: sessionStorage.getItem('category'),
				name: '',
				cover: '',
				desc: '',
				// shop: '5ac83157bcbe58709c9bd47a',
				shop: JSON.parse(sessionStorage.getItem('shopData'))._id
			}
		}
	},
	async created() {
		let res = await this.$api.getData('https://m.yixiutech.com/category/phoneRepair');
		if(res.code == 200){
			this.brand.list = res.data;
			// this.categoryName = res.data.map( item => {
			// 	return item.name;
			// })
		}
	},
	watch: {
		categoryinfos: function (val) {
			console.log(val);
			
			val.map( (item, index) => {
				this.brand.list.map( (cateItem, cateIndex) => {
					item.name == cateItem.name ? this.brand.list.splice(cateIndex, 1) : '';
				})
			})
			console.log(this.brand.list);
			
		}
	},
	methods: {
		sendMsg (index, data) {
			this.categorys.push({
				type: sessionStorage.getItem('category'),
				name: data,
				desc: data,
				shop: JSON.parse(sessionStorage.getItem('shopData'))._id
			})
		},
		remove (index, data) {
			this.categorys.map( (item, index) => {
				item.name == data ? this.categorys.splice(index, 1) : null;
			})
		},
		backParent () {
			this.categorys = [];
			this.$refs.select.map(item => {
				item.hasBorder ? item.selectOn() : '';
			})
			this.$emit('backParent', true);
		},
		typeChange (value ,index) {

		},
		async submit () {
			const toast = this.$createToast({
				txt: '加载中...',
				type: 'loading'
			})
			toast.show();
			this.categorys.map( async (item, index) => {
				let categoryRes = await this.$api.sendData('https://m.yixiutech.com/category', item);
				if (categoryRes.code == 200) {
					this.prompt(`添加${item.name}成功`, 'correct').show();
				}
			})
			
			toast.hide();
			// 初始化
			this.categorys = [];
			this.$refs.select.map(item => {
				item.hasBorder ? item.selectOn() : '';
			})
			this.$emit('updateCategory', true);
		}
	}
}
</script>

<style scoped>
.info {
	position: relative;
	background: #fff;
}

.info__name {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	padding: 15px 15px;
	font-size: 14px;
}

.info__name p {
	width: 90px;
}

.service {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content:flex-start;
}

.van-button {
	margin-top: 50px;
}

.info__name .cube-select {
	width: 60%;
}
</style>
