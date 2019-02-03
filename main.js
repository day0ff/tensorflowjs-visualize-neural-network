const interfaceElement = document.querySelector('.interface');
const controlElement = document.querySelector('.neural-network');
const neuralNetworkElement = document.querySelector('.neural-network .layers');

let layersWeights = [],
  layersBiases = [],
  layersPredicts = [],
  layersPerceptons = [],
  layersLines = [];

let layersInitConfig = [
  {type: 'input', units: 2, activation: null},
  {type: 'hidden', units: 4, activation: 'tanh'},
  {type: 'output', units: 1, activation: 'sigmoid'}
];

let inputInit = [rnd(), rnd()];
let models = initializeModel(layersInitConfig);

initializeGUI();
hideControlButtons();
interfaceElement.addEventListener('click', interfaceActions);
controlElement.addEventListener('click', controlActions);
memoryCheck();


function initializeGUI() {
  getLayersConditions();
  initializePerceptrons();
  initializeLines();
}

function clearGUI() {
  neuralNetworkElement.innerHTML = '';
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
    const _column = column(_layer, index);
    neuralNetworkElement.appendChild(_column);
  }
}

function setPerceptronsCondition(layerPerceptons, layerPredicts, layerBiases, layerWeights, layerInitConfig) {
  layerPerceptons.forEach((preceptron, index) =>
    setPerceptronCondition(
      preceptron,
      layerPredicts[index],
      layerBiases[index],
      layerWeights
        .filter((weight, numb) => (layerPerceptons.length - numb + index) % layerPerceptons.length === 0),
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
    layersWeights[index] = models[models.length - 1].layers[index + 1].getWeights()[0].dataSync();
    layersBiases[index] = models[models.length - 1].layers[index + 1].getWeights()[1].dataSync();
    layersPredicts[index] = models[index].predict(tf.tensor2d([inputInit])).dataSync();
  }
}

function rnd() {
  return Math.round(Math.random());
}

function interfaceActions(event) {

}

function controlActions(event) {
  if (event.target.classList.contains('control')) {

    if (event.target.classList.contains('edit')) switchControlVisibility();

    if (event.target.classList.contains('perceptron')) {
      if (event.target.classList.contains('add')) addPerceptron();
      if (event.target.classList.contains('remove')) {
        if (layersInitConfig[event.target.parentElement.getAttribute('index')].units > 1) removePerceptron();
        else alert('Can not remove last perceptron.\nLayer must contain at least one perceptron.');
      }
    }

    if (event.target.classList.contains('layer')) {
      if (event.target.classList.contains('add')) addLayer();
      if (event.target.classList.contains('remove')) {
        if (layersInitConfig.length > 3) removeLayer();
        else alert('Can not remove layer.\nNeural network must contain at least one input, one hidden and one output layers.');
      }
    }

  }
}

function addLayer() {
  const penultimateLayer = layersInitConfig[layersInitConfig.length - 2];
  const newLayer = Object.assign({}, penultimateLayer);
  layersInitConfig.splice(layersInitConfig.length - 2, 0, newLayer);
  reinitialize();
}

function removeLayer() {
  layersInitConfig.splice(-2, 1);
  reinitialize();
}

function addPerceptron() {
  layersInitConfig[event.target.parentElement.getAttribute('index')].units++;
  if (event.target.previousElementSibling.classList.contains('input')) inputInit.push(rnd());
  reinitialize();
}

function removePerceptron() {
  layersInitConfig[event.target.parentElement.getAttribute('index')].units--;
  if (event.target.nextElementSibling.classList.contains('input')) inputInit.splice(-1, 1);
  reinitialize();
}

function reinitialize() {
  models = initializeModel(layersInitConfig);
  clearGUI();
  initializeGUI();
  memoryCheck();
}

function memoryCheck() {
  console.log('numTensors (outside tidy): ' + tf.memory().numTensors);
}

function hideControlButtons() {
  Array.from(controlElement.querySelectorAll('.control'))
    .filter(element => element.classList.contains('add') || element.classList.contains('remove'))
    .forEach(element => element.style.visibility = 'hidden');
  controlElement.querySelector('.train').style.display = 'block';
}

function switchControlVisibility() {
  const controls = Array.from(controlElement.querySelectorAll('.control'))
    .filter(element => element.classList.contains('add') || element.classList.contains('remove'));
  controls.forEach(element => element.style.visibility === 'hidden' ? element.style.visibility = 'visible' : element.style.visibility = 'hidden');
  const train = controlElement.querySelector('.train');
  train.style.display === 'block' ? train.style.display = 'none' : train.style.display = 'block';
}