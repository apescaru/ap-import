import { apImport } from "./index.js";

let databaseLMAO = [];

const items = [30, 10, 20, 30, 40, 50, 60];

await apImport(
    items,
    {
      stopOnFail: false,
    },
    async (item) => {
      if (item % 3 === 0) {
        databaseLMAO.push(item);
        return true;
      } else {
        throw new Error("jimmy");
      }
    },
    async (err, _) => {
      return "custom err";
    }
);

console.log(databaseLMAO);
databaseLMAO = [];

try {
await apImport(
  items,
  {
    stopOnFail: true,
  },
  async (item) => {
    if (item % 3 === 0) {
      databaseLMAO.push(item);
      return true;
    } else {
      throw new Error();
    }
  },
  async (err, _) => {
    return "custom err";
  }
);
} catch(err) {
    // try-catch method is done so you can see that the items that din't throw an error were corectly handled
    // without the try-catch block around the function (with stopOnFail: true) the application would have stopped on the error
    console.log(databaseLMAO);
    throw new Error(err);
}


