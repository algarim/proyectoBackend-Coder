import express from 'express';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import { Server } from "socket.io";
import MongoStore from "connect-mongo";
import session from "express-session";
import "./config/passport.js"
import envKeys from './config/configEnv.js';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import productsManager from './dao/managers/ProductsManager.js';
import cartsManager from './dao/managers/CartsManager.js';
import sessionsRouter from "./routes/sessions.router.js";

import { messagesModel } from './dao/models/messages.model.js';

// DB
import "./dao/configDB.js"

// SESSION
import passport from 'passport';
import cookieParser from 'cookie-parser';

const app = express();
const port = 8080;

const cartId = "65400daabe36fd3a973c8aa3";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// COOKIES
app.use(cookieParser("SecretCookie"));

// SESSION MONGO STORE
app.use(
  session({
    store: new MongoStore({
      mongoUrl: envKeys.mongo_uri,
    }),
    secret: "secretSession",
    cookie: { maxAge: 600000 },
  })
);

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

// HANDLEBARS
app.engine("handlebars", handlebars.engine());
app.set("view engine", 'handlebars');
app.set("views", __dirname + "/views");

// ROUTES
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);

// WEBSOCKET SERVER
const httpServer = app.listen(port, () => {
    console.log("Server is listening on port " + port)
});

const socketServer = new Server(httpServer);

socketServer.on('connection', socket => {
    console.log(`Client connected with id ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
    });

    // PRODUCTS
    socket.on('addProduct', async (newProduct) => {
        try {
            const product = await productsManager.addProduct(newProduct);

            socketServer.emit('productAdded', product);
        } catch (error) {
            throw new Error(error.message);
        }
    })

    socket.on('deleteProduct', async (id) => {
        try {
            await productsManager.deleteProduct(id);

            socketServer.emit('productDeleted', id);
        } catch (error) {
            throw new Error(error.message);
        }
    });

    socket.on('addProductToCart', async (newProductId) => {
        try {
            await cartsManager.addProductToCart(newProductId, cartId);
        } catch (error) {
            throw new Error(error.message);
        }
    })



    // CHAT
    socket.on("newUser", async (user) => {
        try {
            const messages = await messagesModel.find().lean();
    
            socket.broadcast.emit("userConnected", user);
            socket.emit("connected", messages);
            
        } catch (error) {
            throw new Error(error.message);
        }
    });
    socket.on("message", async (infoMessage) => {
        try {
            await messagesModel.create(infoMessage);
            socketServer.emit("chat", infoMessage);
        } catch (error) {
            throw new Error(error.message);
        }
    });
});