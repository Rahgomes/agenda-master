(function(){

    //user interface
    var ui = {

        fields:document.querySelectorAll("input"),
        button:document.querySelector(".pure-button"),
        table:document.querySelector("table tbody")

    };

    //actions
    var validateFields = function(e){
        e.preventDefault();//preveniu a ação padrão. Executa antes o js para depois ir ao evento do link
        var errors = 0; //qtd de erros que ocorreram no programa
        var contact = {};

        ui.fields.forEach(function(field, index, list){
            if(field.value.trim().length === 0) { //trim para arrancar os espaços
                field.classList.add("error");//adiciona uma classe no campo
                errors +=1; //atribuindo um erro ao que já possui a cada vez que retornar um erro
            } else {
                field.classList.remove("error");
                contact[field.id] = field.value.trim();
            }
        });

        if(errors > 0) {
            document.querySelector(".error").focus();//focus coloca o primeiro elemento com o .error e da um focus
        }else {
            addContact(contact);
        }

        // if(addContact(contact) === true){
        //     fields.clear();
        // }

        // console.log(errors, contact);
    };
    var addContact = function(contact){
        var endpoint = "http://localhost:4000/schedule" //falar onde ta o endereço de onde está o backend
        var config = {
            method:"POST",
            body:JSON.stringify(contact), //pega o contato js e o stringify transforma em texto. para post e put sempre envia o body
            headers: new Headers({ //headers - camada de autorização (token), método de se identificar 
                "Content-type":"application/json"
            }) 
        };

        fetch(endpoint, config)//then mapeia todas as rotas que deram certo, catch para mapeamentos que deram errado
        .then(cleanFields)
        .then(getContacts)
        .catch(genericError);
    };

    var cleanFields = function(){//limpa os campos de input
        ui.fields.forEach((field)=>{ //arrow function (substituição de function anonima do ES6)
            field.value = "";
        });
    };

    // var cleanFields = () => ui.fields.forEach(field => field.value = ""); Arrow function do cleanFields

    var genericError = function(){//tratamento se houver erro
        debugger;
    };

    var getContacts = function(){
        var endpoint = "http://localhost:4000/schedule" //falar onde ta o endereço de onde está o backend
        var config = {
            method:"GET",
            headers: new Headers({
                "Content-type":"application/json"
            }) 
        };

        fetch(endpoint, config)//then mapeia todas as rotas que deram certo, catch para mapeamentos que deram errado
        .then(function(response){return response.json()}) //apenas para method GET. Transforma de json para objeto
        .then(getContactsSuccess) //chegaram os dados dos contatos
        .catch(genericError);
    };

    var getContactsSuccess = function(contacts){
        var tableRows = [];

        contacts.forEach(function(contact){
            tableRows.push(`
                <tr>
                    <td>${contact.id}</td>
                    <td>${contact.name}</td>
                    <td>${contact.email}</td>
                    <td>${contact.phone}</td>
                    <td><a href="#" data-id="${contact.id}" data-action="delete">Excluir</a></td>
                </tr>
            `);
        });

        if(contacts.length === 0){
            tableRows.push(`
            <tr>
            <td colspan="5">Não existem dados registrados!</td>
          </tr>
        `);
        }
        
        // console.log(tableRows.join(""));
        ui.table.innerHTML = tableRows.join("");
    };

    var confirmRemove = function(e){
        // console.log("click",e.target.dataset);
        // console.log("click",e.target.dataset); Para retornar todos os datas que tem dentro do seletor
        e.preventDefault();
        if(e.target.dataset.action === "delete" && confirm("Deseja excluir o item " + e.target.dataset.id + " ?")){
            removeContact(e.target.dataset.id);
        }
    };

    var removeContact = function(id){
        var endpoint = "http://localhost:4000/schedule/" + id;
        var config = {
            method:"DELETE",
            headers: new Headers({
                "Content-type":"application/json"
            }) 
        };

        fetch(endpoint, config)
        .then(getContacts)
        .catch(genericError);
    };

    var init = function(){
        //add events
        ui.button.onclick = validateFields;
        ui.table.onclick = confirmRemove;
        getContacts();

    }();//() > função imediata < ao final da função faz com que ele inicie automaticamente

    // console.log(ui);

})();
