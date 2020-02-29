<template>
    <section class="plr-sm">
        <header class="y-center ptb-xs sticky">
            <span class="size-md bolder">分类列表</span>
            <router-link to="/adminproduct/edit">
                <el-button class="mlr-sm" size="small" type="primary">新增商品</el-button>
            </router-link>
            <el-input placeholder="输入关键字搜索" v-model="search.year" class="ml-sm w-4 input-with-select"
                      style="margin-left: 10px;">
                <el-select style="width: 90px;" v-model="year" slot="prepend" placeholder="请选择">
                    <el-option label="年份" value="name"></el-option>
                </el-select>
                <el-button @click="getList(1)" slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-input placeholder="输入关键字搜索" v-model="search.name" class="ml-sm w-4 input-with-select"
                      style="margin-left: 10px;">
                <el-select style="width: 90px;" v-model="name" slot="prepend" placeholder="请选择">
                    <el-option label="名称" value="name"></el-option>
                </el-select>
                <el-button @click="getList(1)" slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <div style="    display: flex;float: right;align-items: center;position: absolute;right: 0;">
                <span style="padding-right: 10px;">分类</span>
                <el-select v-model="search.classifyId" placeholder="请选择" @change="classifyChange">
                    <el-option
                            v-for="classify in classifyList"
                            :key="classify.id"
                            :label="classify.name"
                            :value="classify.id">
                    </el-option>
                </el-select>
            </div>
        </header>
        <div style="margin: 10px 0;">
            <el-radio v-model="search.status" label="" @change="changeStatus">全部</el-radio>
            <el-radio v-model="search.status" label="1" @change="changeStatus">上架中</el-radio>
            <el-radio v-model="search.status" label="2" @change="changeStatus">下架中</el-radio>
        </div>
        <my-table :data="objList" :config="tableConfig" @on-name="onNameTap" @on-icon="onIconTap">
            <div slot="operating" slot-scope="obj">
                <el-button @click="prevShowEditModal(obj.item,obj.item.status)" icon="el-icon-edit" circle size="small"
                           type="success"></el-button>
                <!--<el-button @click="setProductStatus(obj.item,obj.item.status)" size="small" circle type="primary">-->
                    <!--{{obj.item.status == 1?'下架':'上架'}}-->
                <!--</el-button>-->
                <el-button @click="setProductStatus(obj.item,obj.item.status)" size="small" circle type="primary" v-if="obj.item.status==1">
                    下架
                </el-button>
                <el-button @click="setProductStatus(obj.item,obj.item.status)" size="small" circle type="info" v-if="obj.item.status==2">
                    上架
                </el-button>
                <el-button @click="deleteItem(obj.item,obj.index)" size="small" icon="el-icon-delete" circle
                           type="danger"></el-button>
            </div>
        </my-table>
        <div v-if="objList.length" class="text-center p-sm">
            <el-pagination
                    @current-change="getList"
                    :current-page.sync="search.page"
                    :page-size="search.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="objSum">
            </el-pagination>
        </div>
        <!--编辑套餐-->
        <el-dialog
                :append-to-body="true"
                :visible.sync="showEditModal">
            <div>
                <el-row class="y-center ptb-sm" style="text-align: center">
                    <span :sm="24" :lg="2">修改价格</span>
                </el-row>
                <el-row class="y-center ptb-sm">
                    <el-col :sm="24" :lg="2">价格</el-col>
                    <el-col :sm="24" :lg="16" style="margin-left: 10px">
                        <el-input v-model="objItem.price"></el-input>
                    </el-col>
                </el-row>
            </div>
            <div slot="footer" class="text-center">
                <el-button @click="commitItem()" type="success">确认修改</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import Obj from '@/tool/classFactory/Product.js';
    import myTable from '@/common/m-table.vue';
    import Classify from '@/tool/classFactory/Classify.js';
    export default {
        name: 'adminproduct-list',
        data() {
            return {
                search: {
                    year: '',
                    name: '',
                    classifyId: '',
                    status: '',
                    page: 1,
                    pageSize: 15
                },
                showEditModal: false,
                year: '年份',
                name: '名称',
                objItem: {},
                radio: 1,
                objList: [],
                classifyList: [],
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
                        label: '分类',
                        property: 'classify.name'
                    },
                    {
                        label: '价格',
                        property: 'price',
                        iconUrl: 'https://58yyt.com/file/1558188752489_b33e11eaafab86f30082d9fb78a6fec8.png'
                    },
                    {
                        label: '年份',
                        property: 'year'
                    },
                    {
                        label: '销量',
                        property: 'sellCount'
                    },
                    {
                        label: '库存',
                        property: 'stock'
                    },
                    {
                        label: '自动更新库存',
                        property: 'autoResetStock'
                    },
                    {
                        label: '状态',
                        property: 'flag'
                        // iconUrl: 'https://58yyt.com/file/1558188752489_b33e11eaafab86f30082d9fb78a6fec8.png'
                    },
                    {
                        label: '时间',
                        property: 'updatedAt'
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
            this.getClassifyList();
        },

        methods: {
            getList(e) {
                const that = this;
                if (e) {
                    that.search.page = e;
                }
                Obj.prototype.getList(that.search).then(res => {
                    let list = res.data.data || [];
                    that.filterList(list);
                    that.objList.splice(0, that.objList.length, ...list);
                    that.objSum = res.data.extra.count || list.length;
                    console.log(that.objList)
                });
            },
            getClassifyList() {
                let that = this;
                let classifyList = that.classifyList;
                Classify.prototype.getList().then(res => {
                    let list = res.data.data || [];
                    classifyList.splice(0, classifyList.length, ...list);
                });
            },
            classifyChange () {
                console.log(this.search)
                this.getList(1);
            },
            shopUp(id) {
                const that = this
                Obj.prototype.shopUp(id).then(res => {
                    // let list = res.data.data || [];
                    that.getList()
                });
            },
            shopDown(id) {
                const that = this
                Obj.prototype.shopDown(id).then(res => {
                    // let list = res.data.data || [];
                    that.getList()
                });
            },
            setPercent(data) {
                const that = this
                Obj.prototype.setPercent(data).then(res => {
                    // let list = res.data.data || [];
                    that.showEditModal = false;
                    that.getList();
                });
            },
            onNameTap(obj) {
                console.log(obj);
            },
            onIconTap(obj) {
                console.log(obj)
                this.objItem = obj
                this.showEditModal = true;
            },
            filterList(list) {
                list.forEach(item => {
                    item.price = item.price / 100
                    if (item.status == 1) {
                        item.flag = '上架中';
                    }
                    if (item.status == 2) {
                        item.flag = '已下架';
                    }
                });
            },
            prevShowEditModal(obj, status) {
                this.objItem = {...(obj || {seq: 1})};
                this.$router.push('/adminproduct/edit?productId=' + obj.id);
            },
            deleteItem(objj, index) {
                const that = this;
                that.$Modal.confirm({
                    title: '提示',
                    content: '是否删除，请确认',
                    onOk: () => {
                        let obj = new Obj(objj);
                        obj.delete().then(() => {
                            that.objList.splice(index, 1);
                        });
                    }
                });
            },
            setProductStatus(item, status) {
                const that = this
                that.$Modal.confirm({
                    title: '提示',
                    content: '是否执行该操作，请确认',
                    onOk: () => {
                        if (status == 1) {
                            that.productDown(item.id);
                        }
                        if (status == 2) {
                            that.productUp(item.id);
                        }
                    }
                });
            },
            productUp(productId) {
                const that = this;
                var data = {
                    productId: productId,
                    shopId: null
                }
                Obj.prototype.yytProductUp(data).then(res => {
                    let list = res.data.data || [];
                    that.getList();
                    that.showEditModal = false;
                });
            },
            productDown(productId) {
                const that = this;
                var data = {
                    productId: productId,
                    shopId: null
                }
                Obj.prototype.yytProductDown(data).then(res => {
                    let list = res.data.data || [];
                    that.getList();
                    that.showEditModal = false;
                });
            },
            changeStatus (e) {
                console.log(e);
                this.getList(1)
            },
            commitItem() {
                const that = this;
                console.log(that.objItem)
                var data = {
                    productId: that.objItem.id,
                    price: that.objItem.price * 100
                };
                // that.setPrice(data);
                Obj.prototype.setPrice(data).then(res => {
                    let list = res.data.data || [];
                    that.getList();
                    that.showEditModal = false;
                });
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
    .w-4{
        width: 30%;
    }
</style>
