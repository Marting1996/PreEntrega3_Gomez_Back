import { generateToken } from "../utils.js";
import passport from "passport"

export const loginRender = async (req, res) => {
    res.render("login", {})
}
export const registerRender = async (req, res) => {
    res.render("register", {})
}
export const login = async (req, res, next) => {
    passport.authenticate("login", async (err, user) => {
        try {
            if (err || !user) {
                return res.status(400).send("Usuario no encontrado");
            } else {
                const token = generateToken(user);

                res.cookie("secretForJWT", token, {
                    maxAge: 60 * 60 * 24 * 1000, // 24 horas
                    httpOnly: true
                });

                res.redirect("/api/current/profile");
            }
        } catch (error) {
            return next(error);
        }
    })(req, res, next); 
};

export const register = async (req, res, next) => {
    passport.authenticate("register", async (err, user) => {
        try {
            if (err || !user) {
                return res.status(400).send("Error en el registro");
            } else {
                res.redirect("/api/current/login");
            }
        } catch (error) {
            return next(error);
        }
    })(req, res, next); 
};

export const logOut = async (req, res) => {
    res.clearCookie("secretForJWT");
    res.redirect("/api/current/login");
}

export const loginGit = async (req, res, next) => {
    passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
};

export const gitCallBack = async (req, res, next) => {
    passport.authenticate("github", { failureRedirect: "/fail-github" }, (err, user) => {
        try {
            if (err || !user) {
                return res.status(400).send("Error en la autenticación de GitHub");
            } else {
                const token = generateToken(user);
                res.cookie("secretForJWT", token, {
                    maxAge: 60 * 60 * 1000, // 1 hora
                    httpOnly: true
                }).redirect("/api/current/profile");
            }
        } catch (error) {
            return next(error)
        }
    })(req, res, next);
}

export const profile = async (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        try {
            if (err || !user) {
                return res.status(401).send("Acceso no autorizado");
            }
            console.log("Authenticated user:", user);
            res.render("profile", {user: res.locals.user});
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
};


export const profileJson = async (req, res) => {
    console.log(user);
    res.send(req.user)
};


export const failGit = async (req, res) => {
    res.render("fail-login", {})
}

