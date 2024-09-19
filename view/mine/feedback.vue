<template>
	<view class="main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar statusBar class="custom-nav" :fixed="true" :border="false" title="问题反馈" left-icon="left"
			left-text="返回" @clickLeft="goBack()">
		</uni-nav-bar>
		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="tn-margin-top-xs">
			<scroll-view class="tn-store tn-bg-white tn-padding-left tn-padding-right" scroll-y
				:style="{height: scrollViewHeight + 'px'}">
				<tn-form :model="feedbackInfo" ref="feedbackInfoRef" :errorType="['message']" :labelWidth="180"
					labelAlign="right">
					<tn-form-item label="问题类型：" prop="type" required>
						<tn-input v-model="feedbackInfo.typeName" type="select" placeholder="请选择问题类型"
							@click='typeActionshow=true' />
						<tn-select v-model="typeActionshow" mode="multi-auto" :searchShow="false" :list="typeList"
							@confirm="typeActionConfirm"></tn-select>
					</tn-form-item>
					<tn-form-item label="反馈内容：" prop="content" required>
						<tn-input v-model="feedbackInfo.content" placeholder="请输入反馈内容" />
					</tn-form-item>
					<tn-form-item label="相关照片：">
						<tn-image-upload :action="pictureAction" :formData="pictureFormDate" :maxCount="10"
							:fileList="pictureList"></tn-image-upload>
					</tn-form-item>
				</tn-form>
			</scroll-view>
		</view>
		<view class="footerfixed tabbar">
			<view class="tn-flex tn-flex-row-between tn-flex-col-center tn-margin-top tn-padding-left tn-padding-right">
				<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
					<tn-button backgroundColor="tn-bg-blue" fontColor="tn-color-white" style="width: 100%;"
						shape="round" :blockRepeatClick="true" @click="feedbackSubmit">提交</tn-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import upload from '../../api/biz/upload'
	import cashierOrder from '../../api/cashier/cashierOrder'
	import feedback from '../../api/feedback/feedback'
	import region from '../../api/merchant/region'
	import store from '../../api/merchant/store'
	import role from '../../api/security/role'
	import staff from '../../api/security/staff'
	import config from '../../common/config'
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
				typeActionshow: false,
				typeList: [{
						value: 1,
						label: '质量问题'
					},
					{
						value: 2,
						label: '数据问题'
					},
					{
						value: 3,
						label: '使用方法'
					},
					{
						value: 4,
						label: '意见建议'
					},
					{
						value: 5,
						label: '其他'
					}
				],
				pictureAction: config.pictureAction,
				pictureFormDate: {},
				pictureList: [],
				feedbackInfo: {},
				rules: {
					type: [{
						validator: (rule, value, callback) => {
							if (value) {
								return true
							}
							return false
						},
						message: '请选择问题类型',
						trigger: ['change', 'blur'],
					}],
					content: [{
						validator: (rule, value, callback) => {
							if (value) {
								return true
							}
							return false
						},
						message: '请输入反馈内容',
						trigger: ['change', 'blur'],
					}]
				}
			}
		},
		onReady() {
			this.$refs.feedbackInfoRef.setRules(this.rules)
		},
		mounted() {
			this.getUploadAuth()
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
			getUploadAuth() {
				upload.merchantUploadFile(2).then(res => {
					this.pictureFormDate = res.data
				})
			},
			typeActionConfirm(list) {
				if (list.length > 0) {
					const item = list[0]
					this.feedbackInfo.type = item.value
					this.feedbackInfo.typeName = item.label
				}
			},
			feedbackSubmit() {
				this.$refs.feedbackInfoRef.validate(valid => {
					if (valid) {
						feedback.feedbackCreate(this.feedbackInfo).then(res => {
							this.$refs.tips.show({
								msg: '问题反馈成功，我们会尽快处理',
								backgroundColor: '#3D7EFF',
								fontColor: '#FFFFFF',
								duration: 1500
							})
							setTimeout(() => {
								mixin.methods.goBack(false)
							}, 3000)
						})
					} else {
						this.$refs.tips.show({
							msg: '反馈信息填写不完整',
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