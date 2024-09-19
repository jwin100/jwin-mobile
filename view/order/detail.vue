<template>
	<view class="main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar statusBar class="custom-nav" :fixed="true" :border="false" title="订单详情" left-icon="left"
			left-text="返回" @clickLeft="goBack(backRefresh)">
		</uni-nav-bar>
		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="tn-margin-top-xs">
			<scroll-view class="tn-order" scroll-y :style="{height: scrollViewHeight + 'px'}">
				<view class="tn-bg-white">
					<view v-for="(item,index) in orderInfo.skus" :key="index"
						class="tn-order__item tn-padding tn-border-solid-bottom">
						<view class="tn-flex tn-flex-flow-row tn-flex-nowrap tn-flex-col-center tn-flex-row-between">
							<view class="tn-flex tn-flex-flow-row tn-flex-row-center">
								<view
									class="image-article tn-flex tn-flex-flow-row tn-flex-col-center tn-flex-row-center tn-margin-right-sm">
									<image v-if="item.picture" :src="item.picture" mode="aspectFill"
										class="image-pic" />
									<image v-else src="@/static/img/goods/default-goods-manage.png"
										class="default-image-pic" />
								</view>
								<view class="tn-flex tn-flex-flow-column tn-flex-row-between">
									<view>
										{{item.skuName}}
									</view>
									<view class="tn-margin-top-xs">
										<text>x{{item.saleQuantity}}</text>
										<text v-if="item.refundQuantity"
											class="tn-color-red tn-margin-left-sm tn-text-sm">
											已退：￥{{item.refundQuantity}}
										</text>
									</view>
								</view>
							</view>
							<view class="tn-flex tn-flex-flow-column tn-flex-col-center tn-flex-row-center">
								<view v-if="orderInfo.type===0">
									<view>
										<text>￥{{item.divideAmount || item.payableAmount}}</text>
									</view>
									<view>
										<text v-if="item.refundAmount"
											class="tn-color-red tn-margin-left-sm tn-text-sm">
											已退：￥{{item.refundAmount}}
										</text>
									</view>
								</view>
								<view v-else>
									<view>
										<text>￥{{item.timeCardTotal}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="tn-bg-white tn-margin-top-xs">
					<tn-list-view title="订单信息" :card="true" unlined="all">
						<tn-list-cell>
							<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
								<view>应收金额</view>
								<view class="tn-color-gray">￥{{orderInfo.payableAmount}}</view>
							</view>
						</tn-list-cell>
						<tn-list-cell>
							<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-top">
								<view>支付信息</view>
								<view class="tn-color-gray">
									<view v-for="(pay,index) in orderInfo.pays" :key="index">
										<text>{{pay.payCodeName}}</text>
										<text class="tn-margin-left-xs tn-color-orangered">
											￥{{pay.realityAmount}}
										</text>
									</view>
								</view>
							</view>
						</tn-list-cell>
						<tn-list-cell>
							<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
								<view>会员</view>
								<view class="tn-color-gray">
									{{orderInfo.member? orderInfo.member.name : '散客'}}
								</view>
							</view>
						</tn-list-cell>
						<tn-list-cell>
							<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
								<view>销售单号</view>
								<view class="tn-color-gray">{{orderInfo.orderNo}}</view>
							</view>
						</tn-list-cell>
						<tn-list-cell>
							<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
								<view>销售时间</view>
								<view class="tn-color-gray">{{orderInfo.cashierTime}}</view>
							</view>
						</tn-list-cell>
						<tn-list-cell>
							<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
								<view>操作人</view>
								<view class="tn-color-gray">
									{{orderInfo.operationAccount?orderInfo.operationAccount.name : ''}}
								</view>
							</view>
						</tn-list-cell>
						<tn-list-cell>
							<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-top">
								<view>服务人</view>
								<view class="tn-color-gray">
									<view v-for="(account,index) in orderInfo.serviceAccounts" :key="index">
										<text>{{account.name}}</text>
									</view>
								</view>
							</view>
						</tn-list-cell>
						<tn-list-cell>
							<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
								<view>备注</view>
								<view class="tn-color-gray">{{orderInfo.remark}}</view>
							</view>
						</tn-list-cell>
					</tn-list-view>
				</view>
			</scroll-view>
		</view>
		<tn-modal v-model="deleteConfirmShow" :title="deleteConfirmTitle" :content="deleteConfirmContent"
			:button="deleteConfirmBtn" @click="deleteOrder"></tn-modal>
		<view class="footerfixed tabbar">
			<view class="tn-flex tn-flex-row-between tn-flex-col-center tn-margin-top tn-padding-left tn-padding-right">
				<view class="tn-flex tn-flex-row-center tn-flex-col-center">
					<tn-button fontColor="tn-color-red" backgroundColor="tn-bg-red" :plain="true" height="auto"
						padding="20rpx 28rpx" @click="deleteConfirmShow=true">删除</tn-button>
				</view>
				<view v-if="orderInfo.refundMark!=3" class="tn-flex tn-flex-row-center tn-flex-col-center">
					<tn-button fontColor="tn-color-gray" backgroundColor="tn-bg-gray" :plain="true" height="auto"
						padding="20rpx 28rpx" @click="orderRefund">退货</tn-button>
				</view>
				<view class="tn-flex tn-flex-row-center tn-flex-col-center">
					<tn-button fontColor="tn-color-white" backgroundColor="tn-bg-blue--dark" height="auto"
						padding="20rpx 28rpx">打印</tn-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import cashierOrder from '../../api/cashier/cashierOrder'
	import mixin from '../../common/mixin'

	export default {
		name: 'orderDetail',
		mixins: [mixin],
		data() {
			return {
				tips: {
					type: 'success',
					mask: false,
					message: '提示',
					duration: 2000
				},
				backRefresh: false,
				customNavbarHeight: 0,
				scrollViewTop: 0,
				scrollViewHeight: 0,
				id: '',
				orderInfo: {},
				deleteConfirmShow: false,
				deleteConfirmTitle: '删除确认',
				deleteConfirmContent: '确认删除此订单吗，删除后订单相关信息将消失',
				deleteConfirmBtn: [{
						text: '取消',
						backgroundColor: 'tn-bg-gray',
						plain: true,
						shape: 'round'
					},
					{
						text: '删除',
						backgroundColor: 'tn-bg-red',
						fontColor: 'tn-color-red',
						plain: true
					}
				]
			}
		},
		onLoad(options) {
			this.id = options.id || ''
		},
		mounted() {
			this.getOrderInfo()
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
			refresh() {
				this.backRefresh = true
				this.getOrderInfo()
			},
			getOrderInfo() {
				cashierOrder.cashierOrderInfo(this.id).then(res => {
					this.orderInfo = res.data
				})
			},
			deleteOrder(item) {
				if (item.index === 0) {
					this.deleteConfirmShow = false
					return
				}
				cashierOrder.cashierOrderDelete(this.id).then(() => {
					this.$refs.tips.show({
						msg: '删除成功',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					setTimeout(function() {
						uni.navigateBack({
							delta: 1
						})
					}, 1500)
				})
			},
			orderRefund() {
				uni.navigateTo({
					url: `/view/order/refund?id=${this.id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tn-order {
		&__item {
			&:last-child {
				border: none;
			}
		}

		.image-article {
			width: 80rpx;
			height: 80rpx;
			border-radius: 12rpx;
			background-color: $tn-progress-bg-color;

			.image-pic {
				width: 80rpx;
				height: 80rpx;
			}

			.default-image-pic {
				margin: 20rpx;
				width: 40rpx;
				height: 40rpx;
			}
		}
	}
</style>