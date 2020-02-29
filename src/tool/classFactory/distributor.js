import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class Distributor {
    constructor(options) {
        options = options || {};
        for (let attr in options) {
            this[attr] = options[attr];
        }
    }

    add() {
        return Axios({
            url: `/api/admin/distributor`,
            method: 'post',
            data: {
                name: this.name,
                phone: this.phone,
                profit: this.profit / 100,
                username: this.username,
                password: this.password,
                remark: this.remark,
                bank: this.bank,
                bankAccount: this.bankAccount,
                bankAccountOwner: this.bankAccountOwner
            }
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    edit() {
        return Axios({
            url: `/api/admin/distributor/${this.id}`,
            method: 'put',
            data: {
                name: this.name,
                phone: this.phone,
                profit: this.profit / 100,
                username: this.username,
                password: this.password,
                remark: this.remark,
                bank: this.bank,
                bankAccount: this.bankAccount,
                bankAccountOwner: this.bankAccountOwner,
            }
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    delete() {
        return Axios({
            url: `/api/admin/distributor/${this.id}`,
            method: 'delete'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    getList(search) {
        return Axios({
            url: `/api/admin/distributor`,
            method: 'get',
            params: search
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

    get() {
        return Axios({
            url: `/api/admin/distributor/${this.id}`,
            method: 'get'
        }).then(
            res => {
                res.data.data = res.data.data || [];
                res.data.data.createdAt = dateFormat(res.data.data.createdAt);
                return Promise.resolve(res);
            },
            err => Promise.reject(err)
        );
    }

    listProfit() {
        return Axios({
            url: `/api/admin/distributor/${this.id}`,
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

    get() {
        return Axios({
            url: `/api/admin/distributor/${this.id}`,
            method: 'get'
        }).then(
            res => {
                res.data.data = res.data.data || [];
                let item = res.data.data;
                item.createdAt = dateFormat(item.createdAt);
                return Promise.resolve(res);
            },
            err => Promise.reject(err)
        );
    }

    listProfitByDistributor(page, pageSize) {
        return Axios({
            url: `/api/admin/distributor/profitByDistributor`,
            method: 'get',
            params: {
                distributorId: this.id,
                page: page,
                pageSize: pageSize,
            }
        }).then(
            res => {
                res.data.data = res.data.data || [];
                let list = res.data.data;
                list.map(item => {
                    item.createdAt = dateFormat(item.createdAt, true);
                });
                return Promise.resolve(res);
            },
            err => Promise.reject(err)
        );
    }

    listWithdrawByDistributor(page, pageSize) {
        return Axios({
            url: `/api/admin/distributor/withdrawByDistributor`,
            method: 'get',
            params: {
                distributorId: this.id,
                page: page,
                pageSize: pageSize,
            }
        }).then(
            res => {
                res.data.data = res.data.data || [];
                let list = res.data.data;
                list.map(item => {
                    item.createdAt = dateFormat(item.createdAt, true);
                });
                return Promise.resolve(res);
            },
            err => Promise.reject(err)
        );
    }

    withdraw(withdraw) {
        return Axios({
            url: `/api/admin/distributor/withdraw`,
            method: 'POST',
            params: {
                distributorId: this.id,
                withdraw: withdraw,
            }
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

}
