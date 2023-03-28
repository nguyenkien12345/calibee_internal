const WorkerRouter = require('express').Router();
const WorkerController = require('../../controllers/workerController/WorkerController');
const security = require('../../middleware/security');

WorkerRouter.get('/', security.verifySecurity, WorkerController.getAllWorker);

module.exports = WorkerRouter;
