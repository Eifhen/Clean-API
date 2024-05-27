import cors from 'cors';



export default function CorsConfiguration(){
  return cors({
    origin: "*",
    methods: 'GET,PUT,POST,DELETE',
    credentials: true,
  });
}





