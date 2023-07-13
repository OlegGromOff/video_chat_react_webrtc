const app = require("express")(); // express app for server side logic  
const server = require("http").createServer(app); // http server	
const cors = require("cors"); // cors for cross origin resource sharing

const io = require("socket.io")(server, { // socket.io for real time communication
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

app.use(cors()); // use cors for cross origin resource sharing 

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Running');
});

io.on("connection", (socket) => { 
	socket.emit("me", socket.id); // socket.emit - it is command to send message to specific user  

	socket.on("disconnect", () => { // socket.on - it is command to receive message from specific user
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name }); // io.to - it is command to send message to specific user		
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
