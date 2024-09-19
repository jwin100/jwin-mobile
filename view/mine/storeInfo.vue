<template>
	<view class="main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar class="custom-nav" statusBar :fixed="true" :border="false" title="门店信息" left-icon="left"
			left-text="返回" @clickLeft="goBack()">
		</uni-nav-bar>
		<view class="tn-margin-top-xs">
			<scroll-view class="tn-store tn-bg-white" scroll-y :style="{height: scrollViewHeight + 'px'}">
				<tn-list-view :card="true" unlined="all">
					<tn-list-cell>
						<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
							<view>门店名称</view>
							<view class="tn-color-gray--dark">
								{{storeInfo.storeName}}({{storeInfo.main?'主店：':''}}{{storeInfo.storeNo}})
							</view>
						</view>
					</tn-list-cell>
					<tn-list-cell>
						<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
							<view>门店电话</view>
							<view class="tn-color-gray--dark">
								{{storeInfo.storePhone || '--'}}
							</view>
						</view>
					</tn-list-cell>
					<tn-list-cell>
						<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
							<view>门店状态</view>
							<view class="tn-color-gray--dark">
								{{storeInfo.statusName}}
							</view>
						</view>
					</tn-list-cell>
					<tn-list-cell>
						<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
							<view>负责人</view>
							<view class="tn-color-gray--dark">
								{{storeInfo.accountName}}
							</view>
						</view>
					</tn-list-cell>
					<tn-list-cell>
						<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
							<view>负责人电话</view>
							<view class="tn-color-gray--dark">
								{{storeInfo.accountPhone}}
							</view>
						</view>
					</tn-list-cell>
					<tn-list-cell>
						<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-top">
							<view>门店地址</view>
							<view class="tn-color-gray--dark">
								<view>
									<text>{{storeInfo.provinceName}}</text>
									<text>{{storeInfo.cityName}}</text>
									<text>{{storeInfo.areaName}}</text>
								</view>
								<view>
									<text>{{storeInfo.address}}</text>
								</view>
							</view>
						</view>
					</tn-list-cell>
					<tn-list-cell>
						<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
							<view>有效期</view>
							<view class="tn-color-gray--dark">
								{{storeInfo.main?'永久有效':storeInfo.endDate}}
							</view>
						</view>
					</tn-list-cell>
					<tn-list-cell>
						<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
							<view>创建日期</view>
							<view class="tn-color-gray--dark">
								{{storeInfo.createTime}}
							</view>
						</view>
					</tn-list-cell>
				</tn-list-view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import mixin from '../../common/mixin'

	export default {
		name: 'storeDetail',
		mixins: [mixin],
		data() {
			return {
				customNavbarHeight: 0,
				scrollViewTop: 0,
				scrollViewHeight: 0,
				storeInfo: {}
			}
		},
		onLoad(options) {
			this.id = options.id || ''
		},
		mounted() {
			this.getStoreInfo()
			this.$nextTick(() => {
				this.getScrollViewInfo()
			})
		},
		methods: {
			async getScrollViewInfo() {
				const customNavbar = await mixin.methods.getRect(this, '.custom-nav')
				const systemInfo = uni.getSystemInfoSync()
				this.customNavbarHeight = customNavbar.height
				this.scrollViewTop = systemInfo.statusBarHeight
				this.scrollViewHeight = systemInfo.windowHeight - customNavbar.height
			},
			getStoreInfo() {
				this.storeInfo = this.vuexMerchantStoreInfo
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>