const http = uni.$tn.http

export default {
	memberLevelCreate(params) {
		return http.post('/merchant/member/level', params)
	},
	memberLevelDelete(id) {
		return http.delete(`/merchant/member/level/${id}`)
	},
	memberLevelList() {
		return http.get('/merchant/member/level')
	}
}