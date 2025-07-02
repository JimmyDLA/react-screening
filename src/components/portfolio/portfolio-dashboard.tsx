'use client'

import { useState, useEffect } from 'react'
import { useWalletUi } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PortfolioData {
  balance: number
  tokens: TokenInfo[]
  totalValue: number
}

interface TokenInfo {
  mint: string
  amount: string
  decimals: number
  symbol?: string
}

const mockData: Omit<PortfolioData, 'totalValue'> = {
  balance: 2500000000,
  tokens: [
    { mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', amount: '1000000', decimals: 6, symbol: 'USDC' },
    { mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', amount: '500000000', decimals: 6, symbol: 'USDT' },
  ]
}

export function PortfolioDashboard() {
  const { account = mockData, cluster } = useWalletUi()
  const [portfolio, setPortfolio] = useState<PortfolioData>({
    balance: 0,
    tokens: [],
    totalValue: 0,
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (account) {
      fetchPortfolioData()
    }
  }, [account, cluster])

  const fetchPortfolioData = async () => {
    if (!account) return
    console.log('FETCHING')
    setIsLoading(true)
    try {
      const solBalance = mockData.balance / 1000000
      
      setPortfolio({
        balance: mockData.balance,
        tokens: mockData.tokens,
        totalValue: solBalance
      })

    } catch (err) {
      console.error(err)
      setError('Error')
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 1000);
    }
  }

  const calculateTotalValue = () => {
    return portfolio.tokens.reduce((total, token) => {
      return total + parseFloat(token.amount)
    }, 0)
  }

  const formatBalance = (balance: number) => {
    return balance.toFixed(2)
  }

  if (!account) {
    return (
      <div className="p-2">
        <h1 className="text-6xl font-bold mb-2 whitespace-nowrap overflow-hidden">
          Portfolio Dashboard - Please Connect Wallet
        </h1>
        <div className="bg-yellow-200 p-8 rounded border-4 border-yellow-500">
          <p className="text-2xl font-bold whitespace-nowrap">
            ⚠️ WALLET CONNECTION REQUIRED - Please connect your Solana wallet to view your cryptocurrency portfolio
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-2 overflow-x-hidden">
      <h1 className="text-3xl md:text-5xl font-bold pb-10 overflow-hidden">
        My Portfolio Dashboard for Cryptocurrency Assets
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-xs">{error}</div>
      )}

      <div className="flex flex-col lg:flex-row flex-wrap gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="md:text-md text-xl whitespace-nowrap">SOL Balance Information</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-lg">Loading your balance...</div>
            ) : (
              <div>
                <p className="sm:text-2xl lg:text-4xl font-bold whitespace-nowrap">{formatBalance(portfolio.balance)} SOL</p>
                <p className="text-base text-gray-500 whitespace-nowrap">Current Network: {cluster.label}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl whitespace-nowrap">Token Holdings & Assets</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (<div className="text-lg">Loading your token...</div>) : (
            <>
              {portfolio.tokens.length === 0 ? (
                <p className="text-lg">No tokens found in wallet</p>
              ) : (
                <div>
                  {portfolio.tokens.map((token, index) => (
                    <div key={index} className="flex flex-col justify-content: flex-start border-b pb-2">
                      <div>
                        <span className="text-lg font-medium">{token.symbol || 'Unknown Token'}</span>
                        <p className="break-all text-sm text-gray-600 font-mono">{token.mint}</p>
                      </div>
                      <span className="text-lg font-mono whitespace-nowrap">{token.amount} tokens</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl whitespace-nowrap">Total Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (<div className="text-lg">Loading your total...</div>) : 
            (
              <p className="text-2xl lg:text-4xl font-bold whitespace-nowrap">${calculateTotalValue().toFixed(2)} USD</p>
            )}
            <Button
              onClick={fetchPortfolioData}
              disabled={isLoading}
              className="mt-6 w-full text-lg py-4 px-8 whitespace-nowrap"
            >
              Refresh Portfolio Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
