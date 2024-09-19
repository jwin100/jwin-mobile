const http = uni.$tn.http

export default {
	cashierOrderCompute(param) {
		return http.post('/merchant/cashier/order/compute', param)
	},
	cashierOrderConfirm(param) {
		return http.post('/merchant/cashier/order/confirm', param)
	},
	cashierOrderPay(param) {
		return http.post('/merchant/cashier/order/pay', param)
	},
	cashierOrderPayResult(id) {
		return http.get(`/merchant/cashier/order/pay/${id}`)
	},
	cashierOrderDelete(id) {
		return http.delete(`/merchant/cashier/order/${id}`)
	},
	cashierOrderInfo(id) {
		return http.get(`/merchant/cashier/order/${id}`)
	},
	cashierOrderPage(params) {
		return http.get('/merchant/cashier/order/page', { params: params })
	}
}