import SpotlightPreview from "@/components/Homepage/Spotlight";
import TimeScroll from "@/components/Homepage/TimeLine";
import BottomSection from "@/components/Homepage/BottomSection";
import Footer from '@/components/footer';

export default function Home() {
  return (
    <div>
      <SpotlightPreview />
      <TimeScroll />
      <BottomSection />
      <Footer />
    </div>
  );
}
