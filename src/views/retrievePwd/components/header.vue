<template>
  <div class="login__header">
		<router-link to="/home">
			<sicon name="back" scale="3"></sicon>
		</router-link>
		<p class="header__title">忘记密码</p>
  </div>
</template>

<script>
export default {
	
}
</script>

<style scoped>
.login__header {
	padding: 8px;
	display: flex;
	align-items: center;
}

.header__title {
	color: #fff;
	font-size: 20px;
	margin-left: 20px;
	letter-spacing: 4px;
}

</style>