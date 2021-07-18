import Web3 from "web3";

export default class Web3Factory {
    public static make() {
        const options = {
            // Enable auto reconnection
            reconnect: {
                auto: true,
                delay: 5000, // ms
                maxAttempts: 5,
                onTimeout: false
            }
          };
        return new Web3(new Web3.providers.WebsocketProvider(process.env.WEB3_WS_PROVIDER, options));
    }
}
