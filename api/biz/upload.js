const http = uni.$tn.http

export default {
	merchantUploadFile(type) {
		return http.get(`/merchant/biz/file/upload-auth/${type}`)
	}
}