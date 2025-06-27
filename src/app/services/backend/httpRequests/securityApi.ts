import { Injectable } from "@angular/core";
import { environment as env} from '../../../../environments/environment';
import { AxiosHttpClient } from "../httpClient/axios-http-client";
import { ActivationData, authData, RegisterData, ResetPwdData, ResetPwdReqData } from '../../models/security';
import { AxiosInstance } from "axios";

@Injectable({
    providedIn: "root"
})
export class SecurityApi {

    api: AxiosInstance;

    constructor(private client: AxiosHttpClient) {
        this.api = client.Instance 
    }
    
    login(payload: authData) {
        return this.api.post(env.secu_paths.login, payload)
    }

    register(payload: RegisterData) {
        return this.api.post(env.secu_paths.register, payload)
    }

    activate(payload: ActivationData) {
        return this.api.post(env.secu_paths.activate, payload)
    }

    pwdForgotten(payload: ResetPwdReqData) {
        return this.api.post(env.secu_paths.resetPwdReq, payload)
    }

    resetpassword(payload: ResetPwdData) {
        return this.api.post(env.secu_paths.resetPwd, payload)
    }

    logout() {
        this.api.defaults.headers.common['Authorization'] = this.client.getAccessToken()
        return this.api.post(env.secu_paths.logout)
    }

    getMe() {
        return this.api.get(env.secu_paths.getMe)
    }

}