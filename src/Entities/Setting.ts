import { BuildOptions, Model } from "sequelize";
export interface SettingAttributes {
    id?: number;
    baseCurrency: string;
    profitPercentage: string;
    buyAmount: string;
    buyStep: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface SettingModel extends Model<SettingAttributes>, SettingAttributes {}
export class Setting extends Model<SettingModel, SettingAttributes> {}
export type SettingStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): SettingModel;
};