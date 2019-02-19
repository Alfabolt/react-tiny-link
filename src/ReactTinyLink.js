import React, { Fragment, useEffect, useState } from 'react';
import Axios from 'axios';
import cheerio from 'cheerio';
import {
  Card,
  Media,
  ContentWrapper,
  Header,
  Content,
  Footer,
  Description,
} from './Card';
import { getHostname } from './utils';

const initialState = {
  data: {
    title: 'loading',
    content: 'loading',
    url: 'loading',
    description: 'loading',
    image: 'loading',
    type: 'loading', // MIME Type
  },
  loading: true,
};
function useEffectAsync(effect, inputs) {
  useEffect(() => {
    effect();
  }, inputs);
}

async function fetch(url, setState) {
  const fetchUrl = `https://cors-anywhere.herokuapp.com/${url}`;
  console.log(fetchUrl);
  const client = Axios.create({
    url: fetchUrl,
    headers: {
      'x-requested-with': '',
    },
  });
  let temp = Object.assign({}, initialState);
  temp.loading = true;
  console.log(temp);
  try {
    const response = await client.get(fetchUrl);
    const $ = cheerio.load(response.data);

    temp = {
      data: {
        title: $('title').text(),
        content: $("meta[name='description']").attr('content'),
        url: $("meta[property='og:url']").attr('content'),
        description: $("meta[name='description']").attr('content'),
        image: $("meta[property='og:image']").attr('content'),
        type: $("meta[property='og:type']").attr('content'), // MIME Type
      },
      loading: false,
    };

    // temp.data["title"] = $("meta[property='og:title']").attr("content");

    // temp.data["description"] = $("meta[property='og:description']").attr(
    //   "content"
    // );
    console.log(temp);

    setState(temp);
  } catch (error) {
    temp = {
      data: {
        title: undefined,
        content: undefined,
        url: undefined,
        description: undefined,
        image: undefined,
        type: undefined, // MIME Type
      },
    };

    temp.loading = false;
    setState(temp);
    console.error(temp);
  } finally {
    temp.loading = false;
    setState(temp);
    console.log(temp);
  }
}

const ReactTinyLink = props => {
  const [linkMeta, setlinkMeta] = useState(initialState);
  useEffectAsync(() => {
    fetch(props.url, setlinkMeta);
  }, []);
  return (
    <Fragment>
      <Card
        className="react_tinylink_card"
        cardSize={props.cardSize}
        href={props.url}
      >
        {props.showGraphic && (
          <Media
            className="react_tinylink_card_media"
            cardSize={props.cardSize}
            src={linkMeta.data.image && linkMeta.data.image}
          />
        )}
        <ContentWrapper
          className="react_tinylink_card_content_wrapper"
          cardSize={props.cardSize}
        >
          <Header
            maxLine={props.maxLine}
            minLine={props.minLine}
            className="react_tinylink_card_content_header"
          >
            <Description
              loading={linkMeta.loading}
              loadingWidth={2}
              maxLine={props.maxLine}
              minLine={props.minLine}
              className="react_tinylink_card_content_header_description"
            >
              {linkMeta.data.title ? linkMeta.data.title : props.url}
            </Description>
          </Header>
          <Content
            maxLine={props.maxLine}
            minLine={props.minLine}
            className="react_tinylink_card_content"
            cardSize={props.cardSize}
          >
            <Description
              loading={linkMeta.loading}
              loadingWidth={1}
              className="react_tinylink_card_content_description"
            >
              {linkMeta.data.description
                ? linkMeta.data.description
                : props.url}
            </Description>
          </Content>
          <Footer className="react_tinylink_footer">
            <Description
              loading={linkMeta.loading}
              loadingWidth={1}
              className="react_tinylink_card_footer_description"
            >
              {getHostname(props.url)}
            </Description>
          </Footer>
        </ContentWrapper>
      </Card>
    </Fragment>
  );
};

export default ReactTinyLink;

// Default props
// maxLine = 2
// minLine= 1
// proxyURL=https://cors-anywhere.herokuapp.com
// showGraphic=true