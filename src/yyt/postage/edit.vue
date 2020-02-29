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
            <span class="size-md bolder">图标编辑</span>
        </header>
        <el-card>
            <!--<el-card class="mtb-sm">-->
            <!--<div class="edit-modal-item">-->
            <!--<span class="plr-sm">名称</span>-->
            <!--<el-input v-model="delivery.tag" class="w-5"></el-input>-->
            <!--</div>-->
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
            <div class="edit-modal-item" v-if="!delivery.isBase">
                <span class="plr-sm">配送区域</span>
                <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="请输入内容"
                        v-model="delivery.regionRules.province">
                </el-input>
                <el-button style='margin-left: 10px;' @click="chooseItem()" type="success">选择</el-button>
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
    import Obj from '@/tool/classFactory/Postage.js';
    import Address from '@/tool/address.js';

    export default {
        name: 'postage-edit',
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
                delivery: {
                    'basePrice': 0.00,
                    'baseCount': '',
                    'extraPrice': '',
                    'extraCount': '',
                    'regionRules': {
                        'province': []
                    }
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
            this.objId = this.$route.query.postageId || null;
            this.clearData();
            this.objId && this.getOne();
        },
        methods: {
            clearData() {
                this.delivery = {
                    'basePrice': 0.00,
                    'baseCount': '',
                    'extraPrice': '',
                    'extraCount': '',
                    'regionRules': {
                        'province': []
                    }
                };
            },
            isValid(obj) {
                if (!obj.imgUrl) {
                    return false;
                }
                return true;
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
                if (that.delivery.basePrice && that.delivery.extraPrice && that.delivery.baseCount && that.delivery.extraCount) {
                    that.delivery.basePrice = that.delivery.basePrice * 100;
                    that.delivery.extraPrice = that.delivery.extraPrice * 100;
                    if (that.delivery.isBase) {
                        that.delivery.regionRules = null
                    }
                    if (that.objId) {
                        Obj.prototype.edit(that.objId, that.delivery).then(res => {
                            let list = res.data.data || {};
                            this.$router.push('/postage/list');
                            console.log(list);
                        });
                    }
                    if (!that.objId) {
                        Obj.prototype.add(that.delivery).then(res => {
                            let list = res.data.data || {};
                            this.$router.push('/postage/list');
                            console.log(list);
                        });
                    }
                }
            },
            getOne() {
                const that = this;
                let obj = new Obj({id: that.objId});
                obj.getOne().then(res => {
                    let obj = res.data.data;
                    console.log(obj)
                    obj.basePrice = obj.basePrice / 100;
                    obj.extraPrice = obj.extraPrice / 100;
                    if (obj.isBase) {
                        obj.regionRules = {
                            province: []
                        };
                    }
                    that.delivery = obj;
                    console.log(that.delivery)
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