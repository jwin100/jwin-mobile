<template>
	<view class="main-container tn-safe-area-inset-bottom tn-bg-gray--light">
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog type="info" title="登录提示" content="请先登录,才可进一步操作" :duration="2000" :before-close="true"
				@close="close()" @confirm="gotoLogin()"></uni-popup-dialog>
		</uni-popup>
		<!-- <tn-modal v-model="show" :title="title" :content="content" :button="button"></tn-modal> -->
		<uni-nav-bar statusBar :border="false" :fixed="true" class="custom-nav" title="销售开单">
			<!-- 			<block slot="left">
				<view class="custom-nav__item" @click="goBack()">
					<uni-icons type="left" color="#666" size="18" />
					<text>返回</text>
				</view>
			</block> -->
			<!-- <block slot="right">
				<view class="custom-nav__item">
					<uni-icons v-if="!cashier.memberId" class="input-uni-icon" type="personadd" size="18" color="#999"
						@click="addMemberPupopShow=true" />
					<view v-else @click="addMemberPupopShow=true">
						<text>{{ cashier.member.name }}</text>
					</view>
				</view>
			</block> -->
		</uni-nav-bar>
		<tn-tips ref="tips" position="top" :top="customNavbarHeight"></tn-tips>
		<view class="tn-cashier--wrap">
			<!-- 顶部标签 -->
			<tn-tabs-swiper class="tn-cashier__tabs tn-bg-white" ref="tabs" activeColor="#3165CC"
				inactiveColor="#080808" :list="tabsList" :current="tabsIndex" :isScroll="false"
				@change="tabsChange"></tn-tabs-swiper>
			<!-- swiper内容 -->
			<swiper class="tn-cashier__swiper" :style="{top: `${swiperTop}px`, height: `${swiperHeight}px`}"
				:current="swiperIndex" @transition="swiperTransition" @animationfinish="swiperAnimationFinish">
				<swiper-item class="tn-cashier__swiper__item">
					<!-- 搜索框 -->
					<view
						class="tn-cashier__search--wrap tn-bg-white tn-flex tn-flex-col-center tn-flex-row-center tn-padding-left tn-padding-right">
						<view
							class="tn-bg-gray--light tn-flex tn-flex-direction-row tn-flex-col-center tn-flex-row-center tn-padding-left-sm tn-padding-right-sm"
							style="border-radius: 30rpx; width: 100%;">
							<tn-input v-model="searchParams.searchKey" type="text" :clearable="false"
								placeholder="请输入商品名称" style="flex: 1;" />
							<view class="tn-cashier__search__icon tn-icon-scan tn-color-gray" style="font-size: 50rpx;"
								@click="searchScan">
							</view>
						</view>
						<view class="tn-margin-left">
							<uni-icons v-if="!cashier.memberId" class="input-uni-icon" type="personadd" size="22"
								color="#999" @click="addMemberPupopShowClick()" />
							<view v-else @click="addMemberPupopShow=true">
								<text>{{ cashier.member.name }}</text>
							</view>
						</view>
					</view>
					<!-- 分类列表和内容 -->
					<view class="tn-flex tn-flex-nowrap tn-flex-row-around">
						<!-- 左边容器 -->
						<scroll-view class="tn-margin-top-xs tn-margin-bottom-xs" :scroll-top="leftScrollViewTop"
							scroll-y scroll-with-animation style="width:200rpx;"
							:style="{height: scrollViewHeight + 'px'}">
							<view v-for="(item,index) in categoryList" :key="item.id" :id="`tabbar_item_${index}`"
								class="tn-cashier__tabbar__item tn-flex tn-flex-col-center tn-flex-row-center tn-padding"
								:class="[tabbarItemClass(index)]" @tap.stop="clickClassifyNav(item,index)">
								<view class="tn-cashier__tabbar__item__title tn-text-ellipsis">{{ item.name }}
								</view>
							</view>
						</scroll-view>

						<!-- 右边容器 -->
						<scroll-view class="tn-flex-1 tn-bg-white  tn-margin-top-xs tn-margin-bottom-xs"
							:scroll-top="rightScrollViewTop" scroll-y scroll-with-animation
							:style="{height: scrollViewHeight + 'px'}" :refresher-enabled="true"
							:refresher-triggered="scrollRefresher" :scroll-anchoring="true"
							@refresherrefresh="scrollPull" @scrolltolower="scrolltolower">
							<view v-if="spuOptionList.length>0"
								class="tn-cashier__content tn-padding-left tn-padding-right tn-padding-bottom-xs">
								<view v-for="(item,index) in spuOptionList" :key="index"
									class="tn-cashier__content__sub-cashier">
									<view class="article-shadow">
										<view class="tn-flex tn-flex-row-left tn-margin-top tn-margin-bottom">
											<view class="image-article tn-margin-right-sm">
												<image v-if="item.picture" :src="getPicture(item.picture)"
													class="image-pic" />
												<image v-else src="@/static/img/goods/default-goods-manage.png"
													class="image-default-pic" />
											</view>
											<view class="tn-flex-1 tn-flex tn-flex-flow-column tn-flex-row-between">
												<view class="tn-text-md">
													{{ item.name }}
												</view>
												<view
													class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-bottom tn-text-sm">
													<view class="tn-flex tn-flex-flow-row tn-flex-col-center">
														<view class="tn-color-red">
															<text>￥</text>
															<text class="tn-text-lg">
																{{item.referenceAmount}}
															</text>
														</view>
														<view class="tn-margin-left-xs tn-flex">
															<view
																class="tn-bg-red--light tn-radius-xs tn-color-red tn-text-xs tn-padding-left-xs tn-padding-right-xs">
																<text>库存：</text>
																<text>{{item.sellStock}}</text>
																<text>{{item.unitName}}</text>
															</view>
														</view>
													</view>
													<view v-if="item.specs>1">
														<tn-button fontColor="tn-color-white"
															backgroundColor="tn-bg-blue" :disabled="item.sellStock<=0"
															:fontSize="18" @click="addSku(item)" height="auto"
															padding="8rpx 6rpx" style="font-weight: 400;">
															选规格
															<tn-badge v-if="getCardSpuTotal(item.id)>0"
																backgroundColor="tn-bg-red" fontColor="tn-color-white"
																:absolute="true" :fontSize="18" :radius="28">
																<text>{{getCardSpuTotal(item.id)}}</text>
															</tn-badge>
														</tn-button>
													</view>
													<view v-else>
														<view v-if="item.sellStock>0"
															class="tn-flex tn-flex-col-center tn-flex-row-center">
															<view @click="removeSku(item)"
																v-if="getCardSpuTotal(item.id)>0"
																style="width: 40rpx; height: 40rpx;border-radius: 50%;"
																class="tn-border-blue tn-border-solid tn-color-blue--dark tn-flex tn-flex-row-center tn-flex-col-center">
																<text
																	class="tn-icon-reduce tn-text-md tn-padding-xs"></text>
															</view>
															<view v-if="getCardSpuTotal(item.id)>0"
																class="tn-padding-left tn-padding-right">
																{{getCardSpuTotal(item.id)}}
															</view>
															<view @click="addSku(item)"
																style="width: 40rpx; height: 40rpx;border-radius: 50%;"
																class="tn-border-blue tn-border-solid tn-color-blue--dark tn-flex tn-flex-row-center tn-flex-col-center">
																<text
																	class="tn-icon-add tn-text-md tn-padding-xs"></text>
															</view>
														</view>
														<view v-else
															class="tn-border-blue tn-border-solid tn-color-blue--disabled tn-flex tn-flex-row-center tn-flex-col-center"
															style="width: 40rpx; height: 40rpx;border-radius: 50%;">
															<text class="tn-icon-add tn-text-md tn-padding-xs"></text>
														</view>
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view v-else-if="!scrollRefresher" class="tn-padding-top-xl">
								<tn-empty mode="list" text="无商品信息"></tn-empty>
							</view>
						</scroll-view>
					</view>
				</swiper-item>

				<swiper-item class="tn-cashier__swiper__item">
					<view style="height: 100%;"
						class="fast-casher tn-bg-white tn-border-white tn-shadow tn-border tn-radius tn-padding">
						<view class="tn-flex tn-flex-direction-column tn-flex-row-center tn-flex-col-center"
							style="height: 100%;">
							<view
								class="tn-flex-basic-xs tn-flex tn-flex-row-right tn-flex-col-bottom tn-padding-right tn-padding-bottom tn-border-solid-left tn-border-solid-top tn-border-solid-right"
								style="width: 100%;">
								<text class="tn-text-xl-xxl tn-text-ellipsis">{{fastCashierAmount}}</text>
							</view>
							<view class="tn-flex-1" style="width: 100%;">
								<view
									class="tn-flex tn-flex-direction-row tn-flex-wrap tn-flex-row-center tn-flex-col-center tn-text-xxl tn-border-solid-top tn-border-solid-left"
									style="height: 100%; width: 100%;">
									<view v-for="(item, index) in fastCashierList" :key="index"
										@click="fastCashier(item)" style="width: 33.33%; height: 20%;">
										<view style="height: 100%;"
											class="tn-flex tn-flex-direction-row tn-flex-row-center tn-flex-col-center tn-border-solid-right tn-border-solid-bottom">
											<view v-if="item.icon" :class="[`tn-icon-`+item.icon]"></view>
											<view v-else :class="[item.type===4?'tn-text-lg':'']">{{ item.name }}
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<tn-popup v-model="addMemberPupopShow" mode="bottom" :safeAreaInsetBottom="true" :borderRadius="5"
			:closeBtn="false" :negativeTop="10" :marginTop="60">
			<view
				class="tn-flex tn-flex-col-center tn-flex-row-center tn-flex-row-between tn-text-xl tn-border-solid-bottom"
				style="height: 90rpx; width: 100%; padding: 0 30rpx;">
				<view class="tn-text-bold" style="margin: auto;">选择会员</view>
				<view @click="addMemberPupopShow=false" class="tn-icon-down" style="margin-right:20rpx; float: right;">
				</view>
			</view>
			<tn-input v-model="phoneInput" border="true" focus="true" clearable="true" maxLength="4" placeholder="请输入手机号后四位"
				@input="memberSearch()" />
			<scroll-view scroll-y="true" :style="{height:specPopupHeight+'px'}">
				<view v-if="memberList.length>0" class="tn-cashier__content tn-padding-left tn-padding-right">
					<view v-for="(item,index) in memberList" :key="index" class="tn-border-solid-bottom">
						<view class="article-shadow" @click="cashierMemberSubmit(item)">
							<view
								class="tn-flex tn-flex-flow-row tn-flex-row-left tn-margin-bottom tn-margin-top tn-width-full">
								<view class="image-article tn-margin-right-sm">
									<image v-if="item.headPath" :src="getPicture(item.headPath)" class="image-pic" />
									<image v-else src="@/static/img/member/default-image-vip.png"
										class="image-default-pic" />
								</view>
								<view class="tn-flex-1 tn-flex tn-flex-flow-column tn-flex-row-around">
									<view class="tn-text-lg" style="font-weight: 500;">
										{{ item.name }}
									</view>
									<view class="tn-flex tn-flex-flow-row tn-flex-row-between tn-flex-col-bottom">
										<view class="tn-icon-tel">
											<text class="tn-margin-left-xs">{{item.phone}}</text>
										</view>
										<view
											class="tn-color-gray tn-flex tn-flex-row-center tn-flex-col-center tn-text-xs">
											<view v-if="item.nowIntegral"
												class="tn-border-solid tn-radius tn-margin-xs tn-padding-xs tn-flex-col-bottom tn-border-blue tn-color-blue--dark">
												积
											</view>
											<view v-if="item.nowRecharge"
												class="tn-border-solid tn-radius tn-margin-xs tn-padding-xs tn-flex-col-bottom tn-border-blue tn-color-blue--dark">
												储
											</view>
											<view v-if="item.counted"
												class="tn-border-solid tn-radius tn-margin-xs tn-padding-xs tn-flex-col-bottom tn-border-blue tn-color-blue--dark">
												次
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-else class="tn-padding-top-xl" style="margin-top: 30%;">
					<tn-empty mode="list" text="无会员信息"></tn-empty>
				</view>
			</scroll-view>
		</tn-popup>
		<tn-popup v-model="specShow" mode="bottom" :safeAreaInsetBottom="true" :borderRadius="5" :closeBtn="true"
			closeBtnPosition="top-right" closeBtnIcon="down" :closeIconSize="40" :negativeTop="10" :marginTop="60" @open="specPopupOpen" @close="specPopupClose">
			<view class="tn-flex tn-flex-col-center tn-flex-row-center tn-text-bold tn-text-xl tn-border-solid-bottom"
				style="height: 45px; width: 100%;">
				<text>选择规格</text>
			</view>
			<scroll-view scroll-y="true" :style="{height:specPopupHeight+'px'}">
				<view style="padding: 15px">
					<tn-list-view unlined="all">
						<tn-list-cell :hover="true" :radius="true" :fontSize="34">
							<view class="tn-flex tn-flex-col-center">
								<view class="tn-flex-1">商品名称</view>
								<view class="tn-margin-left-sm" style="font-size: 28rpx;">{{selectSpu.name}}</view>
							</view>
						</tn-list-cell>
						<tn-list-cell :unlined="true" :hover="true" :radius="true" :fontSize="34">
							<view class="tn-flex tn-flex-col-center">
								<view class="tn-flex-1">单位</view>
								<view class="tn-margin-left-sm" style="font-size: 28rpx;">{{selectSpu.unitName}}
								</view>
							</view>
						</tn-list-cell>
					</tn-list-view>
					<tn-list-view unlined="all">
						<tn-list-cell :hover="true" :radius="true" :fontSize="30">
							<view class="title tn-flex tn-flex-col-center">
								<view style="width: 33.3%; text-align: left;">规格</view>
								<view style="width: 33.3%; text-align: center;">单价</view>
								<view style="width: 33.3%; text-align: right;">数量</view>
							</view>
						</tn-list-cell>
						<view class="content">
							<tn-list-cell :hover="true" :fontSize="26" v-for="(item,index) in skuOptionList"
								:key="index">
								<view class="tn-flex tn-flex-col-center">
									<view style="width: 33.3%;">
										<view class="tn-flex tn-flex-flow-column">
											<view class="tn-text-ellipsis">{{item.skuName}}</view>
											<view class="tn-margin-top-xs tn-flex">
												<view
													class="tn-bg-red--light tn-radius-xs tn-color-red tn-text-xs tn-padding-top-xxs tn-padding-bottom-xxs tn-padding-left-xs tn-padding-right-xs">
													<text>库存：</text>
													<text>{{item.sellStock}}</text>
													<text>{{item.unitName}}</text>
												</view>
											</view>
										</view>
									</view>
									<view style="width: 33.3%; text-align: center;">
										￥{{item.referenceAmount}}
									</view>
									<view style="width: 33.3%;" class="tn-flex tn-flex-col-center tn-flex-row-right">
										<view v-if="item.sellStock>0"
											class="tn-flex tn-flex-col-center tn-flex-row-center">
											<view v-if="getCardSkuTotal(item.skuId)>0"
												style="width: 40rpx; height: 40rpx; border-radius: 50%;"
												class="tn-border-blue tn-border-solid tn-color-blue--dark tn-flex tn-flex-col-center tn-flex-row-center"
												@click="removeCard(item)">
												<text class="tn-icon-reduce tn-text-md tn-padding-xs"></text>
											</view>
											<view v-if="getCardSkuTotal(item.skuId)>0"
												class="tn-padding-left tn-padding-right">
												{{getCardSkuTotal(item.skuId)}}
											</view>
											<view style="width: 40rpx; height: 40rpx; border-radius: 50%;"
												class="tn-border-blue tn-border-solid tn-color-blue--dark tn-flex tn-flex-col-center tn-flex-row-center"
												@click="addCard(item)">
												<text class="tn-icon-add tn-text-md tn-padding-xs"></text>
											</view>
										</view>
										<view v-else
											class="tn-main-gradient-blue--light tn-color-blue--disabled tn-flex tn-flex-col-center tn-flex-row-center"
											style="width: 40rpx; height: 40rpx;border-radius: 50%;">
											<text class="tn-icon-add tn-text-md tn-padding-xs"></text>
										</view>
									</view>
								</view>
							</tn-list-cell>
						</view>
					</tn-list-view>
				</view>
			</scroll-view>
		</tn-popup>
		<tn-popup v-model="cardShow" mode="bottom" :safeAreaInsetBottom="true" :borderRadius="5" :closeBtn="false"
			:negativeTop="10" :marginTop="60">
			<view
				class="tn-flex tn-flex-col-center tn-flex-row-center tn-flex-row-between tn-text-xl tn-border-solid-bottom"
				style="height: 90rpx; width: 100%; padding: 0 30rpx;">
				<view class="tn-flex tn-flex-col-center tn-flex-row-center tn-color-gray tn-text-md"
					style="width: 120rpx;" @click="clearCard">
					<view class="tn-icon-delete tn-margin-right-xs"></view>
					<view>清空</view>
				</view>
				<view class="tn-text-bold">购物车</view>
				<view @click="cardShow=false" class="tn-icon-down" style="padding-right: 20rpx; text-align: right;">
				</view>
			</view>
			<scroll-view scroll-y="true" :style="{height:specPopupHeight+'px'}">
				<view v-if="cashier.cards.length>0" class="tn-cashier__content tn-padding-left tn-padding-right">
					<view v-for="(item,index) in cashier.cards" :key="index" class="tn-cashier__content__sub-cashier">
						<view class="article-shadow">
							<view class="tn-flex tn-flex-row-left tn-margin-top tn-margin-bottom">
								<view class="image-article tn-margin-right-sm">
									<image v-if="item.picture" :src="getPicture(item.picture)" class="image-pic" />
									<image v-else src="@/static/img/goods/default-goods-manage.png"
										class="image-default-pic" />
								</view>
								<view class="tn-flex-1 tn-flex tn-flex-direction-column tn-flex-row-between">
									<view class="tn-text-md clamp-text-1 tn-text-justify" style="font-weight: 500;">
										{{ item.skuName }}
									</view>
									<view
										class="tn-flex tn-flex-direction-row tn-flex-row-between tn-flex-col-center tn-text-md">
										<view class="tn-color-red">
											￥{{ item.adjustAmount || item.payableAmount}}
										</view>
										<view class="tn-flex tn-flex-col-center tn-flex-row-center">
											<view
												class="tn-border-blue tn-border-solid tn-color-blue--dark tn-flex tn-flex-row-center tn-flex-col-center"
												style="width: 40rpx; height: 40rpx; border-radius: 50%;"
												@click="removeCard(item)">
												<text class="tn-icon-reduce tn-text-md tn-padding-xs"></text>
											</view>
											<view class="tn-padding-left tn-padding-right">
												{{item.quantity}}
											</view>
											<view
												class="tn-border-blue tn-border-solid tn-color-blue--dark tn-flex tn-flex-row-center tn-flex-col-center"
												style="width: 40rpx; height: 40rpx; border-radius: 50%;"
												@click="addCard(item)">
												<text class="tn-icon-add tn-text-md tn-padding-xs"></text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-else class="tn-padding-top-xl" style="margin-top: 30%;">
					<tn-empty mode="cart" text="未选择商品"></tn-empty>
				</view>
			</scroll-view>
		</tn-popup>
		<tn-popup v-model="hangShow" mode="bottom" :safeAreaInsetBottom="true" :borderRadius="5" :closeBtn="false"
			:negativeTop="10" :marginTop="60">
			<view
				class="tn-flex tn-flex-col-center tn-flex-row-center tn-flex-row-between tn-text-xl tn-border-solid-bottom"
				style="height: 90rpx; width: 100%; padding: 0 30rpx;">
				<view class="tn-flex tn-flex-col-center tn-flex-row-center tn-color-gray tn-text-md"
					style="width: 120rpx;">
				</view>
				<view class="tn-text-bold">挂单列表</view>
				<view @click="hangShow=false" class="tn-icon-down" style="margin-right:20rpx; float: right;"></view>
			</view>
			<scroll-view scroll-y="true" :style="{height:specPopupHeight+'px'}">
				<view v-if="hangList.length>0" class="tn-cashier__content tn-padding-left tn-padding-right">
					<view v-for="(item,index) in hangList" :key="index" class="tn-cashier__content__sub-cashier">
						<view class="article-shadow">
							<view class="tn-flex tn-flex-row-left tn-margin-top tn-margin-bottom">
								<view class="tn-flex-1 tn-flex tn-flex-direction-column tn-flex-row-between">
									<view class="tn-text-md clamp-text-1 tn-text-justify" style="font-weight: 500;">
										名称：{{ item.name }}
									</view>
									<view
										class="tn-flex tn-flex-direction-row tn-flex-row-between tn-flex-col-center tn-text-md">
										<view class="tn-color-red">
											挂单日期：{{item.updateTime}}
										</view>
										<view class="tn-flex tn-flex-col-center tn-flex-row-center">
											<tn-button :plain="true" fontColor="tn-color-grey"
												backgroundColor="tn-bg-blue--dark" height="auto" padding="10rpx 20rpx"
												@click="takeHang(item.hangNo)">
												取单
											</tn-button>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-else class="tn-padding-top-xl" style="margin-top: 30%;">
					<tn-empty mode="cart" text="无挂单信息"></tn-empty>
				</view>
			</scroll-view>
		</tn-popup>
		<tn-popup v-model="saveHangShow" mode="bottom" :safeAreaInsetBottom="true" :borderRadius="5" :closeBtn="true"
			closeBtnIcon="left" closeBtnPosition="top-left" :negativeTop="10" :marginTop="60" @open="hangPopupOpen"
			@close="hangPopupClose">
			<view
				class="tn-flex tn-flex-col-center tn-flex-row-center tn-flex-row-between tn-text-xl tn-border-solid-bottom"
				style="height: 90rpx; width: 100%; padding: 0 30rpx;">
				<view class="tn-text-bold">保存挂单</view>
			</view>
			<scroll-view scroll-y="true">
				<view style="padding: 16px">
					<tn-tips ref="rechargeTips" position="top"></tn-tips>
					<tn-form :model="hangInfo" ref="hangInfoRef" :errorType="['message']" :labelWidth="180"
						labelAlign="right">
						<tn-form-item label="挂单名：" prop="name" required>
							<tn-input v-model="hangInfo.name" placeholder="挂单名称" />
						</tn-form-item>
						<tn-form-item label="备注：" prop="remark">
							<tn-input v-model="hangInfo.remark" placeholder="备注" />
						</tn-form-item>
					</tn-form>
				</view>
			</scroll-view>
			<view class="tn-padding tn-flex tn-flex-col-center tn-flex-row-between">
				<view class="tn-flex-1 tn-padding-left-xl tn-padding-right-xl">
					<tn-button backgroundColor="tn-bg-blue" fontColor="tn-color-white" style="width: 100%;"
						shape="round" :blockRepeatClick="true" @click="saveHang()">保存</tn-button>
				</view>
			</view>
		</tn-popup>
		<view class="tabbar footerfixed">
			<view class="tn-flex tn-flex-row-between tn-margin-top">
				<view class="justify-content-item tn-padding-left">
					<view class="tn-flex tn-flex-row-center tn-flex-col-center">
						<view
							class="icon12__item--icon tn-flex tn-flex-row-center tn-flex-col-center tn-main-gradient-blue--light tn-color-blue--dark">
							<view class="tn-icon-cart-fill" @click="cardShow=true">
								<tn-badge backgroundColor="#E72F8C" fontColor="#FFFFFF" :absolute="true" :radius="36"
									:fontSize="20">
									<text>{{getCardTotal()}}</text>
								</tn-badge>
							</view>
						</view>
						<view class="tn-margin-left tn-padding-right tn-text-ellipsis">
							<view class="tn-padding-right tn-padding-left-sm tn-text-xl">
								￥{{cashier.payableAmount}}
							</view>
						</view>
					</view>
				</view>
				<view class="tn-flex tn-flex-row-center tn-flex-col-center tn-padding-right">
					<tn-button v-if="cashier.cards.length>0" :plain="true" fontColor="tn-color-grey"
						backgroundColor="tn-bg-blue--dark" :fontSize="30" height="auto" padding="20rpx 28rpx"
						style="font-weight: 400; margin-right: 16px;" @click="saveHangShow=true">挂单</tn-button>
					<tn-button v-else :plain="true" fontColor="tn-color-grey" backgroundColor="tn-bg-blue--dark"
						:fontSize="30" height="auto" padding="20rpx 28rpx" style="font-weight: 400; margin-right: 16px;"
						@click="getHangList">取挂单</q></tn-button>
					<tn-button shadow fontColor="tn-color-white" backgroundColor="tn-bg-blue--dark" :fontSize="40"
						height="auto" padding="20rpx 28rpx" @click="submitCashier">结算</tn-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import category from '@/api/goods/category'
	import stockStore from '@/api/stock/stockStore'
	import uuid from '@/uni_modules/tuniao-ui/libs/function/uuid'
	import cashierOrder from '@/api/cashier/cashierOrder'
	import member from '@/api/member/member'
	import mixin from '@/common/mixin'
	import cashierHang from '@/api/cashier/cashierHang'
	import config from '../common/config'

	export default {
		name: 'cashierIndex',
		mixins: [mixin],
		data() {
			return {
				tips: {
					type: 'success',
					mask: false,
					message: '提示',
					duration: 2000
				},
				tabsList: [{
						name: '商品销售'
					},
					{
						name: '快捷记账'
					}
				],
				tabsIndex: 0,
				swiperIndex: 0,
				swiperTop: 0,
				swiperHeight: 0,
				fastCashierAmount: '0',
				fastCashierList: [
					// type,1:组织数字，2：删除，3：清空，4：确认
					{
						name: '9',
						type: 1,
						icon: ''
					}, {
						name: '8',
						type: 1,
						icon: ''
					}, {
						name: '7',
						type: 1,
						icon: ''
					}, {
						name: '6',
						type: 1,
						icon: ''
					}, {
						name: '5',
						type: 1,
						icon: ''
					}, {
						name: '4',
						type: 1,
						icon: ''
					}, {
						name: '3',
						type: 1,
						icon: ''
					}, {
						name: '2',
						type: 1,
						icon: ''
					}, {
						name: '1',
						type: 1,
						icon: ''
					}, {
						name: '.',
						type: 1,
						icon: ''
					}, {
						name: '0',
						type: 1,
						icon: ''
					}, {
						name: '删除',
						type: 2,
						icon: 'backspace'
					}, {
						name: '清除',
						type: 3,
						icon: ''
					}, {
						name: '00',
						type: 1,
						icon: ''
					}, {
						name: '加入购物车',
						type: 4,
						icon: ''
					}
				],
				searchParams: {
					searchKey: '',
					categoryId: '',
					pageIndex: 1,
					pageSize: 20
				},
				pageTotal: 1,
				categoryList: [],
				spuOptionList: [],
				skuOptionList: [],
				selectSpu: {},
				// 分类菜单item的信息
				tabbarItemInfo: [],
				customNavbarHeight: 0,
				// scrollView的高度
				scrollViewHeight: 0,
				// 左边scrollView的滚动高度
				leftScrollViewTop: 0,
				// 右边scrollView的滚动高度
				rightScrollViewTop: 0,
				rightScrollViewWidth: 0,
				scrollRefresher: false,
				// 当前选中的tabbar序号
				currentTabbarIndex: 0,
				specPopupHeight: 0,
				specShow: false,
				cardShow: false,
				addMemberPupopShow: false,
				memberList: [],
				hangShow: false,
				saveHangShow: false,
				hangList: [],
				hangInfo: {},
				cashier: {
					memberId: '',
					member: {},
					type: 1,
					group: 1,
					category: 1,
					cards: [],
					discount: 10, //折扣
					discountAmount: 0, // 折扣金额
					ignoreType: 0, //抹零
					ignoreAmount: 0, // 抹零金额
					preferentialAmount: 0, // 优惠金额
					collectAmount: 0, // 优惠后金额
					adjustAmount: 0, // 调整金额
					payableAmount: 0, // 应收
					remark: '',
					source: 1
				},
				hangRules: {
					name: [{
						validator: (rule, value, callback) => {
							if (value) {
								return true
							}
							return false
						},
						message: '请输入挂单名称',
						trigger: ['change', 'blur'],
					}]
				},
				phoneInput:''
			}
		},
		computed: {
			tabbarItemClass() {
				return index => {
					if (index === this.currentTabbarIndex) {
						return 'tn-cashier__tabbar__item--active tn-bg-white'
					} else {
						let clazz = 'tn-bg-gray--light'
						if (this.currentTabbarIndex > 0 && index === this.currentTabbarIndex - 1) {
							clazz += ' tn-cashier__tabbar__item--active--prev'
						}
						if (this.currentTabbarIndex < this.categoryList.length && index === this.currentTabbarIndex +
							1) {
							clazz += ' tn-cashier__tabbar__item--active--next'
						}
						return clazz
					}
				}
			}
		},
		onShow() {
			const options = {
				animation: true
			}
			uni.showTabBar(options)
			if (this.isLogin) {
				this.getCategoryList()
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.getScrollViewInfo()
			})
		},
		methods: {
			async getScrollViewInfo() {
				// 获取效果演示框的节点信息
				const customNavbar = await mixin.methods.getRect(this, '.custom-nav')
				const tabs = await mixin.methods.getRect(this, '.tn-cashier__tabs')
				const search = await mixin.methods.getRect(this, '.tn-cashier__search--wrap')
				const footerfixed = await mixin.methods.getRect(this, '.footerfixed')
				const systemInfo = uni.getSystemInfoSync()

				this.swiperTop = tabs.height
				this.swiperHeight = systemInfo.windowHeight - customNavbar.height - tabs.height -
					footerfixed.height
				this.specPopupHeight = systemInfo.windowHeight * 0.5
				this.customNavbarHeight = customNavbar.height
				this.scrollViewHeight = systemInfo.windowHeight - customNavbar.height - tabs.height -
					search.height - footerfixed.height - uni.upx2px(20)
			},
			refresh() {
				this.cashier = {
					memberId: '',
					member: {},
					type: 1,
					group: 1,
					category: 1,
					cards: [],
					discount: 10, //折扣
					discountAmount: 0, // 折扣金额
					ignoreType: 0, //抹零
					ignoreAmount: 0, // 抹零金额
					preferentialAmount: 0, // 优惠金额
					collectAmount: 0, // 优惠后金额
					adjustAmount: 0, // 调整金额
					payableAmount: 0, // 应收
					remark: '',
					source: 1
				}
			},
			getPicture(picture) {
				return config.pictureUrl + picture
			},
			memberSearch() {
				if (this.phoneInput && this.phoneInput.length == 4) {
					member.memberSearch(this.phoneInput).then(res => {
						this.memberList = res.data
					})
				}
			},
			cashierMemberSubmit(item) {
				this.cashier.memberId = item.id
				this.cashier.member = item
				this.addMemberPupopShow = false
			},
			clearCashierMember() {
				this.cashier.memberId = ''
				this.cashier.member = {}
				this.addMemberPupopShow = false
			},
			addMemberPupopShowClick(){
				if (!this.isLogin) {
					this.$refs.popup.open();
					return;
				}
				this.addMemberPupopShow = true
			},
			getHangList() {
				if (!this.isLogin) {
					this.$refs.popup.open();
					return;
				}
				// 挂单列表
				cashierHang.saleHangList().then(res => {
					this.hangList = res.data || []
					this.hangShow = true
				})
			},
			takeHang(hangNo) {
				// 取单
				cashierHang.saleTakeHang(hangNo).then(res => {
					const shop = JSON.parse(res.data.detail)
					this.clearCard()
					this.cashier.cards = shop
					this.hangShow = false
					this.cashierAmount()
				})
			},
			hangPopupOpen() {
				this.$refs.hangInfoRef.setRules(this.hangRules)
			},
			hangPopupClose() {
				this.hangInfo = {}
			},
			saveHang() {
				// 保存挂单
				this.$refs.hangInfoRef.validate(valid => {
					if (valid) {
						this.hangInfo.detail = JSON.stringify(this.cashier.cards)
						cashierHang.saleHangRecord(this.hangInfo).then(() => {
							this.$refs.tips.show({
								msg: '挂单成功',
								backgroundColor: '#3465CC',
								fontColor: '#FFFFFF',
								duration: 3000
							})
							this.clearCard()
							this.saveHangShow = false
						})
					} else {
						this.$refs.tips.show({
							msg: '请输入挂单信息',
							backgroundColor: '#FFA726',
							fontColor: '#FFFFFF',
							duration: 3000
						})
					}
				})
			},
			scrolltolower() {
				this.searchParams.pageIndex += 1
				this.getStockSpuList()
			},
			scrollPull() {
				this.scrollRefresher = true
				this.searchParams.pageIndex = 1
				this.pageTotal = 1
				setTimeout(() => {
					this.getStockSpuList()
				}, 300)
			},
			searchScan() {
				if (!this.isLogin) {
					this.$refs.popup.open();
					return;
				}
				const that = this
				uni.scanCode({
					onlyFromCamera: true,
					scanType: ['barCode', 'qrCode'],
					autoZoom: true,
					hideAlbum: true,
					success(res) {
						that.searchParams.searchKey = res.result
						that.searchParams.categoryId = ''
						that.scrollPull()
					}
				})
			},
			getCategoryList() {
				category.categoryList().then(res => {
					this.categoryList = res.data || []
					if (this.categoryList) {
						const item = this.categoryList[0]
						this.searchParams.categoryId = item.id
						this.scrollPull()
					}
				})
			},
			// 标签栏值发生改变
			tabsChange(index) {
				this.swiperIndex = index
			},
			// swiper-item位置发生改变
			swiperTransition(event) {
				this.$refs.tabs.setDx(event.detail.dx)
			},
			// swiper动画结束
			swiperAnimationFinish(event) {
				const current = event.detail.current
				this.$refs.tabs.setFinishCurrent(current)
				this.swiperIndex = current
				this.tabsIndex = current
			},
			// 获取分类菜单每个item的信息
			getTabbarItemRect() {
				let view = uni.createSelectorQuery().in(this)
				for (let i = 0; i < this.categoryList.length; i++) {
					view.select('#tabbar_item_' + i).boundingClientRect()
				}
				view.exec(res => {
					if (!res.length) {
						setTimeout(() => {
							this.getTabbarItemRect()
						}, 10)
						return
					}

					// 将每个分类item的相关信息
					res.map((item) => {
						this.tabbarItemInfo.push({
							top: item.top,
							height: item.height
						})
					})
				})
			},
			// 点击了分类导航
			clickClassifyNav(item, index) {
				if (this.currentTabbarIndex === index) {
					return
				}
				this.currentTabbarIndex = index

				this.switchClassifyContent(item)
			},
			// 切换对应分类的数据
			switchClassifyContent(item) {
				this.rightScrollViewTop = 1
				this.$nextTick(() => {
					this.rightScrollViewTop = 0
				})
				this.searchParams.categoryId = item.id
				this.scrollPull()
			},
			getStockSpuList() {
				stockStore.stockSpuSearchPage(this.searchParams).then(res => {
					if (this.searchParams.pageIndex === 1) {
						this.spuOptionList = []
					}
					if (res.data.rows > 0) {
						res.data.data.forEach(x => {
							this.spuOptionList.push(x)
						})
						this.pageTotal = res.data.total
					}
				}).finally(() => {
					this.scrollRefresher = false
				})
			},
			addSku(spu) {
				if (!this.isLogin) {
					this.$refs.popup.open();
					return;
				}
				stockStore.stockSkuSearchBySpuId(spu.id).then(res => {
					this.skuOptionList = res.data
					if (this.skuOptionList.length === 1) {
						// 直接加入购物车
						this.addCard(this.skuOptionList[0])
					} else {
						// 弹窗选择规格商品
						this.specShow = true
						this.selectSpu = spu
					}
				})
			},
			removeSku(spu) {
				stockStore.stockSkuSearchBySpuId(spu.id).then(res => {
					this.skuOptionList = res.data
					if (this.skuOptionList.length === 1) {
						// 直接加入购物车
						this.removeCard(this.skuOptionList[0])
					} else {
						// 弹窗选择规格商品
						this.specShow = true
						this.selectSpu = spu
					}
				})
			},
			specPopupOpen() {

			},
			specPopupClose() {
				this.skuOptionList = []
				this.selectSpu = {}
			},
			fastCashier(item) {
				if (!this.isLogin) {
					this.$refs.popup.open();
					return;
				}
				if (item.type === 1) {
					if (this.fastCashierAmount === '0') {
						if (item.name !== '.') {
							this.fastCashierAmount = item.name
							return
						}
					}
					this.fastCashierAmount += item.name
				} else if (item.type === 2) {
					if (this.fastCashierAmount.length - 1 <= 0) {
						this.fastCashierAmount = '0'
						return
					}
					this.fastCashierAmount = this.fastCashierAmount.substring(0, this.fastCashierAmount.length - 1)
				} else if (item.type === 3) {
					this.fastCashierAmount = '0'
				} else if (item.type === 4) {
					// 加入购物车
					const card = {
						key: uuid(),
						skuId: '',
						skuName: '临时商品',
						spuId: '',
						quantity: 1,
						adjustAmount: this.fastCashierAmount,
						skuNo: ''
					}
					console.log(card)
					this.cashier.cards.push(card)
					this.fastCashierAmount = '0'
				}
			},
			addCard(item) {
				const index = this.cashier.cards.findIndex(x => x.skuId === item.skuId)
				if (index >= 0) {
					const item = this.cashier.cards[index]
					console.log(item)
					if (item.quantity < item.sellStock) {
						item.quantity += 1
					}
				} else {
					const card = {
						key: uuid(),
						skuId: item.skuId,
						skuName: item.skuName,
						spuId: item.spuId,
						quantity: 1,
						adjustAmount: 0,
						payableAmount: 0,
						skuNo: item.skuNo,
						sellStock: item.sellStock
					}
					this.cashier.cards.push(card)
				}
				this.cashierAmount()
			},
			removeCard(item) {
				const index = this.cashier.cards.findIndex(x => x.skuId === item.skuId)
				if (index < 0) {
					return
				}
				const sku = this.cashier.cards[index]
				if (sku.quantity - 1 === 0) {
					this.cashier.cards.splice(index, 1)
				} else {
					this.cashier.cards[index].quantity -= 1
				}
				this.cashierAmount()
			},
			clearCard() {
				this.cashier.discountAmount = 0
				this.cashier.ignoreAmount = 0
				this.cashier.preferentialAmount = 0
				this.cashier.adjustAmount = 0
				this.cashier.payableAmount = 0
				this.cashier.cards = []
			},
			cashierAmount() {
				this.cashier.type = 0
				cashierOrder.cashierOrderCompute(this.cashier).then(res => {
					const data = res.data
					this.cashier.discountAmount = data.discountAmount
					this.cashier.ignoreAmount = data.ignoreAmount
					this.cashier.preferentialAmount = data.preferentialAmount
					this.cashier.adjustAmount = data.adjustAmount
					this.cashier.payableAmount = data.payableAmount
					this.cashier.cards.forEach(card => {
						const findIndex = data.skus.findIndex(x => x.key === card.key)
						if (findIndex >= 0) {
							const sku = data.skus[findIndex]
							card.adjustAmount = sku.adjustAmount
							card.payableAmount = sku.payableAmount
						}
					})
				})
			},
			getCardTotal() {
				if (this.cashier.cards.length === 0) {
					return 0
				}
				return this.cashier.cards.map(x => x.quantity)
					.reduce((x, y) => {
						return x + y
					})
			},
			getCardSpuTotal(spuId) {
				const skus = this.cashier.cards.filter(x => x.spuId === spuId)
				if (skus.length === 0) {
					return 0
				}
				return skus.map(x => x.quantity)
					.reduce((x, y) => {
						return x + y
					})
			},
			getCardSkuTotal(skuId) {
				const skus = this.cashier.cards.filter(x => x.skuId === skuId)
				if (skus.length === 0) {
					return 0
				}
				return skus.map(x => x.quantity)
					.reduce((x, y) => {
						return x + y
					})
			},
			submitCashier() {
				if (!this.isLogin) {
					this.$refs.popup.open();
					return;
				}
				if (this.cashier.cards.length === 0) {
					this.$refs.tips.show({
						msg: '未选择任何商品',
						backgroundColor: '#FFA726',
						fontColor: '#FFFFFF',
						duration: 1500
					})
					return
				}
				uni.navigateTo({
					url: `/view/cashier/confirm?cashier=${encodeURIComponent(JSON.stringify(this.cashier))}`
				})
			},
			close() {
				this.$refs.popup.close()
			},
			gotoLogin() {
				this.$refs.popup.close();
				mixin.methods.gotoLogin();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tn-cashier {
		&--wrap {
			position: fixed;
			left: 0;
			right: 0;
			width: 100%;
			background-color: inherit;
		}

		/* 导航栏 start */
		&__tabs {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			background-color: inherit;
		}

		/* 导航栏 end */

		/* swiper start */
		&__swiper {
			position: absolute;
			left: 0;
			right: 0;
			width: 100%;
			background-color: inherit;
			// padding: 0 16rpx;
		}

		/* swiper end */

		/* 收银 start */
		&__item {
			margin: 20rpx;
			padding: 36rpx 26rpx;
			background-color: #FFFFFF;
			border-radius: 18rpx;

			&:first-child {
				margin-top: 40rpx;
			}

			&:last-child {
				margin-bottom: 0;
			}

			/* 头部 start */
			&__head {

				&__title {
					font-weight: bold;
					line-height: normal;

					&--right-icon {
						font-size: 24rpx;
						margin-left: 8rpx;
					}
				}

				&__status {
					font-size: 22rpx;
					color: #AAAAAA;
				}
			}

			/* 头部 end */

			/* 内容 start */
			&__content {

				margin-top: 20rpx;

				&__image {
					margin-right: 20rpx;

					image {
						width: 140rpx;
						height: 140rpx;
						border-radius: 10rpx;
					}
				}

				&__title {
					padding-right: 40rpx;
					display: -webkit-box;
					overflow: hidden;
					white-space: normal !important;
					text-overflow: ellipsis;
					word-wrap: break-word;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}

				&__info {

					&__price {
						&--unit {
							font-size: 20rpx;
						}

						&__value--integer,
						&__value--decimal {
							font-weight: bold;
						}

						&__value--decimal {
							font-size: 20rpx;
						}
					}

					&__count {
						color: #AAAAAA;
						font-size: 24rpx;
					}
				}
			}

			/* 内容 end */

			/* 操作按钮 start */
			&__operation {
				margin-top: 30rpx;

				&__right {
					&__button {
						margin-left: 10rpx;
					}
				}
			}

			/* 操作按钮 end */
		}

		/* 内容 end */

		/* 搜索栏 start */
		&__search {
			&--wrap {
				height: 126rpx;
			}

			&__box {
				flex: 1;
				text-align: center;
				padding: 20rpx 0;
				margin: 0 30rpx;
				border-radius: 60rpx;
				font-size: 26rpx;
			}

			&__icon {
				padding-right: 10rpx;
			}
		}

		/* 分类列表和内容 end */

		/* 侧边导航 start */
		&__tabbar {
			&__item {
				height: 90rpx;

				&:first-child {
					border-top-right-radius: 0rpx;
				}

				&:last-child {
					border-bottom-right-radius: 0rpx;
				}

				&--active {
					background-color: #FFFFFF;
					position: relative;
					font-weight: bold;

					&::before {
						content: '';
						position: absolute;
						width: 12rpx;
						height: 40rpx;
						top: 50%;
						left: 0;
						background-color: $tn-main-color;
						border-radius: 12rpx;
						transform: translateY(-50%) translateX(-50%);
					}

					&--prev {
						border-bottom-right-radius: 26rpx;
					}

					&--next {
						border-top-right-radius: 26rpx;
					}
				}
			}
		}

		/* 侧边导航 end */

		/* 分类内容 start */
		&__content {

			/* 推荐商品 start */
			&__recomm {
				margin-bottom: 40rpx;

				&__swiper {}
			}

			/* 推荐商品 end */

			/* 子栏目 start */
			&__sub-classify {
				margin-bottom: 20rpx;

				&--title {
					font-weight: bold;
					margin-bottom: 18rpx;
				}

				&__content {

					&__item {
						width: 33%;
					}

					&__title {
						margin-right: 10rpx;
					}
				}
			}

			.tn-tag-content {
				&__item {
					display: inline-block;
					line-height: 35rpx;
					padding: 5rpx 10rpx;
					border-radius: 12rpx;

					&--prefix {
						padding-right: 10rpx;
					}
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
					height: 100rpx;
				}

				.image-default-pic {
					width: 50rpx;
					height: 50rpx;
					// 白色图
				}
			}
		}
	}
</style>