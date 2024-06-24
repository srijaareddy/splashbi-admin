let currentProject = null;

function openModal(project) {
    currentProject = project;
    document.getElementById('modalTitle').textContent = project ? 'Edit Document' : 'Create Document';

    if (project) {
        document.getElementById('documentName').value = project.documentName;
        document.getElementById('categoryName').value = project.categoryName;
        document.getElementById('previousFileName').textContent = `Previously uploaded file: ${project.uploadDocument}`;        
        document.getElementById('enableDisable').checked = project.enableDisable === 'Enabled';
        document.getElementById('rowIndex').value = project.rowIndex;
    } else {
        document.forms['documentForm'].reset();
        document.getElementById('previousFileName').textContent = '';

        document.getElementById('rowIndex').value = '';
    }
    
    var modal = new bootstrap.Modal(document.getElementById('GFG'), {
        keyboard: false
    });
    modal.show();
}

function closeModal() {
    currentProject = null;
    var modal = bootstrap.Modal.getInstance(document.getElementById('GFG'));
    modal.hide();
}



function validateForm() {
    let x = document.forms["documentForm"]["documentName"].value;
    let categoryName = document.forms["documentForm"]["categoryName"].value;
    let uploadDocument = document.forms["documentForm"]["uploadDocument"].files[0];
    if (x == "") {
        alert("**Document Name must be filled");
        return false;
    }
    if (categoryName == "") {
        alert("**Category Name must be selected");
        return false;
    }
    if (!uploadDocument && !currentProject) {
        alert("**A document must be uploaded");
        return false;
    }

    return true;
}






document.getElementById('savebutton').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form submission

    if (!validateForm()) {
        return;
    }

    // Get form values
    const documentName = document.getElementById('documentName').value;
    const categoryName = document.getElementById('categoryName').value;
    const uploadDocument = document.getElementById('uploadDocument').files[0] ? document.getElementById('uploadDocument').files[0].name : '';
    const enableDisable = document.getElementById('enableDisable').checked ? 'Enabled' : 'Disabled';
    const rowIndex = document.getElementById('rowIndex').value;


    if (rowIndex === "") {
        const tableRow = document.createElement('tr');

        const checkboxCell = document.createElement('td');
        checkboxCell.innerHTML = '<input type="checkbox" class="rowCheckbox" onclick="toggleDeleteButton()">';
        tableRow.appendChild(checkboxCell);


    const documentNameCell = document.createElement('td');
    documentNameCell.textContent = documentName;
    tableRow.appendChild(documentNameCell);

    const categoryNameCell = document.createElement('td');
    categoryNameCell.textContent = categoryName;
    tableRow.appendChild(categoryNameCell);

    const uploadDocumentCell = document.createElement('td');
    uploadDocumentCell.textContent = uploadDocument;
    tableRow.appendChild(uploadDocumentCell);

    const enableDisableCell = document.createElement('td');
    const enableDisableSwitch = document.createElement('input');
    enableDisableSwitch.type = 'checkbox';
    enableDisableSwitch.checked = enableDisable === 'Enabled';
    enableDisableSwitch.className = 'form-check-input';
    enableDisableSwitch.onclick = function () { toggleEnableDisable(this); };
    enableDisableCell.appendChild(enableDisableSwitch);    
    tableRow.appendChild(enableDisableCell);

    const actionsCell = document.createElement('td');
    actionsCell.innerHTML = enableDisable === 'Enabled' ?
        `<button class="btn btn-warning btn-sm me-2" onclick="editDocument(this)">Edit</button>
         <button class="btn btn-danger btn-sm" onclick="deleteDocument(this)">Delete</button>` :
        `<button class="btn btn-secondary btn-sm me-2" disabled>Edit</button>
         <button class="btn btn-secondary btn-sm" disabled>Delete</button>`;
    tableRow.appendChild(actionsCell);


    document.querySelector('#dataTable tbody').appendChild(tableRow);
} else {
    // Edit existing row
    const table = document.getElementById('dataTable');
    const row = table.rows[rowIndex];
    row.cells[1].textContent = documentName;
    row.cells[2].textContent = categoryName;
    row.cells[3].textContent = uploadDocument;
    row.cells[4].firstChild.checked = enableDisable === 'Enabled';

    const actionsCell = table.rows[rowIndex].cells[5];
    actionsCell.innerHTML = enableDisable === 'Enabled' ?
        `<button class="btn btn-warning btn-sm me-2" onclick="editDocument(this)">Edit</button>
         <button class="btn btn-danger btn-sm" onclick="deleteDocument(this)">Delete</button>` :
        `<button class="btn btn-secondary btn-sm me-2" disabled>Edit</button>
         <button class="btn btn-secondary btn-sm" disabled>Delete</button>`;
    }

    // document.querySelector('#dataTable tbody').appendChild(tableRow);


    document.getElementById('dataContainer').style.display = 'block';
    closeModal();
    document.forms['documentForm'].reset();


});

function editDocument(button) {
    const row = button.parentNode.parentNode;
    const documentName = row.cells[1].textContent;
    const categoryName = row.cells[2].textContent;
    const uploadDocument = row.cells[3].textContent;
    const enableDisable = row.cells[4].firstChild.checked ? 'Enabled' : 'Disabled';

    openModal({
        documentName,
        categoryName,
        uploadDocument,
        enableDisable,
        rowIndex: row.rowIndex
    });
}

function deleteDocument(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);

    const table = document.getElementById('dataTable');
    if (table.rows.length === 1) {
        document.getElementById('dataContainer').style.display = 'none';
    }
    toggleDeleteButton();

}


function selectAllRows(checkbox) {
    const checkboxes = document.querySelectorAll('.rowCheckbox');
    checkboxes.forEach(cb => cb.checked = checkbox.checked);
    toggleDeleteButton();
}

function toggleDeleteButton() {
    const checkboxes = document.querySelectorAll('.rowCheckbox:checked');
    document.getElementById('deleteSelectedButton').disabled = checkboxes.length === 0;
}

function deleteSelectedRows() {
    const checkboxes = document.querySelectorAll('.rowCheckbox:checked');
    checkboxes.forEach(cb => cb.parentNode.parentNode.remove());

    const table = document.getElementById('dataTable');
    if (table.rows.length === 1) {
        document.getElementById('dataContainer').style.display = 'none';
    }
    toggleDeleteButton();
}

function toggleEnableDisable(checkbox) {
    const row = checkbox.parentNode.parentNode;
    const actionsCell = row.cells[5];
    if (checkbox.checked) {
        actionsCell.innerHTML = `
            <button class="btn btn-warning btn-sm me-2" onclick="editDocument(this)">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteDocument(this)">Delete</button>`;
    } else {
        actionsCell.innerHTML = `
            <button class="btn btn-secondary btn-sm me-2" disabled>Edit</button>
            <button class="btn btn-secondary btn-sm" disabled>Delete</button>`;
    }
}
