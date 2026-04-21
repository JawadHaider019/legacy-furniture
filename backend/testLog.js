import axios from 'axios';
async function test() {
    try {
        const loginRes = await axios.post('http://localhost:4000/api/user/login', {
            email: 'testtest@example.com',
            password: 'password123'
        });
        console.log("Login:", loginRes.data);
        if (loginRes.data.success) {
            const userRes = await axios.get('http://localhost:4000/api/user/data', {
                headers: { token: loginRes.data.token }
            });
            console.log("User:", userRes.data);
        }
    } catch (e) { console.error(e.response ? e.response.data : e.message); }
}
test();
