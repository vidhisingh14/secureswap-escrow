"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  ArrowRight,
  Lock,
  Zap,
  Globe,
  Star,
  Wallet,
  ChevronRight,
  BarChart3,
  DollarSign,
  TrendingUp,
} from "lucide-react"

export default function LandingPage() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        setWalletConnected(true)
        window.location.href = "/app"
      } catch (error) {
        console.error("Failed to connect wallet:", error)
      }
    } else {
      alert("Please install MetaMask to use this application")
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Enhanced Floating Elements with Mouse Interaction */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Animated geometric shapes */}
        <div
          className="absolute w-64 h-64 border border-orange-500/20 rounded-full animate-spin"
          style={{
            top: "10%",
            left: "5%",
            animationDuration: "20s",
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        ></div>
        <div
          className="absolute w-32 h-32 border border-orange-400/30 rounded-full animate-spin"
          style={{
            top: "60%",
            right: "10%",
            animationDuration: "15s",
            animationDirection: "reverse",
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
          }}
        ></div>

        {/* Floating particles with different animations */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-orange-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-red-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-orange-300 rounded-full animate-bounce opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-red-300 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-orange-500 rounded-full animate-ping opacity-30"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-red-500 rounded-full animate-bounce opacity-20"></div>

        <div className="absolute top-1/4 left-1/2 w-8 h-8 border border-orange-500/20 rotate-45 animate-pulse opacity-40"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-6 h-6 border border-orange-400/30 rotate-12 animate-spin opacity-30"
          style={{ animationDuration: "8s" }}
        ></div>

        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-orange-500/20 to-transparent animate-pulse"></div>
        <div
          className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-orange-400/10 to-transparent animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center group-hover:bg-orange-600 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white group-hover:text-orange-400 transition-colors">
                  SecureSwap
                </h1>
                <p className="text-sm text-slate-400">Trustless Escrow Protocol</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#protocol"
                className="text-slate-300 hover:text-orange-400 transition-all duration-300 font-medium hover:scale-105 relative group"
              >
                Protocol
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#security"
                className="text-slate-300 hover:text-orange-400 transition-all duration-300 font-medium hover:scale-105 relative group"
              >
                Security
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#stats"
                className="text-slate-300 hover:text-orange-400 transition-all duration-300 font-medium hover:scale-105 relative group"
              >
                Analytics
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <Button
                onClick={connectWallet}
                className="bg-orange-500 hover:bg-orange-600 border-0 font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <Wallet className="w-4 h-4 mr-2 relative z-10" />
                <span className="relative z-10">Enter Protocol</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(251,146,60,0.05)_49%,rgba(251,146,60,0.05)_51%,transparent_52%)] bg-[length:20px_20px] animate-pulse"></div>
        <div
          className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(251,146,60,0.03)_60deg,transparent_120deg)] animate-spin"
          style={{ animationDuration: "30s" }}
        ></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Badge className="mb-8 bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30 text-base px-4 py-2 transition-all duration-300 hover:scale-105 relative overflow-hidden group">
              <span className="absolute inset-0 bg-orange-400/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
              <Zap className="w-4 h-4 mr-2 animate-pulse relative z-10" />
              <span className="relative z-10">Live on Ethereum Mainnet</span>
            </Badge>
          </div>

          <div className="mb-8">
            <h1
              className={`text-6xl md:text-7xl font-black text-white mb-4 leading-none tracking-tight transition-all duration-1000 delay-200 hover:scale-105 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{
                textShadow: "0 0 20px rgba(251,146,60,0.3)",
                animation: "glow 2s ease-in-out infinite alternate",
              }}
            >
              SECURE
            </h1>
            <h1
              className={`text-6xl md:text-7xl font-black text-orange-400 mb-4 leading-none tracking-tight transition-all duration-1000 delay-400 hover:text-orange-300 hover:scale-105 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{
                textShadow: "0 0 30px rgba(251,146,60,0.5)",
                animation: "glow 2s ease-in-out infinite alternate",
              }}
            >
              SWAP
            </h1>
            <h1
              className={`text-6xl md:text-7xl font-black text-white leading-none tracking-tight transition-all duration-1000 delay-600 hover:scale-105 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{
                textShadow: "0 0 20px rgba(251,146,60,0.3)",
                animation: "glow 2s ease-in-out infinite alternate",
              }}
            >
              TRUST
            </h1>
          </div>

          <p
            className={`text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light transition-all duration-1000 delay-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            The future of peer-to-peer transactions. <br />
            <span className="text-orange-400 font-semibold">Zero trust. Maximum security.</span> <br />
            Every trade protected by immutable smart contracts.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 transition-all duration-1000 delay-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Button
              size="lg"
              onClick={connectWallet}
              className="bg-orange-500 hover:bg-orange-600 text-xl px-12 py-6 h-auto font-black border-0 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25 relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <span className="relative z-10">Launch Protocol</span>
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform relative z-10" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-xl px-12 py-6 h-auto border-2 border-slate-600 hover:bg-slate-800 bg-transparent text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:border-orange-400 relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-orange-400/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
              <span className="relative z-10">View Documentation</span>
              <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform relative z-10" />
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-400 mb-8">
            <div className="flex items-center gap-2 group hover:scale-105 transition-all duration-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="group-hover:text-green-300 transition-colors">~0.001 ETH per transaction</span>
            </div>
            <div className="flex items-center gap-2 group hover:scale-105 transition-all duration-300">
              <div
                className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <span className="group-hover:text-orange-300 transition-colors">24/7 automated execution</span>
            </div>
            <div className="flex items-center gap-2 group hover:scale-105 transition-all duration-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
              <span className="group-hover:text-blue-300 transition-colors">100% on-chain transparency</span>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm hover:border-orange-500/30 transition-all duration-500 hover:scale-105 group">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-400 group-hover:rotate-12 transition-transform duration-300" />
                  Live Activity
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Real-time
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm hover:bg-slate-800/50 p-2 rounded-lg transition-all duration-300 hover:scale-105">
                  <span className="text-slate-300">Escrow #2847 completed</span>
                  <span className="text-orange-400 font-medium">2.5 ETH</span>
                </div>
                <div className="flex items-center justify-between text-sm hover:bg-slate-800/50 p-2 rounded-lg transition-all duration-300 hover:scale-105">
                  <span className="text-slate-300">New escrow created</span>
                  <span className="text-orange-400 font-medium">0.8 ETH</span>
                </div>
                <div className="flex items-center justify-between text-sm hover:bg-slate-800/50 p-2 rounded-lg transition-all duration-300 hover:scale-105">
                  <span className="text-slate-300">Escrow #2846 approved</span>
                  <span className="text-orange-400 font-medium">1.2 ETH</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-slate-900/50 relative">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(251,146,60,0.03)_50%,transparent_100%)] animate-pulse"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 hover:scale-105 transition-all duration-500">
              PROTOCOL
              <span className="block text-orange-400">METRICS</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group hover:scale-110 transition-all duration-500">
              <div className="text-5xl md:text-6xl font-black text-orange-400 mb-4 group-hover:text-orange-300 transition-all duration-300 relative">
                <span className="inline-block hover:animate-bounce">$4.2M</span>
              </div>
              <div className="text-slate-300 text-lg font-medium group-hover:text-white transition-colors">
                Total Volume Secured
              </div>
            </div>
            <div className="text-center group hover:scale-110 transition-all duration-500">
              <div className="text-5xl md:text-6xl font-black text-orange-400 mb-4 group-hover:text-orange-300 transition-all duration-300 relative">
                <span className="inline-block hover:animate-bounce">2.8K</span>
              </div>
              <div className="text-slate-300 text-lg font-medium group-hover:text-white transition-colors">
                Successful Escrows
              </div>
            </div>
            <div className="text-center group hover:scale-110 transition-all duration-500">
              <div className="text-5xl md:text-6xl font-black text-orange-400 mb-4 group-hover:text-orange-300 transition-all duration-300 relative">
                <span className="inline-block hover:animate-bounce">99.9%</span>
              </div>
              <div className="text-slate-300 text-lg font-medium group-hover:text-white transition-colors">
                Success Rate
              </div>
            </div>
            <div className="text-center group hover:scale-110 transition-all duration-500">
              <div className="text-5xl md:text-6xl font-black text-orange-400 mb-4 group-hover:text-orange-300 transition-all duration-300 relative">
                <span className="inline-block hover:animate-bounce">0.5%</span>
              </div>
              <div className="text-slate-300 text-lg font-medium group-hover:text-white transition-colors">
                Protocol Fee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol Features */}
      <section id="protocol" className="py-32 bg-slate-950 relative">
        <div
          className="absolute top-10 right-10 w-32 h-32 border border-orange-500/10 rounded-full animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>
        <div
          className="absolute bottom-10 left-10 w-24 h-24 border border-orange-400/10 rounded-full animate-spin"
          style={{ animationDuration: "15s", animationDirection: "reverse" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight hover:scale-105 transition-all duration-500">
              Built for
              <span className="block text-orange-400">DEFI</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light">
              Next-generation escrow protocol engineered for the decentralized economy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-900/50 border-slate-700 hover:border-orange-500/50 transition-all duration-500 group hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-orange-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
              <CardHeader className="pb-4 relative z-10">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-600 transition-all duration-300 group-hover:rotate-12">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-black text-white group-hover:text-orange-400 transition-colors">
                  Trustless Security
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-slate-300 text-lg leading-relaxed group-hover:text-slate-200 transition-colors">
                  Military-grade smart contract architecture. Your assets are protected by immutable code, not promises.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 hover:border-orange-500/50 transition-all duration-500 group hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-orange-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
              <CardHeader className="pb-4 relative z-10">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-600 transition-all duration-300 group-hover:rotate-12">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-black text-white group-hover:text-orange-400 transition-colors">
                  Instant Execution
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-slate-300 text-lg leading-relaxed group-hover:text-slate-200 transition-colors">
                  Automated settlement engine. Transactions execute instantly when conditions are met. No delays.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 hover:border-orange-500/50 transition-all duration-500 group hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-orange-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
              <CardHeader className="pb-4 relative z-10">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-600 transition-all duration-300 group-hover:rotate-12">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-black text-white group-hover:text-orange-400 transition-colors">
                  Minimal Fees
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-slate-300 text-lg leading-relaxed group-hover:text-slate-200 transition-colors">
                  Only 0.5% protocol fee. No hidden costs, no surprises. Transparent pricing for every transaction.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 hover:border-orange-500/50 transition-all duration-500 group hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-orange-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
              <CardHeader className="pb-4 relative z-10">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-600 transition-all duration-300 group-hover:rotate-12">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-black text-white group-hover:text-orange-400 transition-colors">
                  Global Protocol
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-slate-300 text-lg leading-relaxed group-hover:text-slate-200 transition-colors">
                  Borderless transactions. Trade with anyone, anywhere. No KYC, no restrictions, no barriers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 hover:border-orange-500/50 transition-all duration-500 group hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-orange-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
              <CardHeader className="pb-4 relative z-10">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-600 transition-all duration-300 group-hover:rotate-12">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-black text-white group-hover:text-orange-400 transition-colors">
                  Non-Custodial
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-slate-300 text-lg leading-relaxed group-hover:text-slate-200 transition-colors">
                  You control your assets. Funds never leave your wallet until trade conditions are satisfied.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 hover:border-orange-500/50 transition-all duration-500 group hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-orange-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
              <CardHeader className="pb-4 relative z-10">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-600 transition-all duration-300 group-hover:rotate-12">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-black text-white group-hover:text-orange-400 transition-colors">
                  Full Transparency
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-slate-300 text-lg leading-relaxed group-hover:text-slate-200 transition-colors">
                  Every transaction on-chain. Complete audit trail. Open source smart contracts. Zero opacity.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="security" className="py-32 bg-slate-900/30 relative">
        <div className="absolute top-20 left-20 w-16 h-16 border-2 border-orange-500/20 rotate-45 animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-12 h-12 border-2 border-orange-400/20 rotate-12 animate-spin"
          style={{ animationDuration: "10s" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight hover:scale-105 transition-all duration-500">
              PROTOCOL
              <span className="block text-orange-400">EXECUTION</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light">
              Three steps to trustless peer-to-peer transactions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group hover:scale-105 transition-all duration-500">
              <div className="w-32 h-32 bg-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-orange-600 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 relative overflow-hidden">
                <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <span className="text-5xl font-black text-white relative z-10">01</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-6 group-hover:text-orange-400 transition-colors">
                Initialize Escrow
              </h3>
              <p className="text-slate-300 text-lg leading-relaxed group-hover:text-slate-200 transition-colors">
                Deploy smart contract with your terms. Deposit assets. Set counterparty requirements. Protocol handles
                the rest.
              </p>
            </div>

            <div className="text-center group hover:scale-105 transition-all duration-500">
              <div className="w-32 h-32 bg-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-orange-600 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 relative overflow-hidden">
                <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <span className="text-5xl font-black text-white relative z-10">02</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-6 group-hover:text-orange-400 transition-colors">
                Counterparty Joins
              </h3>
              <p className="text-slate-300 text-lg leading-relaxed group-hover:text-slate-200 transition-colors">
                Trading partner reviews terms and deposits their assets. Both parties must approve before execution
                begins.
              </p>
            </div>

            <div className="text-center group hover:scale-105 transition-all duration-500">
              <div className="w-32 h-32 bg-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-orange-600 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 relative overflow-hidden">
                <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <span className="text-5xl font-black text-white relative z-10">03</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-6 group-hover:text-orange-400 transition-colors">
                Automatic Settlement
              </h3>
              <p className="text-slate-300 text-lg leading-relaxed group-hover:text-slate-200 transition-colors">
                Smart contract executes trade when conditions are met. Instant settlement. Zero human intervention
                required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-32 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight hover:scale-105 transition-all duration-500">
              TRUSTED BY
              <span className="block text-orange-400">DEGENS</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-900/50 border-slate-700 hover:border-orange-500/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute inset-0 bg-orange-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 text-orange-400 fill-current hover:scale-110 transition-transform group-hover:animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed group-hover:text-slate-200 transition-colors">
                  "SecureSwap is the only protocol I trust for high-value NFT trades. The smart contract security is
                  unmatched."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4 hover:bg-orange-600 transition-colors group-hover:scale-110 group-hover:rotate-12">
                    <span className="text-white font-black text-lg">A</span>
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg group-hover:text-orange-400 transition-colors">
                      Alex Chen
                    </div>
                    <div className="text-slate-400 group-hover:text-slate-300 transition-colors">NFT Whale</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 hover:border-orange-500/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute inset-0 bg-orange-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 text-orange-400 fill-current hover:scale-110 transition-transform group-hover:animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed group-hover:text-slate-200 transition-colors">
                  "Domain trading just got revolutionized. SecureSwap handles everything automatically. Pure genius."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4 hover:bg-orange-600 transition-colors group-hover:scale-110 group-hover:rotate-12">
                    <span className="text-white font-black text-lg">S</span>
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg group-hover:text-orange-400 transition-colors">
                      Sarah Kim
                    </div>
                    <div className="text-slate-400 group-hover:text-slate-300 transition-colors">Domain Flipper</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 hover:border-orange-500/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute inset-0 bg-orange-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 text-orange-400 fill-current hover:scale-110 transition-transform group-hover:animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed group-hover:text-slate-200 transition-colors">
                  "100+ trades, zero issues. This is how DeFi should work. Fast, secure, trustless."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4 hover:bg-orange-600 transition-colors group-hover:scale-110 group-hover:rotate-12">
                    <span className="text-white font-black text-lg">M</span>
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg group-hover:text-orange-400 transition-colors">
                      Marcus Rodriguez
                    </div>
                    <div className="text-slate-400 group-hover:text-slate-300 transition-colors">DeFi Trader</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.05)_49%,rgba(255,255,255,0.05)_51%,transparent_52%)] bg-[length:30px_30px] animate-pulse"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight hover:scale-105 transition-all duration-500">
            THE FUTURE IS
            <span className="block">TRUSTLESS</span>
          </h2>
          <p className="text-xl text-orange-100 mb-12 max-w-3xl mx-auto font-light">
            Join the revolution of peer-to-peer finance. Your assets, your rules, your future.
          </p>
          <Button
            size="lg"
            onClick={connectWallet}
            className="bg-slate-950 text-white hover:bg-slate-800 text-2xl px-16 py-8 h-auto font-black border-0 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            <span className="relative z-10">Enter SecureSwap</span>
            <ArrowRight className="w-8 h-8 ml-4 group-hover:translate-x-2 transition-transform relative z-10" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="flex items-center space-x-3 mb-4 md:mb-0 group">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center group-hover:bg-orange-600 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-black text-xl group-hover:text-orange-400 transition-colors">
                SecureSwap
              </span>
            </div>

            <div className="flex items-center space-x-8 text-slate-400">
              <a
                href="#"
                className="hover:text-orange-400 transition-all duration-300 font-medium hover:scale-105 relative group"
              >
                Documentation
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#"
                className="hover:text-orange-400 transition-all duration-300 font-medium hover:scale-105 relative group"
              >
                Security Audit
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#"
                className="hover:text-orange-400 transition-all duration-300 font-medium hover:scale-105 relative group"
              >
                GitHub
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#"
                className="hover:text-orange-400 transition-all duration-300 font-medium hover:scale-105 relative group"
              >
                Discord
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p className="text-lg">&copy; 2024 SecureSwap Protocol. Built for the decentralized future.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes glow {
          from {
            text-shadow: 0 0 20px rgba(251,146,60,0.3);
          }
          to {
            text-shadow: 0 0 30px rgba(251,146,60,0.6), 0 0 40px rgba(251,146,60,0.4);
          }
        }
      `}</style>
    </div>
  )
}
