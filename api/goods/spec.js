const http = uni.$tn.http

export default {
	specCreate(params) {
		return http.post('/merchant/goods/spec', params)
	},
	specEdit(id, params) {
		return http.put(`/merchant/goods/spec/${id}`, params)
	},
	specBatchEdit(params) {
		return http.put('/merchant/goods/spec/batch-edit', params)
	},
	specDelete(id) {
		return http.delete(`/merchant/goods/spec/${id}`)
	},
	specInfo(id) {
		return http.get(`/merchant/goods/spec/${id}`)
	},
	specList(params) {
		return http.get('/merchant/goods/spec/list', {params:params})
	},
	specPage(params) {
		return http.get('/merchant/goods/spec/page', {params:params})
	}
}