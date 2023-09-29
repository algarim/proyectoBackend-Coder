import express from 'express';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import { Server } from "socket.io";

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import productManager from './ProductManager.js';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// HANDLEBARS
app.engine("handlebars", handlebars.engine());
app.set("view engine", 'handlebars');
app.set("views", __dirname + "/views");

// ROUTES
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use("/api/views", viewsRouter);

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

    socket.on('addProduct', async (newProduct) => {
        try {
            const product = await productManager.addProduct(newProduct);

            socketServer.emit('productAdded', product);
        } catch (error) {
            throw new Error(error.message);
        }
    })


    socket.on('deleteProduct', async (id) => {
        try {
            await productManager.deleteProduct(+id);

            socketServer.emit('productDeleted', id);
        } catch (error) {
            throw new Error(error.message);
        }
    })
});