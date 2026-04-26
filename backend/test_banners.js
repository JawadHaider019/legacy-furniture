import axios from 'axios';

const test = async () => {
    try {
        const response = await axios.get('http://localhost:4000/api/banners/active?section=1');
        console.log('Section 1 Banners:', JSON.stringify(response.data, null, 2));

        const response2 = await axios.get('http://localhost:4000/api/banners/active?section=2');
        console.log('Section 2 Banners:', JSON.stringify(response2.data, null, 2));
    } catch (e) {
        console.error('Error:', e.message);
    }
}

test();
