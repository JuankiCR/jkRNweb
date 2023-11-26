# Tomato or Apple | JuankiCR
## Description.
This project provides a platform to interact with the model of a convolutional neural network provided by [Jose07Rdz](https://github.com/Jose07Rdz), the model was exported and an API was created to interact with the model.

## How it works.
the platform allows to upload an image, the image is converted into a two-dimensional 32x32 array, the values of each pixel of the image is averaged and normalized between values from 0 to 1.

```js
const imgHeight = 32;
const imgWidth = 32;
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
```

Then the array is sent to the API, processed and returns a result like the following.

```js
{
    res_text: "Tomato!"
    res_value: 0.6134877800941467
}

```

The way to interpret this result is the closer the neural network is to 0.5 the better it is sure if it is an apple or a tomato, the closer it is to zero the more sure it is a tomato and the closer it is to 1 the more sure it is an apple.

## Resources.
- [model.json](https://rn-team4-7b.juankicr.dev/assets/model/model.json)
- [group1-shard1of2.bin](https://rn-team4-7b.juankicr.dev/assets/model/group1-shard1of2.bin)
- [group1-shard2of2.bin](https://rn-team4-7b.juankicr.dev/assets/model/group1-shard2of2.bin)
