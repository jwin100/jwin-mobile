const http = uni.$tn.http

export default {
	purchaseOrderCreate(param) {
		return http.post('/merchant/stock/purchase-order', param)
	},
	purchaseOrderEdit(id, param) {
		return http.put(`/merchant/stock/purchase-order/${id}`, param)
	},
	purchaseOrderExamine(id, param) {
		return http.put(`/merchant/stock/purchase-order/examine/${id}`, param)
	},
	purchaseOrderClose(id) {
		return http.put(`/merchant/stock/purchase-order/close/${id}`)
	},
	purchaseOrderReplenish(id, params) {
		return http.put(`/merchant/stock/purchase-order/replenish/${id}`, params)
	},
	purchaseOrderInfo(id) {
		return http.get(`/merchant/stock/purchase-order/${id}`)
	},
	purchaseOrderList() {
		return http.get('/merchant/gate/stock/purchase-order/list')
	},
	purchaseOrderPage(params) {
		const config = {
			params: params
		}
		return http.get('/merchant/stock/purchase-order/page', config)
	}
}