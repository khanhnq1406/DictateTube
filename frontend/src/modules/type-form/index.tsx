import { arrow, correct, play } from "@/const";
import Image from "next/image";

const TypeForm: React.FC = () => {
  return (
    <div className="bg-bg-secondary w-full h-full rounded-3xl shadow-shadow-primary-l py-8 flex flex-col gap-8 px-10">
      <div className="flex flex-row gap-6">
        <button className="border border-btn hover:bg-bg-primary p-2 rounded-md">
          <Image src={play} alt="play-icon" width={20} height={20} />
        </button>
        <div className="flex flex-row gap-4 items-center">
          <button className="bg-bg-primary p-2 rounded-md hover:bg-slate-900">
            <Image
              src={arrow}
              alt="arrow-icon"
              width={20}
              height={20}
              className="rotate-180"
            />
          </button>
          <p>1 / 29</p>
          <button className="bg-bg-primary p-2 rounded-md hover:bg-slate-900">
            <Image src={arrow} alt="arrow-icon" width={20} height={20} />
          </button>
        </div>
      </div>

      <div className="h-1/2">
        <textarea
          placeholder="Type what you hear..."
          className="bg-bg-primary border-2 border-btn rounded-lg p-4 resize-none h-full w-full"
        />
      </div>

      <div className="flex flex-row items-center place-content-between">
        <div className="flex flex-row gap-3 items-center">
          <Image
            src={correct}
            alt="correct-icon"
            width={20}
            height={20}
            className="w-5 h-5"
          />
          <p>You are correct!</p>
        </div>
        <div className="flex flex-row gap-4">
          <button className="bg-btn hover:bg-btn-hover text-white rounded-full px-4 py-3 font-semibold w-40">
            Check
          </button>
          <button className="border border-btn hover:bg-bg-primary text-white rounded-full px-4 py-3 font-semibold w-40">
            Skip
          </button>
        </div>
      </div>

      <div>
        <p>
          But in this ******* ** * *** ** **** * ***** **** ****** *******
          ******
        </p>
      </div>

      <div>
        <div className="flex flex-row gap-2">
          <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" />
          <label for="vehicle1">Show answer immediately</label>
        </div>
        <div className="flex flex-row gap-2">
          <input type="checkbox" id="vehicle2" name="vehicle2" value="Car" />
          <label for="vehicle2">Show full answer</label>
        </div>
      </div>
    </div>
  );
};

export default TypeForm;
