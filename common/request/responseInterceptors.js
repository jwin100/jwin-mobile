const {
	clearTokenInfo,
	clearUserInfo,
	clearMerchantStoreInfo,
	clearMerchantInfo
} = require("../cacheSync")
const {
	default: common
} = require("../common")

let isRefresh = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []

/**
 * 相应拦截
 * @param {Object} http 
 */
module.exports = (vm) => {
	uni.$tn.http.interceptors.response.use(async (response) => { // 可以使用async await 做异步操作
		const res = response.data
		if (res.code != 200) {
			switch (res.code) {
				case 401:
				case 402:
					if (!isRefresh) {
						// this.isRefresh = true
						// await common.refreshToken()
						// requests = []
						// console.log(response.config)
						// isRefresh = false
						// return await common.doRequest(response.config)
					}
				case 403:
				case 404:
					uni.$tn.message.toast('请求信息不存在')
					break
				case 601:
				case 602:
				case 603:
					// uni.showModal({
					// 	title: '版本提示',
					// 	content: '当前版本不能操作此功能，如需操作请前往升级版本',
					// 	cancelText: '取消',
					// 	confirmText: '前往升级版本',
					// 	success(result) {
					// 		if (result.confirm) {
					// 			// 跳转到升级页面
					// 		}
					// 		if (result.cancel) {
					// 			// 已取消
					// 		}
					// 	}
					// })
					break
				default:
					uni.$tn.message.toast(res.msg || '系统错误')
			}
			return Promise.reject(new Error(res.msg || '系统错误'))
		}
		return res
	}, (response) => { // 对响应错误做点什么 （statusCode !== 200）
		return Promise.reject(response)
	})
}