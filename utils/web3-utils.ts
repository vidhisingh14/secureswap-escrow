// Web3-related configuration and small constants used across the app

export type ContractConfig = {
	defaultContractAddress: string
	networkName: string
	chainId?: number
}

export const CONTRACT_CONFIG: ContractConfig = {
	defaultContractAddress: "0x9a015454c3D9568a55bE928266b0454Ca3287A36",
	networkName: "Ethereum Mainnet",
	chainId: 1,
}

export const GAS_LIMITS = {
	default: 300000,
	createEscrow: 250000,
	depositFunds: 120000,
	approveTransaction: 80000,
	cancelEscrow: 90000,
}

export const TIMEOUTS = {
	transactionMs: 60_000,
	readMs: 15_000,
}

export const formatAddress = (address: string) => {
	if (!address || address.length < 10) return address
	return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const toWei = (eth: string | number) => {
	const value = typeof eth === "string" ? parseFloat(eth) : eth
	if (!Number.isFinite(value)) return "0"
	return Math.round(value * 1e18).toString()
}

export const fromWei = (wei: string | number) => {
	const value = typeof wei === "string" ? parseFloat(wei) : wei
	if (!Number.isFinite(value)) return "0"
	return (value / 1e18).toString()
}


