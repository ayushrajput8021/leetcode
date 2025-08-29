// This file contains all the basic configuration logic for the app server to work
import dotenv from 'dotenv';

type ServerConfig = {
	PORT: number;
	DATABASE_URL: string;
	REDIS_HOST: string;
	REDIS_PORT: number;
	PROBLEM_SERVICE_URL: string;
};

function loadEnv() {
	dotenv.config();
	console.log(`Environment variables loaded`);
}

loadEnv();

export const serverConfig: ServerConfig = {
	PORT: Number(process.env.PORT) || 3001,
	DATABASE_URL:
		process.env.DATABASE_URL || 'mongodb://localhost:27017/mydatabase',
	REDIS_HOST: process.env.REDIS_HOST || 'localhost',
	REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
	PROBLEM_SERVICE_URL:
		process.env.PROBLEM_SERVICE_URL || 'http://localhost:3000',
};
