export function hasValue(input: string | null | undefined): boolean {
  return input !== null && input !== undefined && input.trim() !== '';
}
