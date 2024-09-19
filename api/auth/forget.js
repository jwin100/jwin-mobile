const http = uni.$tn.http

export default {
	// 获取短信验证码
	smsCaptcha(phone) {
		return http.post(`/merchant/oauth/edit-password/sms-captcha/${phone}`)
	},
	// 通过验证码重置
	smsCaptchaReset(data) {
		return http.post('/merchant/oauth/edit-password/sms-captcha-reset', data)
	},
	originalPasswordReset(data) {
		return http.post('/merchant/oauth/edit-password/original-password-reset', data)
	}
}