import mongoose from 'mongoose';
import logger from './logger.config';
import { serverConfig } from '.';

export async function connectDB() {
	try {
		await mongoose.connect(serverConfig.DATABASE_URL, {
			authSource: 'admin',
		});
		logger.info('Connected to MongoDB');

		mongoose.connection.on('error', (error) => {
			logger.error('MongoDB connection error:', error);
		});

		mongoose.connection.on('disconnected', () => {
			logger.warn('MongoDB disconnected');
		});
	} catch (error) {
		logger.error('Error connecting to MongoDB:', error);
		process.exit(1);
	}
}
