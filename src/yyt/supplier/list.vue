<template>
    <section class="plr-sm">
        <header class="y-center ptb-md sticky">
            <span class="size-md bolder">渠道商管理</span>
            <router-link to="/supplier/edit">
                <el-button class="mlr-sm" size="small" type="primary">新增</el-button>
            </router-link>
        </header>
        <my-table :data="objList" :config="tableConfig">
            <div slot="operating" slot-scope="classify">
                <el-button @click="relateClassify(classify.item)" size="small" type="success">关联</el-button>
                <el-button @click="prevShowEditModal(classify.item)" size="small" type="primary" icon="el-icon-edit"
                           circle></el-button>
                <el-button @click="deleteItem(classify.item,classify.index)" size="small" type="danger"
                           icon="el-icon-delete" circle></el-button>

                <!--<el-button @click="deleteItem(classify.item,classify.index)" size="small" type="danger">删除</el-button>-->
            </div>
        </my-table>
        <!--编辑套餐-->
        <el-dialog
                :append-to-body="true"
                :visible.sync="showEditModal">
            <div>
                <div style="margin: 10px 0">
                    <span class="size-md bolder">关联分类</span>
                </div>
                <!--<el-radio-group v-model="classifyId" style="display: flex;">-->
                <!--<div v-for="item in  classifyList">-->
                <!--<el-radio :label="item.id" border style="margin: 0 5px;">{{item.name}}</el-radio>-->
                <!--</div>-->
                <!--</el-radio-group>-->

                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                </el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="chooseClassify" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="classify in classifyList" :label="classify.id" :key="classify.id">
                        {{classify.name}}
                    </el-checkbox>
                </el-checkbox-group>

            </div>
            <div slot="footer" class="text-center">
                <el-button @click="commitAdminItem()" type="success">保存</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import Obj from '@/tool/classFactory/Supplier.js';
    import myTable from '@/common/m-table.vue';
    import Classify from '@/tool/classFactory/Classify.js';

    const cityOptions = ['上海', '北京', '广州', '深圳'];
    export default {
        name: 'supplier-list',
        data() {
            return {
                showEditModal: false,
                search: {
                    'price': '',
                    'tag': '运费'
                },
                delivery: {
                    'basePrice': 0.00,
                    'baseCount': '',
                    'extraPrice': '',
                    'extraCount': ''
                },
                objList: [],
                objSum: [],
                adminItem: {},
                adminList: [],
                tableConfig: [
                    {
                        label: '名称',
                        property: 'name'
                    },
                    {
                        label: '用户名',
                        property: 'user.username'
                    },
                    {
                        label: '备注',
                        property: 'remarks'
                    },
                    {
                        label: '操作',
                        type: 'operating'
                    }
                ],
                checkAll: false,
                checkedCities: ['上海', '北京'],
                classifyList: [],
                chooseClassify: [],
                cities: cityOptions,
                isIndeterminate: true,
                classifyId: '',
                supplierId: ''
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
            getClassifyList() {
                const that = this;
                Classify.prototype.getList().then(res => {
                    let list = res.data.data || [];
                    // that.filterClassifyList(list);
                    that.classifyList.splice(0, that.classifyList.length, ...list);
                });
            },
            deleteItem(object, index) {
                const that = this;
                that.$Modal.confirm({
                    title: '提示',
                    content: '是否删除，请确认',
                    onOk: () => {
                        let obj = new Obj(object);
                        obj.delete().then(() => {
                            that.objList.splice(index, 1);
                        });
                    }
                });
            },

            commitAdminItem() {
                const that = this;
                var classifyId = ''
                for (var idx in that.chooseClassify) {
                    classifyId = classifyId + ',' + that.chooseClassify[idx]
                }
                classifyId = classifyId.substr(1);
                console.log(classifyId)
                var data = {
                    supplierId: that.supplierId,
                    classifyIds: classifyId
                }
                Obj.prototype.relateClassify(data).then(res => {
                    let list = res.data.data || {};
                    console.log(list)
                    that.showEditModal = false;
                });
            },
            prevShowEditModal(obj) {
                this.item = {...(obj || {seq: 1})};
                this.$router.push('/supplier/edit/?supplierId=' + this.item.id);
            },
            getRalateClassify(supplierId) {
                const that = this;
                var data = {
                    supplierId: supplierId
                }
                Obj.prototype.getRalateClassify(data).then(res => {
                    console.log(res.data.data)
                    var data = res.data.data
                    for (var idx in data) {
                        that.chooseClassify.push(data[idx].classifyId)
                    }
                    that.showEditModal = true;
                });
            },
            relateClassify(e) {
                // console.log(e)
                const that = this
                this.supplierId = e.id;
                this.getRalateClassify(that.supplierId);
                // this.showEditModal = true;
            },
            handleCheckAllChange(val) {
                this.checkedCities = val ? cityOptions : [];
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.classifyList.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.classifyList.length;
            },
            getList() {
                const that = this;
                Obj.prototype.getList().then(res => {
                    let list = res.data.data || {};
                    that.objList = list;
                    that.objSum = res.data.extra.count || list.length;
                });
            }
        }
    }
</script>

<style scoped>
    .edit-modal-item {
        display: flex;
        align-items: center;
        padding: var(--sm);
        justify-content: center;
    }

    .edit-modal-item span {
        display: inline-block;
        min-width: 6em;
        text-align: right;
    }
</style>
