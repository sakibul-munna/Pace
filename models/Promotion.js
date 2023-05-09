class Promotion {
  constructor(rules) {
    this.rules = rules;
  }

  getRule(type) {
    return this.rules[type];
  }
}

export default Promotion;
