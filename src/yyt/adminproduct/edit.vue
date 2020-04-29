<template>
    <section class="p-sm">
        <header class="title is-5">商品编辑</header>
        <el-row :gutter="20">
            <el-col :span="18">
                <el-card>
                    <el-row class="y-center ptb-sm">
                        <el-col :sm="24" :lg="2">名字</el-col>
                        <div style="display: flex;align-items: center;width: 90%;">
                            <el-col :sm="24" :lg="16">
                                <el-input v-model="obj.name" placeholder="请输入内容" :disabled="disableInput"></el-input>
                            </el-col>
                            <el-col :sm="24" :lg="16" v-if="obj.classify.id == 1">
                                <el-button class="mlr-sm" size="small" type="primary" @click="onChooseTap">选择
                                </el-button>
                            </el-col>
                        </div>
                    </el-row>
                    <!--<el-row class="y-center ptb-sm">-->
                    <!--<el-col :sm="24" :lg="2">价格</el-col>-->
                    <!--<el-col :sm="24" :lg="16">-->
                    <!--<el-input v-model="price" placeholder="请输入价格"></el-input>-->
                    <!--</el-col>-->
                    <!--</el-row>-->
                    <!--<el-row class="y-center ptb-sm">-->
                    <!--<el-col :sm="24" :lg="2">库存</el-col>-->
                    <!--<el-col :sm="24" :lg="16">-->
                    <!--<el-input v-model="obj.stock" placeholder="请输入库存"></el-input>-->
                    <!--</el-col>-->
                    <!--</el-row>-->
                    <el-row class="y-center ptb-sm">
                        <el-col :sm="24" :lg="2">年份</el-col>
                        <el-col :sm="24" :lg="16">
                            <el-input v-model="obj.year" placeholder="请输入年份，如：2019"></el-input>
                        </el-col>
                    </el-row>
                    <el-row class="y-center ptb-sm">
                        <el-col :sm="24" :lg="2">批次</el-col>
                        <el-col :sm="24" :lg="16">
                            <el-input v-model="obj.batch" placeholder="请输入批次，如：1901"></el-input>
                        </el-col>
                    </el-row>
                    <el-row class="y-center ptb-sm">
                        <el-col :sm="24" :lg="2">工艺</el-col>
                        <el-col :sm="24" :lg="16">
                            <el-input v-model="obj.productionTechnology" placeholder="请输入工艺，如：生茶"></el-input>
                        </el-col>
                    </el-row>
                    <el-row class="y-center ptb-sm">
                        <el-col :sm="24" :lg="2">规格</el-col>
                        <el-col :sm="24" :lg="16">
                            <el-input v-model="obj.specification" placeholder="请输入规格，如：357克"></el-input>
                        </el-col>
                    </el-row>
                    <el-row class="y-center ptb-sm">
                        <el-col :sm="24" :lg="2">品牌</el-col>
                        <el-col :sm="24" :lg="16">
                            <el-input v-model="obj.brand" placeholder="请输入品牌，如：大益"></el-input>
                        </el-col>
                    </el-row>
                    <el-card class="mtb-sm">
                        <div class="text-old ptb-xs">商品规格</div>
                        <div v-for="(spec,sindex) in proSpecs">
                            <div class="specsCon">
                                <div>
                                    <span>规格名:</span>
                                    <el-input
                                            style="width: 60%;margin-left: 10px;"
                                            placeholder="请输入规格：规格/尺寸/颜色"
                                            v-model="spec.name"
                                            clearable>
                                    </el-input>
                                </div>
                                <div>
                                    <i class="el-icon-circle-close" @click="delSpescTap(sindex)"></i>
                                </div>
                            </div>
                            <div class="spesc-item">
                                <span>规格值:</span>
                                <el-tag
                                        style="margin-left: 10px;"
                                        :key="val"
                                        v-for="(val,vindex) in spec.vals"
                                        closable
                                        :disable-transitions="false"
                                        @close="handleClose(val.name,sindex,vindex)">
                                    {{val.name}}
                                </el-tag>
                                <el-input
                                        class="input-new-tag"
                                        v-if="inputVisible"
                                        v-model="inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(sindex,vindex)"
                                        @blur="handleInputConfirm(sindex,vindex)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加规格
                                </el-button>

                                <div>
                                </div>
                            </div>
                        </div>


                        <div class="ptb-xs required">
                            <el-button type="primary" @click="onAddSpescTap">+添加规格</el-button>
                        </div>
                    </el-card>

                    <el-card class="mtb-sm">
                        <div class="text-old ptb-xs">子商品</div>

                        <my-table :data="subProducts" :config="tableConfig02">
                            <div slot="operating" slot-scope="sub">
                                <el-button @click="editSubProItem(sub.item,sub.index)" size="small" type="success">操作
                                </el-button>
                                <el-button @click="deleteSubProItem(sub.item,sub.index)" size="small" type="danger">删除
                                </el-button>
                            </div>
                        </my-table>

                        <div class="ptb-xs required">
                            <el-button type="primary" @click="onAddProductTap">+添加子商品</el-button>
                        </div>
                    </el-card>

                    <el-card class="mtb-sm">
                        <div class="text-old ptb-xs">产品图片</div>
                        <div @click="setImgIndex(index)" class="inline mr-sm"
                             v-for="(item,index) in imgList">
                            <el-upload class="uploader"
                                       action="/api/upload"
                                       :show-file-list="false"
                                       :on-success="uploadImg">
                                <img v-if="item.url" :src="item.url" class="banner">
                                <i v-else class="el-icon-plus uploader-icon"></i>
                            </el-upload>
                            <div class="text-center">
                                <el-button @click="deleteImg(index)" type="text">
                                    <span class="text-danger">删除</span>
                                </el-button>
                            </div>
                        </div>
                        <div class="ptb-xs required">产品图片比例为1:1，主图将作为产品的封面图使用。</div>
                    </el-card>
                    <el-row class="y-center ptb-sm">
                        <el-col>
                            <rich-text-editor scrollEl="#single-page-con"
                                              v-model="obj.content.content"></rich-text-editor>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col id="editSide" :span="6">
                <el-card>
                    <el-row class="y-center ptb-sm">
                        <el-col class="ptb-xs">
                            <Icon type="android-folder"></Icon>
                            <span>选择分类</span>
                        </el-col>
                        <el-col>
                            <el-select v-model="obj.classify.id" placeholder="请选择" @change="classifyChange">
                                <el-option
                                        v-for="classify in classifyList"
                                        :key="classify.id"
                                        :label="classify.name"
                                        :value="classify.id">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row class="y-center ptb-sm">
                        <el-col class="ptb-xs">
                            <Icon type="android-folder"></Icon>
                            <span>排序</span>
                        </el-col>
                        <el-col>
                            <!--<div class="edit-modal-item">-->
                            <el-input type="number" v-model="obj.seq" class="w-5"></el-input>
                            <!--</div>-->
                        </el-col>
                    </el-row>
                    <div class="text-center ptb-md">
                        <el-button style="width:150px;" @click="commit" type="success">保存</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!--编辑套餐-->
        <el-dialog
                :append-to-body="true"
                :visible.sync="showEditModal">

            <div>
                <div class="pro-item" v-if="modalShow == 2">
                    <div class="title is-5">子商品</div>
                    <div v-for="(spec,sindex) in proSpecsCopy">
                        <div style="">
                            <div>
                                <el-input
                                        style="width: 60%;"
                                        :disabled="true"
                                        v-model="spec.name">
                                </el-input>
                            </div>
                        </div>
                        <div class="spesc-item">
                            <div v-for="(val,vindex) in spec.vals">
                                <div :class="[val.choosed == true?'choose': 'nochoose']"
                                     @click="onSubproChoose(sindex,vindex)">{{val.name}}
                                </div>
                            </div>
                            <div>
                            </div>
                        </div>
                    </div>

                    <div style="display: flex;align-items: center; margin: 10px 0;">
                        <span>默认显示:</span>
                        <div class="pro-item-value">
                            <el-radio v-model="subProduct.type" label="1">默认</el-radio>
                            <el-radio v-model="subProduct.type" label="2">不默认</el-radio>
                        </div>


                    </div>

                    <div style="display: flex;align-items: center;">
                        <span>排序:</span>
                        <div class="pro-item-value">
                            <el-col style="margin-left: 10px;">
                                <!--<div class="edit-modal-item">-->
                                <el-input type="number" v-model="subProduct.seq" class="w-5"></el-input>
                                <!--</div>-->
                            </el-col>
                        </div>

                    </div>

                    <div style="display: flex;align-items: center; margin: 10px 0;">
                        <span>库存:</span>
                        <div class="pro-item-value">
                            <el-input
                                    style="width: 100%;margin-left: 10px;"
                                    placeholder="请输入库存"
                                    v-model="subProduct.stock"
                                    clearable>
                            </el-input>
                        </div>
                    </div>
                    <div style="display: flex;align-items: center;">
                        <span>价格:</span>
                        <div class="pro-item-value">
                            <el-input
                                    style="width: 100%;margin-left: 10px;"
                                    placeholder="请输入价格"
                                    v-model="subProduct.price"
                                    clearable>
                            </el-input>
                        </div>
                    </div>

                    <div>
                        <span>图片:</span>
                        <div class="pro-item-value">
                            <div class="ysUpload">
                                <el-upload
                                        :on-change="whichChange"
                                        class="avatar-uploader"
                                        action="/api/upload"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess"
                                        :before-upload="beforeAvatarUpload">
                                    <img v-if="subProduct.imgUrl" :src="subProduct.imgUrl" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </div>

                        </div>
                    </div>

                    <div style="display: flex;justify-content: center;align-items: center">
                        <el-button type="primary" @click="addSubPro">确认</el-button>
                    </div>

                    <div>
                    </div>
                </div>

            </div>
            <div class="p-sm" v-if="modalShow == 1">
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
                <my-table :data="teaList" :config="tableConfig">
                    <div slot="operating" slot-scope="tea">
                        <el-button @click="chooseBound(tea.item)" size="small" type="success">选择</el-button>
                    </div>
                </my-table>
            </div>
            <div v-if="teaList.length && modalShow == 1" class="text-center p-sm">
                <el-pagination
                        @current-change="getTeaList"
                        :current-page.sync="search.page"
                        :page-size="search.pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="teaSum">
                </el-pagination>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import Obj from '@/tool/classFactory/Product.js';
    import Tea from '@/tool/classFactory/Tea.js';
    import Classify from '@/tool/classFactory/Classify.js';
    import richTextEditor from '@/common/editor.vue';
    import myTable from '@/common/m-table.vue';
    import  Vue from 'vue';
    export default {
        name: 'adminproduct-edit',
        data() {
            return {
                search: {
                    year: '',
                    name: '',
                    page: 1,
                    pageSize: 10
                },
                year: '年份',
                name: '名称',
                objId: null,
                classifyList: [],
                imgList: [
                    {
                        url: ''
                    }
                ],
                disableInput: false,
                ImgIndex: 0,
                proSpecs: [],
                proSpecsCopy: [],
                subProduct: {
                    "type": '',
                    "stock": '',
                    "seq": '',
                    "price": '',
                    "imgUrl": '',
                    "specVals": [],
                    "describe":''
                },
                subProducts: [],
                obj: {
                    classify: {
                        id: ''
                    },
                    teaId: '',
                    name: '',
                    type: 1,
                    price: 0.00,
                    stock: '',
                    autoResetStock: false,
                    seq: '1',
                    homePageShow: false,
                    images: [],
                    year: '',
                    batch: '',
                    productionTechnology: '',
                    specification: '',
                    brand: '',
                    specs: [],
                    subProducts: [],
                    content: {},
                    describe:''
                },
                price: 0.00,
                showEditModal: false,
                keyword: '',
                type: '',
                teaItem: {},
                teaList: [],
                teaId: '',
                tableConfig: [
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
                        label: '操作',
                        type: 'operating'
                    }
                ],
                tableConfig02: [
                    {
                        label: '图片',
                        property: '',
                        img: 'imgUrl'
                    },
                    {
                        label: '库存',
                        property: 'stock'
                    },
                    {
                        label: '序号',
                        property: 'seq'
                    },
                    {
                        label: '价格',
                        property: 'price'
                    },
                    {
                        label: '规格',
                        property: 'describe'
                    },
                    {
                        label: '操作',
                        type: 'operating'
                    }
                ],
                inputVisible: false,
                inputValue: '',
                spescChoose: '',
                modalShow: 1,
                editSubProIndex: ''
            }
        },

        components: {
            richTextEditor,
            myTable
        },

        async activated() {
            this.objId = this.$route.query.productId || null;
            this.clearDirtyData(this.objId);
            this.objId && this.getOne();
            this.getClassifyList();
            this.getTeaList();
        },

        methods: {
            clearDirtyData(objId) {
                this.obj = {
                    classify: {
                        id: ''
                    },
                    teaId: '',
                    name: '',
                    type: 1,
                    price: '',
                    stock: '',
                    autoResetStock: false,
                    seq: '1',
                    homePageShow: false,
                    images: [],
                    year: '',
                    batch: '',
                    productionTechnology: '',
                    specification: '',
                    brand: '',
                    specs: [],
                    subProducts: [],
                    content: {},
                    subProduct:''
                };
                this.proSpecs = []
                this.subProducts = []
                this.imgList = [
                    {
                        url: ''
                    }
                ]
            },
            deleteImg(index) {
                const that = this;
                that.$Modal.confirm({
                    title: '提示',
                    content: '是否删除，请确认',
                    onOk: () => {
                        that.imgList.splice(index, 1);
                        console.log(that.imgList)
                    }
                });
            },
            onAddProductTap() {
                this.modalShow = 2
                this.showEditModal = true;
                console.log(this.proSpecsCopy)
            },
            onAddSpescTap() {
                var temp = {
                    "name": "",
                    "vals": []
                }
                this.proSpecs.push(temp)
            },
            delSpescTap(index) {
                const that = this
                var array = []
                if (that.proSpecs.length > 1) {
                    for (var idx in that.proSpecs) {
                        if (idx != index) {
                            array.push(that.proSpecs[idx])
                        }
                    }
                    that.proSpecs = []
                    that.proSpecs = array
                } else {
                    this.$message('规格不能为空');
                }
                this.freshproSpecsCopy()
            },
            handleClose(tag, sindex, vindex) {
                console.log('handleClose')
                console.log(tag)
                console.log(sindex, vindex)
                const that = this
                var temp = {
                    name: '',
                    vals: []
                }
                var arrayTemp = []
                for (var idx in that.proSpecs) {
                    temp.name = that.proSpecs[idx].name
                    for (var idx2 in that.proSpecs[idx].vals) {
                        if (idx == sindex && vindex == idx2) {

                        } else {
                            temp.vals.push(that.proSpecs[idx].vals[idx2])
                        }
                    }
                    arrayTemp.push(temp)
                    temp = {
                        name: '',
                        vals: []
                    }
                }
                console.log('arrayTemp')
                console.log(arrayTemp)
                this.proSpecs = []
                this.proSpecs = arrayTemp
                this.freshproSpecsCopy()
                console.log(this.proSpecs)
            },

            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

            handleInputConfirm(sindex, vindex) {
                console.log('handleInputConfirm')
                console.log(sindex, vindex)
                let inputValue = this.inputValue;
                console.log(inputValue)
                var temp = {}
                if (inputValue) {
                    temp.name = inputValue
                    this.proSpecs[sindex].vals.push(temp);
                    temp = {}
                }
                console.log(this.proSpecs)
                this.freshproSpecsCopy()
                this.inputVisible = false;
                this.inputValue = '';
            },
            freshproSpecsCopy() {
                this.proSpecsCopy = []
                for (var idx  in this.proSpecs) {
                    this.proSpecsCopy.push(this.proSpecs[idx])
                }

                for (var i in this.proSpecsCopy) {
                    for (var j in this.proSpecsCopy[i].vals) {
                        this.proSpecsCopy[i].vals[j].choosed = false
                    }
                }
            },
            onSubproChoose(sindex, vindex) {
                console.log(sindex, vindex)
                const  that = this
                for (var idx1 in this.proSpecsCopy) {
                    for (var idx2 in this.proSpecsCopy[idx1].vals) {
                        if (idx1 == sindex) {
                            if (idx1 == sindex && idx2 == vindex) {
                                this.proSpecsCopy[idx1].vals[idx2].choosed = !this.proSpecsCopy[idx1].vals[idx2].choosed
                            } else {
                                this.proSpecsCopy[idx1].vals[idx2].choosed = false
                            }
                        }

                    }
                }

                console.log(this.proSpecsCopy)
                console.log(that.subProduct)

                var temp = ''
                that.subProduct.describe = ''
                for (var i in that.proSpecsCopy) {
                    for (var j in that.proSpecsCopy[i].vals) {
                        if(that.proSpecsCopy[i].vals[j].choosed){
                            temp = that.proSpecsCopy[i].name + ':' + that.proSpecsCopy[i].vals[j].name
                            that.subProduct.describe += temp
                            that.subProduct.describe += ';'
                        }
                    }
                }

                this.$forceUpdate();

            },
            addSubPro() {
                const that = this
                var temp = {
                    "specName": '',
                    "name": ''
                }
                that.subProduct.specVals = []
                for (var idx in that.proSpecsCopy) {
                    for (var idx2 in that.proSpecsCopy[idx].vals) {
                        if (that.proSpecsCopy[idx].vals[idx2].choosed == true) {
                            temp.specName = that.proSpecsCopy[idx].name
                            temp.name = that.proSpecsCopy[idx].vals[idx2].name
                            that.subProduct.specVals.push(temp)
                            temp = {
                                "specName": '',
                                "name": ''
                            }
                        }
                    }
                }
                console.log(that.proSpecsCopy)
                console.log(that.subProduct)
                console.log(that.editSubProIndex)
                if (that.editSubProIndex>=0) {
                    that.subProducts[that.editSubProIndex] = {}
                    that.subProducts[that.editSubProIndex] = that.subProduct
                    that.editSubProIndex = ''
                } else {
                    that.subProducts.push(that.subProduct)
                }

                var temp = ''
                var describe = ''
                var obj = {}
                for (var idx in that.subProducts) {
                    that.subProducts[idx].describe = ''
                    obj = that.subProducts[idx]
                    for (var idx2 in that.subProducts[idx].specVals) {
                        temp = that.subProducts[idx].specVals[idx2].specName + ':' + that.subProducts[idx].specVals[idx2].name
                        describe += temp
                        describe += ';'
                        // that.subProducts[idx].describe += temp
                        // that.subProducts[idx].describe += ';'
                    }
                    console.log('obj')
                    console.log(obj)
                    console.log(describe)
                    obj.describe = describe
                    that.subProducts.splice(idx,obj)
                    describe = ''
                    // this.$set(that.subProducts[idx],'describe',describe)
                    // that.subProducts[idx].describe = describe
                }
                // that.subProducts.splice(that.subProducts.length)
                that.subProduct = {
                    'type': '',
                    'stock': '',
                    'seq': '',
                    'price': '',
                    'imgUrl': '',
                    'describe':'',
                    'specVals': [
                        {
                            "specName": "",
                            "name": ""
                        }
                    ]
                }
                // Vue.$set(vm.subProducts, indexOfItem, newValue)
                that.$forceUpdate();
                console.log(that.subProducts)
                that.showEditModal = false
            },
            deleteSubProItem(obj, index) {
                const that = this;
                console.log(obj, index)
                var arrayTemp = []
                that.$Modal.confirm({
                    title: '提示',
                    content: '是否删除，请确认',
                    onOk: () => {
                        if (that.subProducts.length > 1) {
                            for (var idx in that.subProducts) {
                                if (idx != index) {
                                    arrayTemp.push(that.subProducts[idx])
                                }
                            }
                            that.subProducts = []
                            that.subProducts = arrayTemp
                        } else {
                            this.$message('子商品不能为空');
                        }
                    }
                });
            },
            editSubProItem(obj, index) {
                console.log(obj)
                console.log(obj.type)
                const that = this
                if (obj.type) {
                    obj.type = obj.type.toString()
                }


                this.modalShow = 2
                this.subProduct = obj
                this.editSubProIndex = index

                for (var idx in obj.specVals) {
                    for (var idx2 in that.proSpecsCopy[idx].vals) {
                        if (that.proSpecsCopy[idx].vals[idx2].name == obj.specVals[idx].name) {
                            that.proSpecsCopy[idx].vals[idx2].choosed = true;
                        }else {
                            that.proSpecsCopy[idx].vals[idx2].choosed = false;
                        }
                    }
                }
                console.log(that.proSpecsCopy)
                this.showEditModal = true

            },
            commit() {
                const that = this;
                console.log(that.imgList)
                that.obj.images = []
                for (var idx in that.imgList) {
                    if (that.imgList[idx].url) {
                        that.obj.images.push(that.imgList[idx])
                    }
                }
                if (that.price) {
                    that.obj.price = that.price * 100
                }

                if (!that.obj.name) {
                    that.$message('缺少名字');
                    return
                }
                let thenObj = null;
                console.log(that.subProducts)
                console.log(that.proSpecs)

                for (var idx in that.subProducts) {
                    that.subProducts[idx].price = that.subProducts[idx].price * 100
                }

                that.obj.subProducts = that.subProducts
                that.obj.specs = that.proSpecs
                console.log(that.obj)
                if (that.obj.subProducts.length == 0) {
                    this.$message.error('请添加子商品');
                    return 0
                }
                if (that.obj.specs.length == 0) {
                    this.$message.error('请添加规格');
                    return 0
                }
                if (that.objId) {
                    Obj.prototype.edit(that.obj, that.objId).then(res => {
                        let list = res.data.data || [];
                        that.$router.push('/adminproduct/list');
                    });
                } else {
                    Obj.prototype.add(that.obj).then(res => {
                        let list = res.data.data || [];
                        that.$router.push('/adminproduct/list');
                    });
                }
            },

            whichChange(e) {

                console.log(e)
            },
            handleAvatarSuccess(res) {
                console.log(res.data);
                this.subProduct.imgUrl = res.data;
            },


            beforeAvatarUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 1;
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 1MB!');
                }
                return isLt2M;
            },

            uploadImg(res) {
                let index = this.ImgIndex;
                let list = this.imgList;
                list[index].url = res.data;
                if (list.length - 1 === index) {
                    list.push({});
                }
                this.$forceUpdate();
            },
            setImgIndex(index, subIndex) {
                this.ImgIndex = index;

            },
            uploadSuccess(res) {
                this.imgList.push({url: res.data});
            },
            deleteImg(index) {
                const that = this;
                that.$Modal.confirm({
                    title: '提示',
                    content: '是否删除，请确认',
                    onOk: () => {
                        let list = that.imgList;
                        list.splice(index, 1);
                        if (!list.length) {
                            list.push({});
                        }
                    }
                });
            },
            getOne() {
                const that = this;
                let obj = new Obj({id: that.objId});
                obj.getOne().then(res => {
                    that.obj = res.data.data;
                    if (!that.obj.content) {
                        that.obj.content = {
                            content: ""
                        }
                    }
                    for (var idx in that.obj.subProducts) {
                        that.obj.subProducts[idx].price = that.obj.subProducts[idx].price / 100
                    }
                    that.imgList = that.obj.images
                    that.imgList = that.obj.images
                    that.imgList.push({})
                    that.subProducts = that.obj.subProducts

                    var temp = ''
                    for (var idx in that.subProducts) {
                        that.subProducts[idx].describe = ''
                        for (var idx2 in that.subProducts[idx].specVals) {
                            temp = that.subProducts[idx].specVals[idx2].specName + ':' + that.subProducts[idx].specVals[idx2].name
                            that.subProducts[idx].describe += temp
                            that.subProducts[idx].describe += ';'
                        }
                        temp = ''
                    }
                    that.$forceUpdate();
                    that.proSpecs = that.obj.specs
                    this.freshproSpecsCopy()

                });
            },
            classifyChange() {
                console.log(this.obj)
                if (this.obj.classify.id == 1) {
                    // this.disableInput = true
                    this.disableInput = false
                } else {
                    this.disableInput = false
                }
            },
            onChooseTap() {
                console.log('hcj')
                this.modalShow = 1
                this.showEditModal = true
            },
            chooseBound(item) {
                const that = this;
                // that.tea = obj;
                console.log(item)
                that.$confirm('确定选择这款茶吗, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // that.boundTwoTea(that.tea.goodsId);
                    that.obj.name = item.name;
                    that.teaId = item.id;
                    that.obj.teaId = item.id;
                    that.showEditModal = false
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            getClassifyList() {
                let that = this;
                let classifyList = that.classifyList;
                Classify.prototype.getList().then(res => {
                    let list = res.data.data || [];
                    classifyList.splice(0, classifyList.length, ...list);
                    // that.obj.classify.id = classifyList[0].id
                    // that.obj.classify.name = classifyList[0].name
                });
            },
            getTeaList(e) {
                const that = this;
                if (e) {
                    that.search.page = e;
                }
                Tea.prototype.getList(that.search).then(res => {
                    let list = res.data.data || [];
                    that.teaList.splice(0, that.teaList.length, ...list);
                    console.log(that.teaList)
                    that.teaSum = res.data.extra.count || list.length;
                });
            }
        }
    }
</script>

<style scoped>
    .y-center {
        flex-wrap: wrap;
    }

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
        width: 65px;
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
        width: 65px;
        line-height: 65px;
    }

    .banner {
        width: 150px;
        height: 150px;
        vertical-align: middle;
    }

    .subImg {
        width: 65px;
        height: 65px;
        vertical-align: middle;
    }

    .avatar-uploader img {
        max-width: 100%;
    }

    .specsCon {
        display: flex;
        align-items: center;
        background-color: #f7f7f7;
        padding: 8px 10px;
        justify-content: space-between;
    }

    .spesc-item {
        display: flex;
        margin: 10px;
    }

    .spesc-item-value {
        display: flex;
        flex-direction: column;
        /*justify-content: center;*/
        /*align-items: center;*/
    }

    .pro-item-value {
        margin-left: 10px;
    }

    .pro-item {
        /*display: flex;*/
        /*justify-content: center;*/
    }

    .el-tag + .el-tag {
        margin-left: 10px;
    }

    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }

    .choose {
        padding: 5px 20px;
        background-color: #2d8cf0;
        border: 1px solid #2d8cf0;
        color: white;
        border-radius: 15px;
        margin: 0 5px;
    }

    .nochoose {
        padding: 5px 20px;
        border: 1px solid #eee;
        border-radius: 15px;
        margin: 0 5px;
    }

    #editSide {
        position: -webkit-sticky;
        position: sticky;
        z-index: 2;
        top: 0;
    }
</style>
