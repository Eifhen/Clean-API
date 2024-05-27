import SignUpDTO from "./SignUpDTO";




export default interface ISignUpServiceDTO {
  signUpData: SignUpDTO;
  ip_address?: string;
}
