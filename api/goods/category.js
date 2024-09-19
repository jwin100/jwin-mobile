const http = uni.$tn.http

export default {
	categoryCreate(data) {
		return http.post('/merchant/goods/category', data)
	},
	categoryImport(data) {
		return http.import('/merchant/goods/category/import', data)
	},
	categoryEdit(id, data) {
		return http.put(`/merchant/goods/category/${id}`, data)
	},
	categoryDelete(id) {
		return http.delete(`/merchant/goods/category/${id}`)
	},
	categoryInfo(id) {
		return http.get(`/merchant/goods/category/${id}`)
	},
	categoryList(params) {
		return http.get('/merchant/goods/category/list',{ params: params })
	},
	categoryTree() {
		return http.get('/merchant/gate/goods/category/tree')
	}
}