import Logger from "./Logger";
import BscScan from "./BscScan";
import {Symbols} from "../Models/Symbols";
import {Position, Setting} from "../Entities";
import Web3Helper from "./Web3Helper";
import {toWei} from "web3-utils";
import Reserve from "../Models/Reserve";
import BigNumber from "bignumber.js";

export default class Ape {
    private logger: Logger = new Logger('Ape');
    private defaultBuyIn = toWei(process.env.BUY_IN_AMOUNT);

    constructor(
        private web3Helper: Web3Helper,
        private pair: string,
        private token0: string,
        private token1: string,
        private initialReserve: Reserve,
    ) {
    }

    public in() {
        const bscScan = new BscScan();
        bscScan.isGoodToken(this.getOtherSideToken())
            .then(() => {
                this.buy();
            })
            .catch(() => {
                // do nothing
            });
    }

    public buy() {
        // check if we haven't already bought this pair
        Position.findOne({
            where: {
                pair: this.pair,
            },
        }).then(async (result) => {
            if (result !== null) {
                return;
            }

            Position.build({
                pair: this.pair,
                token0: this.token0,
                token1: this.token1,
                profitLossCheckedAt: new Date(),
                reserveEnter: this.getReserveAmount(this.initialReserve).toFixed(),
            }).save();

            this.logger.log(`Apeing into ${this.pair}`);

            const mysetting = await Setting.findOne({
                where: {
                    id: 1,
                }
            });
            if (!mysetting) {
                this.logger.error('Setting not found');
                return;
            }

            if ((!mysetting.isLocked && mysetting.currentStep >= mysetting.buyStep) || mysetting.isLocked) {
                this.logger.error('Step limit!');
                return;
            }

            this.web3Helper.swapExactETHForTokens(this.getOtherSideToken(), this.defaultBuyIn)
                .then(async (received) => {
                    const position = await Position.findOne({
                        where: {
                            pair: this.pair,
                        }
                    });
                    if (!position) {
                        this.logger.error(`Position not found in DB for ${this.pair}`);
                        return;
                    }


                    await position.update({
                        spent: this.defaultBuyIn,
                        gotToken: received.toFixed(),
                        tokenRemaining: received.toFixed(),
                        openedAt: new Date(),
                    });

                    await mysetting.update({
                        currentStep: mysetting.currentStep + 1,
                        isLocked: mysetting.currentStep + 1 >= mysetting.buyStep ? true : false
                    });

                    this.logger.log(`Position opened for ${this.pair}`);
                })
                .catch(async (error) => {
                    const position = await Position.findOne({
                        where: {
                            pair: this.pair,
                        }
                    });
                    if (!position) {
                        this.logger.error(`Position not found in DB for ${this.pair}`);
                        return;
                    }

                    await position.update({
                        closedAt: new Date(),
                        closeReason: 'open-error',
                    });

                    this.logger.log(`Failed to open position for ${this.pair}, marking as closed`);
                });
        });
    }

    private getReserveAmount(reserve: Reserve): BigNumber {
        return this.token0 === Symbols.wbnb ? reserve.reserve0 : reserve.reserve1;
    }

    private getOtherSideToken() {
        return this.token0 === Symbols.wbnb ? this.token1 : this.token0;
    }
}