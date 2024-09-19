const http = uni.$tn.http

export default {
	orderIgnoreEdit(type) {
		return http.put(`/merchant/cashier/ignore/${type}`)
	},
	orderIgnoreInfo() {
		return http.get('/merchant/gate/cashier/ignore')
	},
	orderIgnoreSetList() {
		return http.get('/merchant/gate/cashier/ignore/set-list')
	}
}