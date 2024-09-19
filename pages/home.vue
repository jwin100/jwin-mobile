<template>
	<view class="template-index main-container">
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog type="info" title="登录提示" content="请先登录,才可进一步操作" :duration="2000" :before-close="true" @close="close()"
				@confirm="gotoLogin()"></uni-popup-dialog>
		</uni-popup>
		<!-- 顶部自定义导航 -->
		<uni-nav-bar class="custom-nav" :border="false" :fixed="true" backgroundColor="transform" statusBar color="#fff"
			:left-text="accountName">
		</uni-nav-bar>
		<view class="top-backgroup" :style="{height:topBgHeight+'px'}">
		</view>
		<view style="position: relative;">
			<view class="tn-color-white tn-border tn-radius tn-padding" style="height: 150px;">
				<view class="tn-color-block tn-text-md">今日营收(元)</view>
				<view class="tn-padding-top-sm revenue-summary">888.88</view>
				<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-top-lg">
					<view class="">
						<view class="tn-flex tn-flex-direction-column tn-flex-row-center tn-flex-col-left">
							<view class="tn-text-center">
								<text>今日单量</text>
							</view>
							<text class="tn-margin-top-sm">100009</text>
						</view>
					</view>
					<view class="">
						<view class="tn-flex tn-flex-direction-column tn-flex-row-center tn-flex-col-left">
							<view class="tn-text-center">
								<text>今日储值</text>
							</view>
							<text class="tn-margin-top-sm">109.88</text>
						</view>
					</view>
					<view class="">
						<view class="tn-flex tn-flex-direction-column tn-flex-row-center tn-flex-col-left">
							<view class="tn-text-center">
								<text>今日新客</text>
							</view>
							<text class="tn-margin-top-sm">999</text>
						</view>
					</view>
				</view>
			</view>
			<view class="tn-padding">
				<view class="tn-info tn-flex tn-flex-wrap tn-flex-col-center tn-flex-row-between">
					<block v-for="(item, index) in tuniaoData" :key="index">
						<view
							class="tn-info__item tn-color-white tn-flex tn-flex-direction-row tn-flex-col-center tn-flex-row-between"
							:style="{backgroundImage: item.image}"
							style="background-repeat: no-repeat; background-size: 100%;" @click="tn(item)">
							<view
								class="tn-info__item__left tn-flex tn-flex-direction-row tn-flex-col-center tn-flex-row-left">
								<view class="tn-info__item__left__content">
									<view class="tn-info__item__left__content--title" style="font-size: 38rpx;">
										{{ item.title }}
									</view>
									<view class="tn-info__item__left__content--data tn-padding-top-xs">
										{{ item.value }}
										<text class="tn-icon-right tn-padding-left-xs"></text>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</view>
			<view
				class="tn-bg-white tn-border-white tn-shadow tn-margin-left tn-margin-right tn-border tn-radius tn-padding">
				<view class="about-shadow">
					<uni-grid :column="4" :showBorder="false">
						<uni-grid-item v-for="(item, index) in tuniaoUseData" :key="index">
							<view class="tn-radius" @click="tn(item)">
								<view class="tn-flex tn-flex-direction-column tn-flex-row-center tn-flex-col-center">
									<view class="tn-padding-sm">
										<image :src="item.image" mode="aspectFill" style="width: 30px; height: 30px;" />
									</view>
									<view class="tn-text-center">
										<text class="tn-text-ellipsis">{{item.title}}</text>
									</view>
								</view>
							</view>
						</uni-grid-item>
					</uni-grid>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import mixin from '@/common/mixin'
	export default {
		name: 'Index',
		mixins: [mixin],
		data() {
			return {
				topBgHeight: 260,
				isAndroid: true,
				navbarOffsetRight: 0,
				accountName: '',
				tuniaoData: [{
						title: '收银',
						image: `url('https://picture.jwin100.cn/mobile/cashier_bg.png')`,
						color: '#FFEDD4',
						value: 'Cashier',
						url: '/pages/cashier',
						type: 'tab'
					},
					{
						title: '会员',
						image: `url('https://picture.jwin100.cn/mobile/member_bg.png')`,
						color: '#EDFAD5',
						value: 'Member',
						url: '/view/member/index',
						type: 'page'
					}
				],
				tuniaoUseData: [{
						image: '../static/img/home/goods.png',
						title: '商品资料',
						url: '/view/goods/index',
						type: 'page'
					}, {
						image: '../static/img/home/shop.png',
						title: '多门店',
						url: '/view/store/index',
						type: 'page'
					}, {
						image: '../static/img/home/staff.png',
						title: '店员管理',
						url: '/view/staff/index',
						type: 'page'
					}, {
						image: '../static/img/home/stock.png',
						title: '门店库存',
						url: '/view/stock/index',
						type: 'page'
					},
					// {
					// 	icon: 'icon-purchase',
					// 	title: '采购管理',
					// 	url: ''
					// },
					// {
					// 	icon: 'icon-allocate',
					// 	title: '调拨管理',
					// 	url: ''
					// },
					{
						image: '../static/img/home/recharge.png',
						title: '储值管理',
						url: '/view/market/recharge/index',
						type: 'page'
					}, {
						image: '../static/img/home/counted.png',
						title: '计次管理',
						url: '/view/market/counted/index',
						type: 'page'
					},
					{
						image: '../static/img/home/counted-write.png',
						title: '计次核销',
						url: '/view/cashier/countedWrite',
						type: 'page'
					},
					{
						image: '../static/img/home/more.png',
						title: '更多',
						url: '/view/home/more',
						type: 'page'
					}
				]
			}
		},
		onShow() {
			const options = {
				animation: true
			}
			uni.showTabBar(options)
		},
		mounted() {
			if (this.isLogin) {
				this.getUserInfo()
			}
			this.getSystemInfo()
		},
		methods: {
			// 跳转
			tn(e) {
				if (e.type === 'tab') {
					uni.switchTab({
						url: e.url
					})
				} else {
					if (!this.isLogin) {
						this.$refs.popup.open();
						return;
					}
					uni.navigateTo({
						url: e.url,
					});
				}
			},
			close() {
				this.$refs.popup.close()
			},
			gotoLogin() {
				this.$refs.popup.close();
				mixin.methods.gotoLogin();
			},
			toMineSet() {
				uni.navigateTo({
					url: '/view/mine/set'
				})
			},
			async getSystemInfo() {
				const systemInfo = uni.getSystemInfoSync()
				this.topBgHeight = 260 + systemInfo.statusBarHeight
				if (systemInfo.system.toLocaleLowerCase().includes('ios')) {
					this.isAndroid = false
				} else {
					this.isAndroid = true
				}
			},
			getUserInfo() {
				this.accountName = this.vuexUserInfo?.name || ''
			},
		}
	}
</script>

<style lang="scss" scoped>
	.top-backgroup {
		position: fixed;
		width: 200%;
		top: 0;
		left: -50%;
		background: $uni-primary;
		border-radius: 0 0 50% 50%;
	}

	.template-index {
		background: $uni-bg-color;

	}

	.revenue-summary {
		font-size: 50rpx;
	}

	.icon12 {
		&__item {
			color: $tn-font-color;
			width: 30%;
			background-color: #FFFFFF;
			color: $tn-font-color;
			border-radius: 10rpx;
			padding: 30rpx;
			margin: 20rpx 10rpx;
			transition: transform 0.3s linear;
			transform-origin: center center;

			&--icon {
				color: #838383;
				width: 100rpx;
				height: 100rpx;
				font-size: 60rpx;
				position: relative;
				z-index: 1;
			}
		}
	}

	/* 业务展示 start */
	.tn-info {
		&__item {
			width: 47.7%;
			padding: 40rpx 30rpx;
			border-radius: 10rpx;


			position: relative;
			z-index: 1;

			&__left {
				&__content {
					font-size: 25rpx;

					&--data {
						margin-top: 5rpx;
					}
				}
			}

			&__right {
				&--icon {
					position: absolute;
					right: 0rpx;
					bottom: 0rpx;
					font-size: 100rpx;
					width: 108rpx;
					height: 108rpx;
					text-align: center;
					line-height: 60rpx;
					opacity: 0.2;
				}
			}

			&__bottom {
				box-shadow: 0rpx 0rpx 30rpx 0rpx rgba(0, 0, 0, 0.12);
				border-radius: 0 0 10rpx 10rpx;
				position: absolute;
				width: 85%;
				line-height: 15rpx;
				left: 50%;
				bottom: -15rpx;
				transform: translateX(-50%);
				z-index: -1;
				text-align: center;
			}
		}
	}
</style>