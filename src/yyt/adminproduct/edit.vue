<template>
    <section class="p-sm">
        <header class="title is-5">商品编辑</header>
        <el-row :gutter="20">
            <el-col :span="18">
                <el-card>
                    <el-row class="y-center ptb-sm">
                        <el-col :sm="24" :lg="2">名字</el-col>
                        <div style="display: flex;align-items: center;width: 90%;">
                            <el-col :sm="24" :lg="16">
                                <el-input v-model="obj.name" placeholder="请输入内容" :disabled="disableInput"></el-input>
                            </el-col>
                            <el-col :sm="24" :lg="16" v-if="obj.classify.id == 1">
                                <el-button class="mlr-sm" size="small" type="primary"  @click="onChooseTap">选择</el-button>
                            </el-col>
                        </div>
                    </el-row>
                    <el-row class="y-center ptb-sm">
                        <el-col :sm="24" :lg="2">价格</el-col>
                        <el-col :sm="24" :lg="16">
                            <el-input v-model="price" placeholder="请输入价格"></el-input>
                        </el-col>
                    </el-row>
                    <el-row class="y-center ptb-sm">
                        <el-col :sm="24" :lg="2">库存</el-col>
                        <el-col :sm="24" :lg="16">
                            <el-input v-model="obj.stock" placeholder="请输入库存"></el-input>
                        </el-col>
                    </el-row>
                    <el-row class="y-center ptb-sm">
                        <el-col :sm="24" :lg="2">年份</el-col>
                        <el-col :sm="24" :lg="16">
                            <el-input v-model="obj.year" placeholder="请输入年份，如：2019"></el-input>
                        </el-col>
                    </el-row>
                    <el-row class="y-center ptb-sm">
                        <el-col :sm="24" :lg="2">批次</el-col>
                        <el-col :sm="24" :lg="16">
                            <el-input v-model="obj.batch" placeholder="请输入批次，如：1901"></el-input>
                        </el-col>
                    </el-row>
                    <el-row class="y-center ptb-sm">
                        <el-col :sm="24" :lg="2">工艺</el-col>
                        <el-col :sm="24" :lg="16">
                            <el-input v-model="obj.productionTechnology" placeholder="请输入工艺，如：生茶"></el-input>
                        </el-col>
                    </el-row>
                    <el-row class="y-center ptb-sm">
                        <el-col :sm="24" :lg="2">规格</el-col>
                        <el-col :sm="24" :lg="16">
                            <el-input v-model="obj.specification" placeholder="请输入规格，如：357克"></el-input>
                        </el-col>
                    </el-row>
                    <el-row class="y-center ptb-sm">
                        <el-col :sm="24" :lg="2">品牌</el-col>
                        <el-col :sm="24" :lg="16">
                            <el-input v-model="obj.brand" placeholder="请输入品牌，如：大益"></el-input>
                        </el-col>
                    </el-row>
                    <el-card class="mtb-sm">
                        <div class="text-old ptb-xs">产品图片</div>
                        <div @click="setImgIndex(index)" class="inline mr-sm"
                             v-for="(item,index) in imgList">
                            <el-upload class="uploader"
                                       action="/api/upload"
                                       :show-file-list="false"
                                       :on-success="uploadImg">
                                <img v-if="item.url" :src="item.url" class="banner">
                                <i v-else class="el-icon-plus uploader-icon"></i>
                            </el-upload>
                            <div class="text-center">
                                <el-button @click="deleteImg(index)" type="text">
                                    <span class="text-danger">删除</span>
                                </el-button>
                            </div>
                        </div>
                        <div class="ptb-xs required">产品图片比例为1:1，主图将作为产品的封面图使用。</div>
                    </el-card>
                    <el-row class="y-center ptb-sm">
                        <el-col>
                            <rich-text-editor scrollEl="#single-page-con"
                                              v-model="obj.content.content"></rich-text-editor>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col id="editSide" :span="6">
                <el-card>
                    <el-row class="y-center ptb-sm">
                        <el-col class="ptb-xs">
                            <Icon type="android-folder"></Icon>
                            <span>选择分类</span>
                        </el-col>
                        <el-col>
                            <el-select v-model="obj.classify.id" placeholder="请选择" @change="classifyChange">
                                <el-option
                                        v-for="classify in classifyList"
                                        :key="classify.id"
                                        :label="classify.name"
                                        :value="classify.id">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row class="y-center ptb-sm">
                        <el-col class="ptb-xs">
                            <Icon type="android-folder"></Icon>
                            <span>排序</span>
                        </el-col>
                        <el-col>
                            <!--<div class="edit-modal-item">-->
                                <el-input type="number" v-model="obj.seq" class="w-5"></el-input>
                            <!--</div>-->
                        </el-col>
                    </el-row>
                    <el-row class="y-center ptb-sm">
                        <el-col class="ptb-xs">
                            <Icon type="android-folder"></Icon>
                            <span>是否显示首页</span>
                        </el-col>
                        <el-col :sm="24" :lg="16">
                            <el-switch
                                    v-model="obj.homePageShow"
                                    active-color="#13ce66"
                                    inactive-color="#878787">
                            </el-switch>
                        </el-col>
                    </el-row>
                    <el-row class="y-center ptb-sm">
                        <el-col class="ptb-xs">
                            <Icon type="android-folder"></Icon>
                            <span>是否自动重置库存</span>
                        </el-col>
                        <el-col :sm="24" :lg="16">
                            <el-switch
                                    v-model="obj.autoResetStock"
                                    active-color="#13ce66"
                                    inactive-color="#878787">
                            </el-switch>
                        </el-col>
                    </el-row>
                    <div class="text-center ptb-md">
                        <el-button style="width:150px;" @click="commit" type="success">保存</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!--编辑套餐-->
        <el-dialog
                :append-to-body="true"
                :visible.sync="showEditModal">
            <div class="p-sm">
                <el-row class="y-center ptb-sm">
                    <el-col :sm="24" :lg="2" class="size-md bolder">筛选</el-col>
                    <!--<el-input placeholder="输入关键字搜索" v-model="keyword" class="ml-sm w-4 input-with-select" style="margin-left: 10px;">-->
                        <!--<el-select style="width: 90px;" v-model="type" slot="prepend" placeholder="请选择">-->
                            <!--<el-option label="名字" value="name"></el-option>-->
                            <!--<el-option label="年份" value="year"></el-option>-->
                        <!--</el-select>-->
                        <!--<el-button @click="getTeaList(1)" slot="append" icon="el-icon-search"></el-button>-->
                    <!--</el-input>-->
                    <el-input placeholder="输入关键字搜索" v-model="search.year" class="ml-sm w-4 input-with-select" style="margin-left: 10px;">
                        <el-select style="width: 90px;" v-model="year" slot="prepend" placeholder="请选择">
                            <el-option label="年份" value="name"></el-option>
                        </el-select>
                        <el-button @click="getTeaList(1)" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                    <el-input placeholder="输入关键字搜索" v-model="search.name" class="ml-sm w-4 input-with-select" style="margin-left: 10px;">
                        <el-select style="width: 90px;" v-model="name" slot="prepend" placeholder="请选择">
                            <el-option label="名称" value="name"></el-option>
                        </el-select>
                        <el-button @click="getTeaList(1)" slot="append" icon="el-icon-search"></el-button>
                    </el-input>

                </el-row>
                <my-table :data="teaList" :config="tableConfig">
                    <div slot="operating" slot-scope="tea">
                        <el-button @click="chooseBound(tea.item)" size="small" type="success">选择</el-button>
                    </div>
                </my-table>
            </div>
            <div v-if="teaList.length" class="text-center p-sm">
                <el-pagination
                        @current-change="getTeaList"
                        :current-page.sync="search.page"
                        :page-size="search.pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="teaSum">
                </el-pagination>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import Obj from '@/tool/classFactory/Product.js';
    import Tea from '@/tool/classFactory/Tea.js';
    import Classify from '@/tool/classFactory/Classify.js';
    import richTextEditor from '@/common/editor.vue';
    import myTable from '@/common/m-table.vue';

    export default {
        name: 'adminproduct-edit',
        data() {
            return {
                search: {
                    year: '',
                    name: '',
                    page: 1,
                    pageSize: 10
                },
                year: '年份',
                name: '名称',
                objId: null,
                classifyList: [],
                imgList: [
                    {
                        url: ''
                    }
                ],
                disableInput: false,
                ImgIndex: 0,
                obj: {
                    classify: {
                        id: ''
                    },
                    teaId:'',
                    name: '',
                    type: 1,
                    price: 0.00,
                    stock: '',
                    autoResetStock: false,
                    seq: '1',
                    homePageShow: false,
                    images: [],
                    year: '',
                    batch: '',
                    productionTechnology: '',
                    specification: '',
                    brand: '',
                    content: {}
                },
                price: 0.00,
                showEditModal: false,
                keyword: '',
                type: '',
                teaItem: {},
                teaList: [],
                teaId:'',
                tableConfig: [
                    {
                        label: '名称',
                        property: 'name'
                    },
                    {
                        label: '年份',
                        property: 'year'
                    },
                    {
                        label: '规格',
                        property: 'specification'
                    },
                    {
                        label: '操作',
                        type: 'operating'
                    }
                ]
            }
        },

        components: {
            richTextEditor,
            myTable
        },

        async activated() {
            this.objId = this.$route.query.productId || null;
            this.clearDirtyData(this.objId);
            this.objId && this.getOne();
            this.getClassifyList();
            this.getTeaList();
        },

        methods: {
            clearDirtyData(objId) {
                    this.obj = {
                        classify: {},
                        title: '',
                        imgUrl: '',
                        introduction: '',
                        content: {},
                        type: 1,
                    };
                    this.imgList = [
                        {
                            url: ''
                        }
                    ]
            },
            deleteImg(index) {
                const that = this;
                that.$Modal.confirm({
                    title: '提示',
                    content: '是否删除，请确认',
                    onOk: () => {
                        that.imgList.splice(index, 1);
                        console.log(that.imgList)
                    }
                });
            },
            commit() {
                const that = this;
                console.log(that.imgList)
                that.obj.images = []
                for (var idx in that.imgList) {
                    if (that.imgList[idx].url) {
                        that.obj.images.push(that.imgList[idx])
                    }
                }
                if (that.price) {
                    that.obj.price = that.price * 100
                }

                if(!that.obj.name){
                    that.$message('缺少名字');
                    return
                }
                let thenObj = null;
                console.log(that.obj)
                if (that.objId) {
                    Obj.prototype.edit(that.obj,that.objId).then(res => {
                        let list = res.data.data || [];
                        that.$router.push('/adminproduct/list');
                    });
                } else {
                    Obj.prototype.add(that.obj).then(res => {
                        let list = res.data.data || [];
                        that.$router.push('/adminproduct/list');
                    });
                }
            },
            uploadImg(res) {
                let index = this.ImgIndex;
                let list = this.imgList;
                list[index].url = res.data;
                if (list.length - 1 === index) {
                    list.push({});
                }
                this.$forceUpdate();
            },
            setImgIndex(index, subIndex) {
                this.ImgIndex = index;

            },
            uploadSuccess(res) {
                this.imgList.push({url: res.data});
            },
            deleteImg(index) {
                const that = this;
                that.$Modal.confirm({
                    title: '提示',
                    content: '是否删除，请确认',
                    onOk: () => {
                        let list = that.imgList;
                        list.splice(index, 1);
                        if (!list.length) {
                            list.push({});
                        }
                    }
                });
            },
            getOne() {
                const that = this;
                let obj = new Obj({id: that.objId});
                obj.getOne().then(res => {
                    that.obj = res.data.data;
                    if(!that.obj.content){
                        that.obj.content = {
                            content: ""
                        }
                    }
                    that.price = that.obj.price/100
                    that.imgList = that.obj.images
                    that.imgList = that.obj.images
                    that.imgList.push({})

                });
            },
            classifyChange(){
                console.log(this.obj)
                if(this.obj.classify.id == 1){
                    // this.disableInput = true
                    this.disableInput = false
                }else {
                    this.disableInput = false
                }
            },
            onChooseTap(){
                console.log('hcj')
                this.showEditModal = true
            },
            chooseBound (item) {
                const that = this;
                // that.tea = obj;
                console.log(item)
                that.$confirm('确定选择这款茶吗, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // that.boundTwoTea(that.tea.goodsId);
                    that.obj.name = item.name;
                    that.teaId = item.id;
                    that.obj.teaId = item.id;
                    that.showEditModal = false
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            getClassifyList() {
                let that = this;
                let classifyList = that.classifyList;
                Classify.prototype.getList().then(res => {
                    let list = res.data.data || [];
                    classifyList.splice(0, classifyList.length, ...list);
                    // that.obj.classify.id = classifyList[0].id
                    // that.obj.classify.name = classifyList[0].name
                });
            },
            getTeaList (e) {
                const that = this;
                if (e) {
                    that.search.page = e;
                }
                Tea.prototype.getList(that.search).then(res => {
                    let list = res.data.data || [];
                    that.teaList.splice(0, that.teaList.length, ...list);
                    console.log(that.teaList)
                    that.teaSum = res.data.extra.count || list.length;
                });
            }
        }
    }
</script>

<style scoped>
    .y-center {
        flex-wrap: wrap;
    }

    .uploader {
        width: 150px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        display: inline-block;
    }

    .uploader.sub {
        width: 65px;
    }

    .uploader:hover {
        border-color: #409EFF;
    }

    .uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 150px;
        line-height: 150px;
        text-align: center;
    }

    .uploader-icon.sub {
        width: 65px;
        line-height: 65px;
    }

    .banner {
        width: 150px;
        height: 150px;
        vertical-align: middle;
    }

    .subImg {
        width: 65px;
        height: 65px;
        vertical-align: middle;
    }

    .avatar-uploader img {
        max-width: 100%;
    }

    #editSide {
        position: -webkit-sticky;
        position: sticky;
        z-index: 2;
        top: 0;
    }
</style>
