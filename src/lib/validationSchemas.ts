import { z } from 'zod';

// Схемы валидации для входных данных калькулятора
export const purchaseInputSchema = z.object({
  homePrice: z
    .number()
    .min(50000, 'Минимальная стоимость дома: 50,000 ₽')
    .max(10000000, 'Максимальная стоимость дома: 10,000,000 ₽'),
  
  downPayment: z
    .number()
    .min(0, 'Первоначальный взнос не может быть отрицательным')
    .max(100, 'Первоначальный взнос не может превышать 100%'),
  
  downPaymentType: z.enum(['percentage', 'amount']).default('percentage'),
  
  interestRate: z
    .number()
    .min(0.1, 'Минимальная процентная ставка: 0.1%')
    .max(15, 'Максимальная процентная ставка: 15%'),
  
  loanTerm: z
    .number()
    .int('Срок кредита должен быть целым числом')
    .min(10, 'Минимальный срок кредита: 10 лет')
    .max(40, 'Максимальный срок кредита: 40 лет'),
  
  propertyTax: z
    .number()
    .min(0, 'Налог на недвижимость не может быть отрицательным')
    .max(5, 'Максимальный налог на недвижимость: 5%'),
  
  homeInsurance: z
    .number()
    .min(0, 'Страхование дома не может быть отрицательным')
    .max(50000, 'Максимальное страхование дома: 50,000 ₽'),
  
  hoaFees: z
    .number()
    .min(0, 'Плата ТСЖ не может быть отрицательной')
    .max(2000, 'Максимальная плата ТСЖ: 2,000 ₽'),
  
  maintenance: z
    .number()
    .min(0.5, 'Минимальные расходы на обслуживание: 0.5%')
    .max(5, 'Максимальные расходы на обслуживание: 5%'),
  
  appreciation: z
    .number()
    .min(-5, 'Минимальный рост стоимости: -5%')
    .max(10, 'Максимальный рост стоимости: 10%'),
});

export const rentalInputSchema = z.object({
  monthlyRent: z
    .number()
    .min(500, 'Минимальная арендная плата: 500 ₽')
    .max(20000, 'Максимальная арендная плата: 20,000 ₽'),
  
  rentIncrease: z
    .number()
    .min(0, 'Рост аренды не может быть отрицательным')
    .max(10, 'Максимальный рост аренды: 10%'),
  
  rentersInsurance: z
    .number()
    .min(0, 'Страхование арендатора не может быть отрицательным')
    .max(5000, 'Максимальное страхование арендатора: 5,000 ₽'),
  
  securityDeposit: z
    .number()
    .min(0, 'Залог не может быть отрицательным')
    .max(20000, 'Максимальный залог: 20,000 ₽'),
});

export const investmentInputSchema = z.object({
  investmentReturn: z
    .number()
    .min(0, 'Доходность инвестиций не может быть отрицательной')
    .max(20, 'Максимальная доходность инвестиций: 20%'),
  
  timeHorizon: z
    .number()
    .int('Временной горизонт должен быть целым числом')
    .min(1, 'Минимальный временной горизонт: 1 год')
    .max(50, 'Максимальный временной горизонт: 50 лет'),
});

export const calculatorInputSchema = z.object({
  purchase: purchaseInputSchema,
  rental: rentalInputSchema,
  investment: investmentInputSchema,
});

export type PurchaseInputErrors = z.inferFlattenedErrors<typeof purchaseInputSchema>['fieldErrors'];
export type RentalInputErrors = z.inferFlattenedErrors<typeof rentalInputSchema>['fieldErrors'];
export type InvestmentInputErrors = z.inferFlattenedErrors<typeof investmentInputSchema>['fieldErrors'];

// Функция для валидации отдельных значений
export function validatePurchaseInput(data: unknown) {
  return purchaseInputSchema.safeParse(data);
}

export function validateRentalInput(data: unknown) {
  return rentalInputSchema.safeParse(data);
}

export function validateInvestmentInput(data: unknown) {
  return investmentInputSchema.safeParse(data);
}

export function validateCalculatorInput(data: unknown) {
  return calculatorInputSchema.safeParse(data);
}
