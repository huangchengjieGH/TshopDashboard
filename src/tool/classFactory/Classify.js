import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class Classify {
    constructor(options) {
        options = options || {};
        for (let attr in options) {
            this[attr] = options[attr];
        }
    }

    add() {
        return Axios({
            url: '/api/admin/product/classify',
            method: 'post',
            data: {
                name: this.name,
                imgUrl: this.imgUrl,
                seq: this.seq
            }
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    shopClassifyAdd() {
        return Axios({
            url: '/api/shop/product/classify',
            method: 'post',
            data: {
                name: this.name,
                imgUrl: this.imgUrl,
                seq: this.seq
            }
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    edit() {
        return Axios({
            url: `/api/admin/product/classify/${this.id}`,
            method: 'put',
            data: {
                name: this.name,
                imgUrl: this.imgUrl,
                seq: this.seq
            }
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    shopClassifyEdit() {
        return Axios({
            url: `/api/shop/product/classify/${this.id}`,
            method: 'put',
            data: {
                name: this.name,
                imgUrl: this.imgUrl,
                seq: this.seq
            }
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    delete() {
        return Axios({
            url: `/api/admin/product/classify/${this.id}`,
            method: 'delete'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    deleteShopClassify() {
        return Axios({
            url: `/api/shop/product/classify/${this.id}`,
            method: 'delete'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    getOne() {
        return Axios({
            url: `/api/admin/product/classify/${this.id}`,
            method: 'get'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    shopGetOne() {
        return Axios({
            url: `/api/shop/product/classify/${this.id}`,
            method: 'get'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    getList() {
        return Axios({
            url: '/api/admin/product/classify',
            method: 'get'
        }).then(
            res => {
                res.data.data = res.data.data || [];
                let list = res.data.data;
                list.map(item => {
                    item.createdAt = dateFormat(item.createdAt);
                });
                return Promise.resolve(res);
            },
            err => Promise.reject(err)
        );
    }
    getShopClassifyList() {
        return Axios({
            url: '/api/shop/product/classify',
            method: 'get'
        }).then(
            res => {
                res.data.data = res.data.data || [];
                let list = res.data.data;
                list.map(item => {
                    item.createdAt = dateFormat(item.createdAt);
                });
                return Promise.resolve(res);
            },
            err => Promise.reject(err)
        );
    }
}
