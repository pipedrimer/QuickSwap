import { useState } from "react"
import { Wallet } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

export function ConnectWalletButton() {
  const [open, setOpen] = useState(false)

  const wallets = [
    {
      name: "Phantom",
      icon: "/placeholder.svg?height=40&width=40",
      description: "Connect to your Phantom wallet",
    },
    {
      name: "Solflare",
      icon: "/placeholder.svg?height=40&width=40",
      description: "Connect to your Solflare wallet",
    },
    {
      name: "Backpack",
      icon: "/placeholder.svg?height=40&width=40",
      description: "Connect to your Backpack wallet",
    },
  ]

  const handleConnectWallet = (walletName: string) => {
    // Instead of directly accessing window.ethereum, we'll use a safer approach
    console.log(`Connecting to ${walletName}...`)

    // Close the dialog
    setOpen(false)

    // In a real implementation, you would use a Solana wallet adapter
    // For example: @solana/wallet-adapter-react
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button  className="border-purple-500 text-white hover:bg-purple-950">
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Connect your wallet</DialogTitle>
          <DialogDescription className="text-gray-400">
            Connect your wallet to start trading NFTs on QuickSwap.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-800 hover:bg-gray-750 transition-colors text-left"
              onClick={() => handleConnectWallet(wallet.name)}
            >
              <img src={wallet.icon || "/placeholder.svg"} alt={wallet.name} className="h-10 w-10 rounded-full" />
              <div>
                <h3 className="font-medium">{wallet.name}</h3>
                <p className="text-sm text-gray-400">{wallet.description}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}