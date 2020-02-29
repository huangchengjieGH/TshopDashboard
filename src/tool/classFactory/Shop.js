import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class Shop {
    constructor(options) {
        options = options || {};
        for (let attr in options) {
            this[attr] = options[attr];
        }
    }

    add(data) {
        return Axios({
            url: '/api/admin/shop',
            method: 'post',
            data: data
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    edit(data, id) {
        return Axios({
            url: `/api/admin/shop/${id}`,
            method: 'put',
            data: data
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    delete() {
        return Axios({
            url: `/api/admin/shop/${this.id}`,
            method: 'delete'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    getOne() {
        return Axios({
            url: `/api/admin/shop/${this.id}`,
            method: 'get'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    getList(data) {
        return Axios({
            url: '/api/admin/shop',
            method: 'get',
            params: data
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

    shopUp(shopId) {
        return Axios({
            url: '/api/admin/shop/up',
            method: 'post',
            isFormData: true,
            data: {
                shopId: shopId
            }
        }).then(
            res => {
                res.data.data = res.data.data || [];
                let list = res.data.data;
                // list.map(item => {
                //     item.createdAt = dateFormat(item.createdAt);
                // });
                return Promise.resolve(res);
            },
            err => Promise.reject(err)
        );
    }

    shopDown(shopId) {
        return Axios({
            url: '/api/admin/shop/down',
            method: 'post',
            isFormData: true,
            data: {
                shopId: shopId
            }
        }).then(
            res => {
                res.data.data = res.data.data || [];
                let list = res.data.data;
                // list.map(item => {
                //     item.createdAt = dateFormat(item.createdAt);
                // });
                return Promise.resolve(res);
            },
            err => Promise.reject(err)
        );
    }

    setPercent(data) {
        return Axios({
            url: '/api/admin/shop/percent',
            method: 'post',
            isFormData: true,
            params: data
        }).then(
            res => {
                res.data.data = res.data.data || [];
                let list = res.data.data;
                return Promise.resolve(res);
            },
            err => Promise.reject(err)
        );
    }

    resetPwd(data) {
        return Axios({
            url: '/api/user/password/reset',
            method: 'post',
            isFormData: true,
            params: data
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
