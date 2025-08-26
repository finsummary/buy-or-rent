"use client"; 

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Home, DollarSign, TrendingUp, BarChart3, User, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Link from 'next/link';


import { CalculatorInputs, defaultInputs } from '@/types/calculator';
import { calculateBuyVsRent, formatCurrency } from '@/lib/calculator';
import { UserMenu } from '@/components/auth/UserMenu';
import { ScenarioManager } from '@/components/scenarios/ScenarioManager';
import { YearlyBreakdownTable } from '@/components/YearlyBreakdownTable';
import { trackCalculation } from '@/components/analytics/GoogleAnalytics';
import { FaqSection } from '@/components/FaqSection';
import { Footer } from '@/components/Footer';
import { WhatIfScenario } from '@/components/WhatIfScenario';
import { cn } from '@/lib/utils';

export function BuyRentCalculator({ initialInputs }: { initialInputs?: Partial<CalculatorInputs> }) {
  const [inputs, setInputs] = useState<CalculatorInputs>(() => ({
    ...defaultInputs,
    ...initialInputs,
  }));
  const [activeTab, setActiveTab] = useState('inputs');
  const [highlightedFields, setHighlightedFields] = useState<Set<string>>(new Set());
  const [aiSource, setAiSource] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatCurrencyForClient = (amount: number) => {
    if (!isClient) {
      return Math.round(amount).toString();
    }
    return formatCurrency(amount);
  };

  // Calculate results
  const results = useMemo(() => {
    const getNumericValue = (value: string) => {
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    };

    const numericInputs = {
      homePrice: getNumericValue(inputs.homePrice),
      downPaymentType: inputs.downPaymentType,
      downPaymentPercentage: getNumericValue(inputs.downPaymentPercentage),
      downPaymentAmount: getNumericValue(inputs.downPaymentAmount),
      mortgageInterestRate: getNumericValue(inputs.mortgageInterestRate),
      timeHorizon: getNumericValue(inputs.timeHorizon),
      closingCosts: getNumericValue(inputs.closingCosts),
      annualMaintenanceCosts: getNumericValue(inputs.annualMaintenanceCosts),
      annualOwnershipCosts: getNumericValue(inputs.annualOwnershipCosts),
      monthlyRent: getNumericValue(inputs.monthlyRent),
      homeAppreciationRate: getNumericValue(inputs.homeAppreciationRate),
      rentIncreaseRate: getNumericValue(inputs.rentIncreaseRate),
      investmentReturnRate: getNumericValue(inputs.investmentReturnRate),
    };
    
    return calculateBuyVsRent(numericInputs);
  }, [inputs]);

  useEffect(() => {
    if (results) {
      trackCalculation(
        results.recommendation,
        Number(inputs.homePrice) || 0,
        Number(inputs.timeHorizon) || 0,
      );
    }
  }, [results, inputs.homePrice, inputs.timeHorizon]);

  const handleLoadScenario = (scenarioInputs: CalculatorInputs) => {
    // Ensure all loaded values are strings for consistency
    const stringifiedInputs = Object.fromEntries(
      Object.entries(scenarioInputs).map(([key, value]) => [key, String(value)])
    ) as unknown as CalculatorInputs;
    
    // downPaymentType should not be stringified
    stringifiedInputs.downPaymentType = scenarioInputs.downPaymentType;

    setInputs(stringifiedInputs);
    setActiveTab("inputs"); // Switch back to inputs tab
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (highlightedFields.size > 0) {
      setHighlightedFields(new Set());
    }
    if (aiSource) {
      setAiSource(null);
    }
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleDownPaymentTypeChange = (value: string) => {
    if (value !== 'percentage' && value !== 'amount') return;

    if (highlightedFields.size > 0) {
      setHighlightedFields(new Set());
    }
    if (aiSource) {
      setAiSource(null);
    }
    setInputs(prev => ({ ...prev, downPaymentType: value as 'percentage' | 'amount' }));
  };
  
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (highlightedFields.size > 0) {
      setHighlightedFields(new Set());
    }
    if (aiSource) {
      setAiSource(null);
    }
    const { name, value } = e.target;
    const cleanedValue = value.replace(/[^0-9.]/g, '');
    const numericValue = parseFloat(cleanedValue);

    if (isNaN(numericValue) || cleanedValue.trim() === '') {
      setInputs(prev => ({ ...prev, [name]: '' }));
      return;
    }
    
    let finalValue = numericValue;

    if (name === 'downPaymentPercentage') {
      finalValue = Math.max(0, Math.min(100, finalValue));
    }
    
    setInputs(prev => ({ ...prev, [name]: String(finalValue) }));
  };

  const handleAiUpdate = (newInputs: Partial<CalculatorInputs>, source?: string) => {
    const updatedKeys = new Set(Object.keys(newInputs));
    setHighlightedFields(updatedKeys);
    setAiSource(source || null);
    setInputs(prev => ({ ...prev, ...newInputs }));
  };

  const downPaymentAmount = useMemo(() => {
    const homePrice = Number(inputs.homePrice) || 0;
    if (inputs.downPaymentType === 'percentage') {
      const downPaymentPercentage = Number(inputs.downPaymentPercentage) || 0;
      return homePrice * (downPaymentPercentage / 100);
    }
    return Number(inputs.downPaymentAmount) || 0;
  }, [inputs.homePrice, inputs.downPaymentPercentage, inputs.downPaymentAmount, inputs.downPaymentType]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header content removed as it is now in the global Header component */}

        <Card className="mb-8 bg-white/70 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Buy or Rent Calculator with AI Assistant</h2>
            <p className="text-gray-600 leading-relaxed">
              Deciding whether to buy a home or rent is one of the biggest financial choices you'll make. It's not just about comparing a mortgage payment to a rent check; it's about understanding the long-term implications of appreciation, equity, maintenance costs, and investment opportunities. This calculator is designed to go beyond the surface-level numbers, providing you with a comprehensive, side-by-side comparison to help you make an informed and confident decision that aligns with your financial goals.
            </p>
          </CardContent>
        </Card>
 
         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
           <TabsList className="h-auto flex flex-wrap justify-center mb-6">
             <TabsTrigger value="inputs">Input Parameters</TabsTrigger>
            <TabsTrigger value="results">Results & Analysis</TabsTrigger>
            <TabsTrigger value="chart">Comparison Chart</TabsTrigger>
            <TabsTrigger value="table">Yearly Breakdown</TabsTrigger>
            <TabsTrigger value="scenarios">
              <User className="h-4 w-4 mr-1" />
              Scenarios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inputs">
            <div className="space-y-6">
              <WhatIfScenario inputs={inputs} onInputsChange={handleAiUpdate} />
              <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                      Confused about the inputs? {" "}
                      <Link href="/guide" className="font-semibold underline hover:text-blue-800 transition-colors">
                          Check out our detailed guide
                      </Link>
                      {" "} to understand what each field means.
                  </p>
              </div>
              {aiSource && (
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-500" />
                      AI Search Result Source
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap font-mono p-4 bg-white rounded-md border">
                      {aiSource}
                    </p>
                  </CardContent>
                </Card>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Home className="h-5 w-5" />
                      Home Purchase Details
                    </CardTitle>
                    <CardDescription>
                      Enter details about the property and mortgage
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="homePrice">Home Price</Label>
                      <Input
                        id="homePrice"
                        name="homePrice"
                        value={inputs.homePrice}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        type="text"
                        inputMode="decimal"
                        className={cn(highlightedFields.has('homePrice') && 'ring-2 ring-offset-2 ring-blue-500 transition-shadow duration-300')}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label>Down Payment</Label>
                      <Tabs value={inputs.downPaymentType} onValueChange={handleDownPaymentTypeChange}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="percentage">Percentage</TabsTrigger>
                          <TabsTrigger value="amount">Amount</TabsTrigger>
                        </TabsList>
                        <TabsContent value="percentage" className="pt-2">
                          <Label htmlFor="downPaymentPercentage">Down Payment (%)</Label>
                          <Input
                            id="downPaymentPercentage"
                            name="downPaymentPercentage"
                            value={inputs.downPaymentPercentage}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            type="text"
                            inputMode="decimal"
                            className={cn(highlightedFields.has('downPaymentPercentage') && 'ring-2 ring-offset-2 ring-blue-500 transition-shadow duration-300')}
                          />
                        </TabsContent>
                        <TabsContent value="amount" className="pt-2">
                          <Label htmlFor="downPaymentAmount">Down Payment ($)</Label>
                          <Input
                            id="downPaymentAmount"
                            name="downPaymentAmount"
                            value={inputs.downPaymentAmount}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            type="text"
                            inputMode="decimal"
                            className={cn(highlightedFields.has('downPaymentAmount') && 'ring-2 ring-offset-2 ring-blue-500 transition-shadow duration-300')}
                          />
                        </TabsContent>
                      </Tabs>

                      <div className="text-sm text-muted-foreground">
                        Amount: {formatCurrencyForClient(downPaymentAmount)}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="mortgageInterestRate">Mortgage Interest Rate (%)</Label>
                      <Input
                        id="mortgageInterestRate"
                        name="mortgageInterestRate"
                        value={inputs.mortgageInterestRate}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        type="text"
                        inputMode="decimal"
                        className={cn(highlightedFields.has('mortgageInterestRate') && 'ring-2 ring-offset-2 ring-blue-500 transition-shadow duration-300')}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="timeHorizon">Time Horizon (years)</Label>
                      <Input
                        id="timeHorizon"
                        name="timeHorizon"
                        value={inputs.timeHorizon}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        type="text"
                        inputMode="decimal"
                        className={cn(highlightedFields.has('timeHorizon') && 'ring-2 ring-offset-2 ring-blue-500 transition-shadow duration-300')}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <DollarSign className="h-5 w-5" />
                      Costs & Expenses
                    </CardTitle>
                    <CardDescription>
                      Additional costs as percentage of home price
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="closingCosts">Closing Costs (%)</Label>
                      <Input
                        id="closingCosts"
                        name="closingCosts"
                        value={inputs.closingCosts}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        type="text"
                        inputMode="decimal"
                        className={cn(highlightedFields.has('closingCosts') && 'ring-2 ring-offset-2 ring-blue-500 transition-shadow duration-300')}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="annualMaintenanceCosts">Annual Maintenance Costs (%)</Label>
                      <Input
                        id="annualMaintenanceCosts"
                        name="annualMaintenanceCosts"
                        value={inputs.annualMaintenanceCosts}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        type="text"
                        inputMode="decimal"
                        className={cn(highlightedFields.has('annualMaintenanceCosts') && 'ring-2 ring-offset-2 ring-blue-500 transition-shadow duration-300')}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="annualOwnershipCosts">Annual Prop. Taxes & Insurance (%)</Label>
                      <Input
                        id="annualOwnershipCosts"
                        name="annualOwnershipCosts"
                        value={inputs.annualOwnershipCosts}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        type="text"
                        inputMode="decimal"
                        className={cn(highlightedFields.has('annualOwnershipCosts') && 'ring-2 ring-offset-2 ring-blue-500 transition-shadow duration-300')}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="monthlyRent">Monthly Rent</Label>
                      <Input
                        id="monthlyRent"
                        name="monthlyRent"
                        value={inputs.monthlyRent}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        type="text"
                        inputMode="decimal"
                        className={cn(highlightedFields.has('monthlyRent') && 'ring-2 ring-offset-2 ring-blue-500 transition-shadow duration-300')}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="homeAppreciationRate">Home Appreciation Rate (%)</Label>
                      <Input
                        id="homeAppreciationRate"
                        name="homeAppreciationRate"
                        value={inputs.homeAppreciationRate}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        type="text"
                        inputMode="decimal"
                        className={cn(highlightedFields.has('homeAppreciationRate') && 'ring-2 ring-offset-2 ring-blue-500 transition-shadow duration-300')}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="rentIncreaseRate">Rent Increase Rate (%)</Label>
                      <Input
                        id="rentIncreaseRate"
                        name="rentIncreaseRate"
                        value={inputs.rentIncreaseRate}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        type="text"
                        inputMode="decimal"
                        className={cn(highlightedFields.has('rentIncreaseRate') && 'ring-2 ring-offset-2 ring-blue-500 transition-shadow duration-300')}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="investmentReturnRate">Investment Return Rate (%)</Label>
                      <Input
                        id="investmentReturnRate"
                        name="investmentReturnRate"
                        value={inputs.investmentReturnRate}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        type="text"
                        inputMode="decimal"
                        className={cn(highlightedFields.has('investmentReturnRate') && 'ring-2 ring-offset-2 ring-blue-500 transition-shadow duration-300')}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recommendation */}
              <Card className="lg:col-span-2 backdrop-blur-sm bg-white/90 border-white/60 shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">
                    Recommendation: <span className={results.recommendation === 'Buy' ? 'text-green-600' : 'text-blue-600'}>
                      {results.recommendation}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Based on {inputs.timeHorizon}-year analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row justify-center gap-6 mb-6">
                    <div className="text-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrencyForClient(results.finalPropertyValue)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">Final Property Value</div>
                    </div>
                    <div className="text-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrencyForClient(results.totalRenterInvestment)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">Total Renter Investment</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold mb-2">
                      Difference: {formatCurrencyForClient(results.difference)}
                    </div>
                    <div className="text-lg text-muted-foreground">
                      {results.recommendation === 'Buy' ? 'in favor of buying' : 'in favor of renting'}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Payments */}
              <Card className="backdrop-blur-sm bg-white/90 border-white/60 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Monthly Payments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span>Mortgage Payment:</span>
                    <span className="font-medium">{formatCurrencyForClient(results.monthlyMortgagePayment)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span>Owner&apos;s Total Monthly:</span>
                    <span className="font-medium">{formatCurrencyForClient(results.ownerMonthlyPayment)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span>Current Rent:</span>
                    <span className="font-medium">{formatCurrencyForClient(Number(inputs.monthlyRent))}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
                    <span className="font-semibold">Monthly Difference:</span>
                    <span className={`font-bold ${results.ownerMonthlyPayment > Number(inputs.monthlyRent) ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrencyForClient(Math.abs(results.ownerMonthlyPayment - Number(inputs.monthlyRent)))}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Breakdown */}
              <Card className="backdrop-blur-sm bg-white/90 border-white/60 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Investment Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span>Down Payment + Closing:</span>
                    <span className="font-medium">{formatCurrencyForClient(downPaymentAmount + (Number(inputs.homePrice) * (Number(inputs.closingCosts) / 100)))}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span>Down Payment Investment:</span>
                    <span className="font-medium">{formatCurrencyForClient(results.finalDownPaymentInvestment)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span>Accumulated Savings:</span>
                    <span className="font-medium">{formatCurrencyForClient(results.finalAccumulatedSavings)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <span className="font-semibold">Total Renter Investment:</span>
                    <span className="font-bold text-green-600">
                      {formatCurrencyForClient(results.totalRenterInvestment)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chart">
            <Card className="backdrop-blur-sm bg-white/90 border-white/60 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BarChart3 className="h-5 w-5" />
                  Wealth Comparison Over Time
                </CardTitle>
                <CardDescription>
                  Homeowner&apos;s equity vs renter&apos;s investment over {inputs.timeHorizon} years
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.yearlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="opacity-30" />
                      <XAxis 
                        dataKey="year" 
                        stroke="#6b7280"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                        tickFormatter={(value) => `${Math.round(value / 1000)}K`}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string) => [formatCurrencyForClient(value), name]}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="homeownerEquity" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        name="Homeowner&apos;s Equity"
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalRenterInvestment" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        name="Renter&apos;s Investment"
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="table">
            <YearlyBreakdownTable yearlyData={results.yearlyData} />
          </TabsContent>

          <TabsContent value="scenarios">
            <ScenarioManager 
              currentInputs={inputs}
              onLoadScenario={handleLoadScenario}
            />
          </TabsContent>
        </Tabs>

        <Card className="mt-8 bg-white/70 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Understanding Your Results</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The chart and tables above illustrate the potential long-term financial outcomes of buying versus renting. <strong>Homeowner's Equity</strong> represents the value of your home minus the outstanding mortgage balance, a key component of wealth building. <strong>Renter's Investment</strong> shows how much your money could have grown if, instead of buying a home, you rented and invested the difference in costs (like a down payment and lower monthly expenses) in the stock market.
            </p>
            <p className="text-gray-600 leading-relaxed">
              There is no single "right" answer. The better choice depends on your time horizon, local market conditions, and personal financial discipline. Use these results as a guide, and consider adjusting the assumptions to see how different scenarios could play out.
            </p>
          </CardContent>
        </Card>

        <div id="faq">
          <FaqSection />
        </div>
      </div>
      {/* Footer removed from here as it's in the main layout */}
    </div>
  );
};

export default BuyRentCalculator;