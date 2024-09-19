<template>
	<view class="template-product main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<uni-nav-bar statusBar class="custom-nav" :fixed="true" :border="false" title="编辑会员" left-icon="left"
			left-text="返回" @clickLeft="goBack()">
		</uni-nav-bar>

		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="member--wrap">
			<view class="tn-classify__container tn-margin-top-xs">
				<scroll-view class="tn-radius" :scroll-top="scrollViewBasicTop" scroll-y scroll-with-animation
					:style="{height: scrollViewHeight + 'px'}">
					<tn-form :model="memberInfo" ref="memberInfoRef" :labelWidth="100" :errorType="['message']">
						<view class="tn-padding-left tn-padding-right tn-bg-white">
							<tn-form-item label="头像: " prop="headPath">
								<tn-image-upload :action="pictureAction" :formData="pictureFormDate" :maxCount="1"
									:fileList="pictureList" @on-success="fileUploadSuccess"
									@on-remove="fileRemove"></tn-image-upload>
							</tn-form-item>
							<tn-form-item label="姓名: " prop="name" :required="true">
								<tn-input type="text" v-model="memberInfo.name" />
							</tn-form-item>
							<tn-form-item label="电话: " prop="phone" :required="true">
								<tn-input type="text" v-model="memberInfo.phone" />
							</tn-form-item>
						</view>
						<view class="tn-padding-left tn-padding-right tn-margin-top-xs tn-bg-white">
							<tn-form-item label="性别: " prop="sex">
								<tn-input type="select" v-model="memberInfo.sexName" @click="sexActionshow=true" />
								<tn-select v-model="sexActionshow" mode="single" :searchShow="false" :list="sexList"
									@confirm="sexActionConfirm"></tn-select>
							</tn-form-item>
							<tn-form-item label="生日: " prop="birthDay">
								<tn-input v-model="memberInfo.birthDay" type="select" @click="birthdayShow=true" />
								<tn-picker mode="time" v-model="birthdayShow" :params="birthdayParams"
									:defaultTime="memberInfo.birthDay" @confirm="checkedBirthdayTime"></tn-picker>
							</tn-form-item>
							<tn-form-item label="地址: " prop="address">
								<tn-input type="text" v-model="memberInfo.address" />
							</tn-form-item>
							<tn-form-item label="备注: " prop="remark">
								<tn-input type="text" v-model="memberInfo.remark" />
							</tn-form-item>
						</view>
					</tn-form>

				</scroll-view>
			</view>
		</view>
		<view class="footerfixed tabbar tn-flex tn-flex-col-center tn-flex-row-between">
			<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
				<tn-button backgroundColor="tn-bg-blue--dark" fontColor="tn-color-white" style="width: 100%;"
					:shadow="true" shape="round" :blockRepeatClick="true" @click="editSubmit">保存</tn-button>
			</view>
		</view>
	</view>
</template>

<script>
	import upload from '../../api/biz/upload'
	import spu from '../../api/goods/spu'
	import member from '../../api/member/member'
	import config from '../../common/config'
	import mixin from '../../common/mixin'
	import test from '../../uni_modules/tuniao-ui/libs/function/test'
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
				pictureAction: config.pictureAction,
				pictureFormDate: {},
				pictureList: [],
				sexList: [{
						value: 1,
						label: '男'
					},
					{
						value: 2,
						label: '女'
					}
				],
				sexActionshow: false,
				birthdayShow: false,
				birthdayParams: {
					year: true,
					month: true,
					day: true
				},
				tagList: [{
						color: 'red',
						title: "酷炫",
					},
					{
						color: 'cyan',
						title: "设计",
					},
					{
						color: 'blue',
						title: "图鸟",
					},
					{
						color: 'green',
						title: "互联网",
					},
					{
						color: 'orange',
						title: "免费",
					},
					{
						color: 'purplered',
						title: "配色",
					},
					{
						color: 'purple',
						title: "软件开发",
					},
					{
						color: 'brown',
						title: "插画",
					},
					{
						color: 'yellowgreen',
						title: "C4D",
					},
					{
						color: 'grey',
						title: "海报",
					}
				],
				rules: {
					name: [{
						validator: (rule, value, callback) => {
							if (value) {
								return true
							}
							return false
						},
						message: '请输入姓名',
						trigger: ['change', 'blur'],
					}],
					phone: [{
							validator: (rule, value, callback) => {
								if (value) {
									return true
								}
								return false
							},
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								if (test.mobile(value)) {
									return true
								}
								return false
							},
							message: '请输入正确的手机号',
							trigger: ['change', 'blur'],
						}
					]
				}
			}
		},
		onReady() {
			this.$refs.memberInfoRef.setRules(this.rules)
		},
		onLoad(option) {
			this.id = option.id
			if (this.id) {
				this.getMemberInfo()
			}
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
				this.scrollViewBasicTop = systemInfo.statusBarHeight
				this.scrollViewHeight = systemInfo.windowHeight - customNavbar.height -
					footerFixed.height - uni.upx2px(20)
			},
			getUploadAuth() {
				upload.merchantUploadFile(1).then(res => {
					this.pictureFormDate = res.data
				})
			},
			fileUploadSuccess(data) {
				this.memberInfo.headPath = data.url
			},
			fileRemove(err, index, lists, name) {
				this.memberInfo.headPath = ''
			},
			getMemberInfo() {
				member.memberInfo(this.id).then(res => {
					this.memberInfo = res.data
					if (!this.memberInfo.sexName) {
						const sexItem = this.sexList[0]
						this.memberInfo.sex = sexItem.value
						this.memberInfo.sexName = sexItem.label
					}
					if (this.memberInfo.headPath) {
						const picture = {
							url: config.pictureUrl + this.memberInfo.headPath
						}
						this.pictureList = [picture]
					}
				})
			},
			sexActionConfirm(list) {
				if (list) {
					const item = list[0]
					this.memberInfo.sexName = item.label
					this.memberInfo.sex = item.value
				}
			},
			checkedBirthdayTime(time) {
				this.memberInfo.birthDay =
					`${time.year}-${time.month}-${time.day}`
			},
			editSubmit() {
				this.$refs.memberInfoRef.validate(valid => {
					if (valid) {
						member.memberEdit(this.id, this.memberInfo).then(res => {
							this.$refs.tips.show({
								msg: '修改成功',
								backgroundColor: '#3D7EFF',
								fontColor: '#FFFFFF',
								duration: 1500
							})
							setTimeout(function() {
								mixin.methods.goBack(true)
							}, 1500)
						})
					} else {
						this.$refs.tips.show({
							msg: '输入信息错误',
							backgroundColor: '#FFA726',
							fontColor: '#FFFFFF',
							duration: 1500
						})
						return;
					}
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
		}
	}
</style>