import axios from 'axios';

async function runTest() {
    try {
        // 1. First register a user
        const regRes = await axios.post('http://localhost:4000/api/user/register', {
            name: 'Test User',
            email: 'testtest@example.com',
            password: 'password123'
        });

        // 2. Or login if already exists
        let token = regRes.data.token;
        if (!token) {
            const loginRes = await axios.post('http://localhost:4000/api/user/login', {
                email: 'testtest@example.com',
                password: 'password123'
            });
            token = loginRes.data.token;
        }

        // 3. Get user details
        const userRes = await axios.get('http://localhost:4000/api/user/data', {
            headers: { token }
        });
        const user = userRes.data.user;

        console.log('User:', user);

        // 4. Try adding a comment
        const FormData = (await import('form-data')).default;
        const form = new FormData();
        form.append('targetType', 'product');
        form.append('productId', '5f8d0d55b54764421b7156g1'); // dummy or random
        form.append('userId', user._id);
        form.append('content', 'Testing review');
        form.append('rating', 5);

        const comRes = await axios.post('http://localhost:4000/api/comments', form, {
            headers: form.getHeaders()
        });
        console.log('Review:', comRes.data);

    } catch (err) {
        if (err.response) {
            console.error('Error:', err.response.data);
        } else {
            console.error(err.message);
        }
    }
}

runTest();
