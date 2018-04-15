<template>
	<div class="infos">

		<div>
			<item-header :name="name"  v-on:backParent="back"/>
			<!-- <div class="box">
				<p>选择品牌</p>
				<div class="service">
					<single-select ref="select"  v-for="(item, index) in brand.list"
						:type="brand.type"
						:key="index" 
						v-on:cancelOther="cancel"
						:data="item.name"
						:manufacturer="item._id"
					/>
				</div>
				<van-button size="large" @click="openBrand">添加品牌</van-button>
			</div> -->

			<van-field
				v-model="model.name"
				label="型号名称"
				disabled
			/>
			
			<!-- <div class="box">
				<p>选择型号</p>

				<div class="service">
					<single-select ref="model"  v-for="(item, index) in modelNames"
						:type="brand.type"
						:key="index" 
						v-on:cancelOther="modelCancel"
						:data="item"
						:manufacturer="item._id"
					/>
				</div>
				<van-button size="large" @click="openModel">添加型号</van-button>
			</div> -->
			
			<!-- <div class="box">
				<p>选择颜色</p>
				<div class="service">
					<single-select ref="select" v-for="(item, index) in colors.list"
						:type="colors.type"
						:key="index"
						v-on:cancelOther="colorSelect"
						:data="item"
					/>
				</div>
			</div> -->

			<div class="box">
				<p>已添加的维修服务</p>
				<div class="box-item" v-for="(item, index) in categoryinfos" :key="index">
					<p @click="showItem(index)"><sicon name="add" scale="2.4"></sicon><span class="box__name">{{ item.name }}</span></p>
					<div v-show="item.show">
						<div class="concrete-service" v-for="(listItem, listIndex) in item.list" :key="listIndex">
							<input type="text" v-model="listItem.name" placeholder="服务的名称" />
							<input type="text" v-model="listItem.price" placeholder="服务的价格"/>
						</div>
					</div>
					
				</div>

				<van-button size="large" @click="submit">提交</van-button>
			</div>
		</div>
		
		
	</div>
</template>

<script>
import selects from '../components/select'
import singleSelect from '../components/singleSelect'
import { Checkbox, CheckboxGroup, Cell, CellGroup, Button, Field } from 'vant'
import addBrand from './addBrand'
import addModel from './addModel'
import addCategory from './addCatagory'
import itemHeader from '../components/itemHeader'
export default {
  components: {
		selects,
		singleSelect,
		[Checkbox.name]: Checkbox,
		[CheckboxGroup.name]: CheckboxGroup,
		[Cell.name]: Cell,
		[CellGroup.name]: CellGroup,
		[Button.name]: Button,
		[Field.name]: Field,
		addBrand,
		addModel,
		addCategory,
		itemHeader
	},
	data () {
		return {
			brandName: undefined,
			name: '修改手机维修服务',
			brand: {
				type: 'brand',
				list: []
			},
			sysModel: [],
			brandId: '',
			models: [],
			modelNames: [],
			phoneModel: [],
			modelRes: [],
			manufacturer: '',
			categoryNames: [],
			categoryinfos: [],
			active: '',
			res: {},
			model: {},
			modelStatus: false,
			brandStatus: false,
			categoryStatus: false,
			services: [],
			shop: JSON.parse(sessionStorage.getItem('shopData'))._id,
			// shop: '5ac83157bcbe58709c9bd47a',
			result: [],
			colors: {
				type: 'color',
				list: []},
			questions: [
				{ name: '屏幕问题', show: false, list: [
					{ name: '内屏碎裂', price: 200 },
					{ name: '外屏碎裂', price: 100 }
				]},
				{ name: '电池电源问题', show: false, list: [

				]}
			]
		}
	},
	async mounted () {
		window.status = false;
		const toast = this.$createToast({
			txt: '加载中...',
			type: 'loading'
		})
		toast.show();

		this.model = JSON.parse(sessionStorage.getItem('serviceItem'));

		let category = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
			collection: 'Category',
			shop: this.shop,
			type: 'service',
		})

		let tempArr = [];

		category.data.map(item => {
			tempArr.push(Object.assign({}, item, {list: [], show: true}))
		})

		let hasService = await this.$api.sendData('https://m.yixiutech.com/sql/find', {
			collection: 'Service',
			shop: this.shop,
			support: {
				$in: [ this.model._id ]
			}
		})

		hasService.data.map(item => {
			tempArr.map( (categoryItem, categoryIndex) => {
				item.category == categoryItem._id ? categoryItem.list.push(item) : null;
			})
		})

		this.categoryinfos = tempArr.filter(this.isEmpty);

		toast.hide();
	},
	methods: {
		isEmpty (object) {
			return object.list.length !== 0;
		},
		modelCancel (data) {
			let zData = data.split('&');
			let type = zData[1];
			let name = zData[0];
			this.manufacturer = zData[2]
			this.brandName = name;

			this.models.map(item => {
				item.name == name ? this.modelRes = [ item._id ] : null;
			})

			// 取消其他几个子项的选中
			this.$refs.model.map(item => {
				if (item.type == type && item.data !== name) {
					item.cancelSelect()
				}
			})
		},
		back () {
			this.$router.push('/viewServices');
		},
		submit () {
			this.services = [];
			this.categoryinfos.map(item => {
				item.list.map(childItem => {
						if (childItem.name !== undefined && childItem.name !== '' && childItem.price !== '') {
							let obj = Object.assign(childItem, {shop: this.shop, support: this.modelRes})
							this.services.push(obj);	
						}
				})
			})
			console.log(this.services);
			const toast = this.$createToast({
				txt: '请稍后...',
				type: 'loading'
			})
			toast.show();
			this.services.map(async item => {
				let res = await this.$api.sendData('https://m.yixiutech.com/service/update', item);
				res.code == 200 ? this.prompt(`更新成功`, 'correct').show() : alert(res.errMsg);
			})
			toast.hide();
			this.$router.push('/sellerHome');
		},
		async updateModel () {
			this.modelStatus = false;
			let model = await this.$api.sendData('https://m.yixiutech.com/phone/model/shop/', { shop: this.shop, manufacturer: this.manufacturer });
			this.models = model.data;
			this.modelNames  = [];
			model.data.map(item => {
				this.modelNames.push(item.name);
			})
			
		},
		async updateBrand () {
			this.brandStatus = false;
			let ownBrand = await this.$api.getData('https://m.yixiutech.com/phone/manufacturer/shop/' + this.shop);
			this.brand.list = ownBrand.data;
		},
		sendMsg (index) {
			this.modelRes.push(this.models[ index ]._id);
		},
		remove (index) {
			let id = this.models[ index ]._id;
			this.modelRes.map( (item, index) => {
				item == id ? this.modelRes.splice(index, 1) : null;
			})
		},
		openCategory () {
			this.categoryStatus = true;
			sessionStorage.setItem('category', 'service');
		},
		openBrand () {
			this.brandStatus = true;
		},
		openModel () {
			this.brandName !== '' ? this.modelStatus = true : this.prompt('请先添加品牌!', 'warn').show();
		},
		backParent () {
			this.brandStatus = false;
			this.modelStatus = false;
			this.categoryStatus = false;
		},
		addService (index, categoryId) {
			this.categoryinfos[ index ].list.push({
				category: categoryId
			}); 
		},
		colorSelect (data) {
			let color = data.split('&')[0];
		},
		modelChange (value, index) {
			this.colors.list = this.models[ index ].color;
		},
		async updateCategory (data) {
			this.categoryStatus = false;
			// let sysCategory = await this.$api.getData('https://m.yixiutech.com/category/phoneRepair');
			let ownCategory = await this.$api.sendData('https://m.yixiutech.com/category/shop', {type: 'service', shop: this.shop});
			
			this.categoryinfos = [];
			// 已拥有的分类添加
			ownCategory.data.map(item => {
				this.categoryinfos.push({
					_id: item._id,
					name: item.name,
					show: false,
					list: []
				})
			})
		},
		async cancel (data) {
			let zData = data.split('&');
			let type = zData[1];
			let name = zData[0];
			this.manufacturer = zData[2]
			this.brandName = name;

			let sysBrand = await this.$api.getData('https://m.yixiutech.com/phone/manufacturer');
			sysBrand.data.map(item => {
				item.name == this.brandName ? this.brandId = item._id : null;
			})

			let sysModel = await this.$api.getData('https://m.yixiutech.com/phone/model/' + this.brandId);
			
			this.sysModel = sysModel.data;

			this.phoneModel = [];
			
			this.sysModel.map(item => {
				this.phoneModel.push({
					text: item.name,
					value: item._id
				})
			})
			
			// 根据手机品牌获取型号
			const toast = this.$createToast({
				txt: '加载中...',
				type: 'correct'
			})
			toast.show();
			this.updateModel();
			toast.hide();

			// 取消其他几个子项的选中
			this.$refs.select.map(item => {
				if (item.type == type && item.data !== name) {
					item.cancelSelect()
				}
			})
		},
		showItem (index) {
			this.categoryinfos[index].show = !this.categoryinfos[index].show;
		}
	}
}
</script>

<style scoped>
.infos {
	background: #eee;
}

.service {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content:flex-start;
}

.service-item {
	position: relative;
}

.service-item .price {
	position: absolute;
	right: 0;
	top: 50%;
	width: 30%;
	transform: translate(0, -50%);
}

.service-item .price input {
	width: 100%;
}

.van-button {
	margin: 10px 0;
}

.box {
	width: 96%;
	padding: 2%;
	background: #fff;
	margin-bottom: 4%;
}

.box .box-item p {
	padding: 2%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	border-bottom: 1px solid #eee;
}

.concrete-service {
	display: flex;
	width: auto;
	padding: 2%;
	justify-content: space-around;
	align-items: center;
	border: 1px solid #eee;
	margin-top: 10px;
}
.concrete-service input{
	width: 40%;
}

.box .svg-icon {
	display: inline-block;
}

.box .box__name {
	display: inline-block;
	margin-left: 10px;
}

</style>
