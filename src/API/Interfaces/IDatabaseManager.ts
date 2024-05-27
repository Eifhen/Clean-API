


export interface IDatabaseManager {

  Connect(retryInterval: number): Promise<void>;
}