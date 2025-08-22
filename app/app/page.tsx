"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Shield,
  Users,
  TrendingUp,
  Settings,
  Wallet,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Timer,
  RefreshCw,
} from "lucide-react"

// TypeScript declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}

// Enhanced Contract ABI with new functionality
const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "cancelEscrow",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_partyB",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amountB",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			}
		],
		"name": "createEscrow",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "depositFunds",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "EscrowCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "EscrowCompleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "partyA",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "partyB",
				"type": "address"
			}
		],
		"name": "EscrowCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "depositor",
				"type": "address"
			}
		],
		"name": "FundsDeposited",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "pause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_fee",
				"type": "uint256"
			}
		],
		"name": "setServiceFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "unpause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawFees",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "escrows",
		"outputs": [
			{
				"internalType": "address",
				"name": "partyA",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "partyB",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amountA",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amountB",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "status",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "depositDeadline",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractStats",
		"outputs": [
			{
				"internalType": "uint256[4]",
				"name": "stats",
				"type": "uint256[4]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getEscrowAmounts",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getEscrowDescription",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getEscrowFlags",
		"outputs": [
			{
				"internalType": "bool[4]",
				"name": "flags",
				"type": "bool[4]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getEscrowParties",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getEscrowTimes",
		"outputs": [
			{
				"internalType": "uint256[2]",
				"name": "times",
				"type": "uint256[2]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getUserEscrows",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextEscrowId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paused",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "serviceFeePercent",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userEscrows",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "manualCompleteEscrow",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const DEFAULT_CONTRACT_ADDRESS = "0xc9c9549F34AB22C2932393E5366f77C559e72B14"

// Basic chain metadata to drive labels and UX
const CHAIN_METADATA: Record<number, { name: string; nativeSymbol: string }> = {
  1: { name: "Ethereum Mainnet", nativeSymbol: "ETH" },
  5: { name: "Goerli", nativeSymbol: "ETH" },
  11155111: { name: "Sepolia", nativeSymbol: "ETH" },
  137: { name: "Polygon", nativeSymbol: "MATIC" },
  80001: { name: "Polygon Mumbai", nativeSymbol: "MATIC" },
  80002: { name: "Polygon Amoy", nativeSymbol: "MATIC" },
}

// Web3 provider and contract instance
let provider: ethers.BrowserProvider | null = null
let contract: ethers.Contract | null = null

interface Escrow {
  id: number
  partyA: string
  partyB: string
  amountA: string
  amountB: string
  status: number // 0: waiting for party B deposit, 1: party B deposited, 2: completed, 3: cancelled
  description: string
  deadline: number
  partyADeposited: boolean
  partyBDeposited: boolean
  creationTime?: number
  depositDeadline?: number
}

export default function SecureSwapApp() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [contractAddress, setContractAddress] = useState(DEFAULT_CONTRACT_ADDRESS)
  const [escrows, setEscrows] = useState<Escrow[]>([])
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, cancelled: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [executionTimers, setExecutionTimers] = useState<{[key: number]: NodeJS.Timeout}>({})
  const [refundTimers, setRefundTimers] = useState<{[key: number]: NodeJS.Timeout}>({})
  const [networkName, setNetworkName] = useState("Unknown")
  const [nativeSymbol, setNativeSymbol] = useState("ETH")

  // Form states
  const [createForm, setCreateForm] = useState({
    partyB: "",
    amountA: "",
    amountB: "",
    description: "",
  })
  const [joinEscrowId, setJoinEscrowId] = useState("")
  const [lookedUpEscrow, setLookedUpEscrow] = useState<Escrow | null>(null)
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupError, setLookupError] = useState("")

  const initContract = async () => {
    if (!provider) return
    try {
      const code = await provider.getCode(contractAddress)
      if (!code || code === "0x") {
        setError("No contract found at this address on the connected network. Update it in Settings.")
        contract = null
        return
      }
      contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider)
      
      // Verify the contract has the expected functions
      try {
        await contract.owner()
        console.log("Contract verification successful - owner function accessible")
      } catch (verifyError) {
        console.error("Contract verification failed:", verifyError)
        setError("Contract at this address doesn't match the expected interface")
        contract = null
        return
      }
      
      setError("")
    } catch (e: any) {
      console.error("Failed to initialize contract:", e)
      setError("Failed to initialize contract")
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        setWalletAddress(accounts[0])
        setWalletConnected(true)
        // Initialize provider and contract
        provider = new ethers.BrowserProvider(window.ethereum)
        const net = await provider.getNetwork()
        const chainId = Number(net.chainId)
        const meta = CHAIN_METADATA[chainId]
        setNetworkName(meta ? meta.name : `Chain ${chainId}`)
        setNativeSymbol(meta ? meta.nativeSymbol : "ETH")
        await initContract()

        if (window.ethereum?.on) {
          window.ethereum.on("accountsChanged", (accs: string[]) => {
            if (accs && accs.length > 0) setWalletAddress(accs[0])
          })
          window.ethereum.on("chainChanged", async () => {
            provider = new ethers.BrowserProvider(window.ethereum)
            const n = await provider.getNetwork()
            const id = Number(n.chainId)
            const m = CHAIN_METADATA[id]
            setNetworkName(m ? m.name : `Chain ${id}`)
            setNativeSymbol(m ? m.nativeSymbol : "ETH")
            await initContract()
            await loadUserEscrows()
          })
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error)
        setError("Failed to connect wallet")
      }
    } else {
      alert("Please install MetaMask to use this application")
    }
  }

  // Re-init contract when address changes in Settings
  useEffect(() => {
    if (walletConnected && provider) {
      initContract()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractAddress])

  const createEscrow = async () => {
    if (!walletConnected || !contract || !provider) {
      setError("Please connect your wallet first")
      return
    }

    if (!createForm.partyB || !createForm.amountA || !createForm.amountB || !createForm.description) {
      setError("Please fill in all fields")
      return
    }

    if (!ethers.isAddress(createForm.partyB)) {
      setError("Invalid counterparty address")
      return
    }

    const amountA = parseFloat(createForm.amountA)
    const amountB = parseFloat(createForm.amountB)
    if (isNaN(amountA) || amountA <= 0 || isNaN(amountB) || amountB <= 0) {
      setError("Please enter valid amounts")
      return
    }

    setLoading(true)
    setError("")

    try {
      const signer = await provider.getSigner()
      const contractWithSigner = contract.connect(signer) as ethers.Contract
      const amountAWei = ethers.parseEther(createForm.amountA)
      const amountBWei = ethers.parseEther(createForm.amountB)

      const tx = await contractWithSigner.createEscrow(
        createForm.partyB,
        amountBWei,
        createForm.description,
        { value: amountAWei }
      )

      const receipt = await tx.wait()
      
      if (receipt.status === 1) {
        alert("Escrow created successfully! Transaction hash: " + receipt.hash)
        setCreateForm({
          partyB: "",
          amountA: "",
          amountB: "",
          description: "",
        })
        await loadUserEscrows()
      } else {
        setError("Transaction failed")
      }
    } catch (error: any) {
      console.error("Error creating escrow:", error)
      setError(error.message || "Failed to create escrow")
    } finally {
      setLoading(false)
    }
  }

  const loadUserEscrows = async () => {
    if (!walletConnected || !contract) return

    try {
      const userEscrows = await contract.getUserEscrows(walletAddress)
      const escrowDetails = []

      for (const escrowId of userEscrows) {
        const [partyA, partyB] = await contract.getEscrowParties(escrowId)
        const description = await contract.getEscrowDescription(escrowId)
        const [amountAWei, amountBWei] = await contract.getEscrowAmounts(escrowId)
        const flagsArr = await contract.getEscrowFlags(escrowId)
        const timesArr = await contract.getEscrowTimes(escrowId)

        const partyADeposited = Boolean(flagsArr[0])
        const partyBDeposited = Boolean(flagsArr[1])
        const completed = Boolean(flagsArr[2])
        const cancelled = Boolean(flagsArr[3])

        const creationTime = Number(timesArr[0]) * 1000
        const depositDeadline = Number(timesArr[1]) * 1000

        let derivedStatus = 0
        if (completed) derivedStatus = 2
        else if (cancelled) derivedStatus = 3
        else if (partyADeposited && partyBDeposited) derivedStatus = 1
        else derivedStatus = 0

        const escrowDetail: Escrow = {
          id: Number(escrowId),
          partyA,
          partyB,
          amountA: ethers.formatEther(amountAWei),
          amountB: ethers.formatEther(amountBWei),
          status: derivedStatus,
          description,
          deadline: depositDeadline,
          partyADeposited,
          partyBDeposited,
          creationTime,
          depositDeadline,
        }

        escrowDetails.push(escrowDetail)
      }

      setEscrows(escrowDetails)
    } catch (error) {
      console.error("Error loading escrows:", error)
    }
  }

  const depositFunds = async (escrowId: number) => {
    if (!walletConnected || !contract || !provider) {
      setError("Please connect your wallet first")
      return
    }

    try {
      // Debug: Get escrow details before attempting deposit
      const [partyA, partyB] = await contract.getEscrowParties(escrowId)
      const [amountAWei, amountBWei] = await contract.getEscrowAmounts(escrowId)
      const flagsArr = await contract.getEscrowFlags(escrowId)
      const timesArr = await contract.getEscrowTimes(escrowId)
      
      console.log("Debug - Escrow Details:")
      console.log("Party A:", partyA)
      console.log("Party B:", partyB)
      console.log("Current wallet:", walletAddress)
      console.log("Amount A (wei):", amountAWei.toString())
      console.log("Amount B (wei):", amountBWei.toString())
      console.log("Party B Deposited:", flagsArr[1])
      console.log("Deposit Deadline:", new Date(Number(timesArr[1]) * 1000))
      console.log("Current Time:", new Date())
      
      // Check if current wallet is Party B
      if (walletAddress.toLowerCase() !== partyB.toLowerCase()) {
        setError(`You are not Party B. Expected: ${partyB}, Current: ${walletAddress}`)
        return
      }
      
      // Check if already deposited
      if (flagsArr[1]) {
        setError("Party B has already deposited funds for this escrow.")
        return
      }
      
      // Check deadline
      const depositDeadline = Number(timesArr[1]) * 1000
      const currentTime = Date.now()
      
      if (currentTime > depositDeadline) {
        setError(`Deposit deadline has passed. Deadline: ${new Date(depositDeadline)}, Current: ${new Date(currentTime)}`)
        return
      }

      // Check if contract is paused
      try {
        const isPaused = await contract.paused()
        console.log("Contract paused status:", isPaused)
        if (isPaused) {
          setError("Contract is currently paused. Deposits are not allowed.")
          return
        }
      } catch (pauseError) {
        console.error("Error checking pause status:", pauseError)
      }

      // Check if escrow is already completed
      try {
        const flagsArr = await contract.getEscrowFlags(escrowId)
        const completed = Boolean(flagsArr[2])
        const cancelled = Boolean(flagsArr[3])
        
        if (completed) {
          setError("This escrow has already been completed.")
          return
        }
        
        if (cancelled) {
          setError("This escrow has been cancelled.")
          return
        }
      } catch (flagError) {
        console.error("Error checking escrow flags:", flagError)
      }

      const signer = await provider.getSigner()
      const contractWithSigner = contract.connect(signer) as ethers.Contract

      console.log("Attempting deposit with amount:", amountBWei.toString(), "wei")
      
      // Try to estimate gas first to catch any issues
      try {
        const gasEstimate = await contractWithSigner.depositFunds.estimateGas(escrowId, { value: amountBWei })
        console.log("Gas estimate successful:", gasEstimate.toString())
      } catch (gasError: any) {
        console.error("Gas estimation failed:", gasError)
        if (gasError.message?.includes("execution reverted")) {
          // Try to decode the revert reason
          try {
            const data = gasError.data || gasError.error?.data
            if (data) {
              console.log("Revert data:", data)
              // You can add custom error decoding here if needed
            }
          } catch (decodeError) {
            console.error("Failed to decode revert reason:", decodeError)
          }
        }
        throw gasError
      }
      
      const tx = await contractWithSigner.depositFunds(escrowId, { value: amountBWei })
      const receipt = await tx.wait()

      if (receipt.status === 1) {
        alert("Funds deposited successfully! Transaction will be automatically executed within 30 seconds.")
        
        // Update looked up escrow state immediately if present
        setLookedUpEscrow(prev => prev && prev.id === escrowId 
          ? { ...prev, status: 1, partyBDeposited: true } 
          : prev)

        await loadUserEscrows()
      }
    } catch (error: any) {
      console.error("Error depositing funds:", error)
      
      // Provide more specific error messages
      if (error.message?.includes("Deadline passed")) {
        setError("The deposit deadline has passed. This escrow can no longer be joined.")
      } else if (error.message?.includes("Already deposited")) {
        setError("Funds have already been deposited for this escrow.")
      } else if (error.message?.includes("Wrong amount")) {
        setError("The amount sent does not match the required deposit amount.")
      } else if (error.message?.includes("Not party B")) {
        setError("Only the invited Party B can deposit funds for this escrow.")
      } else {
        setError(error.message || "Failed to deposit funds")
      }
    }
  }



  const cancelEscrowOnChain = async (escrowId: number) => {
    if (!walletConnected || !contract || !provider) return
    try {
      const signer = await provider.getSigner()
      const contractWithSigner = contract.connect(signer) as ethers.Contract
      const tx = await contractWithSigner.cancelEscrow(escrowId)
      const receipt = await tx.wait()
      if (receipt.status === 1) {
        alert("Escrow cancellation submitted.")
        await loadUserEscrows()
      }
    } catch (error: any) {
      console.error("Error cancelling escrow:", error)
      setError(error.message || "Failed to cancel")
    }
  }



  const cancelEscrow = async (escrowId: number) => {
    if (!walletConnected || !contract || !provider) {
      setError("Please connect your wallet first")
      return
    }

    try {
      const signer = await provider.getSigner()
      const contractWithSigner = contract.connect(signer) as ethers.Contract

      const tx = await contractWithSigner.cancelEscrow(escrowId)
      const receipt = await tx.wait()

      if (receipt.status === 1) {
        alert("Escrow cancelled successfully!")
        
        // Clear timers if they exist
        if (executionTimers[escrowId]) {
          clearTimeout(executionTimers[escrowId])
        }
        if (refundTimers[escrowId]) {
          clearTimeout(refundTimers[escrowId])
        }
        
        await loadUserEscrows()
      }
    } catch (error: any) {
      console.error("Error cancelling escrow:", error)
      setError(error.message || "Failed to cancel escrow")
    }
  }

  const lookupEscrow = async () => {
    if (!walletConnected || !contract) {
      setLookupError("Please connect your wallet first")
      return
    }

    if (!joinEscrowId || isNaN(Number(joinEscrowId))) {
      setLookupError("Please enter a valid escrow ID")
      return
    }

    setLookupLoading(true)
    setLookupError("")
    setLookedUpEscrow(null)

    try {
      const escrowId = Number(joinEscrowId)
      const [partyA, partyB] = await contract.getEscrowParties(escrowId)
      const description = await contract.getEscrowDescription(escrowId)
      const [amountAWei, amountBWei] = await contract.getEscrowAmounts(escrowId)
      const flagsArr = await contract.getEscrowFlags(escrowId)
      const timesArr = await contract.getEscrowTimes(escrowId)
      const partyADeposited = Boolean(flagsArr[0])
      const partyBDeposited = Boolean(flagsArr[1])
      const completed = Boolean(flagsArr[2])
      const cancelled = Boolean(flagsArr[3])
      const creationTime = Number(timesArr[0]) * 1000
      const depositDeadline = Number(timesArr[1]) * 1000
      let statusNum = 0
      if (completed) statusNum = 2
      else if (cancelled) statusNum = 3
      else if (partyADeposited && partyBDeposited) statusNum = 1
      else statusNum = 0
      
      // Check if escrow exists and is valid
      if (!partyA || partyA === "0x0000000000000000000000000000000000000000") {
        setLookupError("Escrow not found")
        return
      }

      const escrowDetail: Escrow = {
        id: escrowId,
        partyA,
        partyB,
        amountA: ethers.formatEther(amountAWei),
        amountB: ethers.formatEther(amountBWei),
        status: statusNum,
        description,
        deadline: depositDeadline,
        partyADeposited,
        partyBDeposited,
        creationTime,
        depositDeadline,
      }

      setLookedUpEscrow(escrowDetail)
    } catch (error: any) {
      console.error("Error looking up escrow:", error)
      setLookupError("Failed to lookup escrow. Please check the ID and try again.")
    } finally {
      setLookupLoading(false)
    }
  }

  const joinEscrow = async () => {
    if (!lookedUpEscrow) return

    try {
      await depositFunds(lookedUpEscrow.id)
      setLookedUpEscrow(null)
      setJoinEscrowId("")
    } catch (error: any) {
      console.error("Error joining escrow:", error)
      setLookupError("Failed to join escrow")
    }
  }

  const checkEscrowStatus = async (escrowId: number) => {
    if (!contract) return
    
    try {
      const [partyA, partyB] = await contract.getEscrowParties(escrowId)
      const [amountAWei, amountBWei] = await contract.getEscrowAmounts(escrowId)
      const flagsArr = await contract.getEscrowFlags(escrowId)
      const timesArr = await contract.getEscrowTimes(escrowId)
      
      // Check contract state
      const isPaused = await contract.paused()
      const owner = await contract.owner()
      
      console.log("=== ESCROW STATUS CHECK ===")
      console.log("Escrow ID:", escrowId)
      console.log("Party A:", partyA)
      console.log("Party B:", partyB)
      console.log("Current Wallet:", walletAddress)
      console.log("Amount A:", ethers.formatEther(amountAWei), "ETH")
      console.log("Amount B:", ethers.formatEther(amountBWei), "ETH")
      console.log("Party A Deposited:", flagsArr[0])
      console.log("Party B Deposited:", flagsArr[1])
      console.log("Completed:", flagsArr[2])
      console.log("Cancelled:", flagsArr[3])
      console.log("Creation Time:", new Date(Number(timesArr[0]) * 1000))
      console.log("Deposit Deadline:", new Date(Number(timesArr[1]) * 1000))
      console.log("Current Time:", new Date())
      console.log("Time until deposit deadline:", Math.floor((Number(timesArr[1]) * 1000 - Date.now()) / 1000), "seconds")
      console.log("Contract Paused:", isPaused)
      console.log("Contract Owner:", owner)
      console.log("==========================")
      
      return {
        partyA,
        partyB,
        amountA: ethers.formatEther(amountAWei),
        amountB: ethers.formatEther(amountBWei),
        flags: flagsArr,
        times: timesArr,
        isPaused,
        owner
      }
    } catch (error) {
      console.error("Error checking escrow status:", error)
      return null
    }
  }

  const getStatusBadge = (status: number, escrow: Escrow) => {
    switch (status) {
      case 0:
        return (
          <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Waiting for Party B
          </Badge>
        )
      case 1:
        return (
          <Badge variant="secondary" className="bg-green-500/20 text-green-300 border border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Auto-Executing
          </Badge>
        )
      case 2:
        return (
          <Badge variant="secondary" className="bg-green-500/20 text-green-300 border border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case 3:
        return (
          <Badge variant="secondary" className="bg-red-500/20 text-red-300 border border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline" className="border-slate-700 text-slate-300">Unknown</Badge>
    }
  }

  // Determine if the connected wallet can join (deposit) this escrow
  const canJoinEscrow = (e: Escrow | null): boolean => {
    if (!e || !walletConnected) return false
    const isPartyB = e.partyB?.toLowerCase?.() === walletAddress.toLowerCase()
    const notFinal = e.status !== 2 && e.status !== 3
    const notExpired = !e.deadline || e.deadline > Date.now()
    const depositNotExpired = !e.depositDeadline || e.depositDeadline > Date.now()
    const notAlreadyDeposited = !e.partyBDeposited
    return Boolean(isPartyB && notFinal && notExpired && depositNotExpired && notAlreadyDeposited)
  }



  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const mockEscrows: Escrow[] = [
    {
      id: 1,
      partyA: "0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4",
      partyB: "0x8ba1f109551bD432803012645Hac136c22C4C4C4",
      amountA: "1.5",
      amountB: "2000",
      status: 1,
      description: "NFT artwork trade",
      deadline: Date.now() + 86400000,
      partyADeposited: true,
      partyBDeposited: true,
    },
    {
      id: 2,
      partyA: "0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4",
      partyB: "0x9ba1f109551bD432803012645Hac136c22C4C4C4",
      amountA: "0.8",
      amountB: "1200",
      status: 2,
      description: "Domain name transfer",
      deadline: Date.now() - 3600000,
      partyADeposited: true,
      partyBDeposited: true,
    },
  ]

  useEffect(() => {
    if (walletConnected) {
      loadUserEscrows()
    } else {
      setEscrows(mockEscrows)
      setStats({ total: 156, active: 23, completed: 128, cancelled: 5 })
    }
  }, [])

  useEffect(() => {
    if (walletConnected && contract) {
      loadUserEscrows()
    }
  }, [walletConnected, contract])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">SecureSwap</h1>
                <p className="text-sm text-slate-400">Enhanced Trustless P2P Escrow</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {walletConnected ? (
                <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-medium text-green-300">{formatAddress(walletAddress)}</span>
                </div>
              ) : (
                <Button onClick={connectWallet} className="bg-orange-500 hover:bg-orange-600 border-0">
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 border border-slate-700 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">Total Escrows</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-slate-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border border-slate-700 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">Active</p>
                  <p className="text-2xl font-bold text-orange-400">{stats.active}</p>
                </div>
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border border-slate-700 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">Completed</p>
                  <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border border-slate-700 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">Success Rate</p>
                  <p className="text-2xl font-bold text-white">96.2%</p>
                </div>
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-slate-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Features Alert */}
        <Alert className="bg-blue-500/10 border-blue-500/30 text-blue-300 mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Automatic Execution:</strong> When Party B deposits funds within 5 minutes, 
            the transaction is automatically executed within 30 seconds. No manual approval required!
          </AlertDescription>
        </Alert>

        {/* Main Content */}
        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 backdrop-blur-sm border border-slate-700 shadow-sm">
            <TabsTrigger value="create" className="text-slate-300 hover:text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Create Escrow
            </TabsTrigger>
            <TabsTrigger value="my-escrows" className="text-slate-300 hover:text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              My Escrows
            </TabsTrigger>
            <TabsTrigger value="join" className="text-slate-300 hover:text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Join Escrow
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-slate-300 hover:text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Create Escrow Tab */}
          <TabsContent value="create">
            <Card className="bg-slate-900/50 border border-slate-700 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Shield className="w-5 h-5" />
                  <span>Create New Escrow</span>
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Set up a secure peer-to-peer transaction with enhanced smart contract protection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="partyB" className="text-slate-300">Counterparty Address</Label>
                    <Input
                      id="partyB"
                      placeholder="0x..."
                      value={createForm.partyB}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, partyB: e.target.value }))}
                      className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amountA" className="text-slate-300">Your Amount ({nativeSymbol})</Label>
                    <Input
                      id="amountA"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={createForm.amountA}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, amountA: e.target.value }))}
                      className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amountB" className="text-slate-300">Expected Amount from Counterparty ({nativeSymbol})</Label>
                  <Input
                    id="amountB"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={createForm.amountB}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, amountB: e.target.value }))}
                    className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-300">Transaction Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this escrow is for..."
                    value={createForm.description}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-400"
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="bg-slate-900/60 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-white">Transaction Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-300">Your deposit:</span>
                      <span className="font-medium ml-2 text-white">{createForm.amountA || "0"} {nativeSymbol}</span>
                    </div>
                    <div>
                      <span className="text-slate-300">Expected:</span>
                      <span className="font-medium ml-2 text-white">{createForm.amountB || "0"} {nativeSymbol}</span>
                    </div>
                    <div>
                      <span className="text-slate-300">Service fee:</span>
                      <span className="font-medium ml-2 text-white">0.5%</span>
                    </div>
                    <div>
                      <span className="text-slate-300">Execution window:</span>
                      <span className="font-medium ml-2 text-white">30 seconds</span>
                    </div>
                    <div>
                      <span className="text-slate-300">Refund window:</span>
                      <span className="font-medium ml-2 text-white">5 minutes</span>
                    </div>
                    <div>
                      <span className="text-slate-300">Deadline:</span>
                      <span className="font-medium ml-2 text-white">7 days</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <Alert className="bg-red-500/10 border-red-500/30 text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={createEscrow}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  size="lg"
                  disabled={!walletConnected || loading}
                >
                  {loading ? "Creating..." : "Create Escrow"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Escrows Tab */}
          <TabsContent value="my-escrows">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">My Escrows</h2>
                <Badge variant="outline" className="bg-slate-900/60 border-slate-700 text-slate-300">
                  {escrows.length} total
                </Badge>
              </div>

              <div className="grid gap-6">
                {escrows.map((escrow) => (
                  <Card key={escrow.id} className="bg-slate-900/50 border border-slate-700 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-white">Escrow #{escrow.id}</h3>
                            {getStatusBadge(escrow.status, escrow)}
                          </div>
                          <p className="text-sm text-slate-300">{escrow.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-300">Value</p>
                          <p className="font-semibold text-orange-400">{escrow.amountA} {nativeSymbol}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Party A</p>
                          <p className="font-mono text-sm text-white">{formatAddress(escrow.partyA)}</p>
                          {escrow.partyADeposited && (
                            <div className="flex items-center space-x-1 mt-1">
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              <span className="text-xs text-green-400">Deposited</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Party B</p>
                          <p className="font-mono text-sm text-white">{formatAddress(escrow.partyB)}</p>
                          {escrow.partyBDeposited && (
                            <div className="flex items-center space-x-1 mt-1">
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              <span className="text-xs text-green-400">Deposited</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Expected</p>
                          <p className="font-semibold text-sm text-white">{escrow.amountB} {nativeSymbol}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                        <div className="flex items-center space-x-2 text-sm text-slate-300">
                          <Clock className="w-4 h-4" />
                          <span>
                            {escrow.status === 2
                              ? "Completed"
                              : escrow.partyADeposited && escrow.partyBDeposited
                                ? "Auto-executing (30s)"
                                : escrow.deadline > Date.now() && escrow.deadline < Date.now() + (365 * 24 * 60 * 60 * 1000)
                                  ? `${Math.ceil((escrow.deadline - Date.now()) / (1000 * 60 * 60 * 24))} days left`
                                  : escrow.deadline > Date.now()
                                    ? "Valid"
                                    : "Expired"}
                          </span>
                        </div>
                        <div className="flex space-x-2">

                          
                          {/* Show Deposit Funds button for Party B when not deposited yet */}
                          {escrow.status === 0 && escrow.partyB?.toLowerCase() === walletAddress.toLowerCase() && !escrow.partyBDeposited && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-slate-700 text-slate-300 hover:bg-slate-800"
                              onClick={() => depositFunds(escrow.id)}
                            >
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Deposit Funds
                            </Button>
                          )}
                          
                          {/* Show Cancel button */}
                          {escrow.status !== 2 && escrow.status !== 3 && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-400 hover:text-red-300 bg-transparent border-slate-700"
                              onClick={() => cancelEscrowOnChain(escrow.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Join Escrow Tab */}
          <TabsContent value="join">
            <Card className="bg-slate-900/50 border border-slate-700 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Users className="w-5 h-5" />
                  <span>Join Existing Escrow</span>
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Enter an escrow ID to participate in an existing transaction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="escrowId" className="text-slate-300">Escrow ID</Label>
                  <Input
                    id="escrowId"
                    placeholder="Enter escrow ID..."
                    value={joinEscrowId}
                    onChange={(e) => setJoinEscrowId(e.target.value)}
                    className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-400"
                  />
                </div>

                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600" 
                  disabled={!joinEscrowId || !walletConnected || lookupLoading}
                  onClick={lookupEscrow}
                >
                  {lookupLoading ? "Looking up..." : "Lookup Escrow"}
                </Button>

                {lookupError && (
                  <Alert className="bg-red-500/10 border-red-500/30 text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{lookupError}</AlertDescription>
                  </Alert>
                )}

                {lookedUpEscrow && (
                  <div className="space-y-4">
                    <Alert className="bg-green-500/10 border-green-500/30 text-green-300">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>Escrow found! Review the details below.</AlertDescription>
                    </Alert>

                    <Card className="bg-slate-900/60 border border-slate-700">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-white">Escrow #{lookedUpEscrow.id}</h4>
                            {getStatusBadge(lookedUpEscrow.status, lookedUpEscrow)}
                          </div>
                          
                          <p className="text-sm text-slate-300">{lookedUpEscrow.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-slate-500">Party A:</p>
                              <p className="font-mono text-white">{formatAddress(lookedUpEscrow.partyA)}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Party B:</p>
                              <p className="font-mono text-white">{formatAddress(lookedUpEscrow.partyB)}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Amount A:</p>
                              <p className="font-semibold text-white">{lookedUpEscrow.amountA} {nativeSymbol}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Amount B (Your deposit):</p>
                              <p className="font-semibold text-orange-400">{lookedUpEscrow.amountB} {nativeSymbol}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 text-sm text-slate-300">
                            <Clock className="w-4 h-4" />
                            <span>
                              {lookedUpEscrow.status === 2
                                ? "Completed"
                                : lookedUpEscrow.depositDeadline && lookedUpEscrow.depositDeadline > Date.now()
                                  ? `Deposit deadline: ${Math.ceil((lookedUpEscrow.depositDeadline - Date.now()) / (1000 * 60 * 60))} hours left`
                                  : lookedUpEscrow.depositDeadline && lookedUpEscrow.depositDeadline <= Date.now()
                                    ? "Deposit deadline expired"
                                    : lookedUpEscrow.deadline > Date.now() && lookedUpEscrow.deadline < Date.now() + (365 * 24 * 60 * 60 * 1000)
                                      ? `${Math.ceil((lookedUpEscrow.deadline - Date.now()) / (1000 * 60 * 60 * 24))} days left`
                                      : lookedUpEscrow.deadline > Date.now()
                                        ? "Valid"
                                        : "Expired"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-green-500 hover:bg-green-600" 
                        onClick={joinEscrow}
                        disabled={!canJoinEscrow(lookedUpEscrow)}
                      >
                        {canJoinEscrow(lookedUpEscrow)
                          ? "Join Escrow & Deposit Funds"
                          : lookedUpEscrow?.status === 2
                            ? "Escrow Completed"
                            : lookedUpEscrow?.status === 3
                              ? "Escrow Cancelled"
                              : lookedUpEscrow && lookedUpEscrow.deadline <= Date.now()
                                ? "Escrow Expired"
                                : "Not Eligible (Switch to invited wallet)"}
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="w-full border-slate-700 text-slate-300 hover:bg-slate-800" 
                        onClick={() => checkEscrowStatus(lookedUpEscrow.id)}
                      >
                        Debug: Check Escrow Status
                      </Button>
                    </div>
                  </div>
                )}

                {joinEscrowId && !lookedUpEscrow && !lookupError && (
                  <Alert className="bg-slate-900/60 border-slate-700 text-slate-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-slate-300">
                      Always verify escrow details carefully before depositing funds. Ensure you trust the counterparty
                      and understand the terms. You have 5 minutes to fulfill your part after depositing.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-slate-900/50 border border-slate-700 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Settings className="w-5 h-5" />
                  <span>Contract Settings</span>
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure the smart contract connection and view enhanced features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="contractAddress" className="text-slate-300">Contract Address</Label>
                  <Input
                    id="contractAddress"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-400 font-mono"
                  />
                  <p className="text-xs text-slate-500">Current: {DEFAULT_CONTRACT_ADDRESS}</p>
                </div>

                <div className="bg-slate-900/60 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">Enhanced Contract Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Network:</span>
                      <span className="font-medium text-white">{networkName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Service Fee:</span>
                      <span className="font-medium text-white">0.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Execution Window:</span>
                      <span className="font-medium text-white">30 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Refund Window:</span>
                      <span className="font-medium text-white">5 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Status:</span>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                        Enhanced Active
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={async () => {
                      if (!contract) {
                        alert("Contract not initialized")
                        return
                      }
                      try {
                        const owner = await contract.owner()
                        const paused = await contract.paused()
                        const nextId = await contract.nextEscrowId()
                        alert(`Contract Test Results:\nOwner: ${owner}\nPaused: ${paused}\nNext Escrow ID: ${nextId}`)
                      } catch (error) {
                        alert(`Contract test failed: ${error}`)
                      }
                    }}
                  >
                    Test Connection
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                    onClick={async () => {
                      if (!contract) {
                        alert("Contract not initialized")
                        return
                      }
                      try {
                        // Check escrow #1 status
                        const flagsArr = await contract.getEscrowFlags(1)
                        const timesArr = await contract.getEscrowTimes(1)
                        const [partyA, partyB] = await contract.getEscrowParties(1)
                        const [amountA, amountB] = await contract.getEscrowAmounts(1)
                        
                        const status = {
                          partyADeposited: flagsArr[0],
                          partyBDeposited: flagsArr[1],
                          completed: flagsArr[2],
                          cancelled: flagsArr[3],
                          creationTime: new Date(Number(timesArr[0]) * 1000),
                          depositDeadline: new Date(Number(timesArr[1]) * 1000),
                          partyA: partyA,
                          partyB: partyB,
                          amountA: ethers.formatEther(amountA),
                          amountB: ethers.formatEther(amountB)
                        }
                        
                        console.log("Escrow #1 Status:", status)
                        alert(`Escrow #1 Status:\nParty A Deposited: ${status.partyADeposited}\nParty B Deposited: ${status.partyBDeposited}\nCompleted: ${status.completed}\nCancelled: ${status.cancelled}\nCreation: ${status.creationTime}\nDeadline: ${status.depositDeadline}`)
                      } catch (error) {
                        alert(`Error checking escrow: ${error}`)
                      }
                    }}
                  >
                    Check Escrow #1 Status
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                    onClick={async () => {
                      if (!contract) {
                        alert("Contract not initialized")
                        return
                      }
                      try {
                        // Try to manually complete escrow #1 if both parties have deposited
                        const flagsArr = await contract.getEscrowFlags(1)
                        if (flagsArr[0] && flagsArr[1] && !flagsArr[2] && !flagsArr[3]) {
                          if (!provider) {
                            alert("Provider not available")
                            return
                          }
                          const signer = await provider.getSigner()
                          const contractWithSigner = contract.connect(signer) as ethers.Contract
                          
                          // Call the manual completion function
                          alert("Attempting to manually complete escrow...")
                          const tx = await contractWithSigner.manualCompleteEscrow(1)
                          const receipt = await tx.wait()
                          
                          if (receipt.status === 1) {
                            alert("Escrow manually completed successfully!")
                          } else {
                            alert("Manual completion failed")
                          }
                        } else {
                          alert("Escrow cannot be completed manually. Check the status first.")
                        }
                      } catch (error) {
                        alert(`Error: ${error}`)
                      }
                    }}
                  >
                    Manual Complete Escrow #1
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                    onClick={async () => {
                      if (!contract) {
                        alert("Contract not initialized")
                        return
                      }
                      try {
                        // Check contract balance and escrow status
                        if (!provider) {
                          alert("Provider not available")
                          return
                        }
                        const balance = await provider.getBalance(contractAddress)
                        const flagsArr = await contract.getEscrowFlags(1)
                        const [amountA, amountB] = await contract.getEscrowAmounts(1)
                        
                        const totalDeposited = amountA + amountB
                        const currentBalance = balance
                        
                        console.log("Contract Analysis:")
                        console.log("Current Balance:", ethers.formatEther(currentBalance), "ETH")
                        console.log("Total Deposited:", ethers.formatEther(totalDeposited), "ETH")
                        console.log("Party A Deposited:", flagsArr[0])
                        console.log("Party B Deposited:", flagsArr[1])
                        console.log("Completed:", flagsArr[2])
                        console.log("Cancelled:", flagsArr[3])
                        
                        if (flagsArr[0] && flagsArr[1] && !flagsArr[2] && !flagsArr[3]) {
                          if (currentBalance < totalDeposited) {
                            alert(`Funds may have been transferred!\nCurrent Balance: ${ethers.formatEther(currentBalance)} ETH\nTotal Deposited: ${ethers.formatEther(totalDeposited)} ETH\nDifference: ${ethers.formatEther(totalDeposited - currentBalance)} ETH`)
                          } else {
                            alert(`Funds still in contract.\nCurrent Balance: ${ethers.formatEther(currentBalance)} ETH\nTotal Deposited: ${ethers.formatEther(totalDeposited)} ETH`)
                          }
                        } else {
                          alert(`Escrow Status:\nParty A Deposited: ${flagsArr[0]}\nParty B Deposited: ${flagsArr[1]}\nCompleted: ${flagsArr[2]}\nCancelled: ${flagsArr[3]}`)
                        }
                      } catch (error) {
                        alert(`Error: ${error}`)
                      }
                    }}
                  >
                    Check Contract Balance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
