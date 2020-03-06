<template>
    <section class="plr-sm">
        <header class="y-center ptb-xs sticky">
            <span class="size-md bolder">估价列表</span>
            <router-link to="/evaluate/edit">
                <el-button class="mlr-sm" size="small" type="primary">查看</el-button>
            </router-link>
        </header>
        <my-table :data="evaluateList" :config="tableConfig">
            <div slot="operating" slot-scope="evaluate">
                <router-link :to="'/evaluate/edit?evaluateId=' + evaluate.item.id">
                    <el-button size="small" type="success">编辑</el-button>
                </router-link>
                <el-button @click="deleteEvaluateItem(evaluate.item,evaluate.index)" size="small" type="danger">删除</el-button>
            </div>
        </my-table>
        <div v-if="evaluateList.length" class="text-center p-sm">
            <el-pagination
                    @current-change="getEvaluateList"
                    :current-page.sync="search.page"
                    :page-size="search.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="evaluateSum">
            </el-pagination>
        </div>

        <!--编辑套餐-->
        <el-dialog
                :append-to-body="true"
                :visible.sync="showEditModal">

            <div class="edit-modal-item">
                <img :src="imgUrl">
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import Evaluate from '@/tool/classFactory/Evaluate.js';
    import myTable from '@/common/m-table.vue';

    export default {
        name: "evaluate-list",
        data() {
            return {
                search: {
                    page: 1,
                    pageSize: 150
                },
                showEditModal:false,
                evaluateList: [],
                evaluateSum: 0,
                imgUrl:'',
                tableConfig: [
                    {
                        label: '图片',
                        property: '',
                        img: 'imgUrl'
                    },
                    {
                        label: '简介',
                        property: 'content'
                    },
                    {
                        label: '电话',
                        property: 'phone'
                    },
                    {
                        label: '操作',
                        type: 'operating'
                    }
                ]
            }
        },

        components: {
            myTable
        },

        activated() {
            this.getEvaluateList();
        },

        methods: {
            deleteEvaluateItem(obj, index) {
                const that = this;
                that.$Modal.confirm({
                    title: '提示',
                    content: '是否删除，请确认',
                    onOk: () => {
                        let evaluate = new Evaluate(obj);
                        evaluate.delete().then(() => {
                            that.evaluateList.splice(index, 1);
                        });
                    }
                });
            },

            getEvaluateList() {
                const that = this;
                Evaluate.prototype.getList(that.search).then(res => {
                    let list = res.data.data || [];
                    that.evaluateList.splice(0, that.evaluateList.length, ...list);
                    that.evaluateList.forEach(item => {
                        if(item.imgs.length>0){
                            item.imgUrl = item.imgs[0].url
                        }
                    });
                    console.log(that.evaluateList);
                    that.evaluateSum = res.data.extra.count || list.length;
                });
            },
            PrevshowImg(e){
                console.log(e)
                this.imgUrl = e;
                this.showEditModal = true;
            }
        }
    }
</script>

<style scoped>

</style>
