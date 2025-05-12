'use client'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { ArrowLeftRight, DollarSign, Lock, ShieldCheck, ArrowRight, ChevronRight } from 'lucide-react'
import { Github, Twitter, DiscIcon as Discord, Globe } from 'lucide-react'
import { IconArrowRight, IconPlayerPlay } from '@tabler/icons-react'
import '@solana/wallet-adapter-react-ui/styles.css'

export const LandingPage = () => {
  return (
    <>
      <header className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-400"></div>
            <span className="text-xl font-bold tracking-tight">QuickSwap</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <p className="text-sm font-medium text-gray-300 hover:text-white transition-colors">How It do Works</p>
            <p className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Trade</p>
            <p className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Docs</p>
          </div>
          <WalletMultiButton />
        </div>
      </header>

      <main>
        <section className="relative py-16 md:py-24 lg:py-28 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-cyan-400 to-green-400">
                Barter NFTs. No middlemen. No limits.
              </h1>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                QuickSwap is the first decentralized NFT barter marketplace on Solana. Trade NFTs directly, add SOL or
                USDC, and enjoy trustless escrow — all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="flex gap-4 items-center bg-gradient-to-r from-[#9333EA] to-[#22D3EE] rounded-[10px] px-[32px] py-[14px]">
                  <p className="font-medium text-sm">Try Demo</p>
                  <IconArrowRight />
                </button>
                <button className="flex gap-4 items-center border border-[#A855F7] rounded-[10px] px-[32px] py-[14px]">
                  <p className="font-medium text-sm">Learn How It Works</p>
                  <IconPlayerPlay />
                </button>
              </div>
            </div>
          </div>
        </section>
        {/* this is the section for the nft */}
        <section id="how-it-works" className="py-16 md:py-24 bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">How It Works</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                QuickSwap makes NFT trading simple, secure, and completely decentralized. No intermediaries, no custody
                risks, just pure peer-to-peer trading.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 transition-transform hover:translate-y-[-4px]">
                <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                  <ArrowLeftRight className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">NFT-for-NFT Swaps</h3>
                <p className="text-gray-400">
                  Trade any NFT for any other NFT directly. No wrapping, no listing fees, no complications.
                </p>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 transition-transform hover:translate-y-[-4px]">
                <div className="h-12 w-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Hybrid Trades</h3>
                <p className="text-gray-400">
                  Add SOL or USDC to balance your trades. Perfect when NFT values don't match exactly.
                </p>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 transition-transform hover:translate-y-[-4px]">
                <div className="h-12 w-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Trustless Escrow</h3>
                <p className="text-gray-400">
                  Assets are locked in a secure smart contract until both parties confirm the trade.
                </p>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 transition-transform hover:translate-y-[-4px]">
                <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Verified Collections</h3>
                <p className="text-gray-400">
                  Trade with confidence knowing all NFTs are verified against official collection data.
                </p>
              </div>
            </div>

            {/* Trading Process - Improved spacing and alignment */}
            <div className="mt-14 bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-6">The Trading Process</h3>
                  <ol className="space-y-6">
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 h-7 w-7 rounded-full bg-purple-500 flex items-center justify-center text-sm font-bold mt-0.5">
                        1
                      </span>
                      <div>
                        <p className="font-medium text-lg">Browse available NFTs or connect your wallet</p>
                        <p className="text-gray-400 mt-1">Find NFTs you want or add your own to trade</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 h-7 w-7 rounded-full bg-purple-500 flex items-center justify-center text-sm font-bold mt-0.5">
                        2
                      </span>
                      <div>
                        <p className="font-medium text-lg">Create your offer</p>
                        <p className="text-gray-400 mt-1">Drag and drop NFTs into the trade builder</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 h-7 w-7 rounded-full bg-purple-500 flex items-center justify-center text-sm font-bold mt-0.5">
                        3
                      </span>
                      <div>
                        <p className="font-medium text-lg">Submit and wait for acceptance</p>
                        <p className="text-gray-400 mt-1">Your NFTs are locked in escrow until trade completes</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 h-7 w-7 rounded-full bg-purple-500 flex items-center justify-center text-sm font-bold mt-0.5">
                        4
                      </span>
                      <div>
                        <p className="font-medium text-lg">Trade completes automatically</p>
                        <p className="text-gray-400 mt-1">Once both parties confirm, assets are swapped instantly</p>
                      </div>
                    </li>
                  </ol>
                </div>
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur opacity-30"></div>
                  <div className="relative bg-gray-800 rounded-2xl overflow-hidden">
                    <img
                      src="/placeholder.svg?height=400&width=600"
                      alt="QuickSwap Trading Process"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container mx-auto py-16 md:py-20 px-4">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start trading?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join thousands of traders already bartering NFTs without intermediaries. Experience the future of
              decentralized trading today.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <button className="flex gap-4 items-center bg-gradient-to-r from-[#9333EA] to-[#22D3EE] rounded-[10px] px-[32px] py-[14px]">
              <p>Launch App</p>
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button className="flex gap-4 items-center border border-[#A855F7] rounded-[10px] px-[32px] py-[14px]">
              <p>View Documentation</p>
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </section>
      </main>
      <footer className="bg-gray-950 border-t border-gray-900">
        <div className="container mx-auto py-10 md:py-12 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-400"></div>
                <span className="text-xl font-bold tracking-tight">QuickSwap</span>
              </div>
              <p className="text-gray-400 mb-4 text-sm md:text-base">
                The first decentralized NFT barter marketplace on Solana.
              </p>
              <div className="flex gap-4">
                <p className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </p>
                <p className="text-gray-400 hover:text-white transition-colors">
                  <Discord className="h-5 w-5" />
                  <span className="sr-only">Discord</span>
                </p>
                <p className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </p>
                <p className="text-gray-400 hover:text-white transition-colors">
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">Website</span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-3 text-sm md:text-base">Product</h3>
              <ul className="space-y-2">
                <li className="text-gray-400 hover:text-white transition-colors text-sm">Features</li>
                <li className="text-gray-400 hover:text-white transition-colors text-sm">Roadmap</li>
                <li className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</li>
                <li className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-3 text-sm md:text-base">Resources</h3>
              <ul className="space-y-2">
                <li className="text-gray-400 hover:text-white transition-colors text-sm">Documentation</li>
                <li className="text-gray-400 hover:text-white transition-colors text-sm">API Reference</li>
                <li className="text-gray-400 hover:text-white transition-colors text-sm">Tutorials</li>
                <li className="text-gray-400 hover:text-white transition-colors text-sm">Blog</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-3 text-sm md:text-base">Company</h3>
              <ul className="space-y-2">
                <li className="text-gray-400 hover:text-white transition-colors text-sm">About</li>
                <li className="text-gray-400 hover:text-white transition-colors text-sm">Careers</li>
                <li className="text-gray-400 hover:text-white transition-colors text-sm">Contact</li>
                <li className="text-gray-400 hover:text-white transition-colors text-sm">Partners</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-900 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} QuickSwap. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <p className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</p>
              <p className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</p>
              <p className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
