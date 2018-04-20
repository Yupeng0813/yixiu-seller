<template>
  <div class="quality">
		<div class="header">
			<div class="back" @click="back"></div>
			<sicon name="left" scale="3"></sicon>
			<p class="header__title">订单详情</p>
		</div>
		<div class="shadow"></div>
		<div class="content">
			<h1 class="title">订单信息</h1>
			<!-- <p class="num">
				<span>翼修维修第xxxxxxx份报告</span>
				<span>No.956541235787</span>
			</p> -->
			<p class="content__desc"><span>手机名称 : </span>{{ details.phoneModel.name }} </p>
			<p class="content__desc" v-for="(item, index) in details.service" :key="index">
				<span>维修问题{{ index+1 }} : </span>
				{{ item.name }} 
			</p>
			<!-- <img :src="serviceIcon" class="service-icon" alt=""> -->
			<p class="content__desc">
				<span>预约时间 : </span>
				{{ new Date(details.appointment).getFullYear() }} - 
				{{ new Date(details.appointment).getMonth() }} - 
				{{ new Date(details.appointment).getDate() }}  
				{{ new Date(details.appointment).getHours() }} : 
				{{ new Date(details.appointment).getMinutes() }}
			</p>
			<p class="content__desc"><span>颜色 : </span>{{ details.phoneModel.color[0] }} </p>
			<p class="content__desc"><span>用户名 : </span>{{ details.user.name }} </p>
			<p class="content__desc"><span>买家电话 : </span>{{ details.phone }} </p>
			<p class="content__desc"><span>服务方式 : </span>{{ details.serviceWay }} </p>
			<p class="content__desc" v-show="details.serviceWay == '快递维修'"><span>用户地址 : </span>{{ details.address }} </p>
			<p class="content__desc" v-show="details.serviceWay == '快递维修'"><span>快递公司 : </span>{{ details.trackingCom }} </p>
			<p class="content__desc" v-show="details.serviceWay == '快递维修'"><span>快递单号 : </span>{{ details.trackingNumber }} </p>
			<p class="content__desc"><span>备注 : </span>{{ details.remark }} </p>
			<p class="content__desc"><span>成交额 : </span>{{ details.payment / 100 * 0.8 }} </p>
		</div>

		<div class="content" v-show="details.state == 12">			
			<h1 class="title">质检报告</h1>
			
			<van-field
				v-model="info.name"
				label="手机"
				placeholder="请输入手机名称"
			/>

			<van-field
				v-model="info.color"
				label="颜色"
				placeholder="请输入手机颜色"
			/>

			<div class="info">
				<p>容量</p>	
				<cube-select
					v-model="info.storage"
					:options="storages" 
				/>
			</div>

			<van-field
				v-model="info.IMei"
				label="IM ei"
				placeholder="请输入IMei"
			/>

			<div class="box">
				<p>网络制式</p>

				<div class="service">
					<selects v-for="(item, index) in networks"
						:type="networksType"
						:key="index"
						@sendMsg="sendMsg"
						@remove="remove"
						:data="item"
						:manufacturer="item._id"
					/>
				</div>
			</div>

		</div>
		
		<div class="content" v-show="details.state == 13">			
			<h1 class="title">质检报告</h1>
			
			<van-field
				v-model="info.name"
				label="手机"
				disabled
			/>

			<van-field
				v-model="info.color"
				label="颜色"
				disabled
			/>

			<van-field
				v-model="info.storage"
				label="容量"
				disabled
			/>

			<van-field
				v-model="info.IMei"
				label="IM ei"
				disabled
			/>

			<van-field
				v-model="currentNetwork"
				label="网络制式"
				disabled
			/>

		</div>

		<div class="content" v-show="details.state == 12">
			<van-field
				v-model="info.conclusion"
				label="总体质检结论"
				type="textarea"
				placeholder="请输入总体质检结论"
			/>

			<van-field
				v-model="info.supplement"
				label="工程师补充"
				type="textarea"
				placeholder="请输入工程师补充"
			/>
		</div>

		<div class="content" v-show="details.state == 13">
			<van-field
				v-model="info.conclusion"
				label="总体质检结论"
				type="textarea"
				disabled
			/>

			<van-field
				v-model="info.supplement"
				label="工程师补充"
				type="textarea"
				disabled
			/>
		</div>

		<div class="content" v-show="details.serviceWay == '快递维修' && details.state == 12">
			<div class="info">
				<p>快递公司</p>	
				<cube-select
					v-model="info.trackingCom"
					:options="trackingComSec"
				/>
			</div>

			<van-field
				v-model="info.trackingNumber"
				label="快递单号"
			/>
		</div>

		<div class="content" v-show="details.serviceWay == '快递维修' && details.state == 13">
			<van-field
				v-model="info.trackingCom"
				label="快递公司"
			/>

			<van-field
				v-model="info.trackingNumber"
				label="快递单号"
			/>

			<van-button size="large" @click="check">查看快递记录</van-button>

			<div class="logistics">
				<div :class="index == 0 ? 'item active' : 'item'" v-for="(item, index) in logistics" :key="index">
					<div class="time">
						<h1>{{ item ? item.datetime.substring(5, 10) : '' }}</h1>
						<p>{{ item ? item.datetime.substring(11, 16) : '' }}</p>
					</div>
					<div class="desc">
						{{ item ? item.remark : '' }}
					</div>
				</div>
			</div>
		</div>

		<div v-if="details.state == 11">
			<van-button size="large" class="footer" @click="takeOrder">接单</van-button>
		</div>
		<div v-else-if="details.state == 12">
			<van-button size="large" class="footer" @click="finish">完成</van-button>
		</div>
	</div>
</template>

<script>
import itemHeader from '../components/itemHeader'
import service from '@/assets/service.png'
import selects from '../components/select'
import { Field, Button } from 'vant'
export default {
	props: {
		data: Object
	},
	components: {
		itemHeader,
		[Button.name]: Button,
		[Field.name]: Field,
		selects
	},
	data () {
		return {
			details: {},
			infoName: '订单详情',
			networksType: '网络样式',
			networks: ['联通4G', '移动4G', '电信4G'],
			storages: ['16G', '32G', '64G', '128G', '256G'],
			trackingComSec: [],
			serviceIcon: service,
			currentNetwork: '',
			logistics: [],
			info: {
				name: '',
				storage: '',
				color: '',
				IMei: '',
				network: [],
				conclusion: '',
				supplement: ''
			}
		}
	},
	async mounted () {
		window.status = false;
		this.details = JSON.parse(sessionStorage.getItem('detail'));
		console.log(this.details);
		if (this.details.info) {
			this.info = this.details.info;
			this.currentNetwork  = this.details.info.network.join(',');
		}
		let res = await this.$api.getData('https://m.yixiutech.com/tracking/com');
		res.data.map(item => {	
			this.trackingComSec.push({ text: item.com, value: item.no });
			item.no == this.details.trackingCom ? this.details.trackingCom = item.com : null;
		})

		this.no = this.info.trackingCom;

		if (this.details.state == 13) {
			res.data.map(item => {
				item.no == this.info.trackingCom ? this.info.trackingCom = item.com : null;
			})
		}
	},
  methods: {
		async check () {
			let record = await this.$api.sendData('https://m.yixiutech.com/tracking', {
				// com: this.no,
				// no: this.info.trackingNumber
				com: 'yd',
				no: '3840140366095'
			})

			if (record.code == 200) {
				this.logistics = record.data.result.list;
			} else {
				alert(record.errMsg);
			}

		},
		sendMsg (data) {
			this.info.network.push(data);
		},
		remove (data) {
			this.info.network.map( (item, index) => {
				item == data ? this.info.network.splice(index, 1) : null;
			})
		},
		back () {
			this.$router.go(-1);
		},
		async takeOrder () {
			let data = { _id: this.details._id, state: 12 }
			const toast = this.$createToast({
				txt: '加载中...'
			})
			toast.show();
			let res = await this.$api.sendData('https://m.yixiutech.com/order/update', data);
			toast.hide();
			if (res.code == 200) {
				this.prompt('接单成功', 'correct').show();
				this.$router.go(-1)
			}
		},
		async finish () {
			for (var key in this.info) {
				if (this.info[ key ] == '' || this.info[key] == []) {
					this.prompt('信息未填写完', 'error').show();
					return;
				}
			}
			let data = { _id: this.details._id, state: 13, info: this.info}
			const toast = this.$createToast({
				txt: '加载中...'
			})
			toast.show();
			// let res = await this.$api.sendData('https://m.yixiutech.com/order/update', data);
			let res = await this.$api.sendData('https://m.yixiutech.com/sql/update', {
				collection: 'Order',
				find: {
					_id: this.details._id
				},
				update: data
			});
			let updateMoney = await this.$api.sendData('https://m.yixiutech.com/sql/update', {
				collection: 'User',
				find: {
					_id: JSON.parse(sessionStorage.getItem('user'))._id
				},
				// 把订单的80%更新到用户的钱包中
				update: {
					money: JSON.parse(sessionStorage.getItem('user')).money + this.details.price * 0.8
				}
			})
			
			let newUserInfo = await this.$api.getData(`https://m.yixiutech.com/user/openid/${JSON.parse(sessionStorage.getItem('user')).wx.openid}`)

			sessionStorage.setItem('user', JSON.stringify(newUserInfo.data));
			
			toast.hide();
			if (res.code == 200) {
				this.prompt('完成订单', 'correct').show();
				this.$router.go(-1)
			}
		}
	}
}
</script>

<style scoped>

.header {
	padding: 8px;
	display: flex;
	align-items: center;
	background: #4991e5;
}

.service-icon {
	width: 40%;
	position: absolute;
	right: 0;
	top: 84px;
}

.active {
	color: #d98201;
}

.service {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content:flex-start;
}

.header__title {
	color: #fff;
	font-size: 20px;
	margin-left: 20px;
	letter-spacing: 4px;
}

.back {
	width: 40px;
	height: 40px;
	position: absolute;
	left: 0;
	top: 0;
	z-index: 8;
}

.cube-select {
	width: 60%;
	margin-left: 20%;
}

.quality {
	width: 100%;
	height: 1300px;
	position: relative;
	background: #eee;
}

.shadow {
	width: 100%;
	height: 150px;
	position: absolute;
	left: 0;
	top: 48px;
	background: -webkit-linear-gradient(-90deg,rgba(2,181,157,.85) 2%,rgba(22,146,183,.85) 100%);
	z-index: 0;
}

.content {
	width: 82%;
	position: relative;
	margin: 20px auto 10px auto;
	padding: 4%;
	background: #fff;
	z-index: 2;
	border-radius: 5px;
}

.footer {
	color: #fff;
	background: red;
}

.spec {
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.spec .desc {
	margin-left: 5%;
}

.content .num {
	color: gray;
	font-size: 12px;
	display: flex;
	justify-content: space-between;
}

.content .content__title {
	font-size: 26px;
}



.content .content__desc {
	font-size: 14px;
	padding: 5px 0;
}

.content__desc span {
	color: gray;
}

.desc__title {
	font-size: 20px;
	color: rgba(2,181,157,.85);
}

.desc__content {
	font-size: 14px;
	color: gray;
}

.expert {
	display: flex;
	justify-content: flex-start;
	font-size: 12px;
}

.expert__info {
	margin-left: 10px;
}

.info {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	font-size: 12px;
	padding: 4%;
}

.title {
	text-align: center;
	padding: 6px 0;
}

.expert__info p {
	padding: 2px 0;
}

.info__academic {
	margin-left: 20px;
}

.info__address {
	color: #fff;
	background: rgba(2,181,157,.85);
	padding: 4px;
}

.content__sum .sum__title {
	font-size: 16px;
	font-weight: bold;
}

.item {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	margin: 10px 0;
}

.item .time {
	width: 20%;
}

.time h1 {
	font-size: 20px;
}

.content__sum .sum__content {
	font-size: 14px;
}

.quit {
	position: absolute;
	left: 50%;
	transform: translate(-50%);
}
</style>
