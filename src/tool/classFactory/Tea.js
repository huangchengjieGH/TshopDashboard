import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class Tea {
    constructor(options) {
        options = options || {};
        for (let attr in options) {
            this[attr] = options[attr];
        }
    }

    add() {
        return Axios({
            url: `/spider/set_or_delete_hot`,
            method: 'post',
            data: {
                name: this.name,
                setOrDelete: this.status
            }
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    edit() {
        return Axios({
            url: `/api/admin/article/classify/${this.id}`,
            method: 'put',
            data: {
                name: this.name,
                seq: this.seq
            }
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    delete() {
        return Axios({
            url: `/api/admin/article/classify/${this.id}`,
            method: 'delete'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    getList (params) {
        return Axios({
            url: '/api/admin/tea',
            method: 'get',
            params: params
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
