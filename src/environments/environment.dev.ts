export const environment = {
    production: false,
    base_url: 'http://localhost:8080/api/v1',
    secu_paths: {
        login: '/auth/login',
        register: '/auth/register',
        activate: '/auth/activate',
        logout: '/auth/logout',
        resetPwdReq: '/auth/resetPwdReq',
        resetPwd: '/auth/resetPwd',
        getMe: '/auth/getMe',
    }
};
