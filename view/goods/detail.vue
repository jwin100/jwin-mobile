<template>
	<view class="template-product main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar class="custom-nav" statusBar :fixed="true" :border="false" title="商品详情" left-icon="left"
			left-text="返回" @clickLeft="goBack(true)">
		</uni-nav-bar>
		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="goods--wrap">
			<view class="tn-classify__container">
				<scroll-view class="tn-bg-white tn-margin-top-xs tn-margin-bottom-xs" :scroll-top="scrollViewTop"
					scroll-y scroll-with-animation :style="{height: scrollViewHeight + 'px'}">
					<tn-scroll-list
						class="tn-padding-left-sm tn-padding-right-sm tn-padding-top tn-border-solid-bottom">
						<view class="tn-flex" v-if="pictureList && pictureList.length>0">
							<block v-for="(item, index) in pictureList" :key="index">
								<view class="image-article"
									:style="{marginLeft:pictureMargin+'px',marginRight:pictureMargin+'px'}">
									<image :src="item" mode="aspectFit" class="image-pic" />
								</view>
							</block>
						</view>
						<view class="tn-flex" v-else>
							<view class="image-article"
								:style="{marginLeft:pictureMargin+'px',marginRight:pictureMargin+'px'}">
								<image src="@/static/img/goods/default-goods-manage.png" mode="widthFix"
									class="image-default-pic" />
							</view>
						</view>
					</tn-scroll-list>
					<tn-list-view>
						<view class="tn-padding tn-flex tn-flex-row-between tn-border-solid-bottom">
							<view class="tn-text-bold tn-text-xl">
								基本信息
							</view>
						</view>
						<tn-list-cell :hover="true">
							<view class="tn-flex tn-flex-col-center">
								<view class="tn-flex-1">商品名称</view>
								<view class="tn-margin-left-sm" style="font-size: 28rpx;">{{goodsInfo.name}}</view>
							</view>
						</tn-list-cell>
						<tn-list-cell :hover="true">
							<view class="tn-flex tn-flex-col-center">
								<view class="tn-flex-1">分类</view>
								<view class="tn-margin-left-sm" style="font-size: 28rpx;">{{goodsInfo.categoryName}}
								</view>
							</view>
						</tn-list-cell>
						<tn-list-cell :hover="true">
							<view class="tn-flex tn-flex-col-center">
								<view class="tn-flex-1">条码</view>
								<view class="tn-margin-left-sm" style="font-size: 28rpx;">{{goodsInfo.spuNo}}</view>
							</view>
						</tn-list-cell>
						<tn-list-cell :hover="true">
							<view class="tn-flex tn-flex-col-center">
								<view class="tn-flex-1">单位</view>
								<view class="tn-margin-left-sm" style="font-size: 28rpx;">{{goodsInfo.unitName}}</view>
							</view>
						</tn-list-cell>
					</tn-list-view>
					<!-- <view class="tn-padding tn-margin-top-xs tn-bg-white">
						<view class="tn-flex tn-flex-row-between">
							<view class="justify-content-item tn-text-bold tn-text-lg">
								商品标签
							</view>
						</view>
						<view class="tn-tag-content tn-margin tn-text-justify">
							<view v-for="(item, index) in tagList" :key="index"
								class="tn-tag-content__item tn-margin-right tn-round tn-text-sm tn-text-bold"
								:class="[`tn-bg-${item.color}--light tn-color-${item.color}`]">
								<text class="tn-tag-content__item--prefix">#</text> {{ item.title }}
							</view>
						</view>
					</view> -->
					<view class="tn-margin-top-xs">
						<view class="tn-padding tn-flex tn-flex-row-between tn-border-solid-bottom">
							<view class="tn-text-bold tn-text-xl">
								规格信息
							</view>
						</view>
						<tn-list-view>
							<tn-list-cell :hover="true" class="specs-cell" v-for="(item, index) in goodsInfo.skus"
								:key="index">
								<view class="tn-text-ellipsis tn-text-lg">
									{{item.skuName}}
								</view>
								<view
									class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-top tn-color-gray--dark tn-text-md">
									<view>进价：￥{{item.purchaseAmount}}</view>
									<view>售价：￥{{item.referenceAmount}}</view>
									<view>重量：{{item.skuWeight}}</view>
								</view>
							</tn-list-cell>
						</tn-list-view>
					</view>
				</scroll-view>
			</view>
			<tn-modal v-model="deleteConfirmShow" :title="deleteConfirmTitle" :content="deleteConfirmContent"
				:button="deleteConfirmBtn" @click="deleteGoods"></tn-modal>
		</view>
		<view class="footerfixed tabbar tn-flex tn-flex-col-center tn-flex-row-between">
			<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
				<tn-button backgroundColor="tn-bg-red" fontColor="tn-color-red" style="width: 100%;" shape="round"
					:plain="true" :blockRepeatClick="true" @click="deleteConfirmShow=true">删除</tn-button>
			</view>
			<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
				<tn-button backgroundColor="tn-bg-blue--dark" fontColor="tn-color-white" style="width: 100%;"
					shape="round" :blockRepeatClick="true" @click="editGoods">编辑</tn-button>
			</view>
		</view>
	</view>
</template>

<script>
	import spu from '../../api/goods/spu'
	import config from '../../common/config'
	import mixin from '../../common/mixin'
	export default {
		name: 'goodsDetail',
		mixins: [mixin],
		data() {
			return {
				tips: {
					type: 'success',
					mask: false,
					message: '提示',
					duration: 2000
				},
				pictureMargin: 0,
				customNavbarHeight: 0,
				// scrollView的top值
				scrollViewTop: 0,
				// scrollView的高度
				scrollViewHeight: 0,
				specTitleWidth: 0,
				id: '',
				goodsInfo: {},
				pictureList: [],
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
				deleteConfirmContent: '确认删除此商品吗，删除后商品所有相关信息将消失',
				deleteConfirmBtn: [{
						text: '取消',
						backgroundColor: '#E6E6E6',
						plain: true,
						shape: 'round'
					},
					{
						text: '删除',
						backgroundColor: 'tn-bg-red',
						fontColor: 'tn-color-red',
						fontColor: '#FFFFFF'
					}
				]
			}
		},
		onLoad(option) {
			this.id = option.id
		},
		mounted() {
			this.getGoodsInfo()
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

				const systemWidth = systemInfo.safeArea.width - uni.upx2px(40)
				const pictureNum = Math.trunc(systemWidth / uni.upx2px(140))
				const a = systemWidth - (pictureNum * uni.upx2px(140))
				const b = a / pictureNum
				this.pictureMargin = (b + uni.upx2px(20)) / 2
				this.specTitleWidth = systemWidth - uni.upx2px(60) - uni.upx2px(30)
			},
			refresh() {
				this.getGoodsInfo()
			},
			getGoodsInfo() {
				spu.storageInfo(this.id).then(res => {
					this.goodsInfo = res.data
					if (this.goodsInfo.pictures.length > 0) {
						this.pictureList = this.goodsInfo.pictures.map(x => {
							return config.pictureUrl + x
						})
					}
				})
			},
			deleteGoods(item) {
				if (item.index === 0) {
					this.deleteConfirmShow = false
					return
				}
				// 判断是否可以删除
				let sellStockValid = true
				this.goodsInfo.skus.forEach(x => {
					if (x.sellStock > 0) {
						sellStockValid = false
						return
					}
				})
				if (!sellStockValid) {
					this.$refs.tips.show({
						msg: '商品有剩余库存，不能删除',
						backgroundColor: '#FFA726',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					return;
				}
				spu.storageDelete(this.id).then(() => {
					this.$refs.tips.show({
						msg: '删除成功',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					setTimeout(function() {
						uni.navigateBack({
							delta: 1
						})
					}, 1500)
				})
			},
			editGoods() {
				uni.navigateTo({
					url: `/view/goods/edit?id=${this.id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goods {
		&--wrap {
			position: fixed;
			left: 0;
			right: 0;
			width: 100%;
			background-color: inherit;
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

	/* 标签内容 end*/

	.image-article {
		width: 120rpx;
		height: 120rpx;
		position: relative;
		border-radius: 12rpx;
		background-color: $tn-progress-bg-color;
		display: flex;
		align-items: center;
		justify-content: center;

		.image-pic {
			width: 120rpx;
		}
		
		.image-default-pic {
			width: 70rpx;
		}
	}
</style>