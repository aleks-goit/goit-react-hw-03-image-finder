import React, { Component } from 'react';
import Searchbar from './Searchbar';
import Loader from './Loader';
import ImageGallery from './ImageGallery';
import InfiniteScroll from 'react-infinite-scroll-component';
import Modal from './Modal';
import styled from 'styled-components';
import imagesApi from '../services/imagesApi';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 16px;
  padding-bottom: 24px;
`;

export default class App extends Component {
  state = {
    images: [],
    loading: false,
    perPage: 12,
    searchQuery: '',
    largeImgRef: null,
  };

  componentDidUpdate(prevProps, prevState) {
    const prevQuery = prevState.searchQuery;
    const nextQjery = this.state.searchQuery;

    if (prevQuery !== nextQjery) {
      this.setState({ images: [], perPage: 12 });
      this.fetchImages();
    }
  }

  handleSearchQuery = query => {
    this.setState({ searchQuery: query });
  };

  fetchImages = () => {
    const { searchQuery, perPage } = this.state;

    imagesApi.fetchImagesWithQuery(searchQuery, perPage).then(images =>
      this.setState(prevState => ({
        images: [...images],
        perPage: prevState.perPage + 12,
      })),
    );
  };

  handleOpenModal = imgRef => {
    this.setState({ largeImgRef: imgRef });
  };

  handleCloseModal = () => {
    this.setState({ largeImgRef: null });
  };

  render() {
    const { images, largeImgRef } = this.state;
    return (
      <Container>
        <Searchbar onSubmit={this.handleSearchQuery} />
        {images.length > 0 && (
          <InfiniteScroll
            dataLength={images.length}
            next={this.fetchImages}
            hasMore={true}
            loader={<Loader />}
          >
            <ImageGallery images={images} onOpen={this.handleOpenModal} />
          </InfiniteScroll>
        )}
        {largeImgRef && (
          <Modal onClose={this.handleCloseModal}>
            <img src={largeImgRef} alt="" />
          </Modal>
        )}
      </Container>
    );
  }
}

// {images.length > 0 && <ImageGallery images={images} />}
