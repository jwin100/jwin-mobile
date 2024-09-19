<template>
	<view class="template-classify main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<uni-nav-bar statusBar :border="false" :fixed="true" class="custom-nav" left-icon="left" leftText="返回" title="计次管理"
			@clickLeft="goBack()">
			<block slot="right">
				<view class="custom-nav__item" @click="editCounted">
					<uni-icons class="input-uni-icon" type="plusempty" size="18" color="#999" />
				</view>
			</block>
		</uni-nav-bar>
		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="tn-market--wrap">
			<!-- 分类列表和内容 -->
			<view class="tn-market__container tn-margin-top-xs">
				<scroll-view class="tn-market__box tn-width-full" scroll-y :scroll-top="scrollViewTop"
					:style="{height: scrollViewHeight + 'px'}">
					<view class="tn-market__content" v-if="countedRuleList.length>0">
						<view v-for="(item, index) in countedRuleList" :key="index" @click="editCounted(item)">
							<view class="tn-margin-bottom-xs tn-padding tn-bg-white tn-radius">
								<view
									class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center tn-padding-bottom tn-none-radius tn-border-solid-bottom">
									<view>{{item.name}}</view>
									<view>核销次数：{{item.timeTotal}}</view>
								</view>
								<view class="tn-padding-top">
									<view>
										<view v-if="item.spus.length>0">
											核销服务：
											<text v-for="spu in item.spus" :key="spu.spuId">{{spu.spuName}}</text>
										</view>
										<view v-else>核销服务：无限制服务</view>
									</view>
									<view
										class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center tn-padding-top tn-padding-bottom">
										<view>
											有效期：
											<text v-if="item.expireType===0">永久有效</text>
											<text v-else>开卡日期+{{item.expireMonth}}月</text>
										</view>
										<view>售价：￥{{item.realAmount}}</view>
									</view>
								</view>
								<view
									class="tn-flex tn-flex-flow-row tn-flex-row-right tn-flex-col-center tn-padding-top tn-none-radius tn-border-solid-top">
									<view>
										<tn-button v-if="item.status===2" backgroundColor="tn-bg-blue--dark"
											fontColor="tn-color-white" shape="round" :blockRepeatClick="true"
											@click.native.stop="enableCounted(item.id)">启用</tn-button>
										<tn-button v-if="item.status===1" backgroundColor="tn-bg-red"
											fontColor="tn-color-white" shape="round" :blockRepeatClick="true"
											@click.native.stop="disableCounted(item.id)">禁用</tn-button>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view v-else class="tn-padding-top-xl">
						<tn-empty mode="list" text="暂无预设计次卡信息"></tn-empty>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import countedRule from '../../../api/market/countedRule'
	import stockStore from '../../../api/stock/stockStore'
	import {
		CommonStatus
	} from '../../../common/enums/commonStatus'
	import mixin from '../../../common/mixin'
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
				countedRuleList: [],
				countedInfo: {},
				customNavbarHeight: 0,
				// scrollView的高度
				scrollViewHeight: 0,
				// scrollView的滚动高度
				scrollViewTop: 0,
			}
		},
		mounted() {
			this.getCountedRuleList()
			this.$nextTick(() => {
				this.getScrollViewInfo()
			})
		},
		methods: {
			// 获取scrollView的高度信息
			async getScrollViewInfo() {
				const customNavbar = await mixin.methods.getRect(this, '.custom-nav')
				const systemInfo = uni.getSystemInfoSync()
				this.customNavbarHeight = customNavbar.height
				this.scrollViewTop = systemInfo.statusBarHeight
				this.scrollViewHeight = systemInfo.windowHeight - customNavbar.height
			},
			refresh() {
				this.getCountedRuleList()
			},
			getCountedRuleList() {
				countedRule.timeCardRuleList().then(res => {
					this.countedRuleList = res.data || []
				})
			},
			editCounted(item) {
				const id = item?.id || ''
				uni.navigateTo({
					url: `/view/market/counted/edit?id=${id}`
				})
			},
			enableCounted(id) {
				countedRule.timeCardRuleChangeStatus(id, CommonStatus.enable).then(res => {
					this.$refs.tips.show({
						msg: '已启用',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					this.getCountedRuleList()
				})
			},
			disableCounted(id) {
				countedRule.timeCardRuleChangeStatus(id, CommonStatus.disable).then(res => {
					this.$refs.tips.show({
						msg: '已禁用',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					this.getCountedRuleList()
				})
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