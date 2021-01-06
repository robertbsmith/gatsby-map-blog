import React , { useRef } from "react"
import { graphql } from "gatsby"
import { Marker, GeoJSON, } from 'react-leaflet';
import { Helmet } from "react-helmet"

import Layout from 'components/Layout';
import Map from 'components/Map';
import L from 'leaflet';

const DEFAULT_ZOOM = 15;

function bbox(route) {
  var result = [[Infinity, Infinity], [-Infinity, -Infinity]];
  route.geometry.coordinates.forEach(coord => {
      if (result[0][0] > coord[1]) {
          result[0][0] = coord[1];
      }
      if (result[0][1] > coord[0]) {
          result[0][1] = coord[0];
      }
      if (result[1][0] < coord[1]) {
          result[1][0] = coord[1];
      }
      if (result[1][1] < coord[0]) {
          result[1][1] = coord[0];
      }
  });
  return result;
}

export default function Template({ data }) {
  const { markdownRemark: post } = data // data.markdownRemark holds your post data
  const { gpx: route } = data // data.gpxFileData holds the GPX information to plot

  const StartMarkerRef = useRef();
  const EndMarkerRef = useRef();

  var bounds = bbox(route.geojson._0)

  var tmp = route.geojson._0.geometry.coordinates[0];
  const RouteStart = [tmp[1], tmp[0]];
  tmp = route.geojson._0.geometry.coordinates[route.geojson._0.geometry.coordinates.length-1]
  const RouteEnd = [tmp[1], tmp[0]];
  
  const mapSettings = {
    bounds: bounds,
    defaultBaseMap: 'OpenStreetMap',
  };

  return (
    <Layout pageName="BlogPost">
    <Helmet>
      <title>{post.frontmatter.title}</title>
    </Helmet>

    <h1>{post.frontmatter.title}</h1>
    <small>{post.frontmatter.author}, {post.frontmatter.date}</small>


    <Map {...mapSettings}>
      <Marker ref={StartMarkerRef} position={RouteStart} />
      <Marker ref={EndMarkerRef} position={RouteEnd} />
       <GeoJSON data={route.geojson._0} 
      style={() => ({
        color: '#F72A2A',
        weight: 2,
        fillColor: "#F72A2A",
        fillOpacity: 1,
      })}/>
    </Map>

    <p>{post.excerpt}</p>


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
        author
        gpxFile
      }
      excerpt
      id
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