const http = uni.$tn.http

export default {
	storageCreate(params) {
		return http.post('/merchant/goods/spu', params)
	},
	storageEdit(id, params) {
		return http.put(`/merchant/goods/spu/${id}`, params)
	},
	storageImport(syncStoreNo, params) {
		return http.import(`/merchant/goods/spu/import/${syncStoreNo}`, params)
	},
	storageDelete(id) {
		return http.delete(`/merchant/goods/spu/${id}`)
	},
	storageInfo(id) {
		return http.get(`/merchant/goods/spu/${id}`)
	},
	storagePage(params) {
		const config = {
			params: params
		}
		return http.get('/merchant/goods/spu/page', config)
	},
	storageSearch(barcode) {
		return http.get(`/merchant/gate/goods/search/${barcode}`)
	},
	storageStockSpuSearchBySpuNos(spuNos) {
		return http.post('/merchant/gate/goods/spu/stock-search/by-spu-nos', spuNos)
	}
}