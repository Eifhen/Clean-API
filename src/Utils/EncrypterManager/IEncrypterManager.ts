






export default interface IEncrypterManager {

  Encrypt(password:string): Promise<string>;
  ComparePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean>;

}