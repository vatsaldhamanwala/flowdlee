import { auth } from '@/auth';

export default async function Dashboard() {
  const session = await auth();

  return <div> Welcome, {session?.user?.name} </div>;
}
