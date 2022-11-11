const ServiceCategories = require('../../models/service/ServiceCategory');
const { error_db_querry, onBuildResponseErr } = require('../../config/response/ResponseError');

const ServiceCommon = {
    // +++++ Service category common +++++ //
    // 1. Get service category by id
    onGetServiceCategory: async (service_category_id, res, next) => {
        try {
            let service_category = await ServiceCategories.findOne({
                where: {
                    service_category_id: service_category_id,
                },
            }).catch((err) => res.json(error_db_querry(err)));

            if (service_category) {
                return service_category;
            } else {
                return null;
            }
        } catch (err) {
            next(err);
        }
    },

    // 2. Get service category by id_crm
    onGetServiceCategory: async (service_category_id_crm, res, next) => {
        try {
            let service_category = await ServiceCategories.findOne({
                where: {
                    app_id: service_category_id_crm,
                },
            }).catch((err) => res.json(error_db_querry(err)));

            if (service_category) {
                return service_category;
            } else {
                return null;
            }
        } catch (err) {
            next(err);
        }
    },
};

module.exports = ServiceCommon;
