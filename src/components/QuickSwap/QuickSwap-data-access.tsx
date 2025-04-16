import { getQuickSwapProgram, getQuickSwapProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'

import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useQuickSwapProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getQuickSwapProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getQuickSwapProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['QuickSwap', 'all', { cluster }],
    queryFn: () => program.account.QuickSwap.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['QuickSwap', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ QuickSwap: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useQuickSwapProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useQuickSwapProgram()

  const accountQuery = useQuery({
    queryKey: ['QuickSwap', 'fetch', { cluster, account }],
    queryFn: () => program.account.QuickSwap.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['QuickSwap', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ QuickSwap: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['QuickSwap', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ QuickSwap: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['QuickSwap', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ QuickSwap: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['QuickSwap', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ QuickSwap: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
