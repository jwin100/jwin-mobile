module.exports = {
	baseUrl: 'http://127.0.0.1:12000',
	pictureAction: 'https://v0.api.upyun.com/jwin100',
	pictureUrl: 'https://picture.jwin100.cn',
	storageUserKey: 'painMobileUser',
	storageMerchantKey: 'painMobileMerchant',
	storageMerchantStoreKey: 'painMobileMerchantStore',
	storageTokenKey: 'painMobileToken',
	platformCode: 3,
	noAuthPages: [
		'/pages/login',
		'/pages/forget'
	],
	form: {
		grantType: 'password',
		clientId: 'client',
		clientSecret: '123',
		phone: '',
		password: '',
		smsCaptcha: '',
		imgCaptcha: '',
		refreshToken: '',
		platform: this.platformCode
	}
}