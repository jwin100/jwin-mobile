export default {
	saleHangRecord(data) {
		return uni.$tn.http.post('/merchant/cashier/hang/record', data)
	},
	saleTakeHang(hangNo) {
		return uni.$tn.http.post(`/merchant/cashier/hang/take/${hangNo}`)
	},
	saleDeleteHang(hangNo) {
		return uni.$tn.http.delete(`/merchant/cashier/hang/${hangNo}`)
	},
	saleHangList() {
		return uni.$tn.http.get('/merchant/cashier/hang/list')
	}
}