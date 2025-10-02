"use client";
import { useState, useEffect } from "react";
import FirstPage from "@/components/pages/FirstPage";
import SecondPage from "@/components/pages/SecondPage";
import ThirdPage from "@/components/pages/ThirdPage";
import LeftRoom from "@/components/pages/LeftRoom";
import RightRoom from "@/components/pages/RightRoom";
import FourthInsideLift from "@/components/pages/FourthInsideLift";
import { Toaster } from "@/components/ui/sonner";
import FifthPage from "@/components/pages/FifthPage";
import Floor1 from "@/components/pages/Floor1";

export default function Home() {
  const [page, setPage] = useState<number | null>(null); // start as null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedPage = localStorage.getItem("currentPage");
    if (savedPage) {
      setPage(Number(savedPage));
    } else {
      setPage(1); // default page
    }
    setLoading(false); // finished loading
  }, []);

  useEffect(() => {
    if (page !== null) {
      localStorage.setItem("currentPage", page.toString());
    }
  }, [page]);

  if (loading || page === null) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <>
      {page === 1 && <FirstPage onNext={() => setPage(2)}  />}
      {page === 2 && <SecondPage onNext={() => setPage(3)} onBack={() => setPage(1)} />}
      {page === 3 && (
        <ThirdPage
          onLeft={() => setPage(4)}
          onRight={() => setPage(5)}
          InLift={() => setPage(6)}
          onBack={() => setPage(2)}
        />
      )}
      {page === 4 && <LeftRoom onLeft={() => setPage(3)}  />}
      {page === 5 && <RightRoom onRight={() => setPage(3)}  />}
      {page === 6 && <FourthInsideLift  onFirstFloor={() => setPage(7)} />}
      {page === 7 && <FifthPage onExit={() => setPage(8)} />}
      {page === 8 && <Floor1 onExit={() => setPage(1)} />}
      <Toaster />
    </>
  );
}
