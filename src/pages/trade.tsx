export const Trade = () => {
    const mockNFTs = [{
        id: "1",
        name: "Solana Monkey #1234",
        collection: "Solana Monkey Business",
        image: "/placeholder.svg?height=300&width=300",
        price: 45.5,
        currency: "SOL",
        traits: [
            { name: "Background", value: "Blue", rarity: 12 },
            { name: "Fur", value: "Gold", rarity: 3 },
        ],
    },{
        id: "2",
        name: "DeGod #5678",
        collection: "DeGods",
        image: "/placeholder.svg?height=300&width=300",
        price: 35.2,
        currency: "SOL",
        traits: [
            { name: "Background", value: "Red", rarity: 8 },
            { name: "Accessory", value: "Crown", rarity: 2 },
        ],
    },{
    id: "3",
    name: "Okay Bear #9012",
    collection: "Okay Bears",
    image: "/placeholder.svg?height=300&width=300",
    price: 58.7,
    currency: "SOL",
    traits: [
      { name: "Background", value: "Green", rarity: 15 },
      { name: "Outfit", value: "Suit", rarity: 5 },
    ],
  },
  {
    id: "4",
    name: "Degen Ape #3456",
    collection: "Degen Ape Academy",
    image: "/placeholder.svg?height=300&width=300",
    price: 22.3,
    currency: "SOL",
    traits: [
      { name: "Background", value: "Yellow", rarity: 10 },
      { name: "Eyes", value: "Laser", rarity: 4 },
    ],
  },
  {
    id: "5",
    name: "Aurory #7890",
    collection: "Aurory",
    image: "/placeholder.svg?height=300&width=300",
    price: 15.8,
    currency: "SOL",
    traits: [
      { name: "Background", value: "Purple", rarity: 7 },
      { name: "Weapon", value: "Sword", rarity: 6 },
    ],
  },
  {
    id: "6",
    name: "Solana Monkey #5678",
    collection: "Solana Monkey Business",
    image: "/placeholder.svg?height=300&width=300",
    price: 42.1,
    currency: "SOL",
    traits: [
      { name: "Background", value: "Orange", rarity: 9 },
      { name: "Hat", value: "Crown", rarity: 3 },
    ],
  },
]
    return (
        <div>
            <h1>Trade</h1>
            <p>Trade page content goes here.</p>
        </div>
    )
}