




export type Environment = 'development' | 'production';

export enum EnvironmentStates {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production'
}

export interface IConfigItem {
  APIKEY: string;
  API_KEY_HEADER: string;
  PORT: number;
  TK_Key: string;
  environment: Environment;
  CONNECTION_STRING: string;
}

export default interface IConfiguration {

  settings: IConfigItem;
  // Get(): IConfigItem;
}