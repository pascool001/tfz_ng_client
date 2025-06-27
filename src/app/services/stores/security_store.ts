import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import { QryResult, User, userType } from "../models/security";
import { inject } from "@angular/core";
import { SecurityApi } from "../backend/httpRequests/securityApi";
import { authData, RegisterData, ActivationData, ResetPwdData, ResetPwdReqData } from "../models/security";
import { LocalStorageService } from "../../utilities/local-storage.service";

const initialStoreState: StoreType = {
    loading: false,
    authenticated: false,
    authResult: null,
    currentUser: {_id: '', email: '',  name: '',  phone_number: '', user_type: userType.WEB , profile: '', myAdmin: ''},
    reqResetResult:null,
    resetResult: null,
    registeredResult: null,
    activatedResult: {status: 0, message: "", data: null },
};

export interface StoreType {
    loading: boolean;
    authenticated: boolean;
    authResult: QryResult | null;
    currentUser: User;
    reqResetResult:QryResult | null;
    resetResult:QryResult | null;
    registeredResult: QryResult | null;
    activatedResult: QryResult;
}


export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState(initialStoreState),

    withMethods((store, authApi = inject(SecurityApi)) => ({

        async customPatch(data: {}): Promise<void> {
            patchState(store, {...data});
        },

        async login(data:authData): Promise<void> {
            patchState(store, {loading: true });
            authApi.login(data).then(async authResp => {
                const me = await authApi.getMe()
                patchState(store, {loading: false, authenticated: true, authResult: authResp.data, currentUser: me.data});
            }).catch(Error => {
                patchState(store, {loading: false, authenticated: false, authResult: Error.response.data });
            })
        },

        async logout(): Promise<void> {
            patchState(store, {loading: true });
            const logoutData = await authApi.logout();
            if (logoutData.status == 200) {
                patchState(store, {authenticated: false, loading:false, authResult: null, currentUser: initialStoreState.currentUser})
            } else {
                patchState(store, {loading: false });
            }
        },

        async register(data:RegisterData): Promise<void> {
            patchState(store, {loading: true });
            authApi.register(data).then(resp => {
                patchState(store, {loading: false, registeredResult:  resp.data});
            }).catch(err => {
                patchState(store, {loading: false, registeredResult:  err.response.data});
            })
        },

        async activate(tokenAndUserId:ActivationData): Promise<void> {
            patchState(store, {loading: true });

            authApi.activate(tokenAndUserId).then(resp => {
                patchState(store, {loading: false, activatedResult:  resp.data});
            }).catch(err => {
                patchState(store, {loading: false, activatedResult:  err.response.data});
            })
        },

        async resetPassword(data:ResetPwdData): Promise<void> {
            patchState(store, {loading: true });
            authApi.resetpassword(data).then(resp => {
                patchState(store, {loading: false, resetResult:  resp.data});

            }).catch(err => {
                patchState(store, {loading: false, resetResult:  err.response.data});
            })
        },

        async pwdForgotten(data:ResetPwdReqData): Promise<void> {
            patchState(store, {loading: true });
            authApi.pwdForgotten(data).then(resp => {
                console.log("reqResetResult  resonse: ",resp.data)
                patchState(store, {loading: false, reqResetResult:  resp.data});
            }).catch(err => {
                patchState(store, {loading: false, reqResetResult:  err.response.data});
            })
        },


    })),

    withHooks((store) => {
        const _storageService = inject(LocalStorageService)
        return {
                onInit() {
                    const localStore = _storageService.getItem<StoreType>('authStore');
                    if (localStore) {
                        patchState(store, localStore)
                    }
                },
                onDestroy() {
                    console.log('Store onDestroy ...')
                    patchState(store, initialStoreState)
                },
        }
    })
  );


