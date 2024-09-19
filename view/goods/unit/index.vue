<template>
	<view class="template-classify tn-safe-area-inset-bottom main-container tn-bg-gray--light">
		<uni-nav-bar statusBar :border="false" :fixed="true" class="custom-nav" title="单位管理">
			<block slot="left">
				<view class="custom-nav__item" @click="goBack()">
					<uni-icons type="left" color="#666" size="18" />
					<text>返回</text>
				</view>
			</block>
			<!-- <block slot="right">
				<view class="custom-nav__item">
					<uni-icons class="input-uni-icon" type="gear" size="18" color="#999" @click="editUnit()" />
				</view>
			</block> -->
		</uni-nav-bar>
		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="tn-classify__wrap">
			<view class="tn-classify__container">
				<scroll-view class="tn-classify__box tn-width-full" scroll-y :scroll-top="scrollViewTop"
					:style="{height: scrollViewHeight + 'px'}">
					<view class="tn-classify__content tn-padding-top-xs" v-if="unitList.length>0">
						<tn-list-view unlined="all">
							<block v-for="(item, index) in unitList" :key="index">
								<tn-list-cell :arrow="true" @click="editUnit(item)" class="tn-flex tn-flex-row-between">
									<text>{{item.name}}</text>
									<text v-if="item.merchantNo===0" class="tn-color-grey tn-margin-right">(系统预设)</text>
								</tn-list-cell>
							</block>
						</tn-list-view>
					</view>
					<view v-else class="tn-padding-top-xl">
						<tn-empty mode="list" text="暂无单位信息"></tn-empty>
					</view>
				</scroll-view>
			</view>
		</view>
		<tn-popup v-model="unitPopupShow" mode="bottom" :safeAreaInsetBottom="true" :borderRadius="5" :closeBtn="true"
			closeBtnIcon="left" closeBtnPosition="top-left" :negativeTop="10" :marginTop="60" @open="unitPopupOpen"
			@close="unitPopupClose">
			<view
				class="tn-flex tn-flex-col-center tn-flex-row-center tn-flex-row-between tn-text-xl tn-border-solid-bottom"
				style="height: 90rpx; width: 100%; padding: 0 30rpx;">
				<view class="tn-text-bold">商品单位设置</view>
			</view>
			<scroll-view scroll-y="true">
				<view style="padding: 16px">
					<tn-tips ref="unitTips" position="top"></tn-tips>
					<tn-form :model="selectUnit" ref="selectUnitRef" :errorType="['message']" :labelWidth="180"
						labelAlign="right">
						<tn-form-item label="单位名：" prop="name" :required="true">
							<tn-input v-model="selectUnit.name" placeholder="单位名" />
						</tn-form-item>
					</tn-form>
				</view>
			</scroll-view>
			<view class="tn-padding tn-flex tn-flex-col-center tn-flex-row-between">
				<view v-if="selectUnit.id" class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
					<tn-button backgroundColor="tn-bg-red" fontColor="tn-color-red" style="width: 100%;" :shadow="true"
						shape="round" :plain="true" :blockRepeatClick="true" @click="deleteUnitSubmit">删除</tn-button>
				</view>
				<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
					<tn-button backgroundColor="tn-bg-indigo" fontColor="tn-color-white" style="width: 100%;"
						:shadow="true" shape="round" :blockRepeatClick="true" @click="editUnitSubmit">保存</tn-button>
				</view>
			</view>
		</tn-popup>
		<view class="edit tnxuanfu" @tap="editUnit()">
			<view
				class="icon12__item--icon tn-shadow-blur tn-flex tn-flex-row-center tn-flex-col-center tn-main-gradient-blue--light tn-color-blue--dark">
				<view class="tn-icon-add">
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import category from '@/api/goods/category.js'
	import stockStore from '@/api/stock/stockStore.js'
	import unit from '../../../api/goods/unit'
	import mixin from '../../../common/mixin'
	export default {
		name: 'categoryIndex',
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
				unitList: [],
				unitPopupShow: false,
				selectUnit: {},
				rules: {
					name: [{
						validator: (rule, value, callback) => {
							if (value) {
								return true
							}
							return false
						},
						message: '请输入单位名',
						trigger: ['change', 'blur'],
					}]
				}
			}
		},
		onShow() {
			this.getUnitList()
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
				this.scrollViewBasicTop = systemInfo.statusBarHeight
				this.scrollViewHeight = systemInfo.windowHeight - customNavbar.height
			},
			getUnitList() {
				unit.unitList().then(res => {
					this.unitList = res.data || []
				})
			},
			editUnit(item) {
				if (item) {
					this.selectUnit = JSON.parse(JSON.stringify(item))
				}
				this.unitPopupShow = true
			},
			unitPopupOpen() {
				this.$refs.selectUnitRef.setRules(this.rules)
			},
			unitPopupClose() {
				this.selectUnit = {}
			},
			editUnitSubmit() {
				this.$refs.selectUnitRef.validate(valid => {
					if (valid) {
						if (this.selectUnit.id) {
							this.edit()
						} else {
							this.save()
						}
					}
				})
			},
			deleteUnitSubmit() {
				unit.unitDelete(this.selectUnit.id).then(() => {
					this.$refs.tips.show({
						msg: '已删除',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					this.unitPopupShow = false
					this.getUnitList()
				})
			},
			save() {
				unit.unitCreate(this.selectUnit).then(res => {
					this.$refs.tips.show({
						msg: '添加成功',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					this.unitPopupShow = false
					this.getUnitList()
				})
			},
			edit() {
				unit.unitEdit(this.selectUnit.id, this.selectUnit).then(() => {
					this.$refs.tips.show({
						msg: '修改成功',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					this.unitPopupShow = false
					this.getUnitList()
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

	.swipe-action__item {
		padding: 10rpx 20rpx;

		&__image {
			image {
				width: 80rpx;
				height: 80rpx;
				border-radius: 20rpx;
			}
		}

		&__info {
			margin-left: 20rpx;

			&__title {
				font-size: 30rpx;
				font-weight: bold;
			}

			&__desc {
				margin-top: 5rpx;
				font-size: 22rpx;
				color: $tn-font-sub-color;
			}
		}
	}
</style>