import React, { useState, useRef } from "react";
0
type TooltipProps = {
    delay?: number;
    direction?: string;
    content: string;
    children: any;
  };

const Tooltip = (props: TooltipProps) => {
    const timeout = useRef<NodeJS.Timeout | null>(null); // define a ref to store the timeout ID
    const [active, setActive] = useState(false);
  
    const showTip = () => {
      timeout.current = setTimeout(() => {
        setActive(true);
      }, props.delay || 100);
    };
  
    const hideTip = () => {
      if (timeout.current) clearInterval(timeout.current); // clear the timeout if it exists
      setActive(false);
    };
  
    return (
      <div
        className='tooltip-Wrapper tooltip-root'
        // When to show the tooltip
        onMouseEnter={showTip}
        onMouseLeave={hideTip}
      >
        {/* Wrapping */}
        {props.children}
        {active && (
          <div className={`tooltip-Tip ${props.direction || "top"}`}>
            {/* Content */}
            {props.content}
          </div>
        )}
      </div>
    );
  };
  
  export default Tooltip;
