import regression from "regression";

const predictIncomeAndExpense = (
  data: Record<string, { income: number; expense: number }>
) => {
  const dataToPredictIncome = Object.entries(data).map(
    ([_, { income }], index) => [index, income] as [number, number]
  );
  const dataToPredictExpense = Object.entries(data).map(
    ([_, { expense }], index) => [index, expense] as [number, number]
  );

  const predictedIncome = regression
    .linear(dataToPredictIncome)
    .predict(dataToPredictIncome.length - 1)[1];
  const predictedExpense = regression
    .linear(dataToPredictExpense)
    .predict(dataToPredictExpense.length - 1)[1];

  return {
    income: predictedIncome < 0 ? 0 : Number(predictedIncome.toFixed(2)),
    expense: predictedExpense < 0 ? 0 : Number(predictedExpense.toFixed(2)),
  };
};

export default predictIncomeAndExpense;
