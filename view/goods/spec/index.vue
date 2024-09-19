<template>
	<view class="template-classify tn-safe-area-inset-bottom main-container tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar statusBar :border="false" :fixed="true" class="custom-nav" title="规格管理">
			<block slot="left">
				<view class="custom-nav__item" @click="goBack()">
					<uni-icons type="left" color="#666" size="18" />
					<text>返回</text>
				</view>
			</block>
			<!-- <block slot="right">
				<view class="custom-nav__item">
					<uni-icons class="input-uni-icon" type="plusempty" size="18" color="#999" @click="editSpec()" />
				</view>
			</block> -->
		</uni-nav-bar>
		<view class="tn-classify__wrap">
			<view class="tn-classify__container tn-flex tn-flex-nowrap tn-flex-row-around">
				<scroll-view class="tn-classify__box tn-width-full" scroll-y :scroll-top="scrollViewTop"
					:style="{height: scrollViewHeight + 'px'}">
					<view class="tn-classify__content tn-padding-top-xs" v-if="spaceList.length>0">
						<tn-list-view unlined="all">
							<block v-for="(item, index) in spaceList" :key="index">
								<tn-list-cell :arrow="true" @click="editSpec(item)" class="tn-flex tn-flex-row-between">
									<text>{{item.name}}</text>
									<text v-if="item.merchantNo===0" class="tn-color-grey tn-margin-right">(系统预设)</text>
								</tn-list-cell>
							</block>
						</tn-list-view>
					</view>
					<view v-else class="tn-padding-top-xl">
						<tn-empty mode="list" text="暂无规格信息"></tn-empty>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="edit tnxuanfu" @tap="editSpec()">
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
	import spec from '../../../api/goods/spec'
	import mixin from '../../../common/mixin'
	export default {
		name: 'categoryIndex',
		mixins: [mixin],
		data() {
			return {
				customNavbarHeight: 0,
				// scrollView的top值
				scrollViewTop: 0,
				// scrollView的高度
				scrollViewHeight: 0,
				spaceList: [],
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
				}
			}
		},
		mounted() {
			this.getSpecList()
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
			refresh(){
				this.getSpecList()
			},
			getSpecList() {
				spec.specList({}).then(res => {
					this.spaceList = res.data || []
				})
			},
			editSpec(item) {
				uni.navigateTo({
					url: `/view/goods/spec/edit?id=${item?.id || ''}`
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