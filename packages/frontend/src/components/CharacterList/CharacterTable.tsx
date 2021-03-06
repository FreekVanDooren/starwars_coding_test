import styles from './CharacterTable.module.scss';
import React, { FunctionComponent, useState } from 'react';
import { Character } from './types';
import PageSizeChanger from './PageSizeChanger';

const DEFAULT_PAGE_SIZE = 20;

const characterSort = (a: Character, b: Character): number => {
  const aBmi = a.bmi || -10;
  const bBmi = b.bmi || -10;
  if (aBmi < bBmi) {
    return 1;
  }
  if (aBmi > bBmi) {
    return -1;
  }
  return 0;
};

type Props = {
  characters: Character[];
};

const CharacterTable: FunctionComponent<Props> = ({ characters }) => {
  const [listStart, setListStart] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const setNewStart = (newStart: number, page = pageSize): void => {
    setListStart(newStart - (newStart % page));
  };
  const goBack = (): void => {
    if (listStart > 0) {
      setNewStart(listStart - pageSize);
    }
    if (listStart !== 0 && listStart - pageSize <= 0) {
      setListStart(0);
    }
  };

  const goForward = (): void => {
    const listStartMax = characters.length - (characters.length % pageSize);
    const newStart = listStart + pageSize;
    if (newStart <= listStartMax) {
      setNewStart(newStart);
    }
  };

  const updatePageSize = (newPageSize: number): void => {
    setPageSize(newPageSize);
    setNewStart(listStart, newPageSize);
  };

  return (
    <span>
      <PageSizeChanger updatePageSize={updatePageSize} pageSize={pageSize} />
      <div>Page NR: {Math.round(listStart / pageSize) + 1}</div>
      <span className={styles.tableWrapper}>
        <button className={styles.button} onClick={goBack}>
          Back
        </button>
        <table>
          <tbody>
            <tr>
              <th />
              <th>Name</th>
              <th>Height</th>
              <th>Mass</th>
              <th>BMI</th>
            </tr>
            {characters
              .sort(characterSort)
              .map((character, index) => ({
                ...character,
                index,
              }))
              .slice(listStart, listStart + pageSize)
              .map(({ index, id, name, height, mass, bmi }) => (
                <tr key={id} className={styles.tableRow}>
                  <td>{index + 1}</td>
                  <td>{name}</td>
                  <td>{height}</td>
                  <td>{mass}</td>
                  <td>{bmi && bmi.toFixed(2)}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <button className={styles.button} onClick={goForward}>
          Forward
        </button>
      </span>
    </span>
  );
};

export default CharacterTable;
