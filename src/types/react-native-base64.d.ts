declare module 'react-native-base64' {
  const Base64: {
    encode(input: string): string;
    decode(input: string): string;
    encodeFromByteArray(input: number[]): string;
  };
  export default Base64;
} 