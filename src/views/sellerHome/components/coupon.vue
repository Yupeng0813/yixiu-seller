<template>
  <div class="couponsTag-container">
		<div class="couponsTag-left">
			<div class="couponsTag-lines"></div>
			<div class="couponsTag-gradient">
				<h2>¥ {{ denomination }}元</h2>
				<!-- <h2>{{ coupons.disount }} 折</h2> -->
				<!-- <p>无门槛使用</p> -->
				<p>满{{ condition }}元可使用</p>
			</div>
		</div>
		<div class="couponsTag-right">
			<h2>优惠券A</h2>
		</div>
	</div>
</template>

<script>
export default {
  props: {
		condition: Number,
		denomination: Number
	}
}
</script>

<style scoped>
.couponsTag-container{
	display: flex;
	height: 100px;
	margin: 0 15px 10px;
	color: #333;
}
.couponsTag-left{
	display: -webkit-box;
	display: -webkit-flex;
	display: flex;
	height: 100%;
	line-height: 1;
	min-width: 126px;
}
.couponsTag-right{
	height: 100%;
	display: flex;
	padding: 0 15px;
	overflow: hidden;
	position: relative;
	background-color: #fff;
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	flex-direction: column;
	-webkit-box-pack: center;
	justify-content: center;
	border-radius: 0 4px 4px 0;
}
.couponsTag-lines{
	height: 100%;
	min-width: 18px;
	background: url(https://paraslee-img-bucket-1253369066.cos.ap-chengdu.myqcloud.com/couponsConor.png) no-repeat;
	background-size: 18px 100px;
}
.couponsTag-lines-no{
	height: 100%;
	min-width: 18px;
	background: url(https://paraslee-img-bucket-1253369066.cos.ap-chengdu.myqcloud.com/no-couponsConor.png) no-repeat;
	background-size: 18px 100px;
}
.couponsTag-gradient{
	-webkit-box-flex: 1;
	-webkit-flex: 1;
					flex: 1;
	color: #fff;
	display: -webkit-box;
	display: -webkit-flex;
	display: flex;
	margin-left: -1px; /* hack for flex space */
	text-align: center;
	padding-right: 16px;
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	-webkit-flex-direction: column;
					flex-direction: column;
	-webkit-box-pack: center;
	-webkit-justify-content: center;
					justify-content: center;
	background-image: -webkit-linear-gradient(45deg, #ff6868, #ff8c8c);
	background-image: linear-gradient(45deg, #ff6868, #ff8c8c);
}
.gradient-no{
	background-image: -webkit-linear-gradient(45deg, #a4a9b2, #b7bcc3);
	background-image: linear-gradient(45deg, #a4a9b2, #b7bcc3);
}
.couponsTag-gradient h2{
	font-size: 22px;
	font-weight: normal;
	margin: 0 0 10px;
}
.couponsTag-gradient p{
	margin: 0;
	font-size: 4vw;
	font-weight: 300;
	max-width: 90px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.couponsTag-right{
	-webkit-box-flex: 1;
	-webkit-flex: 1;
	flex: 1;
	height: 100%;
	display: -webkit-box;
	display: -webkit-flex;
	display: flex;
	padding: 0 15px;
	overflow: hidden;
	position: relative;
	background-color: #fff;
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	-webkit-flex-direction: column;
	flex-direction: column;
	-webkit-box-pack: center;
	-webkit-justify-content: center;
	justify-content: center;
	border-radius: 0 4px 4px 0;
}
.couponsTag-right h2{
	line-height: 1.4;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	margin: 0;
	opacity: .8;
	font-size: 16px;
	font-weight: normal;
}
.couponsTag-right span,
.couponsTag-right p
{
	line-height: 1.4;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	color: #999;
	font-size: 12px;
	margin: 5px 0 0;
}
</style>
