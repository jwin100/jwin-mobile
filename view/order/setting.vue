<template>
	<view class="main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<uni-nav-bar statusBar class="custom-nav" :fixed="true" :border="false" title="订单设置" left-icon="left"
			left-text="返回" @clickLeft="goBack()">
		</uni-nav-bar>
		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
	</view>
</template>

<script>
	import mixin from '../../common/mixin'
	export default {
		name: 'orderSetting',
		mixins: [mixin],
		data() {

		},
		mounted() {

		},
		methods: {

		}
	}
</script>

<style>
</style>