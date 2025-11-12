import { requireAuth } from '@/lib/auth-utils';
import { caller } from '@/trpc/server';
import { LogoutButton } from './logout';

const Page = async () => {
  await requireAuth();

  const data = await caller.getUsers();
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      Protected Server component
      <div className="">{JSON.stringify(data, null, 2)}</div>
      <LogoutButton />
    </div>
  );
};
export default Page;
