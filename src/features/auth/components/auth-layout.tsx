import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-muted flex mih-h-svh flex-col justify-center items-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href={'/'}
          className="flex items-center gao-2 self-center font-medium "
        >
          <Image src="/logos/logo.svg" alt="nodebase" width={30} height={30} />
          <h2 className="p-2">Nodebase</h2>
        </Link>
        {children}
      </div>
    </div>
  );
};
