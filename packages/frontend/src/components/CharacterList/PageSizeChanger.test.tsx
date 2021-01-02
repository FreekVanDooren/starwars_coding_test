import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PageSizeChanger from './PageSizeChanger';
import { act } from 'react-dom/test-utils';

describe('PageSizeChanger', () => {
  const initialPageSize = 20;
  let updatedPageSize = -1;
  let getByText: (arg0: string) => Element;
  let queryByText: (arg0: string) => Element | null;
  let getByPlaceholderText: (arg0: string) => Element;

  const givenAnInputOf = (
    value: string,
    element: Element = getByPlaceholderText('Page size: 20')
  ) => {
    act(() => {
      fireEvent.change(element, { target: { value } });
    });
  };
  const whenButtonIsClicked = () => {
    fireEvent.click(getByText('Change'));
  };

  const expectErrorMessageToBeDisplayed = () => {
    expect(queryByText('Input must be a positive integer')).toBeTruthy();
  };

  beforeEach(() => {
    const updatePageSize = (newPageSize: number): void => {
      updatedPageSize = newPageSize;
    };
    ({ getByText, getByPlaceholderText, queryByText } = render(
      <PageSizeChanger
        pageSize={initialPageSize}
        updatePageSize={updatePageSize}
      />
    ));
  });

  test('Will return initial page size', () => {
    whenButtonIsClicked();

    expect(updatedPageSize).toBe(initialPageSize);
  });
  test('Can change page size', () => {
    givenAnInputOf('5');

    whenButtonIsClicked();

    expect(updatedPageSize).toBe(5);
  });

  test('Only accepts numbers', () => {
    givenAnInputOf('a');

    whenButtonIsClicked();

    expect(updatedPageSize).toBe(initialPageSize);
    expectErrorMessageToBeDisplayed();
  });

  test('Only accepts integers', () => {
    givenAnInputOf('1.7');

    whenButtonIsClicked();

    expect(updatedPageSize).toBe(initialPageSize);
    expectErrorMessageToBeDisplayed();
  });

  test('Only accepts integers larger than 0', () => {
    givenAnInputOf('0');

    whenButtonIsClicked();

    expect(updatedPageSize).toBe(initialPageSize);
    expectErrorMessageToBeDisplayed();
  });

  test('Error message disappears when input removed', () => {
    givenAnInputOf('0');

    whenButtonIsClicked();

    expectErrorMessageToBeDisplayed();

    givenAnInputOf('');

    whenButtonIsClicked();

    expect(queryByText('Input must be a positive integer')).toBeFalsy();
  });
});
