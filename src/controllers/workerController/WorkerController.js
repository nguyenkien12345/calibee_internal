const dotenv = require('dotenv');
const Workers = require('../../models/worker/Worker');
const WorkerCommon = require('../common/WorkerCommon');
const WorkerCRMCommon = require('../common/WorkerCRMCommon');
const CallAPICommon = require('../../callAPI/Common/index');
const { successCallBack } = require('../../config/response/ResponseSuccess');
const {
    error_missing_params,
    errorCallBackWithOutParams,
    onBuildResponseErr,
} = require('../../config/response/ResponseError');
const AuthenHelper = require('../../helpers/authen');
const { onMakeid } = require('../../helpers/generate');

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
                Lead_Name: name.toUpperCase(),
                Mobile: phone.replace('0', '+84'),
                Email: '',
                Gender: '',
                Lead_Source: 'App',
                Lead_Status: 'Capturing',
                Nid: nid ? nid : '',
                Address: address ? address : '',
                Registered_Works: Registered_Works,
                City_Province: cityData.name,
                App_ID: worker_id,
                Worker_ID: nid,
            };

            let data_worker_crm = await WorkerCRMCommon.onRegisterCRM(worker_crm, next);
            buildProdLogger('info', 'register_crm_worker_information.log').info(
                `Hostname: ${req.hostname} --- Ip: ${req.ip} --- Router: ${req.url} 
				--- Method: ${req.method} --- Controller: WorkerController
				--- Message: ${phone} register crm worker information --- Data: ${JSON.stringify(data_worker_crm)}`,
            );

            let { code, data, error } = data_worker_crm.data;
            if (code === 3000 && data) {
                buildProdLogger('info', 'register_crm_worker_success.log').info(
                    `Hostname: ${req.hostname} --- Ip: ${req.ip} --- Router: ${req.url} 
					--- Method: ${req.method} --- Controller: WorkerController
					--- Message: ${phone} registered crm successfully --- Data: ${JSON.stringify(data)}`,
                );
                return res.status(200).json({
                    ...successCallBack,
                    data: data,
                    user: worker_crm,
                });
            } else {
                buildProdLogger('error', 'register_crm_worker_fail.log').error(
                    `Hostname: ${req.hostname} --- Ip: ${req.ip} --- Router: ${req.url} 
					--- Method: ${req.method} --- Controller: WorkerController
					--- Message: ${phone} registered crm failure --- Error: ${JSON.stringify(error)}`,
                );
                return res.json({
                    ...errorCallBackWithOutParams,
                    error: error,
                });
            }
        } catch (err) {
            next(err);
        }
    },

    updateCRM: async (req, res, next) => {
        try {
            const zohoId = req.body.zohoId;
            if (!zohoId) {
                return res.status(400).json(error_missing_params('zohoId'));
            }

            let { email, working_area } = req.body;

            let cities_data = await CallAPICommon.getAllCities();
            let result_cities = [];
            result_cities = JSON.parse(cities_data.data).data.cities;
            let cityData = result_cities.find((x) => x.city_id.toString() === working_area.toString());

            let worker = await WorkerCRMCommon.onGetDetailWorker(zohoId, res, next);
            if (worker.data.code === 3100) {
                return res.json(onBuildResponseErr('error_not_found_user'));
            } else if (worker.data.code === 3000 && worker.data.data) {
                working_area = cityData.name;
                let updatedworker = {
                    Email: email ? email : worker.data.data.Email,
                    City_Province: working_area ? working_area : worker.data.data.City_Province,
                };
                let data_worker_crm = await WorkerCRMCommon.onUpdateCRM(zohoId, updatedworker, next);
                let { code, data, error } = data_worker_crm.data;
                if (code === 3000 && data) {
                    buildProdLogger('info', 'update_crm_worker_success.log').info(
                        `Hostname: ${req.hostname} --- Ip: ${req.ip} --- Router: ${req.url} 
						--- Method: ${req.method} --- Controller: WorkerController
						--- Message: ${zohoId} updated crm successfully --- Data: ${JSON.stringify(data)}`,
                    );
                    return res.status(200).json({
                        ...successCallBack,
                        data: data,
                    });
                } else {
                    buildProdLogger('error', 'update_crm_worker_fail.log').error(
                        `Hostname: ${req.hostname} --- Ip: ${req.ip} --- Router: ${req.url} 
						--- Method: ${req.method} --- Controller: WorkerController
						--- Message: ${zohoId} updated crm failure --- Error: ${JSON.stringify(error)}`,
                    );
                    return res.json({
                        ...errorCallBackWithOutParams,
                        error: error,
                    });
                }
            }
        } catch (err) {
            next(err);
        }
    },

    CRMregister: async (req, res, next) => {
        try {
            const { name, phone, password, nid, address, skills, working_place, working_area, app_id } = req.body;

            if (!name) return res.status(400).json(error_missing_params('name'));
            if (!phone) return res.status(400).json(error_missing_params('phone'));
            if (!password) return res.status(400).json(error_missing_params('password'));
            if (!nid) return res.status(400).json(error_missing_params('nid'));
            if (!address) return res.status(400).json(error_missing_params('address'));
            if (!skills) return res.status(400).json(error_missing_params('skills'));
            if (!working_place) return res.status(400).json(error_missing_params('working_place'));
            if (!working_area) return res.status(400).json(error_missing_params('working_area'));
            if (!app_id) return res.status(400).json(error_missing_params('app_id'));

            let is_exists_phone = await WorkerCommon.onGetWorkerByPhone(phone, res, next);
            if (is_exists_phone) {
                return res.json(onBuildResponseErr('error_exist_phone'));
            }

            let is_exists_nid = await WorkerCommon.onGetWorkerByNid(nid, res, next);
            if (is_exists_nid) {
                return res.json(onBuildResponseErr('error_exist_nid'));
            }

            let cities_data = await CallAPICommon.getAllCities();
            let skills_data = await CallAPICommon.getAllSkills();
            let result_cities = [];
            let result_skills = [];
            result_cities = JSON.parse(cities_data.data).data.cities;
            result_skills = JSON.parse(skills_data.data).data.skills;

            let cityData = result_cities.find(
                (x) =>
                    x.name.toLowerCase().indexOf(working_area.toLowerCase()) !== -1 ||
                    working_area.toLowerCase().indexOf(x.name.toLowerCase()) !== -1,
            );

            let skillData = [];
            result_skills.map((x) => {
                skills.map((y) => {
                    if (y.toLowerCase() === x.skill_name.toLowerCase()) {
                        skillData.push(x);
                    }
                });
            });

            let skillDataCode = skillData.map((x) => x.skill_id);

            let result_districts = await CallAPICommon.getAllDistrictByCity(cityData.city_id);
            let dataArrDistricts = JSON.parse(result_districts.data).data.province.districts;
            let districtData = [];
            dataArrDistricts.map((x) => {
                working_place.map((y) => {
                    if (
                        x.name.toLowerCase().indexOf(y.toLowerCase()) !== -1 &&
                        y.toLowerCase().indexOf(x.name.toLowerCase() !== -1)
                    ) {
                        districtData.push(x);
                    }
                });
            });
            let districtDataCode = districtData.map((x) => x.code);

            let referral_code = onMakeid(10);
            let checkExistReferralCode = await WorkerCommon.onGetWorkerByReferralCode(referral_code, res, next);
            while (checkExistReferralCode) {
                referral_code = onMakeid(10);
                checkExistReferralCode = await WorkerCommon.onGetWorkerByReferralCode(referral_code, res, next);
            }

            const new_refresh_token = AuthenHelper.generateRefreshTokenWorker(phone);
            let worker = await Workers.create({
                name,
                phone,
                email: '',
                password,
                nid,
                address,
                sex: '',
                skills: skillDataCode.toString(),
                working_place: districtDataCode.toString(),
                working_area: cityData.city_id,
                refresh_token: new_refresh_token,
                is_verify: true,
                avatar: '',
                referral_code: referral_code,
                worker_id_crm: '',
            }).catch((err) => res.json(error_db_querry(err)));
            const new_access_token = AuthenHelper.generateAccessTokenWorker(worker.id, worker.phone);

            let { password: password_user, createdAt, updatedAt, ...other } = worker.dataValues;

            buildProdLogger('info', 'crm_register_worker_success.log').info(
                `Hostname: ${req.hostname} --- Ip: ${req.ip} --- Router: ${req.url} 
				--- Method: ${req.method} --- Controller: WorkerController
				--- Message: ${phone} from crm registered successfully`,
            );

            return res.status(201).json({
                ...successCallBack,
                data: {
                    success: true,
                    access_token: new_access_token,
                    refresh_token: new_refresh_token,
                    user: { ...other },
                },
            });
        } catch (err) {
            next(err);
        }
    },

    getDetailInfoBank: async (req, res, next) => {
        try {
            let worker_id = req.body.worker_id;

            if (!worker_id) return res.status(400).json(error_missing_params('worker_id'));

            let worker = await WorkerCRMCommon.getDetailInfoBank(worker_id);

            if (worker.data.code === 3100) {
                return res.json(onBuildResponseErr('error_not_found_user'));
            } else if (worker.data.code === 3000 && worker.data.data) {
                let infoAccount = {
                    accountNumber: worker.data.data[0].Account_Number,
                    bankName: worker.data.data[0].Bank_Name,
                };
                return res.status(200).json({
                    ...successCallBack,
                    data: {
                        ...infoAccount,
                    },
                });
            }
        } catch (err) {
            next(err);
        }
    },
};

module.exports = WorkerController;