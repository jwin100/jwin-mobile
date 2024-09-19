const http = uni.$tn.http

export default {
	timeCardRuleCreate(params) {
		return http.post('/merchant/market/time-card-rule', params)
	},
	timeCardRuleEdit(id, params) {
		return http.put(`/merchant/market/time-card-rule/${id}`, params)
	},
	timeCardRuleChangeStatus(id, status) {
		return http.put(`/merchant/market/time-card-rule/status/${id}?status=${status}`)
	},
	timeCardRuleDeleted(id, status) {
		return http.deleted(`/merchant/market/time-card-rule/${id}`)
	},
	timeCardRuleInfo(id) {
		return http.get(`/merchant/market/time-card-rule/${id}`)
	},
	timeCardRulePage(params) {
		return http.get('/merchant/market/time-card-rule/page', params)
	},
	timeCardRuleList() {
		return http.get('/merchant/gate/market/time-card-rule/list')
	}
}