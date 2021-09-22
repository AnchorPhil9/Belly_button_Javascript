function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    // Since we're looking at the 'samples' section of data,
    // we'll make a new variable named 'samples'.
    var samples = data.samples;
    console.log(samples)
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    // Following 12.4.3 (2021), we'll make a filter function 
    // 'outputSample' that filters our sample objects by their id.
    var outputSamples = samples.filter(samplesObj => samplesObj.id == sample);
    console.log(outputSamples)
    //  5. Create a variable that holds the first sample in the array.
    // Per 12.4.3 (2021), we'll declare a variable 'results' that
    // brings up the first results of 'outputSample'.
    var result = outputSamples[0];
    console.log(result)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    // Notably, these three data sets are contained within 'samples'. 
    // Thus, we can use our 'samples' variable as a starting point for our
    // three new variables. We'll use map() to transform the 'samples' dataset,
    // like we did in 12.3.2 (2021).
    var otuId = samples.map(id => id.otu_ids);
    console.log(otuId)
    var otuLabels = samples.map(label => label.otu_labels);
    console.log(otuLabels)
    var sampleValues = samples.map(value => value.sample_values)[0];
    console.log(sampleValues)
    // Observe that our 'sampleValues' function returns a lot of arrays.
    // Per 12.3.2 (2021), we'll use a forEach function t


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    // Recall that 'otuId' holds an array of otu_ids. To make sure our array is
    // in descending order, we'll use sort() with reverse() as explained in 12.2.2 (2021).
    var yticksArray = otuId.sort((a, b) => a - b).reverse();
    // Additionally, to get only the top 10 entries from the first array, we not only call for the 0th array
    // but also use the slice() method mentioned in 12.2.2 (2021), starting at index 0 and ending before index 10.
    console.log(yticksArray)
    var yticks = yticksArray[0].slice(0, 10);
    console.log(yticks);
    // From the console, we see that we've obtained the otu_id numbers.
    // However, we want these otu_ids as labels on the y-axis instead of y-values.
    // For that, we can make a new ForEach function that maps those id numbers into a 
    // string value, as inspired by 12.3.2 code (2021).

    // First, we'll create an empty array as explained in DelftStack:
    // Source: https://www.delftstack.com/howto/javascript/javascript-declare-empty-array/
    var yNames = []
    // Per w3docs, we'll push our modified ytick names into 'yNames'.
    // Source: https://www.w3docs.com/snippets/javascript/how-to-add-new-elements-to-a-javascript-array.html
    yticks.forEach(tick => yNames.push('OTU ' + tick));
    console.log(yNames)
    // 8. Create the trace for the bar chart. 
    var barData = [{x: sampleValues, y: yNames, type: "bar", orientation: 'h'
    }];
    // 9. Create the layout for the bar chart. 
    // We'll add a title in similar fashion to what we did in 12.2.2 (2021).
    // Plus we'll add a layout parameter to our y-axis so that the values go in
    // descending order, as addressed in the below sources:
    // Source1: https://community.plotly.com/t/flipping-horizontal-bar-chart-to-descending-order/15456
    // Source2: https://stackoverflow.com/questions/46201532/plotly-js-reversing-the-horizontal-bar-chart-in-plotly
    // Without this specific autorange parameter, the values go in ascending order.
    var barLayout = {title: "The Top 10 Bacteria Cultures Found"
    };
    // We tried showing the top 10 values on a horizontal bar chart where the bars go from greatest to least
    // https://community.plotly.com/t/horizontal-bar-automatically-order-by-numerical-value/7183
    // https://plotly.com/javascript/configuration-options/
    // We instead got a chart that went from least to greatest, but otherwise had the correct top 10 values
    // on Chrome and Firefox
    // So we tried setting order to 'ascending'. We don't get a meaningful change. In fact, on Chrome,
    // the values are incorrect
    var barConfig = {order: 'descending'
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, barConfig)
  });
}
