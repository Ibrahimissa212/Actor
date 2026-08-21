import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Showreel } from "@/components/Showreel";
import { VideoGallery } from "@/components/VideoGallery";
import { PhotoGallery } from "@/components/PhotoGallery";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Showreel />
        <VideoGallery />
        <PhotoGallery />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
