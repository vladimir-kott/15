import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import axios from "axios";
import userService from "../services/user.service";
import { setTokens } from "../services/localStorage.service";

const httpLogIn = axios.create();
const LogInContext = React.createContext();

export const useLogIn = () => {
    return useContext(LogInContext);
};

const LogInProvider = ({ children }) => {
    console.log("here")
    const [currentUser, setUser] = useState({});
    const [error, setError] = useState(null);

    async function signIn({ email, password, ...rest }) {
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_KEY}`;
        
        try {
            const { data } = await httpLogIn.post(url, 
            {
                email,
                password,
                returnSecureToken: true
            });
            setTokens(data);
            await createUser({ _id: data.localId, email, ...rest });
        } catch (error) {
            errorCatcher(error);
            const { code, message } = error.response.data.error;
            console.log(code, message);
            /*if (code === 400) {
                if (message === "EMAIL_EXISTS") {
                    const errorObject = {
                        email: "Пользователь с таким Email уже существует"
                    };
                    throw errorObject;
                }
            }*/
            // throw new Error
        }
    }
    async function createUser(data) {
        try {
            const { content } = userService.create(data);
            setUser(content);
        } catch (error) {
            errorCatcher(error);
        }
    }
    function errorCatcher(error) {
        const { message } = error.response.data;
        setError(message);
    }
    useEffect(() => {
        if (error !== null) {
            toast(error);
            setError(null);
        }
    }, [error]);
    return (
        <LogInContext.Provider value={{ signIn, currentUser }}>
            {children}
        </LogInContext.Provider>
    );
};

LogInProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default LogInProvider;
