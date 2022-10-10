import React, {
    Children, ComponentProps, FC, ReactElement,
    cloneElement, useEffect, useRef, useState, createRef, RefObject, ReactNode
} from 'react'
import classNames from 'classnames'
import { debounce } from '../common/debounce'
import { calcPageState, getMaxWidth } from './helpers'
import { filterBy } from '../common/component-utils'
import { PaginationItemType } from './pagination-item'
import { ItemState, PaginationVariant } from './types'

type PaginationCallback = (e?: Event, value?: string) => void;
type PaginationProps = Omit<ComponentProps<'nav'>, 'onSelect'> & {
    id?: string;
    a11yPreviousText?: string;
    a11yNextText?: string;
    a11yCurrentText?: string;
    onPrevious?: PaginationCallback;
    onNext?: PaginationCallback;
    onSelect?: (e?: Event, value?: string, index?: number) => void;
    variant?: PaginationVariant;
    fluid?: boolean;
};

const EbayPagination: FC<PaginationProps> = ({
    id = 'ebay-pagination',
    className,
    a11yCurrentText = 'Pagination - Current Page',
    a11yPreviousText = 'Previous page',
    a11yNextText = 'Next page',
    variant = 'show-range',
    fluid = false,
    onPrevious = () => { },
    onNext = () => { },
    onSelect = () => { },
    children,
    ...rest
}) => {
    const paginationContainerRef = useRef<HTMLUnknownElement>(null)
    const childPageRefs = useRef<RefObject<HTMLUnknownElement>[]>([])
    childPageRefs.current = Children.map(children, () => createRef<HTMLUnknownElement>()) ?? []
    const totalPages = filterBy(children, ({ props }) => props.type === undefined || props.type === 'page').length

    const itemWidthRef = useRef<number>(0)
    const arrowWidthRef = useRef<number>(0)
    const getNumOfVisiblePageItems = () => {
        const pageArrowWidth = (arrowWidthRef.current || childPageRefs.current[0]?.current?.offsetWidth) ?? 0
        arrowWidthRef.current = pageArrowWidth ?? 0 // cache arrow width since it should be static

        const pageItemWidth = itemWidthRef.current || childPageRefs.current[1]?.current?.offsetWidth
        itemWidthRef.current = pageItemWidth ?? 0 // cache item width since it should be static

        return pageItemWidth ?
            Math.floor((getMaxWidth(paginationContainerRef.current) - pageArrowWidth * 2) / pageItemWidth) :
            0
    }

    const [page, setPage] = useState<ItemState[]>([])
    const updatePages = () => {
        const selectedPageIndex = childPageRefs.current.findIndex(pageRef =>
            pageRef.current?.getAttribute('aria-current') === 'page'
        )
        const visiblePageItems = getNumOfVisiblePageItems()
        const pageState = calcPageState(
            selectedPageIndex,
            visiblePageItems,
            totalPages,
            variant
        )
        setPage(['hidden', ...pageState])
    }

    useEffect(() => {
        const debouncedUpdate = debounce(updatePages, 16)

        updatePages()
        window.addEventListener('resize', debouncedUpdate)

        return () => {
            window.removeEventListener('resize', debouncedUpdate)
        }
    }, [children])

    const createChildItems = (itemType: PaginationItemType): ReactElement[] => {
        let pageIndex = 0

        // @ts-ignore Need to solve Children.map type
        return Children.map(children, (item, index) => {
            // @ts-ignore Need to solve Children.map type
            const { type = 'page', current, disabled, href, children: text } = item?.props ?? {}
            if (itemType !== type) {
                return null
            }

            // @ts-ignore Need to solve Children.map type
            return cloneElement(item, {
                type, current, disabled, href,
                children: page[index] === 'dots' ? '…' : text,
                pageIndex: type === 'page' ? pageIndex++ : undefined,
                key: `${id}-item-${index}`,
                hide: page[index] === 'hidden',
                onPrevious, onNext, onSelect, a11yPreviousText, a11yNextText,
                ref: childPageRefs.current[index]
            })
        })
    }

    const headingId = `${id}-pagination-heading`

    return (
        <nav
            {...rest}
            role="navigation"
            className={classNames(className, 'pagination', { 'pagination--fluid': fluid })}
            aria-labelledby={headingId}
            ref={paginationContainerRef}
        >
            <span aria-live="polite" role="status">
                <h2 className="clipped" id={headingId}>
                    {a11yCurrentText}
                </h2>
            </span>
            {createChildItems('previous')}
            <ol className="pagination__items">
                {createChildItems('page')}
            </ol>
            {createChildItems('next')}
        </nav>
    )
}

export default EbayPagination
