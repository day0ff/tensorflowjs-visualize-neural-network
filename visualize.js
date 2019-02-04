function column(layer, index) {
  const column = document.createElement('div');
  column.classList.add('column');
  column.setAttribute('index', index);
  column.appendChild(control('remove'));
  if (layer) column.appendChild(layer);
  column.appendChild(control('add'));
  return column;
}

function control(type) {
  const control = document.createElement('div');
  control.classList.add('control');
  control.classList.add('perceptron');
  control.classList.add(type);
  control.textContent = (type === 'add') ? '+' : '-';
  return control;
}

function layer(perceptrons, type) {
  const layer = document.createElement('div');
  layer.classList.add('layer');
  if (type) layer.classList.add(type);
  if (type === 'input' || type === 'output') perceptrons.forEach(perceptron => perceptron.textContent = Math.round(perceptron.textContent));
  perceptrons.forEach(perceptron => layer.appendChild(perceptron));
  return layer;
}

function createPerceptrons(count,) {
  let perceptrons = new Array(count);
  for (let index = 0; index < count; index++) {
    perceptrons[index] = perceptron();
  }
  return perceptrons;
}

function perceptron() {
  const perceptron = document.createElement('div');
  perceptron.classList.add('perceptron');
  return perceptron;
}

function setPerceptronCondition(perceptron, predict, bias, weights, optimizer) {
  perceptron.textContent = predict.toFixed(2);
  perceptron.style.backgroundColor = rgb(predict);
  if (weights) {
    let weight = weights ? Array.from(weights).map((weight, index) => `${weight.toFixed(2)}W${index}`).join(' + ') : '';
    perceptron.title = `${optimizer} ( ${weight} + ${bias.toFixed(2)}B ) = ${predict.toFixed(2)}P`;
  } else {
    perceptron.title = `${predict} `
  }
}

function createLines(elements1, elements2) {
  let lines = [];
  for (let index = 0; index < elements1.length * elements2.length; index++) {
    lines.push(line(elements1[parseInt(`${index / elements2.length}`)], elements2[index % elements2.length]));
  }
  return lines;
}

function line(element1, element2) {
  const border = +getComputedStyle(element1).borderWidth.replace('px', '');
  const radius = +getComputedStyle(element1).width.replace('px', '');
  const x1 = element1.getBoundingClientRect().left;
  const y1 = element1.getBoundingClientRect().top;
  const x2 = element2.getBoundingClientRect().left;
  const y2 = element2.getBoundingClientRect().top;
  const length = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2) - radius - 4 * border;
  const deg = Math.atan2((y1 - y2), (x1 - x2)) * 180 / Math.PI;
  const line = document.createElement('div');
  line.classList.add('line');
  line.style.width = length + 'px';
  line.style.left = (x1 + x2 + radius - length) / 2 + 'px';
  line.style.top = (y1 + y2 + radius) / 2 + 'px';
  line.style.transform = `rotate(${deg}deg)`;
  return line;
}

function setLineCondition(line, weight) {
  line.title = `weight: ${weight ? weight : 'undefinde'}`;
  line.style.borderColor = weight ? rgb(weight) : 'black';
}

function rgb(value) {
  if (value > 2) return `rgb(0, 0, 0)`;
  if (value > 1) return `rgb(0, ${510 - 255 * value}, 0)`;
  if (value > 0) return `rgb( ${255 - 255 * value}, 255, 0)`;
  if (value === 0) return `rgb(255, 255, 0)`;
  if (value < -2) return `rgb(0, 0, 0)`;
  if (value < -1) return `rgb(${510 + 255 * value}, 0, 0)`;
  if (value < 0) return `rgb(255, ${255 + 255 * value}, 0)`;
}

