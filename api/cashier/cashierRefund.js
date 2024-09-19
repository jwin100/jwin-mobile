const http = uni.$tn.http

export default {
	cashierRefundCompute(param) {
		return http.post('/merchant/cashier/refund/compute', param)
	},
	cashierRefundConfirm(param) {
		return http.post('/merchant/cashier/refund/confirm', param)
	},
	cashierRefundPay(param) {
		return http.post('/merchant/cashier/refund/pay', param)
	},
	cashierRefundInfo(id) {
		return http.get(`/merchant/cashier/refund/${id}`)
	},
	cashierRefundPage(param) {
		return http.get('/merchant/cashier/refund/page', { params: params })
	}
}