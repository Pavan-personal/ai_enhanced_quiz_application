import { redirect } from "next/navigation";
import QuizGenerator from "@/pages/MainPage";
import { getSession } from "@/lib/auth";
import LandingPage from "@/pages/HomePage";

export default async function HomePage() {
  const session = await getSession();
  console.log(session?.user.image);
  
  if (!session) {
    return <LandingPage />;
  }

  return <QuizGenerator user={session?.user} />;
}
