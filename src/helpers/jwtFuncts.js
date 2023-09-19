import jwt from "jsonwebtoken";

export const jwtVerifyPromisified = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, {}, (err, payload) => {
            if (err)
            {
                reject(err);
            }
            else
            {
                resolve(payload);
            }
        });
    });
};