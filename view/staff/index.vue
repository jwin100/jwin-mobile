<template>
	<view class="template-classify main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<uni-nav-bar statusBar :border="false" :fixed="true" class="custom-nav" left-icon="left" leftText="返回"
			title="店员管理" @clickLeft="goBack()">
			<!-- <block slot="right">
				<view class="custom-nav__item" @click="tnAdd">
					<uni-icons class="input-uni-icon" type="plusempty" size="18" color="#999" />
				</view>
			</block> -->
		</uni-nav-bar>
		<view class="tn-market--wrap">
			<view class="tn-market__container tn-margin-top-xs">
				<scroll-view class="tn-goods__right-box tn-flex-1 tn-bg-white" :scroll-top="scrollViewTop" scroll-y
					scroll-with-animation :style="{height: scrollViewHeight + 'px'}" :refresher-enabled="true"
					:refresher-triggered="scrollRefresher" :scroll-anchoring="true" @refresherrefresh="scrollPull"
					@scrolltolower="scrolltolower">
					<view class="tn-market__content" v-if="staffList.length>0">
						<uni-list>
							<uni-list-item v-for="(item,index) in staffList" :key="index" showArrow :title="item.name"
								:rightText="item.statusName" clickable @click="tnDetail(item.id)" />
						</uni-list>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="edit tnxuanfu" @tap="tnAdd()">
			<view
				class="icon12__item--icon tn-shadow-blur tn-flex tn-flex-row-center tn-flex-col-center tn-main-gradient-blue--light tn-color-blue--dark">
				<view class="tn-icon-add">
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import store from '../../api/merchant/store'
	import staff from '../../api/security/staff'
	import mixin from '../../common/mixin'
	export default {
		name: 'staffIndex',
		mixins: [mixin],
		data() {
			return {
				searchParams: {
					searchKey: '',
					pageIndex: 1,
					pageSize: 20,
				},
				pageTotal: 1,
				staffList: [],
				customNavbarHeight: 0,
				scrollViewTop: 0,
				scrollViewHeight: 0,
				scrollRefresher: false
			}
		},
		mounted() {
			this.scrollPull()
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
				this.scrollViewHeight = systemInfo.windowHeight - customNavbar.height -
					uni.upx2px(20)
			},
			refresh() {
				this.scrollPull()
			},
			scrolltolower() {
				this.searchParams.pageIndex += 1
				this.getStaffPage()
			},
			scrollPull() {
				if (this.scrollRefresher) {
					return
				}
				this.searchParams.pageIndex = 1
				this.scrollRefresher = true
				setTimeout(() => {
					this.getStaffPage()
				}, 500)
			},
			getStaffPage() {
				staff.accountPage(this.searchParams).then(res => {
					if (this.searchParams.pageIndex === 1) {
						this.staffList = []
						this.pageTotal = 1
					}
					if (res.data.rows > 0) {
						res.data.data.forEach(x => {
							this.staffList.push(x)
						})
						this.pageTotal = res.data.total
					}
				}).finally(() => {
					this.scrollRefresher = false
				})
			},
			tnDetail(id) {
				uni.navigateTo({
					url: `/view/staff/detail?id=${id}`
				})
			},
			tnAdd() {
				uni.navigateTo({
					url: '/view/staff/add'
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