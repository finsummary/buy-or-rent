"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { CalculatorInputs, CalculationResults } from '@/types/calculator';

interface AiSummaryProps {
  inputs: CalculatorInputs;
  results: CalculationResults;
}

export const AiSummary = ({ inputs, results }: AiSummaryProps) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getSummary = async () => {
    setIsLoading(true);
    setError('');
    setSummary('');

    try {
      const response = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs, results }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI summary');
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setError('Sorry, something went wrong while generating the summary.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-white/90 border-white/60 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          AI-Powered Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {summary && (
          <div className="prose prose-sm max-w-none bg-blue-50 p-4 rounded-lg">
            <p>{summary}</p>
          </div>
        )}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {!summary && (
          <Button onClick={getSummary} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Get AI Summary'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
