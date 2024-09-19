<template>
	<view class="template-product main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar statusBar class="custom-nav" :fixed="true" :border="false" title="会员详情" left-icon="left"
			left-text="返回" @clickLeft="goBack(true)">
		</uni-nav-bar>

		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="member--wrap">
			<view class="tn-classify__container tn-flex tn-flex-nowrap tn-flex-row-around tn-margin-top-xs">
				<scroll-view class="tn-radius" :scroll-top="scrollViewBasicTop" scroll-y scroll-with-animation
					:style="{height: scrollViewHeight + 'px'}">
					<view class="tn-padding tn-bg-white">
						<view class="tn-flex tn-flex-row-left tn-flex-col-center tn-margin-bottom">
							<view class="image-article tn-margin-right-sm">
								<image v-if="memberHeadPath" :src="memberHeadPath" mode="widthFix"
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
						<view
							class="tn-flex tn-flex-col-center tn-flex-row-between tn-padding-top tn-padding-left-xs tn-padding-right-xs">
							<view class="">
								<view class="tn-flex tn-flex-direction-column tn-flex-row-center tn-flex-col-center"
									@click="goRecharge">
									<text>{{memberInfo.nowRecharge || 0}}</text>
									<view class="tn-margin-top-xs tn-content-color tn-text-center">
										<text>储值</text>
									</view>
								</view>
							</view>
							<view class="">
								<view class="tn-flex tn-flex-direction-column tn-flex-row-center tn-flex-col-center">
									<text>{{memberInfo.nowIntegral || 0}}</text>
									<view class="tn-margin-top-xs tn-content-color tn-text-center">
										<text>积分</text>
									</view>
								</view>
							</view>
							<view class="">
								<view class="tn-flex tn-flex-direction-column tn-flex-row-center tn-flex-col-center"
									@click="goCounted">
									<text>{{memberInfo.counted || 0}}</text>
									<view class="tn-margin-top-xs tn-content-color tn-text-center">
										<text>计次卡</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<!-- <view class="tn-margin-top-xs tn-padding tn-bg-white">
						<view class="tn-flex tn-flex-row-between">
							<view class="justify-content-item tn-text-bold tn-text-lg">
								会员标签
							</view>
						</view>
						<view class="tn-tag-content tn-text-justify">
							<view v-for="(item, index) in tagList" :key="index"
								class="tn-tag-content__item tn-margin-right tn-round tn-text-sm tn-text-bold"
								:class="[`tn-bg-${item.color}--light tn-color-${item.color}`]">
								<text class="tn-tag-content__item--prefix">#</text> {{ item.title }}
							</view>
						</view>
					</view> -->
					<view class="tn-margin-top-xs tn-padding tn-bg-white">
						会员订单
					</view>
				</scroll-view>
			</view>
			<tn-modal v-model="deleteConfirmShow" :title="deleteConfirmTitle" :content="deleteConfirmContent"
				:button="deleteConfirmBtn" @click="deleteMember"></tn-modal>
		</view>
		<view class="footerfixed tabbar tn-flex tn-flex-col-center tn-flex-row-between">
			<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
				<tn-button backgroundColor="tn-bg-red" fontColor="tn-color-red" style="width: 100%;" shape="round"
					:plain="true" :blockRepeatClick="true" @click="deleteConfirmShow=true">删除</tn-button>
			</view>
			<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
				<tn-button backgroundColor="tn-bg-blue--dark" fontColor="tn-color-white" style="width: 100%;"
					shape="round" :blockRepeatClick="true" @click="editMember">编辑</tn-button>
			</view>
		</view>
	</view>
</template>

<script>
	import spu from '../../api/goods/spu'
	import member from '../../api/member/member'
	import config from '../../common/config'
	import mixin from '../../common/mixin'
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
				scrollViewBasicTop: 0,
				// scrollView的高度
				scrollViewHeight: 0,
				specTitleWidth: 0,
				id: '',
				memberInfo: {},
				memberHeadPath: '',
				tagList: [{
						color: 'red',
						title: "酷炫",
					},
					{
						color: 'cyan',
						title: "设计",
					},
					{
						color: 'blue',
						title: "图鸟",
					},
					{
						color: 'green',
						title: "互联网",
					},
					{
						color: 'orange',
						title: "免费",
					},
					{
						color: 'purplered',
						title: "配色",
					},
					{
						color: 'purple',
						title: "软件开发",
					},
					{
						color: 'brown',
						title: "插画",
					},
					{
						color: 'yellowgreen',
						title: "C4D",
					},
					{
						color: 'grey',
						title: "海报",
					}
				],
				deleteConfirmShow: false,
				deleteConfirmTitle: '删除确认',
				deleteConfirmContent: '确认删除此会员吗，删除后会员所有相关信息将消失',
				deleteConfirmBtn: [{
						text: '取消',
						backgroundColor: '#E6E6E6',
						plain: true,
						shape: 'round'
					},
					{
						text: '删除',
						backgroundColor: 'tn-bg-red',
						fontColor: '#FFFFFF'
					}
				]
			}
		},
		onLoad(option) {
			this.id = option.id
		},
		mounted() {
			this.getMemberInfo()
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
				this.scrollViewBasicTop = systemInfo.statusBarHeight
				this.scrollViewHeight = systemInfo.windowHeight - customNavbar.height -
					footerFixed.height - uni.upx2px(20)
			},
			refresh() {
				this.getMemberInfo()
			},
			getMemberInfo() {
				member.memberInfo(this.id).then(res => {
					this.memberInfo = res.data
					if (this.memberInfo.headPath) {
						this.memberHeadPath = config.pictureUrl + this.memberInfo.headPath
					}
				})
			},
			deleteMember(item) {
				if (item.index === 0) {
					this.deleteConfirmShow = false
					return
				}
				// 判断是否可以删除
				if (!this.memberInfo.nowRecharge > 0) {
					this.$refs.tips.show({
						msg: '会员有储值金额未使用，不能删除',
						backgroundColor: '#FFA726',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					return;
				}
				member.memberDelete(this.id).then(() => {
					this.$refs.tips.show({
						msg: '添加成功',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					setTimeout(function() {
						mixin.methods.goBack(true)
					}, 1500)
				})
			},
			editMember() {
				uni.navigateTo({
					url: `/view/member/edit?id=${this.id}`
				})
			},
			goRecharge() {
				uni.navigateTo({
					url: `/view/cashier/recharge?id=${this.id}`
				})
			},
			goCounted() {
				uni.navigateTo({
					url: `/view/member/counted?id=${this.id}`
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
			width: 100rpx;
		}

		.image-default-pic {
			width: 50rpx;
		}
	}

	/* 标签内容 start*/
	.tn-tag-content {
		&__item {
			display: inline-block;
			line-height: 45rpx;
			padding: 10rpx 30rpx;
			margin: 20rpx 20rpx 5rpx 0rpx;

			&--prefix {
				padding-right: 10rpx;
			}
		}
	}
</style>