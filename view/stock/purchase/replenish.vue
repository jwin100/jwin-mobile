<template>
	<view class="main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar class="custom-nav" statusBar :fixed="true" :border="false" title="采购入库" left-icon="left"
			left-text="返回" @clickLeft="goBack()">
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
						<tn-list-cell class="specs-cell" v-for="(item, index) in purchaseInfo.skus" :key="index"
							@click="skuClick(item)">
							<view class="tn-texteditSpec-ellipsis" style="font-size: 34rpx;">
								{{item.skuName}}
							</view>
							<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-top tn-color-gray">
								<view>采购单价：{{item.purchaseAmount}}</view>
								<view>采购数量：{{item.purchaseQuantity}}</view>
								<view>
									已入库数量：{{item.replenishQuantity}}
									<text class="tn-color-green">(+{{item.quantity || 0}})</text>
								</view>
							</view>
						</tn-list-cell>
					</tn-list-view>
				</view>
			</scroll-view>
		</view>
		<view class="footerfixed tabbar">
			<view class="tn-flex tn-flex-row-between tn-flex-col-center tn-margin-top tn-padding-left tn-padding-right">
				<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
					<tn-button backgroundColor="tn-bg-blue" fontColor="tn-color-white" style="width: 100%;"
						shape="round" :blockRepeatClick="true" @click="purchaseReplenish">入库</tn-button>
				</view>
			</view>
		</view>
		<tn-popup v-model="quantityPopupShow" mode="bottom" :safeAreaInsetBottom="true" :borderRadius="5"
			:closeBtn="true" closeBtnPosition="top-left" :negativeTop="60" :marginTop="90" @open="quantityPopupOpen"
			@close="quantityPopupClose">
			<view
				class="tn-flex tn-flex-col-center tn-flex-row-center tn-text-bold tn-text-xl tn-border-solid-bottom tn-width-full"
				style="height: 45px;">
				<text>输入入库数量</text>
			</view>
			<view style="padding: 15px">
				<tn-form :model="selectSku" ref="selectSkuRef" :labelWidth="150" :errorType="['message']">
					<tn-form-item label="入库数量: " prop="quantity">
						<tn-input type="number" v-model="selectSku.quantity" placeholder="输入入库数量"></tn-input>
					</tn-form-item>
				</tn-form>
			</view>
		</tn-popup>
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
				customNavbarHeight: 0,
				scrollViewTop: 0,
				scrollViewHeight: 0,
				id: '',
				purchaseInfo: {},
				storeInfo: {},
				quantityPopupShow: false,
				selectSku: {}
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		mounted() {
			this.getPurchaseInfo()
			this.$nextTick(() => {
				this.getScrollViewInfo()
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
			getPurchaseInfo() {
				stockPurchase.purchaseOrderInfo(this.id).then(res => {
					this.purchaseInfo = res.data
				})
			},
			refresh() {
				const skus = uni.getStorageSync('selectSkus')
				this.$set(this.purchaseInfo, 'skus', JSON.parse(skus))
				uni.removeStorageSync('selectSkus')
			},
			skuClick(item) {
				this.selectSku = item
				this.quantityPopupShow = true
			},
			quantityPopupOpen() {

			},
			quantityPopupClose() {
				const findIndex = this.purchaseInfo.skus.findIndex(x => x.id === this.selectSku.id)
				if (findIndex >= 0) {
					this.$set(this.purchaseInfo.skus[findIndex], 'quantity', this.selectSku.quantity)
				}
			},
			purchaseReplenish() {
				let bool = false
				this.purchaseInfo.skus.forEach(x => {
					if (x.quantity > x.purchaseQuantity - x.replenishQuantity) {
						bool = true
					}
				})
				if (bool) {
					this.$refs.tips.show({
						msg: '入库数量不能大于剩余采购数量',
						backgroundColor: '#FFA726',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					return
				}

				const params = this.purchaseInfo.skus
					.filter(x => x.quantity > 0)
					.map(x => {
						return {
							skuId: x.skuId,
							replenishQuantity: x.quantity
						}
					})

				stockPurchase.purchaseOrderReplenish(this.id, params).then(res => {
					this.$refs.tips.show({
						msg: '入库成功',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					setTimeout(() => {
						mixin.methods.goBack(true)
					}, 1500)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>