'use client'

import * as React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pagination } from '../pagination/pagination'

/* --------------------------------------
   BASE ITEM TYPE 
-------------------------------------- */
export interface TableItem {
  id: string | number
}

/* --------------------------------------
   COLUMN DEFINITION
-------------------------------------- */
export interface ColumnDefinition<T extends TableItem> {
  key: keyof T
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
}

/* --------------------------------------
   TABLE PROPS
-------------------------------------- */
interface ResponsiveTableProps<T extends TableItem> {
  title: string
  data: T[]
  loading: boolean
  columns: ColumnDefinition<T>[]
  actions?: (item: T) => React.ReactNode
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  searchTerm: string
  onSearchTermChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSearchClick: () => void
  searchPlaceholder?: string

  /** Optional top-right custom header button(s) */
  headerActions?: React.ReactNode
}

/* --------------------------------------
   MAIN COMPONENT
-------------------------------------- */
export function ResponsiveTable<T extends TableItem>({
  title,
  data,
  loading,
  columns,
  actions,
  currentPage,
  totalPages,
  onPageChange,
  searchTerm,
  onSearchTermChange,
  onSearchClick,
  searchPlaceholder,
  headerActions,
}: ResponsiveTableProps<T>) {
  return (
    <Card className='w-full '>
      <div className='p-6 space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center mb-4 flex-wrap gap-4'>
          <h1 className='text-2xl font-semibold'>{title}</h1>
          {headerActions && <div className='flex gap-3'>{headerActions}</div>}
        </div>

        {/* Search */}
        <div className='flex items-center gap-4 mb-4 flex-wrap'>
          <Input
            type='text'
            placeholder={searchPlaceholder || 'Search...'}
            className='w-full max-w-sm'
            value={searchTerm}
            onChange={onSearchTermChange}
            onKeyUp={(e) => e.key === 'Enter' && onSearchClick()}
          />
          <Button onClick={onSearchClick}>Search</Button>
        </div>

        {/* Loader / Empty / Table */}
        {loading ? (
          <div className='text-center py-8'>Loading...</div>
        ) : data.length === 0 ? (
          <div className='text-center py-8'>No results found</div>
        ) : (
          <>
            {/* Desktop */}
            <div className='hidden lg:block overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((col) => (
                      <TableHead key={col.key.toString()}>
                        {col.header}
                      </TableHead>
                    ))}
                    {actions && (
                      <TableHead className='text-center'>Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      {columns.map((col) => (
                        <TableCell key={`${item.id}-${col.key.toString()}`}>
                          {col.render
                            ? col.render(item)
                            : (item[col.key] as React.ReactNode)}
                        </TableCell>
                      ))}

                      {actions && (
                        <TableCell className='text-center'>
                          <div className='flex gap-2 justify-center'>
                            {actions(item)}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile */}
            <div className='lg:hidden space-y-4'>
              {data.map((item) => (
                <Card key={item.id} className='p-4 shadow-sm'>
                  <div className='space-y-3'>
                    {columns.map((col) => (
                      <div
                        key={`${item.id}-${col.key.toString()}`}
                        className='flex justify-between'
                      >
                        <strong>{col.header}:</strong>
                        <span>
                          {col.render
                            ? col.render(item)
                            : (item[col.key] as React.ReactNode)}
                        </span>
                      </div>
                    ))}

                    {actions && (
                      <div className='pt-2 flex gap-2 justify-end'>
                        {actions(item)}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className='pt-6'>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
