<template>
	<view class="main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog type="info" title="登录提示" content="请先登录,才可进一步操作" :duration="2000" :before-close="true"
				@close="close()" @confirm="gotoLogin()"></uni-popup-dialog>
		</uni-popup>
		<!-- 顶部自定义导航 -->
		<uni-nav-bar :border="false" :fixed="true" class="custom-nav" statusBar leftWidth="0" rightWidth="0">
			<view class="custom-nav__item custom-nav__input">
				<uni-icons class="input-uni-icon" type="search" size="18" color="#999" />
				<input v-model="searchParams.searchKey" confirm-type="search" class="nav-bar-input" type="text"
					placeholder="订单号、名称搜索" @confirm="getOrderPage()" />
			</view>
			<!-- 			<block slot="right">
				<uni-icons class="input-uni-icon" type="gear" size="18" color="#999" @click="tnSetting" />
			</block> -->
		</uni-nav-bar>
		<view class="order--wrap">
			<!-- 顶部标签 -->
			<view class="order-status tn-bg-white tn-width-full tn-padding">
				<div class="tn-flex tn-flex-flow-row tn-flex-col-center tn-flex-row-between">
					<div class="tn-flex tn-flex-flow-row tn-flex-col-center tn-flex-row-center">
						<view class="order--date" :class="[selectDateType===1?'order--date_active':'']"
							@click="getToday">今日</view>
						<view class=" order--date" :class="[selectDateType===2?'order--date_active':'']"
							@click="getYesterday">昨日</view>
						<view class=" order--date" :class="[selectDateType===99?'order--date_active':'']"
							@click="orderRangeShow=true">
							自定义
							<tn-calendar v-model="orderRangeShow" mode="range" @change="getOrderRange"></tn-calendar>
						</view>
					</div>
					<!-- <div>
						<text class="tn-color-gray--disabled">|</text>
						<text class="tn-margin-left">筛选</text>
					</div> -->
				</div>
			</view>
			<view class="member--wrap">
				<view class="tn-classify__container tn-margin-top-xs tn-margin-bottom-xs tn-bg-white">
					<scroll-view class="tn-goods__right-box tn-flex-1" :scroll-top="scrollViewTop" scroll-y
						scroll-with-animation :style="{height: scrollViewHeight + 'px'}" :refresher-enabled="true"
						refresher-background='tn-bg-gray--light' :refresher-triggered="scrollRefresher"
						:scroll-anchoring="true" @refresherrefresh="scrollPull" @scrolltolower="scrolltolower">
						<view v-if="orderList.length>0">
							<view v-for="(item,index) in orderList" :key="index" class="order__item"
								@click="tnDetail(item)">
								<view
									class="order__item__head tn-flex tn-flex-flow-row tn-flex-col-bottom tn-flex-row-between">
									<view class="tn-text-sm">
										<text
											class="tn-text-md tn-text-bold">{{item.member? item.member.name : '散客'}}</text>
										<text class="tn-margin-left-sm">{{item.createTime}}</text>
									</view>
									<view class="">
										<tn-tag backgroundColor="tn-bg-blue" fontColor="tn-color-white" size="sm"
											shape="radius">
											{{item.statusName}}
										</tn-tag>
										<tn-tag v-if="item.refundMark" backgroundColor="tn-bg-orange"
											fontColor="tn-color-orange" size="sm" shape="radius" :plain="true"
											margin="0 0 0 12rpx">
											{{item.refundMarkName}}
										</tn-tag>
									</view>
								</view>
								<view
									class="order__item__content tn-flex tn-flex-flow-row tn-flex-nowrap tn-flex-col-center tn-flex-row-between">
									<view class="tn-flex tn-flex-flow-row">
										<view class="order__item__content__image">
											<image src="https://resource.tuniaokj.com/images/shop/prototype2.jpg"
												mode="scaleToFill">
											</image>
										</view>
										<view
											class="tn-flex tn-flex-flow-column tn-flex-row-around tn-flex-col-center tn-text-md">
											{{item.subject}}
										</view>
									</view>
									<view style="min-width: 100rpx;"
										class="tn-flex tn-flex-flow-column tn-flex-col-bottom tn-flex-row-center">
										<view v-if="item.type===0">
											<text class="tn-text-xs">￥</text>
											<text class="tn-text-md">{{item.realityAmount}}</text>
										</view>
										<view v-else>
											<text class="tn-text-xs">计次</text>
											<text class="tn-text-md">{{item.timeCardTotal}}</text>
										</view>
										<view class="tn-text-sm tn-color-grey">
											<text>共{{item.skuTotal}}件</text>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view v-else-if="!scrollRefresher" class="tn-padding-top-xl">
							<tn-empty mode="list" text="无订单信息"></tn-empty>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import cashierOrder from '@/api/cashier/cashierOrder'
	import {
		formatDate
	} from '@/common/datetimeFormat'
	import mixin from '@/common/mixin'

	export default {
		name: 'TemplateOrder',
		mixins: [mixin],
		data() {
			return {
				searchParams: {
					searchKey: '',
					startDate: '',
					endDate: '',
					pageIndex: 1,
					pageSize: 20,
				},
				pageTotal: 1,
				selectDateType: 1,
				orderRangeShow: false,
				orderList: [],
				scrollViewTop: 0,
				scrollViewHeight: 0,
				scrollRefresher: false
			}
		},
		onShow() {
			const options = {
				animation: true
			}
			uni.showTabBar(options)
		},
		mounted() {
			if (this.isLogin) {
				this.getToday()
			}
			this.$nextTick(() => {
				this.getScrollViewInfo()
			})
		},
		methods: {
			async getScrollViewInfo() {
				const customNav = await mixin.methods.getRect(this, '.custom-nav')
				const orderStatus = await mixin.methods.getRect(this, '.order-status')
				const systemInfo = uni.getSystemInfoSync()
				this.scrollViewHeight = systemInfo.windowHeight - customNav.height - orderStatus.height -
					uni.upx2px(20)
			},
			getToday() {
				if (!this.isLogin) {
					this.$refs.popup.open();
					return;
				}
				this.selectDateType = 1
				this.searchParams.startDate = formatDate(Date.now())
				this.searchParams.endDate = formatDate(Date.now())
				this.scrollPull()
			},
			getYesterday() {
				if (!this.isLogin) {
					this.$refs.popup.open();
					return;
				}
				this.selectDateType = 2
				this.searchParams.startDate = formatDate(Date.now() - 1 * 24 * 3600000)
				this.searchParams.endDate = formatDate(Date.now() - 1 * 24 * 3600000)
				this.scrollPull()
			},
			getOrderRange(item) {
				if (!this.isLogin) {
					this.$refs.popup.open();
					return;
				}
				this.selectDateType = 99
				this.searchParams.startDate = item.startDate
				this.searchParams.endDate = item.endDate
				this.scrollPull()
			},
			refresh() {
				if (!this.searchParams.startDate || !this.searchParams.endDate) {
					this.getToday()
				} else {
					this.scrollPull()
				}
			},
			scrolltolower() {
				this.searchParams.pageIndex += 1
				this.getOrderPage()
			},
			scrollPull() {
				if (this.scrollRefresher) {
					return
				}
				this.searchParams.pageIndex = 1
				this.orderList = []
				this.pageTotal = 1
				this.scrollRefresher = true
				setTimeout(() => {
					this.getOrderPage()
				}, 300)
			},
			getOrderPage() {
				if (!this.isLogin) {
					this.$refs.popup.open();
					return;
				}
				cashierOrder.cashierOrderPage(this.searchParams).then(res => {
					if (this.searchParams.pageIndex === 1) {
						this.orderList = []
						this.pageTotal = 1
					}
					if (res.data.rows > 0) {
						res.data.data.forEach(x => {
							this.orderList.push(x)
						})
						this.pageTotal = res.data.total
					}
				}).finally(() => {
					this.scrollRefresher = false
				})
			},
			tnDetail(item) {
				uni.navigateTo({
					url: `/view/order/detail?id=${item.id}`
				})
			},
			close() {
				this.$refs.popup.close()
			},
			gotoLogin() {
				this.$refs.popup.close();
				mixin.methods.gotoLogin();
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* #ifdef MP-WEIXIN || MP-QQ */
	.custom-nav {
		/deep/ .uni-navbar__header {
			padding: 0 120px 0 10px !important;
		}
	}

	/* #endif */
	.order {
		&--wrap {
			position: fixed;
			left: 0;
			right: 0;
			width: 100%;
			background-color: inherit;
			z-index: 1;
		}

		&--date {
			color: #838383;
			border: 1px solid #838383;
			border-radius: 10px;
			padding: 0 14px;
			margin: 0 4rpx;
		}

		&--date_active {
			color: #0d6efd;
			border: 1px solid #0d6efd;
		}

		&__item:last-child {
			padding-bottom: 60rpx;
			border-bottom: none;
		}

		/* 订单内容 start */
		&__item {
			margin: 20rpx;
			padding: 36rpx 26rpx;
			background-color: #FFFFFF;
			border-bottom: 1px solid #f0f0f0;

			/* 内容 start */
			&__content {
				margin-top: 20rpx;

				&__image {
					margin-right: 20rpx;

					image {
						width: 80rpx;
						height: 80rpx;
						border-radius: 10rpx;
					}
				}
			}

			/* 内容 end */
		}

		/* 订单内容 end */
	}
</style>