<template>
	<view class="main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar statusBar class="custom-nav" :fixed="true" :border="false" title="商品退货" left-icon="left"
			left-text="返回" @clickLeft="goBack()">
		</uni-nav-bar>
		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="tn-flex tn-flex-nowrap tn-flex-row-around tn-margin-top-xs tn-bg-white">
			<scroll-view class="tn-order tn-bg-gray--light" scroll-y :style="{height: scrollViewHeight + 'px'}">
				<view class="tn-bg-white tn-padding-left tn-padding-right">
					<view v-for="(item,index) in orderInfo.skus" :key="index"
						class="tn-order__item tn-padding tn-border-solid-bottom">
						<view class="tn-flex tn-flex-flow-row tn-flex-nowrap tn-flex-col-center tn-flex-row-between">
							<view class="tn-flex-1 tn-flex tn-flex-flow-row tn-flex-row-center">
								<view
									class="image-article tn-flex tn-flex-flow-row tn-flex-col-center tn-flex-row-center tn-margin-right-sm">
									<image v-if="item.picture" :src="item.picture" mode="aspectFill"
										class="image-pic" />
									<image v-else src="@/static/img/goods/default-goods-manage.png" mode="aspectFill"
										class="default-image-pic" />
								</view>
								<view class="tn-flex-1 tn-flex tn-flex-flow-column tn-flex-row-between">
									<view>
										{{item.skuName}}
									</view>
									<view class="tn-margin-top-sm">
										<text class="tn-color-orange">￥{{item.referenceAmount}}</text>
										<text class="tn-margin-left-xs">x{{item.saleQuantity}}</text>
									</view>
								</view>
							</view>
							<view class="tn-flex tn-flex-flow-column tn-flex-col-center tn-flex-row-center">
								<view>
									<text v-if="item.refundQuantity">已退：x{{item.refundQuantity}}</text>
								</view>
								<view v-if="item.refundQuantity<item.saleQuantity"
									class="tn-flex tn-flex-col-center tn-flex-row-center">
									<view
										class="tn-icon-reduce tn-text-xs tn-border-blue tn-border-solid tn-color-blue--dark"
										style="border-radius: 50%; padding: 1px;" @click="removeQuantity(item)">
									</view>
									<view class="tn-padding-left tn-padding-right">
										{{item.quantity}}
									</view>
									<view
										class="tn-icon-add tn-text-xs tn-border-blue tn-border-solid tn-color-blue--dark"
										style="border-radius: 50%; padding: 1px;" @click="addQuantity(item)">
									</view>
								</view>
							</view>
						</view>
					</view>
					<tn-form :model="cashier" ref="cashierForm" labelAlign="right" :labelWidth="200"
						:errorType="['message']">
						<tn-form-item label="退款金额：" prop="refundAmount">
							<text>{{cashier.refundAmount}}</text>
						</tn-form-item>
						<tn-form-item label="退款方式：" prop="refundPayCode" :required="true">
							<tn-input v-model="cashier.refundPayName" type="select" @click="checkedPaytype()"
								placeholder="选择退款方式" />
						</tn-form-item>
						<tn-form-item label="退款原因：" prop="refundReason">
							<tn-input v-model="cashier.refundReasonName" type="select" @click="refundReasonShow=true"
								placeholder="选择退款原因" />
							<tn-select v-model="refundReasonShow" mode="single" :searchShow="false"
								:list="refundReasonList" @confirm="refundReasonConfirm"></tn-select>
						</tn-form-item>
						<tn-form-item label="退款备注：" prop="refundRemark">
							<tn-input v-model="cashier.refundRemark" type="textarea" :autoHeight="true"
								placeholder="输入备注信息" />
						</tn-form-item>
					</tn-form>
				</view>
			</scroll-view>
		</view>
		<tn-popup v-model="paytypePopupShow" mode="bottom" :safeAreaInsetBottom="true" :borderRadius="5"
			:closeBtn="true" :negativeTop="10" :marginTop="90">
			<view class="tn-flex tn-flex-col-center tn-flex-row-center tn-text-xl tn-border-solid-bottom"
				style="height: 90rpx; width: 100%; padding: 0 30rpx;">
				<view class="tn-text-bold tn-text-center">选择退款方式</view>
			</view>
			<view>
				<scroll-view scroll-y="true" :style="{height:accountPopupHeight+'px'}">
					<view class="tn-padding">
						<tn-grid align="center" :col="paytypeCol">
							<block v-for="(item, index) in paytypeList" :key="index">
								<!-- H5 -->
								<!-- #ifndef MP-WEIXIN -->
								<tn-grid-item @click="refundPayTypeConfirm(item)">
									<view class="tn-padding tn-flex tn-flex-direction-column tn-flex-row-center">
										<view
											class="tn-flex tn-flex-row-center tn-flex-col-center tn-main-gradient-blue tn-radius"
											style="width: 100rpx; height: 100rpx;">
											<image :src="`../../static/img/cashier/payment/${item.icon}.png`"
												mode="aspectFit" style="width: 60rpx; height: 60rpx;" />
										</view>
										<view class="tn-text-center tn-margin-top-sm">{{ item.typeDesc }}</view>
									</view>
								</tn-grid-item>
								<!-- #endif-->
								<!-- 微信小程序 -->
								<!-- #ifdef MP-WEIXIN -->
								<tn-grid-item @click="refundPayTypeConfirm(item)" :style="{width: 100/paytypeCol+'%'}">
									<view class="tn-padding tn-flex tn-flex-direction-column tn-flex-row-center">
										<view
											class="tn-flex tn-flex-row-center tn-flex-col-center tn-main-gradient-blue tn-radius"
											style="width: 100rpx; height: 100rpx;">
											<image :src="`../../static/img/cashier/payment/${item.icon}.png`"
												mode="widthFix" style="width: 60rpx; height: 60rpx;" />
										</view>
										<view class="tn-text-center tn-margin-top-sm">{{ item.typeDesc }}</view>
									</view>
								</tn-grid-item>
								<!-- #endif-->
							</block>
						</tn-grid>
					</view>
				</scroll-view>
				<view class="tn-padding" v-if="orderInfo.allRefund">
					<tn-button backgroundColor="tn-bg-blue--dark" fontColor="tn-color-white" style="width: 100%;"
						shape="round" :blockRepeatClick="true" @click="refundOriginal">原路退回</tn-button>
				</view>
			</view>
		</tn-popup>
		<tn-modal v-model="refundingShow" :custom="true" :maskCloseable="false">
			<view class="custom-modal-content tn-flex tn-flex-direction-column tn-flex-row-center tn-flex-col-center">
				<tn-loading v-if="refundingOption.icon==='loading'" mode="flower" :size="120"></tn-loading>
				<view v-if="refundingOption.icon==='success'"
					class="tn-icon tn-icon-success-circle tn-color-green tn-text-xxl-xxl"></view>
				<view class="text tn-margin-top tn-text-xxl">{{refundingOption.content}}</view>
			</view>
		</tn-modal>
		<view class="tabbar footerfixed">
			<view class="tn-flex tn-flex-row-center tn-flex-col-center tn-margin-top tn-padding-left tn-padding-right">
				<tn-button backgroundColor="tn-bg-blue--dark" fontColor="tn-color-white" style="width: 100%;"
					shape="round" :blockRepeatClick="true" @click="refundCreate()">发起退货</tn-button>
			</view>
		</view>
	</view>
</template>

<script>
	import cashierOrder from '../../api/cashier/cashierOrder'
	import cashierRefund from '../../api/cashier/cashierRefund'
	import payment from '../../api/cashier/payment'
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
				customNavbarHeight: 0,
				scrollViewHeight: 0,
				accountPopupHeight: 0,
				id: '',
				orderInfo: {},
				cashier: {
					refundAmount: 0,
					refundMode: 1,
					refundPayCode: 0,
					refundPayName: '',
					refundReason: 0,
					refundReasonName: '',
					refundRemark: ''
				},
				refundModeList: [{
						code: 0,
						name: '原路退回',
					},
					{
						code: 1,
						name: '选择退款方式'
					}
				],
				paytypePopupShow: false,
				paytypeCol: 4,
				paytypeList: [],
				refundReasonShow: false,
				refundReasonList: [{
					value: 1,
					label: '买错商品'
				}, {
					value: 2,
					label: '商品质量问题'
				}, {
					value: 99,
					label: '其他原因'
				}],
				refundingShow: false,
				refundingOption: {
					icon: 'loading',
					content: '正在发起退款'
				}
			}
		},
		onLoad(options) {
			this.id = options.id || ''
		},
		mounted() {
			this.getOrderInfo()
			this.getPaytypeList()
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
				this.scrollViewHeight = systemInfo.windowHeight - customNavbar.height -
					footerFixed.height - uni.upx2px(20)
				this.accountPopupHeight = systemInfo.safeArea.height * 0.3
			},
			getOrderInfo() {
				cashierOrder.cashierOrderInfo(this.id).then(res => {
					res.data.skus.forEach(x => {
						x.waitRefundQuantity = x.saleQuantity - x.refundQuantity
						x.quantity = 0
					})
					res.data.allRefund = false
					this.orderInfo = res.data
				})
			},
			addQuantity(item) {
				const maxRefundQuantity = item.saleQuantity - item.refundQuantity
				if (item.quantity + 1 <= maxRefundQuantity) {
					item.quantity += 1
					// 计算是否全退，如果全退显示退款方式
					let allRefund = true
					this.orderInfo.skus.forEach(x => {
						if (x.refundQuantity != x.quantity) {
							allRefund = false
						}
					})
					this.orderInfo.allRefund = allRefund
					this.computeAmount()
				}
			},
			removeQuantity(item) {
				if (item.quantity - 1 >= 0) {
					item.quantity -= 1
					this.orderInfo.allRefund = false
					this.computeAmount()
				}
			},
			computeAmount() {
				let refundAmount = 0
				this.orderInfo.skus.forEach(item => {
					if (item.quantity > 0) {
						refundAmount += item.referenceAmount * item.quantity
					}
				})
				this.cashier.refundAmount = refundAmount
			},
			getPaytypeList() {
				payment.getRefundPayType().then(res => {
					if (!this.orderInfo.memberId) {
						this.paytypeList = res.data.filter(x => !x.memberOnly)
					} else {
						this.paytypeList = res.data
					}
				})
			},
			checkedPaytype() {
				this.paytypePopupShow = true
			},
			refundPayTypeConfirm(item) {
				this.cashier.refundMode = 1
				this.cashier.refundPayCode = item.payCode
				this.cashier.refundPayName = item.typeDesc
				this.paytypePopupShow = false
			},
			refundOriginal() {
				// 原路退回
				this.cashier.refundPayCode = 0
				this.cashier.refundPayName = '原路退回'
				this.cashier.refundMode = 0
				this.paytypePopupShow = false
			},
			refundReasonConfirm(list) {
				if (list.length > 0) {
					const item = list[0]
					this.cashier.refundReason = item.value
					this.cashier.refundReasonName = item.label
				}
			},
			refundCreate() {
				const skus = []
				this.orderInfo.skus.forEach(sku => {
					if (sku.quantity > 0) {
						skus.push({
							id: sku.id,
							skuId: sku.skuId,
							quantity: sku.quantity
						})
					}
				})
				if (skus.length === 0) {
					this.$refs.tips.show({
						msg: '请选择退货商品',
						backgroundColor: '#FFA726',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					return
				}
				if (this.cashier.refundMode === 1 && this.cashier.refundPayCode <= 0) {
					this.$refs.tips.show({
						msg: '请选择退款方式',
						backgroundColor: '#FFA726',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					return
				}
				this.refundingOption = {
					icon: 'loading',
					content: '正在发起退款中'
				}
				this.refundingShow = true
				const refund = {
					orderId: this.id,
					reason: this.cashier.refundReason,
					remark: this.cashier.refundRemark,
					skus: skus
				}
				cashierRefund.cashierRefundConfirm(refund).then(res => {
					const refundId = res.data
					this.refundPay(refundId)
				}).catch(error => {
					this.refundingShow = false
					this.$refs.tips.show({
						msg: '创建退货单异常',
						backgroundColor: '#E83A30',
						fontColor: '#FFFFFF',
						duration: 1500
					})
				})
			},
			refundPay(refundId) {
				const refundPayTypeList = []
				if (this.cashier.refundMode === 1) {
					refundPayTypeList.push({
						payCode: this.cashier.refundPayCode,
						refundAmount: this.cashier.refundAmount
					})
				}
				const refundPay = {
					refundId: refundId,
					refundMode: this.cashier.refundMode,
					payTypes: refundPayTypeList
				}
				cashierRefund.cashierRefundPay(refundPay).then(() => {
					this.refundingOption = {
						icon: 'success',
						content: '发起退货成功'
					}
					setTimeout(() => {
						this.refundingShow = false
						mixin.methods.goBack(true)
					}, 500)
				}).catch(error => {
					this.$refs.tips.show({
						msg: '发起退货异常',
						backgroundColor: '#FFA726',
						fontColor: '#FFFFFF',
						duration: 1500
					})
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