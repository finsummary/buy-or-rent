import { CalculatorInputs, CalculationResults, YearlyData } from '@/types/calculator';

export function calculateMonthlyMortgagePayment(
  loanAmount: number,
  annualInterestRate: number,
  loanTermYears: number = 30
): number {
  const monthlyRate = annualInterestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  
  if (monthlyRate === 0) {
    return loanAmount / numberOfPayments;
  }
  
  const monthlyPayment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  return monthlyPayment;
}

export function calculateBuyVsRent(inputs: CalculatorInputs): CalculationResults {
  // Parse all string inputs into numbers, defaulting to 0 if invalid
  const numericInputs = Object.fromEntries(
    Object.entries(inputs).map(([key, value]) => {
      if (key === 'downPaymentType') {
        return [key, value];
      }
      const parsed = Number(value);
      return [key, isNaN(parsed) ? 0 : parsed];
    })
  ) as Omit<CalculatorInputs, 'downPaymentType'> & { downPaymentType: 'percentage' | 'amount' };


  // Calculate down payment amount
  const downPayment = inputs.downPaymentType === 'percentage' 
    ? numericInputs.homePrice * (numericInputs.downPaymentPercentage / 100)
    : numericInputs.downPaymentAmount;
  
  // Calculate loan amount
  const loanAmount = numericInputs.homePrice - downPayment;
  
  // Calculate closing costs
  const closingCosts = numericInputs.homePrice * (numericInputs.closingCosts / 100);
  
  // Calculate monthly mortgage payment
  const monthlyMortgagePayment = calculateMonthlyMortgagePayment(
    loanAmount, 
    numericInputs.mortgageInterestRate
  );
  
  // Calculate monthly ownership costs
  const monthlyMaintenance = (numericInputs.homePrice * numericInputs.annualMaintenanceCosts / 100) / 12;
  const monthlyOwnershipCosts = (numericInputs.homePrice * numericInputs.annualOwnershipCosts / 100) / 12;
  const ownerMonthlyPayment = monthlyMortgagePayment + monthlyMaintenance + monthlyOwnershipCosts;
  
  // Initialize variables for year-by-year calculation
  const yearlyData: YearlyData[] = [];
  let currentPropertyValue = numericInputs.homePrice;
  let currentMonthlyRent = numericInputs.monthlyRent;
  let downPaymentInvestment = downPayment; // Initial investment (down payment only, closing costs are expense)
  let accumulatedSavings = 0;
  
  // Add Year 0 (initial state)
  // Renter saves closing costs immediately since they don't pay them
  accumulatedSavings = closingCosts; // Renter starts with closing costs as savings
  yearlyData.push({
    year: 0,
    propertyValue: numericInputs.homePrice,
    homeownerEquity: downPayment + closingCosts, // Initial equity includes closing costs
    downPaymentInvestment: downPayment, // Renter invests the down payment amount
    accumulatedSavings: closingCosts, // Renter saves closing costs from day 1
    totalRenterInvestment: downPayment + closingCosts, // Down payment + closing costs savings
    monthlyRent: numericInputs.monthlyRent,
    ownerMonthlyPayment,
    monthlyDifference: ownerMonthlyPayment - numericInputs.monthlyRent,
  });
  
  // Calculate for each year
  for (let year = 1; year <= numericInputs.timeHorizon; year++) {
    // Property value appreciation
    currentPropertyValue = numericInputs.homePrice * Math.pow(1 + numericInputs.homeAppreciationRate / 100, year);
    
    // Down payment investment growth (renter only invests down payment, not closing costs)
    downPaymentInvestment = downPayment * Math.pow(1 + numericInputs.investmentReturnRate / 100, year);
    
    // Calculate accumulated savings with monthly additions and annual compounding
    // First apply investment growth to existing savings from previous year (including initial closing costs)
    accumulatedSavings = accumulatedSavings * (1 + numericInputs.investmentReturnRate / 100);
    
    // Calculate average monthly rent for this year (accounting for rent increase throughout the year)
    const startYearMonthlyRent = numericInputs.monthlyRent * Math.pow(1 + numericInputs.rentIncreaseRate / 100, year - 1);
    const endYearMonthlyRent = numericInputs.monthlyRent * Math.pow(1 + numericInputs.rentIncreaseRate / 100, year);
    const averageMonthlyRent = (startYearMonthlyRent + endYearMonthlyRent) / 2;
    
    // Calculate monthly savings for renter (if owner pays more than renter)
    const monthlySavings = Math.max(0, ownerMonthlyPayment - averageMonthlyRent);
    
    // Add 12 months of savings to accumulated savings
    accumulatedSavings += monthlySavings * 12;
    
    // Update current monthly rent for display (end of year value)
    currentMonthlyRent = endYearMonthlyRent;
    
    // Calculate homeowner's equity (property value minus remaining loan balance)
    const monthsElapsed = year * 12;
    const remainingPayments = 30 * 12 - monthsElapsed; // Assuming 30-year mortgage
    let remainingLoanBalance = 0;
    
    if (remainingPayments > 0 && numericInputs.mortgageInterestRate > 0) {
      const monthlyRate = numericInputs.mortgageInterestRate / 100 / 12;
      remainingLoanBalance = loanAmount * 
        (Math.pow(1 + monthlyRate, 30 * 12) - Math.pow(1 + monthlyRate, monthsElapsed)) /
        (Math.pow(1 + monthlyRate, 30 * 12) - 1);
    }
    
    // Homeowner equity: property value minus remaining loan balance minus closing costs (expense)
    // After year 0, closing costs are treated as sunk costs, not recoverable investment
    const homeownerEquity = Math.max(0, currentPropertyValue - remainingLoanBalance - (year > 0 ? closingCosts : 0));
    const totalRenterInvestment = downPaymentInvestment + accumulatedSavings;
    
    yearlyData.push({
      year,
      propertyValue: currentPropertyValue,
      homeownerEquity,
      downPaymentInvestment,
      accumulatedSavings,
      totalRenterInvestment,
      monthlyRent: currentMonthlyRent,
      ownerMonthlyPayment,
      monthlyDifference: ownerMonthlyPayment - currentMonthlyRent,
    });
  }
  
  // Final calculations
  const finalPropertyValue = currentPropertyValue;
  const finalDownPaymentInvestment = downPaymentInvestment;
  const finalAccumulatedSavings = accumulatedSavings;
  const totalRenterInvestment = finalDownPaymentInvestment + finalAccumulatedSavings;
  
  // Final homeowner equity (subtract selling costs and closing costs as they're expenses)
  const sellingCosts = finalPropertyValue * 0.06;
  const finalHomeownerEquity = Math.max(0, finalPropertyValue - sellingCosts - closingCosts);
  
  // Recommendation
  const recommendation: 'Buy' | 'Rent' = finalHomeownerEquity > totalRenterInvestment ? 'Buy' : 'Rent';
  const difference = Math.abs(finalHomeownerEquity - totalRenterInvestment);
  
  return {
    monthlyMortgagePayment,
    ownerMonthlyPayment,
    finalPropertyValue,
    finalDownPaymentInvestment,
    finalAccumulatedSavings,
    totalRenterInvestment,
    recommendation,
    difference,
    yearlyData,
  };
}

export function formatCurrency(amount: number): string {
  return Math.round(amount).toLocaleString();
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}