"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Github, Instagram, Linkedin, Mail, MapPin, Menu, X, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { useMobile } from "@/hooks/use-mobile"
import { useWindowSize } from "@/hooks/use-window-size"
import Dither from "@/components/ui/Dither"
import Lanyard from "@/components/ui/lanyard"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"
import { BorderTrail } from "@/components/ui/border-trail"

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useMobile()

  // Add useEffect for scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // References to each section for smooth scrolling
  const section1Ref = useRef<HTMLElement>(null)
  const section2Ref = useRef<HTMLElement>(null)
  const section3Ref = useRef<HTMLElement>(null)
  const section4Ref = useRef<HTMLElement>(null)

  const [activeSection, setActiveSection] = useState<string>("section1")
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [prevActiveSection, setPrevActiveSection] = useState<string | null>(null)

  // Add a flag to track if we're currently scrolling programmatically
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false)
  // Add a debounce timer ref
  const activeSectionTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Inside the Portfolio component, add this near the top with other state variables:
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const isShortWindow = windowHeight < 700 // Threshold for short windows
  const isMdWindow = windowWidth >= 768 && windowWidth < 1024 // Tailwind md range

  let leftOffset = 0;
  if (!isMobile && !isShortWindow && !isMdWindow && !scrolled) {
    // Interpolate between 0% at 768px and 20% at 1536px (lg)
    const minW = 768, maxW = 1536;
    const minPct = 0, maxPct = 0.2;
    const pct = Math.max(minPct, Math.min(maxPct, ((windowWidth - minW) / (maxW - minW)) * (maxPct - minPct) + minPct));
    leftOffset = windowWidth * pct;
  }

  // Update the useEffect that handles section changes with debounce
  useEffect(() => {
    // Clear any existing timer
    if (activeSectionTimerRef.current) {
      clearTimeout(activeSectionTimerRef.current)
    }

    // Set a new timer to update the previous active section
    activeSectionTimerRef.current = setTimeout(() => {
      if (activeSection !== prevActiveSection) {
        setPrevActiveSection(activeSection)
      }
    }, 100) // Short debounce to prevent jitter

    return () => {
      if (activeSectionTimerRef.current) {
        clearTimeout(activeSectionTimerRef.current)
      }
    }
  }, [activeSection, prevActiveSection])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Start transition effect before fully scrolled
      if (scrollPosition > 50 && scrollPosition < 150) {
        setIsTransitioning(true)
      } else {
        setIsTransitioning(false)
      }

      if (scrollPosition > 100) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }

      // --- New: Determine active section by top 10% of viewport ---
      if (!isProgrammaticScroll) {
        const sectionRefs = [
          { id: "section1", ref: section1Ref },
          { id: "section2", ref: section2Ref },
          { id: "section3", ref: section3Ref },
          { id: "section4", ref: section4Ref },
        ]
        const topThreshold = windowHeight * 0.1
        let closestSection = null
        let closestDistance = Infinity
        sectionRefs.forEach(({ id, ref }) => {
          if (ref.current) {
            const rect = ref.current.getBoundingClientRect()
            const distance = Math.abs(rect.top - topThreshold)
            // Only consider sections whose top is above or at the threshold
            if (rect.top <= topThreshold && distance < closestDistance) {
              closestSection = id
              closestDistance = distance
            }
          }
        })
        // If no section is above threshold, default to first section
        if (!closestSection) closestSection = "section1"
        if (activeSection !== closestSection) {
          setActiveSection(closestSection)
        }

        // Still keep the bottom-of-page logic for last section
        const bottomThreshold = 100 // px from bottom
        if (windowHeight + scrollPosition >= documentHeight - bottomThreshold) {
          if (activeSection !== "section4") {
            setActiveSection("section4")
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [activeSection, isProgrammaticScroll])

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>, sectionId?: string) => {
    if (ref.current) {
      // Set flag to indicate we're scrolling programmatically
      setIsProgrammaticScroll(true)

      // Instantly update active section for nav highlight
      if (sectionId) {
        setActiveSection(sectionId)
      }

      // Close mobile menu if open
      if (mobileMenuOpen) {
        setMobileMenuOpen(false)
      }

      // Using scrollIntoView with a slight delay to ensure proper scrolling
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" })

        // Reset the flag after scrolling is likely complete
        setTimeout(() => {
          setIsProgrammaticScroll(false)
        }, 1000) // Adjust based on typical scroll duration
      }, 100)
    }
  }

  // Pixelation effect variants
  const textVariants = {
    initial: {
      filter: "blur(0px)",
      scale: 1,
    },
    pixelate: {
      filter: ["blur(0px)", "blur(4px)", "blur(8px)", "blur(4px)", "blur(0px)"],
      scale: [1, 1.05, 1.1, 1.05, 1],
      transition: {
        duration: 0.5,
        times: [0, 0.25, 0.5, 0.75, 1],
      },
    },
    exit: {
      filter: "blur(0px)",
      scale: 1,
    },
  }

  // Social Icons and Resume Button component for reuse
  const SocialAndResume = ({ className = "" }: { className?: string }) => (
    <div className={`flex flex-wrap items-center gap-y-4 ${className}`}>
      <div className="flex gap-6 mr-8">
        <Link href="https://www.linkedin.com/in/jerrywu0430" target="_blank" aria-label="LinkedIn" className="pointer-events-auto">
          <Linkedin className="h-6 w-6 hover:text-gray-400 transition-colors" />
        </Link>
        <Link href="https://github.com/JerryWu0430" target="_blank" aria-label="GitHub" className="pointer-events-auto">
          <Github className="h-6 w-6 hover:text-gray-400 transition-colors" />
        </Link>
        <Link href="mailto:woohaoran@gmail.com" aria-label="Email" className="pointer-events-auto">
          <Mail className="h-6 w-6 hover:text-gray-400 transition-colors" />
        </Link>
        <Link href="https://www.instagram.com/jerrywu0430" target="_blank" aria-label="Instagram" className="pointer-events-auto">
          <Instagram className="h-6 w-6 hover:text-gray-400 transition-colors" />
        </Link>
      </div>
      <Link href="/resume.pdf" target="_blank" className="pointer-events-auto">
        <RainbowButton className="text-sm h-9 px-6">Resume</RainbowButton>
      </Link>
    </div>
  )

  // Mobile Navigation Menu
  const MobileNav = () => (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 right-4 z-50 p-2 bg-gray-900/80 rounded-full backdrop-blur-sm"
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col p-8 pt-16"
          >
            <nav className="flex flex-col space-y-6 mt-8">
              <NavItem
                sectionRef={section1Ref}
                label="About Me"
                scrollToSection={scrollToSection}
                activeSection={activeSection}
                sectionId="section1"
              />
              <NavItem
                sectionRef={section2Ref}
                label="Experiences"
                scrollToSection={scrollToSection}
                activeSection={activeSection}
                sectionId="section2"
              />
              <NavItem
                sectionRef={section3Ref}
                label="Education"
                scrollToSection={scrollToSection}
                activeSection={activeSection}
                sectionId="section3"
              />
              <NavItem
                sectionRef={section4Ref}
                label="Projects"
                scrollToSection={scrollToSection}
                activeSection={activeSection}
                sectionId="section4"
              />
            </nav>
            <div className="mt-auto mb-8">
              <SocialAndResume />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )

  const NavItem = ({
    sectionRef,
    label,
    scrollToSection,
    activeSection,
    sectionId,
  }: {
    sectionRef: React.RefObject<HTMLElement | null>
    label: string
    scrollToSection: (ref: React.RefObject<HTMLElement | null>, sectionId?: string) => void
    activeSection: string
    sectionId: string
  }) => {
    const isActive = activeSection === sectionId
    const isHovered = hoveredSection === sectionId && !isActive
    const wasJustActivated = activeSection === sectionId && prevActiveSection !== sectionId
    const animationDuration = 0.15

    return (
      <div className="relative py-1.5">
        <button
          onClick={() => scrollToSection(sectionRef, sectionId)}
          className="group flex items-center text-sm font-light"
          onMouseEnter={() => setHoveredSection(sectionId)}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <div className="flex items-center">
            <div className="w-24 relative flex items-center">
              {isActive && (
                <>
                  {wasJustActivated && !isProgrammaticScroll ? (
                    <motion.div
                      className="absolute h-[1px] bg-white"
                      initial={{ width: "2rem", opacity: 0.7 }}
                      animate={{ width: "4rem", opacity: 1 }}
                      transition={{ duration: animationDuration, ease: "easeInOut" }}
                    />
                  ) : (
                    <div
                      className="absolute h-[1px] bg-white"
                      style={{
                        width: "4rem",
                        opacity: 1,
                      }}
                    />
                  )}
                </>
              )}

              {isHovered && !isActive && (
                <motion.div
                  className="absolute h-[1px] bg-white"
                  initial={{ width: "2rem", opacity: 0.7 }}
                  animate={{ width: "4rem", opacity: 1 }}
                  exit={{ width: "2rem", opacity: 0.7 }}
                  transition={{ duration: animationDuration, ease: "easeInOut" }}
                />
              )}

              {!isActive && !isHovered && (
                <div
                  className="absolute h-[1px] bg-gray-600"
                  style={{
                    width: "2rem",
                    opacity: 0.7,
                  }}
                />
              )}
            </div>

            {isActive && (
              <>
                {wasJustActivated && !isProgrammaticScroll ? (
                  <motion.span
                    className="text-white -ml-4"
                    initial={{ x: 0 }}
                    animate={{ x: 8 }}
                    transition={{ duration: animationDuration, ease: "easeInOut" }}
                  >
                    {label}
                  </motion.span>
                ) : (
                  <div
                    className="text-white -ml-4"
                    style={{
                      transform: "translateX(8px)",
                    }}
                  >
                    {label}
                  </div>
                )}
              </>
            )}

            {!isActive && (
              <motion.span
                className={`${isHovered ? "text-white" : "text-gray-400"} -ml-4`}
                initial={{ x: 0 }}
                animate={{ x: isHovered ? 8 : 0 }}
                transition={{ duration: animationDuration, ease: "easeInOut" }}
              >
                {label}
              </motion.span>
            )}
          </div>
        </button>
      </div>
    )
  }

  const [hovered, setHovered] = useState<string | null>(null);

  // Define arrow motion variants
  const arrowVariants = {
    initial: { x: -2, y: 2 },
    hover: { x: 2, y: -2 },
  };

  return (
    <main className="min-h-screen text-white overflow-x-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Dither
          waveColor={[0.2, 0.2, 0.2]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.15}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div>

      {/* Header always at the top for small windows, sticky/fixed for large */}
      <div
        ref={headerRef}
        className={
          isMobile || isShortWindow || isMdWindow
            ? "relative w-full pt-6 px-6 z-[200] mb-0"
            : scrolled
              ? "fixed top-0 left-0 w-full pt-6 md:pt-20 px-6 md:px-8 md:pl-8 lg:pl-32 z-[200] pointer-events-none transition-all duration-700 ease-in-out"
              : "fixed top-1/2 left-0 md:left-[5%] lg:left-[20%] transform -translate-y-1/2 px-6 md:px-8 z-[200] pointer-events-none transition-all duration-700 ease-in-out"
        }
        style={
          !isMobile && !isShortWindow && !isMdWindow && !scrolled
            ? { left: leftOffset }
            : undefined
        }
      >
        {(scrolled && !(isMobile || isShortWindow || isMdWindow)) || (isMobile || isShortWindow || isMdWindow) ? (
          <div className="transition-all duration-700">
            <motion.h1
              key="scrolled-title"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="text-[48px] font-bold"
            >
              Jerry Wu
            </motion.h1>
            <motion.h2
              key="scrolled-subtitle"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1.2 }}
              className="text-[#ffffff] text-[20px] md:text-xl text-gray-300 mt-1"
            >
              Software Engineer
            </motion.h2>
            <motion.div
              key="scrolled-location"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1.2 }}
              className="flex items-center mt-2 text-gray-400"
            >
              <MapPin className="h-4 w-4 mr-1" />
              <span>London, UK 🇬🇧</span>
            </motion.div>
            {!isShortWindow && (
              <motion.p
                key="scrolled-description"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1.2 }}
                className="mt-3 max-w-[300px] md:max-w-[300px] text-[16px] text-gray-300"
              >
                I build user-focused applications with AI in mind.
              </motion.p>
            )}
            {/* Always show social buttons below header on small windows */}
            {(isMobile || isShortWindow || isMdWindow) && (
              <div className="mt-6">
                <SocialAndResume />
              </div>
            )}
          </div>
        ) : (
          <>
            <motion.h1
              key="initial-title"
              initial="initial"
              animate={isTransitioning && !(isMobile || isShortWindow || isMdWindow) ? "pixelate" : "initial"}
              exit="exit"
              variants={textVariants}
              transition={{ duration: 1.2 }}
              className="text-6xl md:text-6xl font-bold"
            >
              Hi, I'm Jerry Wu{" "}
              <motion.span
                key="wave-emoji"
                animate={{
                  rotate: [0, 10, 0],
                  transformOrigin: "bottom right",
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  duration: 2,
                  repeatDelay: 0,
                }}
                className="inline-block"
              >
                👋
              </motion.span>
            </motion.h1>
            <motion.p
              key="initial-description"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="mt-4 max-w-xs md:max-w-sm text-sm md:text-xl text-#FFFFFF"
            >
              Software Engineer with a strong passion for AI and building user-centric solutions to real-world problems.
            </motion.p>
            {/* Social Media Icons and Resume Button - Initially under About Me */}
            <motion.div key="initial-social" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }} className="mt-6">
              <SocialAndResume />
            </motion.div>
          </>
        )}
      </div>

      {!isMobile && !isShortWindow && !isMdWindow && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{
            opacity: scrolled ? 1 : 0,
            x: scrolled ? 0 : -20,
            pointerEvents: scrolled ? "auto" : "none",
          }}
          transition={{ duration: 0.5 }}
          className="fixed left-8 lg:left-32 top-[45%] transform -translate-y-1/2 z-[200] hidden md:block text-[12px]"
        >
          <nav className="space-y-6">
            <NavItem
              sectionRef={section1Ref}
              label="About Me"
              scrollToSection={scrollToSection}
              activeSection={activeSection}
              sectionId="section1"
            />
            <NavItem
              sectionRef={section2Ref}
              label="Experiences"
              scrollToSection={scrollToSection}
              activeSection={activeSection}
              sectionId="section2"
            />
            <NavItem
              sectionRef={section3Ref}
              label="Education"
              scrollToSection={scrollToSection}
              activeSection={activeSection}
              sectionId="section3"
            />
            <NavItem
              sectionRef={section4Ref}
              label="Projects"
              scrollToSection={scrollToSection}
              activeSection={activeSection}
              sectionId="section4"
            />
          </nav>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-24"
          >
            <SocialAndResume />
          </motion.div>
        </motion.div>
      )}

      {/* Hero Section (background, lanyard, etc.) only for large screens */}
      {!(isMobile || isShortWindow || isMdWindow) && (
        <div className="relative min-h-[120vh] h-[120vh]">
          <div className="absolute top-0 right-0 w-full h-[600px] pointer-events-none z-[100] overflow-visible">
            <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
          </div>
        </div>
      )}

      {/* About Me section (no overlap, always below header) */}
      <section ref={section1Ref} id="section1" className="relative z-[150] py-20">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="w-full lg:w-[55%] xl:w-[50%] xl:ml-auto xl:mr-24 ml-0 mr-0 px-6 lg:ml-auto lg:mr-0 lg:px-12 flex flex-col justify-center group/section"
        >
          <h2 className="text-[20px] font-semibold mb-5">About Me</h2>
          <div>
            <p className="text-[16px] leading-relaxed text-[#cccccc] transition-colors duration-300" style={{ marginBottom: '1em' }}>I'm a software engineer passionate about building intuitive, <span style={{ color: 'white', fontWeight: 'bold' }}>full-stack</span> applications that bring together clean design, rich interactivity, and smart systems. My favorite work blends UI/UX precision with the possibilities of <span style={{ color: 'white', fontWeight: 'bold' }}>AI</span> — from thoughtful animations to integrating large language models that enhance user experience.</p>
            <p className="text-[16px] leading-relaxed text-[#cccccc] transition-colors duration-300" style={{ marginBottom: '1em' }}>Currently, I'm a Software Engineering Intern at Goodnotes (starting soon!), where I'll be joining the B2B team. I'm also a second-year Computer Science student at UCL, where I've been actively involved in both technical and <span style={{ color: 'white', fontWeight: 'bold' }}>leadership</span> roles — serving as the Technical Director at the UCL Legal Tech Society, Data Lead at the UCL Data Visualisation Society, and Vice President of Growth at the UCL FinTech Society.</p>
            <p className="text-[16px] leading-relaxed text-[#cccccc] transition-colors duration-300" style={{ marginBottom: '1em' }}>My technical interests span <span style={{ color: 'white', fontWeight: 'bold' }}>full-stack development</span>, <span style={{ color: 'white', fontWeight: 'bold' }}>machine learning</span>, and <span style={{ color: 'white', fontWeight: 'bold' }}>AI integration</span>. I work primarily with Python, TypeScript, React, and PostgreSQL. I'm particularly excited about opportunities at the intersection of ML/AI and product — and am currently open to research or applied work involving LLMs or intelligent systems.</p>
            <p className="text-[16px] leading-relaxed text-[#cccccc] transition-colors duration-300">Outside of tech, you'll probably find me on a<span className="volleyball-cursor font-bold text-white mx-1">volleyball</span>court or<span className="cooking-cursor font-bold text-white mx-1">cooking</span>something new in the kitchen.</p>
          </div>
        </motion.div>
      </section>

      {/* Section 2 - Experiences */}
      <section ref={section2Ref} id="section2" className="relative z-[150] py-20">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="w-full lg:w-[55%] xl:w-[50%] xl:ml-auto xl:mr-24 ml-0 mr-0 px-6 lg:ml-auto lg:mr-0 lg:px-12 flex flex-col justify-center group/section"
        >
          <h2 className="text-[20px] font-semibold mb-5">Experience</h2>
          
          {/* GoodNotes */}
          <motion.div
            onHoverStart={() => setHovered('goodnotes')}
            onHoverEnd={() => setHovered(null)}
            className="backdrop-blur-[0.5px] border border-transparent rounded-2xl p-6 mb-5 transition-all duration-300 hover:border-white/20 hover:backdrop-blur-md hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] hover:-translate-y-1 group-hover/section:text-white/50 group-hover/section:opacity-50 hover:!opacity-100 hover:!text-white relative group/card"
          >
            <BorderTrail
              className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow: "0px 0px 30px 15px rgb(255 255 255 / 25%), 0 0 50px 30px rgb(0 0 0 / 25%)",
              }}
              size={60}
            />
            <div className="flex flex-row gap-8 items-start">
              {/* Date on the left */}
              <div className="min-w-[115px] flex flex-col items-start pt-1">
                <span className="text-[12px] font-semibold text-gray-400 tracking-widest">2025 — PRESENT</span>
              </div>
              {/* Main content on the right */}
              <div className="flex-1 flex flex-col">
                <div className="flex flex-row items-center gap-2">
                  <h3 className="text-lg font-semibold">Software Engineer Intern @ GoodNotes</h3>
                  {/* Optionally add a link or icon here */}
                </div>
                {/*<p className="text-[14px] leading-relaxed text-[#cccccc] mb-3 mt-1 transition-colors duration-300">
                  B2B Team - Working on enterprise solutions and integrations.
                </p>*/}
                {/* Tech stack (optional, add if you want) */}
                {/* <div className="flex flex-wrap gap-2 mt-2">
                  {["React", "TypeScript", "Node.js", "GraphQL"].map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-[rgba(26,26,26,0.85)] rounded-full text-xs text-[#7de2d1] font-medium transition-colors duration-300">{tech}</span>
                  ))}
                </div> */}
              </div>
            </div>

          </motion.div>

          
        </motion.div>
      </section>

      {/* Section 3 - Education */}
      <section ref={section3Ref} id="section3" className="relative z-[150] py-20">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="w-full lg:w-[55%] xl:w-[50%] xl:ml-auto xl:mr-24 ml-0 mr-0 px-6 lg:ml-auto lg:mr-0 lg:px-12 flex flex-col justify-center group/section"
        >
          <h2 className="text-[20px] font-semibold mb-5">Education</h2>
          <motion.div
            whileHover="hover"
            className="backdrop-blur-[0.5px] border border-transparent rounded-2xl p-6 mb-5 transition-all duration-300 hover:border-white/20 hover:backdrop-blur-md hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] hover:-translate-y-1 group-hover/section:text-white/50 group-hover/section:opacity-50 hover:!opacity-100 hover:!text-white relative group/card"
          >
            <BorderTrail
              className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow: "0px 0px 30px 15px rgb(255 255 255 / 25%), 0 0 50px 30px rgb(0 0 0 / 25%)",
              }}
              size={60}
            />
            <div className="flex gap-4 items-center">
              <div className="w-[160px] h-[100px] relative rounded-lg overflow-hidden flex-shrink-0 bg-[rgba(26,26,26,0.5)]">
                <img src="/ucl.png" alt="ucl"  />
              </div>
              <div className="flex flex-col">
              <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">University College London</h3>
                  <p className="text-xs text-[#cccccc] transition-colors duration-300">Sep 2023 - Jun 2026</p>
                </div>
                <p className="text-sm leading-relaxed text-[#cccccc] mt-0 mb-2">
                  <i>Bachelor of Science in Computer Science</i>
                </p>
                <div className="text-sm leading-relaxed text-[#cccccc] mb-0 transition-colors duration-300">
                  <p><b>Activities & Societies</b>: Vice President @ UCL FinTech Society, Data Lead @ UCL DataViz Society, Technical Director @ UCL Legal Tech Society, Volleyball Mixed Team @ LUSL UCL Mixed Team</p>
                </div>

              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover="hover"
            className="backdrop-blur-[0.5px] border border-transparent rounded-2xl p-6 mb-5 transition-all duration-300 hover:border-white/20 hover:backdrop-blur-md hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] hover:-translate-y-1 group-hover/section:text-white/50 group-hover/section:opacity-50 hover:!opacity-100 hover:!text-white relative group/card"
          >
            <BorderTrail
              className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow: "0px 0px 30px 15px rgb(255 255 255 / 25%), 0 0 50px 30px rgb(0 0 0 / 25%)",
              }}
              size={60}
            />
            <div className="flex gap-4 items-center">
              <div className="w-[160px] h-[100px] relative rounded-lg overflow-hidden flex-shrink-0 bg-[rgba(26,26,26,0.5)]">
                <img src="/asm.png" alt="ASM"  />
              </div>
              <div className="flex flex-col">

                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">American School of Milan</h3>
                  <p className="text-xs text-[#cccccc] transition-colors duration-300">Aug 2019 - May 2023</p>
                </div>

                <p className="text-sm leading-relaxed text-[#cccccc] mt-0 mb-2">
                  <i>International Baccalaureate Diploma</i>
                </p>

                <div className="text-sm leading-relaxed text-[#cccccc] mb-0 transition-colors duration-300">
                  <p><b>Activities & Societies:</b> Tech Team Leader, Varsity Volleyball, Varsity Basketball, National Honor Society Member</p>
                  <p><b>Awards:</b> Honor Roll, Computer Science Award</p>
                </div>

              </div>
            </div>
          </motion.div>
          
        </motion.div>
      </section>

      {/* Section 4 - Projects */}
      <section ref={section4Ref} id="section4" className="relative z-[150] py-20">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="w-full lg:w-[55%] xl:w-[50%] xl:ml-auto xl:mr-24 ml-0 mr-0 px-6 lg:ml-auto lg:mr-0 lg:px-12 flex flex-col justify-center group/section"
        >
          <h2 className="text-[20px] font-semibold mb-5">Projects</h2>

          {/* Personal Portfolio */}
          <motion.div
            onHoverStart={() => setHovered('portfolio')}
            onHoverEnd={() => setHovered(null)}
            className="backdrop-blur-[0.5px] border border-transparent rounded-2xl p-6 mb-5 transition-all duration-300 hover:border-white/20 hover:backdrop-blur-md hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] hover:-translate-y-1 group-hover/section:text-white/50 group-hover/section:opacity-50 hover:!opacity-100 hover:!text-white relative group/card"
          >
            <BorderTrail
              className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow: "0px 0px 30px 15px rgb(255 255 255 / 25%), 0 0 50px 30px rgb(0 0 0 / 25%)",
              }}
              size={60}
            />
            <div className="flex gap-4 items-center">
              <div className="w-[160px] h-[100px] relative rounded-lg overflow-hidden flex-shrink-0 bg-[rgba(26,26,26,0.5)]">
                <img src="/portfolio.png" alt="Personal Portfolio" className="object-contain w-full h-full" />
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Portfolio Website</h3>
                    <motion.a
                      href="https://github.com/JerryWu0430/my_portfolio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex pointer-events-auto"
                      variants={arrowVariants}
                      initial="initial"
                      animate={hovered === 'portfolio' ? 'hover' : 'initial'}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <ArrowUpRight className="w-4 h-4 text-[#cccccc]" />
                    </motion.a>
                  </div>
                  <p className="text-xs text-[#cccccc] transition-colors duration-300">May 2025</p>
                </div>
                <p className="text-sm leading-relaxed text-[#cccccc] mb-3 mt-2 transition-colors duration-300">
                  Designed, built, and maintained this portfolio to showcase my projects, experience, and skills. Focused on modern UI/UX, smooth animations, and responsive design using the latest web technologies.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Next.js", "React", "TypeScript", "Tailwind CSS"].map((tech) => (
                    <span key={tech} className="px-2 py-0.5 bg-[rgba(26,26,26,0.85)] rounded-full text-xs text-[#cccccc] transition-colors duration-300">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ReadingStar */}
          <motion.div
            onHoverStart={() => setHovered('readingstar')}
            onHoverEnd={() => setHovered(null)}
            className="backdrop-blur-[0.5px] border border-transparent rounded-2xl p-6 mb-5 transition-all duration-300 hover:border-white/20 hover:backdrop-blur-md hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] hover:-translate-y-1 group-hover/section:text-white/50 group-hover/section:opacity-50 hover:!opacity-100 hover:!text-white relative group/card"
          >
            <BorderTrail
              className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow: "0px 0px 30px 15px rgb(255 255 255 / 25%), 0 0 50px 30px rgb(0 0 0 / 25%)",
              }}
              size={60}
            />
            <div className="flex gap-4 items-center">
              <div className="w-[160px] h-[100px] relative rounded-lg overflow-hidden flex-shrink-0 bg-[rgba(26,26,26,0.5)]">
                <img 
                  src="/readingstar.png" 
                  alt="ReadingStar" 
                />
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold ">ReadingStar</h3>
                    <motion.a
                      href="https://github.com/JerryWu0430/readingstar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex pointer-events-auto"
                      variants={arrowVariants}
                      initial="initial"
                      animate={hovered === 'readingstar' ? 'hover' : 'initial'}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <ArrowUpRight className="w-4 h-4 text-[#cccccc]" />
                    </motion.a>
                  </div>
                  <p className="text-xs text-[#cccccc] transition-colors duration-300">Sep 2024 - Mar 2025</p>
                </div>
                <p className="text-sm leading-relaxed text-[#cccccc] mb-3 mt-2 transition-colors duration-300">
                  Collaborated with Intel and National Autistic Society to develop a karaoke application gamifying speech therapy to help neurodivergent children improve speech fluency. Developed a full-stack Windows application using OpenVino speech matching with React Native.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Python", "OpenVino", "React Native", "JavaScript", "TypeScript"].map((tech) => (
                    <span key={tech} className="px-2 py-0.5 bg-[rgba(26,26,26,0.85)] rounded-full text-xs text-[#cccccc] transition-colors duration-300">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* EarnIt */}
          <motion.div
            onHoverStart={() => setHovered('earnit')}
            onHoverEnd={() => setHovered(null)}
            className="backdrop-blur-[0.5px] border border-transparent rounded-2xl p-6 mb-5 transition-all duration-300 hover:border-white/20 hover:backdrop-blur-md hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] hover:-translate-y-1 group-hover/section:text-white/50 group-hover/section:opacity-50 hover:!opacity-100 hover:!text-white relative group/card"
          >
            <BorderTrail
              className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow: "0px 0px 30px 15px rgb(255 255 255 / 25%), 0 0 50px 30px rgb(0 0 0 / 25%)",
              }}
              size={60}
            />
            <div className="flex gap-4 items-center">
              <div className="w-[160px] h-[100px] relative rounded-lg overflow-hidden flex-shrink-0 bg-[rgba(26,26,26,0.5)]">
                <img 
                  src="/earnit.png" 
                  alt="EarnIt" 
                />
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">EarnIt</h3>
                    <motion.a
                      href="https://github.com/JerryWu0430/EarnIt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex pointer-events-auto"
                      variants={arrowVariants}
                      initial="initial"
                      animate={hovered === 'earnit' ? 'hover' : 'initial'}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <ArrowUpRight className="w-4 h-4 text-[#cccccc]" />
                    </motion.a>
                  </div>
                  <p className="text-xs text-[#cccccc] transition-colors duration-300">Feb 2025</p>
                </div>
                <p className="text-sm leading-relaxed text-[#cccccc] mb-3 mt-2 transition-colors duration-300">
                  Developed an iOS rewards-based productivity application that allows users to earn screen time through completion of quizzes, specifically targeting highschoolers undergoing GCSE or A-Level to further promote gamified revision.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Swift", "Firebase", "PostgreSQL", "CSS", "Figma"].map((tech) => (
                    <span key={tech} className="px-2 py-0.5 bg-[rgba(26,26,26,0.85)] rounded-full text-xs text-[#cccccc] transition-colors duration-300">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Yusuf AI */}
          <motion.div
            onHoverStart={() => setHovered('yusuf')}
            onHoverEnd={() => setHovered(null)}
            className="backdrop-blur-[0.5px] border border-transparent rounded-2xl p-6 mb-5 transition-all duration-300 hover:border-white/20 hover:backdrop-blur-md hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] hover:-translate-y-1 group-hover/section:text-white/50 group-hover/section:opacity-50 hover:!opacity-100 hover:!text-white relative group/card"
          >
            <BorderTrail
              className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow: "0px 0px 30px 15px rgb(255 255 255 / 25%), 0 0 50px 30px rgb(0 0 0 / 25%)",
              }}
              size={60}
            />
            <div className="flex gap-4 items-center">
              <div className="w-[160px] h-[100px] relative rounded-lg overflow-hidden flex-shrink-0 bg-[rgba(26,26,26,0.5)]">
                <img 
                  src="/yusuf.png" 
                  alt="Yusuf AI" 
                />
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Yusuf AI</h3>
                    <motion.a
                      href="https://github.com/JerryWu0430/Yusuf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex pointer-events-auto"
                      variants={arrowVariants}
                      initial="initial"
                      animate={hovered === 'yusuf' ? 'hover' : 'initial'}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <ArrowUpRight className="w-4 h-4 text-[#cccccc]" />
                    </motion.a>
                  </div>
                  <p className="text-xs text-[#cccccc] transition-colors duration-300">Dec 2024</p>
                </div>
                <p className="text-sm leading-relaxed text-[#cccccc] mb-3 mt-2 transition-colors duration-300">
                  Developed a web application designed to analyze CVs and provide professional summaries, job recommendations, and other related functionalities. Leveraged Groq's vision model and Coresignal's API.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Python", "Flask", "Groq", "Coresignal API", "HTML", "CSS", "JavaScript"].map((tech) => (
                    <span key={tech} className="px-2 py-0.5 bg-[rgba(26,26,26,0.85)] rounded-full text-xs text-[#cccccc] transition-colors duration-300">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* OpenAnnot */}
          <motion.div
            onHoverStart={() => setHovered('openannot')}
            onHoverEnd={() => setHovered(null)}
            className="backdrop-blur-[0.5px] border border-transparent rounded-2xl p-6 mb-5 transition-all duration-300 hover:border-white/20 hover:backdrop-blur-md hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] hover:-translate-y-1 group-hover/section:text-white/50 group-hover/section:opacity-50 hover:!opacity-100 hover:!text-white relative group/card"
          >
            <BorderTrail
              className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow: "0px 0px 30px 15px rgb(255 255 255 / 25%), 0 0 50px 30px rgb(0 0 0 / 25%)",
              }}
              size={60}
            />
            <div className="flex gap-4 items-center">
              <div className="w-[160px] h-[100px] relative rounded-lg overflow-hidden flex-shrink-0 bg-[rgba(26,26,26,0.5)]">
                <img 
                  src="/openannot.png" 
                  alt="OpenAnnot" 
                />
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">OpenAnnot</h3>
                    <motion.a
                      href="https://github.com/JerryWu0430/OpenAnnot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex pointer-events-auto"
                      variants={arrowVariants}
                      initial="initial"
                      animate={hovered === 'openannot' ? 'hover' : 'initial'}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <ArrowUpRight className="w-4 h-4 text-[#cccccc]" />
                    </motion.a>
                  </div>
                  <p className="text-xs text-[#cccccc] transition-colors duration-300">Oct 2024</p>
                </div>
                <p className="text-sm leading-relaxed text-[#cccccc] mb-3 mt-2 transition-colors duration-300">
                  Developed a decentralized data annotation platform using Rust and Stellar blockchain hosted with Next.js. Implemented smart contracts for transparent, scalable data labelling and integrated Stellar for global payments.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Rust", "Stellar", "Next.js"].map((tech) => (
                    <span key={tech} className="px-2 py-0.5 bg-[rgba(26,26,26,0.85)] rounded-full text-xs text-[#cccccc] transition-colors duration-300">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </section>
    </main>
  )
}
