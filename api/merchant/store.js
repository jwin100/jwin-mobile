const http = uni.$tn.http

export default {
	storeCreate(data) {
		return http.post('/merchant/merchant/merchant-store', data)
	},
	storeEdit(id, data) {
		return http.put(`/merchant/merchant/merchant-store/${id}`, data)
	},
	storeEditStatus(id, status) {
		return http.put(`/merchant/merchant/merchant-store/status/${id}?status=${status}`)
	},
	storeDelete(id) {
		return http.delete(`/merchant/merchant/merchant-store/${id}`)
	},
	storeInfo(storeId) {
		return http.get(`/merchant/merchant/merchant-store/${storeId}`)
	},
	storePage(params) {
		const config = {
			params: params
		}
		return http.get('/merchant/merchant/merchant-store/page', config)
	},
	storeList() {
		return http.get('/merchant/gate/merchant/merchant-store/list')
	}
}