// Define the URL for fetching data
const dataUrl = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Function to update the Gauge Chart with the washing frequency value
function updateGaugeChart(washingFrequency) {
  let data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: washingFrequency,
      title: { text: "Belly Button Washing Frequency" },
      subtitle: { text: "Scrubs per week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 9] },
        steps: [
          { range: [0, 1], color: "#f2f2f2" },
          { range: [1, 2], color: "#e6e6e6" },
          { range: [2, 3], color: "#d9d9d9" },
          { range: [3, 4], color: "#cccccc" },
          { range: [4, 5], color: "#b3b3b3" },
          { range: [5, 6], color: "#999999" },
          { range: [6, 7], color: "#808080" },
          { range: [7, 8], color: "#666666" },
          { range: [8, 9], color: "#4d4d4d" }
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: washingFrequency
        }
      }
    }
  ];

  let layout = {
    width: 500,
    height: 400,
    margin: { t: 0, b: 0 }
  };

  Plotly.newPlot("gauge-chart", data, layout);
}

// Function to display demographic info for a given subject ID
function displayDemographicInfo(subjectId) {
  d3.json(dataUrl).then(function(data) {
    let sampleData = data;
    let metadata = sampleData.metadata;

    let identifier = metadata.filter(sample => sample.id.toString() === subjectId)[0];
    let panel = d3.select('#sample-metadata');
    panel.html('');
    Object.entries(identifier).forEach(([key, value]) => {
      panel.append('h6').text(`${key}: ${value}`);
    });

    // Get the washing frequency value and update the gauge chart
    let washingFrequency = identifier.wfreq;
    updateGaugeChart(washingFrequency);
  });
}

// Function to create plots for a given subject ID
function createPlots(subjectId) {
  d3.json(dataUrl).then(function(data) {
    let sampleData = data;
    let samples = sampleData.samples;
    let identifier = samples.filter(sample => sample.id === subjectId);
    let filtered = identifier[0];
    let OTUvalues = filtered.sample_values.slice(0, 10).reverse();
    let OTUids = filtered.otu_ids.slice(0, 10).reverse();
    let labels = filtered.otu_labels.slice(0, 10).reverse();
    let barTrace = {
      x: OTUvalues,
      y: OTUids.map(object => 'OTU ' + object),
      name: labels,
      type: 'bar',
      orientation: 'h'
    };
    let barLayout = {
      title: `Top 10 OTUs for Subject ${subjectId}`,
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU ID' }
    };
    let barData = [barTrace];
    Plotly.newPlot('bar', barData, barLayout);

    let bubbleTrace = {
      x: filtered.otu_ids,
      y: filtered.sample_values,
      mode: 'markers',
      marker: {
        size: filtered.sample_values,
        color: filtered.otu_ids,
        colorscale: 'Viridis' // Change the color scale to 'Viridis'
      },
      text: filtered.otu_labels,
    };
    let bubbleData = [bubbleTrace];
    let bubbleLayout = {
      title: `OTUs for Subject ${subjectId}`,
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Values' }
    };
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
  });
}

// Function called when a different subject ID is selected from the dropdown
function optionChanged(subjectId) {
  createPlots(subjectId);
  displayDemographicInfo(subjectId);
}

// Function to initialize the page with default data
function initializePage() {
  let dropDown = d3.select('#selDataset');
  d3.json(dataUrl).then(function(data) {
    sampleData = data;
    let names = sampleData.names;
    Object.values(names).forEach(value => {
      dropDown.append('option').text(value);
    });
    displayDemographicInfo(names[0]);
    createPlots(names[0]);
  });
}

// Call the initialize function to set up the page with default data
initializePage();
