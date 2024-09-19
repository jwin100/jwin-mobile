const http = uni.$tn.http

export default {
	regionList() {
		return http.get('/merchant/gate/region/list')
	}
}