"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, TrendingUp } from 'lucide-react';
import { YearlyData } from '@/types/calculator';
import { formatCurrency } from '@/lib/calculator';

interface YearlyBreakdownTableProps {
  yearlyData: YearlyData[];
}

export function YearlyBreakdownTable({ yearlyData }: YearlyBreakdownTableProps) {
  if (!yearlyData || yearlyData.length === 0) {
    return null;
  }

  return (
    <Card className="backdrop-blur-sm bg-white/90 border-white/60 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Yearly Breakdown
        </CardTitle>
        <CardDescription>
          Year-by-year comparison of property value vs rental investment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center font-semibold">Year</TableHead>
                <TableHead className="text-right font-semibold">Property Value</TableHead>
                <TableHead className="text-right font-semibold">Homeowner Equity</TableHead>
                <TableHead className="text-right font-semibold">Monthly Rent</TableHead>
                <TableHead className="text-right font-semibold">Monthly Difference</TableHead>
                <TableHead className="text-right font-semibold">Down Payment Investment</TableHead>
                <TableHead className="text-right font-semibold">Accumulated Savings</TableHead>
                <TableHead className="text-right font-semibold">Total Renter Investment</TableHead>
                <TableHead className="text-right font-semibold">Net Difference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {yearlyData.map((data) => {
                const difference = data.homeownerEquity - data.totalRenterInvestment;
                const isOwnerAhead = difference > 0;
                
                const monthlyDifferenceColor = data.monthlyDifference > 0 
                  ? 'text-red-600' // Owner pays more (bad for owner)
                  : 'text-green-600'; // Renter pays more (good for owner)

                return (
                  <TableRow key={data.year} className="hover:bg-gray-50/50">
                    <TableCell className="text-center font-medium">
                      {data.year}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.propertyValue)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.homeownerEquity)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.monthlyRent)}
                    </TableCell>
                    <TableCell className={`text-right font-mono ${monthlyDifferenceColor}`}>
                      {data.monthlyDifference > 0 ? '+' : ''}{formatCurrency(data.monthlyDifference)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.downPaymentInvestment)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(data.accumulatedSavings)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      {formatCurrency(data.totalRenterInvestment)}
                    </TableCell>
                    <TableCell className={`text-right font-mono font-semibold ${
                      isOwnerAhead ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isOwnerAhead ? '+' : '-'}{formatCurrency(Math.abs(difference))}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground space-y-1">
          <p><strong>Property Value:</strong> Home value with appreciation</p>
          <p><strong>Homeowner Equity:</strong> Property value minus remaining mortgage balance</p>
          <p><strong>Monthly Rent:</strong> Current rental payment (increases each year)</p>
          <p><strong>Monthly Difference:</strong> Owner's payment - Rent (<span className="text-red-600">Red = Owner pays more</span>, <span className="text-green-600">Green = Renter pays more</span>)</p>
          <p><strong>Down Payment Investment:</strong> Initial down payment + closing costs invested at market rate</p>
          <p><strong>Accumulated Savings:</strong> Monthly savings invested with annual compounding</p>
          <p><strong>Total Renter Investment:</strong> Down Payment Investment + Accumulated Savings</p>
          <p><strong>Net Difference:</strong> <span className="text-green-600">Green = Owner ahead</span>, <span className="text-red-600">Red = Renter ahead</span></p>
        </div>
      </CardContent>
    </Card>
  );
}
