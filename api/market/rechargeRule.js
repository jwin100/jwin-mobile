const http = uni.$tn.http

export default {
	rechargeRuleCreate(params) {
		return http.post('/merchant/market/recharge-rule', params)
	},
	rechargeRuleEdit(id, params) {
		return http.put(`/merchant/market/recharge-rule/${id}`, params)
	},
	rechargeRuleChangeStatus(id, status) {
		return http.put(`/merchant/market/recharge-rule/status/${id}?status=${status}`)
	},
	rechargeRuleDelete(id) {
		return http.deleted(`/merchant/market/recharge-rule/${id}`)
	},
	rechargeRuleInfo(id) {
		return http.get(`/merchant/market/recharge-rule/${id}`)
	},
	rechargeRulePage(params) {
		return http.get('/merchant/market/recharge-rule/page', params)
	},
	rechargeRuleList() {
		return http.get('/merchant/gate/market/recharge-rule/list')
	}
}