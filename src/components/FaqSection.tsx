import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react";

const faqData = [
  {
    question: "Is it better to buy or rent a home?",
    answer: "The decision depends on your financial situation, lifestyle, and long-term goals. Buying a home can be a great investment and provide stability, but renting offers more flexibility and fewer responsibilities. Our calculator helps you compare the financial aspects to make an informed decision."
  },
  {
    question: "How much of a down payment do I need?",
    answer: "Traditionally, a 20% down payment is recommended to avoid private mortgage insurance (PMI). However, many loan programs allow for much smaller down payments, some as low as 3-5%. A larger down payment reduces your monthly mortgage payment and the total interest you'll pay."
  },
  {
    question: "What are closing costs?",
    answer: "Closing costs are fees associated with finalizing your mortgage, typically ranging from 2% to 5% of the home's purchase price. They include expenses like appraisal fees, title insurance, and loan origination fees. Renters do not have this expense."
  },
  {
    question: "What does the 'Investment Return Rate' mean for a renter?",
    answer: "This is a key concept. It represents the annual return you could earn by investing the money you would have spent on a down payment and other homeownership costs. This 'opportunity cost' is crucial for a fair comparison between buying and renting."
  },
  {
    question: "Why does the calculator include maintenance and ownership costs?",
    answer: "Unlike renting, homeowners are responsible for all maintenance (repairs, upkeep) and ownership costs (property taxes, homeowner's insurance). These can be significant and are essential to include for an accurate picture of the total cost of owning a home."
  },
  {
    question: "How does home appreciation affect my investment?",
    answer: "Home appreciation is the increase in your property's value over time. It's a major financial benefit of homeownership, as it builds your equity (the part of the home you actually own). However, appreciation is not guaranteed and can vary significantly by market."
  }
];


export function FaqSection() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3">
        <HelpCircle className="h-8 w-8 text-blue-600" />
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-full bg-white/60 p-6 rounded-xl shadow-lg border border-white/60">
        {faqData.map((item, index) => (
          <AccordionItem value={`item-${index + 1}`} key={index}>
            <AccordionTrigger className="text-lg font-semibold text-left">{item.question}</AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

