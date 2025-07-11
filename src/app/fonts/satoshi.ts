// app/fonts/satoshi.ts
import localFont from 'next/font/local';

export const satoshi = localFont({
  src: [
    {
      path: './Satoshi-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Satoshi-Bold.woff2',
      weight: '700',
      style: 'bold',
    },
    // Add other weights/styles as needed
  ],
  variable: '--font-satoshi',
  display: 'swap',
});