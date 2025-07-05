// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, view, initialize } from "near-sdk-js";

type DataType = {
  id: string;
  username: string;
  totalPoint: number;
};
@NearBindgen({})
class HelloNear {
  static schema = {
    data: {
      id: "string",
      username: "string",
      totalPoint: 0,
    },
  };

  data: [DataType] = [
    {
      id: "0",
      username: "Initialize user",
      totalPoint: 0,
    },
  ];

  @view({})
  get_score(): [DataType] {
    return this.data;
  }

  @view({})
  get_score_by_id(id: string): DataType {
    const data = this.data.find((data) => data.id === id);
    return data;
  }

  @call({})
  set_score({ id, username, totalPoint }: DataType): void {
    near.log(`Saving user ${username} with totalPoint ${totalPoint}`);
    const index = this.data.findIndex((data) => data.id === id);
    if (index !== -1) {
      this.data[index].totalPoint = totalPoint;
    } else {
      this.data.push({ id: id, username: username, totalPoint: totalPoint });
    }
  }
}
