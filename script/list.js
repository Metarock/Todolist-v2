//jshint esversion:6

document.getElementById("editListOption").addEventListener("click", () => {    
    $('#listOptions').modal('hide');    
});

$('#editlistTitle').on('shown.bs.modal', () => {
    const editModal = document.querySelector("#editlistTitle");
    editModal.querySelector("input[name='newTitle']").focus();        
});


document.getElementById("addNewListOption").addEventListener("click", () => {
    $('#lists').modal('hide');
});

$('#createNewList').on('shown.bs.modal', () => {
    const editModal = document.querySelector("#createNewList");
    editModal.querySelector("input[name='newListName']").focus();        
});

let items = document.querySelectorAll("div.item p");
items.forEach(item => {
    item.addEventListener("click", () => {
        //const itemName = item.querySelector("input[name='itemName']").value;
        const itemId = item.nextElementSibling.querySelector("input[name='itemId']").value;
        const listTile = document.querySelector("h1").textContent;
        $('#editItem').modal('show'); 
        $('#editItem').on('shown.bs.modal', () => {
            const editModal = document.querySelector("#editItem");
            editModal.querySelector("input[name='itemName']").focus();      
            editModal.querySelector("input[name='itemId']").value = itemId;
            editModal.querySelector("input[name='listTile']").value = listTile;
        });
    });
         
});