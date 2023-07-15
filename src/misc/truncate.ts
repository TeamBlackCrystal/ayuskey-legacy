import { substring } from 'stringz';

export function truncate(input: string, size: number): string;
export function truncate(input: string | undefined, size: number): string | undefined;
export function truncate(input: string | undefined, size: number): string | undefined {
	if (!input) {
		return input;
	} else {
		return substring(input, 0, size);
	}
}


export function precisionTruncate(input: string, maxLength: number) {
	if (input.length <= maxLength) {
	  return input;
	}
  
	const trimmedString = input.substring(0, maxLength);
	const lastSpaceIndex = trimmedString.lastIndexOf(' ');
  
	const finalString = lastSpaceIndex !== -1 ? trimmedString.substring(0, lastSpaceIndex) : trimmedString;
  
	return finalString;
  }
  