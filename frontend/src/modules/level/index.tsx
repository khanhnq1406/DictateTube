const Level: React.FC = () => {
  return (
    <div className="p-0.5 bg-gradient-to-r from-btn to-blue-600 rounded-lg">
      <div className=" bg-bg-secondary rounded-[calc(0.5rem-2px)]">
        <div className="pb-0.5 bg-gradient-to-r from-btn to-blue-600">
          <div className="bg-bg-primary w-full p-4 rounded-t-[calc(0.5rem-2px)]">
            <div className="flex items-center justify-between">
              <div className="flex gap-0.5 items-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/8037/8037137.png"
                  alt="rank-icon"
                  width={20}
                  height={20}
                />
                <div className="font-bold">Username</div>
              </div>
              <div>#10</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col p-4 gap-4 w-72">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg">Lvl 12</span>
            <span className="ml-auto text-text-secondary">
              3,450 / 5,000 XP
            </span>
          </div>
          <div className="relative h-3 bg-gray-200 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
              style={{ width: "30%" }}
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="text-text-secondary">Total points</div>
            <div className="text-xl font-bold">3,200</div>
          </div>
          <div className="flex justify-center w-full">
            <button className="border-2 border-btn rounded-full px-4 py-2 hover:bg-bg-primary">
              Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Level };
