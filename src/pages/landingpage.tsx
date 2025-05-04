import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { IconArrowRight, IconPlayerPlay } from '@tabler/icons-react'
import '@solana/wallet-adapter-react-ui/styles.css'
export const LandingPage = () => {
  return (
    <>
      <header className="py-[24px]">
        <nav className="flex justify-between items-center px-[200px] text-white">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-[#9333EA] to-[#22D3EE] rounded-xl size-[40px]"></div>
            <h1 className="text-xl font-bold">QuickSwap</h1>
          </div>
          <ul className="flex gap-[30px] text-sm text-[#D1D5DB]">
            <li>How it works</li>
            <li>Trade</li>
            <li>Docs</li>
          </ul>
          <WalletMultiButton />
        </nav>
      </header>
      <main>
        <section className="flex flex-col text-center items-center justify-center gap-[24px] h-[calc(100vh-100px)]">
          <h1 className="w-[768px] text-6xl font-bold bg-gradient-to-r from-[#A855F7] via-[#22D3EE] to-[#4ADE80] bg-clip-text text-transparent">
            Barter NFTs. No middlemen. No limits.
          </h1>
          <p className="w-[672px] text-xl font-normal">
            QuickSwap is the first decentralized NFT barter marketplace on Solana. Trade NFTs directly, add SOL or USDC,
            and enjoy trustless escrow — all in one place.
          </p>
          <div className='flex gap-[16px] mt-[16px]'>
            <button className="flex gap-4 items-center bg-gradient-to-r from-[#9333EA] to-[#22D3EE] rounded-[10px] px-[32px] py-[14px]">
              <p className="font-medium text-sm">Try Demo</p>
              <IconArrowRight />
            </button>
            <button className="flex gap-4 items-center border border-[#A855F7] rounded-[10px] px-[32px] py-[14px]">
              <p className="font-medium text-sm">Learn How It Works</p>
              <IconPlayerPlay />
            </button>
          </div>
        </section>
      </main>
      <footer></footer>
    </>
  )
}
