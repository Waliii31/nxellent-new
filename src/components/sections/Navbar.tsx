"use client"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, X, Bell, ChevronDown } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import PrimaryButton from "../ui/PrimaryButton"
import SecondaryButton from "../ui/SecondaryButton"
import NotificationDrawer from "../notifications/NotificationDrawer"
import { useSelector } from "react-redux"
import type { RootState } from "../../app/store"
import { useUnreadCount } from "../../hooks/api/useNotifications"
import { useUserProfile } from "../../hooks/api/useUser"

type NavbarProps = {
  isFixed?: boolean
}

export default function Navbar({ isFixed = true }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const token = useSelector((s: RootState) => s.auth.token)

  // Get unread notifications count
  const unreadQuery = useUnreadCount({ enabled: !!token })
  const { data: user } = useUserProfile()
  const isInvestor = user?.role === "investor"
  const userInitial = user?.profile?.name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  useEffect(() => {
    if (!isFixed) return
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [isFixed])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Reset moreOpen when menu closes
  useEffect(() => {
    if (!menuOpen) setMoreOpen(false)
  }, [menuOpen])

  const handleLogout = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <>
      {/* Spacer so content does not go under navbar */}
      {isFixed && <div className="h-[88px]" />}

      {/* Navbar */}
      <nav
        className={`${isFixed ? "fixed top-0 left-0" : "relative"} 
                    w-full transition-colors duration-300 
                    z-99999 isolate
                    ${isFixed && scrolled
            ? "bg-black/30 backdrop-blur-md border-b border-white/10"
            : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6">

          {/* Logo */}
          <h1
            onClick={() => navigate("/")}
            className="text-white font-extrabold cursor-pointer text-2xl tracking-wide flex items-center"
          >
            <img src="/Nxellent-logos/desktop_logo_SVG_160x50.svg" alt="Nxellent Logo" className="h-6 md:h-10 w-auto object-contain" />
          </h1>

          {/* Desktop Links */}
          <ul className="hidden min-[1050px]:flex items-center space-x-10 text-white text-[15px] font-medium">
            <li>
              <Link to="/leaderboard" className="hover:text-gray-300 transition">
                Leaderboard
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:text-gray-300 transition">
                How It Works
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-gray-300 transition">
                Pricing
              </Link>
            </li>
            {token && (
              <li>
                <Link to="/projects/my-projects" className="hover:text-gray-300 transition">
                  My Projects
                </Link>
              </li>
            )}
            {isInvestor && (
              <li className="relative group" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
                <button
                  className="flex items-center gap-1 hover:text-gray-300 transition focus:outline-none"
                  onClick={() => setMoreOpen(!moreOpen)}
                >
                  More
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {moreOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-[#2A2355] bg-[#000124]/90 backdrop-blur-xl shadow-[0_0_40px_0_#A855F733] overflow-hidden p-2 z-50"
                    >
                      <li>
                        <Link
                          to="/investor-portfolio"
                          className="block px-4 py-3 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                          onClick={() => setMoreOpen(false)}
                        >
                          Investor Portfolio
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/batch-scanner"
                          className="block px-4 py-3 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                          onClick={() => setMoreOpen(false)}
                        >
                          Batch Scanner
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/compare-projects"
                          className="block px-4 py-3 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                          onClick={() => setMoreOpen(false)}
                        >
                          Compare Projects
                        </Link>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            )}
          </ul>

          {/* Desktop Buttons */}
          <div className="hidden min-[1050px]:flex items-center space-x-4">

            {/* Notification Button */}
            {token && (
              <button
                onClick={() => setDrawerOpen(true)}
                className="relative p-3 cursor-pointer rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
              >
                <Bell size={20} />
                <span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                >
                  {unreadQuery.data?.count || 0}
                </span>
              </button>
            )}

            {token ? (
              <SecondaryButton children="Scan Project" whereTo="scanner" />
            ) : (
              <SecondaryButton children="Leaderboard" whereTo="leaderboard" />
            )}

            {token ? (
              <PrimaryButton type="button" onClick={handleLogout}>
                Logout
              </PrimaryButton>
            ) : (
              <PrimaryButton type="button" whereTo="auth/signup">
                Get started
              </PrimaryButton>
            )}

            {token && (
              <button onClick={() => navigate("/profile")} className="w-12 h-12 shrink-0 cursor-pointer rounded-full bg-linear-to-br from-[#FD7EFF] to-[#A855F7] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {userInitial}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMenuOpen((v) => !v)}
            className="min-[1050px]:hidden text-white cursor-pointer focus:outline-none z-100000"
            aria-label="Open menu"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </motion.button>
        </div>

        {/* Mobile Overlay */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-100000 bg-black/85 backdrop-blur-xl"
              onClick={() => setMenuOpen(false)}
            >
              <motion.button
                whileTap={{ scale: 0.92 }}
                aria-label="Close menu"
                onClick={(e) => {
                  e.stopPropagation()
                  setMenuOpen(false)
                }}
                className="absolute top-5 right-5 p-2 rounded-full text-white cursor-pointer
                          bg-white/10 hover:bg-white/20 border border-white/20
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <X size={22} />
              </motion.button>

              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="h-full w-full flex flex-col justify-center items-center gap-8 text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <Link to="/leaderboard" className="text-2xl font-medium hover:text-gray-300">
                  Leaderboard
                </Link>
                <Link to="/how-it-works" className="text-2xl font-medium hover:text-gray-300">
                  How It Works
                </Link>
                <Link to="/pricing" className="text-2xl font-medium hover:text-gray-300">
                  Pricing
                </Link>
                {token && (
                  <Link to="/projects/my-projects" className="text-2xl font-medium hover:text-gray-300">
                    My Projects
                  </Link>
                )}

                {/* Mobile More Dropdown */}
                {isInvestor && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <button
                      className="flex items-center gap-2 text-2xl font-medium hover:text-gray-300 transition-colors focus:outline-none"
                      onClick={() => setMoreOpen(!moreOpen)}
                    >
                      More
                      <ChevronDown
                        size={20}
                        className={`transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {moreOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden flex flex-col items-center gap-4 w-full"
                        >
                          <Link
                            to="/investor-portfolio"
                            className="text-xl text-white/80 hover:text-white transition-colors"
                            onClick={() => setMenuOpen(false)}
                          >
                            Investor Portfolio
                          </Link>
                          <Link
                            to="/batch-scanner"
                            className="text-xl text-white/80 hover:text-white transition-colors"
                            onClick={() => setMenuOpen(false)}
                          >
                            Batch Scanner
                          </Link>
                          <Link
                            to="/compare-projects"
                            className="text-xl text-white/80 hover:text-white transition-colors"
                            onClick={() => setMenuOpen(false)}
                          >
                            Compare Projects
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <div className="mt-2 flex flex-col items-center gap-4 w-11/12 max-w-sm">
                  {/* Mobile Notification Button */}
                  <SecondaryButton>Leaderboard</SecondaryButton>
                  {token && (
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        navigate("/profile")
                      }}
                      className="px-4 py-3 rounded-xl bg-white/10 text-white w-full border border-white/10 hover:bg-white/20 transition flex items-center justify-center gap-2"
                    >
                      <div className="w-6 h-6 shrink-0 rounded-full bg-linear-to-br from-[#FD7EFF] to-[#A855F7] flex items-center justify-center text-white font-bold text-xs shadow-lg">
                        {userInitial}
                      </div>
                      Profile
                    </button>
                  )}
                  {token && (
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        setDrawerOpen(true)
                      }}
                      className="px-4 py-3 rounded-xl bg-white/10 text-white w-full border border-white/10 hover:bg-white/20 transition flex items-center justify-center gap-2"
                    >
                      <Bell size={20} />
                      Notifications
                    </button>
                  )}

                  {token ? (
                    <button
                      onClick={handleLogout}
                      className="rounded-xl px-5 py-3 bg-white/10 text-white font-medium hover:bg-white/20 transition w-full"
                    >
                      Logout
                    </button>
                  ) : (
                    <PrimaryButton type="button" whereTo="auth/signup">
                      Get started
                    </PrimaryButton>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Notification Drawer */}
      <NotificationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}