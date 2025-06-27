import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class SSE_EventSource {
    getEventSource(url:string): EventSource {
        return new EventSource(url)
    }
}