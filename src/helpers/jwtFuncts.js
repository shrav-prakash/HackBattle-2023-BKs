import jwt from "jsonwebtoken";

const jwtVerifyPromisified = (token, secret) => {
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

export {jwtVerifyPromisified};