<template>
	<div class="phones">
		<item-header
			:name="name"
			v-on:backParent="back"
		/>
		<van-cell-swipe 
			:right-width="65" 
			:left-width="65" 
			v-for="(item, index) in data"
			:key="index"
			>
			<van-cell-group>
				<van-cell 
					:title="item.name" 
					:value="item.price"
					@click="toDetail(index)"
				/>
			</van-cell-group>
			<span class="delete" slot="right" @click="deletePhone(item._id)">删除</span>
		</van-cell-swipe>
	</div>
</template>

<script>
import { CellSwipe, Cell, CellGroup, Dialog } from 'vant';
import itemHeader from '../components/itemHeader'
export default {
	methods: {
		back () {
			this.$router.push('/sellerHome');
		},
		toDetail (index) {
			sessionStorage.setItem('detail', JSON.stringify(this.data[index]));
			this.$router.push('/updatePhone');
		},
		async deletePhone (id) {
			Dialog.confirm({
				title: '是否确认删除该精品手机?',
				message: ''
			}).then(async () => {
				let removePhone  = await this.$api.sendData('https://m.yixiutech.com/sql/remove', {
					collection: 'Goods',
					_id: id
				})
				
				if (removePhone.code == 200) {
					this.data.map( (item, index) => {
						if (item._id == id) {
							this.data.splice(index, 1);
							return;
						}
					})
					this.prompt(removePhone.data, 'correct').show();
				}
			}).catch(() => {
				
			});
			
		}
	},
	async mounted () {
		let shopHasPhones = await this.$api.sendData('https://m.yixiutech.com/sql/find/', {
			collection: 'Goods',
			findType: 'find',
			shop: JSON.parse(sessionStorage.getItem('shopData'))._id,
			limit: 3000
			// shop: '5ab93879d4e7f1497d58d94e'
		})

		this.data = shopHasPhones.data;

	},
	data () {
		return {
			data: [],
			name: '管理精品手机'
		}
	},
  components: {
		[CellSwipe.name]: CellSwipe,
		[CellGroup.name]: CellGroup,
		[Cell.name]: Cell,
		[Dialog.name]: Dialog,
		itemHeader
	}
}
</script>

<style scoped>
.phones {
	width: 100%;
	height: 100%;
}

.delete {
	background: #ef4136;
	width: 65px;
	height: 100%;
	line-height: 44px;
	text-align: center;
	color: #fff;
	display: block;
}
</style>
