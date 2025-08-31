import { CPP_IMAGE, PYTHON_IMAGE } from '../utils/constants';
export const LANGUAGE_CONFIG = {
	python: {
		timeout: 2000,
		image: PYTHON_IMAGE,
	},
	cpp: {
		timeout: 1000,
		image: CPP_IMAGE,
	},
};
