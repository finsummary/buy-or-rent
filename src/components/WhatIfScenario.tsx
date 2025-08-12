"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, Send, Info } from 'lucide-react';
import { CalculatorInputs } from '@/types/calculator';

interface WhatIfScenarioProps {
  inputs: CalculatorInputs;
  onInputsChange: (newInputs: Partial<CalculatorInputs>, source?: string) => void;
}

export const WhatIfScenario = ({ inputs, onInputsChange }: WhatIfScenarioProps) => {
  const [userQuery, setUserQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleQuery = async () => {
    if (!userQuery.trim()) return;

    setIsLoading(true);
    setError('');
    setInfo('');

    try {
      const response = await fetch('/api/ai/scenario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs, userQuery }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get a response from the AI assistant.');
      }

      const result = await response.json();
      
      if (result.type === 'update' && result.data && Object.keys(result.data).length > 0) {
        onInputsChange(result.data, result.source);
        setUserQuery('');
      } else if (result.type === 'info') {
        setInfo(result.message);
        // We might still want to show the source for info messages
        if(result.source) {
          onInputsChange({}, result.source);
        }
      } else if (result.type === 'error') {
        setError(result.message);
      } else {
        setError("I couldn't determine which values to change from your request. Please try rephrasing.");
      }

    } catch (err: any) {
      setError(err.message || 'Sorry, an error occurred while talking to the AI assistant.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-white/90 border-white/60 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Bot className="h-5 w-5 text-blue-500" />
          AI Assistant
        </CardTitle>
        <CardDescription>
          Ask questions like "What if interest is 7%?" or "When is buying better than renting?"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="e.g., At what rent increase rate is buying better?"
            onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
          />
          <Button onClick={handleQuery} disabled={isLoading}>
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Ask AI</span>
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {info && (
          <div className="mt-2 text-sm text-blue-700 bg-blue-100 border-l-4 border-blue-500 p-3 rounded-md flex items-center gap-2">
            <Info className="h-5 w-5 flex-shrink-0" />
            <span>{info}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
