export default {
	accountCreate(data) {
		return uni.$tn.http.post('/merchant/clerk/account', data)
	},
	accountEdit(id, data) {
		return uni.$tn.http.put(`/merchant/clerk/account/${id}`, data)
	},
	accountEditStatus(id, status) {
		return uni.$tn.http.put(`/merchant/clerk/account/${id}?status=${status}`)
	},
	accountDelete(id) {
		return uni.$tn.http.delete(`/merchant/clerk/account/${id}`)
	},
	accountInfo(id) {
		return uni.$tn.http.get(`/merchant/clerk/account/${id}`)
	},
	accountPage(params) {
		return uni.$tn.http.get('/merchant/clerk/account/page', {params:params})
	},
	getAccountDetail() {
		return uni.$tn.http.get('/merchant/gate/clerk/account/detail')
	},
	accountSearch(searchKey) {
		return uni.$tn.http.get(`/merchant/gate/clerk/account/search/${searchKey}`)
	},
	accountList() {
		return uni.$tn.http.get('/merchant/gate/clerk/account/list')
	},
	accountAllList() {
		return uni.$tn.http.get('/merchant/gate/clerk/account/all-list')
	}
}