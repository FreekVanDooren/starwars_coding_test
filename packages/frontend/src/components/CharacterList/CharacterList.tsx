import React, { Component, ReactNode } from 'react';
import UnderConstruction from './under_construction.svg';
import Cancel from './undraw_cancel.svg';
import styles from './CharacterList.module.scss';

interface Character {
  id: string;
  name: string;
  height: string;
  mass: string;
  bmi: number | null;
}

type Characters = {
  count: number;
  characters: Array<Character>;
};

interface CharacterListState {
  isLoading: boolean;
  data?: Characters;
  error?: { statusCode?: number; message: string };
}

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

export default class CharacterList extends Component<
  unknown,
  CharacterListState
> {
  state: CharacterListState = {
    isLoading: true,
  };

  public componentDidMount(): void {
    fetch('http://localhost:3000/top-fat-characters').then(
      async (data) => {
        if (data.ok) {
          this.setState({
            isLoading: false,
            data: await data.json(),
          });
        } else {
          this.setState({
            isLoading: false,
            error: {
              message: await data.json(),
              statusCode: data.status,
            },
          });
        }
      },
      (error) => {
        this.setState({
          isLoading: false,
          error: {
            message: error.message,
          },
        });
      }
    );
  }

  public render(): ReactNode {
    return (
      <div className={styles.wrapper}>
        <div className={styles.titleWrapper}>
          <span>Top 20 fattest characters</span>
        </div>
        <div>{this.renderList()}</div>
      </div>
    );
  }

  renderList = (): ReactNode => {
    const { isLoading, data, error } = this.state;

    if (isLoading && data === undefined && error === undefined) {
      return this.renderListLoading();
    } else if (data) {
      return this.renderListData(data);
    } else if (error) {
      return this.renderListError();
    } else {
      // UNREACHABLE
      return this.renderListLoading();
    }
  };

  renderListLoading = (): ReactNode => {
    return (
      <div className={styles.infoWrapper}>
        <span className={styles.infoText}>Loading...</span>
      </div>
    );
  };

  renderListError = (): ReactNode => {
    const { error } = this.state;

    if (error && error.statusCode === 501) {
      return (
        <div className={styles.infoWrapper}>
          <span className={styles.infoText}>{error.message}</span>
          <UnderConstruction />
          <span className={styles.descriptionText}>
            Your Mission: Fix this list so that it contains the top 20 fattest
            star wars characters!
          </span>
        </div>
      );
    }

    if (error && error.message === 'Failed to fetch') {
      return (
        <div className={styles.infoWrapper}>
          <span className={styles.infoText}>
            Could not contact backend. Is your service up and running, or
            perhaps the code is broken?
          </span>
          <Cancel />
          <span className={styles.descriptionText}>
            Your Mission: Fix this list so that it contains the top 20 fattest
            star wars characters!
          </span>
        </div>
      );
    }

    if (error && error.statusCode) {
      return (
        <span className={styles.infoText}>
          {error.statusCode}: {error.message}
        </span>
      );
    } else {
      return <span className={styles.infoText}>{error?.message}</span>;
    }
  };

  renderListData = (data: Characters): ReactNode => {
    const { characters } = data;
    return (
      <span className={styles.tableWrapper}>
        <table>
          <tr>
            <th>Name</th>
            <th>Height</th>
            <th>Mass</th>
            <th>BMI</th>
          </tr>
          {characters
            .sort(characterSort)
            .slice(0, 20)
            .map(({ id, name, height, mass, bmi }) => (
              <tr key={id} className={styles.tableRow}>
                <td>{name}</td>
                <td>{height}</td>
                <td>{mass}</td>
                <td>{bmi && bmi.toFixed(2)}</td>
              </tr>
            ))}
        </table>
      </span>
    );
  };
}
