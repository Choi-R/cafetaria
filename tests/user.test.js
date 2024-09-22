const request = require('supertest');
const bcrypt = require('bcrypt')
const app = require('../main');
const { User } = require('../src/models');

beforeAll(async () => {
    await User.sync({ force: true }); // Reset database
    const hashed = await bcrypt.hash('testpassword', 10)
    await User.create({
        username: 'testuser',
        fullname: 'Test User',
        password: hashed
    })
});
afterAll(async () => {
    await User.sync({ force: true }); // Reset database
    await app.close()
});

describe('Auth Routes', () => {
    // describe('POST /api/v1/user', () => {
    //     it('should register a new user', async () => {
    //         const response = await request(app)
    //             .post('/api/v1/user')
    //             .send({
    //                 username: 'testuser',
    //                 fullname: 'Test User',
    //                 password: 'testpassword'
    //             });

    //         expect(response.status).toBe(201);
    //     });

    //     it('should not register a user with an existing username', async () => {
    //         await request(app)
    //             .post('/api/v1/auth/register')
    //             .send({
    //                 username: 'testuser',
    //                 fullname: 'Test User',
    //                 password: 'testpassword'
    //             });

    //         const response = await request(app)
    //             .post('/api/v1/auth/register')
    //             .send({
    //                 username: 'testuser',
    //                 fullname: 'Test User 2',
    //                 password: 'testpassword'
    //             });

    //         expect(response.status).toBe(500);
    //         expect(response.body.message).toBe('Internal server error');
    //     });
    // });

    describe('POST /api/v1/user/login', () => {
        it('should login an existing user', async () => {
            const response = await request(app)
                .post('/api/v1/user/login')
                .send({
                    username: 'testuser',
                    password: 'testpassword'
                });
                console.log(response.body)
            expect(response.status).toBe(200);
            expect(response.body.status).toBe(true);
        });

        it('should not login a user with invalid credentials', async () => {
            const response = await request(app)
                .post('/api/v1/user/login')
                .send({
                    username: 'nonexistentuser',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(400);
            expect(response.body.status).toBe(false);
        });
    });
});
