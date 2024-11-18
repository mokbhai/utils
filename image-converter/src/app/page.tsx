// pages/index.tsx
import Link from "next/link";
import ConvertPage from "./pages/convert";

const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Image Converter App</h1>
      <ConvertPage />
    </div>
  );
};

export default Home;
