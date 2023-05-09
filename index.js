import { calculateChocolates } from "./src/chocolateStore.js";
import { processCsvToOrders, chocolatesToCsv } from "./utils/fileHandler.js";

let orders = processCsvToOrders("input/orders.csv");
let chocolatesPurchasedList = [];

if (orders && orders.length > 0) {
  orders.forEach(function (order) {
    chocolatesPurchasedList.push(calculateChocolates(order));
  });
}

chocolatesToCsv(chocolatesPurchasedList, "ouput/redemptions.csv");
