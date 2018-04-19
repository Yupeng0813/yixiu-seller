<template>
  <div class="order">
    <van-cell-swipe :right-width="65" :left-width="65" v-for="(item, index) in data" :key="index">	
			<van-cell-group>
				<van-cell :title="item.name" :value="item.price"  @click="toDetail(index)" />
			</van-cell-group>
			<span slot="right" @click="deletes(item)" class="delete-btn" >删除</span>
		</van-cell-swipe>
	</div>
</template>

<script>
import { CellSwipe, Cell, CellGroup, Dialog } from 'vant';
export default {
  props: {
    data: Array
  },
  data () {
    return {
      cover: '',
      activeId: ''
    }
  },
  async mounted () {
    // console.log(this.data);
  },
  methods: {
    async deletes (item) {
      this.activeId = item._id;
      Dialog.confirm({
				title: '是否确认删除该型号?',
				message: ''
			}).then(async () => {
				let removePhone  = await this.$api.sendData('https://m.yixiutech.com/sql/remove', {
          collection: 'PhoneModel',
          shop: item.shop,
					_id: this.activeId
        })
        this.$emit('deleteTarget', this.activeId);
			}).catch(() => {
				
			});
    },
    toDetail (index) {
      sessionStorage.setItem('serviceItem', JSON.stringify(this.data[ index ]));
      this.$router.push('/updateService');
    }
  },
  components: {
    [CellSwipe.name]: CellSwipe,
		[Cell.name]: Cell,
		[CellGroup.name]: CellGroup,
		[Dialog.name]: Dialog
  }
}
</script>

<style>
.delete-btn {
	display: block;
	width: 65px;
	height: 100%;
	background: #ef4136;
	line-height: 44px;
	color: #fff;
  text-align: center;
}

.price {
  color: red;
}
</style>
