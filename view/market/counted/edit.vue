<template>
	<view class="template-product main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar statusBar class="custom-nav" :border="false" :fixed="true" title="计次开卡" leftIcon="left"
			leftText="返回" @clickLeft="goBack()">
		</uni-nav-bar>
		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="tn-counted--wrap">
			<view class="tn-classify__container tn-flex tn-flex-nowrap tn-flex-row-around tn-margin-top-xs">
				<scroll-view class="tn-radius" :scroll-top="scrollViewTop" scroll-y scroll-with-animation
					:style="{height: scrollViewHeight + 'px'}">
					<view class="tn-padding tn-bg-white">
						<tn-form :model="countedInfo" ref="countedInfoRef" :errorType="['message']" :labelWidth="180"
							labelAlign="right">
							<tn-form-item label="名称：" prop="name" :required="true">
								<tn-input v-model="countedInfo.name" placeholder="名称" />
							</tn-form-item>
							<tn-form-item label="期限：" prop="expireType" :required="true">
								<view class="tn-flex tn-flex-flow-column">
									<tn-radio-group v-model="countedInfo.expireType" @change="expireTypeChange">
										<tn-radio name="0">
											永久有效
										</tn-radio>
										<tn-radio name="1">
											指定日期
										</tn-radio>
									</tn-radio-group>
									<view class="tn-flex tn-flex-flow-row tn-flex-col-center tn-margin-top-sm">
										开卡日期至
										<tn-input v-model="countedInfo.expireMonth" style="width: 150rpx;"
											class="tn-margin-left-sm tn-margin-right-sm" :border="true" type="number"
											placeholder="月数" />
										个月
									</view>
								</view>
							</tn-form-item>
							<tn-form-item label="名称：" prop="name" :required="true">
								<tn-input v-model="countedInfo.name" placeholder="名称" />
							</tn-form-item>
							<tn-form-item label="计次次数：" prop="timeTotal" :required="true">
								<tn-input v-model="countedInfo.timeTotal" type="number" placeholder="计次次数" />
							</tn-form-item>
							<tn-form-item label="售价：" prop="realAmount" :required="true">
								<tn-input v-model="countedInfo.realAmount" type="number" placeholder="售价(元)" />
							</tn-form-item>
							<tn-form-item label="赠送积分：" prop="giveIntegral">
								<tn-input v-model="countedInfo.giveIntegral" type="number" placeholder="赠送积分" />
							</tn-form-item>
							<tn-form-item label="服务项目：" prop="giveIntegral">
								<tn-input v-model="countedInfo.spuNames" type="select" @click="countedSpuShow=true"
									placeholder="服务项目" />
								<tn-select v-model="countedSpuShow" mode="single" :list="countedSpuList"
									:safeAreaInsetBottom="true" @confirm="countedSpuConfirm"></tn-select>
							</tn-form-item>
						</tn-form>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="footerfixed tabbar tn-flex tn-flex-col-center tn-flex-row-between">
			<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
				<tn-button backgroundColor="tn-bg-red" fontColor="tn-color-white" style="width: 100%;" shape="round"
					:blockRepeatClick="true" @click="deleteCounted">删除</tn-button>
			</view>
			<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
				<tn-button backgroundColor="tn-bg-blue--dark" fontColor="tn-color-white" style="width: 100%;"
					shape="round" :blockRepeatClick="true" @click="submitGoods">保存</tn-button>
			</view>
		</view>
	</view>
</template>

<script>
	import countedRule from '../../../api/market/countedRule'
	import stockStore from '../../../api/stock/stockStore'
	import mixin from '../../../common/mixin'
	export default {
		name: 'TemplateProduct',
		mixins: [mixin],
		data() {
			return {
				tips: {
					type: 'success',
					mask: false,
					message: '提示',
					duration: 2000
				},
				customNavbarHeight: 0,
				// scrollView的top值
				scrollViewTop: 0,
				// scrollView的高度
				scrollViewHeight: 0,
				id: '',
				countedInfo: {
					name: '',
					expireType: 0,
					expireMonth: 0,
					timeTotal: 0,
					realAmount: 0,
					spuIds: [],
					spuNames: '',
					giveIntegral: 0
				},
				countedSpuShow: false,
				countedSpuList: [],
				rules: {
					name: [{
						required: true,
						message: '请输入计次卡名称',
						trigger: ['change', 'blur'],
					}],
					expireType: [{
						validator: (rule, value, callback) => {
							if (value >= 0) {
								return true
							}
							return false
						},
						message: '请选择计次卡期限分类',
						trigger: ['change', 'blur'],
					}, {
						validator: (rule, value, callback) => {
							if (value === 1 && !this.countedInfo.expireMonth) {
								return false
							}
							return true
						},
						message: '请输入期限时长',
						trigger: ['change', 'blur'],
					}],
					timeTotal: [{
						validator: (rule, value, callback) => {
							if (value > 0) {
								return true
							}
							return false
						},
						message: '请输入计次次数',
						trigger: ['change', 'blur'],
					}],
					realAmount: [{
						validator: (rule, value, callback) => {
							if (value > 0) {
								return true
							}
							return false
						},
						message: '请输入售价',
						trigger: ['change', 'blur'],
					}]
				}
			}
		},
		onReady() {
			this.$refs.countedInfoRef.setRules(this.rules)
		},
		onLoad(option) {
			this.id = option.id
		},
		mounted() {
			this.getCountedSpuList()
			if (this.id) {
				this.getCountedInfo()
			}
			this.$nextTick(() => {
				this.getScrollViewInfo()
			})
		},
		methods: {
			async getScrollViewInfo() {
				const customNavbar = await mixin.methods.getRect(this, '.custom-nav')
				const footerFixed = await mixin.methods.getRect(this, '.footerfixed')
				const systemInfo = uni.getSystemInfoSync()
				this.customNavbarHeight = customNavbar.height
				this.scrollViewBasicTop = systemInfo.statusBarHeight
				this.scrollViewHeight = systemInfo.windowHeight - customNavbar.height -
					footerFixed.height
			},
			getCountedSpuList() {
				stockStore.stockSpuCountedList().then(res => {
					if (res.data.length <= 0) {
						this.countedSpuList = []
						return
					}
					this.countedSpuList = res.data.map(x => {
						return {
							label: x.name,
							value: x.id
						}
					})
				})
			},
			getCountedInfo() {
				countedRule.timeCardRuleInfo(this.id).then(res => {
					const data = res.data
					this.countedInfo = {
						name: data.name,
						expireType: data.expireType,
						expireMonth: data.expireMonth,
						timeTotal: data.timeTotal,
						realAmount: data.realAmount,
						spuIds: data.spuIds,
						spuNames: data.spus.map(x => x.spuName).join(','),
						giveIntegral: data.giveIntegral
					}
					console.log(this.countedInfo.spuIds)
					this.$refs.countedInfoRef.resetFields()
				})
			},
			expireTypeChange(e) {
				this.countedInfo.expireType = Number(e)
			},
			countedSpuConfirm(list) {
				if (list.length > 0) {
					const item = list[0]
					this.countedInfo.spuIds = [item.value]
					this.countedInfo.spuNames = item.label
				}
			},
			deleteCounted() {
				countedRule.timecardruled(this.id).then(res => {
					this.$refs.tips.show({
						msg: '已删除',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					setTimeout(function() {
						mixin.methods.goBack(true)
					}, 1500)
				})
			},
			submitGoods() {
				this.$refs.countedInfoRef.validate(valid => {
					console.log(valid)
					if (valid) {
						if (this.id) {
							this.edit()
						} else {
							this.save()
						}
					} else {
						this.$refs.tips.show({
							msg: '请先填写完整计次卡信息',
							backgroundColor: '#FFA726',
							fontColor: '#FFFFFF',
							duration: 1500
						})
					}
				})
			},
			save() {
				countedRule.timeCardRuleCreate(this.countedInfo).then(res => {
					this.$refs.tips.show({
						msg: '保存成功',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					setTimeout(function() {
						mixin.methods.goBack(true)
					}, 1500)
				})
			},
			edit() {
				countedRule.timeCardRuleEdit(this.id, this.countedInfo).then(res => {
					this.$refs.tips.show({
						msg: '保存成功',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					setTimeout(function() {
						mixin.methods.goBack(true)
					}, 1500)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tn-counted {
		&--wrap {
			position: fixed;
			left: 0;
			right: 0;
			width: 100%;
			z-index: 2;
			background-color: inherit;
		}
	}
</style>