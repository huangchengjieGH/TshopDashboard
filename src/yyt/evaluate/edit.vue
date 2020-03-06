<template>
    <section class="p-sm">
        <header class="title is-5">估价详情</header>
        <el-row :gutter="20">
            <el-col :span="18" >
                <el-card style="position: relative">
                    <span>{{evaluate.content}}</span>
                    <div v-for="(img,imgIndex) in evaluate.imgs">
                        <img class="photo-img" :src="img.url" @click="PrevshowImg(img.url)" style="width: 60px;height: 60px;margin: 5px;"/>
                    </div>
                    <div>电话:{{evaluate.phone}}</div>
                    <div>
                        <i class="el-icon-time"></i>
                        <span>{{evaluate.createdAt}}</span>
                    </div>
                    <el-badge :value="evaluate.replies.length" :max="100" class="item" style="    position: absolute; right: 55px;bottom: 20px;">
                        <el-button @click="prevShowEditModal()" size="small">回复</el-button>
                    </el-badge>
                </el-card>
            </el-col>


            <el-col style="margin-top: 20px">
                <el-card>
                    <span>管理员回复：</span>
                    <div v-for="reply in evaluate.replies">
                        <span>{{reply.content}}</span>
                        <div>
                            <i class="el-icon-time"></i>
                            <span>{{reply.updatedAt}}</span>
                        </div>
                        <!--<img class="photo-img" :src="img.url" style="width: 60px;height: 60px;margin: 5px;"/>-->
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!--编辑套餐-->
        <el-dialog
                :append-to-body="true"
                :visible.sync="showEditModal">
            <div class="p-sm" v-if="modalStyle == 1">
                <el-row class="y-center ptb-sm">
                    <el-col :sm="24" :lg="2">回复</el-col>
                    <el-col :sm="24" :lg="16">
                        <el-input type="textarea" :rows="4" placeholder="请输入内容，字数上限40个字" v-model="content"></el-input>
                    </el-col>
                </el-row>
            </div>
            <div slot="footer" class="text-center" v-if="modalStyle == 1">
                <el-button @click="commitReply()" type="primary">确定</el-button>
            </div>

            <div class="edit-modal-item" v-if="modalStyle == 2">
                <img :src="imgUrl">
            </div>
        </el-dialog>


    </section>
</template>

<script>
    import Evaluate from '@/tool/classFactory/Evaluate.js';
    import richTextEditor from '@/common/editor.vue';

    export default {
        name: 'evaluate-edit',
        data() {
            return {
                showEditModal: false,
                evaluateId: null,
                classifyList: [],
                content:'',
                imgUrl:'',
                modalStyle: 1,
                evaluate: {
                    classify: {},
                    title: '',
                    imgUrl: '',
                    introduction: '',
                    content: {},
                    type: 1,
                }
            }
        },

        components: {
            richTextEditor
        },

        async activated() {
            this.evaluateId = this.$route.query.evaluateId || null;
            console.log(this.evaluateId);
            this.evaluateId && this.getEvaluate();
        },

        methods: {
            clearDirtyData(evaluateId) {
                if (evaluateId || this.evaluate.id) {
                    this.evaluate = {
                        classify: {},
                        title: '',
                        imgUrl: '',
                        introduction: '',
                        content: {},
                        type: 1,
                    };
                }
            },

            commitEvaluate() {
                const that = this;
                let evaluate = new Evaluate(that.article);
                let thenObj = null;
                if (that.evaluateId) {
                    thenObj = evaluate.edit();
                } else {
                    thenObj = evaluate.add();
                }
                thenObj.then(() => {
                    that.$router.push('/evaluate/list');
                });
            },
            commitReply(){
                const that = this;
                if(that.content){
                    const that = this;
                    let evaluate = {
                        "id":that.evaluate.id,
                        "content":that.content
                    };
                    evaluate = new Evaluate(evaluate);
                    evaluate.reply().then(res => {
                        console.log(res.data.data);
                        that.showEditModal = false;
                        that.getEvaluate();
                    });
                }
            },
            imgUpload(res) {
                this.evaluate.imgUrl = res.data || '';
            },

            getEvaluate() {
                const that = this;
                let evaluate = new Evaluate({id: that.evaluateId});
                evaluate.getOne().then(res => {
                    console.log(res.data.data);
                    that.evaluate = res.data.data;
                });
            },
            prevShowEditModal(obj) {
//                this.classifyItem = {...(obj || {seq: 1})};
                this.showEditModal = true;
                this.modalStyle = 1;

            },
            PrevshowImg(e){
                console.log(e)
                this.imgUrl = e;
                this.showEditModal = true;
                this.modalStyle = 2;
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
