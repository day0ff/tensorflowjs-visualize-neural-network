function initializeModel(layers_size) {
  let layers = [], outputs = [], models = [];
  for (let index = 0; index < layers_size.length; index++) {
    layers[index] = setHiddenLayer(layers_size[index].units, layers_size[index].activation);
    if (index === 0) layers[0] = setInputLayer(layers_size[index].units);
    if (index === layers_size.length - 1) layers[index] = setOutputLayer(layers_size[index].units, layers_size[index].activation);
    if (index !== 0) {
      if (index - 1 === 0) outputs[index - 1] = layers[index].apply(layers[index - 1]);
      else outputs[index - 1] = layers[index].apply(outputs[index - 2]);
    }
  }

  const model = tf.model({inputs: layers[0], outputs: outputs[outputs.length - 1]});
  compile(model);
  for (let index = 0; index < outputs.length; index++) {
    if (index < outputs.length - 1) {
      models[index] = tf.model({inputs: model.input, outputs: model.layers[index + 1].output});
    }
    else {
      models[index] = model;
    }
  }
  return models;
}

function setInputLayer(units) {
  return tf.input({shape: [units]});
}

function setHiddenLayer(units, activation) {
  return tf.layers.dense({units: units, activation: activation});
}

function setOutputLayer(units, activation) {
  return tf.layers.dense({units: units, activation: activation});
}

function compile(model){
  const optimizer = tf.train.adam(0.2);
  const loss = tf.losses.meanSquaredError;
  model.compile({optimizer: optimizer, loss: loss});
}

function predict(model) {
  const tensor = tf.tensor2d([inputInit]);
  const predict = model.predict(tensor).dataSync();
  tensor.dispose();
  return predict;
}

async function trainModel(model, times = 1) {
  const inputTensors = tf.tensor2d([[1, 1], [1, 0], [0, 1], [0, 0]]);
  const outputTensors = tf.tensor2d([[1], [0], [0], [1]]);
  const fit = await model.fit(inputTensors, outputTensors, {
    batchSize: 4,
    epochs: times,
    shuffle: true
  });
  inputTensors.dispose();
  outputTensors.dispose();
  return fit;
}

async function trainModelOnce(model, inputs, outputs) {
  const inputTensors = tf.tensor2d([inputs]);
  const outputTensors = tf.tensor2d([outputs.map(output => +output.textContent)]);
  const fit = await model.fit(inputTensors, outputTensors);
  inputTensors.dispose();
  outputTensors.dispose();
  return fit;
}
