const interfaceElement = document.querySelector('.interface');
const controlElement = document.querySelector('.neural-network');
const interfaceBottomElement = document.querySelectorAll('.interface')[1];
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
interfaceBottomElement.addEventListener('click', interfaceBottomActions);
memoryCheck();

function initializeGUI() {
  getLayersConditions();
  initializePerceptrons();
  initializeLines();
}

function reinitialize() {
  models = initializeModel(layersInitConfig);
  clearGUI();
  initializeGUI();
  memoryCheck();
}

function reDrawGUI() {
  clearGUI();
  initializeGUI();
  memoryCheck();
  hideControlButtons();
}

function clearGUI() {
  neuralNetworkElement.innerHTML = '';
}

function initializePerceptrons() {
  for (let index = 0; index < layersInitConfig.length; index++) {
    layersPerceptons[index] = createPerceptrons(layersInitConfig[index].units);
    if (index === 0) {
      layersPerceptons[index]
        .forEach((perceptron, index) => {
          switchInput(perceptron, index);
          setPerceptronCondition(
            perceptron,
            inputInit[index]
          );
        });
    } else {
      if (index === layersInitConfig.length - 1) {
        layersPerceptons[index]
          .forEach((perceptron, index) =>
            switchOutput(perceptron, index)
          );
      }
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
    layersPredicts[index] = predict(models[index]);
  }
}

function rnd() {
  return Math.round(Math.random());
}

function interfaceActions(event) {
  if (event.target.classList.contains('once')) train();
  if (event.target.classList.contains('train')) train(10);
}

function interfaceBottomActions(event) {
  if (event.target.classList.contains('save-local')) saveLocal();
  if (event.target.classList.contains('load-local')) loadLocal();
  if (event.target.classList.contains('save-file')) saveFiles();
  if (event.target.classList.contains('load-file')) loadFiles();
}

function controlActions(event) {
  if (event.target.classList.contains('control')) {

    if (event.target.classList.contains('edit')) switchControlVisibility();

    if (event.target.classList.contains('train')) trainOnce();

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

async function train(times) {
  const fit = await trainModel(models[models.length - 1], times);
  document.querySelector('.loss span').textContent = fit.history.loss[fit.history.loss.length - 1].toFixed(2);
  document.querySelector('.epochs span').textContent = +document.querySelector('.epochs span').textContent + fit.epoch[fit.epoch.length - 1] + 1;
  reDrawGUI();
  return;
}

async function trainOnce() {
  const outputs = layersPerceptons[layersPerceptons.length - 1];
  const fit = await trainModelOnce(models[models.length - 1], inputInit, outputs);
  document.querySelector('.loss span').textContent = fit.history.loss[fit.history.loss.length - 1].toFixed(2);
  reDrawGUI();
}

function saveLocal() {
  models.forEach(async (model, index) => await model.save(`localstorage://model-${index}`));
}

async function loadLocal() {
  models = [];
  let index = 0;
  while (await !!localStorage.getItem(`tensorflowjs_models/model-${index}/info`)) {
    const model = await tf.loadModel(`localstorage://model-${index}`);
    compile(model);
    models.push(model);
    index++;
  }
  reDrawGUI();
}

function saveFiles() {
  models.forEach(async (model, index) => await model.save(`downloads://model-${index}`));
}

function loadFiles() {
  const filesElement = document.getElementById('files');
  filesElement.click();
  filesElement.onchange = async () => {
    const files = filesElement.files;
    models = [];
    let index = 0;
    while (index < files.length) {
      const model = await tf.loadModel(tf.io.browserFiles([files[index], files[index + 1]]));
      compile(model);
      models.push(model);
      index += 2;
    }
    reDrawGUI();
  };
}


function switchInput(element, index) {
  element.addEventListener('click', () => {
    element.textContent = Math.abs(+element.textContent - 1);
    inputInit[index] = +element.textContent;
    reDrawGUI();
  });
}

function switchOutput(element, index) {
  element.addEventListener('click', () => {
    element.textContent = Math.abs(+element.textContent - 1);
    layersPerceptons[layersPerceptons.length - 1][index].textContent = +element.textContent;
  });
}