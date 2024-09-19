<template>
	<view class="template-product main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar statusBar class="custom-nav" :fixed="true" :border="false" title="会员设置" left-icon="left"
			left-text="返回" @clickLeft="goBack">
		</uni-nav-bar>

		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="member--wrap">
			<view class="tn-classify__container tn-margin-top-xs">
				<scroll-view class="tn-radius" :scroll-top="scrollViewBasicTop" scroll-y scroll-with-animation
					:style="{height: scrollViewHeight + 'px'}">
					<view class="tn-bg-white">
						<view class="tn-padding tn-flex tn-flex-row-between tn-flex-col-center tn-border-solid-bottom">
							<view class="justify-content-item tn-text-bold tn-text-lg">
								设置会员等级
							</view>
							<view>
								<tn-button backgroundColor="tn-bg-blue--dark" fontColor="tn-color-white"
									style="width: 100%;" shape="round" :blockRepeatClick="true"
									@click="editLevel()">添加</tn-button>
							</view>
						</view>
						<view>
							<view v-if="memberLevelList.length>0" class="tn-padding-top">
								<tn-list-view :card="false">
									<tn-list-cell class="specs-cell" v-for="(item, index) in memberLevelList"
										:key="index" @click="editLevel(item,index)">
										<view class="tn-flex tn-flex-row-between tn-flex-col-center">
											<view class="tn-text-ellipsis" style="font-size: 34rpx;">
												{{item.name}}
											</view>
											<view>
												<text>积分范围：{{item.startIntegral}}-{{item.endIntegral}}</text>
											</view>
											<view>
												<text>会员折扣：{{item.discount}}</text>
											</view>
										</view>
									</tn-list-cell>
								</tn-list-view>
							</view>
							<view v-else class="tn-padding">
								<tn-empty mode="list" text="无等级信息"></tn-empty>
							</view>
						</view>
					</view>
					<view class="tn-bg-white tn-margin-top-xs">
						<view class="tn-padding tn-flex tn-flex-row-between tn-border-solid-bottom">
							<view class="justify-content-item tn-text-bold tn-text-lg">
								设置会员标签
							</view>
						</view>
						<view class="tn-tag-content tn-text-justify tn-padding">
							<view v-for="(item, index) in memberTagList" :key="index" @click="editTagOpen(item,index)"
								class="tn-tag-content__item tn-margin-right tn-round tn-text-sm tn-text-bold"
								:style="{backgroundColor:item.color,color:'#ffffff'}">
								<text class="tn-tag-content__item--prefix">#</text> {{ item.name }}
							</view>
							<view class="tn-tag-content__item tn-margin-right tn-round tn-text-sm tn-text-bold"
								style="background-color: #0d6efd; color: #ffffff;" @click="editTagOpen()">
								<text class="tn-tag-content__item--prefix">#</text> 添加标签
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<tn-popup v-model="levelSettingPopupShow" mode="bottom" :safeAreaInsetBottom="true" :borderRadius="5"
				:closeBtn="true" closeBtnIcon="left" closeBtnPosition="top-left" :negativeTop="10" :marginTop="60"
				@open="levelSettingOpen" @close="levelSettingClose">
				<scroll-view scroll-y="true" :style="{height:levelPopupHeight+'px'}">
					<view style="padding: 45px 16px 16px">
						<tn-form :model="selectMemberLevel" ref="selectMemberLevelRef" :errorType="['message']"
							:labelWidth="180" labelAlign="right">
							<tn-form-item label="等级名称：" prop="name" :required="true">
								<tn-input v-model="selectMemberLevel.name" placeholder="等级名称" />
							</tn-form-item>
							<tn-form-item label="积分范围：" prop="startIntegral">
								<tn-input v-if="selectMemberLevel.index===0" v-model="selectMemberLevel.startIntegral"
									type="number" placeholder="等级升级条件" />
								<text v-else>{{selectMemberLevel.startIntegral}}</text>
							</tn-form-item>
							<tn-form-item label="积分范围：" prop="endIntegral" :required="true">
								<tn-input v-model="selectMemberLevel.endIntegral" type="number" placeholder="等级升级条件" />
							</tn-form-item>
							<tn-form-item label="会员折扣：" prop="discount">
								<tn-input v-model="selectMemberLevel.discount" type="number" placeholder="会员折扣" />
							</tn-form-item>
						</tn-form>
					</view>
				</scroll-view>
				<view class="tn-padding tn-flex tn-flex-row-center tn-flex-col-center">
					<view v-if="selectMemberLevel.type===1" class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
						<tn-button backgroundColor="tn-bg-red" fontColor="tn-color-red" style="width: 100%;"
							:plain="true" shape="round" :blockRepeatClick="true" @click="deleteLevel">删除</tn-button>
					</view>
					<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
						<tn-button backgroundColor="tn-bg-blue--dark" fontColor="tn-color-white" style="width: 100%;"
							shape="round" :blockRepeatClick="true" @click="submitLevel">确定</tn-button>
					</view>
				</view>
			</tn-popup>
			<tn-popup v-model="tagSettingPopupShow" mode="bottom" :safeAreaInsetBottom="true" :borderRadius="5"
				:closeBtn="true" closeBtnIcon="left" closeBtnPosition="top-left" :negativeTop="10" :marginTop="60"
				@open="tagSettingOpen" @close="tagSettingClose">
				<view style="padding: 45px 16px 16px">
					<tn-form :model="selectMemberTag" ref="selectMemberTagRef" :errorType="['message']"
						:labelWidth="180" labelAlign="right">
						<tn-form-item label="等级名称：" prop="name" :required="true">
							<tn-input v-model="selectMemberTag.name" placeholder="等级名称" />
						</tn-form-item>
					</tn-form>
				</view>
				<view class="tn-padding tn-flex tn-flex-row-center tn-flex-col-center">
					<view v-if="selectMemberTag.id" class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
						<tn-button backgroundColor="tn-bg-red" fontColor="tn-color-red" style="width: 100%;"
							:plain="true" shape="round" :blockRepeatClick="true" @click="deleteTag()">删除</tn-button>
					</view>
					<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
						<tn-button backgroundColor="tn-bg-blue--dark" fontColor="tn-color-white" style="width: 100%;"
							shape="round" :blockRepeatClick="true" @click="submitTag">确定</tn-button>
					</view>
				</view>
			</tn-popup>
		</view>
		<view class="footerfixed tabbar tn-flex tn-flex-col-center tn-flex-row-between">
			<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
				<tn-button backgroundColor="tn-bg-blue--dark" fontColor="tn-color-white" style="width: 100%;"
					shape="round" :blockRepeatClick="true" @click="editSubmit">保存</tn-button>
			</view>
		</view>
	</view>
</template>

<script>
	import spu from '../../api/goods/spu'
	import level from '../../api/member/level'
	import member from '../../api/member/member'
	import tag from '../../api/member/tag'
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
				memberLevelList: [],
				selectMemberLevel: {},
				deleteMemberLevel: [],
				levelPopupHeight: 0,
				levelSettingPopupShow: false,
				memberTagList: [],
				selectMemberTag: {},
				tagSettingPopupShow: false,
				memberTagcolor: [
					'#E83A30', '#2DE8BD', '#0d6efd', '#31E749', '#FFA726', '#E72F8C', '#892FE8', '#914F2C',
					'#A4E82F', '#78909C'
				],
				levelRules: {
					name: [{
						validator: (rule, value, callback) => {
							if (value) {
								return true
							}
							return false
						},
						message: '请输入等级名称',
						trigger: ['change', 'blur'],
					}],
					endIntegral: [{
						validator: (rule, value, callback) => {
							if (value > 0) {
								return true
							}
							return false
						},
						message: '请输入等级升级范围',
						trigger: ['change', 'blur'],
					}]
				},
				tagRules: {
					name: [{
						validator: (rule, value, callback) => {
							if (value) {
								return true
							}
							return false
						},
						message: '请输入标签名称',
						trigger: ['change', 'blur'],
					}]
				}
			}
		},
		onLoad() {
			this.getMemberLevelList()
			this.getMemberTagList()
		},
		mounted() {
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
					footerFixed.height - uni.upx2px(20)
				this.levelPopupHeight = systemInfo.safeArea.height * 0.5
			},
			getMemberLevelList() {
				level.memberLevelList().then(res => {
					this.memberLevelList = res.data || []
				})
			},
			getMemberTagList() {
				tag.memberTagList().then(res => {
					this.memberTagList = res.data || []
				})
			},
			getMemberColor() {
				const index = Math.floor(Math.random() * this.memberTagcolor.length)
				return this.memberTagcolor[index]
			},
			editLevel(item, index) {
				if (item) {
					this.selectMemberLevel = JSON.parse(JSON.stringify(item))
					this.selectMemberLevel.index = index
					this.selectMemberLevel.type = 1 // 编辑
				} else {
					if (this.memberLevelList.length == 0) {
						this.selectMemberLevel.startIntegral = 0
						this.selectMemberLevel.index = 0
						this.selectMemberLevel.type = 0 // 新增
					} else {
						const prevItem = this.memberLevelList[this.memberLevelList.length - 1]
						this.selectMemberLevel.startIntegral = Number(prevItem.endIntegral) + 1
						this.selectMemberLevel.index = this.memberLevelList.length
						this.selectMemberLevel.type = 0 // 新增
					}
				}
				this.levelSettingPopupShow = true
			},
			levelSettingOpen() {
				this.$refs.selectMemberLevelRef.setRules(this.levelRules)
			},
			levelSettingClose() {
				this.selectMemberLevel = {}
			},
			submitLevel() {
				this.$refs.selectMemberLevelRef.validate(valid => {
					if (valid) {
						if (this.selectMemberLevel.endIntegral <= this.selectMemberLevel.startIntegral) {
							this.$refs.tips.show({
								msg: `最大积分范围错误，不能小于${this.selectMemberLevel.startIntegral+1}`,
								backgroundColor: '#FFA726',
								fontColor: '#FFFFFF',
								duration: 1500
							})
							return;
						}
						if (!this.selectMemberLevel.discount || this.selectMemberLevel.discount === 0) {
							this.selectMemberLevel.discount = 10
						}
						if (!this.selectMemberLevel.id) {
							this.memberLevelList.push(this.selectMemberLevel)
							this.selectMemberLevel = {}
							this.levelSettingPopupShow = false
							return
						}
						const findIndex = this.memberLevelList.findIndex(x => x.id === this.selectMemberLevel.id)
						if (findIndex >= 0) {
							const item = this.memberLevelList[findIndex]
							item.name = this.selectMemberLevel.name
							item.startIntegral = this.selectMemberLevel.startIntegral
							item.endIntegral = this.selectMemberLevel.endIntegral
							item.discount = this.selectMemberLevel.discount
							if (this.memberLevelList.length - 1 >= findIndex + 1) {
								const nextItem = this.memberLevelList[findIndex + 1]
								nextItem.startIntegral = this.selectMemberLevel.endIntegral + 1
							}
						} else {
							this.memberLevelList.push(this.selectMemberLevel)
						}
						this.levelSettingPopupShow = false
					} else {
						this.$refs.tips.show({
							msg: '请先填写完整等级信息',
							backgroundColor: '#FFA726',
							fontColor: '#FFFFFF',
							duration: 1500
						})
					}
				})
			},
			deleteLevel() {
				if (this.selectMemberLevel.id) {
					this.deleteMemberLevel.push(this.selectMemberLevel)
				}
				if (this.memberLevelList.length - 1 >= this.selectMemberLevel.index + 1) {
					const nextItem = this.memberLevelList[this.selectMemberLevel.index + 1]
					nextItem.startIntegral = this.selectMemberLevel.startIntegral
				}
				this.memberLevelList.splice(this.selectMemberLevel.index, 1)
				this.levelSettingPopupShow = false
			},
			editTagOpen(item) {
				if (item) {
					this.selectMemberTag = JSON.parse(JSON.stringify(item))
				}
				if (!this.selectMemberTag.color) {
					this.selectMemberTag.color = this.getMemberColor()
				}
				this.tagSettingPopupShow = true
			},
			tagSettingOpen() {
				this.$refs.selectMemberTagRef.setRules(this.tagRules)
			},
			tagSettingClose() {
				this.selectMemberTag = {}
			},
			submitTag() {
				this.$refs.selectMemberTagRef.validate(valid => {
					if (valid) {
						if (this.selectMemberTag.id) {
							const item = this.memberTagList[this.memberTagList.findIndex(x =>
								x.id == this.selectMemberTag.id)]
							if (item) {
								item.name = this.selectMemberTag.name
								item.color = this.selectMemberTag.color
								this.tagSettingPopupShow = false
								this.editTag(this.selectMemberTag)
								return
							}
						}
						tag.memberTagCreate(this.selectMemberTag).then(res => {
							this.$refs.tips.show({
								msg: '标签已保存',
								backgroundColor: '#3D7EFF',
								fontColor: '#FFFFFF',
								duration: 1500
							})
							this.memberTagList.push({
								id: res.data.id,
								name: res.data.name,
								color: res.data.color
							})
							this.tagSettingPopupShow = false
						})
					} else {
						this.$refs.tips.show({
							msg: '请先填写完整标签信息',
							backgroundColor: '#FFA726',
							fontColor: '#FFFFFF',
							duration: 1500
						})
					}
				})
			},
			editTag(item) {
				tag.memberTagEdit(item.id, item).then(res => {
					this.$refs.tips.show({
						msg: '修改成功',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
				})
			},
			deleteTag() {
				if (!this.selectMemberTag.id) {
					return
				}
				tag.memberTagDelete(this.selectMemberTag.id).then(res => {
					this.tagSettingPopupShow = false
					this.getMemberTagList()
					this.$refs.tips.show({
						msg: '标签已删除',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
				})
			},
			editSubmit() {
				this.batchSaveLevel()
				this.batchDeleteLevel()
			},
			batchSaveLevel() {
				level.memberLevelCreate(this.memberLevelList).then(res => {
					this.$refs.tips.show({
						msg: '会员等级保存成功',
						backgroundColor: '#3D7EFF',
						fontColor: '#FFFFFF',
						duration: 1500
					})
				})
			},
			batchDeleteLevel() {
				this.deleteMemberLevel.forEach(x => {
					level.memberLevelDelete(x.id)
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

	/deep/ .specs-cell:last-child {
		&::after {
			border-bottom: none;
		}
	}
</style>