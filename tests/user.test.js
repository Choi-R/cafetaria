const request = require('supertest');
const app = require('../main');
const { User } = require('../src/models');

describe('Auth Routes', () => {
    beforeAll(async () => {
        await User.sync({ force: true }); // Reset database
    });

    describe('POST /api/v1/user', () => {
        it('should register a new user', async () => {
            const response = await request(app)
                .post('/api/v1/user')
                .send({
                    username: 'testuser',
                    fullname: 'Test User',
                    password: 'testpassword'
                });

            expect(response.status).toBe(201);
        });

        it('should not register a user with an existing username', async () => {
            await request(app)
                .post('/api/v1/auth/register')
                .send({
                    username: 'testuser',
                    fullname: 'Test User',
                    password: 'testpassword'
                });

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    username: 'testuser',
                    fullname: 'Test User 2',
                    password: 'testpassword'
                });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });
    });

    describe('POST /api/v1/auth/login', () => {
        it('should login an existing user', async () => {
            await request(app)
                .post('/api/v1/auth/register')
                .send({
                    username: 'testuser2',
                    fullname: 'Test User 2',
                    password: 'testpassword2'
                });

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    username: 'testuser2',
                    password: 'testpassword2'
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login successful');
            expect(response.body).toHaveProperty('token');
        });

        it('should not login a user with invalid credentials', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    username: 'nonexistentuser',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid credentials');
        });
    });
});
