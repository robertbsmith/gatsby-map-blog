const geojson = require("@tmcw/togeojson")
const _ = require(`lodash`)
const fs = require("fs")

const DOMParser = require("xmldom").DOMParser

const parseDocument = content => new DOMParser().parseFromString(content)

const parseGPX = markup => geojson.gpx(parseDocument(markup))

async function onCreateNode({
  node,
  actions,
  loadNodeContent,
  createNodeId,
  createContentDigest,
  reporter
}) {
  const { createNode, createParentChildLink } = actions

  // only log for nodes of mediaType `application/gpx+xml`
  if (node.internal.mediaType !== `application/gpx+xml`) {
    return
  }

  const content = await loadNodeContent(node)

  try {
    const parsedContent = parseGPX(content)

    let gpxNode = {
      id: createNodeId(`${node.id} >>> Gpx`),
      children: [],
      parent: node.id,
      name: node.name,
      internal: {
        type: "Gpx",
        content: content,
      },
    }

    gpxNode.geojson = {
      title: "",
      ...parsedContent.features,
    }

    if (node.internal.type === "File") {
      gpxNode.fileAbsolutePath = node.absolutePath
    }

    gpxNode.internal.contentDigest = createContentDigest(gpxNode)

    createNode(gpxNode)
    createParentChildLink({ parent: node, child: gpxNode })

    return gpxNode
  } catch (err) {
    reporter.panicOnBuild(
      `Error processing gpx data ${
        node.absolutePath ? `file ${node.absolutePath}` : `in node ${node.id}`
      }:\n
    ${err.message}`
    )

    return {} // eslint
  }
}

exports.onCreateNode = onCreateNode
