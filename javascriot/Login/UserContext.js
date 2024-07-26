import React, { createContext, useState } from 'react';

const UserContext = createContext({ isAuthenticated: false, token: "", email: "" });

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : {
            isAuthenticated: false,
            token: "",
            email: ""
        };
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser({
            isAuthenticated: false,
            token: "",
            email: ""
        });
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
