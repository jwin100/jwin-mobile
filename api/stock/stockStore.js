const http = uni.$tn.http

export default {
	stockStoreInfo(id) {
		return http.get(`/merchant/stock/store/${id}`)
	},
	stockStorePage(params) {
		const config = {
			params: params
		}
		return http.get('/merchant/stock/store/page', config)
	},
	stockSpuSearchByIds(spuIds) {
		return http.get(`/merchant/gate/stock/store/spu/list/${spuIds}`)
	},
	stockSpuCountedList() {
		return http.get('/merchant/gate/stock/store/spu/counted-list')
	},
	stockSpuSearchPage(params) {
		const config = {
			params: params
		}
		return http.get('/merchant/gate/stock/store/spu/page', config)
	},
	stockSkuSearchBySpuId(spuId) {
		return http.get(`/merchant/gate/stock/store/sku/list-pid/${spuId}`)
	},
	stockSkuSearchByKeyword(searchKey) {
		return http.get(`/merchant/gate/stock/store/sku/list-key/${searchKey}`)
	},
	stockSkuCountedList(params) {
		const config = {
			params: params
		}
		return http.get('/merchant/gate/stock/store/sku/counted-list', config)
	}
}