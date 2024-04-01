# Global Shipping Port Visualization
Welcome to the Global Shipping Port Visualization project. This repository presents a comprehensive visualization of the world's top shipping ports, offering insights into their trends and statistics over the years.

[Global Shipping Ports](https://dmitriusagoston.github.io/Global-Shipping-Ports/)

## Overview
This visualization project employs interactive features to facilitate exploration and analysis of shipping port data. Users can manipulate a slider to filter ports based on size, view bubble representations on a world map to visualize TEU (Twenty-Foot Equivalent Unit) data, and click on individual ports to access detailed statistics from 2011 to 2019.

## Features
- Slider Filtering: Users can adjust a slider to filter ports based on their size, enabling focused analysis tailored to specific criteria.

- Interactive World Map: Ports are represented as bubbles on a world map, with each bubble's radius reflecting its TEU value. Bubbles can be resized for ease of viewing and analysis.

- Port Statistics: Clicking on individual ports on the map provides access to detailed statistics spanning the years 2011 to 2019, offering deeper insights into each port's performance and trends over time.

## Usage
To explore the visualization:

- Open [Global Shipping Ports](https://dmitriusagoston.github.io/Global-Shipping-Ports/) in a web browser.
- Adjust the slider to filter ports based on size preference.
- Interact with the world map by clicking on ports to view detailed statistics or resizing bubbles for better visualization.

### Files

- TEUByYear.csv - The data of shipping ports' TEU from the years 2011-2019
- index.html - The top-level client file to run the visualization
- top100port.csv - The csv file containing the name, longitude/latitude, and size of ports
- world.json - The json file for creating the world map

### Notes
Missing Data: Some ports in certain years may have missing data in the TEUByYear.csv file.
