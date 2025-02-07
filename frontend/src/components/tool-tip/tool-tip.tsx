import React, { useState } from "react";

interface TooltipProp {
  text: string;
  children: React.ReactNode;
}

const Tooltip = ({ text, children }: TooltipProp) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="p-0 ml-auto mt-auto mb-auto h-auto w-auto flex relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div
          className="fixed z-50 block bg-primary-color rounded-md text-white p-1 font-semibold text-sm w-1/6 transform -translate-y-full shadow-default text-left"
          dangerouslySetInnerHTML={{
            __html: text,
          }}
        ></div>
      )}
    </div>
  );
};

export default Tooltip;
