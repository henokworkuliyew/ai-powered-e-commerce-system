export const FormatPrice = (amount: number) => {
  const Amount = amount*100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETB',
  }).format(Amount)
}
