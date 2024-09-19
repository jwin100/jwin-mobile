const http = uni.$tn.http
export default {
	unitCreate(params) {
		return http.post('/merchant/goods/unit', params)
	},
	unitEdit(id, params) {
		return http.put(`/merchant/goods/unit/${id}`, params)
	},
	unitDelete(id) {
		return http.delete(`/merchant/goods/unit/${id}`)
	},
	unitInfo(id) {
		return http.get(`/merchant/goods/unit/${id}`)
	},
	unitPage(params) {
		return http.get('/merchant/goods/unit/page', {params: params})
	},
	unitList() {
		return http.get('/merchant/gate/goods/unit/list')
	}
}