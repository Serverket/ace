export const _XOR_KEY = "S3rv3rk3tACE_2026!";

// Decrypt array of hex numbers back to a string using XOR
export function decodeX(encryptedArr: number[], key: string): string {
  let result = '';
  for (let i = 0; i < encryptedArr.length; i++) {
    result += String.fromCharCode(encryptedArr[i] ^ key.charCodeAt(i % key.length));
  }
  return result;
}

// Helper script (not used in runtime, just for us to generate the keys)
// export function encodeX(str: string, key: string): number[] {
//   let result = [];
//   for (let i = 0; i < str.length; i++) {
//     result.push(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
//   }
//   return result;
// }
