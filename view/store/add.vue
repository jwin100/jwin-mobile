<template>
	<view class="main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar class="custom-nav" statusBar :fixed="true" :border="false" title="新增门店" left-icon="left"
			left-text="返回" @clickLeft="goBack()">
		</uni-nav-bar>
		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="tn-margin-top-xs">
			<scroll-view class="tn-store tn-bg-white tn-padding-left tn-padding-right" scroll-y
				:style="{height: scrollViewHeight + 'px'}">
				<tn-form :model="storeInfo" ref="storeInfoRef" :errorType="['message']" :labelWidth="180"
					labelAlign="right">
					<tn-form-item label="门店名称：" prop="storeName" required>
						<tn-input v-model="storeInfo.storeName" placeholder="请输入门店名称" />
					</tn-form-item>
					<tn-form-item label="门店电话：" prop="storePhone">
						<tn-input v-model="storeInfo.storePhone" placeholder="请输入门店电话" />
					</tn-form-item>
					<tn-form-item label="负责人：" prop="accountId" required>
						<tn-input type="select" v-model="storeInfo.accountName" placeholder="选择负责人"
							@click="accountActionshow=true" />
						<tn-select v-model="accountActionshow" mode="multi-auto" :searchShow="false" :list="accountList"
							@confirm="accountActionConfirm"></tn-select>
					</tn-form-item>
					<tn-form-item label="门店地址：" prop="regions">
						<tn-input type="select" v-model="storeInfo.regionName" placeholder="选择门店地址"
							@click="regionActionshow=true" />
						<tn-picker mode="region" v-model="regionActionshow" @confirm="regionActionConfirm"></tn-picker>
					</tn-form-item>
					<tn-form-item label="详细地址：" prop="address">
						<tn-input v-model="storeInfo.address" placeholder="输入详细地址" />
					</tn-form-item>
				</tn-form>
			</scroll-view>
		</view>
		<view class="footerfixed tabbar">
			<view class="tn-flex tn-flex-row-between tn-flex-col-center tn-margin-top tn-padding-left tn-padding-right">
				<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
					<tn-button backgroundColor="tn-bg-blue" fontColor="tn-color-white" style="width: 100%;"
						shape="round" :blockRepeatClick="true" @click="storeSubmit">保存</tn-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import cashierOrder from '../../api/cashier/cashierOrder'
	import region from '../../api/merchant/region'
	import store from '../../api/merchant/store'
	import staff from '../../api/security/staff'
	import {
		CommonStatus
	} from '../../common/enums/commonStatus'
	import mixin from '../../common/mixin'

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
				storeInfo: {},
				accountList: [],
				regionList: [],
				accountActionshow: false,
				regionActionshow: false,
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
			this.$refs.storeInfoRef.setRules(this.rules)
		},
		mounted() {
			this.getAccountList()
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
			getAccountList() {
				staff.accountAllList().then(res => {
					this.accountList = res.data.map(x => {
						return {
							value: x.id,
							label: x.name
						}
					})
				})
			},
			getRegionList() {
				region.regionList().then(res => {
					this.regionList = res.data
				})
			},
			accountActionConfirm(list) {
				if (list.length > 0) {
					const item = list[0]
					this.storeInfo.accountId = item.value
					this.storeInfo.accountName = item.label
				}
			},
			regionActionConfirm(region) {
				const province = region.province
				const city = region.city
				const area = region.area
				if (province && city && area) {
					this.storeInfo.regionName = `${province.label} - ${city.label} - ${area.label} `
					this.storeInfo.province = province.value
					this.storeInfo.city = city.value
					this.storeInfo.area = area.value
				}
			},
			storeSubmit() {
				this.$refs.storeInfoRef.validate(valid => {
					if (valid) {
						store.storeCreate(this.storeInfo).then(res => {
							this.$refs.tips.show({
								msg: '添加成功',
								backgroundColor: '#3D7EFF',
								fontColor: '#FFFFFF',
								duration: 1500
							})
							setTimeout(() => {
								mixin.methods.goBack(true)
							}, 3000)
						})
					} else {
						this.$refs.tips.show({
							msg: '门店信息填写不完整',
							backgroundColor: '#FFA726',
							fontColor: '#FFFFFF',
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>