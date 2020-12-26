import React, { Component, ReactNode } from 'react';
import UnderConstruction from './under_construction.svg';
import Cancel from './undraw_cancel.svg';
import styles from './CharacterList.module.scss';
import CharacterTable from './CharacterTable';
import { Character } from './types';

interface CharacterListState {
  isLoading: boolean;
  data?: Array<Character>;
  error?: { statusCode?: number; message: string };
}

export default class CharacterList extends Component<
  unknown,
  CharacterListState
> {
  state: CharacterListState = {
    isLoading: true,
  };

  public componentDidMount(): void {
    fetch('http://localhost:3000/fat-characters').then(
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

  renderListData = (characters: Character[]): ReactNode => {
    return <CharacterTable characters={characters} />;
  };
}
