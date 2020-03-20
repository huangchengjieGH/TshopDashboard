<template>
    <section class="p-sm">
        <header class="title is-5">文章编辑</header>
        <el-row :gutter="20">
            <el-col :span="18">
                <el-card>
                    <el-row class="y-center ptb-sm">
                        <el-col :sm="24" :lg="2">标题</el-col>
                        <el-col :sm="24" :lg="16">
                            <el-input v-model="article.title"></el-input>
                        </el-col>
                    </el-row>
                    <el-row class="y-center ptb-sm">
                        <el-col :sm="24" :lg="2">简介</el-col>
                        <el-col :sm="24" :lg="16">
                            <el-input type="textarea" :rows="4" placeholder="请输入内容，字数上限40个字" v-model="article.introduction"></el-input>
                        </el-col>
                    </el-row>
                    <el-row class="y-center ptb-sm">
                        <el-col :sm="24" :lg="2">封面</el-col>
                        <el-col :sm="24" :lg="16">
                            <el-upload
                                    class="avatar-uploader"
                                    action="/api/upload"
                                    :show-file-list="false"
                                    :on-success="imgUpload">
                                <img v-if="article.imgUrl" :src="article.imgUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-col>
                    </el-row>


                    <el-row class="y-center ptb-sm">
                        <el-col :sm="24" :lg="2">类型</el-col>
                        <el-radio v-model="article.type" label="1">编辑文章</el-radio>
                        <el-radio v-model="article.type" label="2">公众号文章</el-radio>
                    </el-row>
                    <el-row class="y-center ptb-sm" v-if="article.type==2">
                        <el-col :sm="24" :lg="2">跳转链接 </el-col>
                        <el-col :sm="24" :lg="16">
                            <el-input v-model="article.articleUrl"></el-input>
                        </el-col>
                    </el-row>
                    <el-row class="y-center ptb-sm" v-if="article.type==1">
                        <el-col>
                            <rich-text-editor scrollEl="#single-page-con" v-model="article.content.content"></rich-text-editor>
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
                            <el-select v-model="article.classify.id" placeholder="请选择">
                                <el-option
                                        v-for="classify in classifyList"
                                        :key="classify.id"
                                        :label="classify.name"
                                        :value="classify.id">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col class="ptb-xs">
                            <Icon type="calendar"></Icon>
                            <span>发布日期</span>
                        </el-col>
                        <el-col class="y-center">
                            <el-date-picker
                                    v-model="article.createdAt"
                                    type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </el-col>
                    </el-row>
                    <div class="text-center ptb-md">
                        <el-button style="width:150px;" @click="commitArticle" type="success">保存</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import Article from '@/tool/classFactory/Article.js';
    import Classify from '@/tool/classFactory/ArticleClassify.js';
    import richTextEditor from '@/common/editor.vue';

    export default {
        name: 'article-edit',
        data() {
            return {
                articleId: null,
                classifyList: [],
                article: {
                    classify: {},
                    title: '',
                    imgUrl: '',
                    introduction: '',
                    content: {},
                    type: '1',
                    articleUrl:''
                }
            }
        },

        components: {
            richTextEditor
        },

        async activated() {
            this.articleId = this.$route.query.articleId || null;
            this.clearDirtyData(this.articleId);
            this.articleId && this.getArticle();
            this.getClassifyList();
        },

        methods: {
            clearDirtyData(articleId) {
                if (articleId || this.article.id) {
                    this.article = {
                        classify: {},
                        title: '',
                        imgUrl: '',
                        introduction: '',
                        content: {},
                        type: 1,
                        articleUrl:''
                    };
                }
            },

            commitArticle() {
                const that = this;
                let article = new Article(that.article);
                let thenObj = null;
                if (that.articleId) {
                    thenObj = article.edit();
                } else {
                    thenObj = article.add();
                }
                thenObj.then(() => {
                    that.$router.push('/article/list');
                });
            },

            imgUpload(res) {
                this.article.imgUrl = res.data || '';
            },

            getArticle() {
                const that = this;
                let article = new Article({id: that.articleId});
                article.getOne().then(res => {
                    that.article = res.data.data;
                });
            },

            getClassifyList() {
                let that = this;
                let classifyList = that.classifyList;
                Classify.prototype.getList().then(res => {
                    let list = res.data.data || [];
                    classifyList.splice(0, classifyList.length, ...list);
                });
            }
        }
    }
</script>

<style scoped>
    .y-center {
        flex-wrap: wrap;
    }

    .el-cascader {
        width: 100%;
    }

    .avatar-uploader:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        width: 100%;
        height: 100%;
        font-size: 28px;
        color: #8c939d;
        position: absolute;
        transform: translateY(-50%);
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .avatar-uploader {
        width: 200px;
        height: 100px;
        display: flex;
        align-items: center;
        overflow: hidden;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
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
