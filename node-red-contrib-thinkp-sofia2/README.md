## Node-RED integration with Sofia2 IoT Platform

This module provides a set of Node-RED nodes which integrate with Sofia2 IoT Platform. The main goals of these nodes are to interact with the ontologies defined in the platform.

## Pre-requisites

This module was mainly tested on Node-RED v0.14.6 and Node.js v4.5.0

Run the following command in your Node-RED user directory:

>	npm install q

>	npm install --save mqtt

>	npm install wait-until

## Installing

Run the following command in your Node-RED user directory:

>	npm install node-red-contrib-thinkp-sofia2

Restart node-red and do a refresh in the browser editor UI, to see the newly installed nodes.

## Getting started
This section describes a basic scenario how you can select data from an ontology predefined on Sofia2 Platform.

1. Go to the Node-RED editor
2. Add an inject input node, a debug node and a sofia2-query node
3. Wire the nodes as outlined on the picture
![alt text](https://raw.githubusercontent.com/Sofia2/sofia2-nodered/master/icons/flow_query.PNG "Flow Query")
3. Do a double-click on the sofia2-query node to enter the configuration.
![alt text](https://raw.githubusercontent.com/Sofia2/sofia2-nodered/master/icons/sofia2-query.PNG "Query node")
4. Click on the edit icon on the Server entry in the configuration dialog and add the information required to establish the connection with Sofia2 Plartform.
![alt text](https://raw.githubusercontent.com/Sofia2/sofia2-nodered/master/icons/sofia2-config.PNG "Configuration node")
5. Select the Add button to submit your input.
6. Insert the data information required to do the query. We can put the information on the dialog form or use the information from the input message.
7. Finally select the deploy button in the upper rigth corner of the ediro.
8. Now we can test the flow by bitting the input trigger. The output shows the data selected from the ontology.

For more information https://github.com/Sofia2/sofia2-nodered
