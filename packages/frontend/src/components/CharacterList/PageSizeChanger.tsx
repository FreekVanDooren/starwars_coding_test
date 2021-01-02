import React, { FunctionComponent, useState } from 'react';
import styles from './CharacterTable.module.scss';

type Props = {
  pageSize: number;
  updatePageSize: (newPageSize: number) => void;
};

const isAcceptable = (potentialNumber: string): boolean => {
  return /^[1-9]\d*$/.test(potentialNumber);
};

const PageSizeChanger: FunctionComponent<Props> = ({
  updatePageSize,
  pageSize,
}) => {
  const [temporaryPageSize, setTemporaryPageSize] = useState(pageSize);
  const [inputError, setInputError] = useState(false);
  return (
    <>
      <input
        placeholder={`Page size: ${pageSize}`}
        onChange={(event): void => {
          const value = event.target.value;
          const acceptable = isAcceptable(value);
          setInputError(!!value && !acceptable);
          return setTemporaryPageSize(acceptable ? parseInt(value) : pageSize);
        }}
      />
      <button
        className={styles.button}
        onClick={(): void => updatePageSize(temporaryPageSize)}
      >
        Change
      </button>
      {inputError && (
        <div className={styles.error}>Input must be a positive integer</div>
      )}
    </>
  );
};

export default PageSizeChanger;
