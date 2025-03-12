import config from '../config.json';
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import { UserModel } from '../users/user.model';

interface DatabaseConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

async function initializeDB() {
    const { host, port, user, password, database } = config.database as DatabaseConfig;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

    const db = {
        sequelize,
        User: UserModel(sequelize),
    };

    await sequelize.sync({ alter: true });
    return db;
}

export default initializeDB();
