import { Injectable } from "@angular/core";
import axios, { AxiosInstance } from 'axios';
import { environment as env} from '../../../../environments/environment';

@Injectable({
    providedIn: "root"
})
export class AxiosHttpClient {

    Instance: AxiosInstance;

    constructor() {
        this.Instance = this.getInstance()
        this.Instance.interceptors.request.use((config) =>  {
            const {url} = config
            
            if (url?.endsWith('/upload')) {
                config.headers['Content-Type'] = 'multipart/form-data';
            } else {
                config.headers['Content-Type'] = 'application/json';
            }
            config.headers['Authorization'] = this.getAccessToken();
            return config;
        }, (error) =>  {
            console.log('interceptor error: ', error)
            // Do something with request error
            return Promise.reject(error);
        });
     
        this.Instance.interceptors.response.use(function (response) {
            const {config: {url}, data} = response;
            if (url?.endsWith("/login") || url?.endsWith("/logout")) {
                if (response.status == 200) {
                    localStorage.setItem('accessToken', data.data.accessToken)
                }
            }
        
            return response;
          }, function (error) {
            // Do something with response error
            console.log('Req Error: ', error)
            return Promise.reject(error);
          });
    }

    getInstance() {
        const instance = axios.create({
            baseURL: env.base_url,
            timeout: 8000,
            headers: {
                Accept: 'application/json',
                "Content-Type": 'application/json'
            }
        });
        return instance;
    }

    getAccessToken() {
        const token = localStorage.getItem('accessToken')
        return token ? token : undefined
    }
}
