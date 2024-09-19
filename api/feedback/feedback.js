const http = uni.$tn.http

export default {
	feedbackCreate(params) {
		return http.post('/merchant/feedback/add', params)
	},
	feedbackInfo(id) {
		return http.get(`/merchant/feedback/info/${id}`)
	},
	feedbackPage(params) {
		const config = {
			params: params
		}
		return http.get('/merchant/feedback/page', config)
	}
}