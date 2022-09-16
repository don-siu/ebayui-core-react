import { Children, FC, ReactElement, ReactNode } from 'react'

export function findComponent(nodes: ReactNode = [], componentType: FC<any>): ReactElement | undefined {
    const elements = Children.toArray(nodes) as ReactElement[]
    return elements.find(({ type }) => type === componentType)
}

export function excludeComponent(nodes: ReactNode = [], componentType: FC<any>): ReactElement[] {
    const elements = Children.toArray(nodes) as ReactElement[]
    return elements.filter(({ type }) => type !== componentType)
}

export function filterByType(nodes: ReactNode = [], componentType: FC<any>, fn?: () => void): ReactElement[] {
    const elements = Children.toArray(nodes) as ReactElement[]
    return elements.filter(({ type }) => type === componentType)
}

export function filterBy(nodes: ReactNode = [], predicate: (el: ReactElement) => boolean): ReactElement[] {
    const elements = Children.toArray(nodes) as ReactElement[]
    return elements.filter(predicate)
}
