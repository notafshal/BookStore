import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedBooks from "../components/FeaturedBooks";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      <FeaturedBooks />
      <Footer />
    </div>
  );
}
