<template>
    <section class="plr-sm">
        <header class="y-center ptb-xs sticky">
            <span class="size-md bolder">分类列表</span>
            <router-link to="/classify/edit">
                <el-button class="mlr-sm" size="small" type="primary">新增分类</el-button>
            </router-link>
        </header>
        <my-table :data="classifyList" :config="tableConfig">
            <div slot="operating" slot-scope="classify">
                <el-button @click="prevShowEditModal(classify.item)" size="small" type="success">编辑</el-button>
                <el-button @click="deleteClassifyItem(classify.item,classify.index)" size="small" type="danger">删除
                </el-button>
            </div>
        </my-table>
    </section>
</template>

<script>
    import Classify from '@/tool/classFactory/Classify.js';
    import myTable from '@/common/m-table.vue';

    export default {
        name: 'classify-list',
        data() {
            return {
                showEditModal: false,
                classifyItem: {},
                classifyList: [],
                tableConfig: [
                    {
                        label: '图片',
                        property: '',
                        img: 'imgUrl'
                    },
                    {
                        label: '名称',
                        property: 'name'
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
            this.getClassifyList();
        },

        methods: {
            getClassifyList() {
                const that = this;
                Classify.prototype.getList().then(res => {
                    let list = res.data.data || [];
                    that.filterClassifyList(list);
                    that.classifyList.splice(0, that.classifyList.length, ...list);
                });
            },
            filterClassifyList(list) {
                list.sort((x, y) => {
                    return x.seq - y.seq;
                });
            },
            prevShowEditModal(obj) {
                this.classifyItem = {...(obj || {seq: 1})};
                this.$router.push('/classify/edit/?classifyId=' + this.classifyItem.id);
            },
            deleteClassifyItem(obj, index) {
                const that = this;
                console.log(obj)
                if(obj.id == 1){
                    this.$message('大益分类不能删除');
                } else {
                    that.$Modal.confirm({
                        title: '提示',
                        content: '是否删除，请确认',
                        onOk: () => {
                            let classify = new Classify(obj);
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
