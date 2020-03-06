import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class Evaluate {
    constructor(options) {
        options = options || {};
        for (let attr in options) {
            this[attr] = options[attr];
        }
    }

    add() {
        let data = {
            type: this.type,
            title: this.title,
            introduction: this.introduction,
            imgUrl: this.imgUrl,
            classify: this.classify,
            content: this.content
        };
        return Axios({
            url: `/api/admin/article`,
            method: 'post',
            data
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    edit() {
        let data = {
            type: this.type,
            title: this.title,
            introduction: this.introduction,
            imgUrl: this.imgUrl,
            classify: this.classify,
            content: this.content,
            createdAt: this.createdAt
        };
        return Axios({
            url: `/api/admin/article/${this.id}`,
            method: 'put',
            data
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    reply() {
        let data = {
            "content":this.content
        };
        let url = `/api/admin/question/reply`+'?questionId='+ `${this.id}`;
        return Axios({
            url: url,
            method: 'post',
            data
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
    delete() {
        return Axios({
            url: `/api/admin/article/${this.id}`,
            method: 'delete'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    getOne() {
        return Axios({
            url: `/api/admin/question/${this.id}`,
            method: 'get'
        }).then(
            res => {
                res.data.data = res.data.data || {};
                res.data.data.createdAt = dateFormat(res.data.data.createdAt,true);
                res.data.data.replies.map(item => {
                    item.updatedAt = dateFormat(item.updatedAt,true);
                });
                return Promise.resolve(res);
            },
            err => Promise.reject(err)
        );
    }

    getList(search) {
        return Axios({
            url: `/api/admin/question`,
            method: 'get',
            params: search
        }).then(
            res => {
                res.data.data = res.data.data || [];
                res.data.data.map(item => {
                    item.createdAt = dateFormat(item.createdAt);
                });
                return Promise.resolve(res);
            },
            err => Promise.reject(err)
        );
    }
}
