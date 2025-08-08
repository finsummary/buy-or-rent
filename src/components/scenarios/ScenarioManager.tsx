"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Upload, Trash2, User, LogIn, Calendar } from 'lucide-react';
import { CalculatorInputs } from '@/types/calculator';
import { useScenarios } from '@/hooks/useScenarios';
import { formatCurrency } from '@/lib/calculator';

interface ScenarioManagerProps {
  currentInputs: CalculatorInputs;
  onLoadScenario: (inputs: CalculatorInputs) => void;
}

export function ScenarioManager({ currentInputs, onLoadScenario }: ScenarioManagerProps) {
  const { scenarios, loading, saveScenario, deleteScenario, isAuthenticated } = useScenarios();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioDescription, setScenarioDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveScenario = async () => {
    if (!scenarioName.trim()) return;

    setSaving(true);
    try {
      await saveScenario(scenarioName, currentInputs, scenarioDescription);
      setScenarioName('');
      setScenarioDescription('');
      setSaveDialogOpen(false);
    } catch (error) {
      console.error('Failed to save scenario:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLoadScenario = (scenarioData: CalculatorInputs) => {
    onLoadScenario(scenarioData);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!isAuthenticated) {
    return (
      <Card className="backdrop-blur-sm bg-white/90 border-white/60 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <User className="h-5 w-5" />
            Save Your Scenarios
          </CardTitle>
          <CardDescription>
            Sign in to save and manage your buy vs rent calculations
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            onClick={() => window.location.href = '/auth/signin'}
            className="w-full"
            size="lg"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign In to Save Scenarios
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            Your calculations are temporarily saved in your browser
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-white/90 border-white/60 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
  <Save className="h-5 w-5" />
  Scenario Manager
</CardTitle>
        <CardDescription>
          Save and load your buy vs rent scenarios
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="scenarios" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scenarios">My Scenarios</TabsTrigger>
            <TabsTrigger value="save">Save New</TabsTrigger>
          </TabsList>

          <TabsContent value="scenarios" className="mt-4">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Loading scenarios...</p>
              </div>
            ) : scenarios.length === 0 ? (
              <div className="text-center py-8">
                <Save className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved scenarios</h3>
                <p className="text-sm text-muted-foreground">
                  Save your first scenario to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                                  {scenarios.map((scenario) => (
                   <div
                     key={scenario.id}
                     onClick={() => handleLoadScenario(scenario.data)}
                     className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                   >
                     <div className="flex-1 min-w-0">
                       <h4 className="font-medium text-gray-900 truncate">
                         {scenario.name}
                       </h4>
                       {scenario.description && (
                         <p className="text-sm text-gray-600 truncate">
                           {scenario.description}
                         </p>
                       )}
                       <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                         <span className="flex items-center gap-1">
                           <Calendar className="h-3 w-3" />
                           {formatDate(scenario.updatedAt)}
                         </span>
                         <span>Home: {formatCurrency(scenario.data.homePrice)}</span>
                         <span>Rent: {formatCurrency(scenario.data.monthlyRent)}</span>
                       </div>
                     </div>
                     <div className="flex items-center gap-2 ml-4">
                       <Button
                         onClick={(e) => {
                           e.stopPropagation(); // Prevent loading scenario when deleting
                           deleteScenario(scenario.id);
                         }}
                         size="sm"
                         variant="outline"
                         className="text-red-600 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     </div>
                   </div>
                 ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="save" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scenarioName">Scenario Name</Label>
              <Input
                id="scenarioName"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                placeholder="e.g., Downtown Condo vs Suburb Rental"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scenarioDescription">Description (Optional)</Label>
              <Input
                id="scenarioDescription"
                value={scenarioDescription}
                onChange={(e) => setScenarioDescription(e.target.value)}
                placeholder="Additional notes about this scenario"
                maxLength={200}
              />
            </div>

            <div className="p-3 bg-gray-50 rounded-lg text-sm">
              <h4 className="font-medium mb-2">Current Scenario Summary:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <span>Home Price: {formatCurrency(currentInputs.homePrice)}</span>
                <span>Down Payment: {currentInputs.downPaymentType === 'percentage' 
                  ? `${currentInputs.downPaymentPercentage}%` 
                  : formatCurrency(currentInputs.downPaymentAmount)}
                </span>
                <span>Monthly Rent: {formatCurrency(currentInputs.monthlyRent)}</span>
                <span>Time Horizon: {currentInputs.timeHorizon} years</span>
              </div>
            </div>

            <Button
              onClick={handleSaveScenario}
              disabled={!scenarioName.trim() || saving}
              className="w-full"
              size="lg"
            >
              {saving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Scenario
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

