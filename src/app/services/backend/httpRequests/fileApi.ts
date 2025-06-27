

import { Injectable } from "@angular/core";
import { AxiosHttpClient } from "../httpClient/axios-http-client";
import { AxiosInstance } from "axios";


@Injectable({
    providedIn: "root"
})
export class FileApi {

    api: AxiosInstance;

    constructor(private client: AxiosHttpClient) {
        this.api = this.client.Instance
    }

    uploadFile(payload: FormData) {
        return this.api.post('/media/upload', payload)
    }

    downloadFile(id: string) {
        return this.api.get(`/media/download/${id}`)
    }

}
