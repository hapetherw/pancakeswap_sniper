import LoadConfig from "./Services/LoadConfig";
import WatchNewPairs from "./Services/WatchNewPairs";
import ProfitLossManager from "./Services/ProfitLossManager";
import Web3Factory from "./Services/Web3Factory";
import Web3Helper from "./Services/Web3Helper";
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as express from 'express';
import * as socketio from "socket.io";
import { Request, Response } from 'express';

const { PORT = 3000 } = process.env;
new LoadConfig();
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server).listen(2053);
app.use(cors());

// parse body params and attache them to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'hello world',
  });
});

io.on('connection', (socket: socketio.Socket) => {
    socket.on('my other event', (data) => {
      console.log('I got data. will running another function', data.count);
    });
  });
const apiRouter = express.Router();
app.use("/api", apiRouter);

server.listen(PORT, () => console.log('server started at http://localhost:'+PORT));

// (async () => {
//     const web3 = Web3Factory.make();
//     const web3Helper = new Web3Helper(web3);
//     await web3Helper.init();

//     new WatchNewPairs(web3, web3Helper);
//     new ProfitLossManager(web3Helper);
// })();
