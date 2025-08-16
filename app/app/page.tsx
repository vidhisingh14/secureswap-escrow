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
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "EscrowCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "EscrowCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "partyA",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "partyB",
        type: "address",
      },
    ],
    name: "EscrowCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "depositor",
        type: "address",
      },
    ],
    name: "FundsDeposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "TransactionApproved",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "approveTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "cancelEscrow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_partyB",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amountB",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
    ],
    name: "createEscrow",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "depositFunds",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "escrows",
    outputs: [
      {
        internalType: "address",
        name: "partyA",
        type: "address",
      },
      {
        internalType: "address",
        name: "partyB",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountA",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountB",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "status",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadlines",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "getEscrowParties",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "getEscrowDescription",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getUserEscrows",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]

const DEFAULT_CONTRACT_ADDRESS = "0x9a015454c3D9568a55bE928266b0454Ca3287A36"

// Web3 provider and contract instance
let provider: ethers.BrowserProvider | null = null
let contract: ethers.Contract | null = null

interface Escrow {
  id: number
  partyA: string
  partyB: string
  amountA: string
  amountB: string
  status: number
  description: string
  deadline: number
  partyADeposited: boolean
  partyBDeposited: boolean
  executionWindow: number
  refundWindow: number
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

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        setWalletAddress(accounts[0])
        setWalletConnected(true)
        // Initialize provider and contract
        provider = new ethers.BrowserProvider(window.ethereum)
        contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider)
      } catch (error) {
        console.error("Failed to connect wallet:", error)
        setError("Failed to connect wallet")
      }
    } else {
      alert("Please install MetaMask to use this application")
    }
  }

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
      const contractWithSigner = contract.connect(signer)
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
        const escrow = await contract.escrows(escrowId)
        const [partyA, partyB] = await contract.getEscrowParties(escrowId)
        const description = await contract.getEscrowDescription(escrowId)
        
        // Enhanced escrow object with new timing features
        const escrowDetail: Escrow = {
          id: Number(escrowId),
          partyA,
          partyB,
          amountA: ethers.formatEther(escrow.amountA),
          amountB: ethers.formatEther(escrow.amountB),
          status: Number(escrow.status),
          description,
          deadline: Number(escrow.deadlines),
          partyADeposited: true, // Party A deposits when creating
          partyBDeposited: false,
          executionWindow: 30000, // 30 seconds
          refundWindow: 300000, // 5 minutes
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
      const signer = await provider.getSigner()
      const contractWithSigner = contract.connect(signer)
      
      const escrow = await contract.escrows(escrowId)
      const amountBWei = escrow.amountB

      const tx = await contractWithSigner.depositFunds(escrowId, { value: amountBWei })
      const receipt = await tx.wait()

      if (receipt.status === 1) {
        alert("Funds deposited successfully! Starting 30-second execution window...")
        
        // Start execution timer
        const executionTimer = setTimeout(() => {
          executeTransaction(escrowId)
        }, 30000) // 30 seconds
        
        setExecutionTimers(prev => ({ ...prev, [escrowId]: executionTimer }))
        
        // Start refund timer (5 minutes)
        const refundTimer = setTimeout(() => {
          refundToPartyA(escrowId)
        }, 300000) // 5 minutes
        
        setRefundTimers(prev => ({ ...prev, [escrowId]: refundTimer }))
        
        await loadUserEscrows()
      }
    } catch (error: any) {
      console.error("Error depositing funds:", error)
      setError(error.message || "Failed to deposit funds")
    }
  }

  const executeTransaction = async (escrowId: number) => {
    if (!walletConnected || !contract || !provider) return

    try {
      const signer = await provider.getSigner()
      const contractWithSigner = contract.connect(signer)

      const tx = await contractWithSigner.approveTransaction(escrowId)
      const receipt = await tx.wait()

      if (receipt.status === 1) {
        alert("Transaction executed successfully! Both parties have received their funds.")
        
        // Clear timers
        clearTimeout(executionTimers[escrowId])
        clearTimeout(refundTimers[escrowId])
        
        await loadUserEscrows()
      }
    } catch (error: any) {
      console.error("Error executing transaction:", error)
      setError("Failed to execute transaction automatically")
    }
  }

  const refundToPartyA = async (escrowId: number) => {
    if (!walletConnected || !contract || !provider) return

    try {
      const signer = await provider.getSigner()
      const contractWithSigner = contract.connect(signer)

      const tx = await contractWithSigner.cancelEscrow(escrowId)
      const receipt = await tx.wait()

      if (receipt.status === 1) {
        alert("Party B did not fulfill their part within 5 minutes. Funds refunded to Party A.")
        
        // Clear timers
        clearTimeout(executionTimers[escrowId])
        clearTimeout(refundTimers[escrowId])
        
        await loadUserEscrows()
      }
    } catch (error: any) {
      console.error("Error refunding funds:", error)
      setError("Failed to refund funds automatically")
    }
  }

  const approveTransaction = async (escrowId: number) => {
    if (!walletConnected || !contract || !provider) {
      setError("Please connect your wallet first")
      return
    }

    try {
      const signer = await provider.getSigner()
      const contractWithSigner = contract.connect(signer)

      const tx = await contractWithSigner.approveTransaction(escrowId)
      const receipt = await tx.wait()

      if (receipt.status === 1) {
        alert("Transaction approved successfully!")
        await loadUserEscrows()
      }
    } catch (error: any) {
      console.error("Error approving transaction:", error)
      setError(error.message || "Failed to approve transaction")
    }
  }

  const cancelEscrow = async (escrowId: number) => {
    if (!walletConnected || !contract || !provider) {
      setError("Please connect your wallet first")
      return
    }

    try {
      const signer = await provider.getSigner()
      const contractWithSigner = contract.connect(signer)

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
      const escrow = await contract.escrows(escrowId)
      const [partyA, partyB] = await contract.getEscrowParties(escrowId)
      const description = await contract.getEscrowDescription(escrowId)
      
      // Check if escrow exists and is valid
      if (!partyA || partyA === "0x0000000000000000000000000000000000000000") {
        setLookupError("Escrow not found")
        return
      }

      const escrowDetail: Escrow = {
        id: escrowId,
        partyA,
        partyB,
        amountA: ethers.formatEther(escrow.amountA),
        amountB: ethers.formatEther(escrow.amountB),
        status: Number(escrow.status),
        description,
        deadline: Number(escrow.deadlines),
        partyADeposited: true,
        partyBDeposited: false,
        executionWindow: 30000,
        refundWindow: 300000,
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
        if (escrow.partyBDeposited) {
          return (
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border border-green-500/30">
              <Timer className="w-3 h-3 mr-1" />
              Execution Window (30s)
            </Badge>
          )
        }
        return (
          <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border border-orange-500/30">
            <AlertCircle className="w-3 h-3 mr-1" />
            Active
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
      executionWindow: 30000,
      refundWindow: 300000,
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
      executionWindow: 30000,
      refundWindow: 300000,
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
            <strong>Enhanced Features:</strong> 30-second execution window when both parties deposit, 
            5-minute refund window if Party B doesn't fulfill their part. Automatic transaction execution and refunds.
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
                    <Label htmlFor="amountA" className="text-slate-300">Your Amount (ETH)</Label>
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
                  <Label htmlFor="amountB" className="text-slate-300">Expected Amount from Counterparty (ETH)</Label>
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
                      <span className="font-medium ml-2 text-white">{createForm.amountA || "0"} ETH</span>
                    </div>
                    <div>
                      <span className="text-slate-300">Expected:</span>
                      <span className="font-medium ml-2 text-white">{createForm.amountB || "0"} ETH</span>
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
                          <p className="font-semibold text-orange-400">{escrow.amountA} ETH</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Party A</p>
                          <p className="font-mono text-sm text-white">{formatAddress(escrow.partyA)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Party B</p>
                          <p className="font-mono text-sm text-white">{formatAddress(escrow.partyB)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Expected</p>
                          <p className="font-semibold text-sm text-white">{escrow.amountB} ETH</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                        <div className="flex items-center space-x-2 text-sm text-slate-300">
                          <Clock className="w-4 h-4" />
                          <span>
                            {escrow.status === 2
                              ? "Completed"
                              : escrow.deadline > Date.now() && escrow.deadline < Date.now() + (365 * 24 * 60 * 60 * 1000) // Check if deadline is reasonable (within 1 year)
                                ? `${Math.ceil((escrow.deadline - Date.now()) / (1000 * 60 * 60 * 24))} days left`
                                : escrow.deadline > Date.now()
                                  ? "Valid"
                                  : "Expired"}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          {escrow.status === 1 && escrow.partyBDeposited && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-slate-700 text-slate-300 hover:bg-slate-800"
                              onClick={() => approveTransaction(escrow.id)}
                            >
                              <Timer className="w-3 h-3 mr-1" />
                              Execute Now
                            </Button>
                          )}
                          {escrow.status === 0 && (
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
                          {escrow.status === 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-400 hover:text-red-300 bg-transparent border-slate-700"
                              onClick={() => cancelEscrow(escrow.id)}
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
                              <p className="font-semibold text-white">{lookedUpEscrow.amountA} ETH</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Amount B (Your deposit):</p>
                              <p className="font-semibold text-orange-400">{lookedUpEscrow.amountB} ETH</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 text-sm text-slate-300">
                            <Clock className="w-4 h-4" />
                            <span>
                              {lookedUpEscrow.status === 2
                                ? "Completed"
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

                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600" 
                      onClick={joinEscrow}
                      disabled={lookedUpEscrow.status !== 0}
                    >
                      {lookedUpEscrow.status === 0 
                        ? "Join Escrow & Deposit Funds" 
                        : lookedUpEscrow.status === 1 
                          ? "Escrow Already Active (Both Parties Deposited)"
                          : lookedUpEscrow.status === 2 
                            ? "Escrow Completed"
                            : lookedUpEscrow.status === 3 
                              ? "Escrow Cancelled"
                              : "Escrow Expired"}
                    </Button>
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
                      <span className="font-medium text-white">Ethereum Mainnet</span>
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

                <Button className="w-full bg-orange-500 hover:bg-orange-600">Test Connection</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
