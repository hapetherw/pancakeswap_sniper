import {DataTypes, Sequelize} from "sequelize";
import { SettingStatic } from "./Setting";

export function SettingFactory(sequelize: Sequelize): SettingStatic
{
    return <SettingStatic>sequelize.define("Settings", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        baseCurrency: {
            type: DataTypes.STRING,
        },
        profitPercentage: {
            type: DataTypes.DECIMAL(128,0),
            defaultValue: 100,
        },
        buyAmount: {
            type: DataTypes.DECIMAL(128,0),
            defaultValue: 0.02,
        },
        buyStep: {
            type: DataTypes.INTEGER,
            defaultValue: 10,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    });
}