import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, DollarSign, TrendingUp, HelpCircle, BarChart3, TrendingDown, Clock, Banknote, ShieldCheck, Building } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function GuidePage() {
  const inputFields = [
    {
      icon: <Home className="h-5 w-5" />,
      title: "Home Price",
      description: "The full purchase price of the home you are considering buying. This is the starting point for most calculations, including your down payment and mortgage loan amount.",
    },
    {
      icon: <Banknote className="h-5 w-5" />,
      title: "Down Payment (% or Amount)",
      description: "The initial, upfront portion of the total home price you pay out of your own pocket. You can enter this as a percentage of the home price (e.g., 20%) or as a fixed amount. A larger down payment reduces your loan amount and can help you avoid Private Mortgage Insurance (PMI).",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Mortgage Interest Rate (%)",
      description: "The annual interest rate for your home loan. This is a crucial factor that determines the size of your monthly mortgage payment and the total interest you'll pay over the life of the loan. Use a rate you expect to qualify for.",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Time Horizon (years)",
      description: "The number of years you plan to live in the home or hold onto the investment. A longer time horizon typically favors buying, as it gives the home more time to appreciate in value and allows you to build more equity.",
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      title: "Closing Costs (%)",
      description: "Fees paid at the closing of a real estate transaction. These can include appraisal fees, title insurance, legal fees, and more. They are typically estimated as a percentage of the home price (e.g., 2-5%).",
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      title: "Annual Maintenance Costs (%)",
      description: "The cost of repairs, maintenance, and upkeep for the home. A common rule of thumb is to estimate this as 1% of the home's value annually. This is a key cost of ownership that renters do not pay directly.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "Annual Property Taxes & Insurance (%)",
      description: "This includes property taxes levied by local governments and homeowner's insurance premiums. It's an ongoing cost of ownership, often expressed as a percentage of the home's value.",
    },
    {
      icon: <Building className="h-5 w-5" />,
      title: "Monthly Rent",
      description: "The amount you would pay to rent a comparable property in the same area. This is the primary cost you are comparing against the costs of homeownership.",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Home Appreciation Rate (%)",
      description: "The annual rate at which you expect the home's value to increase. This is a major potential financial benefit of buying, but it is not guaranteed. Historical averages can be a useful guide.",
    },
    {
      icon: <TrendingDown className="h-5 w-5" />,
      title: "Rent Increase Rate (%)",
      description: "The annual rate at which you expect your rent to increase. Unlike a fixed-rate mortgage, rent typically rises over time due to inflation and market demand.",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Investment Return Rate (%)",
      description: "The average annual return you expect to earn on your investments (e.g., in the stock market). This is used to calculate the 'opportunity cost' of the money you tie up in a home (like the down payment), showing what it could have earned if invested elsewhere.",
    },
  ];

  const resultFields = [
    {
      icon: <Home className="h-5 w-5" />,
      title: "Homeowner's Equity",
      description: "This represents the portion of your property that you truly 'own'. It is the current market value of your home minus the remaining balance on your mortgage. As you pay down your mortgage and the home appreciates, your equity grows, which is a primary way homeowners build wealth."
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Renter's Investment",
      description: "This shows the potential value of the money a renter could have invested. It's calculated by taking the money that would have been used for a down payment and closing costs, plus any monthly savings from renting vs. buying, and assuming it was invested at your specified 'Investment Return Rate'. This highlights the opportunity cost of buying."
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      title: "The Recommendation (Buy vs. Rent)",
      description: "The final recommendation is based on a simple comparison: if the Homeowner's Equity is greater than the Renter's Investment at the end of your Time Horizon, the calculator suggests 'Buy'. Otherwise, it suggests 'Rent'. This provides a clear financial bottom line, but remember to also consider non-financial factors in your decision."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600">Calculator Guide</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Understand every input and result to make a confident decision.
          </p>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <HelpCircle className="h-7 w-7 text-blue-500" />
              Input Parameters Explained
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {inputFields.map((field) => (
              <div key={field.title} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                <div className="flex-shrink-0 text-blue-500 mt-1">{field.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{field.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{field.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
                <BarChart3 className="h-7 w-7 text-green-500" />
                Understanding the Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {resultFields.map((field) => (
                <div key={field.title} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                <div className="flex-shrink-0 text-green-500 mt-1">{field.icon}</div>
                <div>
                    <h3 className="font-semibold text-lg text-gray-800">{field.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{field.description}</p>
                </div>
                </div>
            ))}
          </CardContent>
        </Card>
        
        <div className="text-center mt-12">
            <Link href="/" passHref>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Back to Calculator
                </Button>
            </Link>
        </div>
      </div>
    </div>
  );
}

