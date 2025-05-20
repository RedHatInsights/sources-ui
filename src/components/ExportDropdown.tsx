import React from 'react'
import { Dropdown, DropdownItem, DropdownList, MenuToggle, MenuToggleElement } from '@patternfly/react-core';
import ExportIcon from '@patternfly/react-icons/dist/esm/icons/export-icon';

const ExportDropDown: React.FC<{ onExport: (type: 'csv' | 'json') => void; }> = ({ onExport }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    // eslint-disable-next-line no-console
    onExport(value as 'csv' | 'json');
    setIsOpen(false);
  };

  return (
    <Dropdown
      isOpen={isOpen}
      onSelect={onSelect}
      onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          aria-label="kebab dropdown toggle"
          variant="plain"
          onClick={onToggleClick}
          isExpanded={isOpen}
        ><ExportIcon /></MenuToggle>
      )}
      shouldFocusToggleOnSelect
    >
      <DropdownList>
        <DropdownItem value="csv" key="csv">
          Export to CSV
        </DropdownItem>
        <DropdownItem value="json" key="json">
          Export to JSON
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );
};

export default ExportDropDown;
