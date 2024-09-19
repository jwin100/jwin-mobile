<template>
	<view class="main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar statusBar :border="false" :fixed="true" class="custom-nav" rightWidth="0">
			<block slot="left">
				<view class="custom-nav__item" @click="goBack()">
					<uni-icons type="left" color="#666" size="18" />
					<text>返回</text>
				</view>
			</block>
			<view class="custom-nav__item custom-nav__input">
				<uni-icons class="input-uni-icon" type="search" size="18" color="#999" />
				<input confirm-type="search" class="nav-bar-input" type="text" placeholder="输入搜索关键词"
					@confirm="confirm" />
			</view>
		</uni-nav-bar>
		<!-- 分类列表和内容 -->
		<view class="tn-more--wrap">
			<view class="tn-classify__container tn-margin-top-xs tn-bg-white">
				<scroll-view class="tn-radius" :scroll-top="scrollViewTop" scroll-y scroll-with-animation
					:style="{height: scrollViewHeight + 'px'}">
					<view v-for="(item,index) in moreList" :key="index">
						<view class="tn-padding-left tn-padding-top tn-text-lg tn-text-bold">
							{{item.title}}
						</view>
						<uni-grid :column="4" :showBorder="false">
							<uni-grid-item v-for="(sub, subIndex) in item.children" :key="subIndex">
								<view class="tn-radius" @click="tn(sub)">
									<view
										class="tn-flex tn-flex-direction-column tn-flex-row-center tn-flex-col-center">
										<view class="tn-padding-sm">
											<image :src="sub.image" mode="aspectFill"
												style="width: 30px; height: 30px;" />
										</view>
										<view class="tn-text-center">
											<text class="tn-text-ellipsis">{{sub.title}}</text>
										</view>
									</view>
								</view>
							</uni-grid-item>
						</uni-grid>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import category from '@/api/goods/category.js'
	import stockStore from '@/api/stock/stockStore.js'
	import member from '@/api/member/member'
	import mixin from '../../common/mixin'
	export default {
		name: 'templateShopClassify',
		mixins: [mixin],
		data() {
			return {
				searchParams: {
					searchKey: ''
				},
				scrollViewTop: 0,
				// scrollView的高度
				scrollViewHeight: 0,
				moreList: [{
						title: '商品',
						children: [{
								image: '../../static/img/home/more/icon-category.png',
								title: '商品分类',
								url: '/view/goods/category/index',
								type: 'page'
							},
							{
								icon: 'icon-space',
								image: '../../static/img/home/more/icon-space.png',
								title: '商品规格',
								url: '/view/goods/spec/index',
								type: 'page'
							},
							// {
							// 	icon: 'icon-tag',
							// 	image: '../../static/img/home/more/icon-tag.png',
							// 	title: '商品标签',
							// 	url: '/view/goods/add',
							// 	type: 'page'
							// },
							{
								icon: 'icon-unit',
								image: '../../static/img/home/more/icon-unit.png',
								title: '商品单位',
								url: '/view/goods/unit/index',
								type: 'page'
							},
							{
								icon: 'icon-goods',
								image: '../../static/img/home/more/icon-goods.png',
								title: '商品资料',
								url: '/view/goods/index',
								type: 'page'
							}
						]
					},
					{
						title: '库存',
						children: [{
								icon: 'icon-stock',
								image: '../../static/img/home/more/icon-stock.png',
								title: '门店库存',
								url: '/view/stock/index',
								type: 'page'
							},
							{
								icon: 'icon-purchase',
								image: '../../static/img/home/more/icon-purchase.png',
								title: '门店采购',
								url: '/view/stock/purchase/index',
								type: 'page'
							},
							{
								icon: 'icon-allocate',
								image: '../../static/img/home/more/icon-allocate.png',
								title: '门店调拨',
								url: '/view/goods/add',
								type: 'page'
							},
							{
								icon: 'icon-store-record',
								image: '../../static/img/home/more/icon-store-record.png',
								title: '库存记录',
								url: '/view/goods/add',
								type: 'page'
							},
							{
								icon: 'icon-stock-setting',
								image: '../../static/img/home/more/icon-stock-setting.png',
								title: '库存设置',
								url: '/view/goods/add',
								type: 'page'
							}
						]
					},
					{
						title: '多门店',
						children: [{
								icon: 'icon-store',
								image: '../../static/img/home/more/icon-store.png',
								title: '门店管理',
								url: '/view/store/index',
								type: 'page'
							},
							{
								icon: 'icon-staff',
								image: '../../static/img/home/more/icon-staff.png',
								title: '店员管理',
								url: '/view/staff/index',
								type: 'page'
							}
						]
					},
					{
						title: '订单',
						children: [{
								icon: 'icon-order',
								image: '../../static/img/home/more/icon-stock-setting.png',
								title: '销售订单',
								url: '/pages/order',
								type: 'tab'
							},
							{
								icon: 'icon-order-setting',
								image: '../../static/img/home/more/icon-order-setting.png',
								title: '订单设置',
								url: '/view/order/setting',
								type: 'page'
							}
						]
					},
					{
						title: '收银',
						children: [{
								icon: 'icon-cashier',
								image: '../../static/img/home/more/icon-cashier.png',
								title: '销售开单',
								url: '/pages/cashier',
								type: 'tab'
							},
							{
								icon: 'icon-counted-write',
								image: '../../static/img/home/more/icon-counted-write.png',
								title: '计次核销',
								url: '/view/cashier/countedWrite',
								type: 'page'
							}
						]
					},
					{
						title: '会员',
						children: [{
								icon: 'icon-member',
								image: '../../static/img/home/more/icon-stock-setting.png',
								title: '会员资料',
								url: '/view/member/index',
								type: 'page'
							},
							{
								icon: 'icon-member-setting',
								image: '../../static/img/home/more/icon-member-setting.png',
								title: '会员设置',
								url: '/view/member/setting',
								type: 'page'
							}
						]
					},
					{
						title: '会员营销',
						children: [{
								icon: 'icon-recharge',
								image: '../../static/img/home/more/icon-recharge.png',
								title: '储值管理',
								url: '/view/market/recharge/index',
								type: 'page'
							},
							{
								icon: 'icon-counted',
								image: '../../static/img/home/more/icon-counted.png',
								title: '计次管理',
								url: '/view/market/counted/index',
								type: 'page'
							}
						]
					}
				],
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.getScrollViewInfo()
			})
		},
		methods: {
			// 跳转
			tn(e) {
				if (e.type === 'tab') {
					uni.switchTab({
						url: e.url
					})
				} else {
					uni.navigateTo({
						url: e.url,
					});
				}
			},
			// 获取scrollView的高度信息
			async getScrollViewInfo() {
				const customNavbar = await mixin.methods.getRect(this, '.custom-nav')
				const systemInfo = uni.getSystemInfoSync()
				this.scrollViewHeight = systemInfo.windowHeight - customNavbar.height
			},
		}
	}
</script>

<style lang="scss" scoped>
	/* #ifdef MP-WEIXIN || MP-QQ */
	.custom-nav {
		/deep/ .uni-navbar__header {
			padding: 0 120px 0 10px !important;
		}
	}

	/*#endif*/

	.tn-more {
		&--wrap {
			position: fixed;
			left: 0;
			right: 0;
			width: 100%;
			background-color: inherit;
		}
	}

	.icon12 {
		&__item {
			width: 30%;
			padding: 30rpx;
			margin: 20rpx 10rpx;
			transform: scale(1);
			transition: transform 0.3s linear;
			transform-origin: center center;

			&--icon {
				color: #838383;
				width: 100rpx;
				height: 100rpx;
				font-size: 60rpx;
				border-radius: 50%;
				position: relative;
				z-index: 1;
			}
		}
	}

	.default-image-article {
		width: 90rpx;
		height: 90rpx;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.image-default-pic {
		width: 60rpx;
		height: 60rpx;
		// 白色图
	}
</style>