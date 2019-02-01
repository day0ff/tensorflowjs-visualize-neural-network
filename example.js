async function predictOutput() {
  console.time('execution time :: ');
  const inputs = tf.tensor2d([[0, 0], [0, 1], [1, 0], [1, 1]]);
  const outputs = tf.tensor2d([[1], [0], [0], [1]]);

  inputs.print();
  outputs.print();

  const input = tf.input({shape: [2]});

  const hiddenLayer = tf.layers.dense({units: 4, activation: 'tanh'});
  const outputLayer = tf.layers.dense({units: 1, activation: 'sigmoid'});

  const outputHiddenLayer = hiddenLayer.apply(input);
  const output = outputLayer.apply(outputHiddenLayer);

  const model = tf.model({inputs: input, outputs: output});

  const optimizer = tf.train.adam(0.5);
  const loss = tf.losses.meanSquaredError;

  model.compile({optimizer: optimizer, loss: loss});

  // // console.log(inputLayer.getWeights()[0].dataSync());
  // console.log(hiddenLayer.getWeights()[0].dataSync());
  // console.log(outputLayer.getWeights()[0].dataSync());

  const fit = await model.fit(inputs, outputs, {
    batchSize: 4,
    epochs: 12,
    shuffle: true
  });

  console.log(model.layers);
  console.log('input layer');
  console.log(model.layers[0]);
  console.log(model.layers[1]);
  console.log(model.layers[2]);
  console.log(model.layers[3]);

  // console.log(hiddenLayer.getWeights()[0].dataSync());
  // console.log(model.layers[1].getWeights()[0].dataSync());
  // console.log(outputLayer.getWeights()[0].dataSync());
  // console.log(model.layers[2].getWeights()[0].dataSync());

  console.log(fit);
  console.log(fit.history.loss.pop());

  model.predict(inputs).print();

  const newModel = tf.model({inputs: model.input, outputs: model.layers[2].output});

  newModel.predict(inputs).print();

  console.log('numTensors (outside tidy): ' + tf.memory().numTensors);
  console.timeEnd('execution time :: ');
}

predictOutput();
