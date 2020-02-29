<template>
    <section v-if="order.id" class="plr-sm">
        <header class="y-center ptb-md sticky">
            <span class="size-md bolder">订单详情</span>
        </header>
        <el-card class="mb-sm">
            <el-steps class="order__step" :space="250" :active="order.stepStatus" finish-status="success">
                <el-step title="未支付"></el-step>
                <el-step title="已支付"></el-step>
                <!--<el-step title="待完成"></el-step>-->
                <el-step title="已完成"></el-step>
            </el-steps>
            <div class="mt-md">
                <div>
                    <span>订单状态：</span>
                    <span :style="{color:orderStatusName(order.status).color}">{{orderStatusName(order.status).name}}</span>
                </div>
                <div class="mtb-sm">
                    <el-button @click="confirm()" v-if="order.status===2" type="primary">确认发货</el-button>
                    <el-button @click="complete()" v-if="order.status===3" type="success">完成订单</el-button>
                    <el-button @click="refund" v-if="order.status===2||order.status===3" type="danger">退款</el-button>
                </div>
            </div>
        </el-card>
        <el-card class="mt-sm">
            <el-tabs v-model="info.status">
                <el-tab-pane label="产品信息" name="product"></el-tab-pane>
                <!--<el-tab-pane label="客户信息" name="user"></el-tab-pane>-->
            </el-tabs>

            <!--客户信息-->
            <!--<section v-if="info.status==='user'">-->
            <!--<div class="p-sm">-->
            <!--<span>预定人姓名：</span>-->
            <!--<span class="text-info">{{order.name}}</span>-->
            <!--</div>-->
            <!--<div class="p-sm">-->
            <!--<span>身份证号码：</span>-->
            <!--<span class="text-success">{{order.identityNum}}</span>-->
            <!--</div>-->
            <!--<div class="p-sm">-->
            <!--<span>联系电话：</span>-->
            <!--<span class="text-danger">{{order.phone}}</span>-->
            <!--</div>-->
            <!--</section>-->

            <!--产品信息-->
            <section v-if="info.status==='product'" class="order__wrapper">
                <el-row class="order__header">
                    <el-col :span="15">
                        <el-row>
                            <el-col :span="12">产品信息</el-col>
                            <el-col :span="6">单价</el-col>
                            <el-col :span="6">数量</el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="3">订单状态</el-col>
                    <el-col :span="3">邮费</el-col>
                    <el-col :span="3">订单价格</el-col>
                </el-row>
                <el-row class="order__item">
                    <el-col :span="24">
                        <el-row class="order__product">
                            <el-col :span="15">
                                <el-row class="order-product__info" v-for="product in order.products">
                                    <el-col class="xy-center" :span="12">
                                        <img class="mr-md" :src="product.imgUrl">
                                        <span>{{product.name}}</span>
                                    </el-col>
                                    <el-col :span="6">{{(product.price/100).toFixed(2)}}</el-col>
                                    <el-col :span="6">{{product.count}}</el-col>
                                </el-row>
                            </el-col>
                            <el-col :style="{color:orderStatusName(order.status).color}" :span="3">
                                {{orderStatusName(order.status).name}}
                            </el-col>
                            <el-col class="text-danger" :span="3">{{(((order.postage||0))/100).toFixed(2)}}</el-col>
                            <el-col class="text-success" :span="3">{{((order.totalPrice||0)/100).toFixed(2)}}</el-col>
                        </el-row>
                    </el-col>
                    <el-col class="item__info" :span="24">
                        <el-row class="y-center">
                            <el-col :span="9">姓名：{{order.address.userName}}</el-col>
                            <el-col :span="9">电话：{{order.address.telNumber}}</el-col>
                            <el-col :span="9">备注：{{order.remarks}}</el-col>
                            <el-col :span="9">
                                地址：{{order.address.provinceName}}{{order.address.cityName}}{{order.address.countyName}}-{{order.address.detailInfo}}
                            </el-col>
                            <el-col :span="9">下单时间：{{order.wxOrder.createdAt}}</el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </section>
        </el-card>

        <!--退款弹框-->
        <el-dialog
                :append-to-body="true"
                :visible.sync="showEditModal">
            <div v-if="style == 1">
                <div class="text-center">
                    <span class="plr-sm">快递公司</span>
                    <el-input v-model="delivery.express" class="w-5"></el-input>
                </div>
            </div>
            <div style="margin: 10px 0" v-if="style == 1">
                <div class="text-center">
                    <span class="plr-sm">快递单号</span>
                    <el-input v-model="delivery.expressId" class="w-5"></el-input>
                </div>
            </div>
            <div style="margin: 10px 0" v-if="style == 2">
                <div class="text-center">
                    <span class="plr-sm">退款理由</span>
                    <el-input v-model="order.msg" class="w-5"></el-input>
                </div>
                <div slot="footer" class="text-center">
                    <el-button @click="refund()" type="success">确定退款</el-button>
                </div>
            </div>
            <div slot="footer" class="text-center" v-if="style == 1">
                <el-button @click="onCommitTap()" type="success">确定发货</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import Order from '@/tool/classFactory/Order.js';

    export default {
        name: 'order-detail',
        data() {
            return {
                showEditModal: false,
                orderId: null,
                info: {
                    status: 'product'
                },
                order: {},
                delivery: {
                    'orderId': '',
                    'express': '',
                    'expressId': ''
                },
                style: '1'
            };
        },

        activated() {
            this.orderId = this.$route.query.orderId || null;
            this.orderId && this.getOrder();
        },

        methods: {
            orderStatusName(status) {
                let name = '';
                let color = '';
                switch (status) {
                    case 1 :
                        name = '未支付';
                        color = '#ffad33';
                        break;
                    case 2 :
                        name = '已支付';
                        color = '#ffad33';
                        break;
                    case 3 :
                        name = '已完成';
                        color = '#68B3C8';
                        break;
                    case -1 :
                        name = '已取消';
                        color = '#a4a4a4';
                        break;
                    case -2 :
                        name = '已退款';
                        color = '#ff3f66';
                        break;
                }
                return {name, color}
            },

            confirm() {
                const that = this;
                this.style = 1;
                this.showEditModal = true;
                // that.$Modal.confirm({
                //     title: '提示',
                //     content: '是否接单，请确认',
                //     onOk: () => {
                //         let order = new Order(that.order);
                //         order.confirm().then(() => {
                //             that.getOrder();
                //         });
                //     }
                // });
            },

            complete() {
                const that = this;
                that.$Modal.confirm({
                    title: '提示',
                    content: '是否完成，请确认',
                    onOk: () => {
                        let order = new Order(that.order);
                        order.completeOrder().then((res) => {
                            console.log(res);
                            that.getOrder();
                        });
                    }
                });
            },
            completeOrder() {
                const that = this;
                console.log(that.delivery)
                // let order = new Order(that.delivery);
                Order.prototype.completeOrder(that.delivery).then((res) => {
                    console.log(res);
                    that.showEditModal = false;
                    that.getOrder();
                });
            },
            refund() {
                const that = this;
                that.$Modal.confirm({
                    title: '提示',
                    content: '是否执行退款操作，请确认',
                    onOk: () => {
                        let order = new Order(that.order);
                        order.refund().then(() => {
                            that.getOrder();
                        });
                        if (this.style == '1') {
                            this.completeOrder();
                        }
                    }
                });

            },
            onCommitTap() {
                this.showEditModal = false;
                this.completeOrder();
            },
            getOrder() {
                const that = this;
                let order = new Order({id: that.orderId});
                order.getOne().then(res => {
                    that.order = res.data.data;
                    console.log('hcj')
                    console.log(that.order.id)
                    that.delivery.orderId = that.order.id
                    that.order.stepStatus = that.order.status;
                });
            }
        }
    }
</script>

<style scoped>
    .order__step {
        padding-bottom: 20px;
        border-bottom: 1px solid var(--border-color);
    }

    .order__wrapper {
        text-align: center;
    }

    .order__header {
        background-color: white;
        font-weight: bold;
        padding: 15px 0;
        border: 1px solid #efeae3;
    }

    .order__item {
        border: 1px solid var(--border-color);
        border-top: none;
    }

    .order__item:nth-child(even) {
        background-color: #f9f9f9;
    }

    .item__info {
        padding: 15px 0;
        /*background-color: rgba(188, 188, 188, 0.07);*/
    }

    .order__product {
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgba(187, 187, 187, .2);
    }

    .order-product__info {
        display: flex;
        align-items: center;
        padding: 15px 0;
        border-right: 1px solid rgba(187, 187, 187, .2);
    }

    .order-product__info img {
        width: 50px;
        object-fit: cover;
    }

    .order-product__info:not(:last-child) {
        border-bottom: 1px solid var(--border-color);
    }
</style>
