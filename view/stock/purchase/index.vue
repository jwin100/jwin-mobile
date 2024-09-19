<template>
	<view class="template-classify main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<uni-nav-bar statusBar :border="false" :fixed="true" class="custom-nav" left-icon="left" leftText="返回"
			title="采购订单" @clickLeft="goBack()">
			<!-- <block slot="right">
				<view class="custom-nav__item" @click="tnAdd">
					<uni-icons class="input-uni-icon" type="plusempty" size="18" color="#999" />
				</view>
			</block> -->
		</uni-nav-bar>
		<view class="tn-market--wrap">
			<view class="tn-market__container">
				<scroll-view class="tn-goods__right-box tn-flex-1" :scroll-top="scrollViewTop" scroll-y
					scroll-with-animation :style="{height: scrollViewHeight + 'px'}" :refresher-enabled="true"
					refresher-background='tn-bg-gray--light' :refresher-triggered="scrollRefresher"
					:scroll-anchoring="true" @refresherrefresh="scrollPull" @scrolltolower="scrolltolower">
					<view class="tn-market__content tn-margin" v-if="purchaseList.length>0">
						<view v-for="(item, index) in purchaseList" :key="index" @click="tnDetail(item.id)">
							<view class="tn-margin-bottom-sm tn-padding tn-bg-white tn-radius tn-border-solid-bottom">
								<view
									class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center tn-padding-bottom tn-none-radius tn-border-solid-bottom">
									<view style="line-height: 40rpx;">
										{{item.purchaseNo}}
									</view>
									<view class="tn-text-sm">{{item.statusName}}</view>
								</view>
								<view class="tn-padding-top tn-padding-bottom">
									<view class="tn-flex tn-flex-flow-row tn-flex-col-bottom tn-margin-bottom-xs">
										<text>采购门店：{{item.purchaseStoreName}}</text>
									</view>
									<view class="tn-flex tn-flex-flow-row tn-flex-col-bottom tn-margin-bottom-xs">
										<text>采购日期：{{item.createTime}}</text>
									</view>
									<view class="tn-flex tn-flex-flow-row tn-flex-col-bottom tn-margin-bottom-xs">
										<text>操作人：{{item.operationName}}</text>
									</view>
								</view>
								<view
									class="tn-flex tn-flex-flow-row tn-flex-row-right tn-flex-col-bottom tn-padding-top tn-border-solid-top">
									<view>
										<text>共采购{{item.purchaseTotal}}种{{item.purchaseSkuTotal}}件商品</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="edit tnxuanfu" @tap="tnAdd()">
			<view
				class="icon12__item--icon tn-shadow-blur tn-flex tn-flex-row-center tn-flex-col-center tn-main-gradient-blue--light tn-color-blue--dark">
				<view class="tn-icon-add">
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import stockPurchase from '@/api/stock/stockPurchase'
	import mixin from '@/common/mixin'
	export default {
		name: 'storeIndex',
		mixins: [mixin],
		data() {
			return {
				searchParams: {
					searchKey: '',
					pageIndex: 1,
					pageSize: 20,
				},
				pageTotal: 1,
				purchaseList: [],
				customNavbarHeight: 0,
				scrollViewTop: 0,
				scrollViewHeight: 0,
				scrollRefresher: false
			}
		},
		mounted() {
			this.scrollPull()
			this.$nextTick(() => {
				this.getScrollViewInfo()
			})
		},
		methods: {
			// 获取scrollView的高度信息
			async getScrollViewInfo() {
				const customNavbar = await mixin.methods.getRect(this, '.custom-nav')
				const systemInfo = uni.getSystemInfoSync()
				this.customNavbarHeight = customNavbar.height
				this.scrollViewTop = systemInfo.statusBarHeight
				this.scrollViewHeight = systemInfo.windowHeight - customNavbar.height
			},
			refresh() {
				this.scrollPull()
			},
			scrolltolower() {
				this.searchParams.pageIndex += 1
				this.getPurchasePage()
			},
			scrollPull() {
				if (this.scrollRefresher) {
					return
				}
				this.searchParams.pageIndex = 1
				this.scrollRefresher = true
				setTimeout(() => {
					this.getPurchasePage()
				}, 300)
			},
			getPurchasePage() {
				stockPurchase.purchaseOrderPage(this.searchParams).then(res => {
					if (this.searchParams.pageIndex === 1) {
						this.purchaseList = []
						this.pageTotal = 1
					}
					if (res.data.rows > 0) {
						res.data.data.forEach(x => {
							this.purchaseList.push(x)
						})
						this.pageTotal = res.data.total
					}
				}).finally(() => {
					this.scrollRefresher = false
				})
			},
			tnDetail(id) {
				uni.navigateTo({
					url: `/view/stock/purchase/detail?id=${id}`
				})
			},
			tnAdd() {
				uni.navigateTo({
					url: '/view/stock/purchase/add'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tn-market {
		&--wrap {
			position: fixed;
			left: 0;
			right: 0;
			width: 100%;
			background-color: inherit;
		}
	}
</style>