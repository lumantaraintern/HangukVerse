"use client";
import { useState } from "react";
import FirstPage from "@/components/pages/FirstPage";
import SecondPage from "@/components/pages/SecondPage";
import ThirdPage from "@/components/pages/ThirdPage";
import LeftRoom from "@/components/pages/LeftRoom";
import RightRoom from "@/components/pages/RightRoom";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  const [page, setPage] = useState(1);

  return (
    <>
      {page === 1 && <FirstPage onNext={() => setPage(2)} />}
      {page === 2 && <SecondPage onNext={() => setPage(3)} />}
      {page === 3 && (
        <ThirdPage onLeft={() => setPage(4)} onRight={() => setPage(5)} />
      )}
      {page === 4 && <LeftRoom onLeft={() => setPage(3)} />}
      {page === 5 && <RightRoom onRight={() => setPage(3)} />}
       <Toaster/> 
    </>
  );
}
