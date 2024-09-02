const newField = `
  <div class="field">
    <p>Names:</p>
    <input class="input" type="text" name="key" placeholder="Names" required>
    <p>Amount:</p>
    <input class="input" type="number" step="0.01" name="value" placeholder="Amount" required>
  </div>
`;

function addField() {
  const container = document.getElementById('fieldsContainer');
  const fieldDiv = document.createElement('div');
  fieldDiv.classList.add('field');
  fieldDiv.innerHTML = newField + `<button class="button" type="button" onclick="removeField(this)">Delete</button>`;

  container.appendChild(fieldDiv);
}

function removeField(button) {
  const fieldDiv = button.parentElement;
  fieldDiv.remove();
}

document.getElementById('inputForm').addEventListener('submit', function (event) {
  event.preventDefault();

  let formData = new FormData(event.target);
  let data = {};

  let keys = [];
  let values = [];

  for (let [name, value] of formData.entries()) {
    if (name === 'key') {
      keys.push(value);
    } else if (name === 'value') {
      values.push(value);
    }
  }

  if (keys.length === values.length) {
    for (let i = 0; i < keys.length; i++) {
      data[keys[i]] = parseFloat(values[i]);
    }

    function sortObjectKeysAndValues(obj) {
      const entries = Object.entries(obj);
      const sortedEntries = entries.sort(([, valueA], [, valueB]) => valueB - valueA);

      const keys = sortedEntries.map(([key]) => key.toString());
      const values = sortedEntries.map(([, value]) => value);

      return [keys, values];
    }

    let sortedData = sortObjectKeysAndValues(data);
    const dataKeys = sortedData[0];
    const dataValues = sortedData[1];
    const uniqueDataValues = new Set(dataValues);

    if (uniqueDataValues.size !== dataValues.length) {
      alert(`The amounts must difer. Please check your data and try entering again.`);
    } else {
      const resultObject = {};
      const lastValue = dataValues[dataValues.length - 1];
      const totalTipsTitle = document.createElement("h2");

      totalTipsTitle.textContent = `Total tip: ${dataValues[0]}`;
      document.body.appendChild(totalTipsTitle);

      for (let i = 0; i < dataKeys.length; i++) {
        const names = dataKeys[i].split(/[, \s]+/).filter(str => /\w+/.test(str));
        const namesLength = names.length;

        for (let ii = 0; ii < namesLength; ii++) {
          let currentTipAmount = lastValue;
          const nextValue = dataValues[i + 1];

          if (nextValue) {
            currentTipAmount = dataValues[i] - nextValue;
          }

          const tipAmount = currentTipAmount / namesLength;
          const isKeyExist = resultObject[names[ii]];

          if (isKeyExist) {
            resultObject[names[ii]] += tipAmount;
          } else {
            resultObject[names[ii]] = tipAmount;
          }
        }
      }

      for (let key in resultObject) {
        const resultParagraph = document.createElement("p");
        resultParagraph.textContent = `${key}: ${resultObject[key]}`;
        document.body.appendChild(resultParagraph);
        event.target.reset();
      }
    }
  }
});
