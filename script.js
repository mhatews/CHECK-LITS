
const boxModels = [

    { id: 'alcaBox', label: 'Caixas Alça' },
    { id: 'balaBox', label: 'Caixas Bala' },
    { id: 'bilheteriaBox', label: 'Caixas Bilheteria' },
    { id: 'bisBox', label: 'Caixas Bis' },
    { id: 'cartolaBox', label: 'Caixas Cartola' },
    { id: 'casinhaBox', label: 'Caixas Casinha' },
    { id: 'cestinhaBox', label: 'Caixas Cestinha' },
    { id: 'cpipocaBox', label: 'Caixas C. Pipoca' },
    { id: 'coneBox', label: 'Caixas Cone' },
    { id: 'coneCanudo', label: 'Caixas Canudo' },
    { id: 'cuboBox', label: 'Caixas Cubo' },
    { id: 'encaixeBox', label: 'Caixas Encaixe' },
    { id: 'GiraBox', label: 'Caixas Gira' },
    { id: 'maletaBox', label: 'Caixas Maleta' },
    { id: 'meiabalaBox', label: 'Caixas Meia Bala' },
    { id: 'milkBox', label: 'Caixas Milk' },
    { id: 'picadeiroBox', label: 'Caixas Picadeiro' },
    { id: 'regadorBox', label: 'Caixas Regador' },
    { id: 'sacolaBox', label: 'Caixas Sacola' },
    { id: 'sushiBox', label: 'Caixas Sushi' },
    { id: 'tendaBox', label: 'Caixas Tenda' },
    { id: 'tremBox', label: 'Caixas Trem' },
    { id: 'vagaoBox', label: 'Caixas Vagão' }

    
];


document.addEventListener('DOMContentLoaded', function() {
    const boxModelSelect = document.getElementById('boxModel');

    // Gerar as opções para o select
    boxModels.forEach(model => {
        const option = document.createElement('option');
        option.value = model.id;
        option.textContent = model.label;
        boxModelSelect.appendChild(option);
    });

    document.getElementById('addBoxModel').addEventListener('click', function() {
        const selectedModelId = boxModelSelect.value;
        const selectedModel = boxModels.find(model => model.id === selectedModelId);
        const quantity = document.getElementById('boxQuantity').value;

        // Verificar se o modelo já foi adicionado
        const existingItem = document.querySelector(`#selectedBoxModels p[data-model-id="${selectedModelId}"]`);

        if (quantity > 0) {
            if (existingItem) {
                // Atualizar a quantidade do modelo existente
                existingItem.textContent = `${selectedModel.label}: ${quantity}`;
                existingItem.dataset.quantity = quantity;
            } else {
                // Adicionar um novo modelo
                const selectedBoxModelsContainer = document.getElementById('selectedBoxModels');
                const item = document.createElement('p');
                item.textContent = `${selectedModel.label}: ${quantity}`;
                item.dataset.modelId = selectedModel.id;
                item.dataset.quantity = quantity;
                selectedBoxModelsContainer.appendChild(item);
            }
        }
    });
});

document.getElementById('checklistForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const clientName = document.getElementById('clientName').value;
    const childName = document.getElementById('childName').value;
    const deliveryDate = document.getElementById('deliveryDate').value;
    const theme = document.getElementById('theme').value;
    const accountType = document.getElementById('accountType').value;

    let output = `
        <h2>Checklist de Pedido</h2>
        <p><strong>Nome da Cliente:</strong> ${clientName}</p>
        <p><strong>Nome da Criança:</strong> ${childName}</p>
        <p><strong>Data de Envio:</strong> ${deliveryDate}</p>
        <p><strong>Tema:</strong> ${theme}</p>
        <p><strong>Tipo de Conta:</strong> ${accountType}</p>
        <p><strong>Caixas:</strong></p>
        <ul>
    `;

    document.querySelectorAll('#selectedBoxModels p').forEach(item => {
        output += `<li>${item.textContent}</li>`;
    });

    output += '</ul>';

    document.getElementById('output').innerHTML = output;
});

document.getElementById('downloadPDF').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Obter os valores do formulário
    const clientName = document.getElementById('clientName').value;
    const childName = document.getElementById('childName').value;
    const deliveryDate = document.getElementById('deliveryDate').value;
    const theme = document.getElementById('theme').value;
    const accountType = document.getElementById('accountType').value;

    // Definir metadados
    doc.setProperties({
        title: 'Checklist de Pedido - ' + clientName,
        subject: 'Checklist de Pedido',
        author: 'Sua Loja',
        keywords: 'checklist, pedido, aniversário',
        creator: 'Seu Nome ou Empresa'
    });

    // Adicionar título
    doc.setFontSize(22);
    doc.setTextColor(40, 55, 71);
    doc.text('Checklist de Pedido', 10, 20);

    // Adicionar informações do pedido
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`Nome da Cliente: ${clientName}`, 10, 30);
    doc.text(`Nome da Criança: ${childName}`, 10, 40);
    doc.text(`Data de Envio: ${deliveryDate}`, 10, 50);
    doc.text(`Tema: ${theme}`, 10, 60);
    doc.text(`Tipo de Conta: ${accountType}`, 10, 70);

    // Adicionar linha para separar seção de caixas
    doc.setDrawColor(200, 0, 0);
    doc.line(10, 75, 200, 75);

    // Adicionar lista de caixas
    doc.setFontSize(14);
    doc.text('Caixas:', 10, 85);
    let yOffset = 95;
    document.querySelectorAll('#selectedBoxModels p').forEach(item => {
        doc.setFontSize(12);
        doc.text(item.textContent, 10, yOffset);
        yOffset += 10;
    });

    // Salvar PDF com nome personalizado
    const sanitizedClientName = clientName.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitizar nome para evitar caracteres inválidos
    const sanitizedDeliveryDate = deliveryDate.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitizar data para evitar caracteres inválidos
    doc.save(`${sanitizedClientName}_${sanitizedDeliveryDate}_checklist.pdf`);
});