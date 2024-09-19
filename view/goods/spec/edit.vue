<template>
	<view class="template-classify tn-safe-area-inset-bottom main-container tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar class="custom-nav" statusBar :border="false" :fixed="true" title="规格管理" leftIcon="left"
			leftText="返回" @clickLeft="goBack()">
		</uni-nav-bar>

		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="tn-classify__wrap">
			<view class="tn-classify__container tn-flex tn-flex-nowrap tn-flex-row-around">
				<scroll-view class="tn-classify__box tn-width-full" scroll-y :scroll-top="scrollViewTop"
					:style="{height: scrollViewHeight + 'px'}">
					<view class="tn-classify__content tn-padding-top-xs">
						<tn-list-cell @click="editSpec()" class="tn-flex tn-flex-row-between">
							<text>规格项：{{specInfo.name}}</text>
							<text v-if="specInfo.merchantNo===0" class="tn-color-grey">(系统预设)</text>
						</tn-list-cell>
						<tn-list-view class="tn-margin-top-xs" unlined="all" :customTitle="true">
							<view slot="title"
								class="list-title-container tn-flex tn-flex-col-center tn-flex-row-between tn-padding tn-text-lg tn-border-solid-bottom">
								<view>规格属性</view>
								<view class="tn-color-blue--dark tn-text-xl" @click="editSubSpec()">
									<text class="tn-icon-add-fill tn-margin-right-xs"></text>
									新增
								</view>
							</view>
							<view v-if="specSubList.length>0">
								<block v-for="(item, index) in specSubList" :key="index">
									<tn-list-cell :arrow="true" @click="editSubSpec(item)">{{item.name}}</tn-list-cell>
								</block>
							</view>
							<view v-else class="tn-padding-xl">
								<tn-empty mode="list" text="暂无子分类信息"></tn-empty>
							</view>
						</tn-list-view>
					</view>
				</scroll-view>
			</view>
			<tn-popup v-model="specPopupShow" mode="bottom" :safeAreaInsetBottom="true" :borderRadius="5"
				:closeBtn="true" closeBtnIcon="left" closeBtnPosition="top-left" :negativeTop="10" :marginTop="60"
				@open="specPopupOpen" @close="specPopupClose">
				<view
					class="tn-flex tn-flex-col-center tn-flex-row-center tn-flex-row-between tn-text-xl tn-border-solid-bottom"
					style="height: 90rpx; width: 100%; padding: 0 30rpx;">
					<view class="tn-text-bold">商品分类设置</view>
				</view>
				<scroll-view scroll-y="true">
					<view style="padding: 16px">
						<tn-tips ref="rechargeTips" position="top"></tn-tips>
						<tn-form :model="selectSpec" ref="selectSpecRef" :errorType="['message']" :labelWidth="180"
							labelAlign="right">
							<tn-form-item label="规格名：" prop="name" :required="true">
								<tn-input v-model="selectSpec.name" placeholder="规格名" />
							</tn-form-item>
						</tn-form>
					</view>
				</scroll-view>
				<view class="tn-padding tn-flex tn-flex-col-center tn-flex-row-between">
					<view v-if="selectSpec.id" class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
						<tn-button backgroundColor="tn-bg-red" fontColor="tn-color-red" style="width: 100%;"
							shape="round" :plain="true" :blockRepeatClick="true"
							@click="deleteSpecSubmit">删除</tn-button>
					</view>
					<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
						<tn-button backgroundColor="tn-bg-indigo" fontColor="tn-color-white" style="width: 100%;"
							shape="round" :blockRepeatClick="true" @click="editSpecSubmit">保存</tn-button>
					</view>
				</view>
			</tn-popup>
		</view>
	</view>
</template>

<script>
	import stockStore from '@/api/stock/stockStore.js'
	import spec from '../../../api/goods/spec'
	import mixin from '../../../common/mixin'
	export default {
		name: 'specEdit',
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
				scrollViewTop: 0,
				// scrollView的高度
				scrollViewHeight: 0,
				specSubList: [],
				specInfo: {},
				selectSpec: {},
				specPopupShow: false,
				rules: {
					name: [{
						validator: (rule, value, callback) => {
							if (value) {
								return true
							}
							return false
						},
						message: '请输入规格名',
						trigger: ['change', 'blur'],
					}]
				}
			}
		},
		onLoad(options) {
			if (options && options.id) {
				this.specInfo = {
					id: options.id,
					name: options.name
				}
			} else {
				this.specPopupShow = true
			}
		},
		onShow() {
			if (this.specInfo.id) {
				this.getSpecInfo()
				this.getSpecSubList()
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.getScrollViewInfo()
			})
		},
		methods: {
			async getScrollViewInfo() {
				const customNavbar = await mixin.methods.getRect(this, '.custom-nav')
				const systemInfo = uni.getSystemInfoSync()
				this.customNavbarHeight = customNavbar.height
				this.scrollViewTop = systemInfo.statusBarHeight
				this.scrollViewHeight = systemInfo.windowHeight - customNavbar.height
			},
			getSpecInfo() {
				spec.specInfo(this.specInfo.id).then(res => {
					this.specInfo.name = res.data.name
					this.specInfo.merchantNo = res.data.merchantNo
				})
			},
			getSpecSubList() {
				const params = {
					level: 2,
					pid: this.specInfo.id
				}
				spec.specList(params).then(res => {
					this.specSubList = res.data || []
				})
			},
			editSpec() {
				if (this.specInfo.merchantNo === 0) {
					return
				}
				this.selectSpec = {
					pid: '',
					id: this.specInfo?.id || '',
					name: this.specInfo?.name || ''
				}
				this.specPopupShow = true
			},
			editSubSpec(item) {
				this.selectSpec = {
					pid: this.specInfo.id,
					id: item?.id || '',
					name: item?.name || ''
				}
				this.specPopupShow = true
			},
			specPopupOpen() {
				this.$refs.selectSpecRef.setRules(this.rules)
			},
			specPopupClose() {
				this.selectSpec = {}
				if (!this.specInfo.id) {
					mixin.methods.goBack(false)
				}
			},
			editSpecSubmit() {
				this.$refs.selectSpecRef.validate(valid => {
					if (valid) {
						if (this.selectSpec.id) {
							this.edit()
						} else {
							this.save()
						}
					}
				})
			},
			deleteSpecSubmit() {
				spec.specDelete(this.selectSpec.id).then(() => {
					this.$refs.tips.show({
						msg: '已删除',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					this.specPopupShow = false
					if (!this.selectSpec.pid) {
						mixin.methods.goBack(true)
					} else {
						this.getSpecInfo()
						this.getSpecSubList()
					}
				})
			},
			save() {
				spec.specCreate(this.selectSpec).then(res => {
					this.$refs.tips.show({
						msg: '添加成功',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					this.specPopupShow = false
					if (!this.selectSpec.pid) {
						this.specInfo = {
							id: res.data.id,
							name: res.data.name
						}
					} else {
						this.getSpecInfo()
						this.getSpecSubList()
					}
				})
			},
			edit() {
				spec.specEdit(this.selectSpec.id, this.selectSpec).then(() => {
					this.$refs.tips.show({
						msg: '修改成功',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					this.specPopupShow = false
					if (!this.selectSpec.pid) {
						this.specInfo = {
							id: this.selectSpec.id,
							name: this.selectSpec.name
						}
					} else {
						this.getSpecInfo()
						this.getSpecSubList()
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tn-classify {
		&--wrap {
			position: fixed;
			left: 0;
			right: 0;
			width: 100%;
			background-color: inherit;
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
</style>