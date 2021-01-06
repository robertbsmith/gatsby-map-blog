import React , { useRef } from "react"
import { graphql } from "gatsby"
import { Marker, GeoJSON} from 'react-leaflet';
import { Helmet } from "react-helmet"

import Layout from 'components/Layout';
import Map from 'components/Map';

const DEFAULT_ZOOM = 15;

export default function Template({ data }) {
  const { markdownRemark: post } = data // data.markdownRemark holds your post data
  const { gpx: route } = data // data.gpxFileData holds the GPX information to plot

  const markerRef = useRef();

  const CENTER = [10, 10];


  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
  };

  return (
    <Layout pageName="home">
    <Helmet>
      <title>Home Page</title>
    </Helmet>

    <h1>{route.geojson._0.geometry.type}</h1>

    <Map {...mapSettings}>
      <Marker ref={markerRef} position={CENTER} />
       <GeoJSON data={route.geojson._0} 
      style={() => ({
        color: '#F72A2A',
        weight: 2,
        fillColor: "#F72A2A",
        fillOpacity: 1,
      })}/>
    </Map>
    </Layout>
  )
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!, $gpxFile: String) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        gpxFile
      }
    }

    gpx(name: {eq: $gpxFile}) {
      geojson {
        _0 {
          type
          geometry {
            type
            coordinates
          }
  
          properties {
            _gpxType
            coordTimes
            name
            time
            type
          }
        }
      }
    }
  }
`