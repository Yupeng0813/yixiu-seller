<template>
	<div class="container">
		<div class="info">
			<div class="shadow" v-show="areaStatus" @click="cancels"></div>

			<router-link to="/enterRules">
				<sicon name="back" scale="3"></sicon>
			</router-link>

			<img class="info__logo" :src="logo" alt="" />

			<p class="head">身份证正面(限制图片大小300KB)</p>

			<div class="upload">
				<input class="upload__select" @change="idcardUpload1($event, 'idcard1')" type="file" accept="image/*" />
				<img class="upload__show" :src="id1" alt="" />
			</div>

			<p class="head">身份证反面(限制图片大小300KB)</p>

			<div class="upload">
				<input class="upload__select" @change="idcardUpload2($event)" type="file" accept="image/*" />
				<img class="upload__show" :src="id2" alt="" />
			</div>

			<p class="head">营业执照(限制图片大小300KB)</p>

			<div class="upload">
				<input class="upload__select" @change="licenseUpload($event)" type="file" accept="image/*" />
				<img class="upload__show" :src="license" alt="" />
			</div>

			<!-- <p class="head">运营资格证书</p>

			<div class="upload">
				<input class="upload__select" @change="certificateUpload($event)" type="file" accept="image/*" />
				<img class="upload__show" :src="certificate" alt="" />
			</div> -->

			<!-- <p class="head">下载协议 <a class="link" href="http://oss2.yixiutech.com/翼修入驻协议+-1526211424.docx">翼修入驻协议.docx</a></p>

			<p class="links">温馨提示: 如果上述链接点击不能下载，请手动复制以下地址到浏览器上进行下载!</p>

			<van-field
				label="协议地址"
				placeholder="请勿删除协议地址"
				v-model="linkAddress"
			/>
			
			<p class="head">拍照上传翼修入驻协议</p>
			
			<div class="upload">
				<input class="upload__select" @change="protocolUpload($event, 'protocol')" type="file" accept="image/*" />
				<img class="upload__show" :src="protocol" alt="" />
			</div> -->

			<p class="head">商铺封面(限制图片大小300KB)</p>

			<div class="upload">
				<input class="upload__select" @change="coverUpload($event)" type="file" accept="image/*" />
				<img class="upload__show" :src="infos.cover" alt="" />
			</div>

			<van-field
				v-model="infos.name"
				label="商铺名称"
				class="item"
				placeholder="请输入商铺名称"
			/>

			<van-field
				v-model="infos.contactNumber"
				label="联系电话"
				placeholder="请输入联系电话"
			/>

      <div class="box">
        <p>所在地区</p>
        <div class="area" @click="showArea">{{ area }}</div>
      </div>

			<van-field
				v-model="address"
				label="详细地址"
				placeholder="请输入详细地址，具体到门牌号"
			/>


			<div class="info-item">
				<p class="info-item__title">开始营业时间</p>
				<p class="info-item__content">{{ startHour }}</p>
			</div>
			

			<cube-button @click="start">选择开始营业时间</cube-button>

			<div class="info-item">
				<p class="info-item__title">结束营业时间</p>
				<p class="info-item__content">{{ endHour }}</p>
			</div>

			<cube-button @click="finish">选择结束营业时间</cube-button>

			<!-- <div class="condition" v-for="(item, index) in infos.promotion" :key="index">
				<van-field
					v-model="item.condition"
					class="full-cut"
					label="满减条件"
					placeholder="满减条件"
				/>

				<van-field
					v-model="item.denomination"
					class="full-cut"
					label="满减额度"
					placeholder="满减额度"
				/>
			</div>

			<cube-button @click="add">添加满减条件</cube-button> -->

			<!-- <van-field
				v-model="serviceWay"
				label="服务方式"
				placeholder="请输入支持的服务方式，用中文逗号隔开"
				@blur="serviceBlur"
			/> -->

			<div class="info-item">
				<p class="info-item__title">请选择服务方式</p>
			</div>

			<div class="service">
				<selects v-for="(item, index) in serviceWay"  
					@sendMsg="setData"
					@remove="removeData"
					:key="index"
					:data="item"
				/>
			</div>

			<div id="allmap"></div>

			<cube-button class="register" @click="register">注册</cube-button>
		</div>
		<van-area 
			:area-list="areaList"
			v-show="areaStatus"
			@confirm="confirms"
			@cancel="cancels"
		/>
	</div>
</template>

<script>
import InfoItem from './infoItem'
import { Field, Uploader, Icon, Area, Toast } from 'vant'
import timeJson from '../data/data.json'
import logo from '@/assets/logo.png'
import file from '@/assets/file.png'
import areaList from '../../my/components/data/area.json'
import selects from '../../sellerHome/components/select'
export default {
	async mounted () {
		window.status = false;
		this.startPicker = this.$createPicker({
      title: '选择开始营业时间',
      data: [this.time],
      onSelect: (selectedVal, selectedIndex, selectedText) => {
        this.startHour = `${ selectedVal[0] }:00`;
      }
		})
		this.endPicker = this.$createPicker({
      title: '选择结束营业时间',
      data: [this.time],
      onSelect: (selectedVal, selectedIndex, selectedText) => {
				this.endHour = `${ selectedVal[0] }:00`
				this.infos.businessHours.push(this.startHour + ' - ' + this.endHour);
      }
		})
		
	},
	components: {
		[Field.name]: Field,
		[Uploader.name]: Uploader,
		[Icon.name]: Icon,
		[Area.name]: Area,
		selects
	},
	data () {
		return {
			startHour: '',
			endHour: '',
			area: '选择省份  选择城市  选择地区',
			serviceWay: ['用户到店', '上门维修', '快递维修'],
			logo: logo,
			areaStatus: false,
			areaList: areaList,
			files: file,
			address: '',
			linkAddress: 'http://oss2.yixiutech.com/翼修入驻协议+-1526211424.docx',
			file: file,
			id1: 'https://xuhaichao-1253369066.cos.ap-chengdu.myqcloud.com/camera.png',
			id2: 'https://xuhaichao-1253369066.cos.ap-chengdu.myqcloud.com/camera.png',
			license: 'https://xuhaichao-1253369066.cos.ap-chengdu.myqcloud.com/camera.png',
			certificate: 'https://xuhaichao-1253369066.cos.ap-chengdu.myqcloud.com/camera.png',
			protocol: 'https://xuhaichao-1253369066.cos.ap-chengdu.myqcloud.com/camera.png',
			cover: 'https://xuhaichao-1253369066.cos.ap-chengdu.myqcloud.com/camera.png',
			infos: {
				name: '',
				cover: 'https://xuhaichao-1253369066.cos.ap-chengdu.myqcloud.com/camera.png',
				contactNumber: '',
				serviceWay: [],
				position: {
					lng: '',
					lat: ''
				},
				businessHours: [],
				owner: JSON.parse(sessionStorage.getItem('user'))._id,
				ownerOpenid: JSON.parse(sessionStorage.getItem('userInfo')) ? JSON.parse(sessionStorage.getItem('userInfo')).openid : '',
				certificate: [
					{ name: 'idcard1', src: 'https://xuhaichao-1253369066.cos.ap-chengdu.myqcloud.com/camera.png' },
					{ name: 'idcard2', src: 'https://xuhaichao-1253369066.cos.ap-chengdu.myqcloud.com/camera.png' },
					{ name: 'license', src: 'https://xuhaichao-1253369066.cos.ap-chengdu.myqcloud.com/camera.png' }
				]
			},
			time: timeJson,
			certificateTips: [
				'身份证正面未上传成功，请重新上传',
				'身份证背面未上传成功，请重新上传',
				'营业执照未上传成功，请重新上传',
				'运营资格证书未上传成功，请重新上传',
				'翼修入驻协议未上传成功，请重新上传'
			],
		}
	},
	methods: {
		cancels () {
			this.areaStatus = false;
		},
		confirms (value) {
			let province = value[0].name;
			let city = value[1].name;
			let area = value[2].name;
			this.area = `${province} ${city} ${area}`;
			this.areaStatus = false;
		},
		showArea () {
			this.areaStatus = true;
		},
		setData (data) {
			this.infos.serviceWay.push(data);
		},
		removeData (data) {
			this.infos.serviceWay.map( (item, index) => {
				item == data ? this.infos.serviceWay.splice(index, 1) : null
			})
		},
		async uploadPic (pic, name) {
			let formdata = new FormData();

			formdata.append('file', pic);

			let config = {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}

			const toast = Toast.loading({
				duration: 0,
				forbidClick: true,
				message: '请稍后...'
			});
			let res = await this.$api.sendData('https://m.yixiutech.com/upload2', formdata, config);

			this.infos.certificate.map( item => item.name == name ? item.src = res.data : null );

			name == 'cover' ? this.infos.cover = res.data : null;

			toast.clear();
		},
		coverUpload (event, name) {
			this.file = event.target.files[0];
			if (Math.round(this.file.size/1024 * 100) / 100 > 300) {
				alert('上传的图片不能大于300kb');
			}
			let url = window.URL.createObjectURL(this.file);
			this.infos.cover = url;
			this.uploadPic(this.file, 'cover');
		},
		protocolUpload (event, name) {
			this.file = event.target.files[0];
			if (Math.round(this.file.size/1024 * 100) / 100 > 300) {
				alert('上传的图片不能大于300kb');
				return;
			}
			let url = window.URL.createObjectURL(this.file);
			this.protocol = url;
			this.uploadPic(this.file, 'protocol');
		},
		async idcardUpload1 (event, name) {
			this.file = event.target.files[0];
			if (Math.round(this.file.size/1024 * 100) / 100 > 300) {
				alert('上传的图片不能大于300kb');
				return;
			}
			let url = window.URL.createObjectURL(this.file);
			this.id1 = url;
			this.uploadPic(this.file, 'idcard1');
		},
		async idcardUpload2 (event) {
			this.file = event.target.files[0];
			if (Math.round(this.file.size/1024 * 100) / 100 > 300) {
				alert('上传的图片不能大于300kb');
				return;
			}
			let url = window.URL.createObjectURL(this.file);
			this.id2 = url;
			this.uploadPic(this.file, 'idcard2');
		},
		async licenseUpload (event) {
			this.file = event.target.files[0];
			if (Math.round(this.file.size/1024 * 100) / 100 > 300) {
				alert('上传的图片不能大于300kb');
				return;
			}
			let url = window.URL.createObjectURL(this.file);
			this.license = url;

			this.uploadPic(this.file, 'license');
		},
		async certificateUpload (event) {
			this.file = event.target.files[0];
			let url = window.URL.createObjectURL(this.file);
			this.certificate = url;

			this.uploadPic(this.file, 'certificate');
		},
		serviceBlur () {
			this.infos.serviceWay = this.serviceWay.split('，');
		},
		add () {
			this.infos.promotion.push({condition: '', denomination: ''});
		},
		async register () {
			let status = true;
			this.infos.address = this.area + '-' + this.address;
			
			let position = await this.initPosition();

			this.infos.position.lng = position.lng;
			this.infos.position.lat = position.lat;

			sessionStorage.getItem('parent') ? this.infos.parent = sessionStorage.getItem('parent') : null;

			this.infos.certificate.map( (item, index) => {
				if (item.src == 'https://xuhaichao-1253369066.cos.ap-chengdu.myqcloud.com/camera.png') {
					this.prompt(this.certificateTips[index], 'error').show();
					status = false;
					return;
				}
			})

			if (this.infos.name == '') {
				this.prompt('店铺名称未填写', 'error').show();
				status = false;
				return;
			}

			if (this.infos.name == '') {
				this.prompt('店铺名称未填写', 'error').show();
				status = false;
				return;
			}

			if (this.infos.cover == 'https://xuhaichao-1253369066.cos.ap-chengdu.myqcloud.com/camera.png') {
				this.prompt('商铺封面未上传成功, 请重新上传', 'error').show();
				status = false;
				return;
			}

			if (this.infos.contactNumber == '') {
				this.prompt('商铺联系电话未填写', 'error').show();
				status = false;
				return;
			}

			if (this.infos.serviceWay.length == 0) {
				this.prompt('请至少选择一个服务方式', 'error').show();
				status = false;
				return;
			}

			if (this.infos.businessHours.length == 0) {
				this.prompt('商铺营业时间未选择', 'error').show();
				status = false;
				return;
			}

			if (this.area.indexOf('选择') !== -1) {
				this.prompt('未选择店铺所在地区', 'error').show();
				status = false;
				return;
			}

			if (this.address == '') {
				this.prompt('详细地址未填写', 'error').show();
				status = false;
				return;
			}
		
			if (status) {
				const toast = Toast.loading({
					duration: 0,
					forbidClick: true,
					message: '请稍后...'
				})

				let res = await this.$api.sendData('https://m.yixiutech.com/shop', this.infos);
				
				if (res.code !== 200) {
					alert(res.errMsg);
					return;
				}
				toast.clear();
				this.$router.push('/wait');
			}
		},
		start () {
			this.startPicker.show()
		},
		finish () {
			this.endPicker.show()
		},
		async initPosition () {
			return new Promise( (resolve, reject) => {
				let map = new BMap.Map("allmap");
				let point = new BMap.Point(116.331398,39.897445);
				map.centerAndZoom(point,12);

				let _this = this;

				let myGeo = new BMap.Geocoder();

				myGeo.getPoint(this.infos.address, function(point){
					
					if (point) {
						map.centerAndZoom(point, 16);
						map.addOverlay(new BMap.Marker(point));

						resolve(point);
					}else{
						reject();
						alert("您选择地址没有解析到结果!");
					}
				});
			})
		}
	}
} 
</script>

<style scoped>
.container {
	width: 100%;
	height: 100%;
}

.info {
		width: 100%;
    position: absolute;
    left: 50%;
		background: #eee;
    transform: translate(-50%);
		text-align: center;
		overflow: hidden;
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

.service {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content:space-around;
}

.links {
	color: #ec3030;
	text-align: left;
	padding: 2%;
}

.info .info__logo {
	width: 200px;
	display: inline-block;
}

.info .info__section {
	font-size: 20px;
	text-align: left;
	color: #e0620d;
	padding: 2% 5%;
	border-left: 5px solid #e0620d;
}

.condition {
	display: flex;
	align-items: center;
	justify-content: space-around;
}

.link {
	margin-left: 20px;
	font-size: 16px;
	color: red;
}

.full-cut {
	width: 48%;
}

.van-area {
	width: 100%;
	position: fixed;
	bottom: 0;
	z-index: 21;
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

.info-item {
	padding: 10px 15px;
	display: flex;
	color: #000;
	align-items: center;
	justify-content: flex-start;
}

.info-item .info-item__content {
	margin-left: 50px;
}

.cube-btn {
	background: #4991e5;
	border-radius: 5px;
	margin: 10px 0;
	display: inline-block;
	width: 60%;
}


.van-field__control {
	background: transparent;
}

.info .head {
	padding: 10px 15px;
	text-align: left;
	color: #000;
}

.box {
  padding: 2% 7.5%;
  text-align: left;
  display: flex;
  align-items: center;
}

.box .area {
  font-size: 14px;
  margin-left: 14px;
}

.info .van-uploader {
	display: flex;
	justify-content: center;
}

.info .info__btn {
	width: 100%;
	margin-top: 30px;
	padding: 20px 0;
	color: #000;
	background: #e0620d;
	border-radius: 10px;
	border: 2px solid #000;
}

.info .van-field {
	background: transparent;
	color: #000;
	font-size: 1em;
}

.info .info__tip {
	font-size: 20px;
	margin-top: 30px;
}

.info__tip a {
	color: #000;
}

.info__tip .tip__pwd {
	float: left;
}

.info__tip .tip__register {
	float: right;
}

.register {
	background: #ec3030;
}

.svg-icon {
	position: absolute;
	left: 20px;
	top: 40px;
}
</style>