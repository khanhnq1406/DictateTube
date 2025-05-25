import { logo } from "@/const";
import Image from "next/image";

const Header: React.FC = () => {
  return (
    <div className="flex items-center justify-center sm:place-content-between flex-wrap w-full">
      <div className="flex items-center justify-center">
        <Image src={logo} alt="logo" width={40} height={40} />
        <div className="text-2xl font-bold">DictateTube</div>
      </div>
      <div>Practice Dictation with YouTube</div>
    </div>
  );
};

export default Header;
