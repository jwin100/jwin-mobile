<template>
	<view class="template-classify tn-safe-area-inset-bottom main-container tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar class="custom-nav" statusBar :border="false" :fixed="true" title="分类管理" leftIcon="left" leftText="返回"
			@clickLeft="goBack(isBackRefresh)">
		</uni-nav-bar>

		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="tn-classify__wrap">
			<view class="tn-classify__container tn-flex tn-flex-nowrap tn-flex-row-around">
				<scroll-view class="tn-classify__box tn-width-full" scroll-y :scroll-top="scrollViewTop"
					:style="{height: scrollViewHeight + 'px'}">
					<view class="tn-classify__content tn-padding-top-xs">
						<tn-list-cell :arrow="true" @click="editCategory()">一级分类：{{categoryInfo.name}}</tn-list-cell>
						<tn-list-view class="tn-margin-top-xs" unlined="all" :customTitle="true">
							<view slot="title"
								class="list-title-container tn-flex tn-flex-col-center tn-flex-row-between tn-padding tn-text-lg tn-border-solid-bottom">
								<view>子分类</view>
								<view class="tn-color-blue--dark tn-text-xl" @click="editSubCategory()">
									<text class="tn-icon-add-fill tn-margin-right-xs"></text>
									新增
								</view>
							</view>
							<view v-if="categorySubList.length>0">
								<block v-for="(item, index) in categorySubList" :key="index">
									<tn-list-cell :arrow="true"
										@click="editSubCategory(item)">{{item.name}}</tn-list-cell>
								</block>
							</view>
							<view v-else class="tn-padding-xl">
								<tn-empty mode="list" text="暂无子分类信息"></tn-empty>
							</view>
						</tn-list-view>
					</view>
				</scroll-view>
			</view>
			<tn-popup v-model="categoryPopupShow" mode="bottom" :safeAreaInsetBottom="true" :borderRadius="5"
				:closeBtn="true" closeBtnIcon="left" closeBtnPosition="top-left" :negativeTop="10" :marginTop="60"
				@open="categoryPopupOpen" @close="categoryPopupClose">
				<view
					class="tn-flex tn-flex-col-center tn-flex-row-center tn-flex-row-between tn-text-xl tn-border-solid-bottom"
					style="height: 90rpx; width: 100%; padding: 0 30rpx;">
					<view class="tn-text-bold">商品分类设置</view>
				</view>
				<scroll-view scroll-y="true">
					<view style="padding: 16px">
						<tn-tips ref="rechargeTips" position="top"></tn-tips>
						<tn-form :model="selectCategory" ref="selectCategoryRef" :errorType="['message']"
							:labelWidth="180" labelAlign="right">
							<tn-form-item label="分类名：" prop="name" :required="true">
								<tn-input v-model="selectCategory.name" placeholder="分类名" />
							</tn-form-item>
						</tn-form>
					</view>
				</scroll-view>
				<view class="tn-padding tn-flex tn-flex-col-center tn-flex-row-between">
					<view v-if="selectCategory.id" class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
						<tn-button backgroundColor="tn-bg-red" fontColor="tn-color-red" style="width: 100%;"
							shape="round" :plain="true" :blockRepeatClick="true"
							@click="deleteCategorySubmit(selectCategory)">删除</tn-button>
					</view>
					<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
						<tn-button backgroundColor="tn-bg-blue" fontColor="tn-color-white" style="width: 100%;"
							shape="round" :blockRepeatClick="true" @click="editCategorySubmit">保存</tn-button>
					</view>
				</view>
			</tn-popup>
		</view>
	</view>
</template>

<script>
	import category from '@/api/goods/category.js'
	import stockStore from '@/api/stock/stockStore.js'
	import mixin from '../../../common/mixin'
	export default {
		name: 'categoryEdit',
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
				categorySubList: [],
				categoryInfo: {name:''},
				selectCategory: {},
				categoryPopupShow: false,
				rules: {
					name: [{
						validator: (rule, value, callback) => {
							if (value) {
								return true
							}
							return false
						},
						message: '请输入分类名',
						trigger: ['change', 'blur'],
					}]
				},
				isBackRefresh:false
			}
		},
		onLoad(options) {
			if (options && options.id) {
				this.categoryInfo = {
					id: options.id,
					name: options.name
				}
			} else {
				this.categoryPopupShow = true
			}
		},
		onShow() {
			if (this.categoryInfo.id) {
				this.getCategoryInfo()
				this.getCategorySubList()
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
				const customNavbar = await mixin.methods.getRect(this, '.custom-nav')
				const systemInfo = uni.getSystemInfoSync()
				this.customNavbarHeight = customNavbar.height
				this.scrollViewBasicTop = systemInfo.statusBarHeight
				this.scrollViewHeight = systemInfo.windowHeight - customNavbar.height
			},
			getCategoryInfo() {
				category.categoryInfo(this.categoryInfo.id).then(res => {
					this.categoryInfo.name = res.data.name
				})
			},
			getCategorySubList() {
				const params = {
					level: 2,
					pid: this.categoryInfo.id
				}
				category.categoryList(params).then(res => {
					this.categorySubList = res.data || []
				})
			},
			editCategory() {
				this.selectCategory = {
					pid: '',
					id: this.categoryInfo?.id || '',
					name: this.categoryInfo?.name || ''
				}
				this.categoryPopupShow = true
			},
			editSubCategory(item) {
				this.selectCategory = {
					pid: this.categoryInfo.id,
					id: item?.id || '',
					name: item?.name || ''
				}
				this.categoryPopupShow = true
			},
			categoryPopupOpen() {
				this.$refs.selectCategoryRef.setRules(this.rules)
			},
			categoryPopupClose() {
				this.selectCategory = {}
				if (!this.categoryInfo.id) {
					mixin.methods.goBack(true)
				}
			},
			editCategorySubmit() {
				this.$refs.selectCategoryRef.validate(valid => {
					if (valid) {
						if (this.selectCategory.id) {
							this.edit()
						} else {
							this.save()
						}
						this.isBackRefresh=true;
					}
				})
			},
			deleteCategorySubmit(item) {
				category.categoryDelete(item.id).then(() => {
					this.$refs.tips.show({
						msg: '已删除',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					this.categoryPopupShow = false
					if (!this.selectCategory.pid) {
						mixin.methods.goBack(true)
					} else {
						this.getCategoryInfo()
						this.getCategorySubList()
					}
				})
			},
			save() {
				category.categoryCreate(this.selectCategory).then(res => {
					this.$refs.tips.show({
						msg: '添加成功',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					this.categoryPopupShow = false
					if (!this.selectCategory.pid) {
						this.categoryInfo = {
							id: res.data.id,
							name: res.data.name
						}
					} else {
						this.getCategoryInfo()
						this.getCategorySubList()
					}
				})
			},
			edit() {
				category.categoryEdit(this.selectCategory.id, this.selectCategory).then(() => {
					this.$refs.tips.show({
						msg: '修改成功',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					this.categoryPopupShow = false
					if (!this.selectCategory.pid) {
						this.categoryInfo = {
							id: this.selectCategory.id,
							name: this.selectCategory.name
						}
					} else {
						this.getCategoryInfo()
						this.getCategorySubList()
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