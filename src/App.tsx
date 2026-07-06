import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Play,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  X,
  CheckCircle2,
  Layers,
  Radio,
  ChevronRight,
  Volume2,
  VolumeX,
  Clock
} from "lucide-react";
import { SunOrb } from "./components/SunOrb";
import { TsehayLogo } from "./components/TsehayLogo";

// Interfaces & Types
interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  message: string;
  timestamp: string;
}

interface PartnerApplication {
  brandName: string;
  industry: string;
  goals: string[];
  budget: string;
  contactName: string;
  email: string;
  notes: string;
}

export default function App() {
  // Typewriter effect state
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const fullHeadlineText = "SHINE\nALL AROUND";

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const tick = () => {
      if (!isDeleting) {
        if (typedText === fullHeadlineText) {
          timer = setTimeout(() => setIsDeleting(true), 2500);
        } else {
          timer = setTimeout(() => {
            setTypedText(fullHeadlineText.slice(0, typedText.length + 1));
          }, 220);
        }
      } else {
        if (typedText === "") {
          timer = setTimeout(() => setIsDeleting(false), 1000);
        } else {
          timer = setTimeout(() => {
            setTypedText(fullHeadlineText.slice(0, typedText.length - 1));
          }, 80);
        }
      }
    };
    tick();
    return () => clearTimeout(timer);
  }, [typedText, isDeleting]);

  // Navigation State
  const [activeNav, setActiveNav] = useState("home");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [portfolioFilter, setPortfolioFilter] = useState<"all" | "atl" | "btl" | "digital">("all");
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [partnerStep, setPartnerStep] = useState(1);
  const [partnerData, setPartnerData] = useState<PartnerApplication>({
    brandName: "",
    industry: "",
    goals: [],
    budget: "$10k - $25k",
    contactName: "",
    email: "",
    notes: ""
  });
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [selectedPoster, setSelectedPoster] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "Full 360 Campaign",
    message: ""
  });
  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>([]);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX - window.innerWidth / 2) / 45;
    const y = (e.clientY - window.innerHeight / 2) / 45;
    setMousePos({ x, y });
  };

  const campaigns = [
    {
      id: "dairy",
      title: "Enat Milk Corporate Documentary",
      amharicTitle: "የእናት ወተት ኮርፖሬት ዶክመንተሪ",
      category: "atl",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBb5To7p3To_5UCwUG5ceSXS2gf6gCd7-PW1bVjk2gl_cP5kQSb14xIuwuVdYpLaJjlNsN7Y27AMoAI6lrdvIZBZUE__JyFg7vtYIIvcXmvexRlw647bbmscRxLRKyG5b_7S76jGVxluRSmv-VVZo7YM52WAj6ii8ProvvhE1xaEFoVciWi5gtOhVo2vwYTRdK8FGI8nwNU1W68ls8kM_goQWSVXo6cLjekkLrVGW4Gpc-HVJVx69tgrQ",
      description: "An in-depth corporate profile highlighting Enat Milk's foundational values, state-of-the-art production lifecycle, and significant impact on Ethiopia's dairy sector.",
      tags: ["STORYBOARDING", "PRODUCTION", "ATL"],
      stats: [
        { label: "CAMPAIGN REACH", value: "1.2M Views", colorClass: "text-white" },
        { label: "ENGAGEMENT RATE", value: "24%", colorClass: "text-solar-orange" },
        { label: "DURATION", value: "16 mins", colorClass: "text-[#3268BA]" }
      ]
    },
    {
      id: "toyota",
      title: "Beyilul Speciality Dental Clinic TVC",
      amharicTitle: "የበይሉል የጥርስ ህክምና ክሊኒክ ቲቪ ኮመርሻል",
      category: "btl",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDELP6KANTJL1ZNRim9zOMR79o5SYL1IVpFEdQdNPjuxvmEfBh50bEaRju4Ohz7wG3aOWI7u99a5f-L39GtNcotUYSnQOnE3hpF3o0gIwkcVNjjMIcQJZqWRlnKeAz4zpE2QLzXJSSyLb13KY2Eq-4obd46irLCQoUooJRdvq3YbLiXgUYhrUgz_kC5WDAsvgcoDFJw7aB4o3gESLIjhjRQMr33JMiv-63dBFmP5iubPeUWDwxd8ItHNA",
      description: "A high-end TV commercial and hyper-targeted social activation showcasing advanced technology and gentle care with a contemporary Addis vibe.",
      tags: ["CAMPAIGN", "DIRECTION", "BTL"],
      stats: [
        { label: "CAMPAIGN REACH", value: "850k Targeted", colorClass: "text-white" },
        { label: "ENGAGEMENT RATE", value: "38%", colorClass: "text-solar-orange" },
        { label: "DURATION", value: "1 min", colorClass: "text-[#3268BA]" }
      ]
    }
  ];

  const posters = [
    {
      id: "p1",
      url: "/AMIBARA.jpg",
      alt: "Amibara Properties Campaign",
      tag: "REAL ESTATE",
      label: "Amibara Properties"
    },
    {
      id: "p2",
      url: "/ENAT.jpg",
      alt: "Enat Dairy Milk Campaign",
      tag: "FOOD & BEVERAGE",
      label: "Enat Milk"
    },
    {
      id: "p3",
      url: "/Beyilul.jpg",
      alt: "Beylul Speciality Dental Clinic Campaign",
      tag: "HEALTHCARE",
      label: "Beylul Speciality Dental Clinic"
    },
    {
      id: "p4",
      url: "/ess.jpg",
      alt: "Ethio Security System Campaign",
      tag: "SECURITY & SURVEILLANCE",
      label: "Ethio Security System"
    }
  ];

  const filteredCampaigns = campaigns.filter((c) => portfolioFilter === "all" || c.category === portfolioFilter);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSuccess(true);
    setTimeout(() => setContactSuccess(false), 5000);
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerData.brandName || !partnerData.email || !partnerData.contactName) return;
    setPartnerSubmitted(true);
  };

  const toggleGoal = (goal: string) => {
    const goals = partnerData.goals.includes(goal) ? partnerData.goals.filter((g) => g !== goal) : [...partnerData.goals, goal];
    setPartnerData({ ...partnerData, goals });
  };

  return (
    <div className="relative min-h-screen text-on-surface bg-deep-void selection:bg-solar-orange/30 selection:text-solar-orange" onMouseMove={handleMouseMove}>
      
      {/* Floating TopNavBar */}
      <header className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-10 py-4 transition-all duration-300 ${scrolled ? "bg-black/80 backdrop-blur-md shadow-lg" : "bg-transparent"}`}>
        <a href="#" onClick={() => setActiveNav("home")} className="flex items-center gap-2 cursor-pointer">
          <TsehayLogo className="w-8 h-8 hover:rotate-12 transition-transform duration-500" />
          <span className="font-display font-extrabold text-xl md:text-2xl text-solar-orange tracking-tight">Tsehay 360</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          <a onClick={() => setActiveNav("home")} className="text-white hover:text-solar-orange transition-colors font-bold text-sm" href="#">Home</a>
          <a onClick={() => setActiveNav("services")} className="text-white hover:text-solar-orange transition-colors font-bold text-sm" href="#services">Services</a>
          <a onClick={() => setActiveNav("work")} className="text-white hover:text-solar-orange transition-colors font-bold text-sm" href="#work">Work</a>
        </nav>
        <a href="#contact" className="bg-solar-orange text-black px-6 py-2 rounded-full font-bold text-xs hover:scale-105 transition-all">Contact Us</a>
      </header>

      <main className="relative z-10 w-full">
        {/* Hero Section */}
        <section id="hero" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden w-full px-4 md:px-10">
          <div className="w-full flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 z-20">
              <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F9B03C] to-[#3268BA] leading-[1.1] mb-6">
                {typedText.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </motion.h1>
              <p className="text-white/80 max-w-xl mb-10 leading-relaxed">
                Your complete 360° advertising partner. From broad-reach national campaigns to immersive community activations, we deliver end-to-end marketing solutions that demand attention and drive real growth.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setShowPartnerModal(true)} className="bg-solar-orange text-black px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-[#ffd398] transition-all">
                  Partner With Us &rarr;
                </button>
                <a href="#services" className="px-8 py-4 rounded-xl font-bold text-white border border-white/20 hover:bg-white/10 transition-all">
                  Explore Services
                </a>
              </div>
            </div>

            {/* Right Visuals */}
            <div className="lg:w-1/2 relative flex justify-center items-center h-[500px] md:h-[600px] w-full mt-20 lg:mt-0">
              <div className="absolute inset-0 z-0 flex items-center justify-center">
                <SunOrb />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-20 w-[300px] h-[400px] md:w-[350px] md:h-[500px] rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl group cursor-pointer"
              >
                <img src="/111.JPG" alt="Founder Portrait" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-20 transition-all duration-1000"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 bg-black w-full px-6 md:px-20">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Our Expertise</h2>
            <div className="w-16 h-1 bg-solar-orange mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-[#111] p-10 rounded-3xl border border-white/10 hover:border-[#3268BA] transition-all">
              <Radio className="w-10 h-10 text-[#3268BA] mb-6" />
              <h3 className="text-3xl font-bold text-white mb-4">Above-the-Line (ATL)</h3>
              <p className="text-gray-400">Broad-reach campaigns designed to maximize brand awareness across traditional and mass digital channels.</p>
            </div>
            <div className="bg-[#111] p-10 rounded-3xl border border-white/10 hover:border-[#F9B03C] transition-all">
              <Layers className="w-10 h-10 text-[#F9B03C] mb-6" />
              <h3 className="text-3xl font-bold text-white mb-4">Below-the-Line (BTL)</h3>
              <p className="text-gray-400">Targeted, conversion-driven activations built for deep community engagement and measurable customer action.</p>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="work" className="py-24 bg-[#0a0a0a] w-full px-6 md:px-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-16 text-center">Visual Excellence</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {posters.map((poster) => (
              <div key={poster.id} className="group cursor-pointer" onClick={() => setSelectedPoster(poster.url)}>
                <div className="aspect-[3/4] bg-[#111] rounded-2xl overflow-hidden border border-white/10">
                  <img src={poster.url} alt={poster.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <p className="mt-4 text-solar-orange text-xs font-bold uppercase">{poster.tag}</p>
                <p className="text-white font-bold">{poster.label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 text-center bg-black border-t border-white/10">
        <a href="https://linktr.ee/tsehaydigital" target="_blank" rel="noopener noreferrer" className="text-4xl font-black text-white hover:text-solar-orange transition-colors">
          CONNECT WITH US ↗
        </a>
      </footer>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPoster && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setSelectedPoster(null)} />
            <div className="relative z-10 w-full max-w-lg">
              <button onClick={() => setSelectedPoster(null)} className="absolute -top-12 right-0 bg-white/10 p-2 rounded-full text-white hover:bg-solar-orange transition-colors">
                <X className="w-6 h-6" />
              </button>
              <img src={selectedPoster} alt="Poster" className="w-full rounded-xl shadow-2xl" />
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
