export interface CalculatorInputs {
  homePrice: string;
  downPaymentType: 'percentage' | 'amount';
  downPaymentPercentage: string;
  downPaymentAmount: string;
  mortgageInterestRate: string;
  timeHorizon: string;
  closingCosts: string; // as % of home price
  annualMaintenanceCosts: string; // as % of home price
  annualOwnershipCosts: string; // as % of home price (insurance, taxes, etc.)
  monthlyRent: string;
  homeAppreciationRate: string; // % per year
  rentIncreaseRate: string; // % per year
  investmentReturnRate: string; // % per year
}

export type NumericCalculatorInputs = Omit<CalculatorInputs, 'downPaymentType' | 'homePrice' | 'downPaymentPercentage' | 'downPaymentAmount' | 'mortgageInterestRate' | 'timeHorizon' | 'closingCosts' | 'annualMaintenanceCosts' | 'annualOwnershipCosts' | 'monthlyRent' | 'homeAppreciationRate' | 'rentIncreaseRate' | 'investmentReturnRate'> & {
  homePrice: number;
  downPaymentPercentage: number;
  downPaymentAmount: number;
  mortgageInterestRate: number;
  timeHorizon: number;
  closingCosts: number;
  annualMaintenanceCosts: number;
  annualOwnershipCosts: number;
  monthlyRent: number;
  homeAppreciationRate: number;
  rentIncreaseRate: number;
  investmentReturnRate: number;
  downPaymentType: 'percentage' | 'amount';
};

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
  homePrice: '400000',
  downPaymentType: 'percentage',
  downPaymentPercentage: '20',
  downPaymentAmount: '80000',
  mortgageInterestRate: '6.5',
  timeHorizon: '10',
  closingCosts: '2.5',
  annualMaintenanceCosts: '1',
  annualOwnershipCosts: '2.5',
  monthlyRent: '2500',
  homeAppreciationRate: '3',
  rentIncreaseRate: '2.5',
  investmentReturnRate: '7',
};