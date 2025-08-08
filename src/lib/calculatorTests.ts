import { calculateMonthlyMortgagePayment, calculateCompoundInterest, calculateBuyVsRent } from './calculator';
import { defaultInputs } from '@/types/calculator';

// Тестовые случаи для проверки точности расчётов
export function runCalculatorTests() {
  const tests = [
    testMonthlyMortgagePayment,
    testCompoundInterest,
    testBuyVsRentCalculation,
    testEdgeCases,
  ];

  const results = tests.map(test => {
    try {
      return test();
    } catch (error) {
      console.error(`Ошибка в тесте ${test.name}:`, error);
      return { name: test.name, passed: false, error: error instanceof Error ? error.message : 'Неизвестная ошибка' };
    }
  });

  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  console.log(`Тесты калькулятора: ${passed}/${total} прошли успешно`);
  
  if (passed !== total) {
    console.log('Неудачные тесты:', results.filter(r => !r.passed));
  }

  return { passed, total, results };
}

function testMonthlyMortgagePayment() {
  const name = 'testMonthlyMortgagePayment';
  
  // Тест 1: Стандартный расчёт
  const payment1 = calculateMonthlyMortgagePayment(320000, 6.5, 30);
  const expected1 = 2021.74; // Примерное значение
  const tolerance = 1; // 1 рубль погрешности
  
  if (Math.abs(payment1 - expected1) > tolerance) {
    return { name, passed: false, error: `Ожидалось ~${expected1}, получено ${payment1}` };
  }

  // Тест 2: Нулевая ставка
  const payment2 = calculateMonthlyMortgagePayment(360000, 0, 30);
  const expected2 = 360000 / (30 * 12); // 1000
  
  if (Math.abs(payment2 - expected2) > 0.01) {
    return { name, passed: false, error: `При нулевой ставке ожидалось ${expected2}, получено ${payment2}` };
  }

  return { name, passed: true };
}

function testCompoundInterest() {
  const name = 'testCompoundInterest';
  
  // Тест: Сложный процент без дополнительных взносов
  const result1 = calculateCompoundInterest(80000, 7, 10, 0);
  const expected1 = 80000 * Math.pow(1.07, 10); // ~157308
  
  if (Math.abs(result1 - expected1) > 100) {
    return { name, passed: false, error: `Ожидалось ~${expected1}, получено ${result1}` };
  }

  // Тест: С ежемесячными взносами
  const result2 = calculateCompoundInterest(0, 7, 1, 1000);
  // 1000 * 12 месяцев с процентами
  const expected2 = 12450; // Примерно
  
  if (Math.abs(result2 - expected2) > 500) {
    return { name, passed: false, error: `С взносами ожидалось ~${expected2}, получено ${result2}` };
  }

  return { name, passed: true };
}

function testBuyVsRentCalculation() {
  const name = 'testBuyVsRentCalculation';
  
  try {
    const results = calculateBuyVsRent(defaultInputs);
    
    // Проверяем, что результаты имеют ожидаемую структуру
    if (!results.purchase || !results.rental || !results.comparison || !results.yearlyData) {
      return { name, passed: false, error: 'Отсутствуют обязательные поля в результатах' };
    }

    // Проверяем, что ежемесячный платёж больше нуля
    if (results.purchase.monthlyPayment <= 0) {
      return { name, passed: false, error: 'Ежемесячный платёж по ипотеке должен быть положительным' };
    }

    // Проверяем, что есть данные по годам
    if (results.yearlyData.length !== defaultInputs.investment.timeHorizon) {
      return { name, passed: false, error: `Ожидалось ${defaultInputs.investment.timeHorizon} лет данных, получено ${results.yearlyData.length}` };
    }

    // Проверяем, что рекомендация является валидной
    const validRecommendations = ['buy', 'rent', 'neutral'];
    if (!validRecommendations.includes(results.comparison.recommendation)) {
      return { name, passed: false, error: `Невалидная рекомендация: ${results.comparison.recommendation}` };
    }

    return { name, passed: true };
  } catch (error) {
    return { name, passed: false, error: error instanceof Error ? error.message : 'Неизвестная ошибка' };
  }
}

function testEdgeCases() {
  const name = 'testEdgeCases';
  
  try {
    // Тест: Очень высокие значения
    const highValueInputs = {
      ...defaultInputs,
      purchase: {
        ...defaultInputs.purchase,
        homePrice: 5000000,
        downPayment: 50,
      },
    };
    
    const results1 = calculateBuyVsRent(highValueInputs);
    if (!results1 || isNaN(results1.purchase.monthlyPayment)) {
      return { name, passed: false, error: 'Ошибка при высоких значениях' };
    }

    // Тест: Очень низкие значения
    const lowValueInputs = {
      ...defaultInputs,
      purchase: {
        ...defaultInputs.purchase,
        homePrice: 100000,
        downPayment: 5,
        interestRate: 0.5,
      },
    };
    
    const results2 = calculateBuyVsRent(lowValueInputs);
    if (!results2 || isNaN(results2.purchase.monthlyPayment)) {
      return { name, passed: false, error: 'Ошибка при низких значениях' };
    }

    // Тест: Нулевой рост стоимости
    const noAppreciationInputs = {
      ...defaultInputs,
      purchase: {
        ...defaultInputs.purchase,
        appreciation: 0,
      },
    };
    
    const results3 = calculateBuyVsRent(noAppreciationInputs);
    if (!results3) {
      return { name, passed: false, error: 'Ошибка при нулевом росте стоимости' };
    }

    return { name, passed: true };
  } catch (error) {
    return { name, passed: false, error: error instanceof Error ? error.message : 'Неизвестная ошибка' };
  }
}

// Функция для проверки валидности результатов
export function validateCalculationResults(results: unknown): string[] {
  const errors: string[] = [];
  
  if (!results || typeof results !== 'object') {
    errors.push('Результаты расчёта отсутствуют или неверного типа');
    return errors;
  }

  const typedResults = results as Record<string, unknown>;

  // Проверка структуры результатов
  const purchase = typedResults.purchase as Record<string, unknown> | undefined;
  if (!purchase || typeof purchase.monthlyPayment !== 'number' || purchase.monthlyPayment <= 0) {
    errors.push('Неверный ежемесячный платёж по покупке');
  }

  const rental = typedResults.rental as Record<string, unknown> | undefined;
  if (!rental || typeof rental.monthlyPayment !== 'number' || rental.monthlyPayment <= 0) {
    errors.push('Неверный ежемесячный платёж по аренде');
  }

  const yearlyData = typedResults.yearlyData;
  if (!Array.isArray(yearlyData) || yearlyData.length === 0) {
    errors.push('Отсутствуют данные по годам');
  }

  // Проверка на NaN и Infinity
  const numericalFields = [
    purchase?.monthlyPayment,
    purchase?.totalCost,
    rental?.totalCost,
    (typedResults.comparison as Record<string, unknown> | undefined)?.netWorthDifference,
  ];

  for (const field of numericalFields) {
    if (typeof field === 'number' && (isNaN(field) || !isFinite(field))) {
      errors.push('Найдены некорректные численные значения (NaN или Infinity)');
      break;
    }
  }

  return errors;
}
