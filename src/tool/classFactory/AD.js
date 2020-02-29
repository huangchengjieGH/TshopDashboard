import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class AD {
    constructor(options) {
        options = options || {};
        for (let attr in options) {
            this[attr] = options[attr];
        }
    }

    add(data) {
        return Axios({
            url: `/api/admin/ads`,
            method: 'post',
            data
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    edit(adId,data) {
        return Axios({
            url: `/api/admin/ads/${adId}`,
            method: 'put',
            data
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    getOne() {
        return Axios({
            url: `/api/admin/ads/${this.id}`,
            method: 'get'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    delete() {
        return Axios({
            url: `/api/admin/ads/${this.id}`,
            method: 'delete'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    getList(type) {
        return Axios({
            url: `/api/admin/ads`,
            method: 'get',
            params: {
                type: type
            }
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
