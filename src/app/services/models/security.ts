export interface authData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    phone_number:string;
    user_type: string
}

export interface ResetPwdReqData {
    email: string;
}


export interface ResetPwdData {
    userId: string;
    token: string;
    password: string;
}

export interface ActivationData {
    token: string;
    userId: string;
}

export enum userType {
    WEB, MOBILE
}

// enum userProfile {
//     Mobile, BackofficeAdmin, Backoffice, ServiceAdmin, Service
// }

export interface User {
	_id: string,
	email: string,
	name: string,
	phone_number: string,
	user_type: userType.WEB
    profile: string,
    myAdmin: string
}

export interface QryResult {
    status: number,
    message: string,
    data: any
}

export interface SecuStoreType {
    loading: boolean;
    authenticated: boolean;
    authResult: QryResult | undefined;
    currentUser: User;
    reqResetResult:QryResult | undefined; 
    resetResult:QryResult | undefined; 
    registeredResult: QryResult | undefined;
    activatedResult: QryResult | undefined;
}