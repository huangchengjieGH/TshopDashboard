<style scoped>
    .photo-img-row {
        flex-wrap: wrap;
    }

    .photo-img {
        width: 200px;
        height: 100px;
        margin-right: 15px;
        margin-bottom: 15px;
        object-fit: cover;
    }

    .photo-img__delete {
        font-size: 32px;
        position: absolute;
        right: 15px;
        top: 0;
        color: rgba(255, 0, 0, .8);
    }
</style>

<template>
    <section class="plr-sm">
        <header class="y-center ptb-xs">
            <span class="size-md bolder">图标编辑</span>
        </header>
        <el-card>
            <el-row class="y-center mlr-sm p-sm">
                <el-col>
                    <div>标题</div>
                    <el-input v-model="obj.name"></el-input>
                </el-col>
            </el-row>
            <el-row class="y-center mlr-sm p-sm">
                <el-col>
                    <div>排序</div>
                    <!--<el-input v-model="obj.name"></el-input>-->
                    <el-input type="number" v-model="obj.seq" class="w-5"></el-input>
                </el-col>
            </el-row>

            <el-row class="y-center mlr-sm p-sm">
                <el-col>
                    <div>展示方式</div>
                    <el-select v-model="obj.showType" placeholder="请选择" @change="classifyChange">
                        <el-option
                                v-for="type in showTypes"
                                :key="type.id"
                                :label="type.name"
                                :value="type.id">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="mlr-sm p-sm">
                <div>图片</div>
                <el-col class="y-center photo-img-row">
                    <div v-for="(img,imgIndex) in imgList" class="relative-box">
                        <img class="photo-img" :src="img.url"/>
                        <i @click="deleteImg(imgIndex)" class="el-icon-delete photo-img__delete"></i>
                    </div>
                    <div>
                        <el-upload class="uploader sub"
                                   action="/api/upload"
                                   :show-file-list="false"
                                   :on-success="uploadSubImg">
                            <img v-if="obj.imgUrl" :src="obj.imgUrl" class="subImg">
                            <i v-else class="el-icon-plus uploader-icon sub"></i>
                        </el-upload>
                    </div>
                </el-col>
            </el-row>
            <el-row class="text-center mlr-sm p-sm">
                <el-button @click="savePhoto" type="success">保存</el-button>
            </el-row>
        </el-card>
    </section>
</template>

<script>
    import Obj from '@/tool/classFactory/Showcase.js';
    export default {
        name: 'classify-edit',
        data() {
            return {
                objId: null,
                obj: {
                    name: '',
                    seq: '1',
                    imgUrl: '',
                    showType: ''
                },
                showTypes:[
                    {
                        id:'1',
                        name: '竖排'
                    },
                    {
                        id:'2',
                        name: '横排'
                    }
                ],
                imgList: [],
                properties: {},
                imgLength: false
            }
        },
        activated() {
            this.objId = this.$route.query.showcaseId || null;
            this.objId && this.getOne();
        },
        methods: {
            isValid(obj) {
                if (!obj.name) {
                    return false;
                }
                return true;
            },
            savePhoto() {
                const that = this;
                let obj = that.obj;
                if (that.isValid(obj)) {
                    obj = new Obj(obj);
                    if (!that.objId) {
                        obj.add().then(() => {
                            that.$router.push('/showcase/list');
                        });
                    }
                    if (that.objId) {
                        obj.edit().then(() => {
                            that.$router.push('/showcase/list');
                        });
                    }
                }
            },
            deleteImg(index) {
                const that = this;
                that.$Modal.confirm({
                    title: '提示',
                    content: '是否删除，请确认',
                    onOk: () => {
                        that.imgList.splice(index, 1);
                    }
                });
            },
            classifyChange(){

            },
            uploadSuccess(res) {
                this.imgList.push({url: res.data});
            },
            uploadSubImg(res) {
                this.obj.imgUrl = res.data;
                this.$forceUpdate();
            },
            getOne() {
                const that = this;
                let obj = new Obj({id: that.objId});
                obj.getOne().then(res => {
                    let obj = res.data.data;
                    that.obj = obj;
                    that.imgList = obj.images;
                });
            }
        }
    }
</script>
<style scoped>


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
        width: 150px;
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
        width: 150px;
        line-height: 150px;
    }

    .subImg {
        width: 150px;
        height: 150px;
        vertical-align: middle;
    }
</style>