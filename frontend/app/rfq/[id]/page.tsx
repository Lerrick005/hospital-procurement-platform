'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowLeft,
  Loader2,
  Award,
  CheckCircle,
  Clock,
  Download,
  Users,
  DollarSign,
  Calendar,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  Send,
} from 'lucide-react'
import { useRFQ } from '@/hooks/useRFQ'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'

export default function RFQDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { data: rfq, isLoading } = useRFQ(id)
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!rfq) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <p className="text-muted-foreground">RFQ not found</p>
        <Button onClick={() => router.push('/rfq')} className="mt-4">
          Back to RFQs
        </Button>
      </div>
    )
  }

  // Determine best quote (lowest price)
  const bestQuote = rfq.receivedQuotes?.length > 0
    ? rfq.receivedQuotes.reduce((best: any, current: any) => 
        current.totalPrice < best.totalPrice ? current : best
      )
    : null

  // Calculate stats for this RFQ
  const totalSuppliersInvited = rfq.invitedSuppliers?.length || 0
  const totalResponses = rfq.receivedQuotes?.length || 0
  const responseRate = totalSuppliersInvited > 0 
    ? Math.round((totalResponses / totalSuppliersInvited) * 100) 
    : 0

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="mb-2 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{rfq.title}</h1>
            <Badge>{rfq.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {rfq.rfqNumber} • {rfq.department}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {rfq.status === 'evaluating' && (
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Award className="h-4 w-4 mr-2" />
              Award Best Quote
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(rfq.budgetEstimate || 0)}</p>
              <p className="text-xs text-muted-foreground">Estimated Budget</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalResponses}/{totalSuppliersInvited}</p>
              <p className="text-xs text-muted-foreground">Quotes Received</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{responseRate}%</p>
              <p className="text-xs text-muted-foreground">Response Rate</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Calendar className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {rfq.submissionDeadline ? formatDate(rfq.submissionDeadline) : '—'}
              </p>
              <p className="text-xs text-muted-foreground">Deadline</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="quotes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="quotes" className="gap-2">
            <FileText className="h-4 w-4" />
            Quote Comparison
            {rfq.receivedQuotes?.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {rfq.receivedQuotes.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="details" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="gap-2">
            <Users className="h-4 w-4" />
            Suppliers
            {rfq.invitedSuppliers?.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {rfq.invitedSuppliers.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* QUOTE COMPARISON TAB — Unique to RFQ */}
        <TabsContent value="quotes">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quote Comparison</CardTitle>
              {bestQuote && (
                <p className="text-sm text-emerald-600">
                  🏆 Best quote: {bestQuote.supplierName} — {formatCurrency(bestQuote.totalPrice)}
                  <span className="text-xs text-muted-foreground ml-2">
                    (Saving {formatCurrency(rfq.budgetEstimate - bestQuote.totalPrice)})
                  </span>
                </p>
              )}
            </CardHeader>
            <CardContent>
              {rfq.receivedQuotes?.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Send className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No quotes received yet</p>
                  <p className="text-sm">Waiting for suppliers to respond</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Supplier</TableHead>
                        <TableHead className="text-right">Total Price</TableHead>
                        <TableHead className="text-right">Items</TableHead>
                        <TableHead>Delivery Time</TableHead>
                        <TableHead>Payment Terms</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rfq.receivedQuotes.map((quote: any, index: number) => {
                        const isBest = bestQuote && quote.id === bestQuote.id
                        const isSelected = selectedSupplier === quote.id
                        
                        return (
                          <TableRow 
                            key={quote.id}
                            className={cn(
                              isBest && 'bg-emerald-500/5 border-l-4 border-l-emerald-500',
                              isSelected && 'bg-blue-500/5'
                            )}
                          >
                            <TableCell>
                              <div>
                                <p className="font-medium">{quote.supplierName}</p>
                                <p className="text-xs text-muted-foreground">
                                  Submitted {formatDate(quote.submittedAt)}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div>
                                <p className={cn(
                                  'font-bold',
                                  isBest ? 'text-emerald-600' : 'text-muted-foreground'
                                )}>
                                  {formatCurrency(quote.totalPrice)}
                                </p>
                                {isBest && (
                                  <Badge className="bg-emerald-500/10 text-emerald-600 text-xs">
                                    Best Price
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {quote.items?.length || 0}
                            </TableCell>
                            <TableCell>{quote.deliveryTime || '—'}</TableCell>
                            <TableCell>{quote.paymentTerms || '—'}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-emerald-500/5">
                                <CheckCircle className="h-3 w-3 mr-1 text-emerald-500" />
                                Received
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant={isSelected ? 'default' : 'outline'} 
                                size="sm"
                                onClick={() => setSelectedSupplier(quote.id)}
                              >
                                {isSelected ? 'Selected' : 'Select'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm">{rfq.description || 'No description'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <Badge>{rfq.priority}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm">{formatDate(rfq.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{formatDate(rfq.updatedAt)}</p>
                </div>
              </div>
              {rfq.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm">{rfq.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers">
          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Quoted</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rfq.invitedSuppliers?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No suppliers invited yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    rfq.invitedSuppliers.map((supplier: any) => {
                      const hasQuoted = rfq.receivedQuotes?.some(
                        (q: any) => q.supplierId === supplier.id
                      )
                      const quote = rfq.receivedQuotes?.find(
                        (q: any) => q.supplierId === supplier.id
                      )
                      
                      return (
                        <TableRow key={supplier.id}>
                          <TableCell className="font-medium">{supplier.name}</TableCell>
                          <TableCell>
                            {hasQuoted ? (
                              <Badge className="bg-emerald-500/10 text-emerald-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Quoted
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {hasQuoted ? formatDate(quote?.submittedAt) : '—'}
                          </TableCell>
                          <TableCell>
                            {hasQuoted ? formatCurrency(quote?.totalPrice || 0) : '—'}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
