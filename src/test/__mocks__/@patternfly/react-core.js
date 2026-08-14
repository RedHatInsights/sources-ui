// Simple override to PF Tooltip to enable its testing
export const Tooltip = ({ children, content }) => {
  const [visible, setVisible] = React.useState();

  if (visible) {
    return (
      <div onMouseLeave={() => setVisible(false)}>
        {children}
        <span data-testid="tooltip" hidden={true}>
          {content}
        </span>
      </div>
    );
  }

  const trigger = () => setVisible(true);

  return (
    <div onMouseOver={trigger} onClick={trigger} className="mocked-tooltip">
      {children}
    </div>
  );
};

const lib = jest.requireActual('@patternfly/react-core');

const pf = {
  ...lib,
  Tooltip,
};

module.exports = pf;
