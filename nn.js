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
  const optimizer = tf.train.adam(0.5);
  const loss = tf.losses.meanSquaredError;

  const model = tf.model({inputs: layers[0], outputs: outputs[outputs.length - 1]});
  model.compile({optimizer: optimizer, loss: loss});
  for (let index = 0; index < outputs.length; index++) {
    models[index] = tf.model({inputs: model.input, outputs: model.layers[index + 1].output});
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

