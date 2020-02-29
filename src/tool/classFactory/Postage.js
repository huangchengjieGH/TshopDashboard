import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class Postage {
    constructor(options) {
        options = options || {};
        for (let attr in options) {
            this[attr] = options[attr];
        }
    }

    add(data) {
        return Axios({
            url: `/api/admin/postage`,
            method: 'post',
            data
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    edit(adId,data) {
        return Axios({
            url: `/api/admin/postage/${adId}`,
            method: 'put',
            data
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    getOne() {
        return Axios({
            url: `/api/admin/postage/${this.id}`,
            method: 'get'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    delete() {
        return Axios({
            url: `/api/admin/postage/${this.id}`,
            method: 'delete'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    getList(type) {
        return Axios({
            url: `/api/admin/postage`,
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
