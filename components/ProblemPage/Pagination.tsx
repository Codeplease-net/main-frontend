import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import { useTranslations } from "next-intl";
  
  export default function PaginationBar({ currentPage, maxPages }: { currentPage: number, maxPages: number }) {  
    const t = useTranslations('Problems');  
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious t = {t} href={currentPage > 1 ? `?page=${currentPage - 1}` : ''}/>
          </PaginationItem>
          { currentPage > 3 &&(
            <>
              <PaginationItem>
                <PaginationLink href={`?page=1`}>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href={`?page=2`}>2</PaginationLink>
              </PaginationItem>
            <PaginationEllipsis />
            </>)
          }
          { currentPage > 1 && (
              <PaginationItem>
                <PaginationLink href={`?page=${currentPage - 1}`}>{currentPage - 1}</PaginationLink>
              </PaginationItem>)
        }
          <PaginationItem>
            <PaginationLink href={`?page=${currentPage}`} isActive>
                {currentPage}
            </PaginationLink>
          </PaginationItem>
          { currentPage < maxPages - 1 &&(
            <PaginationEllipsis />)
          }
          <PaginationItem>
          </PaginationItem>
          { currentPage < maxPages && (
              <PaginationItem>
                <PaginationLink href={`?page=${maxPages}`}>{maxPages}</PaginationLink>
              </PaginationItem>)}
          <PaginationItem>
            <PaginationNext t = {t} href={currentPage < maxPages ? `?page=${currentPage + 1}` : ""} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }
  