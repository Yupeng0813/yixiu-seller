<template>
  <div class="order-item" @click="detail">
    <img :src="data.user.wx.headimgurl" class="order-item__img" alt="" />
    <div class="order-item__msg">
      <p>昵称 : {{ data.user.name }}</p>
      <p v-show="data.service.length !== 0">维修名称 : {{ data.service.length !== 0 ? data.service[0].name : '' }}</p>
      <p v-show="data.goods.length !== 0">商品名称 : {{ data.goods.length !== 0 ? data.goods[0].name : '' }}</p>
      <p>创建时间 : 
        {{ new Date(data.createdAt * 1000).getFullYear() }}-
				{{ new Date(data.createdAt * 1000).getMonth() + 1 }}-
				{{ new Date(data.createdAt * 1000).getDate() }}  
				{{ new Date(data.createdAt * 1000).getHours() }} : 
				{{ new Date(data.createdAt * 1000).getMinutes() }}
      </p>
      <p v-show="data.state == 13">完成时间 : 
        {{ new Date(data.updatedAt * 1000).getFullYear() }}-
				{{ new Date(data.updatedAt * 1000).getMonth() + 1 }}-
				{{ new Date(data.updatedAt * 1000).getDate() }}  
				{{ new Date(data.updatedAt * 1000).getHours() }} : 
				{{ new Date(data.updatedAt * 1000).getMinutes() }}
      </p>
    </div>
	</div>
</template>

<script>
export default {
  props:{
    data: Object
  },
  mounted () {
    console.log(this.data);
  },
  methods: {
    detail () {
      sessionStorage.setItem('detail', JSON.stringify(this.data));
      this.$router.push('/orderDetail');
    }
  }
}
</script>

<style>
.order-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 2%;
  border-bottom: 1px solid gray;
}

.order-item .order-item__img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 10px;
}

.order-item__msg {
  font-size: 14px;
}
</style>
