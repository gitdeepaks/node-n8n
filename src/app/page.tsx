import { Button } from '@/components/ui/button';
import prisma from '@/lib/db';

export default async function Home() {
  const users = await prisma.user.findMany();
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Button variant={'outline'}>Hello</Button>

      <h1>{JSON.stringify(users)}</h1>
    </div>
  );
}
