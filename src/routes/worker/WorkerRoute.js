const WorkerRouter = require('express').Router();
const WorkerController = require('../../controllers/workerController/WorkerController');
const security = require('../../middleware/security');

// WorkerRouter.post('/crm-register', security.verifySecurity, WorkerController.CRMregister);
WorkerRouter.put('/update-crm', security.verifySecurity, WorkerController.updateCRM);
WorkerRouter.post('/register-crm', security.verifySecurity, WorkerController.registerCRM);
WorkerRouter.get('/crm', security.verifySecurity, WorkerController.getAllWorkerCRM);
WorkerRouter.get('/', security.verifySecurity, WorkerController.getAllWorker);

module.exports = WorkerRouter;
