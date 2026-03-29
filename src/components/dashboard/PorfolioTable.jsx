import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Spinner } from '@/components/ui/spinner'

const ProfolioTable = ({ columns, data, loadingState, title = '' }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <TableHead key={header.id} className="text-left">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
        )}
      </div>
    </div>
  )
}

export default ProfolioTable
