<template>
    <section class="plr-sm">
        <header class="y-center ptb-xs sticky">
            <span class="size-md bolder">分类列表</span>
            <el-button @click="bindTea()" class="mlr-sm" size="small" type="success">
                <span>绑定</span>
                <i class="el-icon-plus"></i>
            </el-button>
        </header>
        <my-table :data="classifyList" :config="tableConfig">
            <div slot="operating" slot-scope="classify">
                <el-button @click="prevShowEditModal(classify.item)" size="small" type="success">编辑</el-button>
                <el-button @click="detailItem(classify.item,classify.index)" size="small" type="primary">详情
                </el-button>
                <el-button @click="deleteClassifyItem(classify.item,classify.index)" size="small" type="danger">删除
                </el-button>
            </div>
        </my-table>

        <!--编辑套餐-->
        <el-dialog
                :append-to-body="true"
                :visible.sync="showEditModal">
            <div class="p-sm">
                <el-row class="y-center ptb-sm">
                    <el-col :sm="24" :lg="2" class="size-md bolder">筛选</el-col>
                    <el-input placeholder="输入关键字搜索" v-model="search.year" class="ml-sm w-4 input-with-select"
                              style="margin-left: 10px;">
                        <el-select style="width: 90px;" v-model="year" slot="prepend" placeholder="请选择">
                            <el-option label="年份" value="name"></el-option>
                        </el-select>
                        <el-button @click="getTeaList(1)" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                    <el-input placeholder="输入关键字搜索" v-model="search.name" class="ml-sm w-4 input-with-select"
                              style="margin-left: 10px;">
                        <el-select style="width: 90px;" v-model="name" slot="prepend" placeholder="请选择">
                            <el-option label="名称" value="name"></el-option>
                        </el-select>
                        <el-button @click="getTeaList(1)" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-row>

                <my-table :data="teaList" :config="tableConfig2">
                    <div slot="operating" slot-scope="tea">
                        <el-button @click="choose(tea.item)" size="small" type="success">绑定</el-button>
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
            <div slot="footer" class="text-center">
                <el-button @click="commitItem()" type="primary">保存</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import Product from '@/tool/classFactory/Product.js';
    import Obj from '@/tool/classFactory/Showcase.js';
    import myTable from '@/common/m-table.vue';

    export default {
        name: 'showcase-detail',
        data() {
            return {
                search: {
                    year: '',
                    name: '',
                    page: 1,
                    pageSize: 15
                },
                showEditModal: false,
                classifyItem: {},
                classifyList: [],
                tableConfig: [
                    {
                        label: '图片',
                        property: '',
                        img: 'product.images.0.url'
                    },
                    {
                        label: '名称',
                        property: 'product.name'
                    },
                    {
                        label: '年份',
                        property: 'product.year'
                    },
                    {
                        label: '操作',
                        type: 'operating'
                    }
                ],
                year: '年份',
                name: '名称',
                teaList: [],
                teaSum: 0,
                tableConfig2: [
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
                        label: '标签',
                        property: 'allTags'
                    },
                    {
                        label: '操作',
                        type: 'operating'
                    }
                ],
            }
        },

        components: {
            myTable
        },

        activated() {
            this.objId = this.$route.query.showcaseId || null;
            this.objId && this.getshowCaseProduct();
            this.getTeaList();
        },

        methods: {
            getshowCaseProduct() {
                const that = this;
                console.log(this.objId)
                var data={
                    showcaseId:that.objId
                }
                Obj.prototype.getshowCaseProduct(data).then(res => {
                    let list = res.data.data || [];
                    that.filterList(list);
                    that.classifyList.splice(0, that.classifyList.length, ...list);
                });
            },
            getTeaList(e) {
                const that = this;
                if (e) {
                    that.search.page = e;
                }
                Product.prototype.getList(that.search).then(res => {
                    let list = res.data.data || [];
                    that.filterList(list);
                    that.teaList.splice(0, that.teaList.length, ...list);
                    that.teaSum = res.data.extra.count || list.length;
                    console.log(that.objList)
                });
            },
            bindTea(){
                this.showEditModal = true
            },
            filterList(list) {
                list.sort((x, y) => {
                    return x.seq - y.seq;
                });
            },
            prevShowEditModal(obj) {
                this.classifyItem = {...(obj || {seq: 1})};
                this.$router.push('/classify/edit/?classifyId=' + this.classifyItem.id);
            },
            choose(obj) {
                console.log(obj)
                this.teaId = obj.id
                this.showEditModal = false;
                this.bindShowcase(this.teaId);
            },
            bindShowcase(teaId) {
                const that = this;
                var data = {
                    showcaseId: that.objId,
                    productId: teaId,
                    seq: null
                }
                Obj.prototype.bindShowcase(data).then(res => {
                    let list = res.data.data || [];
                    that.getshowCaseProduct();
                });
            },
            detailItem(obj) {
                console.log(obj);
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
