// {
//     auth {
//         token:null,
//         user:null,
//         isLoading: false
//         appInitialized:false
//     }
// }

import { combineReducers } from "redux";
import api, { addAuth } from '../utils/api'
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchUser = () => {
    return dispatch => {
        dispatch({ type: "FETCH_USER" })

        AsyncStorage.getItem("userToken").then(token => {
            console.log(JSON.parse(token));

            if (token) {
                token = JSON.parse(token);
                addAuth(token);

                api
                    .get('users/me')
                    .then(response => {
                        const user = response.data

                        if (token) dispatch({ type: "SET_AUTH_TOKEN", payload: token })

                        if (user && user.id) {
                            api.get(`profiles/?user=${user.id}`)
                                .then(response => {
                                    const profile = response.data

                                    if (profile) {
                                        user.profile = profile
                                        dispatch({ type: "SET_AUTH_USER", payload: user })
                                    }
                                })
                                .finally(() => {
                                    dispatch({ type: "APP_INITIALIZED" })
                                })
                        }
                    })

            } else {
                return dispatch({ type: "APP_INITIALIZED" })
            }
        });
    }
}

export const doLogin = (identifier, password) => {

    return dispatch => {
        dispatch({ type: "DOING_LOGIN" })

        return api
            .post('/auth/local', { identifier, password })
            .then(response => {
                const result = response.data;

                if (result && result.jwt) {
                    addAuth(result.jwt);

                    //Set storage token
                    AsyncStorage.setItem(
                        'userToken',
                        JSON.stringify(result.jwt)
                    ).then(response => dispatch({ type: "SET_AUTH_TOKEN", payload: result.jwt }));

                }

                if (result && result.user && result.user.id) {
                    api.get(`profiles/?user=${result.user.id}`)
                        .then(response => {
                            const profile = response.data

                            if (profile) {
                                result.user.profile = profile
                                dispatch({ type: "SET_AUTH_USER", payload: result.user })
                                console.log('profile');
                            }
                        })
                        .finally(() => {
                            dispatch({ type: "APP_INITIALIZED" })
                        })
                }
            })
            .catch(error => {
                dispatch({ type: "LOGIN_FAILED" })

                if (Array.isArray(error.response.data.message)) {
                    throw error.response.data.message[0].messages[0]
                }

                throw ({ message: "Login failed, retry" });
            })
    }
}

export const doRegister = (body) => {
    return dispatch => {
        dispatch({ type: "DOING_REGISTER" })

        return api
            .post('/auth/local/register', body)
            .then(response => {
                dispatch({ type: "REGISTER_SUCCESS" })
                return toast.success("Successfully registered");
            })
            .catch(error => {
                dispatch({ type: "REGISTER_FAILED" })

                if (Array.isArray(error.response.data.message)) {
                    throw error.response.data.message[0].messages[0]
                }

                throw ({ message: "Register failed, retry" });
            })
    }
}

const token = (state = null, action) => {
    switch (action.type) {
        case "SET_AUTH_TOKEN":
            return action.payload;
        case "CLEAR_AUTH_TOKEN":
            return null;
        default:
            return state;
    }
}

const user = (state = null, action) => {
    switch (action.type) {
        case "SET_AUTH_USER":
            return action.payload;
        case "CLEAR_AUTH_USER":
            return null;
        default:
            return state;
    }
}

const isLoading = (state = null, action) => {
    switch (action.type) {
        case "DOING_LOGIN":
            return true;
        case "DOING_REGISTER":
            return true;
        case "FETCH_STORAGE":
            return true;
        case "FETCH_USER":
            return true;
        case "LOGIN_FAILED":
        case "REGISTER_FAILED":
        case "REGISTER_SUCCESS":
        case "SET_AUTH_USER":
        case "SET_AUTH_TOKEN":
        case "SET_STORAGE":
        case "APP_INITIALIZED":
            return false;
        default:
            return state;
    }
};

const appInitialized = (state = false, action) => {
    switch (action.type) {
        case "FETCH_USER":
            return state;
        case "APP_INITIALIZED":
            return true;
        default:
            return state;
    }
};


const authReducer = combineReducers({
    token,
    user,
    isLoading,
    appInitialized
});

export default authReducer;
