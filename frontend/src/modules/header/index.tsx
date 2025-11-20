import { logo } from "@/const";
import Image from "next/image";
import Link from "next/link";
// import { Level } from "../level";

const Header: React.FC = () => {
  return (
    <div className="flex items-start justify-center sm:place-content-between flex-wrap w-full px-10">
      <div className="flex items-center justify-center">
        <Link href="/" className="flex items-center justify-center hover:opacity-80 transition-opacity">
          <Image src={logo} alt="logo" width={40} height={40} />
          <div className="ml-1 mobile:justify-center mobile:flex mobile:flex-col">
            <div className="text-xl font-bold">DictateTube</div>
            <div className="text-sm">Practice Dictation with YouTube</div>
          </div>
        </Link>
      </div>
      <nav className="flex gap-6 items-center">
        <Link
          href="/dictation"
          className="text-sm font-medium hover:text-blue-600 transition-colors mobile:text-xs"
        >
          Dictation
        </Link>
        <Link
          href="/shadowing"
          className="text-sm font-medium hover:text-blue-600 transition-colors mobile:text-xs"
        >
          Shadowing
        </Link>
      </nav>
      {/* <Level /> */}
    </div>
  );
};

export default Header;
