import Chocolates from "../models/Chocolates.js";
import Promotion from "../models/Promotion.js";

const promotionRules = new Promotion({
  milk: { milk: 1, sugarFree: 1 },
  white: { white: 1, sugarFree: 1 },
  sugarFree: { sugarFree: 1, dark: 1 },
  dark: { dark: 1 },
});

function calculateChocolates(order) {
  let { cash, price, wrappersNeeded, type } = order;
  let numChocolateBoughtWithCash = price > 0 ? Math.floor(cash / price) : 0;

  let chocolatesBoughtWithCash = new Chocolates(
    type === "milk" ? numChocolateBoughtWithCash : 0,
    type === "dark" ? numChocolateBoughtWithCash : 0,
    type === "white" ? numChocolateBoughtWithCash : 0,
    type === "sugar free" ? numChocolateBoughtWithCash : 0
  );

  //Handling invalid orders and avoiding infinite loops
  if (numChocolateBoughtWithCash === 0 || wrappersNeeded < 2) {
    return chocolatesBoughtWithCash;
  }

  let totalChocolates = redeemComplimentaryChocolates(
    chocolatesBoughtWithCash,
    wrappersNeeded
  );

  return totalChocolates;
}

function redeemComplimentaryChocolates(chocolates, wrappersNeeded) {
  let milkWrappers = chocolates.milkChocolates;
  let darkWrappers = chocolates.darkChocolates;
  let whiteWrappers = chocolates.whiteChocolates;
  let sugarFreeWrappers = chocolates.sugarFreeChocolates;

  while (
    milkWrappers >= wrappersNeeded ||
    darkWrappers >= wrappersNeeded ||
    whiteWrappers >= wrappersNeeded ||
    sugarFreeWrappers >= wrappersNeeded
  ) {
    let complimentaryChocolates;
    let chocolatesRedeemed;

    if (milkWrappers >= wrappersNeeded) {
      chocolatesRedeemed = Math.floor(milkWrappers / wrappersNeeded);
      milkWrappers -= chocolatesRedeemed * wrappersNeeded;

      complimentaryChocolates = promotionRules.getRule("milk");
    } else if (darkWrappers >= wrappersNeeded) {
      chocolatesRedeemed = Math.floor(darkWrappers / wrappersNeeded);
      darkWrappers -= chocolatesRedeemed * wrappersNeeded;

      complimentaryChocolates = promotionRules.getRule("dark");
    } else if (whiteWrappers >= wrappersNeeded) {
      chocolatesRedeemed = Math.floor(whiteWrappers / wrappersNeeded);
      whiteWrappers -= chocolatesRedeemed * wrappersNeeded;

      complimentaryChocolates = promotionRules.getRule("white");
    } else {
      chocolatesRedeemed = Math.floor(sugarFreeWrappers / wrappersNeeded);
      sugarFreeWrappers -= chocolatesRedeemed * wrappersNeeded;

      complimentaryChocolates = promotionRules.getRule("sugarFree");
    }

    let complimentaryMilkChocolates = complimentaryChocolates.milk
      ? chocolatesRedeemed * complimentaryChocolates.milk
      : 0;
    let complimentaryDarkChocolates = complimentaryChocolates.dark
      ? chocolatesRedeemed * complimentaryChocolates.dark
      : 0;
    let complimentaryWhiteChocolates = complimentaryChocolates.white
      ? chocolatesRedeemed * complimentaryChocolates.white
      : 0;
    let complimentarySugerFreeChocolates = complimentaryChocolates.sugarFree
      ? chocolatesRedeemed * complimentaryChocolates.sugarFree
      : 0;

    chocolates.milkChocolates += complimentaryMilkChocolates;
    chocolates.darkChocolates += complimentaryDarkChocolates;
    chocolates.whiteChocolates += complimentaryWhiteChocolates;
    chocolates.sugarFreeChocolates += complimentarySugerFreeChocolates;

    milkWrappers += complimentaryMilkChocolates;
    darkWrappers += complimentaryDarkChocolates;
    whiteWrappers += complimentaryWhiteChocolates;
    sugarFreeWrappers += complimentarySugerFreeChocolates;
  }

  return chocolates;
}

export { calculateChocolates };
