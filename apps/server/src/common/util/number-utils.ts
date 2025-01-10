export function isWithin64BitRange(value: string): boolean {
  const numValue = Number(value);

  if (Number.isNaN(numValue)) {
    return false;
  }

  const bigValue = BigInt(numValue);
  const max64Bit = BigInt('9223372036854775807'); // Max value for 64-bit signed integer
  const min64Bit = BigInt('-9223372036854775808'); // Min value for 64-bit signed integer

  return bigValue <= max64Bit && bigValue >= min64Bit;
}
