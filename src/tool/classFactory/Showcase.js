import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class Showcase {
    constructor(options) {
        options = options || {};
        for (let attr in options) {
            this[attr] = options[attr];
        }
    }

    add() {
        return Axios({
            url: '/api/admin/showcase',
            method: 'post',
            data: {
                name: this.name,
                imgUrl: this.imgUrl,
                seq: this.seq,
                showType: this.showType
            }
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    shopClassifyAdd() {
        return Axios({
            url: '/api/admin/showcase',
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
            url: `/api/admin/showcase/${this.id}`,
            method: 'put',
            data: {
                name: this.name,
                imgUrl: this.imgUrl,
                seq: this.seq,
                showType: this.showType
            }
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    shopClassifyEdit() {
        return Axios({
            url: `/api/admin/showcase/${this.id}`,
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
            url: `/api/admin/showcase/${this.id}`,
            method: 'delete'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    deleteShopClassify() {
        return Axios({
            url: `/api/admin/showcase/${this.id}`,
            method: 'delete'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    getOne() {
        return Axios({
            url: `/api/admin/showcase/${this.id}`,
            method: 'get'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    shopGetOne() {
        return Axios({
            url: `/api/admin/showcase/${this.id}`,
            method: 'get'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    getshowCaseProduct(data){
        return Axios({
            url: `/api/admin/showcase/product`,
            method: 'get',
            params: data
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    bindShowcase(data){
        return Axios({
            url: `/api/admin/showcase/product`,
            method: 'post',
            data: data
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    getList() {
        return Axios({
            url: '/api/admin/showcase',
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
            url: '/api/admin/showcase',
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
