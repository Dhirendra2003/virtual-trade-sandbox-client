import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from '@tanstack/react-table'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'

const WatchlistTable = ({ columns, data, setSelectedStock, selectedStock, loadingState, pagination = true }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(pagination && { getPaginationRowModel: getPaginationRowModel() }),
  })
  return (
    <div className="overflow-hidden rounded-2xl border col-span-2 glass-card p-2">
      {loadingState ? (
        <div className="flex items-center justify-center h-full">
          <Spinner className="size-8" color="purple" />
        </div>
      ) : (
        <>
          <div className="overflow-y-auto h-[calc(100vh-180px)]">
            <Table>
              <TableHeader className="sticky top-0 z-10 ">
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      return (
                        <TableHead key={header.id} className="text-center py-1.5 text-xs">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      onClick={() => setSelectedStock(row.original.Stock.instrument_key)}
                      className={`text-center ${
                        row.original.Stock.instrument_key === selectedStock
                          ? 'bg-purple-800 hover:bg-purple-700 rounded-2xl text-white'
                          : 'hover:bg-selected-bg-purple/50'
                      }`}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id} className="py-1.5 text-xs">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-30 text-center">
                      <div className="text-xl font-thin italic text-slate-400 items-center justify-center">
                        No Stocks in Watchlist
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {pagination && (
            <div className="flex w-full items-center justify-center gap-2 py-2">
              <Button
                className={cn('primary-gradient hover:text-white hover:bg-purple-400 text-white')}
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft />
              </Button>
              {Array.from({ length: table.getPageCount() }, (_, i) => i).map(pageIndex => (
                <Button
                  key={pageIndex}
                  className={cn(
                    'min-w-8',
                    table.getState().pagination.pageIndex === pageIndex
                      ? 'border-4 border-purple-600'
                      : 'text-slate-400'
                  )}
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(pageIndex)}
                >
                  {pageIndex + 1}
                </Button>
              ))}
              <Button
                className={cn('primary-gradient hover:text-white hover:bg-purple-400 text-white')}
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default WatchlistTable
