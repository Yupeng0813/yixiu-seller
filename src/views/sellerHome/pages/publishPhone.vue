<template>
	<div class="container">
		<div class="infos">
			<div class="shadow" v-show="areaStatus" @click="cancels"></div>

			<div v-show="!categoryStatus && !paramStatus && !qualityStatus">
				<item-header :name="infosName" @backParent="back" />
				<van-field
					v-model="goods.name"
					label="手机型号"
					placeholder="请输入手机型号"
				/>

				<div class="infos__name">
					<p>手机封面</p>
				</div>

				<div class="upload">
					<input class="upload__select" @change="uploadCover($event)" type="file" accept="image/*" />
					<img class="upload__show" :src="goods.cover" alt="" />
				</div>

				<div class="infos__name">
					<p>手机分类</p>
					<cube-select
						v-model="goods.category"
						:options="categoryList"
						@change="categoryChange"
					/>
				</div>

				<van-field
					v-model="goods.price"
					label="手机价格"
					placeholder="请输入手机价格"
				/>

				<van-field
					v-model="goods.info.primeCost"
					label="手机原价"
					placeholder="请输入手机原价"
				/>

				<van-field
					v-model="goods.desc"
					label="手机描述"
					placeholder="请输入宝贝描述"
				/>

				<van-field
					v-model="goods.info.present"
					label="赠品"
					placeholder="请输入赠品信息"
				/>

				<van-field
					v-model="goods.info.promise"
					label="手机保证"
					placeholder="请输入手机保证"
				/>

				<van-field
					v-model="goods.detail"
					label="手机详情"
					placeholder="请输入手机详情信息"
				/>

				<div class="box">
					<p>发货地址</p>
					<div class="area" @click="showArea">{{ area }}</div>
				</div>

				<van-button class="btn" size="large" @click="addParam">添加手机参数</van-button>

				<van-button class="btn" size="large" @click="openQuality">添加质检数据</van-button>

				<div class="infos__name">
					<p>真机拍摄</p>
				</div>

				<div class="upload" v-for="(item, index) in photos" :key="index">
					<input class="upload__select" @change="uploadFile($event, index)" type="file" accept="image/*" />
					<img class="upload__show" :src="item.url" alt="" />
				</div>

				<van-button class="btn" size="large" @click="addNew">添加新照片</van-button>

				<van-button size="large" @click="submit">确认添加</van-button>

			</div>

			<add-params
				v-show="paramStatus"
				@addParamInfo="addParamInfo"
				@backToPublish="backToPublish"
			/>

			<add-quality
				v-show="qualityStatus"
				@addQualityInfos="addQualityInfos"
				@backToPublish="backToPublish"
			/>

			<!-- <add-category 
				v-show="categoryStatus"
				:parentCategory="category"
				v-on:updateCategory="updateCategory"
				v-on:backParent="backParent"
			/> -->
		</div>

		<van-area 
			:area-list="areaList"
			v-show="areaStatus"
			:columns-num="2"
			@confirm="confirms"
			@cancel="cancels"
		/>
	</div>
</template>

<script>
import ItemHeader from '../components/itemHeader'
import { Field, Button, Uploader, Area, Toast } from 'vant'
import areaList from '../../my/components/data/area.json'
import addParams from '../components/addParams'
import addQuality from '../components/addQuality'
import addCategory from './addCatagory'
import selects from '../components/select';
export default {
	components: {
		[Field.name]: Field,
		[Button.name]: Button,
		[Uploader.name]: Uploader,
		[Area.name]: Area,
		[Toast.name]: Toast,
		ItemHeader,
		addCategory,
		addParams,
		addQuality
	},
	async mounted () {
		let data = { type: 'goods', shop: this.goods.shop }
		let categoryRes = await this.$api.sendData('https://m.yixiutech.com/category/shop', data);

		if (categoryRes.data.length == 0) {
			let addCate = await this.$api.sendData('https://m.yixiutech.com/category', {
				type: 'goods',
				name: '精品手机',
				shop: this.goods.shop
			})
			if (addCate.code == 200) {
				this.category = addCate.data[0]._id
			}
		} else {
			categoryRes.data.map(item => {
				item.name == '精品手机' ? this.category = item._id : null;
			})
		}
		
		this.updateCategory();
	},
  data () {
		return {
			infosName: '发布宝贝',
			categoryStatus: false,
			paramStatus: false,
			area: '选择省份  选择城市',
			qualityStatus: false,
			areaStatus: false,
			areaList: areaList,
			photos: [{
				url: 'https://xuhaichao-1253369066.cos.ap-chengdu.myqcloud.com/camera.png'
			}],
			photo: 'https://xuhaichao-1253369066.cos.ap-chengdu.myqcloud.com/camera.png',
			src: 'https://xuhaichao-1253369066.cos.ap-chengdu.myqcloud.com/camera.png',
			goods: {
				shop: JSON.parse(sessionStorage.getItem('shopData'))._id,
				// shop: '5ab93879d4e7f1497d58d94e',
				cover: 'https://xuhaichao-1253369066.cos.ap-chengdu.myqcloud.com/camera.png',
				info: {
					photo: [],
					version: '',
					primeCost: '',
					present: '',
					assure: [],
					productParam: {},
					qualityParam: {}
				}
			},
			base: ['重庆'],
			categoryList: [],
			category: ''
		}
	},
	methods: {
		cancels () {
			this.areaStatus = false;
		},
		confirms (value) {
			let province = value[0].name;
			let city = value[1].name;
			this.goods.info.area = `${province} ${city}`;
			this.areaStatus = false;
		},
		showArea () {
			this.areaStatus = true;
		},
		addCategorys () {

		},
		async uploadCover (event) {
			this.file = event.target.files[0];
			let url = window.URL.createObjectURL(this.file);

			this.goods.cover = url;

			let formdata = new FormData();

			formdata.append('file', this.file);

			let config = {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}

			const toast = this.$createToast({
				txt: '加载中...'
			})
			toast.show();
			let res = await this.$api.sendData('https://m.yixiutech.com/upload', formdata, config);
			this.goods.cover = res.data;
		},
		addParamInfo (data) {
			this.goods.info.productParam = data;
			this.paramStatus = false;
		},
		addQualityInfos (data) {
			this.goods.info.qualityParam = data;
			this.qualityStatus = false;
		},
		openQuality () {
			this.qualityStatus = true;
		},
		addParam () {
			this.paramStatus = !this.paramStatus
		},
		backToPublish() {
			this.qualityStatus = false;
			this.paramStatus = false;
		},
		back () {
			this.$router.push('/sellerHome');
		},
		backParent () {
			this.categoryStatus = false;
		},
		async updateCategory () {
			this.categoryStatus = false;
			let hasCategory = await this.$api.getData('https://m.yixiutech.com/category/parent/' + this.category);

			this.categoryList.length = 0;

			// 隐式添加
			if (hasCategory.data.length == 0) {
				const data = [
					{
						type: 'goods',
						name: 'ios',
						shop: this.goods.shop,
						parent: this.category
					},
					{
						type: 'goods',
						name: 'android',
						shop: this.goods.shop,
						parent: this.category
					}
				]
				let i = 2;
				data.map(async (item, index) => {
					let addCate = await this.$api.sendData('https://m.yixiutech.com/category', item);
					if (addCate.code == 200) {
						i--;
					}
					if (i == 0) {
						let newRes = await this.$api.getData('https://m.yixiutech.com/category/parent/' + this.category);

						newRes.data.map(item => {
							this.categoryList.push({value: item._id, text: item.name});
						})
					}
				})

			} else {
				hasCategory.data.map(item => {
					this.categoryList.push({value: item._id, text: item.name});
				})
			}
		},
		appendCategory () {
			this.categoryStatus = !this.categoryStatus;
			sessionStorage.setItem('category', 'goods');
		},
		async uploadFile (event, index) {
			this.file = event.target.files[0];
			let url = window.URL.createObjectURL(this.file);

			this.photos[ index ].url = url;


			let formdata = new FormData();

			formdata.append('file', this.file);

			let config = {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}

			const toast = this.$createToast({
				txt: '加载中...'
			})
			toast.show();
			let res = await this.$api.sendData('https://m.yixiutech.com/upload', formdata, config);
			if (res.code !== 200) {
				this.prompt('网络错误, 请重新上传', 'error').show();
				return;
			}
			this.goods.info.photo.push({
				url: res.data
			});
		},
		addNew () {
			this.photos.push({
				url: 'https://xuhaichao-1253369066.cos.ap-chengdu.myqcloud.com/camera.png'
			});
		},
		fileRemove () {

		},
		baseChange (value, index) {
			
		},
		filesAdded(files) {
			const maxSize = 1 * 1024 * 1024
			for (let k in files) {
				const file = files[k]
				if (file.size > maxSize) {
					file.ignore = true
				}
			};
		},
		categoryChange (value, index) {

		},
		async submit () {
			let goodRes = await this.$api.sendData('https://m.yixiutech.com/goods/shop', this.goods);
			if (goodRes.code !== 200) {
				this.prompt(goodRes.errMsg, 'error').show();
				return;	
			}
			this.prompt('发布成功', 'success').show();
			this.$router.push('/sellerHome');
		},
		onRead (file, content) {
			this.goods.cover = file.content;
		}
	}
}
</script>

<style scoped>
.container {
	width: 100%;
	height: 100%;
	position: relative;
}

.shadow {
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.4);
	position: absolute;
	left: 0;
	top: 0;
	z-index: 20;
}

.infos {
	width: 100%;
	overflow: hidden;
	position: absolute;
	left: 50%;
	transform: translate(-50%);
	text-align: center;
}

.box {
  padding: 2% 7.5%;
  text-align: left;
  display: flex;
  align-items: center;
}

.box p {
	font-size: 14px;
}

.box .area {
  font-size: 14px;
  margin-left: 14px;
}

.infos__name {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	padding: 0 15px;
	margin-top: 20px;
	font-size: 14px;
}

.van-area {
	width: 100%;
	position: fixed;
	bottom: 0;
	z-index: 21;
}

.infos__name p {
	width: 90px;
}

.infos .van-uploader {
	display: flex;
	justify-content: center;
	margin: 10px 0;
}

.infos .infos__img {
	width: 100px;
	height: 100px;
}

.btn {
	width: 80%;
	display: inline-block;
	color: #fff;
	background: #e0620d;
}

.upload {
	width: 100%;
	height: 100px;
}

.upload .upload__show {
	position: absolute;
	width: 100px;
	height: 80px;
	left: 50%;
	margin-left: -50px;
}

.upload .upload__select {
	position: absolute;
	z-index: 8;
	font-size: 50px;
	opacity: 0;
	left: 0;
}

.cube-upload-def {
	width: 90%;
}

.van-button {
	margin-top: 10px;
}

.infos__name .cube-select {
	width: 60%;
}
</style>
