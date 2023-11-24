import passport from "passport";
import { hashData, compareData } from "./utils.js";
import { usersManager } from "./dao/managers/UsersManager.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";

const SECRETJWT = "jwtSecret";


// LOCAL

passport.use('signup', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, email, password, done) => {
        try {
            const { first_name, last_name } = req.body;
            if (!first_name || !last_name || !email || !password) {
                return done(null, false);
            }
            const hashedPassword = await hashData(password);

            const role = (email === "adminCoder@coder.com") ? 'admin' : 'user';

            const createdUser = await usersManager.createUser({ ...req.body, password: hashedPassword, role});
            done(null, createdUser);
        } catch (error) {
            done(error);
        }
    }));

passport.use('login', new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
        try {
            if (!email || !password) {
                done(null, false);
            }

            const user = await usersManager.getUserByEmail(email);
            if (!user) {
                return done(null, false);
            }

            const isPasswordValid = await compareData(password, user.password);
            if (!isPasswordValid) {
                return done(null, false);
            }

            done(null, user)
        } catch (error) {
            done(error);
        }
    }));
    

// GITHUB

passport.use('github', new GithubStrategy(
    {
        clientID: "Iv1.26ac67e4378754c1",
        clientSecret: "31dd00de12be9d997f218b25b0995a2ca6bfbe91",
        callbackURL: "http://localhost:8080/api/sessions/callback",
    },
    async (accessToken, refreshToker, profile, done) => {
        try {
            const userDB = await usersManager.getUserByEmail(profile._json.email);

            // Login
            if (userDB) {
                if (userDB.isGithub) {
                    return done(null, userDB);
                } else {
                    return done(null, false);
                }
            }

            // Signup
            const infoUser = {
                first_name: profile._json.name.split(' ')[0],
                last_name: profile._json.name.split(' ')[1],
                email: profile._json.email,
                password: " ",
                isGithub: true
            };
            if(infoUser.email === "adminCoder@coder.com") {
                infoUser.role = 'admin';
            }
            const createdUser = await usersManager.createUser(infoUser);
            done(null, createdUser);

        } catch (error) {
            done(error)
        }
    }))

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await usersManager.getUserById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});


// JWT
const fromCookies = (req) => req.cookies.token;

passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([fromCookies]),
    secretOrKey: SECRETJWT,
}, (jwt_payload, done) => {
    done(null, jwt_payload);
}));