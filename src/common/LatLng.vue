<style scoped>
    .results {
        position: relative;
        z-index: 2;
    }

    .results__address {
        position: absolute;
        background-color: white;
        overflow-y: auto;
        cursor: default;
        width: 100%;
        max-height: 600px;
    }

    #mapContainer {
        min-width: 300px;
        min-height: 600px;
    }
</style>

<template>
    <section>
        <el-row class="p-sm size-sm y-center">
            <el-col :span="16">
                <el-row>
                    <el-col :span="6">当前位置</el-col>
                    <el-col :span="18" class="bolder">{{latLng.name}}</el-col>
                </el-row>
            </el-col>
            <el-col :span="8">
                <div class="results" @keyup.enter="search">
                    <el-input @focus="isSearch=true;" placeholder="输入关键字搜索" v-model="keywords"></el-input>
                    <div v-if="isSearch" class="results__address">
                        <div class="p-sm" @click="setLocation(item)" v-for="item in addressList">
                            {{item.address||item.name}}
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div id="mapContainer"></div>
        <div  id="infoDiv"></div>
    </section>
</template>

<script>
    import {mapKey} from '@/tool/const';
    var searchService02;
    export default {
        data() {
            return {
                Maps: null,
                map: null,
                marker: null,
                keywords: '',
                isSearch: false,
                addressList: [],
                latLng: {
                    name: '',
                    lat: '',
                    lng: ''
                }
            }
        },

        created() {
            this.init();
        },

        props: {
            location: Object,
            required: true
        },

        watch: {
            'latLng.name': function (newVal) {
                this.location.name = newVal;
            },

            'latLng.lat': function (newVal) {
                this.location.latitude = newVal;
            },

            'latLng.lng': function (newVal) {
                this.location.longitude = newVal;
            }
        },

        methods: {
            init () {
                const that = this;
                let Maps = that.Maps = require('qqmap');
                Maps.init(mapKey, function () {
                    that.setMap();
                    that.getCityLocation();
                    that.listenClick();
                    that.searchService();
                });
            },


            setMap() {
                let Maps = this.Maps;
                this.map = new Maps.Map(
                    document.getElementById("mapContainer"),
                    {
                        zoom: 13
                    }
                );
            },


            getCityLocation() {
                const that = this;
                let Maps = that.Maps;
                let map = that.map;
                let citylocation = new Maps.CityService();

                citylocation.setComplete(result => {
                    that.latLng.name = result.detail.name;
                    that.latLng.lat = result.detail.latLng.lat;
                    that.latLng.lng = result.detail.latLng.lng;
                    map.setCenter(result.detail.latLng);
                    that.getAddress();
                });

                citylocation.searchLocalCity();
            },


            listenClick() {
                const that = this;
                let Maps = that.Maps;
                let map = that.map;
                Maps.event.addListener(map, 'click', function (e) {
                    that.latLng.lat = e.latLng.lat;
                    that.latLng.lng = e.latLng.lng;
                    that.getAddress();
                });
            },


            getAddress() {
                const that = this;
                let Maps = that.Maps;
                let latLng = new Maps.LatLng(that.latLng.lat, that.latLng.lng);
                let geocoder = new Maps.Geocoder();

                geocoder.setComplete(function (result) {
                    let address = result.detail.addressComponents;
                    that.latLng.name = `${address.province}${address.city}${address.district}${address.town}${address.street}${address.streetNumber}`;
                    that.latLng.city = address.city;
                    that.$forceUpdate();
                });

                geocoder.getAddress(latLng);

                if (that.marker) {
                    that.marker.setMap(null);
                }


                that.marker = new Maps.Marker({
                    position: latLng,
                    map: that.map,
                    icon: new qq.maps.MarkerImage('static/img/car.png')
                });
            },
            searchService() {
                const that = this
                let Maps = that.Maps;
                // console.log(that.latLng.city)
                searchService02 = new Maps.SearchService({
                    // 设置搜索范围为北京
                    location: '广州',
                    // 设置搜索页码为1
                    pageIndex: 1,
                    // 设置每页的结果数为5
                    pageCapacity: 5,
                    // 设置展现查询结构到infoDIV上
                    panel: document.getElementById('infoDiv'),
                    // 设置动扩大检索区域。默认值true，会自动检索指定城市以外区域。
                    autoExtend: true,
                    // 检索成功的回调函数
                    complete: function (results) {
                        // 设置回调函数参数
                        console.log(results)
                        if (results.type === 'POI_LIST') {
                            let list = results.detail.pois;
                            that.isSearch = true;
                            that.addressList.splice(0, that.addressList.length, ...list);
                            that.$forceUpdate();
                        }
                    },
                    // 若服务请求失败，则运行以下函数
                    error: function () {
                        alert("出错了。");
                    }
                });
            },
            search() {
                const that = this;
                // let Maps = that.Maps;
                // console.log('city' + that.latLng.city)
                // let searchService = new Maps.SearchService({
                //     location: that.latLng.city,
                //     pageIndex: 1,
                //     pageCapacity: 15,
                //     // 设置展现查询结构到infoDIV上
                //     panel: document.getElementById('infoDiv'),
                //     autoExtend: true,
                //     complete: function (results) {
                //         console.log(results)
                //         if (results.type === 'POI_LIST') {
                //             let list = results.detail.pois;
                //             that.isSearch = true;
                //             that.addressList.splice(0, that.addressList.length, ...list);
                //             that.$forceUpdate();
                //         }
                //     }
                // });
                console.log(that.keywords)
                searchService02.search(that.keywords);
            },


            setLocation(address) {
                const that = this;
                let map = that.map;
                let Maps = that.Maps;
                let latLng = new Maps.LatLng(address.latLng.lat, address.latLng.lng);
                map.setCenter(latLng);
                that.latLng.lat = address.latLng.lat;
                that.latLng.lng = address.latLng.lng;
                that.isSearch = false;
                that.getAddress();
            }
        }
    }
</script>
