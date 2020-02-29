<style scoped>
    .photo-img-row {
        flex-wrap: wrap;
    }

    .photo-img {
        width: 200px;
        height: 100px;
        margin-right: 15px;
        margin-bottom: 15px;
        object-fit: cover;
    }

    .photo-img__delete {
        font-size: 32px;
        position: absolute;
        right: 15px;
        top: 0;
        color: rgba(255, 0, 0, .8);
    }
</style>

<template>
    <section class="plr-sm">
        <header class="y-center ptb-xs">
            <span class="size-md bolder">渠道商编辑</span>
        </header>
        <el-card>
            <!--<el-card class="mtb-sm">-->
            <!--<div class="edit-modal-item">-->
            <!--<span class="plr-sm">名称</span>-->
            <!--<el-input v-model="delivery.tag" class="w-5"></el-input>-->
            <!--</div>-->
            <div class="edit-modal-item">
                <span class="plr-sm">名称</span>
                <el-input v-model="supplier.name" class="w-5"></el-input>
            </div>
            <div class="edit-modal-item">
                <span class="plr-sm">备注</span>
                <el-input v-model="supplier.remarks" class="w-5"></el-input>
            </div>
            <div class="edit-modal-item">
                <span class="plr-sm">账户名</span>
                <el-input v-model="supplier.username" class="w-5"></el-input>
            </div>
            <div class="edit-modal-item">
                <span class="plr-sm">密码</span>
                <el-input v-model="supplier.password" class="w-5" show-password></el-input>
            </div>
            <el-row class="text-center mlr-sm p-sm">
                <el-button @click="commitAdd" type="success">保存</el-button>
            </el-row>
        </el-card>
        <!--编辑套餐-->
        <el-dialog
                :append-to-body="true"
                :visible.sync="showEditModal">
            <div>
                <div class="text-old ptb-xs">选择省份</div>
                <el-card class="mtb-sm">
                    <template>
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
                            全选
                        </el-checkbox>
                        <el-checkbox-group class="test" v-model="checkedProvince" @change="handleCheckedCitiesChange">
                            <el-checkbox class="bbb" v-for="item in province" :label="item" :key="item.id">{{item.name}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </template>
                    <div class="text-center">
                        <el-button @click="commitChoose()" type="success">保存</el-button>
                    </div>
                </el-card>
            </div>

        </el-dialog>
    </section>
</template>

<script>
    import Obj from '@/tool/classFactory/Supplier.js';
    import Address from '@/tool/address.js';

    export default {
        name: 'supplier-edit',
        data() {
            return {
                objId: null,
                obj: {
                    name: '',
                    seq: '1',
                    imgUrl: ''
                },
                showEditModal: false,
                checkAll: false,
                isIndeterminate: true,
                supplier: {
                    'name': '',
                    'remarks': '',
                    'username': '',
                    'password': ''
                },
                imgList: [],
                checkedProvince: [],
                provinceOptions: Address,
                properties: {},
                imgLength: false,
                province: Address
            }
        },
        activated() {
            this.objId = this.$route.query.supplierId || null;
            this.clearData();
            this.objId && this.getOne();
        },
        methods: {
            clearData() {
                this.supplier = {
                    'name': '',
                    'remarks': '',
                    'username': '',
                    'password': ''
                };
            },
            handleCheckAllChange(val) {
                this.checkedProvince = val ? this.provinceOptions : [];
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(e) {
                const that = this;
                let checkedCount = e.length;
                this.checkAll = checkedCount === this.province.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.province.length;
            },
            chooseItem(e) {
                this.showEditModal = true;
            },
            commitChoose() {
                console.log(this.checkedProvince);
                if (this.checkedProvince.length > 0) {
                    this.delivery.regionRules.province = []
                    for (var idx in this.checkedProvince) {
                        this.delivery.regionRules.province.push(this.checkedProvince[idx].name);
                    }
                }
                console.log(this.delivery)
                this.showEditModal = false;
            },
            commitAdd() {
                const that = this;
                if (that.objId) {
                    Obj.prototype.edit(that.objId, that.supplier).then(res => {
                        let list = res.data.data || {};
                        this.$router.push('/supplier/list');
                        console.log(list);
                    });
                }
                if (!that.objId) {
                    Obj.prototype.add(that.supplier).then(res => {
                        let list = res.data.data || {};
                        this.$router.push('/supplier/list');
                        console.log(list);
                    });
                }
            },
            getOne() {
                const that = this;
                let obj = new Obj({id: that.objId});
                obj.getOne().then(res => {
                    let obj = res.data.data;
                    console.log(obj)
                    that.supplier = obj;
                });
            }
        }
    }
</script>
<style scoped>


    .uploader {
        width: 150px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        display: inline-block;
    }

    .uploader.sub {
        width: 150px;
    }

    .uploader:hover {
        border-color: #409EFF;
    }

    .uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 150px;
        line-height: 150px;
        text-align: center;
    }

    .uploader-icon.sub {
        width: 150px;
        line-height: 150px;
    }

    .subImg {
        width: 150px;
        height: 150px;
        vertical-align: middle;
    }

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

    .test {
        display: flex;
        flex-wrap: wrap;
    }

    .test > * {
        flex: none;
        width: 30%;
        margin: 10px 0 0 0;
    }
</style>