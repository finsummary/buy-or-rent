export interface CalculatorInputs {
  homePrice: number;
  downPaymentType: 'percentage' | 'amount';
  downPaymentPercentage: number;
  downPaymentAmount: number;
  mortgageInterestRate: number;
  timeHorizon: number;
  closingCosts: number; // as % of home price
  annualMaintenanceCosts: number; // as % of home price
  annualOwnershipCosts: number; // as % of home price (insurance, taxes, etc.)
  monthlyRent: number;
  homeAppreciationRate: number; // % per year
  rentIncreaseRate: number; // % per year
  investmentReturnRate: number; // % per year
}

export interface YearlyData {
  year: number;
  propertyValue: number;
  homeownerEquity: number;
  downPaymentInvestment: number;
  accumulatedSavings: number;
  totalRenterInvestment: number;
  monthlyRent: number;
  ownerMonthlyPayment: number;
  monthlyDifference: number; // ownerMonthlyPayment - monthlyRent
}

export interface CalculationResults {
  monthlyMortgagePayment: number;
  ownerMonthlyPayment: number;
  finalPropertyValue: number;
  finalDownPaymentInvestment: number;
  finalAccumulatedSavings: number;
  totalRenterInvestment: number;
  recommendation: 'Buy' | 'Rent';
  difference: number;
  yearlyData: YearlyData[];
}

export const defaultInputs: CalculatorInputs = {
  homePrice: 400000,
  downPaymentType: 'percentage',
  downPaymentPercentage: 20,
  downPaymentAmount: 80000,
  mortgageInterestRate: 6.5,
  timeHorizon: 10,
  closingCosts: 2.5,
  annualMaintenanceCosts: 1,
  annualOwnershipCosts: 2.5,
  monthlyRent: 2500,
  homeAppreciationRate: 3,
  rentIncreaseRate: 2.5,
  investmentReturnRate: 7,
};