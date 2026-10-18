import { Server } from "socket.io"
import { verifyToken } from "../utils/jwt.js"

export default function (httpServer) {
    const io = new Server(httpServer)

    io.on("connection", (socket) => {
        console.log("user connected", socket.id)

        io.use((socket,next) => {
            const token = socket.handshake.headers?.authorization?.split(" ")[1];

            if(!token){
                return next(new Error("authentication error"));

            }

            try {
                const decode = verifyToken(token,"access")
                socket.user = decode;
                next();
            } catch (error) {
                return next(new Error("Authentication error"));
            }
        })

        socket.on("message",(msg) => {
            console.log(msg)
            io.emit("hellow from server")
        })

        io.on("connection", (socket) => {
            socket.on("message", (msg) => {
                socket.broadcast.emit("message", {...msg, email: socket.user.email})
            })
        })
    })
}


// import { Server } from "socket.io";
// import { verifyToken } from "../utils/jwt.js";


// export default function (httpServer) {
//     const io = new Server(httpServer);


//     io.use((socket, next) => {
//         const token = socket.handshake.headers?.authorization?.split(" ")[ 1 ];

//         if (!token) {
//             return next(new Error("Authentication error"));
//         }

//         try {

//             const decoded = verifyToken(token, "access");

//             socket.user = decoded;
//             next()
//         } catch (err) {
//             return next(new Error("Authentication error"));
//         }

//     })

//     io.on('connection', (socket) => {
//         socket.on("message", (msg) => {

//             socket.broadcast.emit("message", { ...msg, email: socket.user.email })
//         })
//     })
// } 