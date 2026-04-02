import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextLogo } from "./components/TextLogo";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <TextLogo className="text-5xl text-white bg-red-700 p-4 rounded-md"></TextLogo>
  <Button  className="mt-3 bg-red-700 text-white"><Link href="/signin">Go to sigin page</Link></Button>
    </div>
  );
}
