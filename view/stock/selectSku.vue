<template>
	<view class="main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<uni-nav-bar statusBar :border="false" :fixed="true" class="custom-nav" title="选择商品" left-icon="left"
			left-text="返回" @clickLeft="goBack(true)">
		</uni-nav-bar>
		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="tn-cashier--wrap">
			<!-- 搜索框 -->
			<view
				class="tn-cashier__search--wrap tn-bg-white tn-flex tn-flex-col-center tn-flex-row-center tn-padding-left tn-padding-right">
				<view
					class="tn-bg-gray--light tn-flex tn-flex-direction-row tn-flex-col-center tn-flex-row-center tn-padding-left-sm tn-padding-right-sm"
					style="border-radius: 30rpx; width: 100%;">
					<tn-input v-model="searchParams.searchKey" type="text" :clearable="false" placeholder="请输入商品名称" />
					<view class="tn-cashier__search__icon tn-icon-scan tn-color-gray" style="font-size: 50rpx;">
					</view>
				</view>
			</view>
			<!-- 分类列表和内容 -->
			<view class="tn-flex tn-flex-nowrap tn-flex-row-around">
				<!-- 左边容器 -->
				<scroll-view class="tn-margin-top-xs tn-margin-bottom-xs" :scroll-top="leftScrollViewTop" scroll-y
					scroll-with-animation style="width:200rpx;" :style="{height: scrollViewHeight + 'px'}">
					<view v-for="(item,index) in categoryList" :key="item.id" :id="`tabbar_item_${index}`"
						class="tn-cashier__tabbar__item tn-flex tn-flex-col-center tn-flex-row-center tn-padding"
						:class="[tabbarItemClass(index)]" @tap.stop="clickClassifyNav(item,index)">
						<view class="tn-cashier__tabbar__item__title tn-text-ellipsis">{{ item.name }}
						</view>
					</view>
				</scroll-view>

				<!-- 右边容器 -->
				<scroll-view class="tn-flex-1 tn-bg-white  tn-margin-top-xs tn-margin-bottom-xs"
					:scroll-top="rightScrollViewTop" scroll-y scroll-with-animation
					:style="{height: scrollViewHeight + 'px'}" :refresher-enabled="true"
					:refresher-triggered="scrollRefresher" :scroll-anchoring="true" @refresherrefresh="scrollPull"
					@scrolltolower="scrolltolower">
					<view v-if="spuOptionList.length>0" class="tn-cashier__content tn-padding-left tn-padding-right">
						<view v-for="(item,index) in spuOptionList" :key="index"
							class="tn-cashier__content__sub-cashier">
							<view class="article-shadow">
								<view class="tn-flex tn-flex-row-left tn-margin-top tn-margin-bottom">
									<view class="image-article tn-margin-right-sm">
										<image v-if="item.picture" :src="item.picture" class="image-pic" />
										<image v-else src="@/static/img/goods/default-goods-manage.png"
											class="image-default-pic" />
									</view>
									<view class="tn-flex-1 tn-flex tn-flex-flow-column tn-flex-row-between">
										<view class="tn-text-md">
											{{ item.name }}
										</view>
										<view
											class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-bottom tn-text-sm">
											<view class="tn-flex tn-flex-flow-row tn-flex-col-center">
												<view class="tn-color-red">
													<text>￥</text>
													<text class="tn-text-lg">
														{{item.referenceAmount}}
													</text>
												</view>
												<view class="tn-margin-left-xs tn-flex">
													<view
														class="tn-bg-red--light tn-radius-xs tn-color-red tn-text-xs tn-padding-left-xs tn-padding-right-xs">
														<text>库存：</text>
														<text>{{item.sellStock}}</text>
														<text>{{item.unitName}}</text>
													</view>
												</view>
											</view>
											<view v-if="item.specs>1">
												<tn-button fontColor="tn-color-white" backgroundColor="tn-bg-blue"
													:fontSize="16" @click="addSku(item)" height="auto"
													padding="8rpx 6rpx" style="font-weight: 400;">
													选规格
													<tn-badge v-if="getCardSpuTotal(item.id)>0"
														backgroundColor="tn-bg-red" fontColor="tn-color-white"
														:absolute="true" :fontSize="18" :radius="28">
														<text>{{getCardSpuTotal(item.id)}}</text>
													</tn-badge>
												</tn-button>
											</view>
											<view v-else>
												<view class="tn-flex tn-flex-col-center tn-flex-row-center">
													<view @click="removeSku(item)" v-if="getCardSpuTotal(item.id)>0"
														style="width: 40rpx; height: 40rpx;border-radius: 50%;"
														class="tn-border-blue tn-border-solid tn-color-blue--dark tn-flex tn-flex-row-center tn-flex-col-center">
														<text class="tn-icon-reduce tn-text-md tn-padding-xs"></text>
													</view>
													<view v-if="getCardSpuTotal(item.id)>0"
														class="tn-padding-left tn-padding-right">
														{{getCardSpuTotal(item.id)}}
													</view>
													<view @click="addSku(item)"
														style="width: 40rpx; height: 40rpx;border-radius: 50%;"
														class="tn-border-blue tn-border-solid tn-color-blue--dark tn-flex tn-flex-row-center tn-flex-col-center">
														<text class="tn-icon-add tn-text-md tn-padding-xs"></text>
													</view>
												</view>
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
		<tn-popup v-model="specShow" mode="bottom" :safeAreaInsetBottom="true" :borderRadius="5" :closeBtn="true"
			closeBtnPosition="top-left" :negativeTop="10" :marginTop="60" @open="specPopupOpen" @close="specPopupClose">
			<view class="tn-flex tn-flex-col-center tn-flex-row-center tn-text-bold tn-text-xl tn-border-solid-bottom"
				style="height: 45px; width: 100%;">
				<text>选择规格</text>
			</view>
			<scroll-view scroll-y="true" :style="{height:specPopupHeight+'px'}">
				<view style="padding: 15px">
					<tn-list-view unlined="all">
						<tn-list-cell :hover="true" :radius="true" :fontSize="34">
							<view class="tn-flex tn-flex-col-center">
								<view class="tn-flex-1">商品名称</view>
								<view class="tn-margin-left-sm" style="font-size: 28rpx;">{{selectSpu.name}}</view>
							</view>
						</tn-list-cell>
						<tn-list-cell :unlined="true" :hover="true" :radius="true" :fontSize="34">
							<view class="tn-flex tn-flex-col-center">
								<view class="tn-flex-1">单位</view>
								<view class="tn-margin-left-sm" style="font-size: 28rpx;">{{selectSpu.unitName}}
								</view>
							</view>
						</tn-list-cell>
					</tn-list-view>
					<tn-list-view unlined="all">
						<tn-list-cell :hover="true" :radius="true" :fontSize="30">
							<view class="title tn-flex tn-flex-col-center">
								<view style="width: 33.3%; text-align: left;">规格</view>
								<view style="width: 33.3%; text-align: center;">单价</view>
								<view style="width: 33.3%; text-align: right;">数量</view>
							</view>
						</tn-list-cell>
						<view class="content">
							<tn-list-cell :hover="true" :fontSize="26" v-for="(item,index) in skuOptionList"
								:key="index">
								<view class="tn-flex tn-flex-col-center">
									<view style="width: 33.3%;">
										<view class="tn-flex tn-flex-flow-column">
											<view class="tn-text-ellipsis">{{item.skuName}}</view>
											<view class="tn-margin-top-xs tn-flex">
												<view
													class="tn-bg-red--light tn-radius-xs tn-color-red tn-text-xs tn-padding-top-xxs tn-padding-bottom-xxs tn-padding-left-xs tn-padding-right-xs">
													<text>库存：</text>
													<text>{{item.sellStock}}</text>
													<text>{{item.unitName}}</text>
												</view>
											</view>
										</view>
									</view>
									<view style="width: 33.3%; text-align: center;">
										￥{{item.referenceAmount}}
									</view>
									<view style="width: 33.3%;" class="tn-flex tn-flex-col-center tn-flex-row-right">
										<view class="tn-flex tn-flex-col-center tn-flex-row-center">
											<view v-if="getCardSkuTotal(item.skuId)>0"
												style="width: 40rpx; height: 40rpx; border-radius: 50%;"
												class="tn-border-blue tn-border-solid tn-color-blue--dark tn-flex tn-flex-col-center tn-flex-row-center"
												@click="removeCard(item)">
												<text class="tn-icon-reduce tn-text-md tn-padding-xs"></text>
											</view>
											<view v-if="getCardSkuTotal(item.skuId)>0"
												class="tn-padding-left tn-padding-right">
												{{getCardSkuTotal(item.skuId)}}
											</view>
											<view style="width: 40rpx; height: 40rpx; border-radius: 50%;"
												class="tn-border-blue tn-border-solid tn-color-blue--dark tn-flex tn-flex-col-center tn-flex-row-center"
												@click="addCard(item)">
												<text class="tn-icon-add tn-text-md tn-padding-xs"></text>
											</view>
										</view>
									</view>
								</view>
							</tn-list-cell>
						</view>
					</tn-list-view>
				</view>
			</scroll-view>
		</tn-popup>
		<tn-popup v-model="cardShow" mode="bottom" :safeAreaInsetBottom="true" :borderRadius="5" :closeBtn="false"
			:negativeTop="10" :marginTop="60">
			<view
				class="tn-flex tn-flex-col-center tn-flex-row-center tn-flex-row-between tn-text-xl tn-border-solid-bottom"
				style="height: 90rpx; width: 100%; padding: 0 30rpx;">
				<view @click="cardShow=false" class="tn-icon-left" style="width: 120rpx; text-align: left;"></view>
				<view class="tn-text-bold">已选商品</view>
				<view class="tn-flex tn-flex-col-center tn-flex-row-center tn-color-gray tn-text-md"
					style="width: 120rpx;" @click="clearCard">
					<view class="tn-icon-delete tn-margin-right-xs"></view>
					<view>清空</view>
				</view>
			</view>
			<scroll-view scroll-y="true" :style="{height:specPopupHeight+'px'}">
				<view v-if="selectSkus.length>0" class="tn-cashier__content tn-padding-left tn-padding-right">
					<view v-for="(item,index) in selectSkus" :key="index" class="tn-cashier__content__sub-cashier">
						<view class="article-shadow">
							<view class="tn-flex tn-flex-row-left tn-margin-top tn-margin-bottom">
								<view class="image-article tn-margin-right-sm">
									<image v-if="item.picture" :src="item.picture" class="image-pic" />
									<image v-else src="@/static/img/goods/default-goods-manage.png"
										class="image-default-pic" />
								</view>
								<view class="tn-flex-1 tn-flex tn-flex-direction-column tn-flex-row-between">
									<view class="tn-text-md clamp-text-1 tn-text-justify" style="font-weight: 500;">
										{{ item.skuName }}
									</view>
									<view
										class="tn-flex tn-flex-direction-row tn-flex-row-between tn-flex-col-center tn-text-md">
										<view class="tn-color-red">
											￥{{item.payableAmount}}
										</view>
										<view class="tn-flex tn-flex-col-center tn-flex-row-center">
											<view
												class="tn-icon-reduce tn-text-xs tn-border-blue tn-border-solid tn-color-blue--dark"
												style="border-radius: 50%; padding: 1px;" @click="removeCard(item)">
											</view>
											<view class="tn-padding-left tn-padding-right">
												{{item.quantity}}
											</view>
											<view
												class="tn-icon-add tn-text-xs tn-border-blue tn-border-solid tn-color-blue--dark"
												style="border-radius: 50%; padding: 1px;" @click="addCard(item)">
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-else class="tn-padding-top-xl">
					<tn-empty mode="cart" text="未选择商品"></tn-empty>
				</view>
			</scroll-view>
		</tn-popup>
		<view class="tabbar footerfixed">
			<view class="tn-flex tn-flex-row-between tn-margin-top">
				<view class="justify-content-item tn-padding-left">
					<view class="tn-flex tn-flex-row-center tn-flex-col-center">
						<view class="tn-margin-left tn-padding-right tn-text-ellipsis" @click="cardShow=true">
							<text>已选择{{selectSkus.length}}种{{getSkuTotal()}}件商品</text>
						</view>
					</view>
				</view>
				<view class="tn-flex tn-flex-row-center tn-flex-col-center tn-padding-right">
					<tn-button shadow fontColor="tn-color-white" backgroundColor="tn-bg-blue--dark" :fontSize="40"
						height="auto" padding="20rpx 28rpx" @click="submitCashier">确定</tn-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import category from '@/api/goods/category'
	import stockStore from '@/api/stock/stockStore'
	import uuid from '@/uni_modules/tuniao-ui/libs/function/uuid'
	import mixin from '../../common/mixin'

	export default {
		name: 'selectSku',
		mixins: [mixin],
		data() {
			return {
				tips: {
					type: 'success',
					mask: false,
					message: '提示',
					duration: 2000
				},
				searchParams: {
					searchKey: '',
					categoryId: '',
					pageIndex: 1,
					pageSize: 20
				},
				pageTotal: 1,
				categoryList: [],
				spuOptionList: [],
				skuOptionList: [],
				selectSpu: {},
				// 分类菜单item的信息
				tabbarItemInfo: [],
				customNavbarHeight: 0,
				// scrollView的高度
				scrollViewHeight: 0,
				// 左边scrollView的滚动高度
				leftScrollViewTop: 0,
				// 右边scrollView的滚动高度
				rightScrollViewTop: 0,
				scrollRefresher: false,
				// 当前选中的tabbar序号
				currentTabbarIndex: 0,
				specPopupHeight: 0,
				specShow: false,
				cardShow: false,
				selectSkus: [],
			}
		},
		computed: {
			tabbarItemClass() {
				return index => {
					if (index === this.currentTabbarIndex) {
						return 'tn-cashier__tabbar__item--active tn-bg-white'
					} else {
						let clazz = 'tn-bg-gray--light'
						if (this.currentTabbarIndex > 0 && index === this.currentTabbarIndex - 1) {
							clazz += ' tn-cashier__tabbar__item--active--prev'
						}
						if (this.currentTabbarIndex < this.categoryList.length && index === this.currentTabbarIndex +
							1) {
							clazz += ' tn-cashier__tabbar__item--active--next'
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
			async getScrollViewInfo() {
				// 获取效果演示框的节点信息
				const customNavbar = await mixin.methods.getRect(this, '.custom-nav')
				const footerfixed = await mixin.methods.getRect(this, '.footerfixed')
				const systemInfo = uni.getSystemInfoSync()
				this.specPopupHeight = systemInfo.windowHeight * 0.5
				this.scrollViewHeight = systemInfo.windowHeight - customNavbar.height -
					footerfixed.height - uni.upx2px(20)
			},
			scrolltolower() {
				this.searchParams.pageIndex += 1
				this.getStockSpuList()
			},
			scrollPull() {
				this.scrollRefresher = true
				this.searchParams.pageIndex = 1
				this.pageTotal = 1
				setTimeout(() => {
					this.getStockSpuList()
				}, 300)
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
			},
			getStockSpuList() {
				stockStore.stockSpuSearchPage(this.searchParams).then(res => {
					if (this.searchParams.pageIndex === 1) {
						this.spuOptionList = []
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
			addSku(spu) {
				stockStore.stockSkuSearchBySpuId(spu.id).then(res => {
					this.skuOptionList = res.data
					if (this.skuOptionList.length === 1) {
						// 直接加入购物车
						this.addCard(this.skuOptionList[0])
					} else {
						// 弹窗选择规格商品
						this.specShow = true
						this.selectSpu = spu
					}
				})
			},
			removeSku(spu) {
				stockStore.stockSkuSearchBySpuId(spu.id).then(res => {
					this.skuOptionList = res.data
					if (this.skuOptionList.length === 1) {
						// 直接加入购物车
						this.removeCard(this.skuOptionList[0])
					} else {
						// 弹窗选择规格商品
						this.specShow = true
						this.selectSpu = spu
					}
				})
			},
			specPopupOpen() {

			},
			specPopupClose() {
				this.skuOptionList = []
				this.selectSpu = {}
			},
			addCard(item) {
				const index = this.selectSkus.findIndex(x => x.skuId === item.skuId)
				if (index >= 0) {
					this.selectSkus[index].quantity += 1
				} else {
					const card = {
						key: uuid(),
						skuId: item.skuId,
						skuName: item.skuName,
						spuId: item.spuId,
						quantity: 1,
						adjustAmount: 0,
						payableAmount: 0,
						skuNo: item.skuNo,
						unitName: item.unitName,
						purchaseAmount: item.purchaseAmount,
						sellStock: item.sellStock
					}
					this.selectSkus.push(card)
				}
			},
			removeCard(item) {
				const index = this.selectSkus.findIndex(x => x.skuId === item.skuId)
				if (index < 0) {
					return
				}
				const sku = this.selectSkus[index]
				if (sku.quantity - 1 === 0) {
					this.selectSkus.splice(index, 1)
				} else {
					this.selectSkus[index].quantity -= 1
				}
			},
			clearCard() {
				this.selectSkus = []
			},
			getCardSpuTotal(spuId) {
				const skus = this.selectSkus.filter(x => x.spuId === spuId)
				if (skus.length === 0) {
					return 0
				}
				return skus.map(x => x.quantity)
					.reduce((x, y) => {
						return x + y
					})
			},
			getCardSkuTotal(skuId) {
				const skus = this.selectSkus.filter(x => x.skuId === skuId)
				if (skus.length === 0) {
					return 0
				}
				return skus.map(x => x.quantity)
					.reduce((x, y) => {
						return x + y
					})
			},
			getSkuTotal() {
				if (this.selectSkus.length === 0) {
					return 0
				}
				return this.selectSkus.map(x => x.quantity)
					.reduce((x, y) => {
						return x + y
					})
			},
			submitCashier() {
				uni.setStorageSync("selectSkus", JSON.stringify(this.selectSkus))
				mixin.methods.goBack(true)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tn-cashier {
		&--wrap {
			position: fixed;
			left: 0;
			right: 0;
			width: 100%;
			background-color: inherit;
		}

		/* 导航栏 start */
		&__tabs {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			background-color: inherit;
		}

		/* 导航栏 end */

		/* swiper start */
		&__swiper {
			position: absolute;
			left: 0;
			right: 0;
			width: 100%;
			background-color: inherit;
			// padding: 0 16rpx;
		}

		/* swiper end */

		/* 收银 start */
		&__item {
			margin: 20rpx;
			padding: 36rpx 26rpx;
			background-color: #FFFFFF;
			border-radius: 18rpx;

			&:first-child {
				margin-top: 40rpx;
			}

			&:last-child {
				margin-bottom: 0;
			}

			/* 头部 start */
			&__head {

				&__title {
					font-weight: bold;
					line-height: normal;

					&--right-icon {
						font-size: 24rpx;
						margin-left: 8rpx;
					}
				}

				&__status {
					font-size: 22rpx;
					color: #AAAAAA;
				}
			}

			/* 头部 end */

			/* 内容 start */
			&__content {

				margin-top: 20rpx;

				&__image {
					margin-right: 20rpx;

					image {
						width: 140rpx;
						height: 140rpx;
						border-radius: 10rpx;
					}
				}

				&__title {
					padding-right: 40rpx;
					display: -webkit-box;
					overflow: hidden;
					white-space: normal !important;
					text-overflow: ellipsis;
					word-wrap: break-word;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}

				&__info {

					&__price {
						&--unit {
							font-size: 20rpx;
						}

						&__value--integer,
						&__value--decimal {
							font-weight: bold;
						}

						&__value--decimal {
							font-size: 20rpx;
						}
					}

					&__count {
						color: #AAAAAA;
						font-size: 24rpx;
					}
				}
			}

			/* 内容 end */

			/* 操作按钮 start */
			&__operation {
				margin-top: 30rpx;

				&__right {
					&__button {
						margin-left: 10rpx;
					}
				}
			}

			/* 操作按钮 end */
		}

		/* 内容 end */

		/* 搜索栏 start */
		&__search {
			&--wrap {
				height: 126rpx;
			}

			&__box {
				flex: 1;
				text-align: center;
				padding: 20rpx 0;
				margin: 0 30rpx;
				border-radius: 60rpx;
				font-size: 26rpx;
			}

			&__icon {
				padding-right: 10rpx;
			}
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

			.tn-tag-content {
				&__item {
					display: inline-block;
					line-height: 35rpx;
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
					// 白色图
				}
			}
		}
	}
</style>