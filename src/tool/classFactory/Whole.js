import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class Whole {
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
    showToall(publishId) {
        return Axios({
            url: '/api/admin/publish/showToAll',
            method: 'post',
            isFormData: true,
            data: {
                publishId: publishId
            }
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    unsetToAll(publishId) {
        return Axios({
            url: '/api/admin/publish/notShowToAll',
            method: 'post',
            isFormData: true,
            data: {
                publishId: publishId
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
            url: '/api/admin/publish',
            method: 'get',
            params: params
        }).then(
            res => {
                res.data.data = res.data.data || [];
                let list = res.data.data;
                list.map(item => {
                    item.createdAt = dateFormat(item.createdAt,true);
                });
                return Promise.resolve(res);
            },
            err => Promise.reject(err)
        );
    }
}
