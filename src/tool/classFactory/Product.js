import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class Product {
    constructor(options) {
        options = options || {};
        for (let attr in options) {
            this[attr] = options[attr];
        }
    }

    add(data) {
        return Axios({
            url: '/api/admin/product',
            method: 'post',
            data: data
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    addSelfProduct(data) {
        return Axios({
            url: '/api/shop/product',
            method: 'post',
            data: data
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    edit(data, id) {
        return Axios({
            url: `/api/admin/product/${id}`,
            method: 'put',
            data: data
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    editSelfProduct(data, id) {
        return Axios({
            url: `/api/shop/product/${id}`,
            method: 'put',
            data: data
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    delete() {
        return Axios({
            url: `/api/admin/product/${this.id}`,
            method: 'delete'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    setshowToMain(data) {
        return Axios({
            url: '/api/admin/product/notShowToMain',
            method: 'post',
            isFormData: true,
            data: data
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    unsetshowToMain(data) {
        return Axios({
            url: '/api/admin/product/showToMain',
            method: 'post',
            isFormData: true,
            data: data
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    getOne() {
        return Axios({
            url: `/api/admin/product/${this.id}`,
            method: 'get'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    getSelfOne() {
        return Axios({
            url: `/api/shop/product/${this.id}`,
            method: 'get'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    getList(data) {
        return Axios({
            url: '/api/admin/product',
            method: 'get',
            params: data
        }).then(
            res => {
                res.data.data = res.data.data || [];
                let list = res.data.data;
                list.map(item => {
                    item.createdAt = dateFormat(item.createdAt);
                    item.updatedAt = dateFormat(item.updatedAt);
                });
                return Promise.resolve(res);
            },
            err => Promise.reject(err)
        );
    }

    selfProduct(data) {
        return Axios({
            url: '/api/shop/product',
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

    getShopProduct(data) {
        return Axios({
            url: '/api/admin/shop/product',
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

    getShopUnboundProduct(data) {
        return Axios({
            url: '/api/admin/shop/product/unbind',
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

    bindProduct(data, id) {
        return Axios({
            url: '/api/admin/shop/product/bind?shopId=' + id,
            method: 'post',
            data: data
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

    unbindProduct(data, id) {
        return Axios({
            url: '/api/admin/shop/product/unbind?shopId=' + id,
            method: 'post',
            data: data
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
            url: '/api/admin/product/up',
            method: 'post',
            isFormData: true,
            data: {
                shopId: shopId
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

    shopDown(shopId) {
        return Axios({
            url: '/api/admin/product/down',
            method: 'post',
            isFormData: true,
            data: {
                shopId: shopId
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

    productUp(data) {
        return Axios({
            url: '/api/admin/shop/product/status/up',
            method: 'put',
            isFormData: true,
            data: data
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

    productDown(data) {
        return Axios({
            url: '/api/admin/shop/product/status/down',
            method: 'put',
            isFormData: true,
            data: data
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

    selfProductDown(data) {
        return Axios({
            url: '/api/shop/product/status/down',
            method: 'put',
            isFormData: true,
            data: data
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

    selfProductUp(data) {
        return Axios({
            url: '/api/shop/product/status/up',
            method: 'put',
            isFormData: true,
            data: data
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

    yytProductDown(data) {
        return Axios({
            url: '/api/admin/product/status/down',
            method: 'put',
            isFormData: true,
            data: data
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

    yytProductUp(data) {
        return Axios({
            url: '/api/admin/product/status/up',
            method: 'put',
            isFormData: true,
            data: data
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
            url: '/api/admin/shop/product/percent',
            method: 'put',
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

    setPrice(data) {
        return Axios({
            url: '/api/admin/product/price',
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
