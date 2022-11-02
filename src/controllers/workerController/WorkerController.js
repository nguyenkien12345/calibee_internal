const dotenv = require('dotenv');
const WorkerCommon = require('../common/WorkerCommon');
const WorkerCRMCommon = require('../common/WorkerCRMCommon');
const CallAPICommon = require('../../callAPI/Common/index');
const CallAPIWorker = require('../../callAPI/Worker/index');
const { successCallBack } = require('../../config/response/ResponseSuccess');
const { error_missing_params, errorCallBackWithOutParams } = require('../../config/response/ResponseError');

dotenv.config();

const WorkerController = {
    getAllWorker: async (req, res, next) => {
        try {
            let workers = await WorkerCommon.onGetWorkers();
            return res.status(200).json({
                ...successCallBack,
                data: {
                    length: workers.length,
                    workers,
                },
            });
        } catch (err) {
            next(err);
        }
    },

    getAllWorkerCRM: async (req, res, next) => {
        try {
            let workers_crm = await WorkerCRMCommon.onGetAllWorker(req, res, next);
            return res.status(200).json({
                ...successCallBack,
                data: {
                    length: workers_crm.data.data.length,
                    workers_crm: workers_crm.data.data,
                },
            });
        } catch (err) {
            next(err);
        }
    },

    registerCRM: async (req, res, next) => {
        try {
            const { name, phone, nid, address, skills, working_area, worker_id } = req.body;

            if (!name) return res.status(400).json(error_missing_params('name'));
            if (!phone) return res.status(400).json(error_missing_params('phone'));
            if (!nid) return res.status(400).json(error_missing_params('nid'));
            if (!address) return res.status(400).json(error_missing_params('address'));
            if (!skills) return res.status(400).json(error_missing_params('skills'));
            if (!working_area) return res.status(400).json(error_missing_params('working_area'));
            if (!worker_id) return res.status(400).json(error_missing_params('worker_id'));

            let cities_data = await CallAPICommon.getAllCities();
            let skills_data = await CallAPICommon.getAllSkills();
            let result_cities = [];
            let result_skills = [];
            result_cities = JSON.parse(cities_data.data).data.cities;
            result_skills = JSON.parse(skills_data.data).data.skills;

            let cityData = result_cities.find((x) => x.city_id.toString() === working_area.toString());
            let skillData = [];

            let skillArray = skills.split(',');
            for (let i = 0; i < skillArray.length; i++) {
                let skill = result_skills.find((x) => x.skill_id.toString() === skillArray[i].toString());
                skillData.push(skill);
            }

            let Registered_Works = skillData.map((x) => x.skill_name);

            let worker_crm = {
                Lead_Name: name,
                Mobile: phone.replace('0', '+84'),
                Email: '',
                Gender: '',
                Lead_Source: 'Form Submission',
                Lead_Status: 'Capturing',
                Nid: nid,
                Address: address,
                Registered_Works: Registered_Works,
                City_Province: cityData.name,
                App_ID: worker_id,
            };
            let data_worker_crm = await WorkerCRMCommon.onRegisterCRM(worker_crm, next);
            let { code, data, error } = data_worker_crm.data;
            if (code === 3000 && data) {
                return res.status(200).json({
                    ...successCallBack,
                    data: data,
                    user: worker_crm,
                });
            } else {
                return res.json({
                    ...errorCallBackWithOutParams,
                    error: error,
                });
            }
        } catch (err) {
            next(err);
        }
    },
};

module.exports = WorkerController;
