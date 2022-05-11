import React from 'react';

import { screen, fireEvent } from '@testing-library/react';
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

    expect(screen.getByText('Exit source creation?')).toBeInTheDocument();
    expect(screen.getByText('All inputs will be discarded.')).toBeInTheDocument();
    expect(screen.getByText('Exit')).toBeInTheDocument();
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
    expect(screen.getByText('Exit')).toBeInTheDocument();
    expect(screen.getByText('Stay')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('Exclamation icon')).toBeInTheDocument();
  });

  it('calls onExit', async () => {
    render(<CloseModal {...initialProps} />);

    await userEvent.click(screen.getByText('Exit'));

    expect(onExit).toHaveBeenCalled();
  });

  it('calls onStay', async () => {
    render(<CloseModal {...initialProps} />);

    await userEvent.click(screen.getByLabelText('Close'));

    expect(onStay).toHaveBeenCalled();
    onStay.mockClear();

    await userEvent.click(screen.getByText('Stay'));

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
