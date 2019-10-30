<template>
	<el-header id="publicheader" height="120px">
		<div class="title">
			<ul>
				<!-- <li>
					<router-link to="/baseConf">{{$t('navbar.alarm')}}</router-link>
				</li> -->
				<li>
					<el-dropdown @command="togglePrj">
						<span class="el-dropdown-link">
							当前项目: {{getPrjName}}<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu  slot="dropdown">
							<el-dropdown-item v-for="item in prjData" :key="item.rowId" :command="item">
								<a>{{item.projectName}}</a>
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</li>
				<!-- <li>
					<el-dropdown @command="toggleLang">
						<span class="el-dropdown-link">
							<img src="@/assets/images/aa.gif" style="margin-right: 5px; width: 20px; border-radius: 50%; vertical-align: middle;">
							{{$t('navbar.language')}}<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="zh">
								<a>{{$t('navbar.cn')}}</a>
							</el-dropdown-item>
							<el-dropdown-item command="en">
								<a>{{$t('navbar.en')}}</a>
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</li> -->
				<li>
					<el-dropdown>
						<router-link to="/home">{{$t('navbar.param')}}</router-link>
					</el-dropdown>
				</li>
				<li>
					<el-dropdown>
						<span class="el-dropdown-link">
							<i class="iconfont icon-yonghu" style="font-size: 18px;vertical-align: middle;color:#28CAD8;"></i>
							<span :title="currentUser" >{{currentUser}}</span>
							<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<!-- <el-dropdown-item>
								<router-link to="/baseConf">{{$t('navbar.changePassword')}}</router-link>
							</el-dropdown-item> -->
							<el-dropdown-item>
								<router-link to="/login">{{$t('navbar.signOut')}}</router-link>
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</li>
			</ul>
			<div class="logo">
			<!-- <div> -->
				<!-- <img src="/static/imgs/logo.png" alt="logo"> -->
				<img :src="logoUrl" alt="logo">
				<!-- <span>江苏斯洛尔集团</span> -->
			</div>
		</div>
		<headerMenu></headerMenu>
	</el-header>
</template>
<script>
import headerMenu from './menu/menu'
import userApi from '@/api/sysManage/userManage'
import prjApi from '@/api/config/projectConf'
import store from '@/store'
export default {
	name: 'PublicHeader',
	components:{
		headerMenu
	},
	computed: {
		getPrjName() {
			return this.prjName;
		}
	},
	data() {
		return {
			logoUrl: '',
			currentUser: '',
			prjName: '',
			prjData: []
		}
	},
	created(){
		var _this = this;
	},
	mounted() {
		this.getCurrentUser();
		this.getAllPrj();
	},
	methods: {
		toggleLang(lang) {
			if(lang == 'zh'){
				localStorage.setItem('locale', 'zh')
				this.$i18n.locale = localStorage.getItem('locale')
				this.$message({
					message: '切换为中文！',
					type: 'success'
				})
			} else if (lang == 'en') {
				localStorage.setItem('locale', 'en')
				this.$i18n.locale = localStorage.getItem('locale')
				this.$message({
					message: 'Switch to English!',
					type: 'success'
				})
			}
		},
		togglePrj(prjItem) {
			// 选择的项目
			if (prjItem != null) {
				this.prjName = prjItem.projectName;
				// 保存选中的
    			this.$store.commit('setProjectId', prjItem.rowId);
			}
		},
		getCurrentUser() {
			userApi.getCurrnetUser().then(res => {
				this.currentUser = res.userName;
        		console.log('publicheader currentUser' +  res.userName);
				this.logoUrl = "/imgs/logo/" + res.orgId + ".png";
			})
		},
		getAllPrj() {
			prjApi.queryList().then(res => {
				if (res.length > 0) {
					this.prjData = res;
					this.prjName = res[0].projectName;
					// 保存默认选中	
    				this.$store.commit('setProjectId', res[0].rowId);
				} else {
					this.prjName = "当前无项目"
				}
			})
		}
	}
}
</script>
<style lang="scss">
#publicheader {
	&.el-header {
		padding: 0;
		.title {
			padding: 0 20px;
			height: 66px;
			line-height: 66px;
			background: url('../../../../assets/images/title.png') center 0 no-repeat;
			color: #fff; 
			.logo {
				float: left;
				img {
					// height: 50px;
					height: 30px;
					vertical-align: middle;
					margin-right: 10px;
				}
			}
			ul {
				float: right;
				li {
					float: left;
					margin-left: 15px;
					a {
						color: #fff;
					}
					.el-dropdown {
						color: #fff;
						.el-dropdown-link {
							cursor: pointer;
						}
					}
				}
			}
		}
		.el-menu.el-menu--horizontal{
			// background: rgba(30, 74, 105, .8) !important;
			background: rgba(0, 255, 255, 0.1) !important;
			height: 46px;
			border-bottom: 0;
			padding-top: 8px;
			.el-menu-item{
				height: 30px !important;
				line-height: 30px !important;
				border-right: 2px solid #24aef4;
				border-bottom: 0 !important;
				a {
					font-size: 16px;
					&:hover {
						color: #e0d811;
						i {
							color: #e0d811;
						}
					}
					i {
						color: #fff;
						font-size: 20px;
						margin-right: 5px;
						position: relative;
						top: -1px;
					}
				}
			}
			.el-submenu {
				height: 30px !important;
				line-height: 30px !important;
				border-right: 2px solid #24aef4;
				.el-submenu__title {
					height: inherit;
					line-height: inherit;
					border: 0;
					font-size: 16px;
					&:hover {
						background: transparent !important;
						// color: #e0d811 !important;
						i,
						a {
							color: #e0d811;
						}
					}
					a {
						color: #fff;
					}
					i {
						color: #fff;
						&.iconfont {
							margin-right: 5px;
							font-size: 20px;
						}
					}
				}
			}
		}
	}

	@media screen and (max-height: 954px) {
		.el-header {
			height: 104px !important;
			.title {
				height: 54px;
				line-height: 54px;
				background-size: 42%;
				.logo {
					img {
						// height: 50px;
						height: 30px;
					}
				}
			}
			.el-menu.el-menu--horizontal{
				height: 40px;
				.el-menu-item,
				.el-submenu{
					height: 25px !important;
					line-height: 25px !important;
				}
			}
		}
	}

	@media screen and (max-width: 1366px) and (max-height: 768px) {
		.el-header {
			height: 92px !important;
			.title {
				height: 50px;
				line-height: 50px;
				background-size: 48%;
				.logo {
					img {
						// height: 50px;
						height: 30px;
					}
				}
			}
			.el-menu.el-menu--horizontal{
				height: 36px;
				padding-top: 8px;
				.el-menu-item{
					height: 20px !important;
					line-height: 20px !important;
					a {
						font-size: 15px;
						i {
							font-size: 18px;
						}
					}
				}
				.el-submenu {
				height: 20px !important;
				line-height: 20px !important;
				.el-submenu__title {
					font-size: 15px;
					i {
						&.iconfont {
							font-size: 18px;
						}
					}
				}
			}
			}
		}
	}
}

.el-menu--popup {
		background: rgba(30, 74, 105, 0.8) !important;
		.el-menu-item {
			padding: 0 !important;
			a {
				padding: 0 20px;
				display: block;
				color: #fff;
				&:hover {
					background: #062d58;
				}
			}
		}
	}
	.el-dropdown-menu {
		background: #0068b7;
		border: 0;
		.el-dropdown-menu__item {
			&:hover {
				background: #062d58;
			}
			a {
				color: #fff;
			}
		}
	}
	.el-popper[x-placement^=bottom] .popper__arrow {
		border-bottom: 0;
		&::after {
			border-bottom-color: #2465a9;
		}
	}
	// .router-link-active {
	// 	color: #e0d811 !important;
	// 	.iconfont {
	// 		color: #e0d811 !important;
	// 	}
	// }
</style>
