export {};
declare module '@tawk.to/tawk-messenger-react'


declare global {
  interface Window {
    Tawk_API: {
      showWidget: () => void;
      hideWidget: () => void;
      onLoad:()=>void,
    };
    Tawk_LoadStart:any,
  }
}