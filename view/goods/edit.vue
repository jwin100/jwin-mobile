<template>
	<view class="template-product main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<!-- 顶部自定义导航 -->
		<uni-nav-bar class="custom-nav" statusBar :fixed="true" :border="false" title="编辑商品" left-icon="left"
			left-text="返回" @clickLeft="goBack()">
		</uni-nav-bar>
		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="goods--wrap">
			<view class="tn-classify__container">
				<scroll-view class="tn-bg-white tn-margin-top-xs tn-margin-bottom-xs" :scroll-top="scrollViewBasicTop"
					scroll-y scroll-with-animation :style="{height: scrollViewHeight + 'px'}">
					<view class="tn-padding">
						<tn-image-upload :action="pictureAction" :formData="pictureFormDate" :maxCount="10"
							:fileList="pictureList" @on-success="fileUploadSuccess"
							@on-remove="fileRemove"></tn-image-upload>
						<tn-form :model="goodsInfo" ref="goodsInfoRef" :labelWidth="100" :errorType="['message']">
							<tn-form-item label="名称: " prop="name" :required="true">
								<tn-input type="text" v-model="goodsInfo.name" @input="changeSpuName" />
							</tn-form-item>
							<tn-form-item label="分类: " prop="categoryId" :required="true">
								<tn-input type="select" v-model="goodsInfo.categoryName"
									@click="categoryActionshow=true" />
								<tn-select v-model="categoryActionshow" mode="multi-auto" :searchShow="false"
									:list="categoryList" @confirm="categoryActionConfirm"></tn-select>
							</tn-form-item>
							<tn-form-item label="条码: " prop="spuCode">
								<tn-input type="text" v-model="goodsInfo.spuCode" />
							</tn-form-item>
							<tn-form-item label="单位: " prop="unitId" :required="true">
								<tn-input type="select" v-model="goodsInfo.unitName" @click="unitActionshow=true" />
								<tn-select v-model="unitActionshow" mode="single" :searchShow="false" :list="unitList"
									@confirm="unitActionConfirm"></tn-select>
							</tn-form-item>
						</tn-form>
					</view>
					<!-- <view class="tn-margin-top-xs">
						<view class="tn-padding tn-flex tn-flex-row-between">
							<view class="justify-content-item tn-text-bold tn-text-xl">
								产品标签
							</view>
						</view>
						<view class="tn-tag-content tn-color-grey">
							<view v-for="(item, index) in tagList" :key="index"
								class="tn-tag-content__item tn-margin-right tn-round tn-text-sm tn-text-bold"
								:class="[`tn-bg-${item.color}--light tn-color-${item.color}`]">
								<text class="tn-tag-content__item--prefix">#</text> {{ item.title }}
							</view>
						</view>
					</view> -->
					<view class="tn-margin-top-xs">
						<view class="tn-padding tn-flex tn-flex-col-center tn-flex-row-between tn-border-solid-bottom">
							<view class="justify-content-item tn-text-xl">
								规格信息
							</view>
							<view class="justify-content-item tn-color-grey" @click="addSpecs">
								<text class="tn-padding-xs">添加规格</text>
								<text class="tn-icon-add-circle"></text>
								<tn-select v-model="specKeyActionshow" mode="single" :searchShow="false"
									:list="specKeyList" @confirm="specKeyActionConfirm"></tn-select>
							</view>
						</view>
						<view v-if="specList.length>0">
							<tn-list-view class="tn-margin tn-radius-xs tn-border-solid">
								<tn-list-cell class="specs-cell" v-for="(item,index) in specList" :key="index">
									<view class="tn-flex tn-flex-col-center tn-flex-row-between">
										<view class="tn-flex tn-flex-col-center tn-flex-row-left">
											<text
												class="tn-icon-trust tn-text-xl tn-color-grey tn-margin-right-xs"></text>
											<text class="tn-text-lg">{{item.label}}</text>
										</view>
										<view
											class="tn-btn-content__item tn-round tn-text-sm tn-text-bold tn-bg-red--light tn-color-red"
											@click="deleteSpecs(item)">
											删除
										</view>
									</view>
									<view class="tn-flex tn-flex-col-center tn-margin-top">
										<tn-checkbox-group>
											<tn-checkbox v-model="subItem.checked" class="tn-padding-right"
												v-for="(subItem, subIndex) in item.children" :key="subIndex"
												:name="subItem.id" @change="checkboxGroupChange">
												{{subItem.name}}
											</tn-checkbox>
										</tn-checkbox-group>
									</view>
								</tn-list-cell>
							</tn-list-view>
						</view>
						<tn-list-view :card="false" class="tn-padding-top">
							<tn-list-cell class="specs-cell" v-for="(item, index) in goodsInfo.skus" :key="index"
								@click="editSpec(item)">
								<view class="tn-text-ellipsis" style="font-size: 34rpx;">
									{{item.skuName}}
								</view>
								<view
									class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-top tn-color-gray">
									<view>进价：￥{{item.purchaseAmount}}</view>
									<view>售价：￥{{item.referenceAmount}}</view>
									<view>重量：{{item.skuWeight}}</view>
								</view>
							</tn-list-cell>
						</tn-list-view>
					</view>
				</scroll-view>
			</view>
			<tn-popup v-model="specShow" mode="bottom" :safeAreaInsetBottom="true" :borderRadius="5" :closeBtn="true"
				closeBtnIcon="left" closeBtnPosition="top-left" :negativeTop="10" :marginTop="60" @open="specPopupOpen"
				@close="specPopupClose">
				<scroll-view scroll-y="true" :style="{height:specPopupHeight+'px'}">
					<view style="padding: 45px 16px 16px">
						<tn-tips ref="specTips" position="top"></tn-tips>
						<tn-form :model="editSpecInfo" ref="editSpecInfoRef" :errorType="['message']" :labelWidth="180"
							labelAlign="right">
							<tn-form-item label="规格名：" prop="name">
								{{editSpecInfo.skuName}}
							</tn-form-item>
							<tn-form-item label="规格编码：" prop="skuCode">
								<tn-input v-model="editSpecInfo.skuCode" placeholder="不填则自动生成" />
							</tn-form-item>
							<tn-form-item label="规格条码：" prop="skuNos">
								<tn-input v-model="editSpecInfo.skuNos" placeholder="不填则自动生成" />
							</tn-form-item>
							<tn-form-item label="进价：" prop="purchaseAmount" :required="true">
								<tn-input v-model="editSpecInfo.purchaseAmount" type="number" placeholder="进价(元)" />
							</tn-form-item>
							<tn-form-item label="零售价：" prop="referenceAmount" :required="true">
								<tn-input v-model="editSpecInfo.referenceAmount" type="number" placeholder="零售价(元)" />
							</tn-form-item>
							<tn-form-item label="重量：" prop="skuWeight">
								<tn-input v-model="editSpecInfo.skuWeight" type="number" placeholder="商品重量(kg)" />
							</tn-form-item>
						</tn-form>
					</view>
				</scroll-view>
				<view class="tn-padding">
					<tn-button backgroundColor="tn-bg-blue" fontColor="tn-color-white" style="width: 100%;"
						:shadow="true" shape="round" :blockRepeatClick="true" @click="submitSpec">确定</tn-button>
				</view>
			</tn-popup>
		</view>
		<view class="footerfixed dd-glass tn-flex tn-flex-col-center tn-flex-row-between">
			<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
				<tn-button backgroundColor="tn-bg-blue--dark" fontColor="tn-color-white" style="width: 100%;"
					:shadow="true" shape="round" :blockRepeatClick="true" @click="submitGoods">保存</tn-button>
			</view>
		</view>
	</view>
</template>

<script>
	import upload from '../../api/biz/upload'
	import category from '../../api/goods/category'
	import spec from '../../api/goods/spec'
	import spu from '../../api/goods/spu'
	import unit from '../../api/goods/unit'
	import config from '../../common/config'
	import mixin from '../../common/mixin'
	import uuid from '../../uni_modules/tuniao-ui/libs/function/uuid'
	export default {
		name: 'goodsEdit',
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
				scrollViewBasicTop: 0,
				// scrollView的高度
				scrollViewHeight: 0,
				specTitleWidth: 0,
				specPopupHeight: 0,
				specShow: false,
				id: '',
				goodsInfo: {},
				editSpecInfo: {},
				pictureAction: config.pictureAction,
				pictureFormDate: {},
				pictureList: [],
				categoryActionshow: false,
				categoryList: [],
				unitActionshow: false,
				unitList: [],
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
				specKeyActionshow: false,
				specCheckedList: [],
				specList: [],
				specKeyList: [],
				rules: {
					name: [{
						required: true,
						message: '请输入商品名',
						trigger: ['change', 'blur'],
					}],
					categoryId: [{
						required: true,
						message: '请选择商品分类',
						trigger: ['change', 'blur'],
					}],
					unitId: [{
						required: true,
						message: '请选择商品单位',
						trigger: ['change', 'blur'],
					}]
				}
			}
		},
		onReady() {
			this.$refs.goodsInfoRef.setRules(this.rules)
		},
		onLoad(option) {
			this.id = option.id
		},
		mounted() {
			this.getUploadAuth()
			this.getCategoryTree()
			this.getUnitList()
			if (this.id) {
				this.getGoodsInfo()
			}
			this.$nextTick(() => {
				this.getScrollViewInfo()
			})
		},
		methods: {
			// 获取scrollView的高度信息
			async getScrollViewInfo() {
				// 获取当前屏幕的可用高度
				const customNavbar = await mixin.methods.getRect(this, '.custom-nav')
				const footerFixed = await mixin.methods.getRect(this, '.footerfixed')
				const systemInfo = uni.getSystemInfoSync()
				this.customNavbarHeight = customNavbar.height
				this.scrollViewBasicTop = systemInfo.statusBarHeight
				this.scrollViewHeight = systemInfo.windowHeight - customNavbar.height -
					footerFixed.height - uni.upx2px(20)

				const systemWidth = systemInfo.safeArea.width - uni.upx2px(40)
				const pictureNum = Math.trunc(systemWidth / uni.upx2px(140))
				const a = systemWidth - (pictureNum * uni.upx2px(140))
				const b = a / pictureNum
				this.pictureMargin = (b + uni.upx2px(20)) / 2
				this.specTitleWidth = systemWidth - uni.upx2px(60) - uni.upx2px(30)
				this.specPopupHeight = systemInfo.safeArea.height * 0.5
			},
			getUploadAuth() {
				upload.merchantUploadFile(1).then(res => {
					this.pictureFormDate = res.data
				})
			},
			fileUploadSuccess(data) {
				if (this.goodsInfo.pictures) {
					this.goodsInfo.pictures.push(data.url)
				} else {
					this.goodsInfo.pictures = [data.url]
				}
			},
			fileRemove(index) {
				if (this.goodsInfo.pictures) {
					this.goodsInfo.pictures.splice(index, 1)
				} else {
					this.goodsInfo.pictures = []
				}
			},
			getCategoryTree() {
				category.categoryTree().then(res => {
					if (res.data) {
						this.categoryList = res.data.filter(x => x.children.length > 0)
					}
				})
			},
			getUnitList() {
				unit.unitList().then(res => {
					this.unitList = res.data.map(x => {
						return {
							label: x.name,
							value: x.id
						}
					})
				})
			},
			getSpecKeyList() {
				spec.specList({}).then(res => {
					this.specKeyList = res.data.map(x => {
						return {
							label: x.name,
							value: x.id
						}
					})
					this.specKeyActionshow = true
				})
			},
			changeSpuName(name) {
				this.goodsInfo.skus.forEach(x => {
					x.skuName = this.convertSkuName(name, x.specs)
				})
			},
			specKeyActionConfirm(list) {
				if (list) {
					const item = list[0]
					const params = {
						pid: item.value
					}
					spec.specList(params).then(res => {
						item.children = res.data.map(x => {
							return {
								id: x.id,
								name: x.name,
								checked: false
							}
						})
						this.specList.push(item)
					})
				}
			},
			addSpecs() {
				this.getSpecKeyList()
			},
			deleteSpecs(item) {
				const findIndex = this.specList.findIndex(x => x.value === item.value)
				if (findIndex < 0) {

				}
				const deleteItem = this.specList[findIndex]
				deleteItem.children.forEach(x => {
					// 删除sku(先删除sku，再删除选中项)
					this.removeSkus(x.id)
					this.removeCheckedList(x.id)
				})
				this.specList.splice(findIndex, 1)
			},
			checkboxGroupChange(checkedObj) {
				const name = checkedObj.name
				const checked = checkedObj.value
				if (checked) {
					// 新增sku(先加选中项，再加sku)
					this.addCheckedList(name)
					this.addSkus(name)
				} else {
					// 删除sku(先删除sku，再删除选中项)
					this.removeSkus(name)
					this.removeCheckedList(name)
				}
			},
			addCheckedList(specValueId) {
				this.specList.forEach(item => {
					const findIndex = item.children.findIndex(subItem => specValueId === subItem.id)
					if (findIndex >= 0) {
						const subItem = item.children[findIndex]
						const checkedFindIndex = this.specCheckedList.findIndex(x => x.id === item.value)
						if (checkedFindIndex >= 0) {
							const checkedItem = this.specCheckedList[checkedFindIndex]
							// 选中
							checkedItem.children.push({
								id: subItem.id,
								name: subItem.name
							})
						} else {
							const spec = {
								id: item.value,
								name: item.label,
								children: [subItem]
							}
							this.specCheckedList.push(spec)
						}
					}
				})
			},
			removeCheckedList(specValueId) {
				this.specList.forEach(item => {
					const findIndex = item.children.findIndex(subItem => specValueId === subItem.id)
					if (findIndex >= 0) {
						const subItem = item.children[findIndex]
						const checkedFindIndex = this.specCheckedList.findIndex(x => x.id === item.value)
						if (checkedFindIndex >= 0) {
							const checkedItem = this.specCheckedList[checkedFindIndex]
							// 取消选中
							if (checkedItem.children.length === 1) {
								this.specCheckedList.splice(checkedFindIndex, 1)
							} else {
								checkedItem.children.splice(
									checkedItem.children.findIndex(x => x.id === subItem.id), 1
								)
							}
						}
					}
				})
			},
			addSkus(specValueId) {
				const findIndex = this.specCheckedList.findIndex(
					spec => spec.children.findIndex(x => x.id === specValueId) >= 0
				)
				if (findIndex < 0) {
					return
				}
				const checkedItem = this.specCheckedList[findIndex]
				let addSkus = []
				const tempSkus = JSON.parse(JSON.stringify(this.goodsInfo.skus))
				if (checkedItem.children.length === 1) {
					tempSkus.forEach(sku => {
						const a = JSON.parse(JSON.stringify(sku))
						const spec = {
							id: '',
							spuId: a.spuId,
							skuId: a.id,
							specId: checkedItem.id,
							specName: checkedItem.name,
							specValueId: checkedItem.children[0].id,
							specValueName: checkedItem.children[0].name
						}
						a.specs.push(spec)
						a.skuName = this.convertSkuName(this.goodsInfo.name, a.specs)
						addSkus.push(a)
					})
					this.goodsInfo.skus = addSkus
				} else {
					const allSpecCheckedList = this.specCheckedList.map(specKey => {
						return specKey.children.map(specValue => {
							return {
								specId: specKey.id,
								specName: specKey.name,
								specValueId: specValue.id,
								specValueName: specValue.name
							}
						})
					})
					// 计算乘积
					let skus = allSpecCheckedList.reduce((x, y) => {
						let arr = [];
						x.forEach(x => y.forEach(z => arr.push(x.concat([z]))))
						return arr;
					}, [
						[]
					])
					const markSkus = tempSkus.map(x => {
						return {
							key: x.key,
							id: x.id,
							comSpecValueId: x.specs.map(y => y.specValueId).join('_')
						}
					})
					skus.forEach(sku => {
						const comSpecValueId = sku.map(x => x.specValueId).join('_')
						const findIndex = markSkus.findIndex(x => x.comSpecValueId === comSpecValueId)
						if (findIndex >= 0) {
							const markSku = markSkus[findIndex]
							let tempSkuIndex = tempSkus.findIndex(x => x.key === markSku.key)
							if (markSku.id) {
								tempSkuIndex = tempSkus.findIndex(x => x.id === markSku.id)
							}
							if (tempSkuIndex >= 0) {
								const tempSku = tempSkus[tempSkuIndex]
								addSkus.push(tempSku)
							}
						} else {
							const specs = sku.map(x => {
								return {
									id: '',
									spuId: this.id || '',
									skuId: '',
									specId: x.specId,
									specName: x.specName,
									specValueId: x.specValueId,
									specValueName: x.specValueName
								}
							})
							const addSku = {
								key: uuid(),
								id: '',
								skuCode: '',
								skuNo: '',
								skuName: this.convertSkuName(this.goodsInfo.name, specs),
								spuId: this.id || '',
								purchaseAmount: 0,
								referenceAmount: 0,
								sellStock: 0,
								skuWeight: 0,
								specs: specs
							}
							addSkus.push(addSku)
						}
					})
					this.goodsInfo.skus = addSkus
				}
			},
			removeSkus(specValueId) {
				const findIndex = this.specCheckedList.findIndex(
					spec => spec.children.findIndex(x => x.id === specValueId) >= 0
				)
				if (findIndex < 0) {
					return
				}
				const checkedItem = this.specCheckedList[findIndex]
				let addSkus = []
				const tempSkus = JSON.parse(JSON.stringify(this.goodsInfo.skus))
				if (checkedItem.children.length === 1) {
					tempSkus.forEach(sku => {
						const findIndex = sku.specs.findIndex(x => x.specValueId === specValueId)
						if (findIndex >= 0) {
							const tempSku = JSON.parse(JSON.stringify(sku))
							tempSku.specs.splice(findIndex, 1)
							tempSku.skuName = this.convertSkuName(this.goodsInfo.name, tempSku.specs)
							addSkus.push(tempSku)
						} else {
							addSkus.push(sku)
						}
					})
					this.goodsInfo.skus = addSkus
				} else {
					// 删除sku
					tempSkus.forEach(sku => {
						if (sku.specs.findIndex(x => x.specValueId === specValueId) < 0) {
							addSkus.push(sku)
						}
					})
					this.goodsInfo.skus = addSkus
				}
			},
			convertSkuName(spuName, specs) {
				if (!spuName) {
					return specs.map(x => x.specValueName).join('_')
				}
				if (!specs || specs.length === 0) {
					return spuName
				}
				return spuName + '_' + specs.map(x => x.specValueName).join('_')
			},
			specPopupOpen() {},
			specPopupClose() {
				this.editSpecInfo = {}
			},
			editSpec(item) {
				this.editSpecInfo = JSON.parse(JSON.stringify(item))
				this.specShow = true
			},
			submitSpec() {
				if (!this.editSpecInfo.purchaseAmount) {
					this.$refs.tips.show({
						msg: '请填写进价',
						backgroundColor: '#FFA726',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					return;
				}
				if (!this.editSpecInfo.referenceAmount) {
					this.$refs.tips.show({
						msg: '请填写零售价',
						backgroundColor: '#FFA726',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					return;
				}
				let findIndex = this.goodsInfo.skus.findIndex(x => x.key === this.editSpecInfo.key)
				if (this.editSpecInfo.id) {
					findIndex = this.goodsInfo.skus.findIndex(x => x.id === this.editSpecInfo.id)
				}
				this.goodsInfo.skus.splice(findIndex, 1, this.editSpecInfo)
				this.specShow = false
			},
			getGoodsInfo() {
				spu.storageInfo(this.id).then(res => {
					this.goodsInfo = res.data
					if (this.goodsInfo.pictures.length > 0) {
						this.pictureList = this.goodsInfo.pictures.map(x => {
							return {
								url: config.pictureUrl + x
							}
						})
						console.log(this.pictureList)
					}
					this.initGoodsSpecs()
				})
			},
			initGoodsSpecs() {
				// 初始化已有specList
				const specList = []
				const allSpecs = []
				this.goodsInfo.skus.forEach(sku => {
					sku.specs.forEach(spec => {
						allSpecs.push(spec)
					})
				})
				const specs = this.goodsInfo.skus[0].specs
				specs.forEach(specItem => {
					const params = {
						pid: specItem.specId
					}
					spec.specList(params).then(spevValue => {
						const item = {
							value: specItem.specId,
							label: specItem.specName,
							children: spevValue.data.map(x => {
								const checked = allSpecs
									.findIndex(sp => sp.specValueId === x.id) >= 0
								return {
									id: x.id,
									name: x.name,
									checked: checked
								}
							})
						}
						this.specList.push(item)

						const children = item.children
							.filter(subItem => subItem.checked)
							.map(subItem => {
								return {
									id: subItem.id,
									name: subItem.name,
								}
							})

						const checkedItem = {
							id: item.value,
							name: item.label,
							children: children
						}
						const findIndex = this.specCheckedList.findIndex(x => x.id === checkedItem.value)
						if (findIndex >= 0) {
							this.specCheckedList.splice(findIndex, 1, checkedItem)
						} else {
							this.specCheckedList.push(checkedItem)
						}
					})
				})
			},
			categoryActionConfirm(list) {
				if (list.length > 0) {
					const item = list[0]
					this.goodsInfo.categoryName = item.label
					this.goodsInfo.categoryId = item.value
				}
				if (list.length > 1) {
					const parentItem = list[0]
					const item = list[1]
					this.goodsInfo.categoryName = parentItem.label + '->' + item.label
					this.goodsInfo.categoryId = item.value
				}
			},
			unitActionConfirm(list) {
				if (list) {
					const item = list[0]
					this.goodsInfo.unitName = item.label
					this.goodsInfo.unitId = item.value
				}
			},
			submitGoods() {
				// 保存编辑
				this.$refs.goodsInfoRef.validate(valid => {
					if (valid) {
						let skuValid = true
						this.goodsInfo.skus.forEach(x => {
							if (!x.purchaseAmount) {
								this.$refs.tips.show({
									msg: '请填写进价',
									backgroundColor: '#FFA726',
									fontColor: '#FFFFFF',
									duration: 1500
								})
								skuValid = false
								return
							}
							if (!x.referenceAmount) {
								this.$refs.tips.show({
									msg: '请填写零售价',
									backgroundColor: '#FFA726',
									fontColor: '#FFFFFF',
									duration: 1500
								})
								skuValid = false
								return
							}
						})
						if (!skuValid) {
							return
						}
						spu.storageEdit(this.id, this.goodsInfo).then(res => {
							this.$refs.tips.show({
								msg: '修改成功',
								backgroundColor: '#3D7EFF',
								fontColor: '#FFFFFF',
								duration: 1500
							})
							setTimeout(function() {
								mixin.methods.goBack(true)
							}, 1500)
						})
					} else {
						this.$refs.tips.show({
							msg: '请先填写完整商品信息',
							backgroundColor: '#FFA726',
							fontColor: '#FFFFFF',
							duration: 1500
						})
					}
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
			z-index: 2;
		}
	}

	.tn-tabbar-height {
		min-height: 120rpx;
		height: calc(140rpx + env(safe-area-inset-bottom) / 2);
	}

	/* 用户头像 start */
	.logo-image {
		width: 110rpx;
		height: 110rpx;
		position: relative;
	}

	.logo-pic {
		background-size: cover;
		background-repeat: no-repeat;
		// background-attachment:fixed;
		background-position: top;
		box-shadow: 0rpx 0rpx 80rpx 0rpx rgba(0, 0, 0, 0.15);
		border-radius: 10rpx;
		overflow: hidden;
		// background-color: #FFFFFF;
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

	.tn-btn-content {
		&__item {
			display: inline-block;
			line-height: 45rpx;
			padding: 6rpx 20rpx;
		}
	}

	/* 标签内容 end*/

	/deep/ .specs-cell:last-child {
		&::after {
			border-bottom: none;
		}
	}

	/* 间隔线 start*/
	.tn-strip-bottom-min {
		width: 100%;
		border-bottom: 1rpx solid #F8F9FB;
	}

	/* 间隔线 start*/
	.tn-strip-bottom {
		width: 100%;
		border-bottom: 20rpx solid rgba(241, 241, 241, 0.8);
	}

	/* 间隔线 end*/
	/* 底部tabbar start*/
	.footerfixed {
		position: fixed;
		width: 100%;
		bottom: 0;
		z-index: 1;
		height: 120rpx;
		background-color: #FFFFFF;
		box-shadow: 0rpx 0rpx 30rpx 0rpx rgba(0, 0, 0, 0.07);
	}

	/* 毛玻璃*/
	.dd-glass {
		width: 100%;
		backdrop-filter: blur(20rpx);
		-webkit-backdrop-filter: blur(20rpx);
	}
</style>