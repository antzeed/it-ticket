import Cookies from 'js-cookie';

const TOKEN_KEY = 'it_ticket_token';

export const setToken = (token: string) => {
    Cookies.set(TOKEN_KEY, token, { expires: 1 }); // 1 day
};

export const getToken = () => {
    return Cookies.get(TOKEN_KEY);
};

export const clearToken = () => {
    Cookies.remove(TOKEN_KEY);
};

export const isAuthenticated = () => {
    return !!getToken();
};
