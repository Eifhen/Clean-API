import IConfiguration, { Environment, EnvironmentStates, IConfigItem } from "../Interfaces/IConfigurations";
const dotenv = require("dotenv");
const path = require('path');


interface ConfigurationDependencys {
  env: Environment;
}

export default class Configuration implements IConfiguration {

  private readonly environment: Environment;
  public readonly settings: IConfigItem;

  constructor (deps: ConfigurationDependencys) {
    this.environment = deps.env;
    this.settings = this.Get();
  }

  private Get() : IConfigItem {
    const envPath = path.resolve(__dirname, '../../..'); 
    if (this.environment === EnvironmentStates.PRODUCTION) {
      dotenv.config({ path: path.resolve(envPath, '.env.production') });
    } else {
      dotenv.config({ path: path.resolve(envPath, '.env.development') });
    }

    return {
      environment: this.environment,
      PORT: Number(process.env.PORT ?? 0),
      TK_Key: process.env.TK_Key ?? '',
      APIKEY: process.env.API_KEY ?? '',
      API_KEY_HEADER: process.env.API_KEY_HEADER ?? '',
      CONNECTION_STRING: process.env.CONNECTION_STRING ?? ''
    }
  }

}