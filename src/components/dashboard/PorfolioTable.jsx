import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from '@tanstack/react-table'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'

const ProfolioTable = ({ columns, data, loadingState, title = '', pagination = false }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(pagination && { getPaginationRowModel: getPaginationRowModel() }),
  })
  return (
    <div>
      <h2 className="text-md font-bold text-white primary-gradient w-fit px-3 pt-2 pb-6  rounded-t-xl">{title}</h2>

      <div className="overflow-hidden rounded-2xl border relative -top-5 col-span-2 glass-card h-full p-2">
        {loadingState ? (
          <div className="flex items-center justify-center h-full">
            <Spinner className="size-8" color="purple" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      return (
                        <TableHead key={header.id} className="text-left">
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
                    <TableRow key={row.id} className={`text-left hover:bg-purple-200/70`}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-30 text-center">
                      <div className="text-xl font-thin italic text-slate-400 items-center justify-center">
                        No Stocks in Profolio
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {pagination && (
              <div className="flex w-full items-center justify-center gap-2 py-4">
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
    </div>
  )
}

export default ProfolioTable
