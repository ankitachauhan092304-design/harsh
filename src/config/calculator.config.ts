export const CALCULATOR_CONFIG = {
  EMI: {
    LOAN_AMOUNT: {
      MIN: 100000,
      MAX: 100000000,
      STEP: 100000,
      DEFAULT: 2500000
    },
    INTEREST_RATE: {
      MIN: 5,
      MAX: 30,
      STEP: 0.1,
      DEFAULT: 8.5
    },
    TENURE_YEARS: {
      MIN: 1,
      MAX: 30,
      STEP: 1,
      DEFAULT: 20
    }
  },
  ELIGIBILITY: {
    INCOME: {
      MIN: 15000,
      MAX: 1000000,
      STEP: 5000,
      DEFAULT: 50000
    }
  }
};
