import { logo } from "@/const";
import Image from "next/image";
// import { Level } from "../level";

const Header: React.FC = () => {
  return (
    <div className="flex items-start justify-center sm:place-content-between flex-wrap w-full px-10">
      <div className="flex items-center justify-center">
        <Image src={logo} alt="logo" width={40} height={40} />
        <div className="ml-1">
          <div className="text-xl font-bold">DictateTube</div>
          <div className="text-sm">Practice Dictation with YouTube</div>
        </div>
      </div>
      {/* <Level /> */}
    </div>
  );
};

export default Header;
