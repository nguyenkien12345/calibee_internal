const Workers = require('../../models/worker/Worker');

const WorkerCommon = {
    onGetWorkerByID: async (worker_id, res, next) => {
        try {
            let worker = await Workers.findOne({
                where: {
                    worker_id: worker_id,
                },
            }).catch((err) => res.json(error_db_query(err)));

            if (worker) {
                return worker;
            } else {
                return null;
            }
        } catch (err) {
            next(err);
        }
    },

    // Get worker by id_crm
    onGetWorkerByID_CRM: async (worker_id_crm, res, next) => {
        try {
            let worker = await Workers.findOne({
                where: {
                    app_id: worker_id_crm,
                },
            }).catch((err) => res.json(error_db_query(err)));

            if (worker) {
                return worker;
            } else {
                return null;
            }
        } catch (err) {
            next(err);
        }
    },

    // Get worker by phone
    onGetWorkerByPhone: async (phone, res, next) => {
        try {
            let worker = await Workers.findOne({
                where: {
                    phone: phone,
                },
            }).catch((err) => res.json(error_db_query(err)));

            if (worker) {
                return worker;
            } else {
                return null;
            }
        } catch (err) {
            next(err);
        }
    },

    onGetWorkerByNid: async (nid, res, next) => {
        try {
            let worker = await Workers.findOne({
                where: {
                    nid: nid,
                },
            }).catch((err) => res.json(error_db_query(err)));

            if (worker) {
                return worker;
            } else {
                return null;
            }
        } catch (err) {
            next(err);
        }
    },

    onGetWorkerByReferralCode: async (referral_code, res, next) => {
        try {
            let worker = await Workers.findOne({
                where: {
                    referral_code: referral_code,
                },
            }).catch((err) => res.json(error_db_query(err)));

            if (worker) {
                return worker;
            } else {
                return null;
            }
        } catch (err) {
            next(err);
        }
    },

    onGetWorkers: async () => {
        try {
            const workers = await Workers.findAll({
                attributes: { exclude: ['password'] },
            }).catch((err) => res.json(error_db_query(err)));

            return workers;
        } catch (err) {
            next(err);
        }
    },
};

module.exports = WorkerCommon;
