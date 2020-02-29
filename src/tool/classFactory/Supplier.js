import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class Supplier {
    constructor(options) {
        options = options || {};
        for (let attr in options) {
            this[attr] = options[attr];
        }
    }

    add(data) {
        return Axios({
            url: `/api/admin/supplier`,
            method: 'post',
            data
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    edit(adId,data) {
        return Axios({
            url: `/api/admin/supplier/${adId}`,
            method: 'put',
            data
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    getOne() {
        return Axios({
            url: `/api/admin/supplier/${this.id}`,
            method: 'get'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    getRalateClassify(data) {
        return Axios({
            url: '/api/admin/supplier/classify',
            method: 'get',
            params:data
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    relateClassify(data){
        return Axios({
            url: '/api/admin/supplier/classify/relate',
            method: 'post',
            params:data
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    delete() {
        return Axios({
            url: `/api/admin/supplier/${this.id}`,
            method: 'delete'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    getList(type) {
        return Axios({
            url: '/api/admin/supplier',
            method: 'get'
        }).then(
            res => {
                res.data.data = res.data.data || [];
                let list = res.data.data;
                return Promise.resolve(res);
            },
            err => Promise.reject(err)
        );
    }
}
