function addField() {
  const container = document.getElementById('fieldsContainer');
  const fieldDiv = document.createElement('div');
  fieldDiv.classList.add('field');
  fieldDiv.innerHTML = `
    <div class="field">
      <p>Names:</p>
      <input class="input" type="text" name="key" placeholder="Names" required>
      <p>Amount:</p>
      <input class="input" type="number" name="value" placeholder="Amount" required>
    </div>
  `;

  container.appendChild(fieldDiv);
}

function removeField(button) {
  const fieldDiv = button.parentElement;
  fieldDiv.remove();
}

document.getElementById('inputForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = {};

  const keys = [];
  const values = [];

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

    console.log(data);

    event.target.reset();
    document.getElementById('fieldsContainer').innerHTML = `
      <div class="field">
        <p>Names:</p>
        <input class="input" type="text" name="key" placeholder="Names" required>
        <p>Amount:</p>
        <input class="input" type="number" name="value" placeholder="Amount" required>
      </div>
    `;

    const sortObjectByValueDesc = (obj) => {
      return Object.fromEntries(
        Object.entries(obj).sort(([, valueA], [, valueB]) => valueB - valueA)
      );
    }


    const sortedData = sortObjectByValueDesc(data);
    const dataKeys = Object.keys(sortedData);
    const dataValues = Object.values(sortedData);

    const lastValue = dataValues[dataValues.length - 1];

    const totalTipsTitle = document.createElement("h2");

    totalTipsTitle.textContent = `Total tip: ${dataValues[0]}`;
    document.body.appendChild(totalTipsTitle);

    for (let i = 0; i < dataKeys.length; i++) {
      const names = dataKeys[i].split(/[, \s]+/);
      const namesLength = names.length;

      for (let ii = 0; ii < namesLength; ii++) {
        let currentTipAmount = lastValue;
        const nextValue = dataValues[i + 1];

        if (nextValue) {
          currentTipAmount = dataValues[i] - nextValue;
        }

        const tipAmount = currentTipAmount / namesLength;
        const resultParagraph = document.createElement("p");

        resultParagraph.textContent = `${names[ii]}: ${tipAmount}`;
        document.body.appendChild(resultParagraph);
      }
    }
  }
});
