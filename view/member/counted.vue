<template>
	<view class="template-product main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar statusBar class="custom-nav" :border="false" :fixed="true" title="会员计次卡" leftIcon="left"
			leftText="返回" @clickLeft="goBack()">
		</uni-nav-bar>
		<view class="member--wrap">
			<view class="tn-classify__container tn-flex tn-flex-nowrap tn-flex-row-around tn-margin-top-xs">
				<scroll-view class="tn-radius" :scroll-top="scrollViewTop" scroll-y scroll-with-animation
					:style="{height: scrollViewHeight + 'px'}">
					<view class="tn-padding tn-bg-white">
						<view class="tn-flex tn-flex-row-left tn-flex-col-center tn-margin-bottom">
							<view class="image-article tn-margin-right-sm">
								<image v-if="memberInfo.headPath" :src="memberInfo.headPath" mode="widthFix"
									class="image-pic" />
								<image v-else src="@/static/img/member/default-image-vip.png" mode="widthFix"
									class="image-default-pic" />
							</view>
							<view class="tn-flex tn-flex-direction-column tn-flex-row-between tn-height-full"
								style="height: 100rpx;">
								<view class="tn-text-lg clamp-text-1 tn-text-justify tn-text-ellipsis"
									style="font-weight: 500;">
									{{ memberInfo.name }}
								</view>
								<view class="tn-flex tn-flex-direction-row tn-flex-row-between tn-flex-col-center">
									<view class="tn-text-justify">
										<text>{{memberInfo.phone}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="tn-margin-top-xs tn-padding tn-bg-white">
						<view class="tn-market__content" v-if="memberCountedList.length>0">
							<view v-for="(item, index) in memberCountedList" :key="index"
								class="tb-bg-space tn-radius-lg tn-shadow tn-margin tn-padding"
								@click="editCounted(item)">
								<view
									class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-center tn-padding-bottom tn-none-radius tn-border-solid-bottom">
									<view>{{item.name}}</view>
									<view>剩余次数：{{item.nowTimeCard}}</view>
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
										<view>
											<tn-button backgroundColor="tn-bg-blue--dark" fontColor="tn-color-white"
												shape="round" :blockRepeatClick="true"
												@click.native.stop="tnCashierCounted(item.timeCardId)">续次</tn-button>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view v-else class="tn-padding-top-xl">
							<tn-empty mode="list" text="暂无计次卡信息"></tn-empty>
						</view>
					</view>
				</scroll-view>
			</view>
			<tn-popup v-model="countedRulePopupShow" mode="bottom" :safeAreaInsetBottom="true" :borderRadius="5"
				:closeBtn="true" :negativeTop="10" :marginTop="90">
				<view class="tn-flex tn-flex-col-center tn-flex-row-center tn-text-xl tn-border-solid-bottom"
					style="height: 90rpx; width: 100%; padding: 0 30rpx;">
					<view class="tn-text-bold tn-text-center">选择卡片</view>
				</view>
				<scroll-view scroll-y="true" :style="{height:countedRulePopupHeight+'px'}">
					<view style="padding: 15px">
						<view class="tn-market__content" v-if="countedRuleList.length>0">
							<view v-for="(item, index) in countedRuleList" :key="index"
								class="tb-bg-space tn-radius-lg tn-shadow tn-margin tn-padding"
								@click="editCounted(item)">
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
										<view>
											<tn-button backgroundColor="tn-bg-blue--dark" fontColor="tn-color-white"
												shape="round" :blockRepeatClick="true"
												@click.native.stop="tnCashierCounted(item.id)">开卡</tn-button>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view v-else class="tn-padding-top-xl">
							<tn-empty mode="list" text="暂无预设计次卡信息"></tn-empty>
						</view>
					</view>
				</scroll-view>
			</tn-popup>
		</view>
		<view class="footerfixed tabbar tn-flex tn-flex-col-center tn-flex-row-between">
			<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
				<tn-button backgroundColor="tn-bg-blue--dark" fontColor="tn-color-white" style="width: 100%;"
					shape="round" :blockRepeatClick="true" @click="countedRulePopupShow=true">开卡</tn-button>
			</view>
		</view>
	</view>
</template>

<script>
	import spu from '../../api/goods/spu'
	import member from '../../api/member/member'
	import countedRule from '../../api/market/countedRule'
	import timeCard from '../../api/member/timeCard'
	import mixin from '../../common/mixin'
	export default {
		name: 'TemplateProduct',
		mixins: [mixin],
		data() {
			return {
				customNavbarHeight: 0,
				// scrollView的top值
				scrollViewTop: 0,
				// scrollView的高度
				scrollViewHeight: 0,
				specTitleWidth: 0,
				id: '',
				memberInfo: {},
				memberCountedList: [],
				countedRuleList: [],
				countedRulePopupShow: false,
				countedRulePopupHeight: 0
			}
		},
		onLoad(option) {
			this.id = option.id
		},
		mounted() {
			this.getCountedRule()
			this.getMemberInfo()
			this.getMemberCounted()
			this.$nextTick(() => {
				this.getScrollViewInfo()
			})
		},
		methods: {
			// 获取scrollView的高度信息
			async getScrollViewInfo() {
				const customNavbar = await mixin.methods.getRect(this, '.custom-nav')
				const footerFixed = await mixin.methods.getRect(this, '.footerfixed')
				const systemInfo = uni.getSystemInfoSync()
				this.customNavbarHeight = customNavbar.height
				this.scrollViewTop = systemInfo.statusBarHeight
				this.scrollViewHeight = systemInfo.windowHeight - customNavbar.height -
					footerFixed.height - uni.upx2px(20)
				this.countedRulePopupHeight = systemInfo.safeArea.height * 0.5
			},
			refresh() {
				this.getMemberInfo()
			},
			getMemberInfo() {
				member.memberInfo(this.id).then(res => {
					this.memberInfo = res.data
				})
			},
			getMemberCounted() {
				timeCard.memberTimeCardList(this.id).then(res => {
					this.memberCountedList = res.data || []
				})
			},
			getCountedRule() {
				countedRule.timeCardRuleList().then(res => {
					this.countedRuleList = res.data || []
				})
			},
			tnCashierCounted(ruleId) {
				this.countedRulePopupShow = false
				uni.navigateTo({
					url: `/view/cashier/counted?id=${this.id}&ruleId=${ruleId}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.member {
		&--wrap {
			position: fixed;
			left: 0;
			right: 0;
			width: 100%;
			background-color: inherit;
			z-index: 2;
		}
	}

	.image-article {
		width: 100rpx;
		height: 100rpx;
		border-radius: 8rpx;
		background-color: $tn-progress-bg-color;
		display: flex;
		align-items: center;
		justify-content: center;

		.image-pic {
			width: 60rpx;
		}

		.image-default-pic {
			width: 50rpx;
		}
	}
</style>