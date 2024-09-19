<template>
	<view class="template-login">
		<tn-tips ref="tips" position="top" :top="vuex_custom_bar_height"></tn-tips>
		<view class="login">
			<!-- 顶部背景图片-->
			<view class="login__wrapper">
				<view>
					<view class="tn-margin-left tn-margin-right tn-text-bold" style="font-size: 50rpx;">
						密码找回
					</view>
					<view class="tn-margin tn-color-gray tn-text-md">
						修改后请重新登录其他应用
					</view>
				</view>
				<view class="login__info tn-flex tn-flex-direction-column tn-flex-col-center tn-flex-row-center">
					<!-- 修改密码 -->
					<tn-form :model="form" ref="formRef" :errorType="['message']" class="tn-width-full">
						<tn-form-item prop="phone" :borderBottom="false">
							<view
								class="login__info__item__input tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-left">
								<view class="login__info__item__input__left-icon">
									<view class="tn-icon-phone"></view>
								</view>
								<view class="login__info__item__input__content">
									<input v-model="form.phone" placeholder-class="input-placeholder"
										placeholder="请输入手机号" />
								</view>
							</view>
						</tn-form-item>
						<tn-form-item prop="smsCaptcha" :borderBottom="false">
							<view
								class="login__info__item__input tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-left">
								<view class="login__info__item__input__left-icon">
									<view class="tn-icon-safe"></view>
								</view>
								<view
									class="login__info__item__input__content login__info__item__input__content--verify-code">
									<input v-model="form.smsCaptcha" placeholder-class="input-placeholder"
										placeholder="请输入验证码" />
								</view>
								<view class="login__info__item__input__right-verify-code" @tap.stop="getCode">
									<tn-button backgroundColor="#01BEFF" fontColor="#FFFFFF" size="sm"
										padding="5rpx 10rpx" width="100%" shape="round">{{ tips }}</tn-button>
								</view>
							</view>
						</tn-form-item>
						<tn-form-item prop="password" :borderBottom="false">
							<view
								class="login__info__item__input tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-left">
								<view class="login__info__item__input__left-icon">
									<view class="tn-icon-safe"></view>
								</view>
								<view class="login__info__item__input__content">
									<input v-model="form.password" :password="!showPassword"
										placeholder-class="input-placeholder" placeholder="请输入新密码" />
								</view>
								<view class="login__info__item__input__right-icon"
									@click="showPassword = !showPassword">
									<view :class="[showPassword ? 'tn-icon-eye' : 'tn-icon-eye-hide']"></view>
								</view>
							</view>
						</tn-form-item>
						<tn-form-item prop="confirmPassword" :borderBottom="false">
							<view
								class="login__info__item__input tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-left">
								<view class="login__info__item__input__left-icon">
									<view class="tn-icon-safe"></view>
								</view>
								<view class="login__info__item__input__content">
									<input v-model="form.confirmPassword" :password="!confirmShowPassword"
										placeholder-class="input-placeholder" placeholder="请再次输入新密码" />
								</view>
								<view class="login__info__item__input__right-icon"
									@click="confirmShowPassword = !confirmShowPassword">
									<view :class="[confirmShowPassword ? 'tn-icon-eye' : 'tn-icon-eye-hide']"></view>
								</view>
							</view>
						</tn-form-item>
					</tn-form>

					<view class="login__info__item__button tn-bg-blue--dark tn-color-white" hover-class="tn-hover"
						:hover-stay-time="150" @click="forgetValid()">登录</view>
					<view>
						<view class="tn-flex tn-flex-row-between tn-padding">
							<view @tap.stop="tnLogin()">前往登录</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 底部背景图片-->
			<view class="login__bg login__bg--bottom">
				<image src="https://resource.tuniaokj.com/images/login/2/login-bottom2.png" mode="widthFix"></image>
			</view>
		</view>
		<!-- 验证码倒计时 -->
		<tn-verification-code ref="code" uniqueKey="login-demo-4" :seconds="60" @change="codeChange">
		</tn-verification-code>
	</view>
</template>

<script>
	import forget from '@/api/auth/forget';
	import login from '@/api/auth/login';
	import staff from '@/api/security/staff';
	import {
		setMerchantInfo,
		setMerchantStoreInfo,
		setTokenInfo,
		setUserInfo
	} from '@/common/cacheSync';
	import config from '@/common/config';
	import mixin from '@/common/mixin';
	export default {
		name: 'login',
		mixins: [mixin],
		data() {
			return {
				// 当前选中的模式
				currentModeIndex: 0,
				// 是否显示密码
				showPassword: false,
				confirmShowPassword: false,
				// 倒计时提示文字
				tips: '获取验证码',
				form: {
					phone: '',
					smsCaptcha: '',
					password: '',
					confirmPassword: ''
				},
				rules: {
					'phone': {
						required: true,
						message: '请填写手机号',
						trigger: ['blur', 'change']
					},
					'smsCaptcha': {
						required: true,
						message: '请填写短信验证码',
						trigger: ['blur', 'change']
					},
					'password': {
						required: true,
						message: '请填写新密码',
						trigger: ['blur', 'change']
					},
					'confirmPassword': [{
						required: true,
						message: '请再次填写新密码',
						trigger: ['blur', 'change']
					}, {
						validator: (rule, value, callback) => {
							if (value === this.form.password) {
								return true
							}
							return false
						},
						message: '两次密码输入不一致',
						trigger: ['change', 'blur'],
					}]
				}
			}
		},
		onReady() {
			this.$refs.formRef.setRules(this.rules);
		},
		methods: {
			// 获取验证码
			getCode() {
				if (!this.form.phone) {
					this.$tn.message.toast('请输入手机号')
					return
				}
				if (this.$refs.code.canGetCode) {
					this.$tn.message.loading('正在获取验证码')
					forget.smsCaptcha(this.form.phone).then(res => {
						this.$tn.message.closeLoading()
						this.$tn.message.toast('验证码已经发送')
						// 通知组件开始计时
						this.$refs.code.start()
					})
				} else {
					this.$tn.message.toast(this.$refs.code.secNum + '秒后再重试')
				}
			},
			// 获取验证码倒计时被修改
			codeChange(event) {
				this.tips = event
			},
			forgetValid() {
				this.$refs.formRef.validate(valid => {
					if (valid) {
						this.toForget()
					} else {
						// 验证失败
						console.log(error)
					}
				})
			},
			toForget() {
				forget.smsCaptchaReset(this.form).then(res => {
					this.$refs.tips.show({
						msg: '密码重置成功',
						backgroundColor: '#31C9E8',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					setTimeout(function() {
						uni.reLaunch({
							url: '/pages/login'
						})
					}, 1500)
				})
			},
			tnLogin() {
				uni.reLaunch({
					url: '/pages/login'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login {
		position: relative;
		height: 100%;
		z-index: 1;

		/* 背景图片 start */
		&__bg {
			z-index: -1;
			position: fixed;

			&--top {
				top: 0;
				left: 0;
				right: 0;
				width: 100%;

				.bg {
					width: 750rpx;
					will-change: transform;
				}
			}

			&--bottom {
				bottom: -10rpx;
				left: 0;
				right: 0;
				width: 100%;
				// height: 144px;
				margin-bottom: env(safe-area-inset-bottom);

				image {
					width: 750rpx;
					will-change: transform;
				}
			}
		}

		/* 背景图片 end */

		/* 内容 start */
		&__wrapper {
			padding-top: 200rpx;
			width: 100%;
		}

		/* 切换 start */
		&__mode {
			position: relative;
			margin: 0 auto;
			width: 476rpx;
			height: 77rpx;
			margin-top: 100rpx;
			background-color: rgba(255, 255, 255, 0.6);
			box-shadow: 0rpx 10rpx 50rpx 0rpx rgba(0, 3, 72, 0.1);
			border-radius: 39rpx;

			&__item {
				height: 77rpx;
				width: 100%;
				line-height: 77rpx;
				text-align: center;
				font-size: 31rpx;
				color: #080808;
				letter-spacing: 1em;
				text-indent: 1em;
				z-index: 2;
				transition: all 0.4s;

				&--active {
					font-weight: bold;
					color: #FFFFFF;
				}
			}

			&__slider {
				position: absolute;
				height: inherit;
				width: calc(476rpx / 2);
				border-radius: inherit;
				box-shadow: 0rpx 18rpx 72rpx 18rpx rgba(0, 195, 255, 0.1);
				z-index: 1;
				transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
			}
		}

		/* 切换 end */

		/* 登录注册信息 start */
		&__info {
			margin: 30rpx 30rpx 10rpx 30rpx;
			padding-bottom: 0;
			border-radius: 20rpx;

			&__item {

				&__input {
					margin-top: 30rpx;
					width: 100%;
					height: 77rpx;
					border: 1rpx solid #E6E6E6;
					border-radius: 39rpx;

					&__left-icon {
						width: 10%;
						font-size: 44rpx;
						margin-left: 20rpx;
						color: #838383;
					}

					&__content {
						width: 80%;
						padding-left: 10rpx;

						&--verify-code {
							width: 56%;
						}

						input {
							font-size: 24rpx;
							// letter-spacing: 0.1em;
						}
					}

					&__right-icon {
						width: 10%;
						font-size: 44rpx;
						margin-right: 20rpx;
						color: #838383;
					}

					&__right-verify-code {
						width: 34%;
						margin-right: 20rpx;
					}
				}

				&__button {
					margin: 40rpx 0;
					width: 100%;
					height: 77rpx;
					text-align: center;
					font-size: 31rpx;
					font-weight: bold;
					line-height: 77rpx;
					letter-spacing: 1em;
					text-indent: 1em;
					border-radius: 39rpx;
					box-shadow: 1rpx 10rpx 24rpx 0rpx rgba(60, 129, 254, 0.35);
				}

				&__tips {
					margin: 30rpx 0;
					color: #AAAAAA;
				}
			}
		}

		/* 登录注册信息 end */

		/* 登录方式切换 start */
		&__way {
			margin: 0 auto;
			margin-top: 110rpx;

			&__item {
				&--icon {
					width: 85rpx;
					height: 85rpx;
					font-size: 80rpx;
					// border-radius: 100rpx;
					margin-bottom: 18rpx;
					position: relative;
					z-index: 1;
				}
			}
		}

		/* 登录方式切换 end */
		/* 内容 end */
	}

	/deep/.input-placeholder {
		font-size: 24rpx;
		color: #838383;
	}
</style>