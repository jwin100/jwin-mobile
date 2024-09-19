const http = uni.$tn.http

export default {
	roleCreate(params) {
		return http.post('/merchant/clerk/role', params)
	},
	roleEdit(id, params) {
		return http.put(`/merchant/clerk/role/${id}`, params)
	},
	roleDelete(id) {
		return http.delete(`/merchant/clerk/role/${id}`)
	},
	roleInfo(id) {
		return http.get(`/merchant/clerk/role/${id}`)
	},
	rolePage(params) {
		const config = {
			params: params
		}
		return http.get('/merchant/clerk/role/page', config)
	},
	roleList() {
		return http.get('/merchant/gate/clerk/role/list')
	},
	rolePowerMenuCreate(roleId, params) {
		return http.post(`/merchant/gate/clerk/role/power-create/${roleId}`, params)
	},
	rolePowerMenu() {
		return http.get('/merchant/gate/clerk/role/power')
	},
	rolePowerMenuChecked(roleId) {
		return http.get(`/merchant/gate/clerk/role/power-checked/${roleId}`)
	}
}