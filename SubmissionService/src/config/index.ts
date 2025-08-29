// This file contains all the basic configuration logic for the app server to work
import dotenv from 'dotenv';

type ServerConfig = {
	PORT: number;
	DATABASE_URL: string;
	REDIS_URL: string;
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
	REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
};
