const request = require('supertest');
const app = require('../main');

describe('Rate Limiter Middleware', () => {
    it('should allow up to maxRequests within the time window', async () => {
        for (let i = 0; i < 20; i++) {
            const response = await request(app).get('/api/v1/cafe');
            expect(response.status).not.toBe(429);
        }
    });

    it('should block requests exceeding maxRequests within the time window', async () => {
        for (let i = 0; i < 20; i++) {
            await request(app).get('/api/v1/cafe');
        }
        const response = await request(app).get('/api/v1/cafe');
        expect(response.status).toBe(429);
        expect(response.text).toBe('Too many requests, please try again later.');
    });
});
