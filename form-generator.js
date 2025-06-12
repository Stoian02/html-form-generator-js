function generateForm() {
    const jsonText = document.getElementById('json_input').value;
    let schema;

    try {
        schema = JSON.parse(jsonText);
    } catch (e) {
        alert('Invalid JSON');
        return;
    }

    const container = document.getElementById('form_container');
    container.innerHTML = '';
    container.appendChild(renderSchema(schema));
}

function renderSchema(schema, prefix = '') {
    const fragment = document.createDocumentFragment();

    for (const key in schema) {
        const field = schema[key];
        const name = prefix ? `${prefix}[${key}]` : key;
        const labelText = field.label || capitalize(key);
        const hintText = field.hint;

        if (field.type === 'schema') {
            const fieldset = document.createElement('fieldset');
            const legend = document.createElement('legend');
            legend.textContent = capitalize(key);
            fieldset.appendChild(legend);
            fieldset.appendChild(renderSchema(field.schema, name));
            fragment.appendChild(fieldset);
            continue;
        }

        const wrapper = document.createElement('div');

        const label = document.createElement('label');
        label.setAttribute('for', name);
        label.textContent = labelText;
        wrapper.appendChild(label);

        let input;

        if (field.type === 'select') {
            input = document.createElement('select');
            input.name = name;
            input.id = name;

            if (field.placeholder) {
                const placeholderOption = document.createElement('option');
                placeholderOption.value = '';
                placeholderOption.textContent = field.placeholder;
                input.appendChild(placeholderOption);
            }

            (field.options || []).forEach(([val, text]) => {
                const option = document.createElement('option');
                option.value = val;
                option.textContent = text;
                input.appendChild(option);
            });

        } else if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.name = name;
            input.id = name;

        } else {
            input = document.createElement('input');
            input.type = field.type || 'text';
            input.name = name;
            input.id = name;
        }

        // Apply extra attributes
        for (const attr in field) {
            if (!['type', 'label', 'hint', 'options', 'placeholder', 'schema'].includes(attr)) {
                input.setAttribute(attr, field[attr]);
            }
        }

        wrapper.appendChild(input);

        if (hintText) {
            const hint = document.createElement('div');
            hint.textContent = hintText;
            wrapper.appendChild(hint);
        }

        fragment.appendChild(wrapper);
    }

    return fragment;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
