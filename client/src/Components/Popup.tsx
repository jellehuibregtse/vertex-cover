import React, { CSSProperties, useEffect, useRef, useState } from 'react';

export function Popup(props: {
    open: boolean;
    transitionFade?: string;
    x?: number;
    y?: number;
    centerX?: boolean;
    centerY?: boolean;
    style?: CSSProperties;
    children?: any;
}): JSX.Element {
    const self = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [children, setChildren] = useState<never>();

    const open = props.open;

    useEffect(() => {
        if (self.current) {
            setDimensions({
                width: self.current.offsetWidth,
                height: self.current.offsetHeight
            });
        }
        if (open) setChildren(props.children);
    }, [open, props.children]);

    return (
        <div
            ref={self}
            style={{
                ...{
                    pointerEvents: props.open ? 'auto' : 'none',
                    opacity: props.open ? 1 : 0,
                    transition: props.transitionFade
                        ? props.open
                            ? 'opacity ' + props.transitionFade + ' linear'
                            : 'visibility ' + props.transitionFade + ', opacity ' + props.transitionFade + ' linear'
                        : '',
                    position: 'absolute',
                    left: props.x ? props.x - (self.current && props.centerX ? dimensions.width / 2 : 0) : 'auto',
                    top: props.y ? props.y - (self.current && props.centerY ? dimensions.height / 2 : 0) : 'auto',
                    zIndex: 1000000
                },
                ...props.style
            }}
        >
            {children}
        </div>
    );
}
