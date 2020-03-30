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

                                    <p class="text-grey">建议640*640像素</p>
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
                                        <el-radio style="margin-left:20px;" class="radio" :label="3">小程序链接</el-radio>
                                        <el-radio style="margin-left:20px;" :label="2">外部链接</el-radio>
                                        <el-radio style="margin-left:20px;" :label="1" >
                                            系统链接
                                        </el-radio>
                                        <!--<el-radio style="margin-left:20px;" :label="1" v-show="row.relateType !== 2">-->
                                        <!--系统链接-->
                                        <!--</el-radio>-->
                                        <el-radio style="margin-left:20px;" :label="0">无链接</el-radio>
                                    </el-radio-group>
                                    <div class="mt12">

                                        <!--<div v-if="row.relateType === 1">-->
                                        <!--<el-button-->
                                        <!--@click="isShowDialog">选择链接-->
                                        <!--</el-button>-->
                                        <!--<span class="text-info" v-if="row.name">{{row.name}}</span>-->
                                        <!--</div>-->

                                        <div v-if="row.relateType === 3|| row.relateType === 2 || row.relateType === 1" style="width: 60%;">
                                            <el-input class="p12" style="margin: 0 0 20px 20px;"
                                                      v-if="row.relateType === 3" @change="whichChange"
                                                      placeholder="请输入小程序AppId" v-model="row.appId"></el-input>
                                            <el-input class="p12" style="margin: 0 0 20px 20px;" @change="whichChange"
                                                      :placeholder="row.relateType === 3 ? '请输入小程序路径' : '请输入链接'"
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
                        <el-tabs v-model="type" style="margin-top: 10px;" @tab-click="onTypeTap">
                            <el-tab-pane
                                    :key="item.name"
                                    v-for="(item, index) in classify"
                                    :label="item.name"
                                    :name="item.name"
                            >
                                {{item.content}}
                            </el-tab-pane>
                        </el-tabs>
                        <table class="editLink-Table" style="margin:20px 0">
                            <tbody style="text-align: center">
                            <tr>
                                <td style="width:102px">图片</td>
                                <td>名字</td>
                                <td></td>
                            </tr>
                            <tr v-for="item in queryResult" v-if="goods.length && queryName">
                                <td style="width:102px">
                                    <div class="editLink-pic"><img :src="item.imageUrl"></div>
                                </td>
                                <td style="padding: 0 10px;">{{item.name}}</td>
                                <td>
                                    <el-button type="primary" @click="goodsChoose(item.id,item.name)">选择</el-button>
                                </td>
                            </tr>
                            <tr v-for="item in goods" v-if="goods.length && (!queryName)">
                                <td style="width:102px">
                                    <div class="editLink-pic"><img :src="item.imageUrl"></div>
                                </td>
                                <td style="padding: 0 10px;">{{item.name}}</td>
                                <td>
                                    <el-button type="primary" @click="goodsChoose(item.id,item.name)">选择</el-button>
                                </td>
                            </tr>
                            <tr v-if="!goods.length">
                                <td style="width:102px">
                                    <div class="editLink-pic"><img src="static/img/demo-banner.jpg" alt="暂无商品"></div>
                                </td>
                                <td>暂无商品</td>
                                <td>
                                    <el-button type="primary" @click="editLinkDialog = false">选择</el-button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </el-tab-pane>


                    <!--<el-tab-pane label="类别选择" name="second">-->
                    <!--<el-collapse accordion class="editLink-Class">-->
                    <!--<el-collapse-item>-->
                    <!--<template slot="title">-->
                    <!--<span>{{'全部分类'}}</span>-->
                    <!--<div class="pull-right">-->
                    <!--<el-button type="primary" @click="classifyChoose('0','全部分类')">选择</el-button>-->
                    <!--</div>-->
                    <!--</template>-->
                    <!--</el-collapse-item>-->
                    <!--<el-collapse-item v-for="parent in classify">-->
                    <!--<template slot="title">-->
                    <!--<span>{{parent.name}}</span>-->
                    <!--<div class="pull-right">-->
                    <!--<el-button type="primary" @click="classifyChoose(parent.id,parent.name)">选择</el-button>-->
                    <!--</div>-->
                    <!--</template>-->
                    <!--<div class="subclass" v-for="children in parent.subGoodsClassifies">{{children.name}}-->
                    <!--<div class="pull-right">-->
                    <!--<el-button type="primary" @click="classifyChoose(children.id,children.name)">选择</el-button>-->
                    <!--</div>-->
                    <!--</div>-->
                    <!--</el-collapse-item>-->
                    <!--</el-collapse>-->
                    <!--</el-tab-pane>-->
                    <!---->

                    <!--<el-tab-pane label="图文选择"-->
                    <!--name="third">-->
                    <!--<div class="search-pl">-->
                    <!--<el-input placeholder="输入商品名搜索" v-model="queryName" class="right-search" @change="queryGoods">-->
                    <!--<el-button slot="append" icon="search" @click="queryGoods"></el-button>-->
                    <!--</el-input>-->
                    <!--</div>-->
                    <!--<table class="editLink-Table">-->
                    <!--<tbody style="text-align: center">-->
                    <!--<tr>-->
                    <!--<td style="width:102px">图片</td>-->
                    <!--<td>名字</td>-->
                    <!--<td></td>-->
                    <!--</tr>-->
                    <!--<tr v-for="item in queryResult" v-if="picture.length && queryName">-->
                    <!--<td style="width:102px">-->
                    <!--<div class="editLink-pic"><img :src="item.imgUrl"></div>-->
                    <!--</td>-->
                    <!--<td>{{item.goodsName}}</td>-->
                    <!--<td>-->
                    <!--<el-button type="primary" @click="goodsChoose(item.goodsId,item.goodsName)">选择</el-button>-->
                    <!--</td>-->
                    <!--</tr>-->
                    <!--<tr v-for="item in picture" v-if="picture.length && (!queryName)">-->
                    <!--<td style="width:102px">-->
                    <!--<div class="editLink-pic"><img :src="item.imgUrl"></div>-->
                    <!--</td>-->
                    <!--<td>{{item.goodsName}}</td>-->
                    <!--<td>-->
                    <!--<el-button type="primary" @click="goodsChoose(item.goodsId,item.goodsName)">选择</el-button>-->
                    <!--</td>-->
                    <!--</tr>-->
                    <!--<tr v-if="!goods.length">-->
                    <!--<td style="width:102px">-->
                    <!--<div class="editLink-pic"><img src="static/img/girl_fight.jpg" alt="暂无商品"></div>-->
                    <!--</td>-->
                    <!--<td>暂无商品</td>-->
                    <!--<td>-->
                    <!--<el-button type="primary" @click="editLinkDialog = false">选择</el-button>-->
                    <!--</td>-->
                    <!--</tr>-->
                    <!--</tbody>-->
                    <!--</table>-->
                    <!--</el-tab-pane>-->
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

    import {rootRoute, fileRoot} from '@/tool/const.js';
    import AD from '@/tool/classFactory/AD.js';
   // import Classify from '@/tool/classFactory/Classify.js';
  //  import Article from '@/tool/classFactory/Article.js';
 //   import Product from '@/tool/classFactory/Product.js';
    export default {
        name: "ad-edit",
        data() {
            return {
                search: {
                    year: '',
                    name: '',
                    classifyId: '',
                    status: '',
                    page: 1,
                    pageSize: 20
                },
                rootRoute,
                fileRoot,
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
                type: '房车',
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
            this.init();
            this.adId = +this.$route.query.adId || null;
           // this.getProductList();
            if (this.adId) {
                this.getAd();
            }
        },
        methods: {
            init() {
                const that = this;
                that.rowsBanner =  [
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


            realLength(tabSel) {
                let that = this;
                let rows = [];
                let length = 0;

                switch (tabSel) {
                    case 'banner':
                        rows = that.rowsBanner;
                        break;
                    case 'navigator':
                        rows = that.rowsNavigator;
                        break;
                    case 'hot':
                        rows = that.rowsHot;
                        break;
                }

                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].status !== -1 && rows[i].imgUrl !== '') {
                        length = length + 1;
                    }
                }

                return length;
            },


            whichActive(Tabsel) {
                if (Tabsel === this.current.tabsel) {
                    return true;
                }

                if (Tabsel === this.current.tabsel) {
                    return true;
                }

                if (Tabsel === this.current.tabsel) {
                    return true;
                }
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
            whichChange02(e) {
                let rows = this.wihchTabsel();
                let index = this.current.index;
                rows[index].status = 2;
                if (e == 0) {
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


            getClassifyList() {
                const that = this;
                Classify.prototype.getList().then(res => {
                    let list = res.data.data || [];
                    that.classify.splice(0, that.classify.length, ...list);
                });
            },


            getProductList() {
                const that = this;
                let search = that.search;
                Product.prototype.getList(search).then(res => {
                    let list = res.data.data || [];
                    that.goods.splice(0, that.goods.length, ...list);
                    console.log(that.goods);
                    that.queryResult.splice(0, that.queryResult.length, ...list);
                });
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

            onTypeTap() {
                const that = this;
                let search = that.search;
                for (var idx in that.classify) {
                    if (that.classify[idx].name == that.type) {
                        search.classifyId = that.classify[idx].id;
                        Product.prototype.getList(search).then(res => {
                            let list = res.data.data || [];
                            that.goods.splice(0, that.goods.length, ...list);
                            that.queryResult.splice(0, that.queryResult.length, ...list);
                        });

                    }
                }
                console.log(that.type);
            },

            async commit() {
                const that = this;
                let rows = that.wihchTabsel();
                console.log(rows)
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
                this.queryResult.splice(0, this.queryResult.length);
                let arr = [];
                console.log(this.activeTabs)
                console.log(this.queryName)
                this.search.name = this.queryName
                this.getProductList()
                // if (this.activeTabs === 'first') {
                //     arr = this.goods;
                // } else {
                //     arr = this.picture;
                // }
                // for (let i = 0; i < arr.length; i++) {
                //     let index = arr[i].name.indexOf(this.queryName);
                //     if (index !== -1) {
                //         this.queryResulst.push(arr[i]);
                //     }
                // }
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
