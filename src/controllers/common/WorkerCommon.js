const Workers = require('../../models/worker/Worker');

const WorkerCommon = {
    // Get worker by id
    onGetWorkerByID: async (worker_id, res, next) => {
        try {
            let worker = await Workers.findOne({
                where: {
                    worker_id: worker_id,
                },
            }).catch((err) => res.json(error_db_querry(err)));

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
            }).catch((err) => res.json(error_db_querry(err)));

            if (worker) {
                return worker;
            } else {
                return null;
            }
        } catch (err) {
            next(err);
        }
    },

    // Get all workers
    onGetWorkers: async () => {
        try {
            const workers = await Workers.findAll({
                attributes: { exclude: ['password'] },
            }).catch((err) => res.json(error_db_querry(err)));

            return workers;
        } catch (err) {
            next(err);
        }
    },
};

module.exports = WorkerCommon;
