<template>
	<view class="main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar statusBar :border="false" :fixed="true" class="custom-nav" rightWidth="auto">
			<block slot="left">
				<view class="custom-nav__item" @click="goBack()">
					<uni-icons type="left" color="#666" size="18" />
					<text>返回</text>
				</view>
			</block>
			<view class="custom-nav__item custom-nav__input">
				<uni-icons class="input-uni-icon" type="search" size="18" color="#999" />
				<input v-model="searchParams.searchKey" confirm-type="search" class="nav-bar-input" type="text"
					placeholder="会员名称、手机号搜索" @confirm="confirm" />
			</view>
			<block slot="right">
				<view class="custom-nav__item" @click="tnSetting">
					<uni-icons class="input-uni-icon" type="gear" size="18" color="#999" />
				</view>
			</block>
		</uni-nav-bar>
		<view class="tn-classify__wrap">
			<!-- 分类列表和内容 -->
			<view class="tn-classify__container tn-margin-top-xs tn-bg-white">
				<scroll-view class="tn-goods__right-box tn-flex-1" :scroll-top="scrollViewTop" scroll-y
					scroll-with-animation :style="{height: scrollViewHeight + 'px'}" :refresher-enabled="true"
					refresher-background='tn-bg-gray--light' :refresher-triggered="scrollRefresher"
					:scroll-anchoring="true" @refresherrefresh="scrollPull" @scrolltolower="scrolltolower">
					<view v-if="memberList.length>0" class="tn-classify__content">
						<view v-for="(item,index) in memberList" :key="index"
							class="tn-classify__content__sub-classify tn-border-solid-bottom">
							<view class="article-shadow" @click="tnDetail(item.id)">
								<view
									class="tn-flex tn-flex-flow-row tn-flex-row-left tn-flex-col-center tn-margin-bottom tn-width-full">
									<view class="image-article tn-margin-right-sm">
										<image v-if="item.headPath" :src="getMemberHeadPath(item.headPath)"
											mode="aspectFit" class="image-pic" />
										<image v-else src="@/static/img/member/default-image-vip.png" mode="widthFix"
											class="image-default-pic" />
									</view>
									<view class="tn-flex-1 tn-flex tn-flex-flow-column tn-flex-row-around"
										style="height: 120rpx;">
										<view class="tn-text-lg" style="font-weight: 500;">
											{{ item.name }}
										</view>
										<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-bottom">
											<text>{{item.phone}}</text>
											<view
												class="tn-color-gray tn-flex tn-flex-row-center tn-flex-col-center tn-text-sm">
												<view v-if="item.nowIntegral"
													class="tn-border-solid tn-radius tn-margin-xs tn-padding-xs tn-flex-col-bottom tn-border-blue tn-color-blue--dark">
													积
												</view>
												<view v-if="item.nowRecharge"
													class="tn-border-solid tn-radius tn-margin-xs tn-padding-xs tn-flex-col-bottom tn-border-blue tn-color-blue--dark">
													储
												</view>
												<view v-if="item.counted"
													class="tn-border-solid tn-radius tn-margin-xs tn-padding-xs tn-flex-col-bottom tn-border-blue tn-color-blue--dark">
													次
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view v-else-if="!scrollRefresher" class="tn-padding-top-xl">
						<tn-empty mode="list" text="无会员信息"></tn-empty>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="edit tnxuanfu" @tap="tnAdd()">
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
	import member from '@/api/member/member'
	import mixin from '../../common/mixin'
	import config from '../../common/config'
	export default {
		name: 'templateShopClassify',
		mixins: [mixin],
		data() {
			return {
				searchParams: {
					searchKey: '',
					pageIndex: 1,
					pageSize: 20
				},
				pageTotal: 1,
				// 侧边栏分类数据
				memberList: [],
				customNavbarHeight: 0,
				// scrollView的高度
				scrollViewHeight: 0,
				// scrollView的滚动高度
				scrollViewTop: 0,
				scrollRefresher: false
			}
		},
		mounted() {
			this.scrollPull()
			this.$nextTick(() => {
				this.getScrollViewInfo()
			})
		},
		methods: {
			// 跳转
			tn(e) {
				uni.navigateTo({
					url: e,
				});
			},
			tnDetail(id) {
				uni.navigateTo({
					url: `/view/member/detail?id=${id}`
				})
			},
			tnAdd() {
				uni.navigateTo({
					url: `/view/member/add`
				})
			},
			refresh() {
				this.scrollPull()
			},
			tnSetting() {
				uni.navigateTo({
					url: '/view/member/setting'
				})
			},
			scrolltolower() {
				this.searchParams.pageIndex += 1
				this.getMemberPage()
			},
			scrollPull() {
				if (this.scrollRefresher) {
					return
				}
				this.scrollRefresher = true
				this.searchParams.pageIndex = 1
				setTimeout(() => {
					this.getMemberPage()
				}, 500)
			},
			getMemberPage() {
				member.memberPage(this.searchParams).then(res => {
					if (this.searchParams.pageIndex === 1) {
						this.memberList = []
						this.pageTotal = 1
					}
					if (res.data.rows > 0) {
						res.data.data.forEach(x => {
							this.memberList.push(x)
						})
						this.pageTotal = res.data.total
					}
				}).finally(() => {
					this.scrollRefresher = false
				})
			},
			getMemberHeadPath(headPath) {
				if (headPath) {
					return config.pictureUrl + headPath
				}
				return ''
			},
			// 获取scrollView的高度信息
			async getScrollViewInfo() {
				const customNavbar = await mixin.methods.getRect(this, '.custom-nav')
				const systemInfo = uni.getSystemInfoSync()
				this.customNavbarHeight = customNavbar.height
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



	/* #endif */
	.member {
		&--wrap {
			position: fixed;
			left: 0;
			right: 0;
			width: 100%;
			background-color: inherit;
		}
	}

	.tn-classify {

		&__box {
			background-color: #FFFFFF;
		}

		/* 分类列表和内容 end */

		/* 分类内容 start */
		&__content {
			padding: 20rpx 40rpx;

			/* 子栏目 start */
			&__sub-classify {
				margin-bottom: 20rpx;

				&:last-child {
					border-bottom: none;
				}

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
				}

				.image-default-pic {
					width: 50rpx;
				}
			}
		}
	}

	/* 分类内容 end */
	
</style>