import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Certificates from "@/components/Certificates";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#080c14] text-slate-100 overflow-hidden">
      {/* Fixed Navbar Header */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* About Me Section */}
      <About />

      {/* Skills & Tech Stack Section */}
      <Skills />

      {/* Featured Projects Grid Showcase */}
      <Projects />

      {/* Verified Certificates & Credentials Showcase */}
      <Certificates />

      {/* Visual Screenshot Gallery & Modal Lightbox */}
      <Gallery />

      {/* Contact Form & Social Links */}
      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  );
}
