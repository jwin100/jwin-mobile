<template>
	<view class="main-container tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar :border="false" :fixed="true" class="custom-nav" left-icon="left" leftText="返回" statusBar
			rightWidth="0" @clickLeft="goBack()">
			<view class="custom-nav__item custom-nav__input">
				<uni-icons class="input-uni-icon" type="search" size="18" color="#999" />
				<input v-model="searchParams.searchKey" confirm-type="search" class="nav-bar-input" type="text"
					placeholder="商品名、条码搜索" @confirm="confirm" />
			</view>
			<!-- <block slot="right">
				<uni-icons class="input-uni-icon" type="plusempty" size="18" color="#999" @click="tnAdd()" />
			</block> -->
		</uni-nav-bar>
		<!-- 分类列表和内容 -->
		<view class="tn-goods--wrap tn-flex tn-flex-nowrap tn-flex-row-around">
			<!-- 左边容器 -->
			<scroll-view class="tn-margin-top-xs tn-margin-bottom-xs" :scroll-top="leftScrollViewTop" scroll-y
				scroll-with-animation style="width:200rpx;" :style="{height: scrollViewHeight + 'px'}">
				<view class="tn-goods__left-box tn-bg-gray--light" style="width: 200rpx;">
					<view v-for="(item,index) in categoryList" :key="item.id" :id="`tabbar_item_${index}`"
						class="tn-goods__tabbar__item tn-flex tn-flex-col-center tn-flex-row-center tn-padding"
						:class="[tabbarItemClass(index)]" @tap.stop="clickClassifyNav(item,index)">
						<view class="tn-goods__tabbar__item__title tn-text-ellipsis">{{ item.name }}</view>
					</view>
				</view>
			</scroll-view>
			<!-- 右边容器 -->
			<scroll-view class="tn-flex-1 tn-bg-white tn-margin-top-xs tn-margin-bottom-xs"
				:scroll-top="rightScrollViewTop" scroll-y scroll-with-animation
				:style="{height: scrollViewHeight + 'px'}" :refresher-enabled="true"
				:refresher-triggered="scrollRefresher" :scroll-anchoring="true" @refresherrefresh="scrollPull"
				@scrolltolower="scrolltolower">
				<view v-if="spuOptionList.length>0" class="tn-goods__content tn-padding-left tn-padding-right">
					<view v-for="(item,index) in spuOptionList" :key="index" class="tn-goods__content__sub-classify">
						<view class="article-shadow" @click="tnDetail(item.id)">
							<view class="tn-flex tn-flex-row-left tn-margin-top tn-margin-bottom">
								<view class="image-article tn-margin-right-sm">
									<image v-if="item.picture" :src="item.picture" mode="aspectFill"
										class="image-pic" />
									<image v-else src="@/static/img/goods/default-goods-manage.png" mode="widthFix"
										class="image-default-pic" />
								</view>
								<view class="tn-flex-1 tn-flex tn-flex-direction-column tn-flex-row-between">
									<view class="tn-text-md">
										{{ item.name }}
									</view>
									<view
										class="tn-flex-1 tn-flex tn-flex-direction-row tn-flex-row-between tn-flex-col-bottom">
										<view>
											<text class="tn-color-gray--dark tn-text-sm">
												<text class="tn-text-xs">￥</text>
												<text class="tn-text-md">
													{{item.referenceAmount}}/{{item.unitName}}
												</text>
											</text>
										</view>
										<view>
											<text class="tn-color-gray--dark tn-text-sm">
												库存：{{item.sellStock}}
											</text>
											<uni-icons class="input-uni-icon tn-color-gray" style="font-size: 12px;"
												type="right" />
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-else-if="!scrollRefresher" class="tn-padding-top-xl">
					<tn-empty mode="list" text="无商品信息"></tn-empty>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import category from '@/api/goods/category.js'
	import stockStore from '@/api/stock/stockStore.js'
	import mixin from '@/common/mixin'
	export default {
		name: 'templateShopClassify',
		mixins: [mixin],
		data() {
			return {
				searchParams: {
					searchKey: '',
					categoryId: '',
					pageIndex: 1,
					pageSize: 20
				},
				pageTotal: 1,
				// 侧边栏分类数据
				categoryList: [],
				spuOptionList: [],
				// 分类菜单item的信息
				tabbarItemInfo: [],
				// scrollView的高度
				scrollViewHeight: 0,
				// 左边scrollView的滚动高度
				leftScrollViewTop: 0,
				// 右边scrollView的滚动高度
				rightScrollViewTop: 0,
				scrollRefresher: false,
				// 当前选中的tabbar序号
				currentTabbarIndex: 0
			}
		},
		computed: {
			tabbarItemClass() {
				return index => {
					if (index === this.currentTabbarIndex) {
						return 'tn-goods__tabbar__item--active tn-bg-white'
					} else {
						let clazz = 'tn-bg-gray--light'
						if (this.currentTabbarIndex > 0 && index === this.currentTabbarIndex - 1) {
							clazz += ' tn-goods__tabbar__item--active--prev'
						}
						if (this.currentTabbarIndex < this.categoryList.length &&
							index === this.currentTabbarIndex + 1) {
							clazz += ' tn-goods__tabbar__item--active--next'
						}
						return clazz
					}
				}
			}
		},
		mounted() {
			this.getCategoryList()
			this.$nextTick(() => {
				this.getScrollViewInfo()
			})
		},
		methods: {
			// 获取scrollView的高度信息
			async getScrollViewInfo() {
				const customNav = await mixin.methods.getRect(this, '.custom-nav')
				const systemInfo = uni.getSystemInfoSync()
				this.scrollViewHeight = systemInfo.windowHeight - customNav.height -
					uni.upx2px(20)
			},
			// 跳转
			tn(e) {
				uni.navigateTo({
					url: e,
				});
			},
			tnDetail(id) {
				uni.navigateTo({
					url: `/view/stock/detail?id=${id}`
				})
			},
			tnAdd() {
				uni.navigateTo({
					url: `/view/goods/add`
				})
			},
			refresh() {
				this.scrollPull()
			},
			getCategoryList() {
				category.categoryList().then(res => {
					this.categoryList = res.data || []
					if (this.categoryList) {
						const item = this.categoryList[0]
						this.searchParams.categoryId = item.id
						this.scrollPull()
					}
				})
			},
			scrolltolower() {
				this.searchParams.pageIndex += 1
				this.getStockSpuList()
			},
			scrollPull() {
				if (this.scrollRefresher) {
					return
				}
				this.scrollRefresher = true
				this.searchParams.pageIndex = 1
				setTimeout(() => {
					this.getStockSpuList()
				}, 300)
			},
			getStockSpuList() {
				stockStore.stockStorePage(this.searchParams).then(res => {
					if (this.searchParams.pageIndex === 1) {
						this.spuOptionList = []
						this.pageTotal = 1
					}
					if (res.data.rows > 0) {
						res.data.data.forEach(x => {
							this.spuOptionList.push(x)
						})
						this.pageTotal = res.data.total
					}
				}).finally(() => {
					this.scrollRefresher = false
				})
			},
			// 获取分类菜单每个item的信息
			getTabbarItemRect() {
				let view = uni.createSelectorQuery().in(this)
				for (let i = 0; i < this.categoryList.length; i++) {
					view.select('#tabbar_item_' + i).boundingClientRect()
				}
				view.exec(res => {
					if (!res.length) {
						setTimeout(() => {
							this.getTabbarItemRect()
						}, 10)
						return
					}

					// 将每个分类item的相关信息
					res.map((item) => {
						this.tabbarItemInfo.push({
							top: item.top,
							height: item.height
						})
					})
				})
			},
			// 点击了分类导航
			clickClassifyNav(item, index) {
				if (this.currentTabbarIndex === index) {
					return
				}
				this.currentTabbarIndex = index
				this.switchClassifyContent(item)
			},
			// 切换对应分类的数据
			switchClassifyContent(item) {
				this.rightScrollViewTop = 1
				this.$nextTick(() => {
					this.rightScrollViewTop = 0
				})
				this.searchParams.categoryId = item.id
				this.scrollPull()
			}
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

	/* #endif */
	.tn-goods {
		&--wrap {
			position: fixed;
			left: 0;
			right: 0;
			width: 100%;
			background-color: inherit;
		}

		/* 分类列表和内容 end */

		/* 侧边导航 start */
		&__tabbar {
			&__item {
				height: 90rpx;

				&:first-child {
					border-top-right-radius: 0rpx;
				}

				&:last-child {
					border-bottom-right-radius: 0rpx;
				}

				&--active {
					background-color: #FFFFFF;
					position: relative;
					font-weight: bold;

					&::before {
						content: '';
						position: absolute;
						width: 12rpx;
						height: 40rpx;
						top: 50%;
						left: 0;
						background-color: $tn-main-color;
						border-radius: 12rpx;
						transform: translateY(-50%) translateX(-50%);
					}

					&--prev {
						border-bottom-right-radius: 26rpx;
					}

					&--next {
						border-top-right-radius: 26rpx;
					}
				}
			}
		}

		/* 侧边导航 end */

		/* 分类内容 start */
		&__content {

			/* 推荐商品 start */
			&__recomm {
				margin-bottom: 40rpx;

				&__swiper {}
			}

			/* 推荐商品 end */

			/* 子栏目 start */
			&__sub-classify {
				margin-bottom: 20rpx;

				&--title {
					font-weight: bold;
					margin-bottom: 18rpx;
				}

				&__content {

					&__item {
						width: 33%;
					}

					&__title {
						margin-right: 10rpx;
					}
				}
			}

			/* 多规格标签内容 start*/
			.tn-tag-content {
				&__item {
					display: inline-block;
					line-height: 35rpx;
					color: $tn-color-cyan-dark;
					padding: 5rpx 10rpx;
					border-radius: 12rpx;

					&--prefix {
						padding-right: 10rpx;
					}
				}
			}

			.image-article {
				width: 100rpx;
				height: 100rpx;
				border-radius: 8rpx;
				background-color: $tn-progress-bg-color;
				display: flex;
				align-items: center;
				justify-content: center;

				.image-pic {
					width: 100rpx;
					height: 100rpx;
				}

				.image-default-pic {
					width: 50rpx;
					height: 50rpx;
				}
			}

			/* 子栏目 end */
		}
	}
</style>