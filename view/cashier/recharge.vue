<template>
	<view class="template-product main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar statusBar class="custom-nav" :fixed="true" :border="false" title="会员储值" left-icon="left"
			left-text="返回" @clickLeft="goBack()">
		</uni-nav-bar>
		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="member--wrap">
			<view class="tn-classify__container tn-flex tn-flex-nowrap tn-flex-row-around tn-margin-top-xs">
				<scroll-view class="tn-radius" :scroll-top="scrollViewBasicTop" scroll-y scroll-with-animation
					:style="{height: scrollViewHeight + 'px'}">
					<view class="tn-padding tn-bg-white">
						<view class="tn-flex tn-flex-row-left tn-flex-col-center tn-margin-bottom">
							<view class="image-article tn-margin-right-sm">
								<image v-if="memberInfo.headPath" :src="getPicture(memberInfo.headPath)"
									mode="aspectFit" class="image-pic" />
								<image v-else src="@/static/img/member/default-image-vip.png" mode="widthFix"
									class="image-default-pic" />
							</view>
							<view class="tn-flex tn-flex-direction-column tn-flex-row-between tn-height-full"
								style="height: 100rpx;">
								<view class="tn-text-lg clamp-text-1 tn-text-justify tn-text-ellipsis"
									style="font-weight: 500;">
									{{ memberInfo.name }}
									<text class="tn-icon-sequence tn-margin-left-xs"></text>
								</view>
								<view class="tn-flex tn-flex-direction-row tn-flex-row-between tn-flex-col-center">
									<view class="tn-text-justify">
										<text>{{memberInfo.phone}}</text>
									</view>
								</view>
							</view>
						</view>
						<view class="tn-flex tn-flex-flow-column tn-flex-col-center tn-flex-row-center tn-padding-top">
							<text class="tn-text-xxl tn-text-bold">{{memberInfo.nowRecharge || 0}}</text>
							<view class="tn-margin-top-xs tn-content-color tn-text-center">
								<text>当前余额（元）</text>
							</view>
						</view>
					</view>
					<view class="tn-margin-top-xs tn-padding tn-bg-white">
						<tn-grid :col="2">
							<block v-for="(item, index) in rechargeRuleList" :key="index">
								<!-- H5 -->
								<!-- #ifndef MP-WEIXIN -->
								<tn-grid-item class="tn-padding-xs" @click="selectRecargeInfo(item)">
									<view class="tn-width-full">
										<view class="tn-padding-sm tn-radius-lg tb-bg-space tn-opacity08 tn-text-center"
											:class="[selectRule.id===item.id?'tn-border-solid':'']">
											<view class="tn-text-xl tn-text-bold">
												￥{{item.realAmount}}
											</view>
											<view class="tn-margin-xs">赠送￥{{item.giveAmount}}</view>
										</view>
									</view>
								</tn-grid-item>
								<!-- #endif-->

								<!-- 微信小程序 -->
								<!-- #ifdef MP-WEIXIN -->
								<tn-grid-item class="tn-padding" :style="{width: 100/2+'%'}"
									@click="selectRecargeInfo(item)">
									<view class="tn-width-full">
										<view class="tn-padding tn-radius-lg tb-bg-space tn-opacity08 tn-text-center"
											:class="[selectRule.id===item.id?'tn-border-solid':'']">
											<view class="tn-text-xl tn-text-bold">
												￥{{item.realAmount}}
											</view>
											<view class="tn-margin-xs">赠送￥{{item.giveAmount}}</view>
										</view>
									</view>
								</tn-grid-item>
								<!-- #endif-->
							</block>
						</tn-grid>
						<tn-form :model="cashier" ref="cashierForm" labelAlign="right" :labelWidth="160"
							class="tn-margin-top-xs" :errorType="['message']">
							<tn-form-item label="销售人员：" prop="serviceAccountIds">
								<tn-input v-model="cashier.serviceAccountName" type="select"
									@click="checkedAccount()" />
							</tn-form-item>
							<tn-form-item label="销售日期：" prop="cashierTime">
								<tn-input v-model="cashier.cashierTime" type="select" @click="cashierTimeShow=true" />
								<tn-picker mode="time" v-model="cashierTimeShow" :defaultTime="cashier.cashierTime"
									@confirm="checkedCashierTime"></tn-picker>
							</tn-form-item>
							<tn-form-item label="销售备注：" prop="remark">
								<tn-input v-model="cashier.remark" type="textarea" :autoHeight="true"
									placeholder="备注信息" />
							</tn-form-item>
						</tn-form>
					</view>
				</scroll-view>
			</view>
			<tn-popup v-model="accountPopupShow" mode="bottom" :safeAreaInsetBottom="true" :borderRadius="5"
				:closeBtn="true" closeBtnPosition="top-left" :negativeTop="10" :marginTop="60">
				<view
					class="tn-flex tn-flex-col-center tn-flex-row-center tn-text-bold tn-text-xl tn-border-solid-bottom"
					style="height: 45px; width: 100%;">
					<text>选择销售人员</text>
				</view>
				<scroll-view scroll-y="true" :style="{height:accountPopupHeight+'px'}">
					<view style="padding: 15px;text-align: center;">
						<tn-checkbox-group v-model="cashier.serviceAccountIds" @change="accountCheckboxChange">
							<tn-checkbox v-for="(item, index) in accountList" :key="index"
								:name="item.id">{{item.name}}</tn-checkbox>
						</tn-checkbox-group>
					</view>
				</scroll-view>
			</tn-popup>
			<tn-popup v-model="paytypePopupShow" mode="bottom" :safeAreaInsetBottom="true" :borderRadius="5"
				:closeBtn="true" :negativeTop="10" :marginTop="90">
				<view class="tn-flex tn-flex-col-center tn-flex-row-center tn-text-xl tn-border-solid-bottom"
					style="height: 90rpx; width: 100%; padding: 0 30rpx;">
					<view class="tn-text-bold tn-text-center">选择支付方式</view>
				</view>
				<scroll-view scroll-y="true" :style="{height:accountPopupHeight+'px'}">
					<view style="padding: 15px">
						<tn-grid align="center" :col="paytypeCol">
							<block v-for="(item, index) in paytypeList" :key="index">
								<!-- H5 -->
								<!-- #ifndef MP-WEIXIN -->
								<tn-grid-item @click="cashierSubmit(item)">
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
								<tn-grid-item @click="cashierSubmit(item)" :style="{width: 100/paytypeCol+'%'}">
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
			</tn-popup>
			<tn-modal v-model="payingShow" :custom="true" :maskCloseable="false">
				<view
					class="custom-modal-content tn-flex tn-flex-direction-column tn-flex-row-center tn-flex-col-center">
					<tn-loading v-if="payingOption.icon==='loading'" mode="flower" :size="120"></tn-loading>
					<view v-if="payingOption.icon==='success'"
						class="tn-icon tn-icon-success-circle tn-color-green tn-text-xxl-xxl"></view>
					<view class="text tn-margin-top tn-text-xxl">{{payingOption.content}}</view>
				</view>
			</tn-modal>
		</view>
		<view class="footerfixed dd-glass tn-flex tn-flex-col-center tn-flex-row-between">
			<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
				<tn-button backgroundColor="tn-bg-blue--dark" fontColor="tn-color-white" style="width: 100%;"
					shape="round" :blockRepeatClick="true" @click="checkedPaytype()">充值</tn-button>
			</view>
		</view>
	</view>
</template>

<script>
	import spu from '../../api/goods/spu'
	import member from '../../api/member/member'
	import rechargeRule from '../../api/market/rechargeRule'
	import payment from '../../api/cashier/payment'
	import security from '../../api/security/staff'
	import uuid from '../../uni_modules/tuniao-ui/libs/function/uuid'
	import cashierOrder from '../../api/cashier/cashierOrder'
	import mixin from '../../common/mixin'
	import config from '../../common/config'
	export default {
		name: 'TemplateProduct',
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
				// scrollView的top值
				scrollViewBasicTop: 0,
				// scrollView的高度
				scrollViewHeight: 0,
				specTitleWidth: 0,
				id: '',
				memberInfo: {},
				rechargeRuleList: [],
				selectRule: {},
				paytypePopupShow: false,
				paytypeCol: 4,
				paytypeList: [],
				accountPopupShow: false,
				accountPopupHeight: 0,
				accountList: [],
				cashierTimeShow: false,
				cashier: {
					category: 2,
					memberId: '',
					cards: [],
					discount: 10, //折扣
					discountAmount: 0, // 折扣金额
					ignoreType: 0, //抹零
					ignoreAmount: 0, // 抹零金额
					preferentialAmount: 0, // 优惠金额
					collectAmount: 0, // 优惠后金额
					adjustAmount: 0, // 调整金额
					payableAmount: 0, // 应收
					remark: '',
					source: 1
				},
				selectPaytype: [],
				payingShow: false,
				payingOption: {
					icon: 'loading',
					content: '正在支付中'
				}
			}
		},
		onLoad(option) {
			this.id = option.id
			this.cashier.memberId = this.id
			this.getRechargeRule()
			this.getAccountList()
			this.getPaytypeList()
			if (this.id) {
				this.getMemberInfo()
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.getScrollViewInfo()
			})
		},
		methods: {
			// 获取scrollView的高度信息
			async getScrollViewInfo() {
				// 获取当前屏幕的可用高度
				const footerFixed = await mixin.methods.getRect(this, '.footerfixed')
				const customNavbar = await mixin.methods.getRect(this, '.custom-nav')
				const systemInfo = uni.getSystemInfoSync()
				this.customNavbarHeight = customNavbar.height
				this.scrollViewHeight = systemInfo.windowHeight - customNavbar.height -
					footerFixed.height
				this.accountPopupHeight = systemInfo.safeArea.height * 0.3
			},
			getMemberInfo() {
				member.memberInfo(this.id).then(res => {
					this.memberInfo = res.data
				})
			},
			getPicture(picture) {
				return config.pictureUrl + picture
			},
			getPaytypeList() {
				payment.getAssetPayType().then(res => {
					this.paytypeList = res.data || []
				})
			},
			getAccountList() {
				security.accountList().then(res => {
					this.accountList = res.data || []
					if (this.accountList.length > 0) {
						this.accountCheckboxChange([this.accountList[0].id])
					}
				})
			},
			checkedAccount() {
				this.accountPopupShow = true
			},
			accountCheckboxChange(list) {
				this.cashier.serviceAccountIds = list
				this.cashier.serviceAccountName = this.accountList
					.filter(x => list.findIndex(y => y === x.id) >= 0)
					.map(x => x.name).join(',')
			},
			checkedCashierTime(time) {
				this.cashier.cashierTime = `${time.year}-${time.month}-${time.day}`
			},
			editAdjustAmount() {
				this.adjustAmountPopupShow = true
				if (this.cashier.adjustAmount === 0) {
					this.cashier.adjustAmount = ''
				}
			},
			getRechargeRule() {
				rechargeRule.rechargeRuleList().then(res => {
					this.rechargeRuleList = res.data || []
					if (this.rechargeRuleList.length > 0) {
						this.selectRecargeInfo(this.rechargeRuleList[0])
					}
				})
			},
			selectRecargeInfo(item) {
				this.selectRule = item
			},
			checkedPaytype() {
				this.payingShow = false
				if (!this.selectRule) {
					this.$refs.tips.show({
						msg: '请选择充值金额',
						backgroundColor: '#FFA726',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					return
				}
				const card = {
					key: uuid(),
					skuId: this.selectRule.id,
					skuName: this.selectRule.name,
					spuId: '',
					quantity: 1,
					adjustAmount: 0,
					payableAmount: this.selectRule.realAmount,
					skuNo: ''
				}
				this.cashier.payableAmount = card.payableAmount
				this.cashier.cards = [card]
				this.cashier.memberId = this.memberInfo.id
				this.paytypePopupShow = true
			},
			cashierSubmit(paytype) {
				if (paytype.typeName === 'auth') {
					// 调出扫码收款
					uni.scanCode({
						onlyFromCamera: true,
						scanType: ['barCode', 'qrCode'],
						autoZoom: true,
						hideAlbum: true,
						success() {
							// 创建订单
							this.orderCreate(paytype)
						}
					})
					return
				}
				// 直接调用创建订单，支付
				this.orderCreate(paytype)
			},
			orderCreate(paytype) {
				// 创建订单
				this.payingOption = {
					icon: 'loading',
					content: '正在支付中'
				}
				this.payingShow = true
				cashierOrder.cashierOrderConfirm(this.cashier).then(res => {
					const orderId = res.data
					this.orderPay(orderId, paytype)
				}).catch(error => {
					this.$refs.tips.show({
						msg: '生成订单异常',
						backgroundColor: '#E83A30',
						fontColor: '#FFFFFF',
						duration: 1500
					})
				})
			},
			orderPay(orderId, paytype) {
				// 订单支付
				const params = {
					id: orderId,
					payCode: paytype.payCode,
					payAmount: this.cashier.adjustAmount || this.cashier.payableAmount,
					authCode: ''
				}
				cashierOrder.cashierOrderPay(params).then(res => {
					this.payingOption = {
						icon: 'success',
						content: '支付成功'
					}
					setTimeout(() => {
						this.payingShow = false
						this.paytypePopupShow = false
						mixin.methods.goBack(true)
					}, 100)
				}).catch(error => {
					this.payingShow = false
					this.$refs.tips.show({
						msg: '生成订单异常',
						backgroundColor: '#BA2E26',
						fontColor: '#FFFFFF',
						duration: 1500
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.member {
		&--wrap {
			position: fixed;
			left: 0;
			right: 0;
			width: 100%;
			background-color: inherit;
			z-index: 2;
		}
	}

	.image-article {
		width: 100rpx;
		height: 100rpx;
		position: relative;
		border-radius: 12rpx;
		background-color: $tn-progress-bg-color;
		display: flex;
		align-items: center;
		justify-content: center;

		.image-pic {
			width: 60rpx;
		}

		.image-default-pic {
			width: 50rpx;
			// 白色图
		}
	}



	/* 标签内容 start*/
	.tn-tag-content {
		&__item {
			display: inline-block;
			line-height: 45rpx;
			padding: 10rpx 30rpx;
			margin: 20rpx 20rpx 5rpx 0rpx;

			&--prefix {
				padding-right: 10rpx;
			}
		}
	}

	/deep/ .tn-grid-item {
		&--hover {
			background: none;
		}
	}

	/* 标签内容 end*/

	/deep/ .specs-cell:last-child {
		&::after {
			border-bottom: none;
		}
	}

	/* 间隔线 start*/
	.tn-strip-bottom-min {
		width: 100%;
		border-bottom: 1rpx solid #F8F9FB;
	}

	/* 间隔线 start*/
	.tn-strip-bottom {
		width: 100%;
		border-bottom: 20rpx solid rgba(241, 241, 241, 0.8);
	}

	/* 间隔线 end*/
	/* 底部tabbar start*/
	.footerfixed {
		position: fixed;
		width: 100%;
		bottom: 0;
		z-index: 1;
		height: 120rpx;
		background-color: #FFFFFF;
		box-shadow: 0rpx 0rpx 30rpx 0rpx rgba(0, 0, 0, 0.07);
	}

	.image-article {
		width: 120rpx;
		height: 120rpx;
		position: relative;
		border-radius: 12rpx;
		border: 1rpx solid $tn-border-solid-color;
		background-color: $tn-progress-bg-color;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.image-pic {
		width: 60rpx;
	}

	/* 毛玻璃*/
	.dd-glass {
		width: 100%;
		backdrop-filter: blur(20rpx);
		-webkit-backdrop-filter: blur(20rpx);
	}
</style>