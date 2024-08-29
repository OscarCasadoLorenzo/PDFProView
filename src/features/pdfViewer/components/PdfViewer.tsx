import { useAtom } from 'jotai'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { VariableSizeList } from 'react-window'
import useResizeObserver from 'use-resize-observer'
import { scaleAtom, totalPagesAtom } from '../../../data/atoms'
import Page from './Page'
import PdfPage from './PdfPage'

type PdfViewerProps = {
  width?: number | string
  height?: number | string
  itemCount: number
  getPdfPage: (index: number) => Promise<any>
  gap?: number
  windowRef?: any
}

const PdfViewer: FC<PdfViewerProps> = ({
  width,
  height,
  itemCount,
  getPdfPage,
  gap,
  windowRef
}: PdfViewerProps) => {
  const [pages, setPages] = useState([])

  const [scale] = useAtom(scaleAtom)

  const listRef: any = useRef()

  const {
    ref,
    width: internalWidth = 400,
    height: internalHeight = 600
  } = useResizeObserver()

  const fetchPage = useCallback(
    (index: number) => {
      if (!pages[index]) {
        getPdfPage(index).then((page) => {
          setPages((prev) => {
            const next: any = [...prev]
            next[index] = page
            return next
          })
          listRef.current.resetAfterIndex(index)
        })
      }
    },
    [getPdfPage, pages]
  )

  const [, setTotalPages] = useAtom(totalPagesAtom)
  useEffect(() => {
    setTotalPages(pages.length)
  }, [pages])

  const handleItemSize = useCallback(
    (index: number) => {
      const page: any = pages[index]
      if (page) {
        const viewport = page.getViewport({ scale })
        return viewport.height + gap
      }
      return 50
    },
    [pages, scale, gap]
  )

  const handleListRef = useCallback(
    (elem: any) => {
      listRef.current = elem
      if (windowRef) {
        windowRef.current = elem
      }
    },
    [windowRef]
  )

  useEffect(() => {
    listRef.current.resetAfterIndex(0)
  }, [scale])

  const style = {
    width,
    height,
    border: '1px solid #ccc',
    background: '#ddd'
  }

  return (
    <div ref={ref} style={style}>
      <VariableSizeList
        ref={handleListRef}
        width={internalWidth}
        height={internalHeight}
        itemCount={itemCount}
        itemSize={handleItemSize}
      >
        {({ index, style }: any) => {
          fetchPage(index)
          return (
            <Page style={style}>
              <PdfPage page={pages[index]} />
            </Page>
          )
        }}
      </VariableSizeList>
    </div>
  )
}

PdfViewer.defaultProps = {
  width: '100%',
  height: '70vh',
  gap: 40
}

export default PdfViewer
