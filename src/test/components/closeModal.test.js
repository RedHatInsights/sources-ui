import React from 'react';

import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import render from '../addSourceWizard/__mocks__/render';
import CloseModal from '../../components/CloseModal';

describe('CloseModal', () => {
  let initialProps;
  let onExit;
  let onStay;
  let isOpen;

  beforeEach(() => {
    onExit = jest.fn();
    onStay = jest.fn();
    isOpen = true;

    initialProps = {
      onExit,
      onStay,
      isOpen,
    };
  });

  it('renders correctly', () => {
    render(<CloseModal {...initialProps} />);

    expect(screen.getByText('Cancel creating the integration?')).toBeInTheDocument();
    expect(screen.getByText('All inputs will be discarded.')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Stay')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('Exclamation icon')).toBeInTheDocument();
  });

  it('renders correctly with custom title', () => {
    initialProps = {
      ...initialProps,
      title: 'CUSTOM TITLE',
    };

    render(<CloseModal {...initialProps} />);

    expect(screen.getByText(initialProps.title)).toBeInTheDocument();
    expect(screen.getByText('All inputs will be discarded.')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Stay')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('Exclamation icon')).toBeInTheDocument();
  });

  it('calls onExit', async () => {
    const user = userEvent.setup();

    render(<CloseModal {...initialProps} />);

    await user.click(screen.getByText('Cancel'));

    expect(onExit).toHaveBeenCalled();
  });

  it('calls onStay', async () => {
    const user = userEvent.setup();

    render(<CloseModal {...initialProps} />);

    await user.click(screen.getByLabelText('Close'));

    expect(onStay).toHaveBeenCalled();
    onStay.mockClear();

    await user.click(screen.getByText('Stay'));

    expect(onStay).toHaveBeenCalled();
    onStay.mockClear();
  });

  it('calls onStay when pressed escape second time', () => {
    render(<CloseModal {...initialProps} />);

    fireEvent.keyDown(screen.getByRole('dialog'), {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    });

    expect(onStay).not.toHaveBeenCalled();

    fireEvent.keyDown(screen.getByRole('dialog'), {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    });

    expect(onStay).toHaveBeenCalled();
  });
});
