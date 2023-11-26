document.getElementById('uploadInput').addEventListener('change', handleImage);

let normalizedArray = [];
const imgHeight = 32;
const imgWidth = 32;
const resultadoWrapper = document.getElementById('resultadoWrapper');
const porcentajeWrapper = document.getElementById('percentageWrapper');

function handleImage(e) {
  resetAnimation();
  const canvas = document.getElementById('outputCanvas');
  const ctx = canvas.getContext('2d', {willReadFrequently: true, imageSmoothingEnabled: true, imageSmoothingQuality: 'high'});

  const img = new Image();

  img.onload = function () {
    ctx.drawImage(img, 0, 0, 200, 200);
    const imageData = ctx.getImageData(0, 0, imgWidth, imgHeight);
    const data = imageData.data;

    normalizedArray = [];

    for (let y = 0; y < imgHeight; y++) {
      let row = [];
      for (let x = 0; x < imgWidth; x++) {
        const dataIndex = (y * imgWidth + x) * 4;
        const grayscale = (data[dataIndex] + data[dataIndex + 1] + data[dataIndex + 2]) / 3;
        const normalizedValue = grayscale / 255;

        row.push(normalizedValue);
      }
      normalizedArray.push(row);
    }

    ctx.putImageData(imageData, 0, 0);
    sendToAPI(normalizedArray);
  };

  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

function sendToAPI(data) {
  const apiUrl = 'https://rn-api.juankicr.dev/tomateorapple';
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ img_normalized: data }),
  };

  fetch(apiUrl, requestOptions)
    .then(response => response.json())
    .then(data => {
      console.log('Respuesta de la API:', data);
      porcentajeMzn = Math.round((1 - data.res_value) * 100);
      startAnim(porcentajeMzn);
      porcentajeWrapper.innerHTML = `Manzana: ${porcentajeMzn}% <=> Jitomate: ${100 - porcentajeMzn}%.`
      resultadoWrapper.innerHTML = data.res_text;
      resultadoWrapper.classList.remove(data.res_text == 'Tomato!' ? 'Apple' : 'Tomato');
      resultadoWrapper.classList.add(data.res_text == 'Tomato!' ? 'Tomato' : 'Apple');
    })
    .catch(error => console.error('Error al enviar a la API:', error));
}

const startAnim = (porcentajeRespuesta) => {
  const cantidadElementos = 100;
  const elementos = document.querySelectorAll('.animationElement');

  elementos.forEach((elemento, index) => {
    const angulo = Math.random() * 360;
    const distancia = Math.floor(Math.random() * ((2001 - 1500) / 100)) * 100 + 1500;

    const radianes = (angulo * Math.PI) / 180;
    const translateX = Math.cos(radianes) * distancia;
    const translateY = Math.sin(radianes) * distancia;

    elemento.style.setProperty('--translate-x', `calc(-50% + ${translateX}px)`);
    elemento.style.setProperty('--translate-y', `calc(-50% + ${translateY}px)`);


    let segundos = Math.floor(Math.random() * 4) + 2;
    elemento.style.animation = `explodeAnimation ${segundos}s ease-out forwards`;

    if (index < (porcentajeRespuesta / 100) * cantidadElementos) {
      elemento.innerHTML = "🍏";
    } else {
      elemento.innerHTML = "🍅";
    }
  });
};

const resetAnimation = () => {
  const elementos = document.querySelectorAll('.animationElement');

  elementos.forEach((elemento) => {
    elemento.style.animation = 'none'; // Detener la animación actual
    setTimeout(() => {
      elemento.style.setProperty('--translate-x', '0');
      elemento.style.setProperty('--translate-y', '0');
    }, 0);
  });
};