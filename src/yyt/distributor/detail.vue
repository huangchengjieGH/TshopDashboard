<template>
    <section class="plr-sm">
        <header class="y-center ptb-xs sticky">
            <span class="size-md bolder">分销商详情</span>
        </header>
        <el-card v-if="distributor" class="customer-card">
            <div class="customer__wrapper">
                <div class="customer__wrapper__info">
                    <div>姓名：{{distributor.bankAccountOwner}}</div>
                    <!--<div>银行：{{distributor.bank}}</div>-->
                    <!--<div>卡号：{{distributor.bankAccount}}</div>-->
                    <div>
                        <span>分成比例：</span>
                        <span class="text-warning size-md">{{distributor.profit}}%</span>
                    </div>

                    <div>开户银行：{{distributor.bank}}</div>
                    <div>银行账号：{{distributor.bankAccount}}</div>
                    <div>户主姓名：{{distributor.bankAccountOwner}}</div>
                </div>
                <el-button @click="prevShowEditModal()" size="small" type="success">编辑</el-button>
            </div>
        </el-card>
        <el-card>
            <el-tabs v-model="tabIndex" @tab-click="goTab">
                <el-tab-pane label="收入记录" name="0"></el-tab-pane>
                <el-tab-pane label="提现记录" name="1"></el-tab-pane>
            </el-tabs>
            <div v-if="tabIndex == 0" class="mt-md">
                <my-table :data="profitList" :config="profitTableConfig">
                </my-table>
                <div v-if="profitCount" class="text-center p-sm">
                    <el-pagination
                            @current-change="getProfitList"
                            :current-page.sync="page"
                            :page-size="pageSize"
                            layout="total, prev, pager, next, jumper"
                            :total="profitCount">
                    </el-pagination>
                </div>
            </div>
            <div v-if="tabIndex == 1" class="mt-md">
                <my-table :data="withdrawList" :config="withdrawTableConfig">
                    <!--<div slot="operating" slot-scope="customer">-->
                    <!--<el-button type="primary" size="small" @click="gotoDetail(customer.item)">详情</el-button>-->
                    <!--</div>-->
                </my-table>
                <div v-if="withdrawCount" class="text-center p-sm">
                    <el-pagination
                            @current-change="getWithdrawList"
                            :current-page.sync="page"
                            :page-size="pageSize"
                            layout="total, prev, pager, next, jumper"
                            :total="withdrawCount">
                    </el-pagination>
                </div>
            </div>
        </el-card>

        <!--编辑分销商-->
        <el-dialog
                :append-to-body="true"
                :visible.sync="showEditModal">
            <div class="p-sm">
                <div class="edit-modal-item">
                    <span class="plr-sm">佣金比例(%)</span>
                    <el-input type="number" v-model="distributorItem.profit" class="w-5"></el-input>
                </div>
                <div class="edit-modal-item">
                    <span class="plr-sm">备注</span>
                    <el-input v-model="distributorItem.remark" class="w-5"></el-input>
                </div>
                <hr/>
                <div class="edit-modal-item">
                    <span class="plr-sm">开户银行</span>
                    <el-input v-model="distributorItem.bank" class="w-5"></el-input>
                </div>
                <div class="edit-modal-item">
                    <span class="plr-sm">银行账户</span>
                    <el-input v-model="distributorItem.bankAccount" class="w-5"></el-input>
                </div>
                <div class="edit-modal-item">
                    <span class="plr-sm">户主姓名</span>
                    <el-input v-model="distributorItem.bankAccountOwner" class="w-5"></el-input>
                </div>

            </div>
            <div slot="footer" class="text-center">
                <el-button @click="commitDistributorItem()" type="primary">保存</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import Distributor from '@/tool/classFactory/distributor.js';
    import myTable from '@/common/m-table.vue';

    export default {
        name: 'distributor-detail',
        data() {
            return {
                name: 0,
                tabIndex: 0,
                page: 1,
                pageSize: 10,
                distributor: null,
                distributorItem: null,
                defaultDistributor: {
                    profit: '',
                    remark: '',
                    bank: '',
                    bankAccount: '',
                    bankAccountOwner: ''
                },
                distributorId: null,
                showEditModal: false,
                profitList: [],
                withdrawList: [],
                profitCount: 0,
                profitTableConfig: [
                    {
                        label: '订单号',
                        property: 'order.wxOrder.num'
                    },
                    {
                        label: '订单金额',
                        property: 'order.price'
                    },
                    {
                        label: '提成',
                        property: 'profit'
                    },
                    {
                        label: '时间',
                        property: 'createdAt'
                    }
                ],
                withdrawTableConfig: [
                    {
                        label: '提现金额',
                        property: 'withdraw'
                    },
                    {
                        label: '时间',
                        property: 'createdAt'
                    }
                ],
            };
        },

        components: {
            myTable
        },
        activated() {
            this.distributorId = this.$route.query.distributorId || null;
            if (this.distributorId) {
                this.getDistributor();
                this.getProfitList();
                this.distributorItem = this.distributor || this.defaultDistributor;
//                this.getWithdrawList();
            }
        },
        methods: {

            goTab() {
                const that = this;
                console.log("tabIndex:" + that.tabIndex);
                that.initPage();
                switch (that.tabIndex) {
                    case "0":
                        console.log(0);
                        that.getProfitList();
                        break;
                    case "1":
                        console.log(1);
                        that.getWithdrawList();
                        break;
                    default:
                        console.log("def");
                }
            },

            initPage() {
                this.page = 1;
                this.pageSize = 10;
            },
            getDistributor() {
                const that = this;
                let distributor = new Distributor({id: that.distributorId});
                distributor.get().then(res => {

                    console.log('getDistributor')
                    console.log(res.data.data)
                    that.distributor = res.data.data;
                    that.distributor.profit = that.distributor.profit * 100;
                });
            },

            getProfitList() {
                const that = this;
                let distributor = new Distributor({id: that.distributorId});
                distributor.listProfitByDistributor(that.page, that.pageSize).then(res => {
                    let list = res.data.data || [];
                    that.filterProfitList(list);
                    that.profitList.splice(0, that.profitList.length, ...list);
                    that.profitCount = res.data.extra.count || that.profitList.length;
                });
            },

            getWithdrawList() {
                const that = this;
                let distributor = new Distributor({id: that.distributorId});
                distributor.listWithdrawByDistributor(that.page, that.pageSize).then(res => {
                    let list = res.data.data || [];
                    that.filterWithdrawList(list);
                    that.withdrawList.splice(0, that.withdrawList.length, ...list);
                    that.withdrawCount = res.data.extra.count || that.withdrawList.length;
                });
            },

            filterProfitList(list) {
                list.map(item => {
                    item.order.price = item.order.price / 100;
                    item.profit = item.profit / 100;
                });
            },

            filterWithdrawList(list) {
                list.map(item => {
                    item.withdraw = item.withdraw / 100;
                });
            },

            commitDistributorItem() {
                const that = this;
                let distributor = new Distributor(that.distributorItem);

                let thenObj = null;
                if (distributor.id) {
                    thenObj = distributor.edit();
                } else {
                    thenObj = distributor.add();
                }
                thenObj.then(() => {
                    that.showEditModal = false;
                    that.getDistributor();
                });
            },
            prevShowEditModal() {
                this.distributorItem = new Distributor(this.distributor || this.defaultDistributor);
                this.showEditModal = true;
            },
        }
    };

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

    .customer__wrapper {
        display: flex;
        align-items: center;
    }

    .customer__wrapper img {
        width: 100px;
        height: 100px;
        border-radius: 100px;
        object-fit: cover;
        margin-right: 10px;
    }

    .customer__wrapper__info {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }

    .customer__wrapper__info > * {
        flex: none;
        width: 33%;
        padding: 10px;
    }

    .coupon__item {
        display: flex;
        align-items: center;
        padding: 10px;
    }

    .coupon__item > * {
        flex: none;
        width: 33.33%;
        text-align: center;
    }

    .coupon__item:nth-child(even) {
        background-color: #f7f7f7;
    }

    .customer-card {
        margin-bottom: 20px;
    }
</style>