<template>
	<view class="main-container tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar class="custom-nav" statusBar :fixed="true" :border="false" title="结算" left-icon="left"
			left-text="返回" @clickLeft="goBack(false)">
		</uni-nav-bar>
		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="tn-classify__container tn-margin-top-xs tn-margin-bottom-xs tn-bg-white">
			<scroll-view class="tn-flex-1" :scroll-top="0" scroll-y scroll-with-animation
				:style="{height: scrollViewHeight + 'px'}">
				<view class="tn-cashier tn-height-full tn-padding-top-xs">
					<view class="tn-cashier__content tn-bg-white tn-radius">
						<view v-for="(item,index) in cashier.cards" :key="index"
							class="tn-cashier__content__item tn-border-solid-bottom tn-padding">
							<view class="tn-flex tn-flex-row-left">
								<view class="image-article tn-margin-right-sm">
									<image v-if="item.picture" :src="item.picture" mode="aspectFill"
										class="image-pic" />
									<image v-else src="@/static/img/goods/default-goods-manage.png" mode="widthFix"
										class="image-default-pic" />
								</view>
								<view class="tn-flex-1 tn-flex tn-flex-direction-column tn-flex-row-between">
									<view class="tn-text-lg clamp-text-1 tn-text-justify tn-text-ellipsis"
										style="font-weight: 500;">
										{{ item.skuName }}
									</view>
									<view
										class="tn-flex tn-flex-direction-row tn-flex-row-between tn-flex-col-center tn-text-md">
										<text class="tn-text-df clamp-text-2 tn-text-justify">
											x{{item.quantity}}
										</text>
										<view class="tn-color-red">
											￥{{item.payableAmount}}
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="tn-bg-white tn-radius tn-margin-top-xs tn-padding">
						<tn-form :model="cashier" ref="cashierForm" labelAlign="right" :labelWidth="160"
							:errorType="['message']">
							<tn-form-item label="整单折扣：" prop="discount">
								<tn-input v-model="cashier.discountName" type="select" @click="checkedDiscount()"
									placeholder="折扣信息" />
								<tn-select v-model="discountShow" :defaultValue="[cashier.discount]" mode="single"
									:searchShow="false" :list="discountList" @confirm="discountConfirm"></tn-select>
							</tn-form-item>
							<tn-form-item label="抹零：" prop="ignoreType">
								<tn-input v-model="cashier.ignoreTypeName" type="select" @click="checkedIgnore()" />
								<tn-select v-model="ignoreShow" :defaultValue="[cashier.ignoreType]" mode="single"
									:searchShow="false" :list="ignoreList" @confirm="ignoreConfirm"></tn-select>
							</tn-form-item>
							<tn-form-item label="销售人员：" prop="serviceAccountIds">
								<tn-input v-model="cashier.serviceAccountName" type="select"
									@click="checkedAccount()" />
							</tn-form-item>
							<tn-form-item label="销售日期：" prop="cashierTime">
								<tn-input v-model="cashier.cashierTime" type="select" @click="cashierTimeShow=true" />
								<tn-picker mode="time" v-model="cashierTimeShow" :params="cashierTimeParams"
									:defaultTime="cashier.cashierTime" @confirm="checkedCashierTime"></tn-picker>
							</tn-form-item>
							<tn-form-item label="销售备注：" prop="remark">
								<tn-input v-model="cashier.remark" type="textarea" :autoHeight="true"
									placeholder="备注信息" />
							</tn-form-item>
						</tn-form>
					</view>
				</view>
				<tn-popup v-model="accountPopupShow" mode="bottom" :safeAreaInsetBottom="true" :borderRadius="5"
					:closeBtn="true" closeBtnPosition="top-left" :negativeTop="10" :marginTop="60">
					<view
						class="tn-flex tn-flex-col-center tn-flex-row-center tn-text-bold tn-text-xl tn-border-solid-bottom"
						style="height: 45px; width: 100%;">
						<text>选择销售人员</text>
					</view>
					<scroll-view scroll-y="true" :style="{height:accountPopupHeight+'px'}">
						<view style="padding: 15px">
							<tn-checkbox-group v-model="cashier.serviceAccountIds" @change="accountCheckboxChange">
								<tn-checkbox v-for="(item, index) in accountList" :key="index"
									:name="item.id">{{item.name}}</tn-checkbox>
							</tn-checkbox-group>
						</view>
					</scroll-view>
				</tn-popup>
				<tn-popup v-model="adjustAmountPopupShow" mode="bottom" :safeAreaInsetBottom="true" :borderRadius="5"
					:closeBtn="true" closeBtnPosition="top-left" :negativeTop="60" :marginTop="90">
					<view
						class="tn-flex tn-flex-col-center tn-flex-row-center tn-text-bold tn-text-xl tn-border-solid-bottom tn-width-full"
						style="height: 45px;">
						<text>修改支付金额</text>
					</view>
					<view style="padding: 15px">
						<tn-input type="number" v-model="cashier.adjustAmount"></tn-input>
					</view>
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
												class="tn-flex tn-flex-row-center tn-flex-col-center tn-radius"
												style="">
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
												class="tn-flex tn-flex-row-center tn-flex-col-center tn-radius"
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
				<view class="tabbar footerfixed">
					<view class="tn-flex tn-flex-row-between tn-flex-col-center tn-margin-top">
						<view class="justify-content-item tn-padding-left">
							<view class="tn-flex tn-flex-row-center tn-flex-col-center tn-text-xl">
								<view class="tn-text-md">本单收款：</view>
								<view class="">
									￥{{ cashier.adjustAmount || cashier.payableAmount}}
								</view>
								<view class="tn-icon-edit tn-text-md tn-padding-xs" @click="editAdjustAmount"></view>
							</view>
						</view>
						<view class="tn-flex tn-flex-row-center tn-flex-col-center tn-padding-right">
							<tn-button fontColor="tn-color-white" backgroundColor="tn-bg-blue--dark" :fontSize="40"
								height="auto" padding="20rpx 28rpx" @click="checkedPaytype()">结算</tn-button>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import category from '../../api/goods/category'
	import stockStore from '../../api/stock/stockStore'
	import uuid from '../../uni_modules/tuniao-ui/libs/function/uuid'
	import cashierOrder from '../../api/cashier/cashierOrder'
	import cashierDiscount from '../../api/cashier/cashierDiscount'
	import cashierIgnore from '../../api/cashier/cashierIgnore'
	import security from '../../api/security/staff'
	import payment from '../../api/cashier/payment'
	import mixin from '../../common/mixin'
	import {
		formatDateTime
	} from '../../common/datetimeFormat'

	export default {
		name: 'TemplateCashier',
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
				discountShow: false,
				discountList: [],
				ignoreShow: false,
				ignoreList: [],
				accountPopupShow: false,
				accountPopupHeight: 0,
				accountList: [],
				cashierTimeShow: false,
				cashierTimeParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
				adjustAmountPopupShow: false,
				paytypePopupShow: false,
				paytypeCol: 4,
				paytypeList: [],
				cashier: {},
				selectPaytype: [],
				payingShow: false,
				payingOption: {
					icon: 'loading',
					content: '正在支付中'
				}
			}
		},
		onLoad(option) {
			if (option.cashier) {
				this.cashier = JSON.parse(decodeURIComponent(option.cashier))
				this.initCashier()
				this.getIgnoreInfo()
			}
		},
		onReady() {
			this.$nextTick(() => {
				this.getAreaHeight()
			})
		},
		created() {
			this.getDiscountList()
			this.getIgnoreList()
			this.getAccountList()
			this.getPaytypeList()
		},
		methods: {
			async getAreaHeight() {
				// 获取效果演示框的节点信息
				const footerFixed = await mixin.methods.getRect(this, '.footerfixed')
				const customNavbar = await mixin.methods.getRect(this, '.custom-nav')
				const systemInfo = uni.getSystemInfoSync()
				this.customNavbarHeight = customNavbar.height
				// 内容可用高度=窗口高度-状态栏高度-自定义导航栏高度-底部固定高度(已包含安全区域)
				this.scrollViewHeight = systemInfo.windowHeight - customNavbar.height -
					footerFixed.height - uni.upx2px(20)
				this.accountPopupHeight = systemInfo.safeArea.height * 0.3
			},
			initCashier() {
				if (this.vuexUserInfo) {
					this.cashier.serviceAccountIds = [this.vuexUserInfo.id]
					this.cashier.serviceAccountName = this.vuexUserInfo.name
				}
				const now = new Date()
				this.cashier.cashierTime = formatDateTime(now)
			},
			getCardTotal() {
				if (this.cashier.cards.length === 0) {
					return 0
				}
				return this.cashier.cards.map(x => x.quantity)
					.reduce((x, y) => {
						return x + y
					})
			},
			getDiscountList() {
				cashierDiscount.orderDiscountList().then(res => {
					if (res.data.length === 0) {
						this.discountList = []
						return
					}
					this.discountList = res.data.map(x => {
						return {
							value: x.discount,
							label: x.discountName
						}
					})
				})
			},
			checkedDiscount() {
				if (this.discountList.length === 0) {
					this.$refs.tips.show({
						msg: '没有可选折扣使用',
						backgroundColor: '#FFA726',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					return
				}
				this.discountShow = true
			},
			discountConfirm(list) {
				if (list.length > 0) {
					const item = list[0]
					this.cashier.discount = item.value
					this.cashier.discountName = item.label
				}
			},
			getIgnoreList() {
				cashierIgnore.orderIgnoreSetList().then(res => {
					this.ignoreList = res.data || []
				})
			},
			getIgnoreInfo() {
				cashierIgnore.orderIgnoreInfo().then(res => {
					this.cashier.ignoreType = res.data.type
					this.cashier.ignoreTypeName = res.data.typeName
				})
			},
			checkedIgnore() {
				this.ignoreShow = true
			},
			ignoreConfirm(list) {
				if (list.length > 0) {
					const item = list[0]
					this.cashier.ignoreType = item.value
					this.cashier.ignoreTypeName = item.label
				}
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
				this.cashier.cashierTime =
					`${time.year}-${time.month}-${time.day} ${time.hour}:${time.minute}:${time.second}`
			},
			editAdjustAmount() {
				this.adjustAmountPopupShow = true
				if (this.cashier.adjustAmount === 0) {
					this.cashier.adjustAmount = ''
				}
			},
			getPaytypeList() {
				payment.getCashierPayType().then(res => {
					if (!this.cashier.memberId) {
						this.paytypeList = res.data.filter(x => !x.memberOnly)
					} else {
						this.paytypeList = res.data
					}
				})
			},
			checkedPaytype() {
				this.paytypePopupShow = true
			},
			cashierSubmit(paytype) {
				// 创建订单
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
					this.payingShow = false
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
					this.paytypePopupShow = false
					setTimeout(() => {
						this.payingShow = false
						mixin.methods.goBack(true)
					}, 500)
				}).catch(error => {
					this.payingShow = false
					this.$refs.tips.show({
						msg: '订单支付异常',
						backgroundColor: '#E83A30',
						fontColor: '#FFFFFF',
						duration: 1500
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tn-cashier {

		/* 内容 start */
		&__content {
			&__item {
				&:last-child {
					border: none;
					margin-bottom: 0;
				}
			}

			.image-article {
				width: 100rpx;
				height: 100rpx;
				border-radius: 8rpx;
				background-color: $tn-progress-bg-color;
				display: flex;
				align-items: center;
				justify-content: center;

				.image-pic {
					width: 80rpx;
				}

				.image-default-pic {
					width: 50rpx;
				}
			}
		}
	}
</style>