const neuralNetworkElement = document.querySelector('.neural-network');
let layersWeights = [], layersBiases = [], layersPredicts = [], layersPerceptons = [], layersLines = [];

let layersInitConfig = [
  {type: 'input', units: 2, activation: null},
  {type: 'hidden', units: 4, activation: 'tanh'},
  {type: 'output', units: 1, activation: 'sigmoid'}
];
let inputInit = [1, 0];
let models = initializeModel(layersInitConfig);
let model = models[models.length - 1];

initializeGUI();


function initializeGUI() {
  getLayersConditions();
  initializePerceptrons();
  initializeLines();
}

function initializePerceptrons() {
  for (let index = 0; index < layersInitConfig.length; index++) {
    layersPerceptons[index] = createPerceptrons(layersInitConfig[index].units);
    if (index === 0) {
      layersPerceptons[index]
        .forEach((preceptron, index) =>
          setPerceptronCondition(
            preceptron,
            inputInit[index]
          ));
    } else {
      setPerceptronsCondition(
        layersPerceptons[index],
        layersPredicts[index - 1],
        layersBiases[index - 1],
        layersWeights[index - 1],
        layersInitConfig[index]
      );
    }
    const _layer = layer(layersPerceptons[index], layersInitConfig[index].type);
    const _column = column(_layer);
    neuralNetworkElement.insertBefore(_column, neuralNetworkElement.lastElementChild);
  }
}

function setPerceptronsCondition(layerPerceptons, layerPredicts, layerBiases, layerWeights, layerInitConfig) {
  layerPerceptons.forEach((preceptron, index) =>
    setPerceptronCondition(
      preceptron,
      layerPredicts[index],
      layerBiases[index],
      layerWeights
        .filter((weight, numb) => (preceptron.length - numb + index) % preceptron.length === 0),
      layerInitConfig.activation
    ));
}

function initializeLines() {
  for (let index = 0; index < layersInitConfig.length - 1; index++) {
    layersLines[index] = createLines(layersPerceptons[index], layersPerceptons[index + 1]);
    layersLines[index].forEach(line => neuralNetworkElement.appendChild(line));
    setLinesCondition(layersLines[index], layersWeights[index]);
  }
}

function setLinesCondition(layerLines, layerWeights) {
  layerLines.forEach((line, index) => setLineCondition(line, layerWeights[index]));
}

function getLayersConditions() {
  for (let index = 0; index < layersInitConfig.length - 1; index++) {
    layersWeights[index] = model.layers[index + 1].getWeights()[0].dataSync();
    layersBiases[index] = model.layers[index + 1].getWeights()[1].dataSync();
    layersPredicts[index] = models[index].predict(tf.tensor2d([inputInit])).dataSync();
  }
}