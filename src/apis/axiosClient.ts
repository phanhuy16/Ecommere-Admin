import axios from "axios";
import queryString from "query-string";
import { localDataNames } from "../constants/appInfo";

const baseURL = 'http://localhost:5027/api';

const getAccessToken = () => {
  const res = localStorage.getItem(localDataNames.jwt);
  return res ? JSON.parse(res).accessToken : '';
}

const getRefreshToken = () => {
  const res = localStorage.getItem(localDataNames.jwt);
  return res ? JSON.parse(res).refreshToken : '';
}

const axiosClient = axios.create({
  baseURL,
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config: any) => {
  const accesstoken = getAccessToken();

  config.headers = {
    Authorization: `Bearer ${accesstoken}`,
    Accept: 'application/json',
    ...config.headers,
  };

  return { ...config, data: config.data ?? null };
})

axiosClient.interceptors.response.use(res => {
  if (res.data && res.status >= 200 && res.status < 300) {
    return res.data;
  } else {
    return Promise.reject(res.data);
  }
}, async error => {
  const { response, config } = error;

  if (response && response.data === 401) {
    const refreshtoken = getRefreshToken();

    if (refreshtoken) {
      try {
        const refresh: any = await axios.post(`${baseURL}/Account/refresh-token`, { refreshtoken })

        const { accessToken, refreshToken: refreshToken } = refresh.data;

        localStorage.setItem(localDataNames.jwt, JSON.stringify({ accessToken, refreshToken: refreshToken }))

        config.headers['Authorization'] = `Bearer ${accessToken}`;

        return axiosClient(config)
      } catch (error) {
        console.log(error)
        localStorage.removeItem(localDataNames.jwt);
        window.location.href = '/login';
      }
    }
  }

  return Promise.reject(response.data);

});

export default axiosClient;