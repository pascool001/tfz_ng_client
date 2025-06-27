

import { Injectable } from "@angular/core";
// import { environment as env} from '../../../../environments/environment';
import { AxiosHttpClient } from "../httpClient/axios-http-client";
// import { authData, RegisterData, ResetPwdData, ResetPwdReqData } from '../../models/security';
import { AxiosInstance } from "axios";
import { Itodo, ItodoPayload } from "../../models/todo";


@Injectable({
    providedIn: "root"
})
export class TodoApi {

    api: AxiosInstance;

    constructor(private client: AxiosHttpClient) {
        this.api = this.client.Instance 
    }

    addTodo(payload: ItodoPayload) {
        return this.api.post('/todos', payload)
    }

    updateTodo(payload: Itodo, id: string) {
        return this.api.put(`/todo/${id}`, payload)
    }

    deleteTodo(id: string) {
        return this.api.delete(`/todo/${id}`)
    }

    getTodo(id:string) {
        return this.api.get(`/todo/${id}`)
    }

    getAll() {
        return this.api.get('/todos')
    }

   

}