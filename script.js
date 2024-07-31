
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
    { id: 'vagaoBox', label: 'Caixas Vagão' },
    { id: 'visorBox', label: 'Caixas Visor' },
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

    // Adicionar cabeçalho com informações da empresa e logo
    doc.addImage('logo.png', 'PNG', 10, 10, 30, 30); // Supondo que a logo seja um arquivo 'logo.png' na mesma pasta
    doc.setFontSize(16);
    doc.text('Studio Cantinho da Nana', 50, 20);
    doc.setFontSize(12);
    doc.text('Rua Aristides Alves de Oliveira, 94', 50, 30);
    doc.text('São Pedro da União MG 37855 - 000', 50, 35);
    doc.text('WHATS: (35) 99903 - 2302', 50, 40);

    // Adicionar linha para separar cabeçalho do conteúdo
    doc.setDrawColor(200, 0, 0);
    doc.line(10, 50, 200, 50);

    // Adicionar título
    doc.setFontSize(22);
    doc.setTextColor(40, 55, 71);
    doc.text('Checklist de Pedido', 10, 60);

    // Adicionar informações do pedido
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`Nome da Cliente: ${clientName}`, 10, 70);
    doc.text(`Nome da Criança: ${childName}`, 10, 80);
    doc.text(`Data de Envio: ${deliveryDate}`, 10, 90);
    doc.text(`Tema: ${theme}`, 10, 100);
    doc.text(`Tipo de Conta: ${accountType}`, 10, 110);

    // Adicionar linha para separar seção de caixas
    doc.setDrawColor(200, 0, 0);
    doc.line(10, 115, 200, 115);

    // Adicionar lista de caixas em uma tabela
    doc.setFontSize(14);
    doc.text('Caixas:', 10, 125);
    let yOffset = 135;
    doc.autoTable({
        startY: yOffset,
        head: [['Modelo de Caixa', 'Quantidade', 'Conferido', 'OK']],
        body: Array.from(document.querySelectorAll('#selectedBoxModels p')).map(item => [
            item.textContent.split(': ')[0],
            item.textContent.split(': ')[1],
            ' ',
            ' '
        ]),
        theme: 'grid',
    });

    // Salvar PDF com nome personalizado
    const sanitizedClientName = clientName.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitizar nome para evitar caracteres inválidos
    const sanitizedDeliveryDate = deliveryDate.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitizar data para evitar caracteres inválidos
    doc.save(`${sanitizedClientName}_${sanitizedDeliveryDate}_checklist.pdf`);
});