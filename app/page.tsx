"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Github, Instagram, Linkedin, Mail, MapPin, Menu, X } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { useMobile } from "@/hooks/use-mobile"
import { useWindowSize } from "@/hooks/use-window-size"
import Dither from "@/components/ui/Dither"
import Lanyard from "@/components/ui/lanyard"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useMobile()

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
  const { height: windowHeight } = useWindowSize()
  const isShortWindow = windowHeight < 700 // Threshold for short windows

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
    // Improved observer options with larger threshold and rootMargin
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -20% 0px", // Reduce sensitivity at top and bottom
      threshold: 0.5, // Require more of the section to be visible
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Skip updates during programmatic scrolling
      if (isProgrammaticScroll) return

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id

          // Only update if it's a different section
          if (id !== activeSection) {
            setActiveSection(id)
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    const sections = [section1Ref.current, section2Ref.current, section3Ref.current, section4Ref.current]

    sections.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section)
      })
    }
  }, [section1Ref, section2Ref, section3Ref, section4Ref, activeSection, isProgrammaticScroll])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY

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
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    if (ref.current) {
      // Set flag to indicate we're scrolling programmatically
      setIsProgrammaticScroll(true)

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
        <Link href="https://www.linkedin.com/in/jerrywu0430" target="_blank" aria-label="LinkedIn">
          <Linkedin className="h-6 w-6 hover:text-gray-400 transition-colors" />
        </Link>
        <Link href="https://github.com/JerryWu0430" target="_blank" aria-label="GitHub">
          <Github className="h-6 w-6 hover:text-gray-400 transition-colors" />
        </Link>
        <Link href="mailto:woohaoran@gmail.com" aria-label="Email">
          <Mail className="h-6 w-6 hover:text-gray-400 transition-colors" />
        </Link>
        <Link href="https://www.instagram.com/jerrywu0430" target="_blank" aria-label="Instagram">
          <Instagram className="h-6 w-6 hover:text-gray-400 transition-colors" />
        </Link>
      </div>
      <Link href="/resume.pdf" target="_blank">
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
    scrollToSection: (ref: React.RefObject<HTMLElement | null>) => void
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
          onClick={() => scrollToSection(sectionRef)}
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

      {/* Mobile Navigation */}
      {isMobile && <MobileNav />}
      
      {/* Hero Section */}
      <div className="relative min-h-[120vh] h-[120vh]">
        <div className="absolute inset-y--10 right-1 w-[100vw] h-full pointer-events-none z-[100] overflow-visible ">
            <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
        </div>
        {/* Replace the header div (the one with ref={headerRef}) with this updated version: */}
        <div
          ref={headerRef}
          className={`transition-all duration-700 ease-in-out ${
            scrolled && !isShortWindow
              ? "fixed top-0 left-0 w-full pt-6 md:pt-20 px-6 md:px-8 md:pl-8 lg:pl-32 z-[200]"
              : scrolled && isShortWindow
                ? "relative w-full pt-6 md:pt-10 px-6 md:px-8 md:pl-8 lg:pl-32 z-[200] mb-20"
                : "fixed top-1/2 left-0 md:left-[10%] lg:left-[20%] transform -translate-y-1/2 px-6 md:px-8 z-[200]"
          }`}
        >
          {scrolled ? (
            <div className="transition-all duration-700">
              <motion.h1
                key="scrolled-title"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
                className="text-3xl md:text-4xl font-bold"
              >
                Jerry Wu
              </motion.h1>
              <motion.h2
                key="scrolled-subtitle"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1.2 }}
                className="text-lg md:text-xl text-gray-300 mt-1"
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
                  className="mt-3 max-w-xs md:max-w-sm text-sm text-gray-300"
                >
                  I'm a software engineer with expertise in building user-focused applications. I also have a passion in the appliation of AI that solve real-world problems.
                </motion.p>
              )}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.h1
                key="initial-title"
                initial="initial"
                animate={isTransitioning ? "pixelate" : "initial"}
                exit="exit"
                variants={textVariants}
                transition={{ duration: 1.2 }}
                className="text-4xl md:text-5xl font-bold"
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
                className="mt-4 max-w-xs md:max-w-sm text-sm md:text-base text-gray-300"
              >
                I'm a software engineer with expertise in building user-focused applications. I also have a passion in the appliation of AI that solve real-world problems.
              </motion.p>
              {/* Social Media Icons and Resume Button - Initially under About Me */}
              <motion.div key="initial-social" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }} className="mt-6">
                <SocialAndResume />
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Left Navigation Menu - Appears when scrolled (desktop only) */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: scrolled && !isShortWindow ? 1 : 0,
              x: scrolled && !isShortWindow ? 0 : -20,
              pointerEvents: scrolled && !isShortWindow ? "auto" : "none",
            }}
            transition={{ duration: 0.5 }}
            className="fixed left-8 lg:left-32 top-[45%] transform -translate-y-1/2 z-[200] hidden md:block"
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

            {/* Social Media Icons and Resume Button */}
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
      </div>

      {/* Section 1 - About Me */}
      <section ref={section1Ref} id="section1" className="relative z-[150] py-20">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="w-full md:w-[70%] lg:w-[60%] ml-auto flex flex-col justify-center px-6 md:px-12 group/section"
        >
          <h2 className="text-[28px] font-semibold mb-5">About Me</h2>
          <div className="
            backdrop-blur-[0.5px]
            border border-transparent
            rounded-2xl
            p-6
            mb-5
            transition-all duration-300
            hover:border-white/20
            hover:backdrop-blur-md
            hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)]
            hover:-translate-y-1
            group-hover/section:text-white/50
            group-hover/section:opacity-50
            hover:!opacity-100
            hover:!text-white
          ">
            <p className="text-base leading-relaxed text-[#cccccc] transition-colors duration-300">
              I'm a passionate software engineer with a love for creating elegant solutions to complex problems. With a
              background in computer science and years of industry experience, I specialize in building modern web
              applications that are both functional and beautiful.
            </p>
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
          className="w-full md:w-[70%] lg:w-[60%] ml-auto flex flex-col justify-center px-6 md:px-12 group/section"
        >
          <h2 className="text-[28px] font-semibold mb-5">Experience</h2>
          
          {/* GoodNotes */}
          <div className="backdrop-blur-[0.5px] border border-transparent rounded-2xl p-6 mb-5 transition-all duration-300 hover:border-white/20 hover:backdrop-blur-md hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] hover:-translate-y-1 group-hover/section:text-white/50 group-hover/section:opacity-50 hover:!opacity-100 hover:!text-white">
            <div className="flex gap-4">
              <div className="w-[200px] h-[120px] relative rounded-lg overflow-hidden flex-shrink-0">
                <img src="/goodnotes.png" alt="GoodNotes" className="object-cover w-full h-full"/>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">Software Engineer Intern at GoodNotes</h3>
                <p className="text-xs text-[#cccccc] mt-1 mb-2 transition-colors duration-300">2025 - Present</p>
                <p className="text-sm leading-relaxed text-[#cccccc] mb-3 transition-colors duration-300">
                  B2B Team - Working on enterprise solutions and integrations.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["React", "TypeScript", "Node.js", "GraphQL"].map((tech) => (
                    <span key={tech} className="px-2 py-0.5 bg-[rgba(26,26,26,0.85)] rounded-full text-xs text-[#cccccc] transition-colors duration-300">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="backdrop-blur-[0.5px] border border-transparent rounded-2xl p-6 mb-5 transition-all duration-300 hover:border-white/20 hover:backdrop-blur-md hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] hover:-translate-y-1 group-hover/section:text-white/50 group-hover/section:opacity-50 hover:!opacity-100 hover:!text-white">
            <div className="flex gap-4">
              <div className="w-[200px] h-[120px] relative rounded-lg overflow-hidden flex-shrink-0">
                <img src="/meta.png" alt="Meta" className="object-cover w-full h-full"/>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">Software Engineering Intern at Meta</h3>
                <p className="text-xs text-[#cccccc] mt-1 mb-2 transition-colors duration-300">Summer 2024</p>
                <p className="text-sm leading-relaxed text-[#cccccc] mb-3 transition-colors duration-300">
                  Worked on the Instagram Stories team, implementing new features and improving performance.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["React", "Python", "Django", "AWS"].map((tech) => (
                    <span key={tech} className="px-2 py-0.5 bg-[rgba(26,26,26,0.85)] rounded-full text-xs text-[#cccccc] transition-colors duration-300">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Section 3 - Education */}
      <section ref={section3Ref} id="section3" className="relative z-[150] py-20">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="w-full md:w-[70%] lg:w-[60%] ml-auto flex flex-col justify-center px-6 md:px-12 group/section"
        >
          <h2 className="text-[28px] font-semibold mb-5">Education</h2>
          <div className="backdrop-blur-[0.5px] border border-transparent rounded-2xl p-6 mb-5 transition-all duration-300 hover:border-white/20 hover:backdrop-blur-md hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] hover:-translate-y-1 group-hover/section:text-white/50 group-hover/section:opacity-50 hover:!opacity-100 hover:!text-white">
            <div className="flex gap-4">
              <div className="w-[200px] h-[120px] relative rounded-lg overflow-hidden flex-shrink-0">
                <img src="/meta.png" alt="Meta" className="object-cover w-full h-full"/>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">Software Engineering Intern at Meta</h3>
                <p className="text-xs text-[#cccccc] mt-1 mb-2 transition-colors duration-300">Summer 2024</p>
                <p className="text-sm leading-relaxed text-[#cccccc] mb-3 transition-colors duration-300">
                  Worked on the Instagram Stories team, implementing new features and improving performance.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["React", "Python", "Django", "AWS"].map((tech) => (
                    <span key={tech} className="px-2 py-0.5 bg-[rgba(26,26,26,0.85)] rounded-full text-xs text-[#cccccc] transition-colors duration-300">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-[0.5px] border border-transparent rounded-2xl p-6 mb-5 transition-all duration-300 hover:border-white/20 hover:backdrop-blur-md hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] hover:-translate-y-1 group-hover/section:text-white/50 group-hover/section:opacity-50 hover:!opacity-100 hover:!text-white">
            <div className="flex gap-4">
              <div className="w-[200px] h-[120px] relative rounded-lg overflow-hidden flex-shrink-0">
                <img src="/meta.png" alt="Meta" className="object-cover w-full h-full"/>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">Software Engineering Intern at Meta</h3>
                <p className="text-xs text-[#cccccc] mt-1 mb-2 transition-colors duration-300">Summer 2024</p>
                <p className="text-sm leading-relaxed text-[#cccccc] mb-3 transition-colors duration-300">
                  Worked on the Instagram Stories team, implementing new features and improving performance.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["React", "Python", "Django", "AWS"].map((tech) => (
                    <span key={tech} className="px-2 py-0.5 bg-[rgba(26,26,26,0.85)] rounded-full text-xs text-[#cccccc] transition-colors duration-300">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </motion.div>
      </section>

      {/* Section 4 - Projects */}
      <section ref={section4Ref} id="section4" className="relative z-[150] py-20">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="w-full md:w-[70%] lg:w-[60%] ml-auto flex flex-col justify-center px-6 md:px-12 group/section"
        >
          <h2 className="text-[28px] font-semibold mb-5">Projects</h2>
          <div className="backdrop-blur-[0.5px] border border-transparent rounded-2xl p-6 mb-5 transition-all duration-300 hover:border-white/20 hover:backdrop-blur-md hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] hover:-translate-y-1 group-hover/section:text-white/50 group-hover/section:opacity-50 hover:!opacity-100 hover:!text-white">
            <div className="flex gap-4">
              <div className="w-[200px] h-[120px] relative rounded-lg overflow-hidden flex-shrink-0">
                <img src="/meta.png" alt="Meta" className="object-cover w-full h-full"/>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">Software Engineering Intern at Meta</h3>
                <p className="text-xs text-[#cccccc] mt-1 mb-2 transition-colors duration-300">Summer 2024</p>
                <p className="text-sm leading-relaxed text-[#cccccc] mb-3 transition-colors duration-300">
                  Worked on the Instagram Stories team, implementing new features and improving performance.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["React", "Python", "Django", "AWS"].map((tech) => (
                    <span key={tech} className="px-2 py-0.5 bg-[rgba(26,26,26,0.85)] rounded-full text-xs text-[#cccccc] transition-colors duration-300">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-[0.5px] border border-transparent rounded-2xl p-6 mb-5 transition-all duration-300 hover:border-white/20 hover:backdrop-blur-md hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] hover:-translate-y-1 group-hover/section:text-white/50 group-hover/section:opacity-50 hover:!opacity-100 hover:!text-white">
            <div className="flex gap-4">
              <div className="w-[200px] h-[120px] relative rounded-lg overflow-hidden flex-shrink-0">
                <img src="/meta.png" alt="Meta" className="object-cover w-full h-full"/>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">Software Engineering Intern at Meta</h3>
                <p className="text-xs text-[#cccccc] mt-1 mb-2 transition-colors duration-300">Summer 2024</p>
                <p className="text-sm leading-relaxed text-[#cccccc] mb-3 transition-colors duration-300">
                  Worked on the Instagram Stories team, implementing new features and improving performance.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["React", "Python", "Django", "AWS"].map((tech) => (
                    <span key={tech} className="px-2 py-0.5 bg-[rgba(26,26,26,0.85)] rounded-full text-xs text-[#cccccc] transition-colors duration-300">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </motion.div>
      </section>
    </main>
  )
}
