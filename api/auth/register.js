const http = uni.$tn.http

export default {
	// 获取短信验证码
	smsCaptcha(phone) {
		return http.post(`/merchant/oauth/register/sms-captcha/${phone}`)
	},
	// 注册
	register(data) {
		return http.post('/merchant/oauth/register', data)
	}
}