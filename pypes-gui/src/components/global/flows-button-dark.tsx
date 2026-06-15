import React from 'react';
import { Button } from '@mui/material';

interface FlowsButtonProps {
  onClick?: any;
  className?: string;
  children: any;
  disabled?: any;
  innerRef?: React.Ref<HTMLButtonElement>;
}

class InnerFlowsButtonDark extends React.Component<FlowsButtonProps> {
  render() {
    const { onClick, className, children, disabled, innerRef, ...rest } = this.props;
    return (
      <Button
        variant="contained"
        className={
          className +
          ' bg-flows-blue hover:bg-flows-light-blue text-flows-white hover:text-black shadow-none'
        }
        onClick={onClick}
        disabled={disabled}
        ref={innerRef}
        {...rest} // Spread the remaining props
      >
        {children}
      </Button>
    );
  }
}

const FlowsButtonDark = React.forwardRef<HTMLButtonElement, FlowsButtonProps>((props, ref) => {
  return <InnerFlowsButtonDark {...props} innerRef={ref} />;
});

export default FlowsButtonDark;
