const pkrFormatter = new Intl.NumberFormat("en-PK", {
  maximumFractionDigits: 2,
});

export function formatPrice(amount) {
  return `PKR ${pkrFormatter.format(amount)}`;
}
