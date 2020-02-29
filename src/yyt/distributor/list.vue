<template>
    <section class="plr-sm">
        <header class="y-center ptb-xs sticky">
            <span class="size-md bolder">分销商列表</span>
            <el-button @click="prevShowEditModal()" class="mlr-sm" size="small" type="primary">添加分销商</el-button>
            <el-input placeholder="请输入分销商姓名" class="w-3" v-model="search.keywords">
                <el-button @click="getDistributorList(1)" slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </header>
        <my-table :data="distributorList" :config="tableConfig">
            <div slot="operating" slot-scope="distributor">
                <el-button @click="preShowWithdrawModal(distributor.item)" circle type="success">提现</el-button>
                <el-button @click="editDistributor(distributor.item)" icon="el-icon-document" circle
                           type="primary"></el-button>
                <el-button @click="deleteDistributorItem(distributor.item,distributor.index)" icon="el-icon-delete"
                           circle type="danger"></el-button>
            </div>
        </my-table>
        <div v-if="distributorList.length" class="text-center p-sm">
            <el-pagination
                    @current-change="getDistributorList"
                    :current-page.sync="search.page"
                    :page-size="search.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="distributorSum">
            </el-pagination>
        </div>
        <!--编辑分销商-->
        <el-dialog
                :append-to-body="true"
                :visible.sync="showEditModal">
            <div class="p-sm">
                <div class="edit-modal-item">
                    <span class="plr-sm">姓名</span>
                    <el-input v-model="distributorItem.name" class="w-5"></el-input>
                </div>
                <div class="edit-modal-item">
                    <span class="plr-sm">账号</span>
                    <el-input v-model="distributorItem.username" class="w-5"></el-input>
                </div>
                <div class="edit-modal-item">
                    <span class="plr-sm">密码</span>
                    <el-input type="password" v-model="distributorItem.password" class="w-5"></el-input>
                </div>
                <div class="edit-modal-item">
                    <span class="plr-sm">手机</span>
                    <el-input v-model="distributorItem.phone" class="w-5"></el-input>
                </div>
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

        <!--<el-dialog-->
                <!--:append-to-body="true"-->
                <!--:visible.sync="showWithdrawModal">-->
            <!--<div class="p-sm">-->
                <!--<div class="customer__wrapper">-->
                    <!--<div class="customer__wrapper__info">-->
                        <!--<div>姓名：{{withdrawDistributor.customer.name}}</div>-->
                        <!--<div>会员号：{{withdrawDistributor.customer.num}}</div>-->
                        <!--<div>分成比例：{{withdrawDistributor.profit}}%</div>-->

                        <!--<div>开户银行：{{withdrawDistributor.bank}}</div>-->
                        <!--<div>银行账号：{{withdrawDistributor.bankAccount}}</div>-->
                        <!--<div>户主姓名：{{withdrawDistributor.bankAccountOwner}}</div>-->
                    <!--</div>-->
                <!--</div>-->
                <!--<div class="edit-modal-item">-->
                    <!--<span class="plr-sm">提现金额</span>-->
                    <!--<el-input type="number" v-model="withdraw" class="w-5"></el-input>-->
                <!--</div>-->
            <!--</div>-->
            <!--<div slot="footer" class="text-center">-->
                <!--<el-button @click="commitWithdraw()" type="primary">确定</el-button>-->
            <!--</div>-->
        <!--</el-dialog>-->
    </section>
</template>

<script>
    import Distributor from '@/tool/classFactory/distributor.js';
    import myTable from '@/common/m-table.vue';

    export default {
        name: "distributor-list",
        data() {
            return {
                search: {
                    keywords: '',
                    page: 1,
                    pageSize: 10
                },
                showEditModal: false,
                showWithdrawModal: false,
                withdraw: 0,
                distributorItem: {},
                withdrawDistributor: {
                    customer: {}
                },
                distributorList: [],
                distributorSum: 0,
                tableConfig: [
                    {
                        label: '姓名',
                        property: 'bankAccountOwner'
                    },
                    {
                        label: '账号',
                        property: 'username'
                    },
                    {
                        label: '佣金比例(%)',
                        property: 'profit'
                    },
                    {
                        label: '总收入',
                        property: 'account.total'
                    },
                    {
                        label: '未提现',
                        property: 'account.balance'
                    },
                    {
                        label: '操作',
                        type: 'operating'
                    }
                ]
            };
        },

        components: {
            myTable
        },

        activated() {
            this.getDistributorList();
        },

        methods: {
            editDistributor(obj) {
//        const that = this;
//        this.adItem = obj ? {...obj} : {seq: 1};
                this.$router.push('/distributor/detail/?distributorId=' + obj.id);
            },

            deleteDistributorItem(obj, index) {
                const that = this;
                that.$Modal.confirm({
                    title: '提示',
                    content: '是否删除，请确认',
                    onOk: () => {
                        let distributor = new Distributor(obj);
                        distributor.delete().then(() => {
                            that.distributorList.splice(index, 1);
                        });
                    }
                });
            },

            prevShowEditModal(obj) {
                this.distributorItem = obj || {};
                this.showEditModal = true;
            },

            filterDistributorList(list) {
                list.map(item => {
                    item.profit = item.profit * 100;
                    item.account.total = item.account.total / 100;
                    item.account.balance = item.account.balance / 100;
                    item.account.withdrawing = item.account.withdrawing / 100;
                    item.account.withdrawed = item.account.withdrawed / 100;
                    item.sharePath = `page/index/index?distributorId=${item.id}`;
                });
            },

            getDistributorList(page = 1) {
                const that = this;
                let search = that.search;
                search.page = page;
                Distributor.prototype.getList(search).then(res => {
                    let list = res.data.data || [];
                    that.filterDistributorList(list);
                    that.distributorList.splice(0, that.distributorList.length, ...list);
                    that.distributorSum = res.data.extra.count || list.length * 2;
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
                    that.getDistributorList();
                });
            },

            preShowWithdrawModal(obj) {
                this.withdraw = 0;
                this.withdrawDistributor = obj;
                this.showWithdrawModal = true;
            },

            commitWithdraw() {
                const that = this;
                let distributor = new Distributor(that.withdrawDistributor);

                distributor.withdraw(that.withdraw * 100).then(() => {
                    that.withdraw = 0;
                    that.showWithdrawModal = false;
                    this.withdrawDistributor = {
                        customer: {}
                    };
                    that.getDistributorList();
                });
            },
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
