<template>
    <section class="plr-sm">
        <header class="y-center ptb-xs sticky">
            <span class="size-md bolder">橱窗列表</span>
            <router-link to="/showcase/edit">
                <el-button class="mlr-sm" size="small" type="primary">新增橱窗</el-button>
            </router-link>
        </header>
        <my-table :data="classifyList" :config="tableConfig">
            <div slot="operating" slot-scope="classify">
                <el-button @click="prevShowEditModal(classify.item)" size="small" type="success">编辑</el-button>
                <el-button @click="detailItem(classify.item,classify.index)" size="small" type="primary">绑定
                </el-button>
                <el-button @click="deleteClassifyItem(classify.item,classify.index)" size="small" type="danger">删除
                </el-button>
            </div>
        </my-table>
    </section>
</template>

<script>
    import Obj from '@/tool/classFactory/Showcase.js';
    import myTable from '@/common/m-table.vue';

    export default {
        name: 'showcase-list',
        data() {
            return {
                showEditModal: false,
                classifyItem: {},
                classifyList: [],
                tableConfig: [
                    {
                        label: '名称',
                        property: 'name'
                    },
                    {
                        label: '展示方式',
                        property: 'showType_ch'
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
            this.getList();
        },

        methods: {
            getList() {
                const that = this;
                Obj.prototype.getList().then(res => {
                    let list = res.data.data || [];
                    that.filterClassifyList(list);
                    that.classifyList.splice(0, that.classifyList.length, ...list);
                });
            },
            filterClassifyList(list) {
                for (var idx in list) {
                    if (list[idx].showType == 1) {
                        list[idx].showType_ch = '竖排展示';
                    }
                    if (list[idx].showType == 2) {
                        list[idx].showType_ch = '横排展示';
                    }
                }
            },
            prevShowEditModal(obj) {
                this.classifyItem = {...(obj || {seq: 1})};
                this.$router.push('/showcase/edit/?showcaseId=' + this.classifyItem.id);
            },
            detailItem(obj) {
                console.log(obj);
                this.$router.push('/showcase/detail/?showcaseId=' + obj.id);
            },
            deleteClassifyItem(obj, index) {
                const that = this;
                console.log(obj)
                if (obj.id == 1) {
                    this.$message('大益分类不能删除');
                } else {
                    that.$Modal.confirm({
                        title: '提示',
                        content: '是否删除，请确认',
                        onOk: () => {
                            let classify = new Obj(obj);
                            classify.delete().then(() => {
                                that.classifyList.splice(index, 1);
                            });
                        }
                    });
                }
            }
        }
    }
</script>

<style scoped>
    .edit-modal-item {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: var(--sm);
    }

    .edit-modal-item span {
        display: inline-block;
        min-width: 6em;
        text-align: right;
    }
</style>
