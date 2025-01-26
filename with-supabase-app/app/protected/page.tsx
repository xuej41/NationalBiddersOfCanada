import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import "./page.css";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="ProtectedPage">
      <div className="flex flex-1 w-full h-full items-center justify-center">
        <div className="flex flex-col items-center justify-center w-2/3 p-8">
          <div className="flex items-center mb-5">
            <Image src="/nbclogonotext.png" alt="Logo" width={150} height={150} />
            <h1 className="text-8xl">‎ |</h1><h1 className="text-4xl ml-5">A Smarter Way to Bid.</h1>
          </div>
          <p className="text-lg text-gray-700 mb-5">
          Connect with millions globally on Queen's leading live auction site. 
          </p>
        </div>
        <div className="w-1/2 p-8">
          <Image src="/bg.gif" alt="Sample Image" width={500} height={500} className="rounded-lg shadow-lg" />
        </div>
      </div>
    </div>
  );
}