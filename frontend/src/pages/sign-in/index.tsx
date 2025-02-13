import Login from "@/components/login-form/login-form";
import { Box } from "@mui/material";


const Index = () => {
  // const {data} = trpc.userdata.getUserData.useQuery({email:"varsanyi@gmail.com"})
  return (
    <div className="flex h-screen columns-1">
      <div className="flex-1 bg-blue-800"></div>
      <div className = "flex-1 bg-gray-200">
        <Login />
      </div>
        
    </div>
  );
}

export default Index;