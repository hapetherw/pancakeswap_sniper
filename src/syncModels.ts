import {Position, Setting} from "./Entities";
import LoadConfig from "./Services/LoadConfig";

new LoadConfig();

(async () => {
    await Position.sync({alter: true});
    await Setting.sync({alter: true});

    console.log('Done');
})();
