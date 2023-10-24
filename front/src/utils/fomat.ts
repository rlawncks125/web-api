export function uint8ArrayToBase64(array: any) {
  let binary = "";
  let bytes = new Uint8Array(array);
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
