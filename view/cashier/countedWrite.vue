<template>
	<view class="main-container tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar class="custom-nav" statusBar :fixed="true" :border="false" title="计次核销" left-icon="left"
			left-text="返回" @clickLeft="goBack(false)">
		</uni-nav-bar>
		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="tn-cashier tn-margin-top-xs tn-margin-bottom-xs tn-bg-white">
			<scroll-view class="tn-flex-1" :scroll-top="0" scroll-y scroll-with-animation
				:style="{height: scrollViewHeight + 'px'}">
				<view @click="memberPupopShow=true"
					class="tn-flex tn-flex-flow-row tn-flex-row-left tn-margin-bottom tn-width-full tn-padding tn-border-solid-bottom">
					<view class="image-article tn-margin-right-sm">
						<image v-if="memberInfo.headPath" :src="memberInfo.headPath" mode="widthFix"
							class="image-pic" />
						<image v-else src="@/static/img/member/default-image-vip.png" mode="widthFix"
							class="image-default-pic" />
					</view>
					<view class="tn-flex-1 tn-flex tn-flex-flow-row tn-flex-row-between">
						<view v-if="memberInfo.id" class="tn-flex tn-flex-flow-column tn-flex-row-between">
							<view class="tn-text-lg">
								{{ memberInfo.name }}
							</view>
							<view>
								{{memberInfo.phone}}
							</view>
						</view>
						<view v-else class="tn-flex tn-flex-flow-column tn-flex-row-center">
							<view class="tn-text-lg">
								选择会员
							</view>
						</view>
						<view class="tn-flex tn-flex-flow-column tn-flex-row-center">
							<text class="tn-icon-sequence tn-margin-left-xs"></text>
						</view>
					</view>
				</view>
				<view class="tn-cashier">
					<view class="tn-bg-white tn-radius tn-margin-top-xs tn-padding">
						<tn-form :model="cashier" ref="cashierForm" labelAlign="right" :labelWidth="160"
							:errorType="['message']">
							<tn-form-item label="计次卡：" prop="countedId">
								<tn-input v-model="cashier.countedName" type="select" @click="checkedCounted()"
									placeholder="选择计次卡" />
								<tn-select v-model="countedShow" mode="single" :list="countedList" :searchShow="false"
									@confirm="countedSubmit"></tn-select>
							</tn-form-item>
							<tn-form-item label="服务项目：" prop="skuId">
								<tn-input v-model="cashier.skuName" type="select" @click="checkedCountedSku()"
									placeholder="服务项目" />
								<tn-select v-model="countedSkuShow" mode="single" :searchShow="false"
									:list="countedSkuList" @confirm="countedSkuSubmit"></tn-select>
							</tn-form-item>
							<tn-form-item label="核销次数：" prop="quantity">
								<tn-input v-model="cashier.quantity" :clearable="false" type="number"
									placeholder="核销次数" />
							</tn-form-item>
							<tn-form-item label="核销人员：" prop="serviceAccountIds">
								<tn-input v-model="cashier.serviceAccountName" type="select"
									@click="checkedAccount()" />
							</tn-form-item>
							<tn-form-item label="核销日期：" prop="cashierTime">
								<tn-input v-model="cashier.cashierTime" type="select" @click="cashierTimeShow=true" />
								<tn-picker mode="time" v-model="cashierTimeShow" :params="cashierTimeParams"
									:defaultTime="cashier.cashierTime" @confirm="checkedCashierTime"></tn-picker>
							</tn-form-item>
							<tn-form-item label="核销备注：" prop="remark">
								<tn-input v-model="cashier.remark" type="textarea" :autoHeight="true"
									placeholder="备注信息" />
							</tn-form-item>
						</tn-form>
					</view>
				</view>
				<tn-popup v-model="memberPupopShow" mode="bottom" :safeAreaInsetBottom="true" :borderRadius="5"
					:closeBtn="true" :negativeTop="10" :marginTop="60">
					<view
						class="tn-flex tn-flex-col-center tn-flex-row-center tn-flex-row-center tn-text-xl tn-border-solid-bottom"
						style="height: 90rpx; width: 100%; padding: 0 30rpx;">
						<view class="tn-text-bold">选择会员</view>
					</view>
					<scroll-view scroll-y="true" :style="{height:accountPopupHeight+'px'}">
						<view v-if="memberList.length>0" class="tn-padding">
							<view v-for="(item,index) in memberList" :key="index" class="tn-border-solid-bottom">
								<view class="article-shadow" @click="cashierMemberSubmit(item)">
									<view
										class="tn-flex tn-flex-flow-row tn-flex-row-left tn-flex-col-top tn-margin-bottom tn-width-full">
										<view class="image-article tn-margin-right-sm">
											<image v-if="item.headPath" :src="item.headPath" class="image-pic" />
											<image v-else src="@/static/img/member/default-image-vip.png"
												class="image-default-pic" />
										</view>
										<view class="tn-flex-1 tn-flex tn-flex-flow-column tn-flex-row-around">
											<view class="tn-text-lg" style="font-weight: 500;">
												{{ item.name }}
											</view>
											<view
												class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-bottom">
												<view class="tn-icon-tel">
													<text class="tn-margin-left-xs">{{item.phone}}</text>
												</view>
												<view
													class="tn-color-gray tn-flex tn-flex-row-center tn-flex-col-center tn-text-xs">
													<view v-if="item.nowIntegral"
														class="tn-border-solid tn-radius tn-margin-xs tn-padding-xs tn-flex-col-bottom tn-border-blue tn-color-blue--dark">
														积
													</view>
													<view v-if="item.nowRecharge"
														class="tn-border-solid tn-radius tn-margin-xs tn-padding-xs tn-flex-col-bottom tn-border-blue tn-color-blue--dark">
														储
													</view>
													<view v-if="item.counted"
														class="tn-border-solid tn-radius tn-margin-xs tn-padding-xs tn-flex-col-bottom tn-border-blue tn-color-blue--dark">
														次
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view v-else class="tn-padding-top-xl">
							<tn-empty mode="list" text="无会员信息"></tn-empty>
						</view>
					</scroll-view>
				</tn-popup>
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
						<view
							class="tn-flex-1 tn-flex tn-flex-row-center tn-flex-col-center tn-padding-left tn-padding-right">
							<tn-button fontColor="tn-color-white" backgroundColor="tn-bg-blue--dark"
								style="width: 100%;" shape="round" @click="cashierSubmit()">结算</tn-button>
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
	import member from '../../api/member/member'
	import timeCard from '../../api/member/timeCard'

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
				memberPupopShow: false,
				memberInfo: {},
				memberList: [],
				accountPopupShow: false,
				accountPopupHeight: 0,
				accountList: [],
				countedShow: false,
				countedList: [],
				countedSkuShow: false,
				countedSkuList: [],
				cashierTimeShow: false,
				cashierTimeParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
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
		mounted() {
			this.initCashier()
			this.getMemberList()
			this.getAccountList()
			this.$nextTick(() => {
				this.getAreaHeight()
			})
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
			getMemberList() {
				member.memberList().then(res => {
					this.memberList = res.data
				})
			},
			cashierMemberSubmit(item) {
				this.memberInfo = item
				this.memberPupopShow = false
				this.getCountedList()
			},
			getCountedList() {
				timeCard.memberTimeCardList(this.memberInfo.id).then(res => {
					if (res.data.length <= 0) {
						this.countedList = []
						return
					}
					this.countedList = res.data.map(x => {
						return {
							label: x.name,
							value: x.id
						}
					})
				})
			},
			checkedCounted() {
				if (!this.memberInfo || !this.memberInfo.id) {
					this.$refs.tips.show({
						msg: '请先选择会员',
						backgroundColor: '#FFA726',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					return
				}
				this.countedShow = true
			},
			countedSubmit(list) {
				if (list.length === 0) {
					return
				}
				const item = list[0]
				this.cashier.countedId = item.value
				this.cashier.countedName = item.label
				this.getCountedSkuList()
			},
			getCountedSkuList() {
				const params = {
					spuIds: this.memberInfo.spuIds
				}
				stockStore.stockSkuCountedList(params).then(res => {
					if (res.data.length <= 0) {
						this.countedSkuList = []
						return
					}
					this.countedSkuList = res.data.map(x => {
						return {
							label: x.skuName,
							value: x.skuId
						}
					})
				})
			},
			checkedCountedSku() {
				if (!this.memberInfo || !this.memberInfo.id) {
					this.$refs.tips.show({
						msg: '请先选择会员',
						backgroundColor: '#E83A30',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					return
				}
				if (!this.cashier.countedId) {
					this.$refs.tips.show({
						msg: '请先选择核销计次卡',
						backgroundColor: '#FFA726',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					return
				}
				this.countedSkuShow = true
			},
			countedSkuSubmit(list) {
				if (list.length === 0) {
					return
				}
				const item = list[0]
				this.cashier.skuId = item.value
				this.cashier.skuName = item.label
				if (!this.cashier.quantity) {
					this.cashier.quantity = 1
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
					`${time.year}-${time.month}-${time.day} ${item.hour}:${item.minute}:${item.second}`
			},
			cashierSubmit() {
				if (!this.memberInfo || !this.memberInfo.id) {
					this.$refs.tips.show({
						msg: '请先选择会员',
						backgroundColor: '#FFA726',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					return
				}
				if (!this.cashier.countedId) {
					this.$refs.tips.show({
						msg: '请先选择核销计次卡',
						backgroundColor: '#FFA726',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					return
				}
				if (!this.cashier.quantity) {
					this.$refs.tips.show({
						msg: '请先选择核销次数',
						backgroundColor: '#FFA726',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					return
				}
				const countedCashier = {
					category: 1,
					type: 2,
					source: 1,
					memberId: this.memberInfo.id,
					remark: this.cashier.remark,
					serviceAccountIds: this.cashier.serviceAccountIds,
					cashierTime: this.cashier.cashierTime,
					cards: [{
						skuId: this.cashier.skuId,
						skuName: this.cashier.skuName,
						quantity: this.cashier.quantity,
						timeCardId: this.cashier.countedId,
						referenceTimeCardTotal: 1
					}]
				}
				// 直接调用创建订单，支付
				this.orderCreate(countedCashier)
			},
			orderCreate(countedCashier) {
				// 创建订单
				this.payingOption = {
					icon: 'loading',
					content: '正在支付中'
				}
				this.payingShow = true
				cashierOrder.cashierOrderConfirm(countedCashier).then(res => {
					const orderId = res.data
					this.orderPay(orderId)
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
			orderPay(orderId) {
				// 订单支付
				const params = {
					id: orderId,
					payCode: 7,
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
				height: 80rpx;
			}

			.image-default-pic {
				width: 50rpx;
				height: 50rpx;
			}
		}
	}
</style>