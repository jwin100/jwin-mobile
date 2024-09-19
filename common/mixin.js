export default {
	data() {
		return {

		}
	},
	onload() {

	},
	methods: {
		goBack(refresh) {
			// 通过判断当前页面的页面栈信息，是否有上一页进行返回，如果没有则跳转到首页
			const pages = getCurrentPages()
			if (pages && pages.length > 0) {
				const firstPage = pages[0]
				if (pages.length == 1 && (!firstPage.route || firstPage.route != 'pages/home')) {
					uni.switchTab({
						url: '/pages/home'
					})
				} else {
					const prePage = pages[pages.length - 2]
					if (refresh) {
						uni.navigateBack({
							delta: 1,
							success() {
								prePage.$vm.refresh()
							}
						})
					} else {
						uni.navigateBack({
							delta: 1
						})
					}
				}
			} else {
				uni.switchTab({
					url: '/pages/home'
				})
			}
		},
		// 查询节点信息
		getRect(that, selector, all) {
			return new Promise((resolve) => {
				const query = uni.createSelectorQuery().in(that)
				const select = all ? query.selectAll(selector) : query.select(selector)
				select.boundingClientRect(rect => {
						if (all && Array.isArray(rect) && rect.length) {
							resolve(rect)
						}
						if (!all && rect) {
							resolve(rect)
						}
					})
					.exec()
			})
		},
		getNavbarOffsetRight() {
			return 20
			// return this.vuexNavbarOffsetRight
		},
		gotoLogin() {
			uni.navigateTo({
				// #ifdef MP-WEIXIN
				url: '/view/mine/wechatLogin'
				// #endif
				// #ifndef MP-WEIXIN
				url: '/pages/login'
				// #endif
			})
		}
	}
}