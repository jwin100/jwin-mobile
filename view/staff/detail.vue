<template>
	<view class="main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar statusBar class="custom-nav" :fixed="true" :border="false" title="店员信息" left-icon="left"
			left-text="返回" @clickLeft="goBack(backRefresh)">
			<!-- <block slot="right">
				<view class="custom-nav__item">
					<tn-button fontColor="tn-color-white" backgroundColor="tn-bg-blue--dark" height="auto"
						padding="16rpx 18rpx" size="sm" @click="tnEdit">编辑</tn-button>
				</view>
			</block> -->
		</uni-nav-bar>
		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="tn-margin-top-xs">
			<scroll-view class="tn-store tn-bg-white" scroll-y :style="{height: scrollViewHeight + 'px'}">
				<tn-list-view :card="true" unlined="all">
					<tn-list-cell>
						<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
							<view>姓名</view>
							<view class="tn-color-gray--dark">
								{{staffInfo.name}}
							</view>
						</view>
					</tn-list-cell>
					<tn-list-cell>
						<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
							<view>手机号</view>
							<view class="tn-color-gray--dark">
								{{staffInfo.phone}}
							</view>
						</view>
					</tn-list-cell>
					<tn-list-cell>
						<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
							<view>所属门店</view>
							<view class="tn-color-gray--dark">
								{{staffInfo.storeName}}({{staffInfo.storeNo}})
							</view>
						</view>
					</tn-list-cell>
					<tn-list-cell>
						<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
							<view>权限</view>
							<view class="tn-color-gray--dark">
								{{staffInfo.role ? staffInfo.role.name : ''}}
							</view>
						</view>
					</tn-list-cell>
					<tn-list-cell>
						<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
							<view>添加日期</view>
							<view class="tn-color-gray--dark">
								{{staffInfo.createTime}}
							</view>
						</view>
					</tn-list-cell>
					<tn-list-cell>
						<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center">
							<view>店员状态</view>
							<view class="tn-color-gray--dark">
								{{staffInfo.statusName}}
							</view>
						</view>
					</tn-list-cell>
				</tn-list-view>
			</scroll-view>
		</view>
		<tn-modal v-model="deleteConfirmShow" :title="deleteConfirmTitle" :content="deleteConfirmContent"
			:button="deleteConfirmBtn" @click="deleteStaff"></tn-modal>
		<view class="footerfixed tabbar">
			<view class="tn-flex tn-flex-row-between tn-flex-col-center tn-margin-top tn-padding-left tn-padding-right">
				<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
					<tn-button fontColor="tn-color-red" backgroundColor="tn-bg-red" :plain="true" style="width: 100%;"
						:blockRepeatClick="true" @click="deleteConfirmShow=true">删除</tn-button>
				</view>
				<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
					<tn-button v-if="staffInfo.status===2" backgroundColor="tn-bg-blue--dark" fontColor="tn-color-white"
						style="width: 100%;" :blockRepeatClick="true" @click.native.stop="enableStatus()">
						启用
					</tn-button>
					<tn-button v-if="staffInfo.status===1" backgroundColor="tn-bg-red" fontColor="tn-color-white"
						style="width: 100%;" :blockRepeatClick="true" @click.native.stop="disableStatus()">
						禁用
					</tn-button>
				</view>
			</view>
		</view>
		<view class="edit tnxuanfu" @tap="tnEdit()">
			<view
				class="icon12__item--icon tn-shadow-blur tn-flex tn-flex-row-center tn-flex-col-center tn-main-gradient-blue--light tn-color-blue--dark">
				<view class="tn-icon-edit">
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import cashierOrder from '../../api/cashier/cashierOrder'
	import store from '../../api/merchant/store'
	import staff from '../../api/security/staff'
	import {
		CommonStatus
	} from '../../common/enums/commonStatus'
	import mixin from '../../common/mixin'

	export default {
		name: 'staffDetail',
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
				staffInfo: {},
				deleteConfirmShow: false,
				deleteConfirmTitle: '删除确认',
				deleteConfirmContent: '确认删除此店员吗，删除后店员相关信息将消失',
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
			refresh() {
				this.backRefresh = true
				this.getStaffInfo()
			},
			getStaffInfo() {
				staff.accountInfo(this.id).then(res => {
					this.staffInfo = res.data
				})
			},
			deleteStaff(item) {
				if (item.index === 0) {
					this.deleteConfirmShow = false
					return
				}
				staff.accountDelete(this.id).then(() => {
					this.$refs.tips.show({
						msg: '店员信息填写不完整',
						backgroundColor: '#E83A30',
						fontColor: '#3D7EFF',
						duration: 1500
					})
					setTimeout(function() {
						mixin.methods.goBack(true)
					}, 1500)
				})
			},
			enableStatus() {
				staff.accountEditStatus(this.id, CommonStatus.enable).then(res => {
					this.$refs.tips.show({
						msg: '已启用',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					this.getStaffInfo()
				})
			},
			disableStatus() {
				staff.accountEditStatus(this.id, CommonStatus.disable).then(res => {
					this.$refs.tips.show({
						msg: '已禁用',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					this.getStaffInfo()
				})
			},
			tnEdit() {
				uni.navigateTo({
					url: `/view/staff/edit?id=${this.id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>