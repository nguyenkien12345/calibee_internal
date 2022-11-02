const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config();

const { HOST, DATABASE, USER_DB, PASSWORD } = process.env;

const sequelize = new Sequelize(DATABASE, USER_DB, PASSWORD, {
    host: HOST,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    logging: false,
    define: {
        underscored: true,
    },
});

sequelize.sync({ force: false, alter: true });

(async () => {
    try {
        await sequelize.authenticate();
        console.log('-----------');
        console.log('Connection has been established successfully.');
        console.log('-----------');
    } catch (error) {
        console.log('-----------');
        console.error('Unable to connect to the database:', error);
        console.log('-----------');
    }
})();

module.exports = sequelize;
