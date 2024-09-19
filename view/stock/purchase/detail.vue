<template>
	<view class="main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar class="custom-nav" statusBar :fixed="true" :border="false" title="采购信息" left-icon="left"
			left-text="返回" @clickLeft="goBack(backRefresh)">
		</uni-nav-bar>
		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="tn-margin-top-xs">
			<scroll-view class="tn-store tn-bg-white tn-padding-left tn-padding-right" scroll-y
				:style="{height: scrollViewHeight + 'px'}">
				<tn-list-view :card="true" unlined="all">
					<tn-list-cell>
						<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
							<view>采购门店</view>
							<view class="tn-color-gray--dark">
								{{purchaseInfo.storeName}}({{purchaseInfo.storeNo}})
							</view>
						</view>
					</tn-list-cell>
					<tn-list-cell>
						<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
							<view>预计送达日期</view>
							<view class="tn-color-gray--dark">
								{{purchaseInfo.deliveryTime || '--'}}
							</view>
						</view>
					</tn-list-cell>
					<tn-list-cell>
						<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
							<view>门店状态</view>
							<view class="tn-color-gray--dark">
								{{purchaseInfo.statusName}}
							</view>
						</view>
					</tn-list-cell>
					<tn-list-cell>
						<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
							<view>备注</view>
							<view class="tn-color-gray--dark">
								{{purchaseInfo.remark}}
							</view>
						</view>
					</tn-list-cell>
				</tn-list-view>
				<view class="tn-margin-top-xs">
					<view class="tn-padding tn-flex tn-flex-col-center tn-flex-row-between tn-border-solid-bottom">
						<view class="justify-content-item tn-text-xl">
							商品信息
						</view>
					</view>
					<tn-list-view>
						<tn-list-cell class="specs-cell" v-for="(item, index) in purchaseInfo.skus" :key="index">
							<view class="tn-texteditSpec-ellipsis" style="font-size: 34rpx;">
								{{item.skuName}}
							</view>
							<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-top tn-color-gray">
								<view>采购单价：{{item.purchaseAmount}}</view>
								<view>采购数量：{{item.purchaseQuantity}}</view>
								<view>入库数量：{{item.replenishQuantity}}</view>
							</view>
						</tn-list-cell>
					</tn-list-view>
				</view>
			</scroll-view>
		</view>
		<view class="footerfixed tabbar" v-if="footerShow">
			<view class="tn-flex tn-flex-row-between tn-flex-col-center tn-margin-top tn-padding-left tn-padding-right">
				<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl"
					v-if="purchaseInfo.status===1 || purchaseInfo.status===2">
					<tn-button backgroundColor="tn-bg-blue" fontColor="tn-color-white" style="width: 100%;"
						shape="round" :blockRepeatClick="true" @click="purchaseCancel">取消</tn-button>
				</view>
				<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl"
					v-if="purchaseInfo.status===1 || purchaseInfo.status===2 || purchaseInfo.status===3">
					<tn-button backgroundColor="tn-bg-blue" fontColor="tn-color-white" style="width: 100%;"
						shape="round" :blockRepeatClick="true" @click="purchaseReplenish">入库</tn-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		CommonStatus
	} from '@/common/enums/commonStatus'
	import mixin from '@/common/mixin'
	import stockPurchase from '../../../api/stock/stockPurchase'
	import {
		formatDateTime
	} from '../../../common/datetimeFormat'

	export default {
		name: 'storeAdd',
		mixins: [mixin],
		data() {
			return {
				tips: {
					type: 'success',
					mask: false,
					message: '提示',
					duration: 2000
				},
				footerShow: false,
				backRefresh: false,
				customNavbarHeight: 0,
				scrollViewTop: 0,
				scrollViewHeight: 0,
				id: '',
				purchaseInfo: {},
				storeInfo: {},
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		mounted() {
			this.getPurchaseInfo()
			this.$nextTick(() => {
				this.getNotFooterViewInfo()
			})
		},
		methods: {
			async getScrollViewInfo() {
				const customNavbar = await mixin.methods.getRect(this, '.custom-nav')
				const footerFixed = await mixin.methods.getRect(this, '.footerfixed')
				const systemInfo = uni.getSystemInfoSync()
				this.customNavbarHeight = customNavbar.height
				this.scrollViewTop = systemInfo.statusBarHeight
				this.scrollViewHeight = systemInfo.windowHeight - customNavbar.height -
					footerFixed.height - uni.upx2px(20)
			},
			async getNotFooterViewInfo() {
				const customNavbar = await mixin.methods.getRect(this, '.custom-nav')
				const systemInfo = uni.getSystemInfoSync()
				this.customNavbarHeight = customNavbar.height
				this.scrollViewTop = systemInfo.statusBarHeight
				this.scrollViewHeight = systemInfo.windowHeight - customNavbar.height -
					uni.upx2px(20)
			},
			refresh() {
				this.backRefresh = true
				this.getPurchaseInfo()
			},
			getPurchaseInfo() {
				stockPurchase.purchaseOrderInfo(this.id).then(res => {
					this.purchaseInfo = res.data
					if (this.purchaseInfo.status === 1 ||
						this.purchaseInfo.status === 2 ||
						this.purchaseInfo.status === 3) {
						this.footerShow = true
						this.$nextTick(()=>{
							this.getScrollViewInfo()
						})
					}
				})
			},
			purchaseCancel() {
				stockPurchase.purchaseOrderClose(this.id).then(() => {
					this.$refs.tips.show({
						msg: '采购单已关闭',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					setTimeout(() => {
						mixin.methods.goBack(true)
					}, 1500)
				})
			},
			purchaseReplenish() {
				uni.navigateTo({
					url: `/view/stock/purchase/replenish?id=${this.id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>