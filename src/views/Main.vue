<template>
    <div class="main" :class="{'main-hide-text': hideMenuText}">
        <div :style="{width:hideMenuText?'0':'200px'}" class="sidebar-menu-con">
            <div class="logo-con">
                <img src="../images/logo.jpg" key="max-logo"/>
            </div>
            <sidebar-menu :menuList="menuList" :iconSize="20"/>
        </div>
        <div class="main-content">
            <div class="main-header-con" :style="{paddingLeft: hideMenuText?'0':'200px'}">
                <div class="main-header">
                    <div class="navicon-con">
                        <Button :style="{transform: 'rotateZ(' + (this.hideMenuText ? '-90' : '0') + 'deg)'}"
                                type="text"
                                @click="toggleClick">
                            <Icon type="navicon" size="32"></Icon>
                        </Button>
                    </div>
                    <div class="header-avator-con hide-mobile">
                        <div @click="handleFullScreen" v-if="showFullScreenBtn" class="full-screen-btn-con">
                            <Tooltip :content="isFullScreen ? '退出全屏' : '全屏'" placement="bottom">
                                <Icon :type="isFullScreen ? 'arrow-shrink' : 'arrow-expand'" :size="23"></Icon>
                            </Tooltip>
                        </div>
                        <div class="user-dropdown-menu-con">
                            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                                <Dropdown trigger="click" @on-click="handleClickUserDropdown">
                                    <a href="javascript:void(0)">
                                        <span class="main-user-name">{{ user.username }}</span>
                                        <Icon type="arrow-down-b"></Icon>
                                    </a>
                                    <DropdownMenu slot="list">
                                        <DropdownItem name="loginout">退出登录</DropdownItem>
                                    </DropdownMenu>
                                    <DropdownMenu slot="list">
                                        <DropdownItem name="changepwd">修改密码</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </Row>
                        </div>
                    </div>
                </div>
                <div class="tags-con">
                    <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
                </div>
            </div>
            <div id="single-page-con" class="single-page-con" :style="{left: hideMenuText?'0':'200px'}">
                <div class="single-page">
                    <keep-alive :include="cachePage">
                        <router-view></router-view>
                    </keep-alive>
                </div>
            </div>
            <!--<up-down srcollEl="#single-page-con"></up-down>-->
        </div>

        <el-dialog
                :append-to-body="true"
                :visible.sync="showEditModal">
            <div class="p-sm">
                <div class="edit-modal-item" style=" padding: 10px 0;">
                    <span class="plr-sm">原密码</span>
                    <el-input v-model="oldPwd" show-password class="w-5" placeholder="请输入原密码"></el-input>
                </div>
                <div class="edit-modal-item" style=" padding: 10px 0;">
                    <span class="plr-sm">新密码</span>
                    <el-input v-model="newPwd" show-password class="w-5" placeholder="请输入新密码"></el-input>
                </div>
                <div class="edit-modal-item" style=" padding: 10px 0;">
                    <span class="plr-sm">新密码</span>
                    <el-input v-model="newPwd02" show-password class="w-5" placeholder="再次输入新密码"></el-input>
                </div>
            </div>
            <div slot="footer" class="text-center">
                <el-button @click="commitItem()" type="primary">保存</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import sidebarMenu from './main_components/sidebarMenu.vue'
    import tagsPageOpened from './main_components/tagsPageOpened.vue'
    import upDown from '@/common/upDown.vue'
    import util from '@/libs/util.js'
    import Admin from '@/tool/Admin.js'

    export default {
        components: {
            sidebarMenu,
            tagsPageOpened,
            upDown
        },
        data() {
            return {
                user: {},
                spanLeft: 4,
                spanRight: 20,
                currentPageName: '',
                hideMenuText: false,
                showFullScreenBtn: window.navigator.userAgent.indexOf('MSIE') < 0,
                messageCount: 0,
                lockScreenSize: 0,
                showEditModal: false,
                newPwd: '',
                newPwd02: '',
                oldPwd: ''
            };
        },
        computed: {
            menuList() {
                return this.$store.state.menuList;
            },

            tagsList() {
                return this.$store.state.tagsList;  // 所有页面的页面对象
            },

            pageTagsList() {
                return this.$store.state.pageOpenedList;  // 打开的页面的页面对象
            },

            currentPath() {
                return this.$store.state.currentPath;  // 当前面包屑数组
            },

            menuIconColor() {
                return this.$store.state.menuTheme === 'dark' ? 'white' : '#495060';
            },

            cachePage() {
                return this.$store.state.cachePage;
            },

            isFullScreen() {
                return this.$store.state.isFullScreen;
            }
        },
        methods: {
            init() {
                this.$store.commit('setCurrentPageName', this.$route.name);
                let pathArr = util.setCurrentPath(this, this.$route.name);
                if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
            },

            toggleClick() {
                this.hideMenuText = !this.hideMenuText;
            },

            handleClickUserDropdown(name) {
                let that = this;
                console.log(name)
                if (name === 'loginout') {
                    Admin.prototype.logout().then(() => {
                        that.$store.commit('clearOpenedSubmenu');
                        localStorage.removeItem('user');
                        that.$router.push('/login');
                    });
                }
                if (name === 'changepwd') {
                    that.showEditModal = true;
                }
            },
            commitItem() {
                const that = this
                if (that.oldPwd && that.newPwd && that.newPwd02) {
                    if (that.newPwd !== that.newPwd02) {
                        that.$message({
                            type: 'info',
                            message: '密码输入不一致'
                        });
                    } else if (that.oldPwd === that.newPwd) {
                        that.$message({
                            type: 'info',
                            message: '新老密码不能一致'
                        });
                    } else {
                        var data = {
                            'password': that.oldPwd,
                            'newPassword': that.newPwd/**/
                        };
                        Admin.prototype.changePwd(data).then((res) => {
                            console.log(res.data.status);
                            if (res.data.status) {
                                Admin.prototype.logout().then(() => {
                                    that.$store.commit('clearOpenedSubmenu');
                                    localStorage.removeItem('user');
                                    that.$router.push('/login');
                                });
                            } else {
                                that.$message({
                                    type: 'info',
                                    message: '密码修改不 成功'
                                });
                            }
                        });
                    }
                } else {
                    that.$message({
                        type: 'info',
                        message: '信息不全'
                    });
                }
            },
            handleFullScreen() {
                this.$store.commit('handleFullScreen');
            },

            checkTag(name) {
                let openpageHasTag = this.pageTagsList.some(item => {
                    if (item.name === name) {
                        return true;
                    }
                });
                if (!openpageHasTag) {  //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                    util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
                }
            },

            getCurrentUser() {
                const that = this;
                Admin.prototype.getCurrentInfo().then(
                    res => {
                        let user = res.data.data || {};
                        that.user = user;
                        var role = user.roleNames[0]
                        var menuList = this.$store.state.menuList
                        menuList = that.processMunulist(menuList, role)
                        this.$store.state.menuList = menuList;

                        localStorage.setItem('user', JSON.stringify(user));
                    },
                    () => {
                        localStorage.removeItem('user');
                        location.href = `#/login?returnUrl=${location.href}`;
                    }
                );
            },
            processMunulist(arr, role) {
                // const that = this
                arr.forEach(item => {
                    if (item.role === role || item.role === 'share') {
                        item.show = true;
                    } else {
                        item.show = false;
                    }
                })
                return arr;
            }
        },

        watch: {
            '$route'(to) {
                this.$store.commit('setCurrentPageName', to.name);
                let pathArr = util.setCurrentPath(this, to.name);
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.checkTag(to.name);
            }
        },
        mounted() {

        },

        created() {
            this.init();
            this.getCurrentUser();
            this.user = JSON.parse(localStorage.getItem('user')) || {};
            this.hideMenuText = document.documentElement.clientWidth <= 768;
            this.$store.commit('changeMenuTheme', 'dark');
            this.$store.commit('changeMainTheme', 'b');
            this.$store.commit('setOpenedList');
        }
    };
</script>
