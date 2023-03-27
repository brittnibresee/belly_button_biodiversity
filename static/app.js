// Belly Button Biodiversity Challenge
//const DATA_URL = "https://2u-data-curiculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
const DATA_URL = "static/samples.json"


function optionChanged(subject_id) {
  console.log(`optionChanged ${subject_id}`);
}
// Build charts and display metadata
function buildChartsAndMetadata(sample) {
  // Use D3 to read in the JSON data
  d3.json(DATA_URL).then(function(data) {
    // Extract the sample data for the given sample ID
    var sampleData = data.samples.filter(s => s.id == sample)[0];

    // Bar chart
    var traceBar = {
      x: sampleData.sample_values.slice(0, 10).reverse(),
      y: sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      type: "bar",
      orientation: "h",
      text: sampleData.otu_labels.slice(0, 10).reverse()
    };

    var layoutBar = {
      title: "Top 10 OTUs Found",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU ID" }
    };

    Plotly.newPlot("bar", [traceBar], layoutBar);

    // Bubble chart
    var traceBubble = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      mode: "markers",
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids
      }
    };

    var layoutBubble = {
      title: "OTUs Found",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };

    Plotly.newPlot("bubble", [traceBubble], layoutBubble);

    // Display the metadata
    var metadataList = d3.select("#sample-metadata");
    metadataList.html("");

    Object.entries(metadata).forEach(([key, value]) => {
      metadataList.append("li").text(`${key}: ${value}`);
    });
  });
}

// Dropdown menu
function optionChanged(newSample) {
  buildChartsAndMetadata(newSample);
}

// Initialize the page
function init() {
  // Get references
  var dropdownMenu = d3.select("#selDataset");

  // Use D3 to read in the JSON data
  d3.json(DATA_URL).then(function(data) {
    // Extract the sample IDs
    var sampleIds = data.names;

    // Populate the dropdown menu with the sample IDs
    sampleIds.forEach(function(sample) {
      dropdownMenu.append("option").text(sample).property("value", sample);
    });

    // Build the charts and display metadata
    var firstSample = sampleIds[0];
    buildChartsAndMetadata(firstSample);
  });
}

// Call the init() function to initialize the page
init();
