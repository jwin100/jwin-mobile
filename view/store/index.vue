<template>
	<view class="template-classify main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<uni-nav-bar statusBar :border="false" :fixed="true" class="custom-nav" left-icon="left" leftText="返回"
			title="门店管理" @clickLeft="goBack()">
			<!-- <block slot="right">
				<view class="custom-nav__item" @click="tnAdd">
					<uni-icons class="input-uni-icon" type="plusempty" size="18" color="#999" />
				</view>
			</block> -->
		</uni-nav-bar>
		<view class="tn-market--wrap">
			<view class="tn-market__container">
				<scroll-view class="tn-goods__right-box tn-flex-1" :scroll-top="scrollViewTop" scroll-y
					scroll-with-animation :style="{height: scrollViewHeight + 'px'}" :refresher-enabled="true"
					refresher-background='tn-bg-gray--light' :refresher-triggered="scrollRefresher"
					:scroll-anchoring="true" @refresherrefresh="scrollPull" @scrolltolower="scrolltolower">
					<view class="tn-market__content tn-margin" v-if="storeList.length>0">
						<view v-for="(item, index) in storeList" :key="index" @click="tnDetail(item.id)">
							<view class="tn-margin-bottom-sm tn-padding tn-bg-white tn-radius tn-border-solid-bottom">
								<view
									class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center tn-padding-bottom tn-none-radius tn-border-solid-bottom">
									<view style="line-height: 40rpx;">
										{{item.storeName}}({{item.main?`主门店：${item.storeNo}`:item.storeNo}})
									</view>
									<view class="tn-text-sm">创建日期：{{item.createTime}}</view>
								</view>
								<view class="tn-padding-top">
									<view>
										<view class="tn-flex tn-flex-flow-row tn-flex-col-bottom tn-margin-bottom-xs">
											<text>店长信息：</text>
											<text class="tn-text-bold">{{item.accountName}}</text>
											<text>(</text>
											<text class="tn-color-brown tn-text-sm">
												{{item.accountPhone}}
											</text>
											<text>)</text>
										</view>
										<view class="tn-flex tn-flex-flow-row tn-flex-col-bottom tn-margin-bottom-xs">
											<text>门店电话：</text>
											<text>{{item.storePhone || '--'}}</text>
										</view>
									</view>
									<view
										class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-bottom tn-padding-top">
										<view>
											有效期：
											<text class="tn-color-indigo" v-if="item.main">永久有效</text>
											<text class="tn-color-purplered" v-else>{{item.endDate}}</text>
										</view>
										<view>{{item.statusName}}</view>
									</view>
								</view>
								<!-- <view
									class="tn-flex tn-flex-flow-row tn-flex-row-right tn-flex-col-center tn-padding-top tn-none-radius tn-border-solid-top">
									<view>
										<tn-button v-if="item.status===2" backgroundColor="tn-bg-blue--dark"
											fontColor="tn-color-white" shape="round" :blockRepeatClick="true"
											@click.native.stop="enableCounted(item.id)">启用</tn-button>
										<tn-button v-if="item.status===1" backgroundColor="tn-bg-red"
											fontColor="tn-color-white" shape="round" :blockRepeatClick="true"
											@click.native.stop="disableCounted(item.id)">禁用</tn-button>
									</view>
								</view> -->
							</view>
						</view>
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
	import store from '../../api/merchant/store'
	import mixin from '../../common/mixin'
	export default {
		name: 'storeIndex',
		mixins: [mixin],
		data() {
			return {
				searchParams: {
					searchKey: '',
					pageIndex: 1,
					pageSize: 20,
				},
				pageTotal: 1,
				storeList: [],
				customNavbarHeight: 0,
				scrollViewTop: 0,
				scrollViewHeight: 0,
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
			// 获取scrollView的高度信息
			async getScrollViewInfo() {
				const customNavbar = await mixin.methods.getRect(this, '.custom-nav')
				const systemInfo = uni.getSystemInfoSync()
				this.customNavbarHeight = customNavbar.height
				this.scrollViewTop = systemInfo.statusBarHeight
				this.scrollViewHeight = systemInfo.windowHeight - customNavbar.height
			},
			refresh() {
				this.scrollPull()
			},
			scrolltolower() {
				this.searchParams.pageIndex += 1
				this.getStorePage()
			},
			scrollPull() {
				if (this.scrollRefresher) {
					return
				}
				this.searchParams.pageIndex = 1
				this.scrollRefresher = true
				setTimeout(() => {
					this.getStorePage()
				}, 300)
			},
			getStorePage() {
				store.storePage(this.searchParams).then(res => {
					if (this.searchParams.pageIndex === 1) {
						this.storeList = []
						this.pageTotal = 1
					}
					if (res.data.rows > 0) {
						res.data.data.forEach(x => {
							this.storeList.push(x)
						})
						this.pageTotal = res.data.total
					}
				}).finally(() => {
					this.scrollRefresher = false
				})
			},
			tnDetail(id) {
				uni.navigateTo({
					url: `/view/store/detail?id=${id}`
				})
			},
			tnAdd() {
				uni.navigateTo({
					url: '/view/store/add'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tn-market {
		&--wrap {
			position: fixed;
			left: 0;
			right: 0;
			width: 100%;
			background-color: inherit;
		}
	}
</style>