import React, { Children, ComponentProps, FC, MouseEvent, useState } from 'react'
import classnames from 'classnames'
import { EbayIcon, Icon } from '../ebay-icon'
import { EbayButtonCell } from '../ebay-button'

type HTMLButtonProps = ComponentProps<'button'>;
export type ExpandButtonProps = HTMLButtonProps & {
    borderless?: boolean;
    icon?: Icon;
    onExpand?: () => void;
    onCollapse?: () => void;
    onClick?: (e: MouseEvent) => void;
}

const EbayExpandButton: FC<ExpandButtonProps> = ({
    className,
    borderless,
    icon = 'dropdown',
    onExpand = () => {},
    onCollapse = () => {},
    onClick = () => {},
    children,
    ...rest
}) => {
    const [expanded, setExpanded] = useState(false)
    const hasChildren = !!Children.count(children)
    const buttonClasses = classnames('expand-btn', className,
        { 'expand-btn--icon-only': !hasChildren },
        { 'expand-btn--borderless': borderless }
    )

    const handleClick = (evt: MouseEvent) => {
        const willExpand = !expanded
        if (willExpand) {
            onExpand()
        } else {
            onCollapse()
        }
        setExpanded(!expanded)
        onClick(evt)
    }

    return (
        <button
            {...rest}
            className={borderless && !hasChildren ? 'icon-btn' : buttonClasses}
            aria-expanded={expanded}
            onClick={handleClick}
        >
            {borderless && !hasChildren ?
                <EbayIcon name={icon} /> :
                <EbayButtonCell type="expand">
                    {hasChildren && <span className="expand-btn__text">{children}</span>}
                    <EbayIcon name={icon} />
                </EbayButtonCell>
            }
        </button>
    )
}

export default EbayExpandButton
