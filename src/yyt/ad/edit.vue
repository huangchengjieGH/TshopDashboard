<template>
    <div>
        <div class="row">
            <div class="col-md-8">
                <div class="card display-edit">
                    <div class="content">
                        <h5>{{wihchLabel()}}</h5>
                        <div class="upload-panel"
                             v-for="(row, index) in wihchTabsel()"
                             @click.capture="upInit(index)"
                             v-if="row.status !== -1">
                            <div class="row">
                                <div class="col-md-2 text-right" style="font-size: 14px;">图片</div>
                                <div class="col-md-6">
                                    <div class="ysUpload">
                                        <el-upload
                                                :on-change="whichChange"
                                                class="avatar-uploader"
                                                action="/api/upload"
                                                :show-file-list="false"
                                                :on-success="handleAvatarSuccess"
                                                :before-upload="beforeAvatarUpload">
                                            <img v-if="row.imgUrl" :src="row.imgUrl" class="avatar">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                    </div>

                                    <p class="text-grey">建议图片长宽比2:1</p>
                                    <p class="ptb-sm" style="font-size: 14px;line-height: 1.4em;}">
                                        <span>填写标题</span>&nbsp;&nbsp;
                                        <input v-model="row.title"
                                               @input="whichChange"
                                               autocomplete="off"
                                               validateevent="true"
                                               type="text"
                                               checked="checked"
                                               placeholder="为空则无标题"
                                               class="el-input__inner">
                                    </p>
                                    <div class="edit-modal-item"
                                         style="display: flex;flex-direction: column;font-size:14px">
                                        <span class="plr-sm">排序</span>
                                        <el-input type="number" v-model="row.seq" class="w-5"></el-input>
                                    </div>
                                </div>
                                <div class="">
                                    <el-button type="text" @click="deletePic(index)">
                                        <i class="el-icon-delete"></i>
                                        <span>删除</span>
                                    </el-button>
                                </div>
                            </div>
                            <div class="row" style="margin-top: 10px;">
                                <div class="col-md-2 text-right">图片链接</div>
                                <div class="col-md-9">
                                    <el-radio-group v-model="row.relateType" @change="whichChange02"
                                                    style="padding: 4px 20px 20px 10px;">
                                        <!--<el-radio style="margin-left:20px;" class="radio"  :label="4">小程序链接</el-radio>-->
                                        <!--<el-radio style="margin-left:20px;"  :label="3">外部链接</el-radio>-->
                                        <!--<el-radio style="margin-left:20px;" :label="2" v-show="row.relateType === 2">-->
                                        <!--系统链接-->
                                        <!--</el-radio>-->
                                        <el-radio style="margin-left:20px;" :label="1" v-show="row.relateType !== 2">
                                            系统链接
                                        </el-radio>
                                        <el-radio style="margin-left:20px;" :label="0">无链接</el-radio>
                                    </el-radio-group>
                                    <div class="mt12">

                                        <div v-if="(row.relateType === 1 || row.relateType === 2)">
                                            <el-button :disabled="row.relateType !== 1 && row.relateType !== 2"
                                                       @click="isShowDialog">选择链接
                                            </el-button>
                                            <span class="text-info" v-if="row.name">{{row.name}}</span>
                                        </div>

                                        <div v-if="row.relateType === 3|| row.relateType === 4" style="width: 60%;">
                                            <el-input class="p12" style="margin: 0 0 20px 20px;"
                                                      v-if="row.relateType === 4" @change="whichChange"
                                                      placeholder="请输入小程序AppId" v-model="row.appId"></el-input>
                                            <el-input class="p12" style="margin: 0 0 20px 20px;" @change="whichChange"
                                                      :placeholder="row.relateType === 3 ? '请输入外部链接' : '请输入小程序路径'"
                                                      v-model="row.url"></el-input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h5 class="text-center operating-wrapper">
                            <!--<el-button type="success" icon="plus" @click="addRow">添加一项</el-button>-->
                            <el-button style="background-color: #68b3c8;border: none;" type="info" icon="circle-check"
                                       @click="commit">保存修改
                            </el-button>
                        </h5>
                    </div>
                </div>
            </div>
        </div>


        <!--弹框1-->
        <el-dialog :visible.sync="editLinkDialog" :modal-append-to-body="true" :append-to-body="true"
                   class="editLinkDialog">
            <div>
                <el-tabs v-model="activeTabs" @tab-click="handleClick">
                    <el-tab-pane label="商品选择"
                                 name="first">
                        <div class="search-pl">
                            <el-input placeholder="输入商品名搜索" v-model="queryName" class="right-search"
                                      @change="queryGoods">
                                <el-button slot="append" icon="search" @click="queryGoods"
                                           class="el-icon-search"></el-button>
                            </el-input>
                        </div>
                        <my-table :data="goods" :config="tableConfig">
                            <div slot="operating" slot-scope="obj">
                                <el-button @click="goodsChoose(obj.item.id,obj.item.name)" size="small" type="primary">选择</el-button>
                            </div>
                        </my-table>
                        <div v-if="goods.length" class="text-center p-sm">
                            <el-pagination
                                    @current-change="getProductList"
                                    :current-page.sync="search.page"
                                    :page-size="search.pageSize"
                                    layout="total, prev, pager, next, jumper"
                                    :total="goodsSum">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editLinkDialog = false">取 消</el-button>
                <el-button type="primary" @click="editLinkDialog = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import myTable from '@/common/m-table.vue';
    import AD from '@/tool/classFactory/AD.js';
    import Classify from '@/tool/classFactory/Classify.js';
    import Product from '@/tool/classFactory/Product.js';
    export default {
        name: "ad-edit",
        data() {
            return {
                search: {
                    year: '',
                    name: '',
                    shopId: '',
                    page: 1,
                    pageSize: 10
                },
                editLinkDialog: false,
                activeTabs: 'first',
                queryName: '',
                queryResult: [],
                goods: [],
                classify: [],
                picture: [],
                adId: '',
                current: {
                    index: 0,
                    tabsel: 'banner'
                },
                goodsSum:0,
                tableConfig: [
                    {
                        label: '图片',
                        property: '',
                        img: 'images.0.url'
                    },
                    {
                        label: '名称',
                        property: 'name'
                    },
                    {
                        label: '品牌',
                        property: 'brand'
                    },
                    {
                        label: '年份',
                        property: 'year'
                    },
                    {
                        label: '操作',
                        type: 'operating'
                    }
                ],
                rowsBanner: [
                    {
                        url: '',
                        title: '',
                        name: '',
                        status: 1,
                        imgUrl: '',
                        appId: '',
                        relateType: 1,
                        relateId: -1,
                        seq: '1',
                        type: 'banner'
                    }
                ],
                rowsNavigator: [
                    {
                        id: 0,
                        url: '',
                        name: '',
                        status: 1,
                        imgUrl: '',
                        appId: '',
                        relateType: 0,
                        relateId: -1,
                    }
                ],
                rowsHot: [
                    {
                        id: 0,
                        url: '',
                        name: '',
                        status: 1,
                        imgUrl: '',
                        appId: '',
                        relateType: 0,
                        relateId: -1,
                    }
                ]
            }
        },
        components: {
            myTable
        },
        computed: {
            userType: function () {
                let type = this.$store.state.user.type;

                if (type === 1) {
                    this.activeTabs = 'second';
                } else {
                    this.activeTabs = 'first';
                }
                return type;
            }
        },

        created() {

        },
        activated() {
            console.log('activated');
            this.adId = +this.$route.query.adId || null;
            this.init();
            this.getProductList();
            if (this.adId) {
                this.getAd();
            }
        },
        methods: {
            init() {
                const that = this;
                that.rowsBanner = [
                    {
                        url: '',
                        title: '',
                        name: '',
                        status: 1,
                        imgUrl: '',
                        appId: '',
                        relateType: 1,
                        relateId: -1,
                        seq: '1',
                        type: 'banner'
                    }
                ]
            },

            getProductList(e) {
                const that = this;
                if (e) {
                    that.search.page = e;
                }
                let search = that.search;
                Product.prototype.getShopProduct(search).then(res => {
                    let list = res.data.data || [];
                    that.goods.splice(0, that.goods.length, ...list);
                    that.queryResult.splice(0, that.queryResult.length, ...list);
                    console.log(that.queryResult);
                    that.goodsSum = res.data.extra.count || list.length;
                });
            },



            upInit(index) {
                this.current.index = index;
            },


            wihchTabsel() {
                if (this.current.tabsel === 'banner') {
                    return this.rowsBanner;
                }
                if (this.current.tabsel === 'navigator') {
                    return this.rowsNavigator;
                }
                if (this.current.tabsel === 'hot') {
                    return this.rowsHot;
                }
            },


            wihchLabel() {
                if (this.current.tabsel === 'banner') {
                    return '图片轮播设计（图片信息最多10张）';
                }
                if (this.current.tabsel === 'navigator') {
                    return '分类导航（分类图片最多8张）';
                }
                if (this.current.tabsel === 'hot') {
                    return '热销';
                }
            },
            goodsChoose(id, name) {
                let rows = this.wihchTabsel();
                rows[this.current.index].relateId = id;
                rows[this.current.index].name = name;
                rows[this.current.index].relateType = 1;
                this.editLinkDialog = false
            },


            clickToTabsel(index) {
                let banner = document.getElementById('banner');
                let navigator = document.getElementById('navigator');
                let hot = document.getElementById('hot');

                if (index === 1) {
                    this.current.tabsel = 'banner';
                    banner.style.display = 'inline-block';
                    navigator.style.display = 'none';
                    hot.style.display = 'none';
                }

                if (index === 2) {
                    this.current.tabsel = 'navigator';
                    banner.style.display = 'none';
                    navigator.style.display = 'inline-block';
                    hot.style.display = 'none';
                }

                if (index === 4) {
                    this.current.tabsel = 'hot';
                    banner.style.display = 'none';
                    navigator.style.display = 'none';
                    hot.style.display = 'inline-block';
                }
            },


            TabselToNumber() {
                if (this.current.tabsel === 'hot') {
                    return 1;
                }

                if (this.current.tabsel === 'banner') {
                    return 2;
                }

                if (this.current.tabsel === 'navigator') {
                    return 4;
                }
            },


            imgMax() {
                if (this.current.tabsel === 'banner') {
                    return 10;
                }

                if (this.current.tabsel === 'navigator') {
                    return 8;
                }

                if (this.current.tabsel === 'hot') {
                    return Infinity;
                }
            },


            whichChange(e) {
                let rows = this.wihchTabsel();
                let index = this.current.index;
                rows[index].status = 2;
                console.log(e)
            },
            whichChange02(e){
                let rows = this.wihchTabsel();
                let index = this.current.index;
                rows[index].status = 2;
                if(e == 0){
                    rows[index].relateId = '';
                }
                console.log(e)
            },

            handleAvatarSuccess(res) {
                let index = this.current.index;
                let rows = this.wihchTabsel();
                let item = rows[index];
                item.imgUrl = res.data;
                console.log(item.imgUrl);
                rows.splice(index, 1, item);
//                this.nextTick();
            },


            beforeAvatarUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 1;
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 1MB!');
                }
                return isLt2M;
            },

            getAd() {
                const that = this;
                let adId = that.adId;
                let ad = new AD({id: adId})
                ad.getOne().then(res => {
                    let item = res.data.data || {};
                    let index = that.current.index;
                    let rows = this.wihchTabsel();
                    let row = rows[index];
                    row.appId = item.appId;
                    row.imgUrl = item.imgUrl;
                    row.name = item.name;
                    row.relateId = item.relateId;
                    row.relateType = item.relateType;
                    row.seq = item.seq;
                    row.type = item.type;
                    row.url = item.url;
                    rows.splice(index, 1, row);
                })
            },

            isShowDialog() {
                this.editLinkDialog = true;
                if (this.current.tabsel === 'navigator') {
                    this.activeTabs = 'second';
                }
                this.whichChange();
            },


            handleClick(tab, event) {
                this.activeTabs = tab.name;
            },


            goodsChoose(id, name) {
                let rows = this.wihchTabsel();
                rows[this.current.index].relateId = id;
                rows[this.current.index].name = name;
                rows[this.current.index].relateType = 1;
                this.editLinkDialog = false
            },


            addRow: function () {
                let rows = this.wihchTabsel();
                let max = this.imgMax();
                if (rows.length < max) {
                    rows.push({
                        id: 0,
                        url: '',
                        name: '',
                        status: 1,
                        imgUrl: '',
                        appId: '',
                        relateType: 0,
                        relateId: -1,
                    });
                } else {
                    this.$message({
                        message: '数量已达最大值，不能再增加',
                        type: 'warning'
                    });
                }
            },

            deletePic(index) {
                this.upInit(index);
                this.$confirm(
                    '此操作将永久删除该图片, 是否继续?',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).then(
                    () => {
                        let rows = this.wihchTabsel();
                        console.log(index);
                        rows[index].imgUrl = '';
                        if (rows.length <= 0) {
                            this.addRow();
                        }
                    });
            },
            async commit() {
                const that = this;
                let rows = that.wihchTabsel();

                if (rows[0].imgUrl) {
                    let ajax = 'add';
                    let data = rows[0];
                    console.log(data);

                    let ad = {};
                    ad = new AD(ad);
                    if (that.adId) {
                        ajax = 'edit';
                        ad[ajax](that.adId, data).then(() => {
                            that.$router.push('/ad/list/');
                        });
                    } else {
                        ad[ajax](data).then(() => {
                            that.$router.push('/ad/list/');
                        });
                    }

                } else {
                    this.$message('信息不全');
                }


            },

            queryGoods() {
                const that = this
                that.search.name = this.queryName
                that.getProductList(1)


            }
        }
    }

</script>
<style>

    .phone-body > * {
        position: relative;
    }

    .phone-body > *::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, .6);
        transition: .3s;
    }

    .phone-body > .active::after {
        background-color: rgba(0, 0, 0, 0);
    }

    .phone-banner:hover, .phone-navigator:hover, .phone-hot:hover {
        /*opacity: 0.9;*/
        cursor: pointer;
    }

    .phone-banner {
        overflow: hidden;
    }

    .phone-banner img {

    }

    .el-button.is-disabled.is-plain, .el-button.is-disabled.is-plain:focus, .el-button.is-disabled.is-plain:hover {
        display: none;
    }

    .classify p {
        margin: 0;
        padding: 0;
        border: 0;
    }

    .classify input {

        width: 10em;
    }

    .classify p {
        font-size: 14px;
        margin-bottom: 14px;
    }

    /*.slider {*/
    /*margin-left: -56px;*/
    /*width: 0px;*/
    /*height: 0px;*/
    /*position: absolute;*/
    /*z-index: -1;*/
    /*display: inline-block;*/
    /*border-top: 40px transparent solid;*/
    /*border-bottom: 40px solid transparent;*/
    /*border-left: 40px solid #e7e7e7;*/
    /*}*/

    .text-info {
        display: inline-block;
        padding: 7px 20px;
        border: 1px solid #f6f6f6;
        background-color: #fff;
        cursor: pointer;
    }

    .slider#banner {
        margin-top: 70px;
        /*display: nonez*/
    }

    .slider#navigator {
        margin-top: 190px;
        display: none;
    }

    .slider#hot {
        margin-top: 280px;
        display: none;
    }

    .el-radio-group + .el-radio {
        margin-left: 0px !important;
        margin-right: 15px;
    }

    .operating-wrapper {
        position: sticky;
        position: -webkit-sticky;
        bottom: 0;
        z-index: 2;
        background-color: #f6f6f6;
        padding: 20px;
        margin: 12px 0;
    }

    .ysUpload {
        width: 200px;
        height: 200px;
        border: 1px dashed #c7c7c7;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 20px;
        background-color: #f5f5f5;
    }

    .ysUpload .el-upload--picture-card {
        border-radius: 6px;
        box-sizing: border-box;
        cursor: pointer;
        vertical-align: top;
    }

    .ysUpload .el-upload__input {
        display: none !important;
    }

    .row {
        display: flex;
    }

    .content {
        padding: 20px;
    }

    .text-grey {
        font-size: 14px;
        color: #808080;
        margin-left: 20px;
    }

    .col-md-8 {
        width: 80%;
    }

    .el-icon-search {
        font-family: element-icons !important;
        speak: none;
        font-style: normal;
        font-weight: 400;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        vertical-align: baseline;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
    }
</style>
