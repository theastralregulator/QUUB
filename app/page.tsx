import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Features from "@/components/Features";
import Trust from "@/components/Trust";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-quub-purple/30 selection:text-white">
      {/* Mesh Background Effect */}
      <div className="fixed inset-0 pointer-events-none -z-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[#050816]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-quub-purple/10 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] rounded-full bg-quub-cyan/10 blur-[100px]" />
      </div>

      <Navbar />
      
      <div className="max-w-2xl mx-auto">
        <Hero />
        <Stats />
        <Features />
        <Trust />
      </div>

      <BottomNav />
    </main>
  );
}
