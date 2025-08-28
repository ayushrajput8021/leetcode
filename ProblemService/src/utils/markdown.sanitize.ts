import { marked } from 'marked';
import logger from '../config/logger.config';
import sanitizeHtml from 'sanitize-html';
import TurndownService from 'turndown';

/**
 * Sanitize the markdown by removing all the html tags
 * @param markdown - The markdown to sanitize
 * @returns The sanitized markdown
 */
export async function sanitizeMarkdown(markdown: string): Promise<string> {
	if (!markdown || typeof markdown !== 'string') {
		return '';
	}
	try {
		const convertedHtml = await marked.parse(markdown);
		const sanitizedHtml = sanitizeHtml(convertedHtml, {
			allowedTags: sanitizeHtml.defaults.allowedTags.concat([
				'pre',
				'img',
				'code',
				'span',
				'div',
			]),
			allowedAttributes: {
				...sanitizeHtml.defaults.allowedAttributes,
				img: ['src', 'alt', 'title'],
				code: ['class', 'style'],
				span: ['class', 'style'],
				div: ['class', 'style'],
				pre: ['class', 'style'],
			},
			allowedSchemes: ['http', 'https'],
			allowedSchemesByTag: {
				img: ['http', 'https'],
			},
		});

		const tds = new TurndownService();

		return tds.turndown(sanitizedHtml);
	} catch (error) {
		logger.error('Error sanitizing markdown', error);
		return '';
	}
}
