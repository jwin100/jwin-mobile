<template>
	<view class="main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar class="custom-nav" statusBar :fixed="true" :border="false" title="采购" left-icon="left"
			left-text="返回" @clickLeft="goBack()">
		</uni-nav-bar>
		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="tn-margin-top-xs">
			<scroll-view class="tn-store tn-bg-white tn-padding-left tn-padding-right" scroll-y
				:style="{height: scrollViewHeight + 'px'}">
				<tn-form :model="purchaseInfo" ref="purchaseInfoRef" :errorType="['message']" :labelWidth="220"
					labelAlign="right">
					<tn-form-item label="采购门店：" prop="storeName" required>
						<tn-input v-model="purchaseInfo.storeName" :disabled="true" placeholder="采购门店" />
					</tn-form-item>
					<tn-form-item label="预计送达日期：" prop="storePhone">
						<tn-input v-model="purchaseInfo.deliveryTime" placeholder="预计送达日期"
							@click="purchaseTimeShow=true" />
						<tn-picker mode="time" v-model="purchaseTimeShow" :params="purchaseTimeParams"
							:defaultTime="purchaseInfo.deliveryTime" @confirm="checkedPurchaseTime"></tn-picker>
					</tn-form-item>
					<tn-form-item label="备注：" prop="remark">
						<tn-input v-model="purchaseInfo.remark" placeholder="备注信息" />
					</tn-form-item>
				</tn-form>
				<view class="tn-margin-top-xs">
					<view class="tn-padding tn-flex tn-flex-col-center tn-flex-row-between tn-border-solid-bottom">
						<view class="justify-content-item tn-text-xl">
							商品信息
						</view>
						<view class="justify-content-item tn-color-grey" @click="addSkus">
							<text class="tn-padding-xs">选择商品</text>
							<text class="tn-icon-add-circle"></text>
						</view>
					</view>
					<tn-list-view class="tn-padding-top">
						<tn-list-cell class="specs-cell" v-for="(item, index) in purchaseInfo.skus" :key="index">
							<view class="tn-texteditSpec-ellipsis" style="font-size: 34rpx;">
								{{item.skuName}}
							</view>
							<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-top tn-color-gray">
								<view>剩余库存：{{item.sellStock}}/{{item.unitName}}</view>
								<view>采购单价：{{item.purchaseAmount}}</view>
								<view>采购数量：{{item.quantity}}</view>
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
						shape="round" :blockRepeatClick="true" @click="purchaseSubmit">保存</tn-button>
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
				customNavbarHeight: 0,
				scrollViewTop: 0,
				scrollViewHeight: 0,
				purchaseInfo: {},
				storeInfo: {},
				purchaseTimeShow: false,
				purchaseTimeParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
				rules: {
					storeName: [{
						validator: (rule, value, callback) => {
							if (value) {
								return true
							}
							return false
						},
						message: '请输入门店名称',
						trigger: ['change', 'blur'],
					}],
					accountId: [{
						validator: (rule, value, callback) => {
							if (value) {
								return true
							}
							return false
						},
						message: '请选择负责人',
						trigger: ['change', 'blur'],
					}]
				}
			}
		},
		onReady() {
			this.$refs.purchaseInfoRef.setRules(this.rules)
		},
		mounted() {
			this.init()
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
			init() {
				this.storeInfo = this.vuexMerchantStoreInfo
				this.purchaseInfo.storeNo = this.storeInfo.storeNo
				this.purchaseInfo.storeName = this.storeInfo.storeName
				this.purchaseInfo.deliveryTime = formatDateTime(new Date())
			},
			checkedPurchaseTime(time) {
				this.purchaseInfo.deliveryTime =
					`${time.year}-${time.month}-${time.day} ${time.hour}:${time.minute}:${time.second}`
			},
			addSkus() {
				uni.navigateTo({
					url: `/view/stock/selectSku?skus=${this.purchaseInfo.skus}`
				})
			},
			refresh() {
				const skus = uni.getStorageSync('selectSkus')
				this.$set(this.purchaseInfo, 'skus', JSON.parse(skus))
				uni.removeStorageSync('selectSkus')

			},
			purchaseSubmit() {
				const skus = this.purchaseInfo.skus.map(x => {
					return {
						spuId: x.spuId,
						skuId: x.skuId,
						purchaseQuantity: x.quantity,
						purchaseAmount: x.purchaseAmount
					}
				})
				const purchase = {
					storeNo: this.purchaseInfo.storeNo,
					deliveryTime: this.purchaseInfo.deliveryTime,
					remark: this.purchaseInfo.remark,
					skus: skus
				}

				this.$refs.purchaseInfoRef.validate(valid => {
					if (valid) {
						stockPurchase.purchaseOrderCreate(purchase).then(res => {
							this.$refs.tips.show({
								msg: '添加成功',
								backgroundColor: '#3D7EFF',
								fontColor: '#FFFFFF',
								duration: 1500
							})
							setTimeout(() => {
								mixin.methods.goBack(true)
							}, 1500)
						})
					} else {
						this.$refs.tips.show({
							msg: '采购信息填写不完整',
							backgroundColor: '#FFA726',
							fontColor: '#FFFFFF',
							duration: 1500
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>