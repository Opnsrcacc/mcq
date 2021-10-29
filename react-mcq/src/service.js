import axios from 'axios';
let NODEURL = 'http://localhost:8000';

const request = async (url, method, data) => {
    let AUTH = localStorage.getItem('userAuthToken');
    if (AUTH) {
        axios.defaults.headers['authorization'] = AUTH;
    }
    return await axios[String(method).toLowerCase()](NODEURL + url, data);
};
export default request;