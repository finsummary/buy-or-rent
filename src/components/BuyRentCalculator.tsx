"use client"; 

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Home, DollarSign, TrendingUp, BarChart3, User } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


import { CalculatorInputs, defaultInputs } from '@/types/calculator';
import { calculateBuyVsRent, formatCurrency } from '@/lib/calculator';
import { UserMenu } from '@/components/auth/UserMenu';
import { ScenarioManager } from '@/components/scenarios/ScenarioManager';
import { YearlyBreakdownTable } from '@/components/YearlyBreakdownTable';
import { trackCalculation } from '@/components/analytics/GoogleAnalytics';
import { FaqSection } from '@/components/FaqSection';
import { Footer } from '@/components/Footer';

const BuyOrRentCalculator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const [activeTab, setActiveTab] = useState("inputs");

  // Calculate results
  const results = useMemo(() => {
    return calculateBuyVsRent(inputs);
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

  const handleInputChange = (field: keyof CalculatorInputs, value: string) => {
    if (field === 'downPaymentType') {
      if (value === 'percentage' || value === 'amount') {
        setInputs(prev => ({ ...prev, [field]: value }));
      }
      return;
    }

    // If the input is empty, store an empty string.
    if (value === '') {
      setInputs(prev => ({ ...prev, [field]: '' }));
      return;
    }

    // Allow only numbers and a single decimal point.
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    const parts = sanitizedValue.split('.');
    if (parts.length > 2) {
      // More than one decimal point, ignore the last character typed.
      return; 
    }
    
    // Prevent leading zeros on whole numbers (e.g. "05" -> "5")
    // but allow for decimal values like "0.5"
    let finalValue = sanitizedValue;
    if (finalValue.length > 1 && finalValue.startsWith('0') && !finalValue.startsWith('0.')) {
      finalValue = finalValue.substring(1);
    }
    
    // For the percentage field, cap the value at 100
    if (field === 'downPaymentPercentage') {
      if (Number(finalValue) > 100) {
        finalValue = '100';
      }
    }

    setInputs(prev => ({ ...prev, [field]: finalValue }));
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
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
            <Home className="h-6 w-6" />
            <span>BuyOrRent.io</span>
          </div>
          <div className="flex-grow text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center justify-center gap-2">
              <Calculator className="h-7 w-7 sm:h-8 sm:w-8" />
              Buy vs Rent Calculator
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-1">
              Make informed decisions about homeownership vs renting
            </p>
          </div>
          <div className="flex-shrink-0">
            <UserMenu />
          </div>
        </header>

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
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Home Purchase Details */}
              <Card className="backdrop-blur-sm bg-white/90 border-white/60 shadow-lg">
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
                  <div className="space-y-2">
                    <Label htmlFor="homePrice">Home Price</Label>
                    <Input
                      id="homePrice"
                      type="text"
                      inputMode="decimal"
                      value={inputs.homePrice}
                      onChange={(e) => handleInputChange('homePrice', e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Down Payment</Label>
                    <div className="flex gap-2 mb-2">
                      <Button
                        variant={inputs.downPaymentType === 'percentage' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleInputChange('downPaymentType', 'percentage')}
                      >
                        Percentage
                      </Button>
                      <Button
                        variant={inputs.downPaymentType === 'amount' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleInputChange('downPaymentType', 'amount')}
                      >
                        Amount
                      </Button>
                    </div>
                    {inputs.downPaymentType === 'percentage' ? (
                      <div className="space-y-1">
                        <Input
                          type="text"
                          inputMode="decimal"
                          value={inputs.downPaymentPercentage}
                          onChange={(e) => handleInputChange('downPaymentPercentage', e.target.value)}
                          placeholder="Percentage"
                          className="text-lg"
                        />
                        <p className="text-sm text-muted-foreground">
                          Amount: {formatCurrency(downPaymentAmount)}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Input
                          type="text"
                          inputMode="decimal"
                          value={inputs.downPaymentAmount}
                          onChange={(e) => handleInputChange('downPaymentAmount', e.target.value)}
                          placeholder="Amount"
                          className="text-lg"
                        />
                        <p className="text-sm text-muted-foreground">
                          Percentage: {(Number(inputs.homePrice) > 0 ? (Number(inputs.downPaymentAmount) / Number(inputs.homePrice)) * 100 : 0).toFixed(1)}%
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mortgageRate">Mortgage Interest Rate (%)</Label>
                    <Input
                      id="mortgageRate"
                      type="text"
                      inputMode="decimal"
                      value={inputs.mortgageInterestRate}
                      onChange={(e) => handleInputChange('mortgageInterestRate', e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeHorizon">Time Horizon (years)</Label>
                    <Input
                      id="timeHorizon"
                      type="text"
                      inputMode="decimal"
                      value={inputs.timeHorizon}
                      onChange={(e) => handleInputChange('timeHorizon', e.target.value)}
                      className="text-lg"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Costs and Expenses */}
              <Card className="backdrop-blur-sm bg-white/90 border-white/60 shadow-lg">
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
                  <div className="space-y-2">
                    <Label htmlFor="closingCosts">Closing Costs (% of home price)</Label>
                    <Input
                      id="closingCosts"
                      type="text"
                      inputMode="decimal"
                      value={inputs.closingCosts}
                      onChange={(e) => handleInputChange('closingCosts', e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maintenanceCosts">Annual Maintenance (% of home price)</Label>
                    <Input
                      id="maintenanceCosts"
                      type="text"
                      inputMode="decimal"
                      value={inputs.annualMaintenanceCosts}
                      onChange={(e) => handleInputChange('annualMaintenanceCosts', e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownershipCosts">Annual Ownership Costs (% of home price)</Label>
                    <Input
                      id="ownershipCosts"
                      type="text"
                      inputMode="decimal"
                      value={inputs.annualOwnershipCosts}
                      onChange={(e) => handleInputChange('annualOwnershipCosts', e.target.value)}
                      className="text-lg"
                    />
                    <p className="text-xs text-muted-foreground">
                      Insurance, property taxes, HOA fees, etc.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlyRent">Monthly Rent</Label>
                    <Input
                      id="monthlyRent"
                      type="text"
                      inputMode="decimal"
                      value={inputs.monthlyRent}
                      onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                      className="text-lg"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Market Assumptions */}
              <Card className="lg:col-span-2 backdrop-blur-sm bg-white/90 border-white/60 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <TrendingUp className="h-5 w-5" />
                    Market Assumptions
                  </CardTitle>
                  <CardDescription>
                    Annual growth rates and investment returns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="homeAppreciation">Home Appreciation (%/year)</Label>
                      <Input
                        id="homeAppreciation"
                        type="text"
                        inputMode="decimal"
                        value={inputs.homeAppreciationRate}
                        onChange={(e) => handleInputChange('homeAppreciationRate', e.target.value)}
                        className="text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rentIncrease">Rent Increase (%/year)</Label>
                      <Input
                        id="rentIncrease"
                        type="text"
                        inputMode="decimal"
                        value={inputs.rentIncreaseRate}
                        onChange={(e) => handleInputChange('rentIncreaseRate', e.target.value)}
                        className="text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="investmentReturn">Investment Return (%/year)</Label>
                      <Input
                        id="investmentReturn"
                        type="text"
                        inputMode="decimal"
                        value={inputs.investmentReturnRate}
                        onChange={(e) => handleInputChange('investmentReturnRate', e.target.value)}
                        className="text-lg"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                        {formatCurrency(results.finalPropertyValue)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">Final Property Value</div>
                    </div>
                    <div className="text-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(results.totalRenterInvestment)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">Total Renter Investment</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold mb-2">
                      Difference: {formatCurrency(results.difference)}
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
                    <span className="font-medium">{formatCurrency(results.monthlyMortgagePayment)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span>Owner&apos;s Total Monthly:</span>
                    <span className="font-medium">{formatCurrency(results.ownerMonthlyPayment)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span>Current Rent:</span>
                    <span className="font-medium">{formatCurrency(Number(inputs.monthlyRent))}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
                    <span className="font-semibold">Monthly Difference:</span>
                    <span className={`font-bold ${results.ownerMonthlyPayment > Number(inputs.monthlyRent) ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(Math.abs(results.ownerMonthlyPayment - Number(inputs.monthlyRent)))}
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
                    <span className="font-medium">{formatCurrency(downPaymentAmount + (Number(inputs.homePrice) * (Number(inputs.closingCosts) / 100)))}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span>Down Payment Investment:</span>
                    <span className="font-medium">{formatCurrency(results.finalDownPaymentInvestment)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span>Accumulated Savings:</span>
                    <span className="font-medium">{formatCurrency(results.finalAccumulatedSavings)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <span className="font-semibold">Total Renter Investment:</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(results.totalRenterInvestment)}
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
                        formatter={(value: number, name: string) => [formatCurrency(value), name]}
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

        <div id="faq">
          <FaqSection />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BuyOrRentCalculator;