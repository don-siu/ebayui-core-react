import { Children, Dispatch, FC, ReactElement, ReactNode, SetStateAction, useEffect, useState } from 'react'
import useKeyPress from './use-key-press'

const useRovingIndex = (
    children: ReactNode,
    FocusableType: FC,
    defaultValue?: number
): [number | undefined, Dispatch<SetStateAction<number | undefined>>] => {
    const [rovingIndex, setRovingIndex] = useState(defaultValue)
    const [arrowUpPressed, arrowDownPressed] = useKeyPress()

    const rovingIndexArray = Children
        .toArray(children)
        .reduce<number[]>((focusables, child, i) =>
            child as ReactElement.type === FocusableType ? [...focusables, i] : focusables, [])

    const currentIndex = rovingIndex === undefined ? -1 : rovingIndexArray.indexOf(rovingIndex)

    const previousOrCurrent = () => {
        if (currentIndex === -1) return rovingIndex

        const previousRovingIndex = rovingIndexArray[currentIndex - 1]
        return previousRovingIndex === undefined ? rovingIndex : previousRovingIndex
    }
    const nextOrCurrent = () => {
        if (currentIndex === -1) return rovingIndex
        const nextRovingIndex = rovingIndexArray[currentIndex + 1]

        return nextRovingIndex === undefined ? rovingIndex : nextRovingIndex
    }

    useEffect(() => {
        if (arrowUpPressed) setRovingIndex(previousOrCurrent())
        if (arrowDownPressed) setRovingIndex(nextOrCurrent())
    }, [arrowUpPressed, arrowDownPressed])


    return [rovingIndex, setRovingIndex]
}

export default useRovingIndex
