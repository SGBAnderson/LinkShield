
## Technical Explanation
This contract works as a link protection service on the Blockchain. It allows users to register private links and charge a fee from other users to grant access to them. The contract retains a small commission for each payment.

The contract is written in Solidity, a programming language for smart contracts on the Ethereum blockchain.

Imagine LinkShield as a digital doorman. You can register a link (such as to a file, video, or website) and set a price for it. Anyone who wants to access your link must pay that fee. The contract acts as an intermediary: it receives the payment from the interested party, ensures that the person pays the correct price, and then grants them permission to view the link. You, as the owner, receive the payment money, minus a small commission that the doorman (the contract) charges for its service.

## Data Structures and Variablesstruct Link
Defines a data structure to store information about each link. It includes the URL (string url), the owner's address (address owner), and the access fee (uint256 fee).commission: A public variable that defines the fixed commission charged by the contract, of 1 Wei (the smallest unit of ether).links: A mapping that stores Link objects. Each link is identified by a unique linkId (a string).hasAccess: Another mapping that tracks who has access to which link. It associates a linkId to a user address and a boolean value (true or false).admin: The address of the contract creator. It is defined in the constructor and cannot be changed, making it an immutable address.

## Main Functions 
- **constructor**(): Runs only once, during contract deployment. It sets the address of the deployer as the admin. 
- **addLink**(string calldata url, string calldata linkId, uint256 fee): Allows a user to add or update a link. It checks if the link already exists and if the user is the owner. It also ensures that the fee is either zero or greater than or equal to the commission. 
- **payLink**(string calldata linkId) public payable: Allows a user to pay for access to a link. It checks if the link exists, if the user already has access, and if the payment sent (msg.value) is sufficient. If the conditions are met, it grants access (hasAccess[linkId][msg.sender] = true) and transfers the paid amount (minus the commission) to the link owner.
- **getLink**(string calldata linkId) public view returns (Link memory): This function allows anyone to call and retrieve the link information. If the link is free (fee == 0), it directly returns the URL. If it is paid, it first checks if the user calling the function already has access. If not, it returns the Link object with the url field empty, protecting the information.
- **withdraw()**: A function exclusive to the contract admin. It allows them to withdraw all accumulated commissions in the contract to their wallet.

## Technical Explanation
- Next.js
- React
- TypeScript
- Biblioteca de hashing (object-hash)
- Serviço Web3 
- Bootstrap

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
