import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export const LandingPage = () => {
  return (
    <>
      <header className='py-[24px]'>
        <nav className="flex justify-between items-center px-[200px] text-white">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-[#9333EA] to-[#22D3EE] rounded-xl size-[40px]"></div>
            <h1 className="text-xl font-bold">QuickSwap</h1>
          </div>
          <ul className='flex gap-[30px] text-sm text-[#D1D5DB]'>
            <li>How it works</li>
            <li>Trade</li>
            <li>Docs</li>
          </ul>
          <WalletMultiButton />
        </nav>
      </header>
      {/* <main>

    </main>
    <footer>

    </footer> */}
    </>
  )
}
