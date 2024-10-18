export {};
declare module "@tawk.to/tawk-messenger-react";

declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: any;
  }
}
