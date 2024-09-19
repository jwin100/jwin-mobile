<template>
	<view class="main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog type="info" title="登录提示" content="请先登录,才可进一步操作" :duration="2000" :before-close="true"
				@close="close()" @confirm="gotoLogin()"></uni-popup-dialog>
		</uni-popup>
		<uni-nav-bar class="custom-nav" :border="false" :fixed="true" backgroundColor="transform" statusBar>
		</uni-nav-bar>
		<view class="top-backgroup" :style="{height:topBgHeight+'px'}">
		</view>
		<view class="tn-padding" style="position: relative;">
			<view class="tn-radius tn-bg-white tn-flex tn-flex-flow-row tn-flex-col-center tn-color-block"
				style="height: 120px;">
				<view class="tn-flex tn-flex-col-center tn-flex-row-left" @click="tn('/view/mine/set')">
					<view class="image-article">
						<image v-if="userInfo.headPath" :src="userInfo.headPath" mode="aspectFill" class="image-pic" />
						<image v-else src="@/static/img/logo.png" class="image-default-pic" />
					</view>
					<view class="tn-padding-right">
						<view class="username">
							<text>{{userInfo.name||"未登录"}}</text>
						</view>
						<view class="store">
							<text>
								门店：{{userInfo.storeName||"未知"}}(No：{{userInfo.storeNo||"0"}})
							</text>
						</view>
						<view class="version">
							<text class="industry">
								{{merchantInfo.industryName || '免费版'}}
							</text>
							<text class="expire" v-if="merchantInfo.expireDate">
								{{merchantInfo.expireDate}}
							</text>
						</view>
					</view>
				</view>
			</view>
			<view class="default-title">
				<view class="title-icon tn-bg-blue"></view>
				<view class="title-txt">其他功能</view>
			</view>
			<tn-list-view unlined="all" class="default-use">
				<tn-list-cell :hover="true" :radius="true" :arrow="true" @click="tn('/view/mine/storeInfo')">
					<view class="tn-flex tn-flex-col-center" style="line-height: 20rpx;">
						<view class="icon1__item--icon tn-flex tn-flex-row-center tn-flex-col-center">
							<image src="@/static/img/mine/shop.png" style="width: 20px; height: 20px;" />
						</view>
						<view class="tn-margin-left-sm tn-flex-1">门店信息</view>
						<view v-if="merchantStoreInfo.main" class="tn-color-gray tn-margin-right">长期有效</view>
						<view v-else class="tn-color-gray tn-margin-right">{{merchantStoreInfo.expireDate}}</view>
					</view>
				</tn-list-cell>
				<tn-list-cell :hover="true" :radius="true" :arrow="true" @click="tn('/view/mine/protocol')">
					<view class="tn-flex tn-flex-col-center" style="line-height: 20rpx;">
						<view class="icon1__item--icon tn-flex tn-flex-row-center tn-flex-col-center">
							<image src="@/static/img/mine/negotiate.png" style="width: 20px; height: 20px;" />
						</view>
						<view class="tn-margin-left-sm tn-flex-1">使用协议</view>
					</view>
				</tn-list-cell>
				<tn-list-cell :hover="true" :radius="true" :arrow="true" @click="tn('/view/mine/feedback')">
					<view class="tn-flex tn-flex-col-center" style="line-height: 20rpx;">
						<view class="icon1__item--icon tn-flex tn-flex-row-center tn-flex-col-center">
							<image src="@/static/img/mine/question.png" style="width: 20px; height: 20px;" />
						</view>
						<view class="tn-margin-left-sm tn-flex-1">问题反馈</view>
					</view>
				</tn-list-cell>
				<tn-list-cell :hover="true" :radius="true" :arrow="true" @click="tnPhoneCall">
					<view class="tn-flex tn-flex-col-center" style="line-height: 20rpx;">
						<view class="icon1__item--icon tn-flex tn-flex-row-center tn-flex-col-center">
							<image src="@/static/img/mine/srevice.png" style="width: 20px; height: 20px;" />
						</view>
						<view class="tn-margin-left-sm tn-flex-1">联系客服</view>
						<view class="phone-call tn-margin-right">
							182****1490
						</view>
					</view>
				</tn-list-cell>
				<tn-list-cell :hover="true" :radius="true" :unlined="false" :arrow="true" @click="getChangeVersion()">
					<view class="tn-flex tn-flex-col-center" style="line-height: 20rpx;">
						<view class="icon1__item--icon tn-flex tn-flex-row-center tn-flex-col-center">
							<image src="@/static/img/mine/update.png" style="width: 20px; height: 20px;" />
						</view>
						<view class="tn-margin-left-sm tn-flex-1">版本更新</view>
						<view class="tn-color-gray tn-margin-right">{{appVersion}}</view>
					</view>
				</tn-list-cell>
			</tn-list-view>
		</view>
	</view>
</template>

<script>
	import mixin from '@/common/mixin'
	export default {
		name: 'Mine',
		mixins: [mixin],
		data() {
			return {
				merchantInfo: {},
				merchantStoreInfo: {},
				userInfo: {

				},
				topBgHeight: 150,
				appVersion: ''
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
				this.getMerchantInfo()
				this.getStoreInfo()
				this.getUser()
			}
			this.$nextTick(() => {
				this.getSystemInfo()
			})
		},
		methods: {
			async getSystemInfo() {
				const systemInfo = uni.getSystemInfoSync()
				this.topBgHeight = 150 + systemInfo.statusBarHeight
				console.log(systemInfo)
				this.appVersion = systemInfo.appVersion
			},
			getMerchantInfo() {
				this.merchantInfo = this.vuexMerchantInfo
			},
			getStoreInfo() {
				this.merchantStoreInfo = this.vuexMerchantStoreInfo
			},
			// 跳转到图鸟官网
			navTuniaoWebsite() {
				uni.navigateToMiniProgram({
					appId: 'wxa698b1eee960632f'
				})
			},
			// 跳转到图鸟UI
			navTuniaoUI() {
				uni.navigateToMiniProgram({
					appId: 'wxf3d81a452b88ff4b'
				})
			},
			// 跳转
			tn(e) {
				if (!this.isLogin) {
					this.$refs.popup.open();
					return;
				}
				uni.navigateTo({
					url: e,
				});
			},
			close() {
				this.$refs.popup.close()
			},
			gotoLogin() {
				this.$refs.popup.close();
				mixin.methods.gotoLogin();
			},
			// 收货地址
			navAddress() {
				uni.chooseAddress({})
			},
			// 震动跳转
			navThanks(e) {
				wx.vibrateShort();
				uni.navigateTo({
					url: '/minePages/thanks'
				})
			},
			//拨打固定电话
			tnPhoneCall() {
				uni.makePhoneCall({
					phoneNumber: "18217071490",
				});
			},
			// 复制开源地址
			copySource() {
				uni.setClipboardData({
					data: "https://ext.dcloud.net.cn/plugin?id=8503",
				})
			},
			getUser() {
				this.userInfo = this.vuexUserInfo
			},
			getChangeVersion() {
				// #ifdef MP-WEIXIN
				const updateManager = uni.getUpdateManager();
				console.log(updateManager)
				updateManager && updateManager.onCheckForUpdate((res) => {
					console.log(res)
					if (res.hasUpdate) {
						updateManager.onUpdateReady(() => {
							uni.showModal({
								title: '更新提示',
								content: '新版本已经准备就绪，是否需要重新启动应用？',
								success: (res) => {
									if (res.confirm) {
										updateManager.applyUpdate()
									}
								}
							})
						})

						updateManager.onUpdateFailed(() => {
							uni.showModal({
								title: '已有新版本上线',
								content: '小程序自动更新失败，请删除该小程序后重新搜索打开~~~',
								showCancel: false
							})
						})
					} else {
						uni.showModal({
							title: '版本提示',
							content: '已是最新版本，无需更新',
							showCancel: false
						})
					}
				})
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top-backgroup {
		position: fixed;
		width: 160%;
		top: 0;
		left: -30%;
		background: $uni-primary;
		border-radius: 0 0 50% 50%;
	}

	.image-article {
		width: 80px;
		height: 80px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 16px;

		.image-pic {
			width: 80px;
			height: 80px;
			border-radius: 50%;
			border: 1px solid $uni-border-1;
		}

		.image-default-pic {
			width: 80px;
			height: 80px;
			border-radius: 50%;
			border: 1px solid $uni-border-1;
		}
	}

	.username {
		font-size: 15px;
		font-weight: bold;
		color: $uni-black-1;
	}

	.store {
		font-size: 14px;
		color: $uni-black-1;
		margin: 6px 0;
	}

	.version {
		display: flex;
		flex-flow: row;
		align-items: flex-end;
		font-size: 12px;

		.industry {
			color: $uni-white;
			line-height: 18px;
			border-radius: 12px;
			padding: 0 6px;
			background-image: linear-gradient(to right, #fecd7c, #ffae23);
		}

		.expire {
			line-height: 16px;
			color: $uni-black-2;
			padding: 0 6px;
		}
	}

	.default-title {
		padding: 18px 0;
		display: flex;
		flex-flow: row;
		align-items: center;

		.title-icon {
			width: 5px;
			height: 15px;
			border-radius: 3px;
		}

		.title-txt {
			margin-left: 6px;
			font-size: 18px;
			line-height: 20px;
		}
	}

	.default-use {

		.phone-call {
			color: $uni-white;
			font-size: 12px;
			line-height: 12px;
			border-radius: 12px;
			padding: 2px 6px;
			background-image: linear-gradient(to right, #fecd7c, #ffae23);
		}
	}
</style>