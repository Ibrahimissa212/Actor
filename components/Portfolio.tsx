"use client";
import { Tracking } from "@/components/Tracking";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Showreel } from "@/components/Showreel";
import { VideoGallery } from "@/components/VideoGallery";
import { PhotoGallery } from "@/components/PhotoGallery";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export function Portfolio() {
  return (
    <>
      <Tracking />
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
