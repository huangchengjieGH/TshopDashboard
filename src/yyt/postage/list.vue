<template>
    <section class="plr-sm">
        <header class="y-center ptb-md sticky">
            <span class="size-md bolder">运费管理</span>
            <router-link to="/postage/edit">
                <el-button class="mlr-sm" size="small" type="primary">新增运费</el-button>
            </router-link>
        </header>
        <my-table :data="deliveryList" :config="tableConfig">
            <div slot="operating" slot-scope="classify">
                <el-button @click="prevShowEditModal(classify.item)" size="small" type="success">编辑</el-button>
                <el-button @click="deleteItem(classify.item,classify.index)" size="small" type="danger">删除
                </el-button>
            </div>
        </my-table>
        <!--编辑套餐-->
        <el-dialog
                :append-to-body="true"
                :visible.sync="showEditModal">
            <div>
                <div class="edit-modal-item">
                    <span class="plr-sm">基础运费</span>
                    <el-input v-model="delivery.basePrice" class="w-5"></el-input>
                </div>
                <div class="edit-modal-item">
                    <span class="plr-sm">基础数量</span>
                    <el-input v-model="delivery.baseCount" class="w-5"></el-input>
                </div>
                <div class="edit-modal-item">
                    <span class="plr-sm">额外价格</span>
                    <el-input v-model="delivery.extraPrice" class="w-5"></el-input>
                </div>
                <div class="edit-modal-item">
                    <span class="plr-sm">额外数量</span>
                    <el-input v-model="delivery.extraCount" class="w-5"></el-input>
                </div>
            </div>
            <div slot="footer" class="text-center">
                <el-button @click="commitAdminItem()" type="success">保存</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import Obj from '@/tool/classFactory/Postage.js';
    import myTable from '@/common/m-table.vue';

    export default {
        name: "postage-list",
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
                    'extraPrice':'',
                    'extraCount':''
                },
                deliveryList: [],
                adminItem: {},
                adminList: [],
                tableConfig: [
                    {
                        label: '配送区域',
                        property: 'regionRules.province'
                    },
                    {
                        label: '基础运费',
                        property: 'basePrice'
                    },
                    {
                        label: '基础数量',
                        property: 'baseCount'
                    },
                    {
                        label: '额外价格',
                        property: 'extraPrice'
                    },
                    {
                        label: '额外数量',
                        property: 'extraCount'
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
            this.getDelivery();
        },

        methods: {
            deleteItem(object, index) {
                const that = this;
                that.$Modal.confirm({
                    title: '提示',
                    content: '是否删除，请确认',
                    onOk: () => {
                        let obj = new Obj(object);
                        obj.delete().then(() => {
                            that.deliveryList.splice(index, 1);
                        });
                    }
                });
            },

            commitAdminItem() {
                const that = this;
                that.delivery.basePrice = that.delivery.basePrice * 100;
                that.delivery.extraPrice = that.delivery.extraPrice * 100;
                Obj.prototype.add(that.delivery).then(res => {
                    let list = res.data.data || {};
                    that.getDelivery()
                    that.showEditModal = false
                    console.log(list);
                });
            },

            prevShowEditModal(obj) {
                this.item = {...(obj || {seq: 1})};
                this.$router.push('/postage/edit/?postageId=' + this.item.id);
            },

            getDelivery() {
                const that = this;
                Obj.prototype.getList().then(res => {
                    let list = res.data.data || {};
                    for(var idx in list){
                        list[idx].basePrice = list[idx].basePrice / 100;
                        list[idx].extraPrice = list[idx].extraPrice / 100;
                    }

                    that.deliveryList = list
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
