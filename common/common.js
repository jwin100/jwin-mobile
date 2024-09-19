import login from "../api/auth/login"
import {
	clearMerchantInfo,
	clearMerchantStoreInfo,
	clearTokenInfo,
	clearUserInfo,
	getRefreshToken,
	setTokenInfo
} from "./cacheSync"
import config from "./config"

export default {
	async refreshToken() {
		const token = getRefreshToken()
		if (!token) {
			uni.$tn.message.toast('未登录')
			setTimeout(() => {
				uni.reLaunch({
					url: '/pages/login'
				})
			}, 300)
			return
		}
		const data = config.form
		data.grantType = 'refresh_token'
		data.refreshToken = token
		await login.login(data).then(res => {
			setTokenInfo(res.data)
		}).catch(error => {
			uni.$tn.message.toast(res.msg || '登录异常，请重新登录')
			clearTokenInfo()
			clearUserInfo()
			clearMerchantStoreInfo()
			clearMerchantInfo()
			uni.reLaunch({
				url: '/pages/login'
			})
		})
	},
	async doRequest(config) {
		return uni.$tn.http.request(config)
	}
}