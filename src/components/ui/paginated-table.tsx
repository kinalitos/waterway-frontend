import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton.js";
import { Button } from "@/components/ui/button"

export const PaginatedTable = ({ columns, data, isLoading, emptyState, renderRow, pagination }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-[#418fb6]/20 overflow-hidden bg-white shadow-md">
        <Table>
          <TableHeader className="bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9]">
            <TableRow>
              {columns.map((col, idx) => (
                <TableHead key={idx} className={`${col.align === 'right' ? 'text-right' : ''} font-semibold`}>
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-6 w-full"/>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-6">
                  {emptyState}
                </TableCell>
              </TableRow>
            ) : (
              data.map(renderRow)
            )}
          </TableBody>
        </Table>
        {/* Pagination controls */}
      </div>
      <div className="flex justify-end items-center p-4">
        <Button
          className="bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] hover:opacity-90 transition-all shadow-md hover:shadow-lg"
          onClick={() => pagination.onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          Prev
        </Button>
        <span className="mx-2">{pagination.page} / {pagination.totalPages}</span>
        <Button
          className="bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] hover:opacity-90 transition-all shadow-md hover:shadow-lg"
          onClick={() => pagination.onPageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
