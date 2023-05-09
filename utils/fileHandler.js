import fs from "fs";
import path from "path";
import Order from "../models/Order.js";

function processCsvToOrders(filePath) {
  let orders = [];

  const data = fs.readFileSync(filePath, "utf-8");

  const rows = data.split("\n").slice(1); // skip header row
  rows.forEach((row) => {
    const [cash, price, wrappersNeeded, type] = row.trim().split(",");
    const order = new Order(
      Number(cash),
      Number(price),
      Number(wrappersNeeded),
      type.replace(/"/g, "")
    );
    orders.push(order);
  });

  return orders;
}

function chocolatesToCsv(chocolates, filePath) {
  let csvString = "";

  chocolates.forEach((chocolate) => {
    const {
      milkChocolates,
      darkChocolates,
      whiteChocolates,
      sugarFreeChocolates,
    } = chocolate;
    const line = `milk ${milkChocolates}, dark ${darkChocolates}, white ${whiteChocolates}, sugar free ${sugarFreeChocolates}\n`;
    csvString += line;
  });

  const directory = path.dirname(filePath);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  fs.writeFileSync(filePath, csvString);
}

export { processCsvToOrders, chocolatesToCsv };
