import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Play,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  X,
  CheckCircle2,
  Send,
  Layers,
  Radio,
  Tv,
  ExternalLink,
  ChevronRight,
  Briefcase,
  Users,
  Target,
  Maximize2,
  Volume2,
  VolumeX,
  Clock,
  Heart,
  Flame,
  Globe,
  Camera,
  Home
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

// Helper to compress base64 image using canvas to ensure it fits within localStorage quota limits (e.g. max width/height 600px, 0.7 JPEG quality)
function compressImage(base64Str: string, callback: (compressed: string) => void) {
  const img = new Image();
  img.src = base64Str;
  img.onload = () => {
    const MAX_WIDTH = 600;
    const MAX_HEIGHT = 800;
    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width = Math.round((width * MAX_HEIGHT) / height);
        height = MAX_HEIGHT;
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0, width, height);
      try {
        const compressed = canvas.toDataURL("image/jpeg", 0.7);
        callback(compressed);
      } catch (e) {
        callback(base64Str);
      }
    } else {
      callback(base64Str);
    }
  };
  img.onerror = () => {
    callback(base64Str);
  };
}

const sentenceVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.08,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.05 },
  },
};

export default function App() {
  // Typewriter effect state for "SHINE\nALL AROUND"
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const fullHeadlineText = "SHINE\nALL AROUND";

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const tick = () => {
      if (!isDeleting) {
        if (typedText === fullHeadlineText) {
          // Pause at full text
          timer = setTimeout(() => setIsDeleting(true), 2500);
        } else {
          // Slow type
          timer = setTimeout(() => {
            setTypedText(fullHeadlineText.slice(0, typedText.length + 1));
          }, 220); // 220ms slow typing speed
        }
      } else {
        if (typedText === "") {
          // Pause at empty text
          timer = setTimeout(() => setIsDeleting(false), 1000);
        } else {
          // Delete
          timer = setTimeout(() => {
            setTypedText(fullHeadlineText.slice(0, typedText.length - 1));
          }, 80); // 80ms delete speed
        }
      }
    };

    tick();

    return () => clearTimeout(timer);
  }, [typedText, isDeleting]);

  // Navigation State
  const [activeNav, setActiveNav] = useState("home");

  // Parallax / Mouse Float state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Filter state for portfolio
  const [portfolioFilter, setPortfolioFilter] = useState<"all" | "atl" | "btl" | "digital">("all");

  // Modal / Interaction States
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

  // Cinematic Video Modal State
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  // Poster Lightbox State
  const [selectedPoster, setSelectedPoster] = useState<string | null>(null);

  // Contact Form State
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

  // Track page scroll to style floating navbar
  const [scrolled, setScrolled] = useState(false);

  // Custom Founder photo state
  const [founderPhoto, setFounderPhoto] = useState<string>(() => {
    try {
      return localStorage.getItem("tsehay_founder_photo") || "image_b584a2.jpg";
    } catch (e) {
      console.warn("Failed to read tsehay_founder_photo from localStorage:", e);
      return "image_b584a2.jpg";
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);

    // Load initial inquiries from LocalStorage
    try {
      const stored = localStorage.getItem("tsehay_inquiries");
      if (stored) {
        setContactInquiries(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to read tsehay_inquiries from localStorage:", e);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax floating card motion
  const handleMouseMove = (e: React.MouseEvent) => {
    const clientWidth = window.innerWidth;
    const clientHeight = window.innerHeight;
    const x = (e.clientX - clientWidth / 2) / 45;
    const y = (e.clientY - clientHeight / 2) / 45;
    setMousePos({ x, y });
  };

  // Portfolio list items
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

 // Poster Grid assets
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
    url: "/ENAT.jpg", // እዚህ ጋር ነው ስህተቱ የነበረው፣ አሁን አስተካክለነዋል
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
  // Filter campaigns
  const filteredCampaigns = campaigns.filter(
    (c) => portfolioFilter === "all" || c.category === portfolioFilter
  );

  // Form Submissions
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    const newInquiry: ContactInquiry = {
      id: Date.now().toString(),
      name: contactForm.name,
      email: contactForm.email,
      company: contactForm.company,
      projectType: contactForm.projectType,
      message: contactForm.message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const updated = [newInquiry, ...contactInquiries];
    setContactInquiries(updated);
    try {
      localStorage.setItem("tsehay_inquiries", JSON.stringify(updated));
    } catch (err) {
      console.warn("Failed to write tsehay_inquiries to localStorage:", err);
    }

    setContactSuccess(true);
    setContactForm({
      name: "",
      email: "",
      company: "",
      projectType: "Full 360 Campaign",
      message: ""
    });

    // Auto clear success message after 5 seconds
    setTimeout(() => {
      setContactSuccess(false);
    }, 5000);
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerData.brandName || !partnerData.email || !partnerData.contactName) return;
    setPartnerSubmitted(true);
  };

  const toggleGoal = (goal: string) => {
    const goals = partnerData.goals.includes(goal)
      ? partnerData.goals.filter((g) => g !== goal)
      : [...partnerData.goals, goal];
    setPartnerData({ ...partnerData, goals });
  };

  // Video playback simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showVideoModal) {
      interval = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 1;
        });
      }, 300);
    } else {
      setVideoProgress(0);
    }
    return () => clearInterval(interval);
  }, [showVideoModal]);

  return (
    <div className="relative min-h-screen text-on-surface bg-deep-void selection:bg-solar-orange/30 selection:text-solar-orange" onMouseMove={handleMouseMove}>
      {/* Background Starry Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <div className="absolute top-[20%] left-[10%] w-[2px] h-[2px] bg-white rounded-full" />
        <div className="absolute top-[40%] right-[15%] w-[3px] h-[3px] bg-solar-orange rounded-full animate-ping duration-[3000ms]" />
        <div className="absolute top-[75%] left-[25%] w-[2px] h-[2px] bg-white rounded-full" />
        <div className="absolute top-[15%] right-[30%] w-[2px] h-[2px] bg-white rounded-full animate-pulse" />
        <div className="absolute top-[60%] right-[8%] w-[2.5px] h-[2.5px] bg-brand-blue rounded-full" />
        <div className="absolute top-[85%] left-[65%] w-[1.5px] h-[1.5px] bg-solar-orange rounded-full animate-pulse duration-1000" />
      </div>

      {/* Floating TopNavBar */}
      <header
        className={`fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl rounded-full border bg-white/5 backdrop-blur-xl shadow-2xl z-50 flex justify-between items-center px-6 md:px-8 py-3 md:py-4 transition-all duration-300 ${
          scrolled ? "border-solar-orange/30 shadow-solar-orange/5 scale-[1.01]" : "border-white/10"
        }`}
        id="navbar-header"
      >
        <a
          href="#"
          onClick={() => setActiveNav("home")}
          className="flex items-center gap-2 md:gap-3 cursor-pointer"
        >
          <TsehayLogo className="w-8 h-8 md:w-10 md:h-10 hover:rotate-12 transition-transform duration-500" />
          <span className="font-display font-extrabold text-lg md:text-2xl text-solar-orange tracking-tight">
            Tsehay 360
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          <a
            onClick={() => setActiveNav("home")}
            className={`font-subtitle text-sm tracking-wider font-semibold pb-1 transition-all border-b-2 hover:text-solar-orange flex items-center gap-1.5 cursor-pointer ${
              activeNav === "home"
                ? "text-solar-orange border-solar-orange"
                : "text-white border-transparent"
            }`}
            href="#"
            id="nav-home"
          >
            Home
          </a>
          <a
            onClick={() => setActiveNav("services")}
            className={`font-subtitle text-sm tracking-wider font-semibold pb-1 transition-all border-b-2 hover:text-solar-orange ${
              activeNav === "services"
                ? "text-solar-orange border-solar-orange"
                : "text-white border-transparent"
            }`}
            href="#services"
            id="nav-services"
          >
            Services
          </a>
          <a
            onClick={() => setActiveNav("work")}
            className={`font-subtitle text-sm tracking-wider font-semibold pb-1 transition-all border-b-2 hover:text-solar-orange ${
              activeNav === "work"
                ? "text-solar-orange border-solar-orange"
                : "text-white border-transparent"
            }`}
            href="#work"
            id="nav-work"
          >
            Work
          </a>
        </nav>

        <a
          href="#contact"
          onClick={() => setActiveNav("contact")}
          className="bg-solar-orange hover:bg-solar-orange/90 text-black px-5 md:px-6 py-2 rounded-full font-display text-xs font-bold hover:scale-105 transition-all active:scale-95 shadow-lg shadow-solar-orange/20 text-center"
          id="nav-cta-btn"
        >
          Contact Us
        </a>
      </header>

      {/* Main Container */}
      <main className="relative z-10">
        
        {/* Hero Section */}
        <section
          className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden hero-glow"
          id="hero"
        >
          <section className="w-full min-h-screen relative overflow-hidden px-4 md:px-10">
  {/* እዚህ ጋር max-w-7xl ካለ አጥፋው */}
  <div className="flex flex-col lg:flex-row items-center justify-between">
     ...
  </div>
</section>
              
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F9B03C] via-[#B0B9C6] to-[#3268BA] leading-[1.05] tracking-tight mb-6 drop-shadow-[0_0_30px_rgba(249,176,60,0.25)]"
              >
                {typedText.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "steps(2)" }}
                  className="inline-block w-[4px] h-[0.85em] bg-solar-orange ml-1 align-middle animate-pulse"
                  style={{ WebkitTextFillColor: "initial" }}
                />
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-body text-base md:text-lg text-white max-w-xl mb-8 md:mb-10 opacity-90 leading-relaxed"
              >
                Your complete 360° advertising partner. From broad-reach national campaigns to immersive community activations, we deliver end-to-end marketing solutions that demand attention and drive real growth.
              </motion.p>

              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => {
                    setPartnerStep(1);
                    setPartnerSubmitted(false);
                    setShowPartnerModal(true);
                  }}
                  className="bg-solar-orange text-black px-8 py-4 rounded-xl font-bold font-subtitle text-base cta-pulse hover:bg-[#ffd398] transition-all text-center flex items-center justify-center gap-2"
                  id="hero-cta-partner"
                >
                  Partner With Us &rarr;
                </motion.button>
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  href="#services"
                  className="px-8 py-4 rounded-xl font-bold font-subtitle text-base glass-panel text-white hover:bg-white/10 transition-all duration-300 ease-in-out text-center secondary-cta-pulse"
                  id="hero-secondary-btn"
                >
                  Explore Services
                </motion.a>
              </div>

              {/* Minimalist trust indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mt-12 pt-8 border-t border-white/5 flex gap-8"
              >
                <div>
                  <div className="font-display text-2xl font-bold text-white">100%</div>
                  <div className="font-label-caps text-[10px] text-slate-muted">Proven Authority</div>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-white">ATL + BTL</div>
                  <div className="font-label-caps text-[10px] text-slate-muted">Integrated Strategy</div>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-white">360°</div>
                  <div className="font-label-caps text-[10px] text-slate-muted">Creative Execution</div>
                </div>
              </motion.div>
            </div>
            {/* Right Visuals (SunOrb & Founder Portrait) */}
            <div className="lg:col-span-6 relative flex flex-col justify-center items-center h-[500px] md:h-[600px] lg:h-[700px] w-full">
              {/* Three.js SunOrb Visualization in Background */}
              <div className="absolute -inset-12 md:-inset-20 lg:-inset-32 xl:-inset-40 z-0 flex items-center justify-center pointer-events-auto overflow-visible">
                <SunOrb />
              </div>

              {/* Floating Portrait Container with mouse-based parallax and gentle continuous 3D float */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -12, 0],
                  rotateY: [1.5, -1.5, 1.5],
                  rotateX: [1, -1, 1],
                }}
                transition={{ 
                  opacity: { duration: 1, delay: 0.45, ease: "easeOut" },
                  scale: { duration: 1, delay: 0.45, ease: "easeOut" },
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                  rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                  rotateX: { duration: 7, repeat: Infinity, ease: "easeInOut" }
                }}
                className="relative z-20 transition-transform duration-300 ease-out cursor-pointer"
                style={{
                  translateX: mousePos.x,
                  translateY: mousePos.y,
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Brand glow-bg behind portrait matching requested radial gradient and blur */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] z-0 pointer-events-none overflow-visible">
                  {/* Layer 1: Base slow scaling and rotating soft gradient */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 10,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                    style={{
                      filter: "blur(100px)",
                    }}
                    className="absolute inset-0 bg-gradient-to-br from-[#F9B03C] to-[#3268BA] opacity-65 rounded-full"
                  />
                  {/* Layer 2: Core high-contrast glow that breathes slightly faster */}
                  <motion.div
                    animate={{
                      scale: [0.95, 1.15, 0.95],
                      rotate: [180, 0, -180],
                    }}
                    transition={{
                      duration: 7,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                    style={{
                      filter: "blur(100px)",
                    }}
                    className="absolute inset-8 bg-gradient-to-tr from-[#3268BA] via-transparent to-[#F9B03C] opacity-55 rounded-full"
                  />
                </div>
                
                <div className="p-3 glass-panel rounded-3xl transition-transform duration-700 shadow-2xl shadow-brand-blue/10 group relative overflow-visible z-10">
                  <div className="relative overflow-hidden rounded-2xl">
                   <motion.div
  className="relative w-[280px] h-[380px] md:w-[320px] md:h-[450px] lg:w-[350px] lg:h-[500px] bg-white/10 rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl"
  style={{ perspective: 1000 }}
<motion.div
  className="relative w-[280px] h-[380px] md:w-[320px] md:h-[450px] lg:w-[350px] lg:h-[500px] bg-white/10 rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl group cursor-pointer"
<motion.div 
  <img
    src="/111.JPG"
    alt="Founder Portrait"
    className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out transform group-hover:scale-105"
  />
  
  {/* ከላይ የሚቀመጥ ስስ ጥላ (Overlay) */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-1000"></div>
</motion.div>
  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
</motion.div>

                  </div>

                  <div className="absolute -bottom-6 -right-6 p-5 glass-panel rounded-2xl border-solar-orange/30 shadow-xl max-w-[200px] backdrop-blur-2xl z-30">
                    <span className="font-label-caps text-[10px] text-solar-orange font-bold block mb-1">
                      FOUNDER
                    </span>
                    <span className="font-headline text-lg font-bold text-white block">
                      Visionary
                    </span>
                    <span className="font-body text-xs text-on-surface-variant block mt-1 opacity-80">
                      Guiding digital excellence across Ethiopia and beyond.
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 md:py-36 bg-black relative" id="services">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-solar-orange/30 to-transparent" />
          
          <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-7xl">
            <div className="text-center mb-20">
              <span className="font-label-caps text-xs text-solar-orange tracking-widest font-bold block mb-3">
                SERVICES
              </span>
              <div className="relative inline-block mb-6">
                <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white mb-4">
                  Our Expertise
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-solar-orange to-brand-blue mx-auto rounded-full" />
              </div>
              <p className="font-body text-[#D1D5DB] max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                We combine strategic mass communication with targeted activations to make your brand shine from every angle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* ATL Service */}
              <div
                className="bg-[#111111] border border-white/5 p-8 md:p-12 rounded-[2rem] hover:border-[#3268BA]/30 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(50,104,186,0.15)] transition-all duration-500 group flex flex-col justify-between"
                id="service-card-atl"
              >
                <div>
                  <div className="w-14 h-14 bg-[#3268BA]/10 rounded-full border border-[#3268BA]/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    <Radio className="w-7 h-7 text-[#3268BA]" />
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-solar-orange transition-colors">
                    Above-the-Line (ATL)
                  </h3>
                  <p className="font-body text-sm md:text-base text-[#D1D5DB] mb-8 leading-relaxed">
                    Broad-reach campaigns designed to maximize brand awareness across traditional and mass digital channels.
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-start gap-3 text-[#D1D5DB] text-sm">
                    <div className="w-5 h-5 rounded-full bg-solar-orange/10 flex items-center justify-center mt-0.5 shrink-0">
                      <Sparkles className="w-3 h-3 text-[#F9B03C]" />
                    </div>
                    <div className="font-body">
                      <strong className="text-white font-semibold">Television & Radio:</strong> High-quality national spots that capture attention and build brand trust.
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-[#D1D5DB] text-sm">
                    <div className="w-5 h-5 rounded-full bg-solar-orange/10 flex items-center justify-center mt-0.5 shrink-0">
                      <Sparkles className="w-3 h-3 text-[#F9B03C]" />
                    </div>
                    <div className="font-body">
                      <strong className="text-white font-semibold">Print & Billboards:</strong> High-impact visual placements in key urban centers.
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-[#D1D5DB] text-sm">
                    <div className="w-5 h-5 rounded-full bg-solar-orange/10 flex items-center justify-center mt-0.5 shrink-0">
                      <Sparkles className="w-3 h-3 text-[#F9B03C]" />
                    </div>
                    <div className="font-body">
                      <strong className="text-white font-semibold">Cinematic Documentaries:</strong> Premium storytelling highlighting your corporate values and impact.
                    </div>
                  </div>
                </div>
              </div>

              {/* BTL Service */}
              <div
                className="bg-[#111111] border border-white/5 p-8 md:p-12 rounded-[2rem] hover:border-solar-orange/30 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(249,176,60,0.15)] transition-all duration-500 group flex flex-col justify-between"
                id="service-card-btl"
              >
                <div>
                  <div className="w-14 h-14 bg-[#F9B03C]/10 rounded-full border border-[#F9B03C]/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    <Layers className="w-7 h-7 text-[#F9B03C]" />
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-brand-blue transition-colors">
                    Below-the-Line (BTL)
                  </h3>
                  <p className="font-body text-sm md:text-base text-[#D1D5DB] mb-8 leading-relaxed">
                    Targeted, conversion-driven activations built for deep community engagement and measurable customer action.
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-start gap-3 text-[#D1D5DB] text-sm">
                    <div className="w-5 h-5 rounded-full bg-[#3268BA]/10 flex items-center justify-center mt-0.5 shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-[#3268BA]" />
                    </div>
                    <div className="font-body">
                      <strong className="text-white font-semibold">Digital Activations:</strong> Targeted social campaigns, lead generation, and brand apps.
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-[#D1D5DB] text-sm">
                    <div className="w-5 h-5 rounded-full bg-[#3268BA]/10 flex items-center justify-center mt-0.5 shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-[#3268BA]" />
                    </div>
                    <div className="font-body">
                      <strong className="text-white font-semibold">Point of Sale & Events:</strong> Engaging face-to-face promotional experiences that drive direct results.
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-[#D1D5DB] text-sm">
                    <div className="w-5 h-5 rounded-full bg-[#3268BA]/10 flex items-center justify-center mt-0.5 shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-[#3268BA]" />
                    </div>
                    <div className="font-body">
                      <strong className="text-white font-semibold">Localized Communities:</strong> Direct marketing and community management tailored to specific regions.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Campaign Showcase (Portfolio) */}
        <section
          className="py-24 md:py-36 bg-[#000000] relative border-t border-white/5"
          id="work"
        >
          {/* Subtle background glow effect */}
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-blue/10 blur-[150px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-7xl relative z-10">
            {/* Header Area */}
            <div className="max-w-3xl mb-16 md:mb-24">
              <span className="font-label-caps text-xs text-solar-orange tracking-widest font-bold block mb-3 uppercase">
                PORTFOLIO
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white mb-6">
                Impactful Campaigns
              </h2>
              <p className="font-body text-sm md:text-base text-gray-300 leading-relaxed">
                Explore how we illuminate brands across every channel. From national broadcast campaigns (ATL) to immersive on-ground community activations (BTL) and digital innovation, see our end-to-end execution in action.
              </p>
            </div>

            {/* Portfolio Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-16 p-1.5 rounded-2xl bg-white/5 border border-white/10 w-fit">
              <button
                onClick={() => setPortfolioFilter("all")}
                className={`px-5 py-2.5 rounded-xl font-label-caps text-xs tracking-wider font-bold transition-all uppercase cursor-pointer ${
                  portfolioFilter === "all"
                    ? "bg-solar-orange text-black shadow-lg shadow-solar-orange/20"
                    : "bg-transparent border border-white/10 text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                ALL CAMPAIGNS
              </button>
              <button
                onClick={() => setPortfolioFilter("atl")}
                className={`px-5 py-2.5 rounded-xl font-label-caps text-xs tracking-wider font-bold transition-all uppercase cursor-pointer ${
                  portfolioFilter === "atl"
                    ? "bg-solar-orange text-black shadow-lg shadow-solar-orange/20"
                    : "bg-transparent border border-white/10 text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                ATL
              </button>
              <button
                onClick={() => setPortfolioFilter("btl")}
                className={`px-5 py-2.5 rounded-xl font-label-caps text-xs tracking-wider font-bold transition-all uppercase cursor-pointer ${
                  portfolioFilter === "btl"
                    ? "bg-solar-orange text-black shadow-lg shadow-solar-orange/20"
                    : "bg-transparent border border-white/10 text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                BTL
              </button>
            </div>

            {/* Showcase Campaigns Column (Alternating Layout) */}
            <div className="space-y-24 md:space-y-36">
              <AnimatePresence mode="popLayout">
                {filteredCampaigns.map((project) => {
                  const isLeftMedia = project.id !== "toyota";
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      key={project.id}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
                    >
                      {/* Media Column */}
                      <div className={`lg:col-span-7 rounded-3xl overflow-hidden bg-[#111111] border border-white/5 p-2 transition-all duration-500 hover:border-solar-orange/30 hover:scale-[1.02] ${!isLeftMedia ? "lg:order-2" : ""}`}>
                        <div className="aspect-video bg-neutral-900 relative rounded-2xl overflow-hidden group">
                          {project.id === "dairy" ? (
                            <iframe
                              className="w-full h-full rounded-xl border-0"
                              style={{ borderRadius: "12px" }}
                              src="https://www.youtube.com/embed/3OgM4Xk8JuE?rel=0&modestbranding=1"
                              title={project.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          ) : project.id === "toyota" ? (
                            <iframe
                              width="100%"
                              height="100%"
                              src="https://www.youtube.com/embed/uotgkgn-amk?rel=0&modestbranding=1"
                              title="Dental Clinic TV Commercial"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              style={{ borderRadius: "12px", aspectRatio: "16/9", minHeight: "300px" }}
                            />
                          ) : (
                            <>
                              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 z-10" />
                              <img
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                                src={project.image}
                              />
                            </>
                          )}
                        </div>
                      </div>

                      {/* Narrative Column */}
                      <div className={`lg:col-span-5 ${!isLeftMedia ? "lg:order-1" : ""}`}>
                        <span className="font-amharic text-solar-orange text-xl md:text-2xl block mb-3 font-semibold">
                          {project.amharicTitle}
                        </span>
                        <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                          {project.title}
                        </h3>
                        <p className="font-body text-sm md:text-base text-gray-300 mb-8 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2.5 mb-8">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3.5 py-1 rounded-full border border-white/10 font-display text-[10px] tracking-wider text-white/90 bg-white/5 uppercase font-semibold"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Stats Box */}
                        <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-[#0a0a0a] border border-white/10">
                          {project.stats.map((stat, sIdx) => (
                            <div key={sIdx}>
                              <div className="font-display text-[9px] text-gray-500 block mb-1 uppercase tracking-wider font-bold">
                                {stat.label}
                              </div>
                              <div className={`font-body text-sm md:text-base font-bold ${stat.colorClass}`}>
                                {stat.value}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Campaign Posters Sub-Grid section */}
            <div className="mt-32 md:mt-44">
              <div className="text-center mb-[3rem]">
                <span className="font-display text-[12px] text-[#3268BA] tracking-[2px] font-bold block mb-[12px] uppercase">
                  VISUAL IMPACT
                </span>
                <h3 className="font-display text-3xl md:text-[2.5rem] font-bold text-white mb-[16px] leading-tight">
                  Visual Excellence
                </h3>
                <p className="font-body text-[1rem] text-[#9ca3af] max-w-[600px] mx-auto leading-relaxed">
                  Browse through our collection of high-impact visuals. Click any artwork to view the full resolution and creative details.
                </p>
              </div>

              {/* Framer motion staggered container */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.15
                    }
                  }
                }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10"
              >
                {posters.map((poster) => (
                  <motion.div
                    key={poster.id}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        transition: { 
                          duration: 0.8,
                          ease: [0.16, 1, 0.3, 1]
                        } 
                      }
                    }}
                    className="flex flex-col gap-4 group"
                  >
                    <motion.div
                      onClick={() => setSelectedPoster(poster.url)}
                      whileHover={{ 
                        y: -8,
                        boxShadow: "0 20px 40px rgba(249, 176, 60, 0.2)"
                      }}
                      transition={{ 
                        duration: 0.4,
                        ease: [0.25, 1, 0.5, 1]
                      }}
                      className="aspect-[3/4] bg-[#111111] border border-white/5 rounded-2xl overflow-hidden group cursor-pointer relative"
                    >
                      <img
                        alt={poster.alt}
                        className="w-full h-full object-cover transition-transform duration-400 ease-out group-hover:scale-[1.03]"
                        src={poster.url}
                      />
                    </motion.div>
                    
                    {/* Caption Layout */}
                    <div className="flex flex-col text-left px-1">
                      <span className="font-subtitle font-bold uppercase tracking-[1px] text-[11px] text-[#F9B03C] mb-[4px] block">
                        {poster.tag}
                      </span>
                      <span className="font-display font-bold text-[16px] text-white">
                        {poster.label}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 md:py-36 bg-[#000000] relative" id="contact">
          <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-7xl">
            <div className="bg-[#111111] p-8 md:p-16 lg:p-24 rounded-3xl border border-white/10 relative overflow-hidden">
              {/* Internal glow meshes */}
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-solar-orange/10 blur-[120px] rounded-full pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10">
                {/* Left side info */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-12">
                  <div>
                    <span className="font-display text-xs text-[#F9B03C] tracking-widest font-bold block mb-4 uppercase">
                      GET IN TOUCH
                    </span>
                    <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                      Let's Shine Together
                    </h2>
                    <p className="font-body text-sm md:text-base text-slate-muted opacity-80 leading-relaxed mb-0">
                      Ready for a complete marketing transformation? Partner with a true 360° advertising powerhouse and let's build your end-to-end strategy today.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <motion.a 
                      href="mailto:hi@tsehay360.com"
                      whileHover={{ 
                        y: -6, 
                        scale: 1.02,
                        boxShadow: "0 12px 30px rgba(249, 176, 60, 0.15)",
                        backgroundColor: "rgba(255, 255, 255, 0.02)"
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="flex items-center gap-5 p-3 rounded-xl border border-transparent hover:border-solar-orange/20 cursor-pointer transition-colors duration-300 w-full"
                    >
                      <div className="w-12 h-12 rounded-full border border-solar-orange/30 flex items-center justify-center shrink-0 bg-white/5 transition-colors">
                        <Mail className="w-5 h-5 text-solar-orange" />
                      </div>
                      <div>
                        <p className="font-display text-[9px] text-solar-orange font-bold block tracking-wider uppercase">
                          EMAIL US
                        </p>
                        <p className="font-display text-sm md:text-base font-medium text-white hover:text-solar-orange transition-colors duration-300">
                          hi@tsehay360.com
                        </p>
                      </div>
                    </motion.a>

                    <motion.a 
                      href="tel:+251980209090"
                      whileHover={{ 
                        y: -6, 
                        scale: 1.02,
                        boxShadow: "0 12px 30px rgba(50, 104, 186, 0.15)",
                        backgroundColor: "rgba(255, 255, 255, 0.02)"
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="flex items-center gap-5 p-3 rounded-xl border border-transparent hover:border-brand-blue/20 cursor-pointer transition-colors duration-300 w-full"
                    >
                      <div className="w-12 h-12 rounded-full border border-brand-blue/30 flex items-center justify-center shrink-0 bg-white/5 transition-colors">
                        <Phone className="w-5 h-5 text-brand-blue" />
                      </div>
                      <div>
                        <p className="font-display text-[9px] text-brand-blue font-bold block tracking-wider uppercase">
                          CALL US
                        </p>
                        <p className="font-display text-sm md:text-base font-medium text-white font-mono hover:text-brand-blue transition-colors duration-300">
                          0980 20 90 90
                        </p>
                      </div>
                    </motion.a>

                    <motion.a 
                      href="https://www.google.com/maps/search/?api=1&query=Bole,+Addis+Ababa,+Ethiopia" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      whileHover={{ 
                        y: -6, 
                        scale: 1.02,
                        boxShadow: "0 12px 30px rgba(255, 255, 255, 0.08)",
                        backgroundColor: "rgba(255, 255, 255, 0.02)"
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="flex items-center gap-5 p-3 rounded-xl border border-transparent hover:border-white/10 cursor-pointer transition-colors duration-300 w-full"
                    >
                      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 bg-white/5 transition-colors">
                        <MapPin className="w-5 h-5 text-white/70" />
                      </div>
                      <div>
                        <p className="font-display text-[9px] text-slate-muted font-bold block tracking-wider uppercase">
                          VISIT US
                        </p>
                        <p className="font-display text-sm md:text-base font-medium text-white hover:text-solar-orange transition-colors duration-300">
                          Bole, Addis Ababa, Ethiopia
                        </p>
                      </div>
                    </motion.a>
                  </div>
                </div>

                {/* Right side stateful contact form */}
                <div className="lg:col-span-7">
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-display text-[10px] text-solar-orange tracking-wider font-semibold uppercase mb-2">
                          Your Name
                        </label>
                        <input
                          required
                          type="text"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full bg-transparent border-b border-white/20 text-white font-body py-3 px-1 transition-all duration-300 placeholder:text-gray-600 text-sm focus:outline-none focus:border-solar-orange focus:shadow-[0_4px_12px_rgba(249,176,60,0.15)]"
                          placeholder="e.g. Eyoub Sahle"
                        />
                      </div>

                      <div>
                        <label className="block font-display text-[10px] text-solar-orange tracking-wider font-semibold uppercase mb-2">
                          Your Email
                        </label>
                        <input
                          required
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full bg-transparent border-b border-white/20 text-white font-body py-3 px-1 transition-all duration-300 placeholder:text-gray-600 text-sm focus:outline-none focus:border-solar-orange focus:shadow-[0_4px_12px_rgba(249,176,60,0.15)]"
                          placeholder="e.g. eyoubsahle@gmail.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-display text-[10px] text-solar-orange tracking-wider font-semibold uppercase mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={contactForm.company}
                          onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                          className="w-full bg-transparent border-b border-white/20 text-white font-body py-3 px-1 transition-all duration-300 placeholder:text-gray-600 text-sm focus:outline-none focus:border-brand-blue focus:shadow-[0_4px_12px_rgba(50,104,186,0.15)]"
                          placeholder="e.g. Tsehay 360"
                        />
                      </div>

                      <div>
                        <label className="block font-display text-[10px] text-solar-orange tracking-wider font-semibold uppercase mb-2">
                          Project Type
                        </label>
                        <select
                          value={contactForm.projectType}
                          onChange={(e) => setContactForm({ ...contactForm, projectType: e.target.value })}
                          className="w-full bg-transparent border-b border-white/20 text-white font-body py-3 px-1 transition-all duration-300 text-sm focus:outline-none focus:border-brand-blue focus:shadow-[0_4px_12px_rgba(50,104,186,0.15)] cursor-pointer"
                        >
                          <option value="Full 360 Campaign" className="bg-[#111111] text-white">Full 360 Campaign</option>
                          <option value="ATL" className="bg-[#111111] text-white">Above-the-Line (ATL)</option>
                          <option value="BTL" className="bg-[#111111] text-white">Below-the-Line (BTL)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-display text-[10px] text-solar-orange tracking-wider font-semibold uppercase mb-2">
                        How can we help?
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full bg-transparent border-b border-white/20 text-white font-body py-3 px-1 transition-all duration-300 placeholder:text-gray-600 text-sm resize-none focus:outline-none focus:border-solar-orange focus:shadow-[0_4px_12px_rgba(249,176,60,0.15)]"
                        placeholder="Describe your vision, campaign timeline, or branding goals..."
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                      <motion.button
                        type="submit"
                        whileHover={{ y: -4, scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="premium-sheen-button group w-full sm:w-auto bg-solar-orange text-black font-bold font-display text-sm px-8 py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-solar-orange/30 border border-transparent"
                      >
                        <span>Start Your Project</span>
                        <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-2 transition-transform duration-300 ease-out shrink-0" />
                      </motion.button>

                      {/* past submissions triggers */}
                      {contactInquiries.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowInbox(!showInbox)}
                          className="text-xs text-on-surface-variant hover:text-white underline underline-offset-4 flex items-center gap-1 bg-transparent border-0 cursor-pointer"
                        >
                          <Clock className="w-3.5 h-3.5 text-solar-orange" />
                          View My Past Submissions ({contactInquiries.length})
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Stateful Submission Feedback */}
                  <AnimatePresence>
                    {contactSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="mt-6 p-4 rounded-xl bg-solar-orange/10 border border-solar-orange/30 text-solar-orange text-xs flex items-center gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <div>
                          <strong className="block font-semibold">Project inquiry received!</strong>
                          Our production leaders will reach out shortly to align on your vision.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Inline Client Inbox View (Transparent past inquiries helper) */}
                  <AnimatePresence>
                    {showInbox && contactInquiries.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-8 border-t border-white/10 pt-6"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-label-caps text-xs text-white font-bold tracking-wider">
                            YOUR INQUIRY LOGS (STORED LOCALLY)
                          </h4>
                          <button
                            onClick={() => {
                              setContactInquiries([]);
                              localStorage.removeItem("tsehay_inquiries");
                            }}
                            className="text-[10px] text-red-400 hover:text-red-300"
                          >
                            Clear Logs
                          </button>
                        </div>
                        <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                          {contactInquiries.map((inq) => (
                            <div key={inq.id} className="p-4 rounded-lg bg-white/2 border border-white/5">
                              <div className="flex justify-between text-xs mb-2">
                                <span className="font-bold text-white">{inq.name}</span>
                                <span className="text-[10px] text-slate-muted">{inq.timestamp}</span>
                              </div>
                              {inq.company && (
                                <p className="text-[11px] text-brand-blue mb-1">
                                  Company: <span className="text-white font-medium">{inq.company}</span>
                                </p>
                              )}
                              {inq.projectType && (
                                <p className="text-[11px] text-solar-orange mb-2">
                                  Project: <span className="text-white font-medium">{inq.projectType}</span>
                                </p>
                              )}
                              <p className="text-xs text-on-surface-variant leading-relaxed italic">
                                "{inq.message}"
                              </p>
                              <div className="text-[9px] text-solar-orange mt-2 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-solar-orange rounded-full animate-ping" />
                                Status: Pending Visionary Review
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#000000] border-t border-white/5 py-24 md:py-32 relative overflow-hidden flex items-center justify-center">
        {/* Subtle radial ambient blue/orange glow in the center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,104,186,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-7xl relative z-10 flex flex-col items-center justify-center text-center">
          <a
            className="font-display font-black text-white mega-footer-cta tracking-tighter inline-flex items-center justify-center gap-4 cursor-pointer select-none"
            href="https://linktr.ee/tsehaydigital"
            target="_blank"
            rel="noopener noreferrer"
          >
            CONNECT WITH US
            <span className="mega-footer-arrow">↗</span>
          </a>
        </div>
      </footer>

      {/* MODALS */}

      {/* 1. Partner Onboarding Modal */}
      <AnimatePresence>
        {showPartnerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPartnerModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl glass-panel rounded-3xl p-6 md:p-8 border-solar-orange/30 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Internal glow highlights */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-solar-orange/10 blur-3xl rounded-full pointer-events-none" />

              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-solar-orange animate-pulse" />
                  <h3 className="font-display text-lg md:text-xl font-extrabold text-white">
                    Partner With Us
                  </h3>
                </div>
                <button
                  onClick={() => setShowPartnerModal(false)}
                  className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all border border-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!partnerSubmitted ? (
                <form onSubmit={handlePartnerSubmit} className="space-y-6">
                  {/* Step Indicators */}
                  <div className="flex items-center gap-2 justify-center mb-6">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          partnerStep >= step ? "bg-solar-orange w-8" : "bg-white/10 w-4"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Step 1: Brand details */}
                  {partnerStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <h4 className="font-display text-sm font-bold text-white mb-2">
                        STEP 1: TELL US ABOUT YOUR BRAND
                      </h4>
                      <div>
                        <label className="block font-label-caps text-[10px] text-solar-orange tracking-widest uppercase mb-1.5">
                          Brand / Company Name
                        </label>
                        <input
                          required
                          type="text"
                          value={partnerData.brandName}
                          onChange={(e) => setPartnerData({ ...partnerData, brandName: e.target.value })}
                          className="w-full bg-white/3 border-b border-white/10 focus:border-solar-orange focus:ring-0 text-white font-body py-2.5 px-3 rounded-lg text-sm transition-all focus:bg-white/5"
                          placeholder="e.g. Tsehay 360"
                        />
                      </div>
                      <div>
                        <label className="block font-label-caps text-[10px] text-solar-orange tracking-widest uppercase mb-1.5">
                          Industry / Sector
                        </label>
                        <input
                          type="text"
                          value={partnerData.industry}
                          onChange={(e) => setPartnerData({ ...partnerData, industry: e.target.value })}
                          className="w-full bg-white/3 border-b border-white/10 focus:border-solar-orange focus:ring-0 text-white font-body py-2.5 px-3 rounded-lg text-sm transition-all focus:bg-white/5"
                          placeholder="e.g. Aviation, Consumer Goods"
                        />
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button
                          type="button"
                          disabled={!partnerData.brandName}
                          onClick={() => setPartnerStep(2)}
                          className="px-6 py-3 rounded-xl font-bold bg-solar-orange text-deep-void font-subtitle text-xs flex items-center gap-1 cursor-pointer disabled:opacity-40"
                        >
                          Next Step
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Campaign Goals */}
                  {partnerStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <h4 className="font-display text-sm font-bold text-white mb-2">
                        STEP 2: DEFINE YOUR VISION
                      </h4>
                      
                      <div className="space-y-3">
                        <label className="block font-label-caps text-[10px] text-solar-orange tracking-widest uppercase mb-2">
                          Primary Goals (Select all that apply)
                        </label>
                        
                        <div
                          onClick={() => toggleGoal("Above-the-Line (ATL)")}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            partnerData.goals.includes("Above-the-Line (ATL)")
                              ? "bg-solar-orange/10 border-solar-orange text-solar-orange"
                              : "bg-white/3 border-white/5 text-slate-muted hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Radio className="w-5 h-5" />
                            <div>
                              <p className="font-display text-xs font-bold text-white">Above-the-Line (ATL)</p>
                              <p className="text-[10px] text-on-surface-variant opacity-80">TV commercials, billboards, documentaries</p>
                            </div>
                          </div>
                          {partnerData.goals.includes("Above-the-Line (ATL)") && <CheckCircle2 className="w-4 h-4 text-solar-orange" />}
                        </div>

                        <div
                          onClick={() => toggleGoal("Below-the-Line (BTL)")}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            partnerData.goals.includes("Below-the-Line (BTL)")
                              ? "bg-solar-orange/10 border-solar-orange text-solar-orange"
                              : "bg-white/3 border-white/5 text-slate-muted hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Layers className="w-5 h-5" />
                            <div>
                              <p className="font-display text-xs font-bold text-white">Below-the-Line (BTL)</p>
                              <p className="text-[10px] text-on-surface-variant opacity-80">Localized activations, social activations, lead gen</p>
                            </div>
                          </div>
                          {partnerData.goals.includes("Below-the-Line (BTL)") && <CheckCircle2 className="w-4 h-4 text-solar-orange" />}
                        </div>
                      </div>

                      <div>
                        <label className="block font-label-caps text-[10px] text-solar-orange tracking-widest uppercase mb-1.5">
                          Estimated Campaign Budget (USD equivalent)
                        </label>
                        <select
                          value={partnerData.budget}
                          onChange={(e) => setPartnerData({ ...partnerData, budget: e.target.value })}
                          className="w-full bg-white/5 border-0 focus:ring-1 focus:ring-solar-orange text-white font-body py-2.5 px-3 rounded-lg text-sm transition-all text-on-surface select-arrow bg-[rgba(255,255,255,0.05)] border-b border-white/10"
                        >
                          <option className="bg-black text-white" value="$10k - $25k">$10k - $25k USD</option>
                          <option className="bg-black text-white" value="$25k - $50k">$25k - $50k USD</option>
                          <option className="bg-black text-white" value="$50k - $100k">$50k - $100k USD</option>
                          <option className="bg-black text-white" value="Over $100k">Over $100k USD</option>
                        </select>
                      </div>

                      <div className="pt-4 flex justify-between">
                        <button
                          type="button"
                          onClick={() => setPartnerStep(1)}
                          className="px-5 py-3 rounded-xl font-bold bg-white/5 text-white font-subtitle text-xs flex items-center gap-1 cursor-pointer hover:bg-white/10"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setPartnerStep(3)}
                          className="px-6 py-3 rounded-xl font-bold bg-solar-orange text-deep-void font-subtitle text-xs flex items-center gap-1 cursor-pointer"
                        >
                          Next Step
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Contact details */}
                  {partnerStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <h4 className="font-display text-sm font-bold text-white mb-2">
                        STEP 3: CONTACT INFORMATION
                      </h4>
                      <div>
                        <label className="block font-label-caps text-[10px] text-solar-orange tracking-widest uppercase mb-1.5">
                          Your Name
                        </label>
                        <input
                          required
                          type="text"
                          value={partnerData.contactName}
                          onChange={(e) => setPartnerData({ ...partnerData, contactName: e.target.value })}
                          className="w-full bg-white/3 border-b border-white/10 focus:border-solar-orange focus:ring-0 text-white font-body py-2.5 px-3 rounded-lg text-sm transition-all focus:bg-white/5"
                          placeholder="e.g. Eyoub Sahle"
                        />
                      </div>
                      <div>
                        <label className="block font-label-caps text-[10px] text-solar-orange tracking-widest uppercase mb-1.5">
                          Direct Contact Email
                        </label>
                        <input
                          required
                          type="email"
                          value={partnerData.email}
                          onChange={(e) => setPartnerData({ ...partnerData, email: e.target.value })}
                          className="w-full bg-white/3 border-b border-white/10 focus:border-solar-orange focus:ring-0 text-white font-body py-2.5 px-3 rounded-lg text-sm transition-all focus:bg-white/5"
                          placeholder="e.g. eyoubsahle@gmail.com"
                        />
                      </div>
                      <div>
                        <label className="block font-label-caps text-[10px] text-solar-orange tracking-widest uppercase mb-1.5">
                          Strategic Notes / Request Details
                        </label>
                        <textarea
                          rows={3}
                          value={partnerData.notes}
                          onChange={(e) => setPartnerData({ ...partnerData, notes: e.target.value })}
                          className="w-full bg-white/3 border-b border-white/10 focus:border-solar-orange focus:ring-0 text-white font-body py-2.5 px-3 rounded-lg text-sm transition-all resize-none focus:bg-white/5"
                          placeholder="Briefly tell us your preferred launch dates or brand challenges..."
                        />
                      </div>

                      <div className="pt-4 flex justify-between">
                        <button
                          type="button"
                          onClick={() => setPartnerStep(2)}
                          className="px-5 py-3 rounded-xl font-bold bg-white/5 text-white font-subtitle text-xs flex items-center gap-1 cursor-pointer hover:bg-white/10"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={!partnerData.contactName || !partnerData.email}
                          className="px-6 py-3 rounded-xl font-bold bg-solar-orange text-deep-void font-subtitle text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shadow-lg shadow-solar-orange/15"
                        >
                          <Sparkles className="w-4 h-4" />
                          SUBMIT VISION
                        </button>
                      </div>
                    </motion.div>
                  )}
                </form>
              ) : (
                /* Success screen */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-6"
                >
                  <div className="w-16 h-16 bg-solar-orange/20 rounded-full border border-solar-orange flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle2 className="w-8 h-8 text-solar-orange" />
                  </div>
                  <div>
                    <h4 className="font-display text-xl font-extrabold text-white">
                      Your Vision is Illuminated!
                    </h4>
                    <p className="font-body text-xs md:text-sm text-slate-muted mt-2 max-w-sm mx-auto leading-relaxed">
                      Thank you for submitting <strong>{partnerData.brandName}</strong> to Tsehay 360. Our lead strategist will review your goals and arrange a physical briefing.
                    </p>
                  </div>

                      <div className="p-4 rounded-xl bg-white/2 border border-white/5 text-left text-xs max-w-sm mx-auto space-y-1">
                        <p className="text-slate-muted uppercase text-[9px] font-label-caps tracking-widest">SUBMISSION SUMMARY</p>
                        <p className="text-white"><strong>Client Name:</strong> {partnerData.contactName}</p>
                        <p className="text-white"><strong>Contact Email:</strong> {partnerData.email}</p>
                        <p className="text-white"><strong>Budget tier:</strong> {partnerData.budget}</p>
                        <p className="text-[#ffd398]"><strong>Format selection:</strong> {partnerData.goals.join(", ") || "Full 360 Campaign"}</p>
                      </div>

                  <button
                    onClick={() => setShowPartnerModal(false)}
                    className="px-6 py-3 bg-solar-orange text-deep-void font-bold rounded-xl font-subtitle text-xs hover:bg-[#ffd398] transition-all cursor-pointer"
                  >
                    Got It, Thank You
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Cinematic Video Player Modal (Dairy documentary preview) */}
      <AnimatePresence>
        {showVideoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVideoModal(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl glass-panel rounded-2xl overflow-hidden shadow-2xl z-10 border border-white/10"
            >
              {/* Cinematic Video Playback Container */}
              <div className="aspect-video bg-black relative flex items-center justify-center group/video">
                <img
                  alt="Dairy Brand Documentary cinematic"
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBb5To7p3To_5UCwUG5ceSXS2gf6gCd7-PW1bVjk2gl_cP5kQSb14xIuwuVdYpLaJjlNsN7Y27AMoAI6lrdvIZBZUE__JyFg7vtYIIvcXmvexRlw647bbmscRxLRKyG5b_7S76jGVxluRSmv-VVZo7YM52WAj6ii8ProvvhE1xaEFoVciWi5gtOhVo2vwYTRdK8FGI8nwNU1W68ls8kM_goQWSVXo6cLjekkLrVGW4Gpc-HVJVx69tgrQ"
                />

                {/* Subtitle simulation overlay */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/80 px-4 py-2 rounded text-center text-xs md:text-sm text-white font-amharic border border-white/5 z-20 pointer-events-none shadow-xl max-w-[85%] leading-relaxed">
                  {videoProgress < 30 && "« የወተት ልማት የህብረተሰቡን ጤና በመጠበቅ ረገድ ከፍተኛ ጠቀሜታ አለው... »"}
                  {videoProgress >= 30 && videoProgress < 65 && "« ...በኢትዮጵያ ውስጥ ጥራት ያለው እና ዘመናዊ ምርት ለህዝባችን ማድረስ ዋነኛ ግባችን ነው... »"}
                  {videoProgress >= 65 && "« ...ትውልድ የሚታነፀው በንጹህ እና ጤናማ አመጋገብ ነው፤ ፀሐይ 360 ይህንን ታሪክ ያበራልናል:: »"}
                </div>

                {/* Ambient dynamic filter to simulate light flicker */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                {/* Top Overlay controls */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                    <span className="font-label-caps text-[10px] text-white tracking-widest font-bold bg-black/55 px-2.5 py-1 rounded">
                      STREAMING CINEMATIC PREVIEW
                    </span>
                  </div>
                  <button
                    onClick={() => setShowVideoModal(false)}
                    className="p-1 rounded-full bg-black/55 hover:bg-black/80 text-white/80 hover:text-white border border-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Control bar */}
                <div className="absolute bottom-4 left-4 right-4 glass-panel rounded-xl p-3 z-20 flex items-center justify-between gap-4 backdrop-blur-2xl bg-black/40">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setVideoProgress(0)}
                      className="text-white hover:text-solar-orange transition-colors p-1 bg-transparent border-0 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                    </button>
                    
                    <button
                      onClick={() => setIsVideoMuted(!isVideoMuted)}
                      className="text-white hover:text-solar-orange transition-colors p-1 bg-transparent border-0 cursor-pointer"
                    >
                      {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <span className="font-mono text-[10px] text-slate-muted hidden sm:inline">
                      {Math.floor((videoProgress * 3) / 100)}s / 03:00s
                    </span>
                  </div>

                  {/* Progress track */}
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden relative">
                    <div
                      className="absolute top-0 left-0 bottom-0 bg-solar-orange transition-all duration-300"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>

                  <span className="font-label-caps text-[10px] text-solar-orange font-bold">
                    Tsehay 360 Directing
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Poster Lightbox Modal */}
      <AnimatePresence>
        {selectedPoster && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPoster(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-lg w-full z-10 flex flex-col items-center"
            >
              <button
                onClick={() => setSelectedPoster(null)}
                className="absolute -top-12 right-0 p-1 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 cursor-pointer z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="glass-panel p-2 rounded-2xl border-white/10 shadow-2xl overflow-hidden max-h-[80vh]">
                <img
                  alt="High contrast poster view"
                  className="w-full h-auto max-h-[70vh] object-contain rounded-xl"
                  src={selectedPoster}
                />
              </div>

             
  );
}
