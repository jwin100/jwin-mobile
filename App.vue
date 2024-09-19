<script>
	import Vue from 'vue'
	import store from './store/index.js'
	import config from '@/common/config.js'
	import updateCustomBarInfo from './uni_modules/tuniao-ui/libs/function/updateCustomBarInfo.js'
	import {
		getMerchantInfo,
		getMerchantStoreInfo,
		getTokenInfo,
		getUserInfo,
		setMerchantInfo,
		setMerchantStoreInfo,
		setTokenInfo,
		setUserInfo
	} from './common/cacheSync.js'
	import login from '@/api/auth/login';
	import staff from './api/security/staff.js'
	export default {
		onLaunch: function() {
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef H5
					// 获取手机系统版本
					const system = e.system.toLowerCase()
					const platform = e.platform.toLowerCase()
					// 判断是否为ios设备
					if (platform.indexOf('ios') != -1 && (system.indexOf('ios') != -1 || system.indexOf(
							'macos') != -1)) {
						Vue.prototype.SystemPlatform = 'apple'
					} else if (platform.indexOf('android') != -1 && (system.indexOf('android') != -1)) {
						Vue.prototype.SystemPlatform = 'android'
					} else {
						Vue.prototype.SystemPlatform = 'devtools'
					}
					// #endif
				}
			})
		},
		onShow: function() {
			this.autoLogin()
			// #ifdef MP-WEIXIN
			const updateManager = uni.getUpdateManager();
			updateManager && updateManager.onCheckForUpdate((res) => {
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
							content: '小程序自动更新失败，请删除该小程序后重新搜索打开哟~~~',
							showCancel: false
						})
					})
				}
			})
			// #endif
		},
		onHide: function() {
			// console.log('App Hide')
		},
		methods: {
			async autoLogin() {
				const pages = getCurrentPages()
				let localPath = '/pages/home'
				if (pages && pages.length > 0) {
					const currentPage = pages[pages.length - 1]
					localPath = currentPage.route
				}
				if (config.noAuthPages.findIndex(x => x === localPath) >= 0) {
					return
				}
				let tokenInfo = getTokenInfo()
				
				console.log(tokenInfo)
				if (!tokenInfo) {
					// #ifndef MP-WEIXIN
					uni.showToast({
						title: '未登录',
						icon: 'none',
						position: 'top',
						mask: true
					})
					this.$tn.vuex('isLogin', false)
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/login'
						})
					}, 500)
					// #endif
					// #ifdef MP-WEIXIN
					this.wxLogin();
					// #endif
				}else{
					this.$tn.vuex('isLogin', true)
					this.$tn.vuex('vuexUserInfo', getUserInfo())
					this.$tn.vuex('vuexMerchantStoreInfo', getMerchantStoreInfo())
					this.$tn.vuex('vuexMerchantInfo', getMerchantInfo())
				}
			},
			wxLogin() {
				uni.login({
					provider: 'weixin',
					success: (res) => {
						if (!res.code) {
							this.$tn.message.toast('微信登录异常')
							return
						}
						login.wechatLogin(res.code).then(result => {
							const data = result.data
							if (data.code === 1) {
								// openId未绑定手机号，则保存openId
								this.$tn.vuex('openId', data.openId)
								this.$tn.vuex('isLogin', false)
							} else if (data.code === 2) {
								setTokenInfo(data)
								this.initUserInfo()
								this.$tn.vuex('isLogin', true)
							}
						})
					}
				})
			},
			initUserInfo() {
				staff.getAccountDetail().then(res => {
					const {
						userVo,
						storeVo,
						merchantVo
					} = res.data
					setUserInfo(userVo)
					setMerchantStoreInfo(storeVo)
					setMerchantInfo(merchantVo)
					this.$tn.vuex('vuexUserInfo', userVo)
					this.$tn.vuex('vuexMerchantStoreInfo', storeVo)
					this.$tn.vuex('vuexMerchantInfo', merchantVo)
				})
			}
		}
	}
</script>

<style lang="scss">
	@import './uni_modules/tuniao-ui/index.scss';
	@import './uni_modules/tuniao-ui/iconfont.css';
	@import '@/static/css/main.scss';
	@import '@/static/font/iconfont.css';
</style>