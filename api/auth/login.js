import {
	getAccessToken,
	getRefreshToken
} from "../../common/cacheSync.js"
import config from "../../common/config.js"

export default {
	// 登录
	login(data) {
		return uni.$tn.http.post('/merchant/oauth/login', data)
	},
	wechatLogin(code) {
		return uni.$tn.http.post(`/merchant/oauth/login/wechat/${code}`)
	},
	smsCaptcha(phone) {
		return uni.$tn.http.post(`/merchant/oauth/login/sms-captcha/${phone}`)
	},
	logout() {
		return uni.$tn.http.post(`/merchant/oauth/logout/${getAccessToken()}`)
	}
}