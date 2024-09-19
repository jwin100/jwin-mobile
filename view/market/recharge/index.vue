<template>
	<view class="template-classify main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<uni-nav-bar statusBar :border="false" :fixed="true" class="custom-nav" left-icon="left" leftText="返回" title="储值管理"
			@clickLeft="goBack()">
			<block slot="right">
				<view class="custom-nav__item" @click="editRecharge">
					<uni-icons class="input-uni-icon" type="plusempty" size="18" color="#999" />
				</view>
			</block>
		</uni-nav-bar>
		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="tn-market--wrap">
			<view class="tn-market__container tn-margin-top-xs">
				<scroll-view class="tn-market__box tn-width-full" scroll-y :scroll-top="scrollViewTop"
					:style="{height: scrollViewHeight + 'px'}">
					<view class="tn-market__content" v-if="rechargeRuleList.length>0">
						<view class="tn-border-solid-bottom tn-padding">
							<text class="tn-color-gray--dark tn-icon-signpost" style="line-height: 40rpx;">
								<text class="tn-margin-left-xs">
									通过储值赠送活动吸引会员充值，锁定会员消费，扩大获客渠道。
								</text>
							</text>
						</view>
						<view v-for="(item, index) in rechargeRuleList" :key="index" @click="editRecharge(item)">
							<view class="tn-margin-bottom-xs tn-padding tn-bg-white tn-radius">
								<view
									class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center tn-padding-bottom tn-none-radius tn-border-solid-bottom">
									<view>充值金额：￥{{item.realAmount}}</view>
									<view>赠送金额：{{item.giveAmount}}</view>
								</view>
								<view class="tn-padding-top">
									<view class="tn-flex tn-flex-flow-row tn-flex-row-right tn-flex-col-center">
										<view>
											<tn-button v-if="item.status===2" backgroundColor="tn-bg-blue--dark"
												fontColor="tn-color-white" shape="round" :blockRepeatClick="true"
												@click.native.stop="enableRecharge(item.id)">启用</tn-button>
											<tn-button v-if="item.status===1" backgroundColor="tn-bg-red"
												fontColor="tn-color-white" shape="round" :blockRepeatClick="true"
												@click.native.stop="disableRecharge(item.id)">禁用</tn-button>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view v-else class="tn-padding-top-xl">
						<tn-empty mode="list" text="暂无预设储值金额"></tn-empty>
					</view>
				</scroll-view>
			</view>
			<tn-popup v-model="editRechargeShow" mode="bottom" :safeAreaInsetBottom="true" :borderRadius="5"
				:closeBtn="true" closeBtnIcon="left" closeBtnPosition="top-left" :negativeTop="10" :marginTop="60"
				@close="rechargePopupClose">
				<view
					class="tn-flex tn-flex-col-center tn-flex-row-center tn-flex-row-between tn-text-xl tn-border-solid-bottom"
					style="height: 90rpx; width: 100%; padding: 0 30rpx;">
					<view class="tn-text-bold">储值规则配置</view>
				</view>
				<scroll-view scroll-y="true">
					<view style="padding: 16px">
						<tn-tips ref="rechargeTips" position="top"></tn-tips>
						<tn-form :model="rechargeInfo" ref="rechargeInfoRef" :errorType="['message']" :labelWidth="180"
							labelAlign="right">
							<tn-form-item label="充值金额：" prop="realAmount" :required="true">
								<tn-input v-model="rechargeInfo.realAmount" type="number" placeholder="充值金额(元)" />
							</tn-form-item>
							<tn-form-item label="赠送金额：" prop="giveAmount">
								<tn-input v-model="rechargeInfo.giveAmount" type="number" placeholder="赠送金额(元)" />
							</tn-form-item>
						</tn-form>
					</view>
				</scroll-view>
				<view class="tn-padding tn-flex tn-flex-col-center tn-flex-row-between">
					<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
						<tn-button backgroundColor="tn-bg-red" fontColor="tn-color-red" style="width: 100%;"
							:shadow="true" shape="round" :plain="true" :blockRepeatClick="true"
							@click="deleteRecharge(rechargeInfo.id)">删除</tn-button>
					</view>
					<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
						<tn-button backgroundColor="tn-bg-indigo" fontColor="tn-color-white" style="width: 100%;"
							:shadow="true" shape="round" :blockRepeatClick="true" @click="submitRecharge">保存</tn-button>
					</view>
				</view>
			</tn-popup>
		</view>
	</view>
</template>

<script>
	import category from '@/api/goods/category.js'
	import stockStore from '@/api/stock/stockStore.js'
	import member from '@/api/member/member'
	import rechargeRule from '../../../api/market/rechargeRule'
	import mixin from '../../../common/mixin'
	import {
		CommonStatus
	} from '../../../common/enums/commonStatus'
	export default {
		name: 'templateShopClassify',
		mixins: [mixin],
		data() {
			return {
				tips: {
					type: 'success',
					mask: false,
					message: '提示',
					duration: 2000
				},
				searchParams: {
					searchKey: ''
				},
				rechargeRuleList: [],
				rechargeInfo: {},
				customNavbarHeight: 0,
				scrollViewHeight: 0,
				scrollViewTop: 0,
				scrollViewWidth: 0,
				titleWidth: 0,
				editRechargeShow: false

			}
		},
		created() {
			this.getRechargeRuleList()
		},
		mounted() {
			this.$nextTick(() => {
				this.getScrollViewInfo()
			})
		},
		methods: {
			getRechargeRuleList() {
				rechargeRule.rechargeRuleList().then(res => {
					this.rechargeRuleList = res.data || []
				})
			},
			async getScrollViewInfo() {
				const customNavbar = await mixin.methods.getRect(this, '.custom-nav')
				const systemInfo = uni.getSystemInfoSync()
				this.customNavbarHeight = customNavbar.height
				this.scrollViewTop = systemInfo.statusBarHeight
				this.scrollViewHeight = systemInfo.windowHeight - customNavbar.height
			},
			editRecharge(item) {
				if (item) {
					this.rechargeInfo = JSON.parse(JSON.stringify(item))
				}
				this.editRechargeShow = !this.editRechargeShow
			},
			rechargePopupClose() {
				this.rechargeInfo = {}
			},
			enableRecharge(id) {
				rechargeRule.rechargeRuleChangeStatus(id, CommonStatus.enable).then(res => {
					this.$refs.tips.show({
						msg: '已启用',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					this.getRechargeRuleList()
				})
			},
			disableRecharge(id) {
				rechargeRule.rechargeRuleChangeStatus(id, CommonStatus.disable).then(res => {
					this.$refs.tips.show({
						msg: '已禁用',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					this.getRechargeRuleList()
				})
			},
			deleteRecharge(id) {
				rechargeRule.rechargeRuleDelete(id).then(res => {
					this.$refs.tips.show({
						msg: '已删除',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					this.getRechargeRuleList()
				})
			},
			submitRecharge() {
				if (!this.rechargeInfo.realAmount) {
					this.$refs.tips.show({
						msg: '请填写储值金额',
						backgroundColor: '#FFA726',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					return;
				}
				const findIndex = this.rechargeRuleList.findIndex(x => x.realAmount === this.rechargeInfo.realAmount)
				if (findIndex >= 0) {
					const item = this.rechargeRuleList[findIndex]
					if (item.id !== this.rechargeInfo.id) {
						this.$refs.tips.show({
							msg: '储值金额不能重复',
							backgroundColor: '#FFA726',
							fontColor: '#FFFFFF',
							duration: 1500
						})
						return;
					}
				}
				if (this.rechargeInfo.id) {
					rechargeRule.rechargeRuleEdit(this.rechargeInfo.id, this.rechargeInfo).then(res => {
						this.$refs.tips.show({
							msg: '保存成功',
							backgroundColor: '#3D7EFF',
							fontColor: '#FFFFFF',
							duration: 1500
						})
					}).finally(() => {
						this.getRechargeRuleList()
						this.editRechargeShow = false
					})
				} else {
					rechargeRule.rechargeRuleCreate(this.rechargeInfo).then(res => {
						this.$refs.tips.show({
							msg: '保存成功',
							backgroundColor: '#3D7EFF',
							fontColor: '#FFFFFF',
							duration: 1500
						})
					}).finally(() => {
						this.getRechargeRuleList()
						this.editRechargeShow = false
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tn-market {
		&--wrap {
			position: fixed;
			left: 0;
			right: 0;
			width: 100%;
			background-color: inherit;
		}
	}
</style>