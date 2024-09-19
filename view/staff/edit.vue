<template>
	<view class="main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar statusBar class="custom-nav" :fixed="true" :border="false" title="修改店员" left-icon="left"
			left-text="返回" @clickLeft="goBack()">
		</uni-nav-bar>
		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="tn-margin-top-xs">
			<scroll-view class="tn-store tn-bg-white tn-padding-left tn-padding-right" scroll-y
				:style="{height: scrollViewHeight + 'px'}">
				<tn-form :model="staffInfo" ref="staffInfoRef" :errorType="['message']" :labelWidth="180"
					labelAlign="right">
					<tn-form-item label="姓名：" prop="name" required>
						<tn-input v-model="staffInfo.name" placeholder="请输入姓名" />
					</tn-form-item>
					<tn-form-item label="手机号：" prop="phone" required>
						<tn-input v-model="staffInfo.phone" placeholder="请输入手机号" />
					</tn-form-item>
					<tn-form-item label="所属门店：" prop="storeNo" required>
						<tn-input type="select" v-model="staffInfo.storeName" placeholder="选择门店"
							@click="storeActionshow=true" />
						<tn-select v-model="storeActionshow" mode="multi-auto" :searchShow="false" :list="storeList"
							@confirm="storeActionConfirm"></tn-select>
					</tn-form-item>
					<tn-form-item label="权限：" prop="roleId" required>
						<tn-input type="select" v-model="staffInfo.roleName" placeholder="选择权限"
							@click="roleActionshow=true" />
						<tn-select v-model="roleActionshow" mode="multi-auto" :searchShow="false" :list="roleList"
							@confirm="roleActionConfirm"></tn-select>
					</tn-form-item>
				</tn-form>
			</scroll-view>
		</view>
		<view class="footerfixed tabbar">
			<view class="tn-flex tn-flex-row-between tn-flex-col-center tn-margin-top tn-padding-left tn-padding-right">
				<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
					<tn-button backgroundColor="tn-bg-blue" fontColor="tn-color-white" style="width: 100%;"
						shape="round" :blockRepeatClick="true" @click="staffSubmit">保存</tn-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import cashierOrder from '../../api/cashier/cashierOrder'
	import region from '../../api/merchant/region'
	import store from '../../api/merchant/store'
	import role from '../../api/security/role'
	import staff from '../../api/security/staff'
	import {
		CommonStatus
	} from '../../common/enums/commonStatus'
	import mixin from '../../common/mixin'

	export default {
		name: 'staffAdd',
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
				staffInfo: {},
				storeList: [],
				roleList: [],
				storeActionshow: false,
				roleActionshow: false,
				rules: {
					name: [{
						validator: (rule, value, callback) => {
							if (value) {
								return true
							}
							return false
						},
						message: '请输入店员姓名',
						trigger: ['change', 'blur'],
					}],
					phone: [{
						validator: (rule, value, callback) => {
							if (value) {
								return true
							}
							return false
						},
						message: '请输入店员手机号',
						trigger: ['change', 'blur'],
					}],
					storeNo: [{
						validator: (rule, value, callback) => {
							if (value) {
								return true
							}
							return false
						},
						message: '请选择所属门店',
						trigger: ['change', 'blur'],
					}],
					roleId: [{
						validator: (rule, value, callback) => {
							if (value) {
								return true
							}
							return false
						},
						message: '请选择权限',
						trigger: ['change', 'blur'],
					}]
				}
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		onReady() {
			this.$refs.staffInfoRef.setRules(this.rules)
		},
		mounted() {
			this.getStoreList()
			this.getRoleList()
			this.getStaffInfo()
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
			getStaffInfo() {
				staff.accountInfo(this.id).then(res => {
					this.staffInfo = res.data
					if (this.staffInfo) {
						this.staffInfo.roleName = this.staffInfo.role?.name || ''
					}
				})
			},
			getStoreList() {
				store.storeList().then(res => {
					this.storeList = res.data.map(x => {
						return {
							value: x.storeNo,
							label: x.storeName
						}
					})
				})
			},
			getRoleList() {
				role.roleList().then(res => {
					this.roleList = res.data.map(x => {
						return {
							value: x.id,
							label: x.name
						}
					})
				})
			},
			storeActionConfirm(list) {
				if (list.length > 0) {
					const item = list[0]
					this.staffInfo.storeNo = item.value
					this.staffInfo.storeName = item.label
				}
			},
			roleActionConfirm(list) {
				if (list.length > 0) {
					const item = list[0]
					this.staffInfo.roleId = item.value
					this.staffInfo.roleName = item.label
				}
			},
			staffSubmit() {
				this.$refs.staffInfoRef.validate(valid => {
					if (valid) {
						staff.accountEdit(this.id, this.staffInfo).then(res => {
							this.$refs.tips.show({
								msg: '修改成功',
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
							msg: '店员信息填写不完整',
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